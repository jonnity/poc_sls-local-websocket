import { getApigwManagementApi } from "@domain/getApigwManagementApi";
import { WebsocketResponse } from "@domain/WebsocketResponse";
import type { APIGatewayHandler } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

const onConnect: APIGatewayHandler = async (event, _c) => {
  try {
    const apigwManagementApi = getApigwManagementApi(event.requestContext.domainName, event.requestContext.stage);
    const response = WebsocketResponse.of("pong");
    apigwManagementApi.postToConnection({
      ConnectionId: event.requestContext.connectionId,
      Data: response.sendingMessage(),
    });
    return formatJSONResponse(200, {
      success: true,
    });
  } catch (error) {}
};

export const main = middyfy(onConnect);
