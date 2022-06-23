import { ApiGatewayManagementApi } from "aws-sdk";
import { DeleteItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { getDynamoClient } from "@domain/dynamodb";
import schema from "./schema";

const onSendMessage: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event, context) => {
  console.log("Received event:", JSON.stringify(event, null, 2));
  console.log("Received context:", JSON.stringify(context, null, 2));

  const dynamodb = getDynamoClient();

  try {
    const connectionData = await dynamodb.send(
      new ScanCommand({
        TableName: "connections",
        ProjectionExpression: "connectionId",
      })
    );

    const apigwManagementApi = new ApiGatewayManagementApi({
      apiVersion: "2018-11-29",
      endpoint: event.requestContext.domainName + "/" + event.requestContext.stage,
    });
    const postData = event.body;

    connectionData.Items.forEach(async ({ connectionId }) => {
      try {
        await apigwManagementApi
          .postToConnection({ ConnectionId: connectionId.S, Data: postData.message }, undefined)
          .promise();
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
