import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { getDynamoClient } from "src/domain/dynamodb";

const listJankens: ValidatedEventAPIGatewayProxyEvent<null> = async (
  event,
  context
) => {
  console.log("Received event:", JSON.stringify(event, null, 2));
  console.log("Received context:", JSON.stringify(context, null, 2));

  const dynamodb = getDynamoClient();
  var params = { TableName: "jankens" };

  dynamodb.scan(params, function (err, data) {
    var response = { statusCode: null, body: null };
    if (err) {
      console.log(err);
      response.statusCode = 500;
      response.body = { code: 500, message: "ScanItem Error" };
    } else if ("Items" in data) {
      response.statusCode = 200;
      response.body = JSON.stringify({ jankens: data["Items"] });
    }
  });
  return formatJSONResponse({});
};

export const main = middyfy(listJankens);
