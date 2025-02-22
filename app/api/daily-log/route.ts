import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { cookies } from "next/headers"

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const userId = cookies().get("userId")?.value
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const url = new URL(request.url)
  const date = url.searchParams.get("date")

  try {
    const dailyLog = await prisma.dailyLog.findFirst({
      where: {
        userId: Number.parseInt(userId),
        date: date ? new Date(date) : undefined,
      },
    })
    return NextResponse.json(dailyLog || {})
  } catch (error) {
    return NextResponse.json({ error: "Error fetching daily log" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const userId = cookies().get("userId")?.value
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const data = await request.json()

  try {
    const dailyLog = await prisma.dailyLog.create({
      data: {
        ...data,
        userId: Number.parseInt(userId),
      },
    })
    return NextResponse.json(dailyLog)
  } catch (error) {
    return NextResponse.json({ error: "Error creating daily log" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const userId = cookies().get("userId")?.value
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const data = await request.json()

  try {
    const dailyLog = await prisma.dailyLog.upsert({
      where: {
        id: data.id || 0,
        userId: Number.parseInt(userId),
      },
      update: data,
      create: {
        ...data,
        userId: Number.parseInt(userId),
      },
    })
    return NextResponse.json(dailyLog)
  } catch (error) {
    return NextResponse.json({ error: "Error updating daily log" }, { status: 500 })
  }
}

