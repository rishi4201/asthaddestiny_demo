import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.post("/payments/create-intent", async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const { amount, currency } = req.body;

  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return res.status(400).json({ error: "Stripe not configured. Please connect Stripe integration." });
    }

    const { default: Stripe } = await import("stripe");
    const stripe = new Stripe(stripeSecretKey);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount || 4900,
      currency: currency || "usd",
      metadata: { clerkUserId: userId },
    });

    return res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    req.log.error({ err }, "Error creating payment intent");
    return res.status(500).json({ error: "Payment processing error" });
  }
});

router.get("/payments/status", async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.clerkUserId, userId));
    return res.json({
      hasPaidReport: user?.hasPaidReport || false,
      paidAt: user?.paidAt?.toISOString() || null,
    });
  } catch (err) {
    req.log.error({ err }, "Error fetching payment status");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
