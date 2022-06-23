import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { getDynamoClient } from "@domain/dynamodb";

const onConnect: ValidatedEventAPIGatewayProxyEvent<null> = async (event, context) => {
  console.log("Received event:", JSON.stringify(event, null, 2));
  console.log("Received context:", JSON.stringify(context, null, 2));

  const dynamodb = getDynamoClient();

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
