import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db, usersTable, questionnairesTable, chatMessagesTable, teasersTable } from "@workspace/db";
import { eq, desc, asc, count, sql } from "drizzle-orm";

const router = Router();

async function requireAdmin(req: any, res: any): Promise<string | null> {
  const { userId } = getAuth(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return null; }
  const [user] = await db.select().from(usersTable).where(eq(usersTable.clerkUserId, userId));
  if (!user?.isAdmin) { res.status(403).json({ error: "Forbidden" }); return null; }
  return userId;
}

router.get("/admin/stats", async (req, res) => {
  const adminId = await requireAdmin(req, res);
  if (!adminId) return;
  try {
    const [totalUsers] = await db.select({ count: count() }).from(usersTable);
    const [submitted] = await db.select({ count: count() }).from(questionnairesTable).where(eq(questionnairesTable.status, "submitted"));
    const [paid] = await db.select({ count: count() }).from(usersTable).where(eq(usersTable.hasPaidReport, true));
    const [recent] = await db.select({ count: count() }).from(usersTable).where(sql`created_at > now() - interval '7 days'`);
    return res.json({
      totalUsers: totalUsers.count,
      submittedQuestionnaires: submitted.count,
      paidUsers: paid.count,
      recentUsers: recent.count,
    });
  } catch (err) {
    req.log.error({ err }, "Error fetching admin stats");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/users", async (req, res) => {
  const adminId = await requireAdmin(req, res);
  if (!adminId) return;
  try {
    const users = await db.select().from(usersTable).orderBy(desc(usersTable.createdAt));
    const questionnaires = await db.select().from(questionnairesTable);
    const lastChats = await db.select({ userId: chatMessagesTable.userId, createdAt: sql<string>`max(${chatMessagesTable.createdAt})` })
      .from(chatMessagesTable).groupBy(chatMessagesTable.userId);

    const qMap = new Map(questionnaires.map(q => [q.userId, q.status]));
    const chatMap = new Map(lastChats.map(c => [c.userId, c.createdAt]));

    const result = users.map(u => ({
      id: u.id,
      clerkUserId: u.clerkUserId,
      email: u.email,
      name: u.name,
      hasPaidReport: u.hasPaidReport,
      questionnaireStatus: qMap.get(u.clerkUserId) || null,
      lastChatAt: chatMap.get(u.clerkUserId) || null,
      createdAt: u.createdAt.toISOString(),
    }));
    return res.json(result);
  } catch (err) {
    req.log.error({ err }, "Error fetching admin users");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/users/:userId/questionnaire", async (req, res) => {
  const adminId = await requireAdmin(req, res);
  if (!adminId) return;
  try {
    const [q] = await db.select().from(questionnairesTable).where(eq(questionnairesTable.userId, req.params.userId));
    if (!q) return res.status(404).json({ error: "Not found" });
    return res.json(q);
  } catch (err) {
    req.log.error({ err }, "Error fetching user questionnaire");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/users/:userId/chat", async (req, res) => {
  const adminId = await requireAdmin(req, res);
  if (!adminId) return;
  try {
    const messages = await db.select().from(chatMessagesTable)
      .where(eq(chatMessagesTable.userId, req.params.userId))
      .orderBy(asc(chatMessagesTable.createdAt));
    return res.json(messages);
  } catch (err) {
    req.log.error({ err }, "Error fetching user chat");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin/users/:userId/chat/reply", async (req, res) => {
  const adminId = await requireAdmin(req, res);
  if (!adminId) return;
  const { content, imageKey } = req.body;
  if (!content) return res.status(400).json({ error: "Content is required" });
  try {
    const imageUrl = imageKey ? `/api/storage/objects/${imageKey}` : null;
    const [message] = await db.insert(chatMessagesTable).values({
      userId: req.params.userId,
      role: "admin",
      content,
      imageUrl,
      imageKey: imageKey || null,
    }).returning();
    return res.status(201).json(message);
  } catch (err) {
    req.log.error({ err }, "Error sending admin reply");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
