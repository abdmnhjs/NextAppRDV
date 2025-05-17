"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function PaymentSuccess() {
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const consultantUsername = searchParams.get("consultantUsername");

  useEffect(() => {
    const createAppointment = async () => {
      try {
        // Verify consultant username
        if (!consultantUsername) {
          throw new Error("Missing consultant username");
        }

        // Get stored data
        const pendingData = sessionStorage.getItem("pendingData");
        if (!pendingData) {
          throw new Error("No pending appointment data found");
        }

        // Parse and validate data
        const parsedData = JSON.parse(pendingData);
        console.log("Parsed pending data:", parsedData);

        // Validate required fields
        if (!parsedData.selectedDuration?.availabilityId || !parsedData.date) {
          console.error("Invalid stored data:", parsedData);
          throw new Error("Missing required appointment data");
        }

        // Get client username
        const clientUsername = sessionStorage.getItem("clientUsername");
        if (!clientUsername) {
          throw new Error("No client username found");
        }

        // Create appointment
        const response = await fetch("/api/appointments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            consultantUsername,
            clientUsername,
            availabilityId: parsedData.selectedDuration.availabilityId,
            date: parsedData.date,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || `Server error: ${response.status}`);
        }

        // Success! Clean up and redirect
        sessionStorage.removeItem("pendingData");
        router.push(`/client/${consultantUsername}`);
      } catch (error) {
        console.error("Appointment creation error:", {
          error: error instanceof Error ? error.message : "Unknown error",
          storedData: sessionStorage.getItem("pendingData"),
        });
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      }
    };

    createAppointment();
  }, [consultantUsername, router]);

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-500">Error: {error}</div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
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
