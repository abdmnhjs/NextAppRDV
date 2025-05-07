"use client";

import { useRouter } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { CalendarClientForm } from "@/components/CalendarClientForm";

type WeekDay =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

type AvailabilityType = {
  day: WeekDay;
  startHour: number;
  startMinutes: number;
  endHour: number;
  endMinutes: number;
};

export default function ConsultantPage({
  params,
}: {
  params: Promise<{ consultantUsername: string }>;
}) {
  const router = useRouter();
  const [decodedUsername, setDecodedUsername] = useState<string>("");
  const [availabilities, setAvailabilities] = useState<AvailabilityType[]>([]);

  useEffect(() => {
    params.then((unwrappedParams) => {
      const username = decodeURIComponent(unwrappedParams.consultantUsername);
      setDecodedUsername(username);
    });
  }, [params]);

  useEffect(() => {
    const fetchAvailabilities = async () => {
      try {
        const response = await fetch(
          `/api/availabilities?username=${encodeURIComponent(decodedUsername)}`
        );
        const data = await response.json();
        setAvailabilities(data);
      } catch (error) {
        console.error("Failed to fetch availabilities:", error);
      }
    };

    if (decodedUsername) {
      fetchAvailabilities();
    }
  }, [decodedUsername]);

  const handleBackClick = () => {
    router.push("/client");
  };

  const days = availabilities.map((availability) => availability.day);
  const durations = availabilities.map((availability) => ({
    startHour: availability.startHour,
    startMinutes: availability.startMinutes,
    endHour: availability.endHour,
    endMinutes: availability.endMinutes,
  }));

  return (
    <div>
      <div className="absolute top-4 right-4">
        <LogoutButton>Sign out</LogoutButton>
      </div>

      <div className="absolute top-4 left-4">
        <Button
          variant="outline"
          onClick={handleBackClick}
          className="cursor-pointer bg-white text-black hover:bg-gray-200/90"
        >
          Back
        </Button>
      </div>

      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <h1 className="text-2xl text-white font-bold">
            Consultant : {decodedUsername}
          </h1>
          <CalendarClientForm days={days} durations={durations} />
        </div>
      </div>
    </div>
  );
}
