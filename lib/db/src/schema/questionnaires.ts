import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const questionnairesTable = pgTable("questionnaires", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  currentStep: integer("current_step").notNull().default(0),
  status: text("status").notNull().default("draft"),
  birthDate: text("birth_date"),
  birthTime: text("birth_time"),
  birthCity: text("birth_city"),
  question1: text("question1"),
  question2: text("question2"),
  question3: text("question3"),
  question4: text("question4"),
  question5: text("question5"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertQuestionnaireSchema = createInsertSchema(questionnairesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertQuestionnaire = z.infer<typeof insertQuestionnaireSchema>;
export type Questionnaire = typeof questionnairesTable.$inferSelect;
