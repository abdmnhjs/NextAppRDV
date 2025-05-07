"use client";

import { signOut } from "next-auth/react";
import { ReactNode } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

interface LogoutButtonProps {
  children: ReactNode;
}

const LogoutButton = ({ children }: LogoutButtonProps) => {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false }); // Prevent automatic redirect
    router.push("/login"); // Manually redirect to login page
  };

  return (
    <Button
      className="cursor-pointer bg-red-500 text-white hover:bg-red-300/90 flex items-center justify-center m-2"
      onClick={handleSignOut}
    >
      {children}
    </Button>
  );
};

export default LogoutButton;
