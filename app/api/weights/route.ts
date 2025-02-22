import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { cookies } from "next/headers"

const prisma = new PrismaClient()

export async function GET() {
  const userId = cookies().get("userId")?.value
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const weights = await prisma.weight.findMany({
      where: { userId: Number.parseInt(userId) },
      orderBy: { date: "desc" },
    })
    return NextResponse.json(weights)
  } catch (error) {
    return NextResponse.json({ error: "Error fetching weights" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const userId = cookies().get("userId")?.value
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { weight } = await request.json()

  try {
    const newWeight = await prisma.weight.create({
      data: {
        weight,
        userId: Number.parseInt(userId),
      },
    })
    return NextResponse.json(newWeight)
  } catch (error) {
    return NextResponse.json({ error: "Error adding weight" }, { status: 500 })
  }
}

