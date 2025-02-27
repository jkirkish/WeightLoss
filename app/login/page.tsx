"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { toast } from "sonner"

export default function Login() {
  const { data: session } = useSession()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        toast.error("Invalid credentials")
      } else {
        toast.success("Successfully logged in! Redirecting to dashboard...")
        router.push('/dashboard')
      }
    } catch (error) {
      toast.error("An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-600 to-blue-600 p-4">
      <div className="w-full max-w-md mx-auto p-8 space-y-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-primary">
            Weight Loss Program
          </h2>
          <h1 className="mt-6 text-3xl font-extrabold text-primary">
            Sign in to your account
          </h1>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6 flex flex-col items-center">
          <div className="rounded-md shadow-sm space-y-6 w-full max-w-sm mx-auto">
            <div className="flex items-center space-x-2">
              <label className="w-28 text-right font-medium text-gray-700">Username:</label>
              <Input 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="w-full text-left flex-1"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="w-28 text-right font-medium text-gray-700">Password:</label>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full text-left flex-1"
              />
            </div>
          </div>

          <div className="w-full max-w-sm mx-auto text-right mt-2">
            <Link 
              href="/forgot-password" 
              className="font-medium text-purple-600 hover:text-purple-500 text-sm"
            >
              Forgot your password?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full max-w-sm mt-6"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>

          <div className="text-center mt-4">
            <Link 
              href="/register" 
              className="font-medium text-purple-600 hover:text-purple-500 block"
            >
              Don't have an account? Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

