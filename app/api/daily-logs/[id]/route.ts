import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { authConfig } from "@/auth.config"

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Delete weight record first
    await prisma.weight.delete({
      where: {
        id: parseInt(params.id),
        userId: session.user.id
      }
    })

    // Then delete daily log
    await prisma.dailyLog.delete({
      where: {
        id: parseInt(params.id),
        userId: session.user.id
      }
    })

    return NextResponse.json({ message: "Entry deleted successfully" })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json(
      { error: "Failed to delete entry" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const data = await request.json()

    // Update weight record
    await prisma.weight.update({
      where: {
        id: parseInt(params.id),
        userId: session.user.id
      },
      data: {
        weight: parseFloat(data.weight),
        date: new Date(data.date)
      }
    })

    // Update daily log
    await prisma.dailyLog.update({
      where: {
        id: parseInt(params.id),
        userId: session.user.id
      },
      data: {
        date: new Date(data.date),
        breakfast: data.breakfast,
        morningSnack: data.morningSnack,
        lunch: data.lunch,
        afternoonSnack: data.afternoonSnack,
        dinner: data.dinner,
        workoutActivity: data.workoutActivity,
        waterIntake: parseFloat(data.waterIntake) || 0,
        notes: data.notes
      }
    })

    return NextResponse.json({ message: "Entry updated successfully" })
  } catch (error) {
    console.error("Update error:", error)
    return NextResponse.json(
      { error: "Failed to update entry" },
      { status: 500 }
    )
  }
} 