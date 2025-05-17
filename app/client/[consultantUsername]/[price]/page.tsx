"use client";

import { useEffect, useState, use } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);

type PaymentFormProps = {
  consultantUsername: string;
};

function PaymentForm({ consultantUsername }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success?consultantUsername=${consultantUsername}`,
      },
    });

    if (error) {
      setError(error.message ?? "An error occurred");
      setLoading(false);
    }
    // La redirection se fera automatiquement en cas de succès
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || loading}
        className="mt-4 w-full bg-blue-500 text-white p-2 rounded"
      >
        {loading ? "Processing..." : "Pay"}
      </button>
      {error && <div className="mt-2 text-red-500">{error}</div>}
    </form>
  );
}

export default function CheckoutForm({
  params,
}: {
  params: Promise<{ consultantUsername: string; price: string }>;
}) {
  const [clientSecret, setClientSecret] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Unwrap params using React.use()
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
        // Access price from selectedDuration
        const price = Number(parsedData.selectedDuration.price);

        if (isNaN(price) || price <= 0) {
          throw new Error(`Invalid price: ${price}`);
        }

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
