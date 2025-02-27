import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  
  if (!session?.user?.role || session.user.role !== 'ADMIN') {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      }
    })

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch user" }),
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  
  if (!session?.user?.role || session.user.role !== 'ADMIN') {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const data = await request.json()
    const user = await prisma.user.update({
      where: { id: params.id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
      }
    })

    return NextResponse.json(user)
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: "Failed to update user" }),
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  
  if (!session?.user?.role || session.user.role !== 'ADMIN') {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  await prisma.user.delete({
    where: { id: params.id }
  })

  return NextResponse.json({ message: "User deleted" })
} 