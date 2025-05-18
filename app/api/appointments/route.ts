import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const appointments = await prisma.appointment.findMany();
  return NextResponse.json(appointments);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { consultantUsername, clientUsername, availabilityId, date } = body;

    if (!consultantUsername || !clientUsername || !availabilityId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const [consultant, client] = await Promise.all([
      prisma.user.findUnique({
        where: { username: consultantUsername },
      }),
      prisma.user.findUnique({
        where: { username: clientUsername },
      }),
    ]);

    if (!consultant) {
      return NextResponse.json(
        { error: "Consultant not found" },
        { status: 404 }
      );
    }

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const availability = await prisma.availability.findUnique({
      where: { id: availabilityId },
    });

    if (!availability || availability.booked) {
      return NextResponse.json(
        { error: "No available slot found or slot already booked" },
        { status: 404 }
      );
    }

    const newAppointment = await prisma.appointment.create({
      data: {
        consultantUsername,
        clientUsername,
        availabilityId,
        date: new Date(date).toISOString(),
      },
    });

    await prisma.availability.update({
      where: { id: availabilityId },
      data: { booked: true },
    });

    return NextResponse.json(newAppointment, { status: 201 });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      {
        error: "Failed to create appointment",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
