# sls-websocket-example

## 実行手順

前提：npm、serverless、docker-compoesが動く
↓のコマンドでオフライン実行ができるはず

1. `npm i`
2. `npm run setup`
3. `npm run dev`

## 動作確認

httpイベントのハンドラはPostmanなりなんなりで適当に
websocketは`wscat`が便利だったのでメモ

1. `npm i -g wscat`
2. `wscat -c ws://localhost:3001`
3. （コネクション状態で）`{"action": "sendmessage", "message": "任意のメッセージ"}`

で他のクライアント全員に"任意のメッセージ"が送信できる。

## 作ったときの手順

1. serverlessで`sls create sls create -t aws-nodejs-typescript -p sls-websocket-example`
2. <https://hackers-high.com/aws/dynamodb-local-development/>と<https://qiita.com/noralife/items/e36621ddd0e5b8ff4447>見てdockerで立てたdynamodbにアクセスできるAPIを設置
3. <https://dev.classmethod.jp/articles/api-gateway-websocket-serverless/>見てwebsocketのハンドラも設置
