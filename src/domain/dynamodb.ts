import * as AWS from "aws-sdk";
export const getDynamoClient = () => {
  if (process.env.IS_OFFLINE) {
    return new AWS.DynamoDB.DocumentClient({
      region: "localhost",
      endpoint: "http://localhost:8000",
    });
  } else {
    return new AWS.DynamoDB.DocumentClient();
  }
};  
