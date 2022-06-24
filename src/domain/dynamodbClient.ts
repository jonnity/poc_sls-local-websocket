require("dotenv").config();
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export const getDynamodbClient = () => {
  if (process.env.IS_OFFLINE) {
    return new DynamoDBClient({
      region: "localhost",
      credentials: { accessKeyId: "hoge", secretAccessKey: "hoge" },
      endpoint: `http://${process.env.DYNAMODB_HOST}:8000`,
    });
  } else {
    return new DynamoDBClient({});
  }
};
