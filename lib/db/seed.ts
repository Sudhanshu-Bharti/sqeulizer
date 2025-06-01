import { razorpay } from "../payments/razorpay";
import { db } from "./drizzle";
import { users, teams, teamMembers } from "./schema";
import { hashPassword } from "@/lib/auth/session";
import { eq } from "drizzle-orm";

async function createRazorpayPlans() {
  console.log("Creating Razorpay plans...");

  try {
    console.log("Razorpay credentials check:", {
      keyIdExists: !!process.env.RAZORPAY_KEY_ID,
      secretExists: !!process.env.RAZORPAY_KEY_SECRET,
    });

    // First check if we can fetch existing plans
    console.log("Checking existing plans...");
    try {
      const existingPlans = await razorpay.plans.all();
      console.log("Existing plans:", existingPlans);
    } catch (error) {
      console.error("Error fetching existing plans:", error);
      if (typeof error === 'object' && error && 'statusCode' in error && error.statusCode === 400) {
        console.error(
          "Subscriptions feature may not be enabled in your Razorpay account."
        );
        console.error(
          "Please enable Subscriptions in your Razorpay Dashboard before running this script."
        );
        throw new Error("Razorpay Subscriptions feature not enabled");
      }
      throw error;
    }

    // Create free plan
    console.log("Creating free plan...");
    const freePlan = await razorpay.plans.create({
      period: "monthly",
      interval: 1,
      item: {
        name: "Free",
        description: "Free plan with basic features",
        amount: 0,
        currency: "INR",
      },
    });
    console.log("Free plan created:", freePlan.id);

    // Create paid plans
    console.log("Creating base plan...");
    const basePlan = await razorpay.plans.create({
      period: "monthly",
      interval: 1,
      item: {
        name: "Base",
        description: "Base subscription plan",
        amount: 20000, 
        currency: "INR",
      },
    });
    console.log("Base plan created:", basePlan.id);

    console.log("Creating plus plan...");
    const plusPlan = await razorpay.plans.create({
      period: "monthly",
      interval: 1,
      item: {
        name: "Plus",
        description: "Plus subscription plan",
        amount: 120000, 
        currency: "INR",
      },
    });
    console.log("Plus plan created:", plusPlan.id);

    console.log("All Razorpay plans created successfully.");
  } catch (error) {
    console.error("Error creating Razorpay plans:", error);
    throw error;
  }
}

async function seed() {
  try {
    const email = "shubham01legend@gmail.com";

    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    let user = existingUser[0];

    if (!user) {
      console.log("Creating initial user...");
      const password = "12345678";
      const passwordHash = await hashPassword(password);

      [user] = await db
        .insert(users)
        .values([
          {
            email: email,
            passwordHash: passwordHash,
            role: "owner",
          },
        ])
        .returning();

      console.log("Initial user created.");

      const [team] = await db
        .insert(teams)
        .values({
          name: "Test Team",
          planName: "Free",
          subscriptionStatus: "active",
        })
        .returning();

      await db.insert(teamMembers).values({
        teamId: team.id,
        userId: user.id,
        role: "owner",
      });
    } else {
      console.log("Initial user already exists, skipping user creation.");
    }

    await createRazorpayPlans();
  } catch (error) {
    console.error("Seed process failed:", error);
    throw error;
  }
}

seed()
  .catch((error) => {
    console.error("Seed process failed:", error);
    process.exit(1);
  })
  .finally(() => {
    console.log("Seed process finished. Exiting...");
    process.exit(0);
  });
