"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import Link from "next/link"

interface User {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  role: string
}

interface WeightLog {
  id: string
  date: string
  weight: number
  userId: string
  user: {
    firstName: string
    lastName: string
  }
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingLogs, setIsLoadingLogs] = useState(true)

  useEffect(() => {
    if (status === 'loading') {
      return // Wait for session to load
    }

    if (status === 'unauthenticated' || session?.user?.role !== 'ADMIN') {
      toast.error("Unauthorized access")
      router.push('/dashboard')
      return
    }

    // Only fetch data if user is admin
    fetchUsers()
    fetchWeightLogs()
  }, [session, router, status])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (status === 'unauthenticated' || session?.user?.role !== 'ADMIN') {
    return null
  }

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const { data } = await axios.get('/api/admin/users')
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error(error.response?.data?.error || "Failed to fetch users")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchWeightLogs = async () => {
    setIsLoadingLogs(true)
    try {
      const { data } = await axios.get('/api/admin/weight-logs')
      setWeightLogs(data)
    } catch (error) {
      console.error('Error fetching weight logs:', error)
      toast.error(error.response?.data?.error || "Failed to fetch weight logs")
    } finally {
      setIsLoadingLogs(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return

    try {
      await axios.delete(`/api/admin/users/${userId}`)
      toast.success("User deleted successfully")
      fetchUsers()
    } catch (error) {
      toast.error("Error deleting user")
    }
  }

  const handleDeleteAllUsers = async () => {
    if (!confirm("Are you sure you want to delete ALL users? This cannot be undone!")) return

    try {
      await axios.delete('/api/admin/users')
      toast.success("All users deleted successfully")
      fetchUsers()
    } catch (error) {
      toast.error("Error deleting users")
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-purple-900">Admin Dashboard</h1>
            <div className="flex space-x-4">
              <Link href="/weight-tracker" className="text-gray-600 hover:text-purple-600">
                Weight Tracker
              </Link>
              <Link href="/register" className="text-gray-600 hover:text-purple-600">
                Register
              </Link>
              <Link href="/login" className="text-gray-600 hover:text-purple-600">
                Login
              </Link>
              <button 
                onClick={() => signOut({ redirect: true, callbackUrl: '/login' })}
                className="text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* User Management Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">User Management</h2>
            <Button
              onClick={handleDeleteAllUsers}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete All Users
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center">
                      Loading users...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.firstName} {user.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button
                          onClick={() => handleDeleteUser(user.id)}
                          className="bg-red-100 text-red-600 hover:bg-red-200 mr-2"
                        >
                          Delete
                        </Button>
                        <Button
                          onClick={() => router.push(`/admin/users/${user.id}/edit`)}
                          className="bg-blue-100 text-blue-600 hover:bg-blue-200"
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Weight Logs Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">Weight Tracking Logs</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Weight (kg)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoadingLogs ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center">
                      Loading weight logs...
                    </td>
                  </tr>
                ) : weightLogs.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center">
                      No weight logs found
                    </td>
                  </tr>
                ) : (
                  weightLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {log.user.firstName} {log.user.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(log.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {log.weight}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
} 