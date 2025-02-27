import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET() {
  const session = await auth()
  
  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { firstName: true, lastName: true }
    })

    return NextResponse.json(user)
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch user profile" }),
      { status: 500 }
    )
  }
} 