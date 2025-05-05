import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Initialize Prisma Client
const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, role } = body;

    // Validate the data
    if (!username || !password || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create the user in the database
    const user = await prisma.user.create({
      data: {
        username,
        password, // Note: In a production app, you should hash passwords
        role,
      },
    });

    return NextResponse.json(
      {
        success: true,
        user: { id: user.id, username: user.username, role: user.role },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user", details: (error as Error).message },
      { status: 500 }
    );
  }
}
