import type { ValidatedAPIGatewayHandler } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

import schema from "./schema";

const hello: ValidatedAPIGatewayHandler<typeof schema> = async (event, _context) => {
  return formatJSONResponse(200, {
    message: `Hello ${event.body.name}, welcome to the exciting Serverless world!`,
    event,
  });
};

export const main = middyfy(hello);
