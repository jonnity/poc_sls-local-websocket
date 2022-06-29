import { ApiGatewayManagementApi } from "@aws-sdk/client-apigatewaymanagementapi";

export const getApigwManagementApi = (domain: string, stage: string) => {
  const apigwManagementApi = new ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint: domain === "localhost" ? "http://localhost:3001" : `${domain}/${stage}`,
  });
  return apigwManagementApi;
};
