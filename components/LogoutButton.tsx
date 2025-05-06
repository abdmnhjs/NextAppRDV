// components/LogoutButton.tsx
"use client";

import { signOut } from "next-auth/react";
import { ReactNode } from "react"; // Importer ReactNode
import { Button } from "./ui/button";

interface LogoutButtonProps {
  children: ReactNode; // Typage de children
}

const LogoutButton = ({ children }: LogoutButtonProps) => {
  return (
    <Button
      className="cursor-pointer bg-red-500 text-white hover:bg-red-300/90 flex items-center justify-center m-2"
      onClick={() => signOut()}
    >
      {children}
    </Button>
  );
};

export default LogoutButton;
