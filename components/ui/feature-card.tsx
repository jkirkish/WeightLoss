"use client"

import { type FeatureWithVotes } from "@/types/prisma"
import { Button } from "./button"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { toast } from "sonner"

interface FeatureCardProps {
  feature: FeatureWithVotes;
  onVote: (featureId: string) => Promise<void>;
}

export function FeatureCard({ feature, onVote }: FeatureCardProps) {
  const { data: session } = useSession()
  const [isVoting, setIsVoting] = useState(false)
  const [voteCount, setVoteCount] = useState(feature._count.votes)

  const handleVote = async () => {
    if (!session) {
      toast.error("Please login to vote")
      return
    }
    setIsVoting(true)
    try {
      const response = await fetch("/api/features/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featureId: feature.id }),
      })

      if (!response.ok) throw new Error("Failed to vote")

      const updatedFeature = await response.json()
      setVoteCount(updatedFeature._count.votes)
      toast.success("Vote updated successfully")
    } catch (error) {
      toast.error("Failed to update vote")
    } finally {
      setIsVoting(false)
    }
  }

  const statusColors = {
    PENDING: "bg-gray-100 text-gray-800",
    PLANNED: "bg-blue-100 text-blue-800",
    IN_PROGRESS: "bg-yellow-100 text-yellow-800",
    COMPLETED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{feature.title}</h3>
          <p className="text-gray-600 mt-1">{feature.description}</p>
        </div>
        <span className={`px-2 py-1 rounded text-sm ${statusColors[feature.status]}`}>
          {feature.status.replace('_', ' ')}
        </span>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-500">
          {new Date(feature.createdAt).toLocaleDateString()}
        </div>
        <Button
          onClick={handleVote}
          disabled={isVoting}
          variant="outline"
          className="flex items-center gap-2"
        >
          <span>👍</span>
          <span>{voteCount}</span>
        </Button>
      </div>
    </div>
  )
} 