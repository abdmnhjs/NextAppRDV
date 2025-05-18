"use client";

import { useEffect, useState, use } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "@/components/PaymentForm";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);

export default function CheckoutForm({
  params,
}: {
  params: Promise<{ consultantUsername: string; price: string }>;
}) {
  const [clientSecret, setClientSecret] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const resolvedParams = use(params);

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      const storedData = sessionStorage.getItem("pendingData");
      if (!storedData) {
        setError("No appointment data found");
        setLoading(false);
        return;
      }

      try {
        const parsedData = JSON.parse(storedData);

        const price = Number(parsedData.selectedDuration.price);

        const amountInCents = Math.round(price * 100);

        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: amountInCents,
            consultantUsername: resolvedParams.consultantUsername,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create payment intent");
        }

        const data = await response.json();
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          throw new Error("No client secret received");
        }
      } catch (error) {
        console.error("Error details:", {
          error,
          storedData: sessionStorage.getItem("pendingData"),
        });
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentIntent();
  }, [resolvedParams.consultantUsername]);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!clientSecret) {
    return <div className="p-4">Unable to initialize payment</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: {
            theme: "stripe",
            variables: {
              colorPrimary: "#0066cc",
            },
          },
        }}
      >
        <PaymentForm consultantUsername={resolvedParams.consultantUsername} />
      </Elements>
    </div>
  );
}
