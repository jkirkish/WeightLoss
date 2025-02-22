"use client"

import * as React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Login logic here
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <Input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} 
          required 
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">Login</Button>
      </form>
    </div>
  )
}

