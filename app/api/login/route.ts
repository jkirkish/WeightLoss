import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const { email, password } = await request.json()

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 })
    }

    cookies().set("userId", user.id.toString(), { httpOnly: true })
    return NextResponse.json({ message: "Logged in successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Error logging in" }, { status: 500 })
  }
}

