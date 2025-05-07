import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Helper to get consultant ID from id or username
async function getConsultantId(id: string | null, username: string | null) {
  if (id) return Number(id);
  if (username) {
    const consultant = await prisma.user.findUnique({
      where: { username },
    });
    return consultant?.id || null;
  }
  return null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const username = searchParams.get("username");

  const consultantId = await getConsultantId(id, username);
  if (!consultantId) {
    return NextResponse.json(
      { error: "Consultant ID or username is required" },
      { status: 400 }
    );
  }

  try {
    const availabilities = await prisma.availability.findMany({
      where: { consultantId },
    });
    return NextResponse.json(availabilities);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch availabilities" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { id, username, availability } = await request.json();
  const consultantId = await getConsultantId(id, username);

  if (!consultantId) {
    return NextResponse.json(
      { error: "Consultant ID or username is required" },
      { status: 400 }
    );
  }

  try {
    const newAvailability = await prisma.availability.create({
      data: {
        consultantId,
        ...availability,
      },
    });
    return NextResponse.json(newAvailability, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to add availability" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { id, username, availability } = await request.json();
  const consultantId = await getConsultantId(id, username);

  if (!consultantId) {
    return NextResponse.json(
      { error: "Consultant ID or username is required" },
      { status: 400 }
    );
  }

  try {
    await prisma.availability.deleteMany({
      where: {
        consultantId,
        ...availability,
      },
    });
    return NextResponse.json({ message: "Availability deleted" });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete availability" },
      { status: 500 }
    );
  }
}
