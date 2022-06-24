import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import type { APIGatewayHandler } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { getDynamodbClient } from "@domain/dynamodbClient";

const onConnect: APIGatewayHandler = async (event, context) => {
  console.log("Received event:", JSON.stringify(event, null, 2));
  console.log("Received context:", JSON.stringify(context, null, 2));

  const dynamodb = getDynamodbClient();
  try {
    await dynamodb.send(
      new PutItemCommand({
        TableName: "connections",
        Item: {
          connectionId: { S: event.requestContext.connectionId },
        },
      })
    );
    return formatJSONResponse(200, {
      success: true,
    });
  } catch (err) {
    console.error(err);
    return formatJSONResponse(500, { message: "onConnect Error" });
  }
};

export const main = middyfy(onConnect);
