import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";

type PaymentFormProps = {
  consultantUsername: string;
};

export default function PaymentForm({ consultantUsername }: PaymentFormProps) {
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
