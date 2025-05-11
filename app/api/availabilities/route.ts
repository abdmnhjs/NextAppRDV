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
  try {
    const { id, username, availability } = await request.json();
    console.log("Received data:", { id, username, availability });

    const consultantId = await getConsultantId(id, username);

    if (!consultantId) {
      return NextResponse.json(
        { error: "Consultant ID or username is required" },
        { status: 400 }
      );
    }

    const newAvailability = await prisma.availability.create({
      data: {
        consultantId,
        day: availability.day,
        startHour: availability.startHour,
        startMinutes: availability.startMinutes,
        endHour: availability.endHour,
        endMinutes: availability.endMinutes,
        booked: availability.booked,
        includePayment: availability.includePayment ?? false,
        price: availability.price ?? 0,
      },
    });
    return NextResponse.json(newAvailability, { status: 201 });
  } catch (error) {
    console.error("Error creating availability:", error);
    return NextResponse.json(
      {
        error: "Failed to add availability",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id, availability } = await request.json();
    console.log("DELETE request received:", { id, availability });

    if (!id || !availability || !availability.id) {
      console.error("Missing required fields:", { id, availability });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const consultantId = await getConsultantId(id, null);
    console.log("Consultant ID:", consultantId);

    if (!consultantId) {
      console.error("Invalid consultant ID:", id);
      return NextResponse.json(
        { error: "Invalid consultant ID" },
        { status: 400 }
      );
    }

    // Vérifier si la disponibilité existe et appartient au consultant
    const existingAvailability = await prisma.availability.findFirst({
      where: {
        id: availability.id,
        consultantId: consultantId,
      },
      include: {
        appointments: true,
      },
    });
    console.log("Existing availability:", existingAvailability);

    if (!existingAvailability) {
      console.error("Availability not found:", {
        id: availability.id,
        consultantId,
      });
      return NextResponse.json(
        { error: "Availability not found" },
        { status: 404 }
      );
    }

    // Supprimer d'abord les rendez-vous associés
    if (
      existingAvailability.appointments &&
      existingAvailability.appointments.length > 0
    ) {
      console.log(
        "Deleting associated appointments:",
        existingAvailability.appointments
      );
      await prisma.appointment.deleteMany({
        where: {
          availabilityId: availability.id,
        },
      });
    }

    // Supprimer la disponibilité
    try {
      const deletedAvailability = await prisma.availability.delete({
        where: {
          id: availability.id,
        },
      });
      console.log("Deleted availability:", deletedAvailability);

      return NextResponse.json({
        message: "Availability deleted successfully",
        deletedId: availability.id,
      });
    } catch (deleteError) {
      console.error("Error during deletion:", deleteError);
      return NextResponse.json(
        {
          error: "Failed to delete availability",
          details:
            deleteError instanceof Error
              ? deleteError.message
              : "Unknown error during deletion",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in DELETE handler:", error);
    return NextResponse.json(
      {
        error: "Failed to delete availability",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
