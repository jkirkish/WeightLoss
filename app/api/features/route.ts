import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../auth/[...nextauth]/route"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { title, description } = await req.json()

    if (!title || !description) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const feature = await prisma.feature.create({
      data: {
        title,
        description,
        creatorId: session.user.id,
      },
    })

    return NextResponse.json(feature)
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function GET() {
  try {
    const features = await prisma.feature.findMany({
      include: {
        votes: true,
        _count: {
          select: { votes: true }
        }
      },
      orderBy: {
        votes: {
          _count: 'desc'
        }
      }
    })

    return NextResponse.json(features)
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
} 