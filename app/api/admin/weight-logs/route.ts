import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET() {
  const session = await auth()
  
  if (!session?.user?.role || session.user.role !== 'ADMIN') {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const logs = await prisma.weight.findMany({
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
        }
      }
    },
    orderBy: {
      date: 'desc'
    }
  })

  return NextResponse.json(logs)
} 