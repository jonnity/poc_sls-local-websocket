import type { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import type { FromSchema } from "json-schema-to-ts";

// for http
type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, "body"> & {
  body: FromSchema<S>;
};
export type ValidatedAPIGatewayHandler<S> = (
  event: ValidatedAPIGatewayProxyEvent<S>,
  context: Context
) => Promise<APIGatewayProxyResult>;

// for websocket
export type APIGatewayHandler = (event: APIGatewayProxyEvent, context: Context) => Promise<APIGatewayProxyResult>;

export const formatJSONResponse = (status: number, response: Record<string, unknown>) => {
  return {
    statusCode: status,
    body: JSON.stringify(response),
  };
};
