import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { authConfig } from "@/auth.config"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const data = await req.json()

    // Save weight record
    await prisma.weight.create({
      data: {
        weight: parseFloat(data.weight),
        date: new Date(data.date),
        userId: session.user.id
      }
    })

    // Save daily log
    await prisma.dailyLog.create({
      data: {
        date: new Date(data.date),
        breakfast: data.breakfast,
        morningSnack: data.morningSnack,
        lunch: data.lunch,
        afternoonSnack: data.afternoonSnack,
        dinner: data.dinner,
        workoutActivity: data.workoutActivity,
        waterIntake: parseFloat(data.waterIntake) || 0,
        notes: data.notes,
        userId: session.user.id
      }
    })

    return NextResponse.json({ message: "Daily log saved successfully" })
  } catch (error) {
    console.error("Error saving daily log:", error)
    return NextResponse.json(
      { error: "Failed to save daily log" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const logs = await prisma.dailyLog.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        date: 'desc'
      }
    })

    // Get the weights for the same dates
    const weights = await prisma.weight.findMany({
      where: {
        userId: session.user.id
      }
    })

    // Combine daily logs with weights
    const combinedLogs = logs.map(log => {
      const matchingWeight = weights.find(w => 
        new Date(w.date).toISOString().split('T')[0] === new Date(log.date).toISOString().split('T')[0]
      )
      return {
        ...log,
        weight: matchingWeight?.weight || 0
      }
    })

    return NextResponse.json(combinedLogs)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch logs" },
      { status: 500 }
    )
  }
} 