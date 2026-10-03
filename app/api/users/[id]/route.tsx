import { NextRequest, NextResponse } from "next/server";
import schema from "../schema";
import { prisma } from "@/prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const userId = Number(id);

  if (Number.isNaN(userId)) {
    return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const userId = Number(id);

  if (Number.isNaN(userId))
    return NextResponse.json({ error: "Invalid user id" }, { status: 400 });

  const body = await request.json();
  const validation = schema.safeParse(body);

  if (!validation.success)
    return NextResponse.json(validation.error.issues, { status: 400 });

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: validation.data.name,
        email: validation.data.email,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    if ((error as { code?: string }).code === "P2002")
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 },
      );
    throw error;
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const userId = Number(id);

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  await prisma.user.delete({
    where: { id: userId },
  });
  return NextResponse.json({});
}
