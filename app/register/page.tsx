"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { toast } from "sonner"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default function Register() {
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const validatePassword = (password: string) => {
    const minLength = password.length >= 12
    const hasUpper = /[A-Z]/.test(password)
    const hasLower = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    
    return {
      isValid: minLength && hasUpper && hasLower && hasNumber && hasSymbol,
      checks: {
        minLength,
        hasUpper,
        hasLower,
        hasNumber,
        hasSymbol
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validation = validatePassword(password)
    if (!validation.isValid) {
      toast.error("Password does not meet requirements")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          password,
          firstName,
          lastName,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        await prisma.user.create({
          data: {
            email,
            password: data.hashedPassword,
            role: 'USER',
          },
        })
        toast.success("Account created successfully! Please sign in.")
        router.push("/login")
      } else {
        toast.error(data.error || "Registration failed")
      }
    } catch (error) {
      toast.error("Network error. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const validation = validatePassword(password)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-600 to-blue-600 p-4">
      <div className="w-full max-w-md mx-auto p-8 space-y-8 bg-background/90 backdrop-blur-sm rounded-xl shadow-2xl">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-primary">
            Weight Loss Program
          </h2>
          <h1 className="mt-6 text-3xl font-extrabold text-primary">
            Create your account
          </h1>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6 flex flex-col items-center">
          <div className="rounded-md shadow-sm space-y-6 w-full max-w-sm mx-auto">
            <div className="flex items-center space-x-2">
              <label className="w-28 text-right font-medium text-foreground">First Name:</label>
              <Input 
                type="text" 
                placeholder="First Name" 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)} 
                required 
                className="w-[90%] text-left flex-1"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="w-28 text-right font-medium text-foreground">Last Name:</label>
              <Input 
                type="text" 
                placeholder="Last Name" 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)} 
                required 
                className="w-[90%] text-left flex-1"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="w-28 text-right font-medium text-foreground">Email:</label>
              <Input 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="w-[90%] text-left flex-1"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="w-28 text-right font-medium text-foreground">Password:</label>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-[90%] text-left flex-1"
              />
            </div>
          </div>

          <div className="text-sm space-y-2 bg-gray-50 p-6 rounded-lg w-full max-w-sm mx-auto mt-6">
            <p className="font-semibold text-gray-700 text-center mb-4">Password must have:</p>
            <ul className="space-y-1 text-gray-600">
              <li className={validation.checks.minLength ? "text-green-600" : "text-red-600"}>
                ✓ At least 12 characters
                {!validation.checks.minLength && password && (
                  <span className="block text-xs text-red-500 mt-1">
                    Your password needs {12 - password.length} more characters
                  </span>
                )}
              </li>
              <li className={validation.checks.hasUpper ? "text-green-600" : "text-red-600"}>
                ✓ At least one uppercase letter
                {!validation.checks.hasUpper && password && (
                  <span className="block text-xs text-red-500 mt-1">
                    Add at least one uppercase letter (A-Z)
                  </span>
                )}
              </li>
              <li className={validation.checks.hasLower ? "text-green-600" : "text-red-600"}>
                ✓ At least one lowercase letter
                {!validation.checks.hasLower && password && (
                  <span className="block text-xs text-red-500 mt-1">
                    Add at least one lowercase letter (a-z)
                  </span>
                )}
              </li>
              <li className={validation.checks.hasNumber ? "text-green-600" : "text-red-600"}>
                ✓ At least one number
                {!validation.checks.hasNumber && password && (
                  <span className="block text-xs text-red-500 mt-1">
                    Add at least one number (0-9)
                  </span>
                )}
              </li>
              <li className={validation.checks.hasSymbol ? "text-green-600" : "text-red-600"}>
                ✓ At least one special character (!@#$%^&*(),.?&quot;:{}|&lt;&gt;)
                {!validation.checks.hasSymbol && password && (
                  <span className="block text-xs text-red-500 mt-1">
                    Add at least one special character
                  </span>
                )}
              </li>
            </ul>
          </div>

          <Button
            type="submit"
            disabled={isLoading || !validation.isValid}
            className="w-full max-w-sm mt-6"
          >
            {isLoading ? "Creating account..." : "Create account"}
          </Button>

          <div className="text-center mt-4">
            <Link 
              href="/login" 
              className="font-medium text-purple-600 hover:text-purple-500"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

