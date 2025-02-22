import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { cookies } from "next/headers"

const prisma = new PrismaClient()

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const userId = cookies().get("userId")?.value
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const id = Number.parseInt(params.id)

  try {
    await prisma.dailyLog.delete({
      where: {
        id,
        userId: Number.parseInt(userId),
      },
    })
    return NextResponse.json({ message: "Daily log deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Error deleting daily log" }, { status: 500 })
  }
}

