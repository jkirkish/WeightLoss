"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export default function ResetPassword() {
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const validatePassword = (password: string) => {
    const minLength = password.length >= 12
    const hasUpper = /[A-Z]/.test(password)
    const hasLower = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    
    return {
      isValid: minLength && hasUpper && hasLower && hasNumber && hasSymbol,
      checks: { minLength, hasUpper, hasLower, hasNumber, hasSymbol }
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
      const response = await fetch("/api/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })

      if (response.ok) {
        toast.success("Password updated successfully!")
        router.push('/login')
      } else {
        const data = await response.json()
        toast.error(data.error || "Failed to update password")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const validation = validatePassword(password)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-600 to-blue-600 p-4">
      <div className="w-full max-w-md mx-auto p-8 space-y-8 bg-background/90 backdrop-blur-sm rounded-xl shadow-2xl">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-primary">Set New Password</h2>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full text-center"
            />
          </div>

          <div className="text-sm space-y-2 bg-gray-50 p-4 rounded-lg">
            <p className="font-medium text-gray-700">Password must have:</p>
            <ul className="space-y-1">
              <li className={validation.checks.minLength ? "text-green-600" : "text-red-600"}>
                • At least 12 characters
              </li>
              <li className={validation.checks.hasUpper ? "text-green-600" : "text-red-600"}>
                • One uppercase letter
              </li>
              <li className={validation.checks.hasLower ? "text-green-600" : "text-red-600"}>
                • One lowercase letter
              </li>
              <li className={validation.checks.hasNumber ? "text-green-600" : "text-red-600"}>
                • One number
              </li>
              <li className={validation.checks.hasSymbol ? "text-green-600" : "text-red-600"}>
                • One special character
              </li>
            </ul>
          </div>

          <Button
            type="submit"
            disabled={isLoading || !validation.isValid}
            className="w-full"
          >
            {isLoading ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </div>
    </div>
  )
} 