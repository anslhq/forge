import { analytics } from "@platform/analytics/server";
import { clerkClient } from "@platform/auth/server";
import { parseError } from "@platform/observability/error";
import { log } from "@platform/observability/log";
import type { Stripe } from "@platform/payments";
import { stripe } from "@platform/payments";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { env } from "@/env";

const getUserFromCustomerId = async (customerId: string) => {
  const clerk = await clerkClient();
  const users = await clerk.users.getUserList();

  return users.data.find(
    (currentUser) => currentUser.privateMetadata.stripeCustomerId === customerId
  );
};

const handleCheckoutSessionCompleted = async (
  data: Stripe.Checkout.Session
) => {
  if (!data.customer) {
    return;
  }

  const customerId =
    typeof data.customer === "string" ? data.customer : data.customer.id;
  const user = await getUserFromCustomerId(customerId);

  if (!user) {
    return;
  }

  analytics?.capture({
    event: "User Subscribed",
    distinctId: user.id,
  });
};

const handleSubscriptionScheduleCanceled = async (
  data: Stripe.SubscriptionSchedule
) => {
  if (!data.customer) {
    return;
  }

  const customerId =
    typeof data.customer === "string" ? data.customer : data.customer.id;
  const user = await getUserFromCustomerId(customerId);

  if (!user) {
    return;
  }

  analytics?.capture({
    event: "User Unsubscribed",
    distinctId: user.id,
  });
};

export const POST = async (request: Request): Promise<Response> => {
  if (!(stripe && env.STRIPE_WEBHOOK_SECRET)) {
    return NextResponse.json({ message: "Not configured", ok: false });
  }

  try {
    const body = await request.text();
    const headerPayload = await headers();
    const signature = headerPayload.get("stripe-signature");

    if (!signature) {
      throw new Error("missing stripe-signature header");
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case "checkout.session.completed": {
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      }
      case "subscription_schedule.canceled": {
        await handleSubscriptionScheduleCanceled(event.data.object);
        break;
      }
      default: {
        log.warn(`Unhandled event type ${event.type}`);
      }
    }

    await analytics?.shutdown();

    return NextResponse.json({ result: event, ok: true });
  } catch (error) {
    log.error(parseError(error));

    return NextResponse.json(
      {
        message: "something went wrong",
        ok: false,
      },
      { status: 500 }
    );
  }
};
