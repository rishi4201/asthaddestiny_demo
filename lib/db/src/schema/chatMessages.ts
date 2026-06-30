import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const chatMessagesTable = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  role: text("role").notNull().default("user"),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  imageKey: text("image_key"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertChatMessageSchema = createInsertSchema(chatMessagesTable).omit({ id: true, createdAt: true });
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessagesTable.$inferSelect;
