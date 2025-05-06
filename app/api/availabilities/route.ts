import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Consultant ID is required" },
      { status: 400 }
    );
  }

  try {
    const availabilities = await prisma.availability.findMany({
      where: { consultantId: Number(id) },
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
  const { id, availability } = await request.json();

  try {
    const newAvailability = await prisma.availability.create({
      data: {
        consultantId: id,
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
  const { id, availability } = await request.json();

  try {
    await prisma.availability.deleteMany({
      where: {
        consultantId: id,
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
