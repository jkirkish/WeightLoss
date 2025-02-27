"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function Dashboard() {
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false })
      toast.success("Successfully logged out")
      setTimeout(() => {
        router.push('/login')
      }, 1500) // Wait 1.5 seconds to show the success message
    } catch (error) {
      toast.error("Error logging out")
    }
  }

  const handleNavigateToTracker = () => {
    setIsNavigating(true)
    toast.success("Loading Weight Tracker...")
    router.push('/weight-tracker')
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-8">
      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-xl shadow-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-purple-900">
            Welcome to Your Dashboard
          </h1>
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="bg-red-500 text-white hover:bg-red-600"
          >
            Logout
          </Button>
        </div>
        
        <div className="space-y-6">
          <p className="text-gray-700">
            This is your personalized dashboard. You can start tracking your weight loss journey here.
          </p>
          
          <div className="bg-purple-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-purple-900 mb-4">Quick Actions</h2>
            <Button
              onClick={handleNavigateToTracker}
              disabled={isNavigating}
              className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              {isNavigating ? "Loading..." : "Go to Weight Tracker"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

