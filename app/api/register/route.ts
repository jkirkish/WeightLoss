import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const { email, password } = await request.json()

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    })
    return NextResponse.json({ message: "User created successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Error creating user" }, { status: 500 })
  }
}

