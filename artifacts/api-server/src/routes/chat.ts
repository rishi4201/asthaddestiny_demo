import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db, chatMessagesTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";

const router = Router();

router.get("/chats/messages", async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  try {
    const messages = await db.select().from(chatMessagesTable)
      .where(eq(chatMessagesTable.userId, userId))
      .orderBy(asc(chatMessagesTable.createdAt));
    return res.json(messages);
  } catch (err) {
    req.log.error({ err }, "Error fetching chat messages");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/chats/messages", async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const { content, imageKey } = req.body;
  if (!content) return res.status(400).json({ error: "Content is required" });
  try {
    const imageUrl = imageKey ? `/api/storage/objects/${imageKey}` : null;
    const [message] = await db.insert(chatMessagesTable).values({
      userId,
      role: "user",
      content,
      imageUrl,
      imageKey: imageKey || null,
    }).returning();
    return res.status(201).json(message);
  } catch (err) {
    req.log.error({ err }, "Error sending chat message");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/chats/messages/:id", async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const id = parseInt(req.params.id, 10);
  try {
    await db.delete(chatMessagesTable)
      .where(eq(chatMessagesTable.id, id));
    return res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Error deleting chat message");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
