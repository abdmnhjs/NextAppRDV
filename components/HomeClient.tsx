"use client";

import { useEffect, useState } from "react";
import LogoutButton from "./LogoutButton";
import { Button } from "./ui/button";
import AvailabilitiesForClientDialog from "./AvailbitiesForClientDialog";

type Props = {
  username: string;
};

type Consultant = {
  username: string;
  id: number;
};

export default function HomeClient({ username }: Props) {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        const response = await fetch("/api/consultants");
        const data = await response.json();
        setConsultants(data);
      } catch (error) {
        console.error("Failed to fetch consultants: ", error);
      }
    };

    fetchConsultants();
  }, []);

  return (
    <div>
      {/* Logout en haut à droite */}
      <div className="absolute top-4 right-4">
        <LogoutButton>Sign out</LogoutButton>
      </div>
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <h1 className="text-2xl text-white font-bold">
            Welcome {username} to your client space!
          </h1>

          {consultants.map((consultant, index) => (
            <Button
              key={index}
              onClick={() => setIsDialogOpen(true)}
              className="cursor-pointer bg-white text-black hover:bg-gray-200/90"
            >
              {consultant.username}
            </Button>
          ))}

          <AvailabilitiesForClientDialog
            username={username}
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
          />
        </div>
      </div>
    </div>
  );
}
