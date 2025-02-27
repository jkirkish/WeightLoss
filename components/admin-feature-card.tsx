"use client"

import { type FeatureWithDetails } from "@/types/prisma"
import { FeatureStatus } from "@prisma/client"
import { useState } from "react"
import { Button } from "./ui/button"
import { Select } from "./ui/select"
import { toast } from "sonner"

interface AdminFeatureCardProps {
  feature: FeatureWithDetails;
}

export function AdminFeatureCard({ feature }: AdminFeatureCardProps) {
  const [status, setStatus] = useState<FeatureStatus>(feature.status)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusUpdate = async (newStatus: FeatureStatus) => {
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/features/${feature.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error('Failed to update status')

      setStatus(newStatus)
      toast.success('Status updated successfully')
    } catch (error) {
      toast.error('Failed to update status')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{feature.title}</h3>
          <p className="text-gray-600 mt-1">{feature.description}</p>
          <p className="text-sm text-gray-500 mt-2">
            Submitted by: {feature.creator.email}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={status}
            onValueChange={handleStatusUpdate}
            disabled={isUpdating}
          >
            {Object.values(FeatureStatus).map((s) => (
              <option key={s} value={s}>
                {s.replace('_', ' ')}
              </option>
            ))}
          </Select>
          <div className="text-sm font-medium">
            👍 {feature._count.votes}
          </div>
        </div>
      </div>
    </div>
  )
} 