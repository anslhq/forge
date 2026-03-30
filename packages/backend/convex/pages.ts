import type { RegisteredMutation, RegisteredQuery } from "convex/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

type CreatePageArgs = {
  content?: string;
  title: string;
} & Record<string, string | undefined>;

interface PageRecord {
  _creationTime: number;
  _id: Id<"pages">;
  content?: string;
  title: string;
}

export const list: RegisteredQuery<
  "public",
  Record<string, never>,
  PageRecord[]
> = query({
  handler: async (ctx) => {
    return await ctx.db.query("pages").collect();
  },
});

export const create: RegisteredMutation<
  "public",
  CreatePageArgs,
  Id<"pages">
> = mutation({
  args: {
    content: v.optional(v.string()),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("pages", args);
  },
});
