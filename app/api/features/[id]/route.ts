import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (user?.role !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 })
    }

    const { status } = await req.json()
    const updatedFeature = await prisma.feature.update({
      where: { id: params.id },
      data: { status },
    })

    return NextResponse.json(updatedFeature)
  } catch (error) {
    console.error("Update feature error:", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 