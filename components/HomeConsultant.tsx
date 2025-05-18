"use client";

import { useState, useEffect } from "react";
import LogoutButton from "@/components/LogoutButton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AvailabilityPicker } from "@/components/AvailabilityPicker";
import { DialogTitle } from "@radix-ui/react-dialog";
import { format } from "date-fns";
import { Appointment, Availability } from "@/app/types/types";

interface Props {
  username: string;
  id: number;
}

export default function HomeConsultant({ username, id }: Props) {
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [bookedAppointments, setBookedAppointments] = useState<
    Record<number, Appointment>
  >({});

  useEffect(() => {
    const fetchAvailabilities = async () => {
      try {
        const response = await fetch(`/api/availabilities?id=${id}`);
        const data = await response.json();
        setAvailabilities(data);

        const bookedAvailabilities = data.filter(
          (item: Availability) => item.booked
        );

        for (const availability of bookedAvailabilities) {
          const appointment = await getBookedBy(availability);
          if (appointment) {
            setBookedAppointments((prev) => ({
              ...prev,
              [availability.id]: appointment,
            }));
          }
        }
      } catch (error) {
        console.error("Failed to fetch availabilities:", error);
      }
    };

    fetchAvailabilities();
  }, [id]);

  const handleAddAvailability = async (
    newAvailability: Omit<Availability, "id" | "booked">
  ) => {
    try {
      const response = await fetch("/api/availabilities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          availability: {
            ...newAvailability,
            booked: false,
            includePayment: newAvailability.includePayment ?? false,
            price: newAvailability.price ?? 0,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${
            errorData?.message || "Unknown error"
          }`
        );
      }

      const data = await response.json();
      setAvailabilities((prev) => [...prev, data]);
      setIsDialogOpen(false);
    } catch (error) {
      alert(
        `Failed to add availability: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const handleDeleteAvailability = async (availability: Availability) => {
    try {
      console.log("Attempting to delete availability:", availability);

      const response = await fetch("/api/availabilities", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          availability: {
            id: availability.id,
            day: availability.day,
            startHour: availability.startHour,
            startMinutes: availability.startMinutes,
            endHour: availability.endHour,
            endMinutes: availability.endMinutes,
            booked: availability.booked,
            includePayment: availability.includePayment,
          },
        }),
      });

      const data = await response.json();
      console.log("Response from server:", data);

      if (!response.ok) {
        const errorMessage =
          data.error || data.details || "Failed to delete availability";
        console.error("Server error:", errorMessage);
        throw new Error(errorMessage);
      }

      setAvailabilities((prev) =>
        prev.filter((item) => item.id !== availability.id)
      );
      if (availability.booked) {
        setBookedAppointments((prev) => {
          const newState = { ...prev };
          delete newState[availability.id];
          return newState;
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      alert(`Failed to delete availability: ${errorMessage}`);
    }
  };

  const getBookedBy = async (
    availability: Availability
  ): Promise<Appointment | null> => {
    try {
      const response = await fetch(`/api/appointments`);
      const data = await response.json();
      const appointment = data.find(
        (app: Appointment) => app.availabilityId === availability.id
      );

      return appointment || null;
    } catch (error) {
      console.error("Failed to fetch appointment:", error);
      return null;
    }
  };

  return (
    <div>
      {/* Logout en haut à droite */}
      <div className="absolute top-4 right-4">
        <LogoutButton>Sign out</LogoutButton>
      </div>

      {/* Contenu principal */}
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <h1 className="text-2xl text-white font-bold">
            Welcome {username} to your consultant space!
          </h1>

          {/* Bouton & Modale */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="cursor-pointer bg-white text-black hover:bg-gray-200/90">
                Add an availability
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white rounded-xl p-6 max-w-md">
              <DialogTitle className="font-bold">
                You have the choice!
              </DialogTitle>
              <AvailabilityPicker onSubmit={handleAddAvailability} />
            </DialogContent>
          </Dialog>

          {/* Liste des disponibilités */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {availabilities.map((item, index) => (
              <div key={index} className="text-white bg-black p-4 rounded-lg">
                <p>
                  <strong>
                    {item.day}
                    {item.includePayment ? (
                      <span> ({item.price}€)</span>
                    ) : (
                      <span> (Free)</span>
                    )}
                  </strong>
                </p>
                <p>
                  {item.startHour ?? 0}h
                  {String(item.startMinutes ?? 0).padStart(2, "0")} -{" "}
                  {item.endHour ?? 0}h
                  {String(item.endMinutes ?? 0).padStart(2, "0")}
                </p>
                <Button
                  className="cursor-pointer bg-gray-500 text-white hover:bg-red-300/90 flex items-center justify-center m-2"
                  onClick={() => handleDeleteAvailability(item)}
                >
                  Delete
                </Button>
                {item.booked && bookedAppointments[item.id] && (
                  <div className="mt-2 p-2 bg-gray-800 rounded-md">
                    <p className="text-sm text-gray-300">
                      <span className="font-semibold">Client:</span>{" "}
                      {bookedAppointments[item.id]?.clientUsername}
                    </p>
                    <p className="text-sm text-gray-300">
                      <span className="font-semibold">Date:</span>{" "}
                      {bookedAppointments[item.id]?.date &&
                        format(
                          new Date(bookedAppointments[item.id].date),
                          "dd/MM/yyyy"
                        )}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
