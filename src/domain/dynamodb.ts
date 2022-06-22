import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export const getDynamoClient = () => {
  if (process.env.IS_OFFLINE) {
    return new DynamoDBClient({
      region: "localhost",
      endpoint: "http://localhost:8000",
    });
  } else {
    return new DynamoDBClient({});
  }
};
