import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const teasersTable = pgTable("teasers", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  sunSign: text("sun_sign").notNull(),
  moonSign: text("moon_sign").notNull(),
  ascendant: text("ascendant").notNull(),
  teaserText: text("teaser_text").notNull(),
  element: text("element"),
  luckyNumber: integer("lucky_number"),
  generatedAt: timestamp("generated_at").notNull().defaultNow(),
});

export const insertTeaserSchema = createInsertSchema(teasersTable).omit({ id: true, generatedAt: true });
export type InsertTeaser = z.infer<typeof insertTeaserSchema>;
export type Teaser = typeof teasersTable.$inferSelect;
