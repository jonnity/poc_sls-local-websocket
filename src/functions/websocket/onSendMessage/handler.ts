import { DeleteItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";

import { getApigwManagementApi } from "@domain/getApigwManagementApi";
import { getDynamodbClient } from "@domain/dynamodbClient";
import type { APIGatewayHandler } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { WebsocketResponse } from "@domain/WebsocketResponse";

const onSendMessage: APIGatewayHandler = async (event, context) => {
  console.log("Received event:", JSON.stringify(event, null, 2));
  console.log("Received context:", JSON.stringify(context, null, 2));

  const dynamodb = getDynamodbClient();
  try {
    const connectionData = await dynamodb.send(
      new ScanCommand({
        TableName: "connections",
        ProjectionExpression: "connectionId",
      })
    );

    const apigwManagementApi = getApigwManagementApi(event.requestContext.domainName, event.requestContext.stage);
    const bodyJson = JSON.parse(event.body);
    const response = WebsocketResponse.of("sendmessage", { message: bodyJson.message });
    connectionData.Items.forEach(async ({ connectionId }) => {
      try {
        await apigwManagementApi.postToConnection({ ConnectionId: connectionId.S, Data: response.sendingMessage() });
      } catch (e) {
        if (e.statusCode === 410) {
          console.log(`Found stale connection, deleting ${connectionId}`);
          await dynamodb.send(new DeleteItemCommand({ TableName: "connections", Key: { connectionId } }));
        } else {
          throw e;
        }
      }
    });

    return formatJSONResponse(200, { success: true });
  } catch (err) {
    console.error(err);
    return formatJSONResponse(500, { message: "sendMessage Error" });
  }
};

export const main = middyfy(onSendMessage);
