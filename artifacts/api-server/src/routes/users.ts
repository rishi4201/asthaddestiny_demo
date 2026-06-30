import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

router.get("/users/me", async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.clerkUserId, userId));
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json(user);
  } catch (err) {
    req.log.error({ err }, "Error fetching user profile");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/users/me", async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const { name, avatarUrl, email } = req.body;

  try {
    const existing = await db.select().from(usersTable).where(eq(usersTable.clerkUserId, userId));

    if (existing.length === 0) {
      const [created] = await db.insert(usersTable).values({
        clerkUserId: userId,
        email: email || "",
        name: name || null,
        avatarUrl: avatarUrl || null,
      }).returning();
      return res.json(created);
    } else {
      const [updated] = await db.update(usersTable)
        .set({ name: name || existing[0].name, avatarUrl: avatarUrl || existing[0].avatarUrl, updatedAt: new Date() })
        .where(eq(usersTable.clerkUserId, userId))
        .returning();
      return res.json(updated);
    }
  } catch (err) {
    req.log.error({ err }, "Error upserting user profile");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
