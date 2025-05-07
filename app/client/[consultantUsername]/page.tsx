"use client";

import { useRouter } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";

export default function ConsultantPage({
  params,
}: {
  params: Promise<{ consultantUsername: string }>;
}) {
  const router = useRouter();
  const [decodedUsername, setDecodedUsername] = useState<string>("");

  useEffect(() => {
    // Handle the promise to get the params
    params.then((unwrappedParams) => {
      // Décodage du nom d'utilisateur pour afficher correctement les espaces et caractères spéciaux
      const username = decodeURIComponent(unwrappedParams.consultantUsername);
      setDecodedUsername(username);
    });
  }, [params]);

  // Fonction pour retourner à la liste des consultants
  const handleBackClick = () => {
    router.push("/client");
  };

  return (
    <div>
      {/* Logout en haut à droite */}
      <div className="absolute top-4 right-4">
        <LogoutButton>Sign out</LogoutButton>
      </div>

      {/* Bouton de retour en haut à gauche */}
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
        </div>
      </div>
    </div>
  );
}
