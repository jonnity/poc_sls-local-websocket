export default {
  type: "object",
  properties: {
    message: { type: "string" },
    action: { type: "string" },
  },
  required: ["message", "action"],
} as const;
