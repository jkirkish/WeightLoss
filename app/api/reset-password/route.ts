import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createTransport } from "nodemailer"
import crypto from "crypto"

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour

    // Store reset token in database
    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    })

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: `
        <p>Click the link below to reset your password:</p>
        <a href="${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}">
          Reset Password
        </a>
        <p>This link will expire in 1 hour.</p>
      `,
    })

    return NextResponse.json({ message: "Reset link sent" })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json({ error: "Failed to send reset link" }, { status: 500 })
  }
} 