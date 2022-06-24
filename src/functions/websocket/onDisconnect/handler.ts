import { DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import type { APIGatewayHandler } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { getDynamodbClient } from "@domain/dynamodbClient";

const onDisconnect: APIGatewayHandler = async (event, context) => {
  console.log("Received event:", JSON.stringify(event, null, 2));
  console.log("Received context:", JSON.stringify(context, null, 2));

  const dynamodb = getDynamodbClient();
  try {
    await dynamodb.send(
      new DeleteItemCommand({
        TableName: "connections",
        Key: {
          connectionId: { S: event.requestContext.connectionId },
        },
      })
    );
    return formatJSONResponse(200, {
      success: true,
    });
  } catch (err) {
    console.error(err);
    return formatJSONResponse(500, { message: "onDisconnect Error" });
  }
};

export const main = middyfy(onDisconnect);
