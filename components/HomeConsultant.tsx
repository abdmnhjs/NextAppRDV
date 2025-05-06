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
  day: WeekDay;
  startHour: number;
  startMinutes: number;
  endHour: number;
  endMinutes: number;
};

export default function HomeConsultant({ username, id }: Props) {
  const [availabilities, setAvailabilities] = useState<AvailabilityType[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchAvailabilities = async () => {
      try {
        const response = await fetch(`/api/availabilities?id=${id}`);
        const data = await response.json();
        setAvailabilities(data);
      } catch (error) {
        console.error("Failed to fetch availabilities:", error);
      }
    };

    fetchAvailabilities();
  }, [id]);

  const handleAddAvailability = async (newAvailability: AvailabilityType) => {
    try {
      const response = await fetch("/api/availabilities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, availability: newAvailability }),
      });
      const data = await response.json();
      setAvailabilities((prev) => [...prev, data]);
      setIsDialogOpen(false); // Close the modal
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
    } catch (error) {
      console.error("Failed to delete availability:", error);
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
