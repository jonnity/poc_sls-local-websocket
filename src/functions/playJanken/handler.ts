import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { getDynamoClient } from "src/domain/dynamodb";
import schema from "./schema";
const judgeJanken = (a: number, b: number) => {
  var c = (a - b + 3) % 3;
  if (c === 0) return "draw";
  if (c === 2) return "win";
  return "lose";
};

const playJanken: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event, context) => {
  console.log("Received event:", JSON.stringify(event, null, 2));
  console.log("Received context:", JSON.stringify(context, null, 2));

  const dynamodb = getDynamoClient();
  const date = new Date();
  const unixtime = Math.floor(date.getTime() / 1000);

  const hand = ["rock", "scissors", "paper"];
  const player_name = event.queryStringParameters.name;
  const player_hand = event.queryStringParameters.hand;
  const player = hand.indexOf(player_hand);
  const computer = Math.floor(Math.random() * 3);
  const judge = judgeJanken(player, computer);

  try {
    await dynamodb.send(
      new PutItemCommand({
        TableName: "jankens",
        Item: {
          player: { S: player_name },
          unixtime: { N: unixtime.toString() },
          player_hand: { S: player_hand },
          computer_hand: { S: hand[computer] },
          judge: { S: judge },
        },
      })
    );
    return formatJSONResponse(200, {
      result: {
        player: player_hand,
        computer: hand[computer],
        unixtime: unixtime,
        judge: judge,
      },
    });
  } catch (err) {
    console.error(err);
    return formatJSONResponse(500, { message: "PutItem Error" });
  }
};

export const main = middyfy(playJanken);
