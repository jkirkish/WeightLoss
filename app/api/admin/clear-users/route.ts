import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function DELETE(req: Request) {
  try {
    await prisma.user.deleteMany({})
    return NextResponse.json({ message: "All users deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete users" }, { status: 500 })
  }
} 