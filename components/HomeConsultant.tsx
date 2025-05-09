"use client";

import { useState, useEffect } from "react";
import LogoutButton from "@/components/LogoutButton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AvailabilityPicker } from "@/components/AvailabilityPicker";
import { DialogTitle } from "@radix-ui/react-dialog";

interface Props {
  username: string;
  id: number;
}

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
};

type AppointmentType = {
  id: number;
  consultantUsername: string;
  clientUsername: string;
  availabilityId: number;
};

export default function HomeConsultant({ username, id }: Props) {
  const [availabilities, setAvailabilities] = useState<AvailabilityType[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [bookedAppointments, setBookedAppointments] = useState<
    Record<number, AppointmentType>
  >({});

  useEffect(() => {
    const fetchAvailabilities = async () => {
      try {
        const response = await fetch(`/api/availabilities?id=${id}`);
        const data = await response.json();
        setAvailabilities(data);

        // Fetch appointments for booked availabilities
        const bookedAvailabilities = data.filter(
          (item: AvailabilityType) => item.booked
        );
        console.log("Booked availabilities:", bookedAvailabilities); // Debug log

        for (const availability of bookedAvailabilities) {
          const appointment = await getBookedBy(availability);
          console.log("Fetched appointment:", appointment); // Debug log
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
    newAvailability: Omit<AvailabilityType, "id" | "booked">
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
          },
        }),
      });
      const data = await response.json();
      setAvailabilities((prev) => [...prev, data]);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to add availability:", error);
    }
  };

  const handleDeleteAvailability = async (availability: AvailabilityType) => {
    try {
      await fetch("/api/availabilities", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, availability }),
      });
      setAvailabilities((prev) => prev.filter((item) => item !== availability));
      // Remove from booked appointments if it was booked
      if (availability.booked) {
        setBookedAppointments((prev) => {
          const newState = { ...prev };
          delete newState[availability.id];
          return newState;
        });
      }
    } catch (error) {
      console.error("Failed to delete availability:", error);
    }
  };

  const getBookedBy = async (
    availability: AvailabilityType
  ): Promise<AppointmentType | null> => {
    try {
      const response = await fetch(`/api/appointments`);
      const data = await response.json();
      console.log("Appointment data:", data); // Debug log
      // Trouver le rendez-vous qui correspond à cette disponibilité
      const appointment = data.find(
        (app: AppointmentType) => app.availabilityId === availability.id
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
                  <strong>{item.day}</strong>
                </p>
                <p>
                  {item.startHour}h
                  {item.startMinutes.toString().padStart(2, "0")} -{" "}
                  {item.endHour}h{item.endMinutes.toString().padStart(2, "0")}
                </p>
                <Button
                  className="cursor-pointer bg-gray-500 text-white hover:bg-red-300/90 flex items-center justify-center m-2"
                  onClick={() => handleDeleteAvailability(item)}
                >
                  Delete
                </Button>
                {item.booked && bookedAppointments[item.id] && (
                  <Button className="bg-blue-500 bg-blue-500 text-white flex items-center justify-center m-2">
                    Booked by:{" "}
                    {bookedAppointments[item.id]?.clientUsername || "Unknown"}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
