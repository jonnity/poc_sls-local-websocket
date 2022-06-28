import type { ValidatedAPIGatewayHandler } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

const corsHandler: ValidatedAPIGatewayHandler<null> = async (_e, _c) => {
  return { statusCode: 200, headers: { "Access-Control-Allow-Origin": "*" }, body: "" };
};

export const main = middyfy(corsHandler);
