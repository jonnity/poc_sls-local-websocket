import { ScanCommand } from "@aws-sdk/client-dynamodb";
import type { ValidatedAPIGatewayHandler } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { getDynamoClient } from "src/domain/dynamodb";

const getJankenList: ValidatedAPIGatewayHandler<null> = async (event, context) => {
  console.log("Received event:", JSON.stringify(event, null, 2));
  console.log("Received context:", JSON.stringify(context, null, 2));

  const dynamodb = getDynamoClient();
  try {
    const data = await dynamodb.send(
      new ScanCommand({
        TableName: "jankens",
      })
    );
    return formatJSONResponse(200, { results: data.Items });
  } catch (err: any) {
    console.error(err);
    return formatJSONResponse(500, { message: "ScanItem Error" });
  }
};

export const main = middyfy(getJankenList);
