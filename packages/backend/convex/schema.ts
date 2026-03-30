import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  pages: defineTable({
    content: v.optional(v.string()),
    title: v.string(),
  }),
});
