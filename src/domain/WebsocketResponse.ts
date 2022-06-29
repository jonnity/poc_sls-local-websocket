import { TextEncoder } from "util";

export class WebsocketResponse {
  private constructor(private readonly action: string, private readonly data?: { [key: string]: string }) {}
  static of(action: string, data?: { [key: string]: string }) {
    return new WebsocketResponse(action, data);
  }
  sendingMessage() {
    const encoder = new TextEncoder();
    if (this.action === "pong") {
      return encoder.encode(JSON.stringify("pong"));
    }
    return encoder.encode(JSON.stringify({ action: this.action, data: this.data }));
  }
}
