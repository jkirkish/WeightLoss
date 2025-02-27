import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET() {
  const session = await auth()
  
  if (!session?.user?.role || session.user.role !== 'ADMIN') {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    })

    console.log('Fetched users:', users)
    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch users" }),
      { status: 500 }
    )
  }
}

export async function DELETE() {
  const session = await auth()
  
  if (!session?.user?.role || session.user.role !== 'ADMIN') {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  await prisma.user.deleteMany({})
  return NextResponse.json({ message: "All users deleted" })
} 