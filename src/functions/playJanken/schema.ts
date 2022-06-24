export default {
  type: "object",
  properties: {
    name: { type: "string" },
    hand: { type: "string" },
  },
  required: ["name", "hand"],
} as const;
