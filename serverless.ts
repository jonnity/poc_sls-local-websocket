import type { AWS } from "@serverless/typescript";

import jankensMigration from "./serverless_config/dynamodb-jankens-migration.json";
import connectionsMigration from "./serverless_config/dynamodb-connections-migration.json";
import { hello, getJankenResults, playJanken, onConnect, onDisconnect, onSendMessage } from "@functions/index";

const serverlessConfiguration: AWS = {
  service: "sls-test",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild", "serverless-dynamodb-local", "serverless-offline"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    websocketsApiRouteSelectionExpression: "$request.body.action",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
  },
  // import the function via paths
  functions: { hello, getJankenResults, playJanken, onConnect, onDisconnect, onSendMessage },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
    dynamodb: {
      stages: ["dev"],
      start: {
        port: 8000,
        noStart: true,
        inMemory: true,
        migrate: true,
        seed: true,
      },
      seed: {
        development: {
          sources: [
            {
              table: "jankens",
              sources: ["./dynamodb-jankens-migration.json"],
            },
          ],
        },
      },
    },
  },
  resources: {
    Resources: {
      JankensTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: jankensMigration,
      },
      ConnectionsTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: connectionsMigration,
      },
    },
  },
};

module.exports = serverlessConfiguration;
