// app/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import HomeClient from "@/components/HomeClient";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "client") {
    redirect("/login");
  }

  return <HomeClient username={session.user.username} />;
}
