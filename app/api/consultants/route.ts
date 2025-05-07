import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

// Bonne pratique : utiliser une instance singleton de PrismaClient
const prisma = new PrismaClient();

export async function GET() {
  try {
    const consultants = await prisma.user.findMany({
      where: { role: "consultant" },
    });

    return NextResponse.json(consultants);
  } catch (error) {
    console.error("Failed to fetch consultants:", error);
    return NextResponse.json(
      { error: "Failed to fetch consultants" },
      { status: 500 }
    );
  }
}
