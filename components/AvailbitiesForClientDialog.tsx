"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"; // Changé pour utiliser shadcn/ui
import { Button } from "./ui/button";
import { CalendarClientForm } from "./CalendarClientForm";

type Props = {
  username: string;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void; // Correction du type
};

type Consultant = {
  username: string;
  id: number; // Ajout de l'id
};

const AvailabilitiesForClientDialog = ({
  isDialogOpen,
  setIsDialogOpen,
}: Props) => {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [selectedConsultant, setSelectedConsultant] =
    useState<Consultant | null>(null);

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
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white rounded-xl px-6 py-50 max-w-md">
          <DialogTitle className="font-bold"></DialogTitle>

          <div className="mt-4">
            <CalendarClientForm />
            {/* Ici vous pourriez ajouter une liste des disponibilités */}
            <div className="mt-2">
              {/* Contenu des disponibilités pour le consultant sélectionné */}
              {/* À remplacer par les données réelles */}
              <p className="text-sm">
                No availabilities found for this consultant.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AvailabilitiesForClientDialog;
