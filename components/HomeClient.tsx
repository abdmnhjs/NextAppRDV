"use client";

import LogoutButton from "./LogoutButton";

type Props = {
  username: string;
};

export default function HomeConsultant({ username }: Props) {
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
        </div>
      </div>
    </div>
  );
}
