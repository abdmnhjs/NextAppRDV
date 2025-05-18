"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LogoutButton from "./LogoutButton";
import { Button } from "./ui/button";

type Props = {
  username: string;
};

type Consultant = {
  username: string;
  id: number;
};

export default function HomeClient({ username }: Props) {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        const response = await fetch("/api/consultants");
        const data = await response.json();
        setConsultants(data);
      } catch (error) {
        console.error("Failed to fetch consultants: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConsultants();
  }, []);

  const handleConsultantClick = (consultant: Consultant) => {
    sessionStorage.setItem("clientUsername", username);
    router.push(`/client/${consultant.username}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Logout in top right */}
      <div className="absolute top-4 right-4">
        <LogoutButton>Sign out</LogoutButton>
      </div>
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <h1 className="text-2xl text-white font-bold">
            Welcome {username} to your client space!
          </h1>
          <p className="text-xl text-white font-bold">
            Choose your consultant!
          </p>

          {consultants.map((consultant, index) => (
            <Button
              key={index}
              className="cursor-pointer bg-white text-black hover:bg-gray-200/90"
              onClick={() => handleConsultantClick(consultant)}
            >
              {consultant.username}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
