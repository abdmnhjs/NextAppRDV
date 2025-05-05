import LogoutButton from "@/components/LogoutButton";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

interface User {
  id: string;
  username: string;
  role: string;
}

export default async function Home() {
  const session = await getServerSession(authOptions);

  // Vérifie que l'utilisateur est connecté et qu'il a le rôle "consultant"
  if (!session || (session.user as User).role !== "consultant") {
    redirect("/login");
  }

  // Récupère le nom d'utilisateur de la session
  const username = (session.user as User).username;

  return (
    <div>
      <h1>Consultant: {username}</h1>
      <LogoutButton>Sign out</LogoutButton>
    </div>
  );
}
