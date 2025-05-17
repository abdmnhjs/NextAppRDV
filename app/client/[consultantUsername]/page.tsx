"use client";

import { useRouter } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState, use } from "react";
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
  id: number;
  day: WeekDay;
  startHour: number;
  startMinutes: number;
  endHour: number;
  endMinutes: number;
  booked: boolean;
  includePayment: boolean;
  price?: number;
};

type AppointmentType = {
  date: string;
  availabilityId: number;
};

export default function ConsultantPage({
  params,
}: {
  params: Promise<{ consultantUsername: string }>;
}) {
  const router = useRouter();
  const [consultantUsername, setConsultantUsername] = useState<string>("");
  const [clientUsername, setClientUsername] = useState<string>("");
  const [availabilities, setAvailabilities] = useState<AvailabilityType[]>([]);
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);

  // Unwrap params using React.use()
  const resolvedParams = use(params);

  useEffect(() => {
    const username = decodeURIComponent(resolvedParams.consultantUsername);
    setConsultantUsername(username);

    const storedClientUsername = sessionStorage.getItem("clientUsername");
    if (storedClientUsername) {
      setClientUsername(storedClientUsername);
    }
  }, [resolvedParams.consultantUsername]);

  useEffect(() => {
    const fetchAvailabilities = async () => {
      if (!consultantUsername) return;

      try {
        const response = await fetch(
          `/api/availabilities?username=${encodeURIComponent(
            consultantUsername
          )}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch availabilities");
        }
        const data = await response.json();
        setAvailabilities(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch availabilities:", error);
        setAvailabilities([]);
      }
    };

    const fetchAppointments = async () => {
      if (!consultantUsername) return;

      try {
        const response = await fetch(
          `/api/appointments?username=${encodeURIComponent(consultantUsername)}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch appointments");
        }
        const data = await response.json();
        setAppointments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
        setAppointments([]);
      }
    };

    fetchAvailabilities();
    fetchAppointments();
  }, [consultantUsername]);

  const handleBackClick = () => {
    router.push("/client");
  };

  const durations = availabilities
    .filter((availability) => !availability.booked)
    .map((availability) => ({
      day: availability.day,
      startHour: availability.startHour,
      startMinutes: availability.startMinutes,
      endHour: availability.endHour,
      endMinutes: availability.endMinutes,
      availabilityId: availability.id,
      includePayment: availability.includePayment,
      price: availability.price,
    }));

  const availableDays = [...new Set(durations.map((duration) => duration.day))];

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
            Consultant: {consultantUsername}
          </h1>
          {clientUsername && (
            <p className="text-lg text-white">Client: {clientUsername}</p>
          )}
          {durations.length > 0 ? (
            <CalendarClientForm
              days={availableDays}
              durations={durations}
              clientUsername={clientUsername}
              consultantUsername={consultantUsername}
              appointments={appointments}
            />
          ) : (
            <p className="text-white">No available time slots.</p>
          )}
        </div>
      </div>
    </div>
  );
}
