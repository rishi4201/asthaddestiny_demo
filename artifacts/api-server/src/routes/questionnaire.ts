import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db, questionnairesTable, teasersTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const ZODIAC_SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
const ELEMENTS = ["Fire", "Earth", "Air", "Water"];
const ASCENDANTS = ["Aries Rising", "Taurus Rising", "Gemini Rising", "Cancer Rising", "Leo Rising", "Virgo Rising", "Libra Rising", "Scorpio Rising", "Sagittarius Rising", "Capricorn Rising", "Aquarius Rising", "Pisces Rising"];

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

function generateTeaser(userId: string, q: typeof questionnairesTable.$inferSelect) {
  const sunSign = q.birthDate ? getZodiacSign(q.birthDate) : ZODIAC_SIGNS[Math.floor(Math.random() * 12)];
  const moonSign = ZODIAC_SIGNS[Math.floor(Math.random() * 12)];
  const ascendant = ASCENDANTS[Math.floor(Math.random() * 12)];
  const element = ELEMENTS[["Fire","Fire","Air","Water","Fire","Earth","Air","Water","Fire","Earth","Air","Water"].indexOf(sunSign) % 4];
  const luckyNumber = Math.floor(Math.random() * 9) + 1;

  const teaserTexts: Record<string, string> = {
    Aries: "Your chart reveals a pioneering spirit burning bright. The cosmos have aligned a rare opportunity on your horizon — one that calls for the courage only you possess.",
    Taurus: "The stars speak of deep roots and hidden abundance. Your patient nature is about to bear its most beautiful fruit yet.",
    Gemini: "Your mind is a constellation of ideas. A twin path reveals itself — the question is which door you choose to walk through.",
    Cancer: "The moon whispers of emotional transformation. Something you have quietly nurtured is ready to bloom into its full power.",
    Leo: "Your solar radiance is amplified now. The universe is staging a grand entrance — and you, dear Leo, are the main act.",
    Virgo: "Precision and intuition are converging in your chart. The details you have carefully tended are forming a magnificent whole.",
    Libra: "Balance is your gift and your journey. Venus reveals a relationship — with another or yourself — poised for beautiful evolution.",
    Scorpio: "Beneath the surface, profound alchemy is occurring. What you are transforming now will define your next seven years.",
    Sagittarius: "The archer's arrow is drawn and aligned with your truest desire. Adventure calls from an unexpected quarter of your life.",
    Capricorn: "Your mountains are beginning to speak. A long-worked ambition stands closer to summit than you dare believe.",
    Aquarius: "The future runs through you like a current. You are ahead of your time in more ways than the world has yet noticed.",
    Pisces: "Your dreams are not fantasies — they are blueprints. The veil between vision and reality is thinner now than ever before.",
  };

  const teaserText = teaserTexts[sunSign] || "The stars have much to reveal about your unique cosmic signature. A full reading awaits.";

  return { userId, sunSign, moonSign, ascendant, teaserText, element, luckyNumber };
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
    const teaserData = generateTeaser(userId, questionnaire);
    const existingTeaser = await db.select().from(teasersTable).where(eq(teasersTable.userId, userId));
    let teaser;
    if (existingTeaser.length === 0) {
      const [created] = await db.insert(teasersTable).values(teaserData).returning();
      teaser = created;
    } else {
      const [updated] = await db.update(teasersTable).set({ ...teaserData, generatedAt: new Date() }).where(eq(teasersTable.userId, userId)).returning();
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
