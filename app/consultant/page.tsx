// app/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import HomeConsultant from "@/components/HomeConsultant";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "consultant") {
    redirect("/login");
  }

  return (
    <HomeConsultant
      username={session.user.username}
      id={parseInt(session.user.id)}
    />
  );
}
