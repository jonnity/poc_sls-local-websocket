export default {
  type: "object",
  properties: {
    name: { type: "string" },
    hand: { type: "number" },
  },
  required: ["name", "hand"],
} as const;
