CREATE TABLE "diagram_versions" (
	"id" varchar(128),
	"diagram_id" varchar(128) NOT NULL,
	"sql" text NOT NULL,
	"nodes" json NOT NULL,
	"edges" json NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "diagrams" (
	"id" varchar(128),
	"user_id" varchar(256) NOT NULL,
	"name" varchar(256) NOT NULL,
	"sql" text NOT NULL,
	"nodes" json NOT NULL,
	"edges" json NOT NULL,
	"settings" json NOT NULL,
	"is_public" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "teams" DROP CONSTRAINT "teams_stripe_customer_id_unique";--> statement-breakpoint
ALTER TABLE "teams" DROP CONSTRAINT "teams_stripe_subscription_id_unique";--> statement-breakpoint
ALTER TABLE "teams" ALTER COLUMN "plan_name" SET DEFAULT 'Free';--> statement-breakpoint
ALTER TABLE "teams" ALTER COLUMN "subscription_status" SET DEFAULT 'active';--> statement-breakpoint
ALTER TABLE "teams" ADD COLUMN "razorpay_customer_id" text;--> statement-breakpoint
ALTER TABLE "teams" ADD COLUMN "razorpay_subscription_id" text;--> statement-breakpoint
ALTER TABLE "teams" ADD COLUMN "razorpay_plan_id" text;--> statement-breakpoint
ALTER TABLE "teams" DROP COLUMN "stripe_customer_id";--> statement-breakpoint
ALTER TABLE "teams" DROP COLUMN "stripe_subscription_id";--> statement-breakpoint
ALTER TABLE "teams" DROP COLUMN "stripe_product_id";--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_razorpay_customer_id_unique" UNIQUE("razorpay_customer_id");--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_razorpay_subscription_id_unique" UNIQUE("razorpay_subscription_id");