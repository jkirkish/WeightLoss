"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface UserData {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  role: string
}

export default function EditUser({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated' || session?.user?.role !== 'ADMIN') {
      toast.error("Unauthorized access")
      router.push('/dashboard')
      return
    }

    fetchUser()
  }, [session, status, params.id])

  const fetchUser = async () => {
    try {
      const { data } = await axios.get(`/api/admin/users/${params.id}`)
      setUserData(data)
    } catch (error) {
      toast.error("Failed to fetch user data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.put(`/api/admin/users/${params.id}`, userData)
      toast.success("User updated successfully")
      router.push('/admin')
    } catch (error) {
      toast.error("Failed to update user")
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!userData) {
    return <div>User not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Edit User</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <Input
              type="email"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              className="mt-1"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <Input
              type="text"
              value={userData.firstName || ''}
              onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <Input
              type="text"
              value={userData.lastName || ''}
              onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              value={userData.role}
              onChange={(e) => setUserData({ ...userData, role: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              type="button"
              onClick={() => router.push('/admin')}
              variant="outline"
            >
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 