import { NextResponse } from "next/server";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request: Request) {
  try {
    const { amount, consultantUsername } = await request.json();

    // Validate and adjust amount if necessary
    if (!amount || typeof amount !== "number") {
      return NextResponse.json(
        { error: "Invalid amount: amount must be a number" },
        { status: 400 }
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "eur",
      metadata: {
        consultantUsername,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount: amount,
    });
  } catch (error) {
    console.error("Payment intent creation error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Error creating payment intent",
      },
      { status: 500 }
    );
  }
}
