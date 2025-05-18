"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function PaymentSuccess() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const consultantUsername = searchParams.get("consultantUsername");

  useEffect(() => {
    const createAppointment = async () => {
      try {
        if (!consultantUsername) {
          throw new Error("Missing consultant username");
        }

        const pendingData = sessionStorage.getItem("pendingData");

        if (!pendingData) {
          throw new Error("No pending appointment data found");
        }

        let parsedData;
        try {
          parsedData = JSON.parse(pendingData);
          console.log("Parsed pending data:", parsedData);

          if (!parsedData || typeof parsedData !== "object") {
            throw new Error("Invalid data structure");
          }

          if (!parsedData.selectedDuration) {
            throw new Error("Missing selectedDuration");
          }

          if (!parsedData.selectedDuration.availabilityId) {
            throw new Error("Missing availabilityId");
          }

          if (!parsedData.date) {
            throw new Error("Missing date");
          }
        } catch (parseError) {
          console.error("Parse error:", parseError);
        }

        const clientUsername = sessionStorage.getItem("clientUsername");
        if (!clientUsername) {
          throw new Error("No client username found");
        }

        const appointmentData = {
          consultantUsername,
          clientUsername,
          availabilityId: parsedData.selectedDuration.availabilityId,
          date: parsedData.date,
        };

        const response = await fetch("/api/appointments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(appointmentData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || `Server error: ${response.status}`);
        }

        sessionStorage.removeItem("pendingData");
        router.push(`/client/${consultantUsername}`);
      } catch (error) {
        console.error("Appointment creation error:", {
          error: error instanceof Error ? error.message : "Unknown error",
          rawData: sessionStorage.getItem("pendingData"),
        });
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    createAppointment();
  }, [consultantUsername, router]);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
        <p>Creating your appointment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-500 mb-4">Error: {error}</div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
      <p>Creating your appointment...</p>
    </div>
  );
}
