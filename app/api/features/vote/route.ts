import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { featureId } = await req.json()
    if (!featureId) {
      return new NextResponse("Feature ID is required", { status: 400 })
    }

    // Check if vote already exists
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_featureId: {
          userId: session.user.id,
          featureId,
        },
      },
    })

    if (existingVote) {
      // Remove vote if it exists
      await prisma.vote.delete({
        where: {
          id: existingVote.id,
        },
      })
    } else {
      // Create new vote
      await prisma.vote.create({
        data: {
          userId: session.user.id,
          featureId,
        },
      })
    }

    // Get updated vote count
    const updatedFeature = await prisma.feature.findUnique({
      where: { id: featureId },
      include: {
        _count: {
          select: { votes: true },
        },
      },
    })

    return NextResponse.json(updatedFeature)
  } catch (error) {
    console.error("Vote error:", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 