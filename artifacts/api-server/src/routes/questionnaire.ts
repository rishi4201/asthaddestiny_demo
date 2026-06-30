import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db, questionnairesTable, teasersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const ZODIAC_SIGNS = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
const ASCENDANTS = ZODIAC_SIGNS.map(s => `${s} Rising`);
const ELEMENT_MAP: Record<string, string> = {
  Aries: "Fire", Leo: "Fire", Sagittarius: "Fire",
  Taurus: "Earth", Virgo: "Earth", Capricorn: "Earth",
  Gemini: "Air", Libra: "Air", Aquarius: "Air",
  Cancer: "Water", Scorpio: "Water", Pisces: "Water",
};

function getZodiacSign(birthDate: string): string {
  const date = new Date(birthDate);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  return "Pisces";
}

async function generateAITeaser(userId: string, q: typeof questionnairesTable.$inferSelect) {
  const sunSign = q.birthDate ? getZodiacSign(q.birthDate) : ZODIAC_SIGNS[Math.floor(Math.random() * 12)];
  const moonSign = ZODIAC_SIGNS[Math.floor(Math.random() * 12)];
  const ascendant = ASCENDANTS[Math.floor(Math.random() * 12)];
  const element = ELEMENT_MAP[sunSign] ?? "Fire";
  const luckyNumber = Math.floor(Math.random() * 9) + 1;

  const personalAnswers = [q.question1, q.question2, q.question3, q.question4, q.question5]
    .filter(Boolean)
    .map((a, i) => `Q${i + 1}: ${a}`)
    .join("\n");

  const prompt = `You are a mystical, eloquent astrologer writing a personalised cosmic teaser reading for a client.

Client's birth details:
- Date of birth: ${q.birthDate || "unknown"}
- Time of birth: ${q.birthTime || "unknown"}
- Place of birth: ${q.birthCity || "unknown"}
- Sun sign: ${sunSign}
- Moon sign: ${moonSign}
- Rising sign: ${ascendant}
- Dominant element: ${element}

Their personal answers:
${personalAnswers || "No personal answers provided yet."}

Write a teaser reading of exactly 2–3 sentences. It must:
- Feel deeply personal, as if you truly know this person
- Be mystical, poetic and intriguing — not generic horoscope filler
- End with a subtle hook that makes them want to unlock the full reading
- Use present tense, speaking directly to them ("you", "your")
- Never mention specific planets by name or use technical astrology jargon

Respond with ONLY the teaser text — no titles, no labels, no extra commentary.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
      temperature: 0.85,
    });
    const teaserText = completion.choices[0]?.message?.content?.trim() ??
      "The stars hold a profound story about your path — one that is unique and waiting to be revealed in full.";
    return { userId, sunSign, moonSign, ascendant, teaserText, element, luckyNumber };
  } catch (err) {
    const fallback = `As a ${sunSign} born in ${q.birthCity || "the cosmos"}, your chart carries a rare signature the universe seldom writes twice. A convergence of forces is building quietly around your life right now. The full picture — and what it means for your next chapter — awaits within your complete reading.`;
    return { userId, sunSign, moonSign, ascendant, teaserText: fallback, element, luckyNumber };
  }
}

const router = Router();

router.get("/questionnaire", async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  try {
    const [q] = await db.select().from(questionnairesTable).where(eq(questionnairesTable.userId, userId));
    if (!q) return res.status(404).json({ error: "Not found" });
    return res.json(q);
  } catch (err) {
    req.log.error({ err }, "Error fetching questionnaire");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/questionnaire/step", async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const { step, birthDate, birthTime, birthCity, question1, question2, question3, question4, question5 } = req.body;

  try {
    const existing = await db.select().from(questionnairesTable).where(eq(questionnairesTable.userId, userId));
    const updateData: Partial<typeof questionnairesTable.$inferInsert> = {
      currentStep: step,
      updatedAt: new Date(),
    };
    if (birthDate !== undefined) updateData.birthDate = birthDate;
    if (birthTime !== undefined) updateData.birthTime = birthTime;
    if (birthCity !== undefined) updateData.birthCity = birthCity;
    if (question1 !== undefined) updateData.question1 = question1;
    if (question2 !== undefined) updateData.question2 = question2;
    if (question3 !== undefined) updateData.question3 = question3;
    if (question4 !== undefined) updateData.question4 = question4;
    if (question5 !== undefined) updateData.question5 = question5;

    if (existing.length === 0) {
      const [created] = await db.insert(questionnairesTable).values({
        userId,
        currentStep: step,
        birthDate: birthDate || null,
        birthTime: birthTime || null,
        birthCity: birthCity || null,
        question1: question1 || null,
        question2: question2 || null,
        question3: question3 || null,
        question4: question4 || null,
        question5: question5 || null,
      }).returning();
      return res.json(created);
    } else {
      const [updated] = await db.update(questionnairesTable)
        .set(updateData)
        .where(eq(questionnairesTable.userId, userId))
        .returning();
      return res.json(updated);
    }
  } catch (err) {
    req.log.error({ err }, "Error saving questionnaire step");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/questionnaire/submit", async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  try {
    const [q] = await db.select().from(questionnairesTable).where(eq(questionnairesTable.userId, userId));
    let questionnaire = q;
    if (!questionnaire) {
      const [created] = await db.insert(questionnairesTable).values({ userId, currentStep: 5, status: "submitted" }).returning();
      questionnaire = created;
    } else {
      const [updated] = await db.update(questionnairesTable)
        .set({ status: "submitted", updatedAt: new Date() })
        .where(eq(questionnairesTable.userId, userId))
        .returning();
      questionnaire = updated;
    }

    const teaserData = await generateAITeaser(userId, questionnaire);

    const existingTeaser = await db.select().from(teasersTable).where(eq(teasersTable.userId, userId));
    let teaser;
    if (existingTeaser.length === 0) {
      const [created] = await db.insert(teasersTable).values(teaserData).returning();
      teaser = created;
    } else {
      const [updated] = await db.update(teasersTable)
        .set({ ...teaserData, generatedAt: new Date() })
        .where(eq(teasersTable.userId, userId))
        .returning();
      teaser = updated;
    }

    return res.json({ questionnaire, teaser });
  } catch (err) {
    req.log.error({ err }, "Error submitting questionnaire");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/questionnaire/teaser", async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  try {
    const [teaser] = await db.select().from(teasersTable).where(eq(teasersTable.userId, userId));
    if (!teaser) return res.status(404).json({ error: "Questionnaire not submitted yet" });
    return res.json(teaser);
  } catch (err) {
    req.log.error({ err }, "Error fetching teaser");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
