import type { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import type { FromSchema } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, "body"> & {
  body: FromSchema<S>;
};
export type ValidatedEventAPIGatewayProxyEvent<S> = (
  event: ValidatedAPIGatewayProxyEvent<S>,
  context: Context
) => Promise<APIGatewayProxyResult>;
// export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<
//   ValidatedAPIGatewayProxyEvent<S>,
//   APIGatewayProxyResult
// >;

export const formatJSONResponse = (status: number, response: Record<string, unknown>) => {
  return {
    statusCode: status,
    body: JSON.stringify(response),
  };
};
