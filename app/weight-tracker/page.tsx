"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import WeightTrendChart from "@/components/ui/weight-trend-chart"
import { toast } from "sonner"

interface DailyLog {
  date: string
  weight: number
  breakfast: string
  morningSnack: string
  lunch: string
  afternoonSnack: string
  dinner: string
  workoutActivity: string
  waterIntake: number
  notes: string
}

export default function WeightTracker() {
  const { data: session } = useSession()
  const [userName, setUserName] = useState("")
  const [dailyLog, setDailyLog] = useState<DailyLog>({
    date: new Date().toISOString().split('T')[0],
    weight: 0,
    breakfast: '',
    morningSnack: '',
    lunch: '',
    afternoonSnack: '',
    dinner: '',
    workoutActivity: '',
    waterIntake: 0,
    notes: ''
  })
  const [pastLogs, setPastLogs] = useState<(DailyLog & { id: string })[]>([])
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [editedLog, setEditedLog] = useState<DailyLog | null>(null)

  const router = useRouter()

  useEffect(() => {
    const getUserName = async () => {
      if (session?.user?.email) {
        try {
          const { data } = await axios.get('/api/user/profile')
          if (data?.firstName && data?.lastName) {
            setUserName(`${data.firstName} ${data.lastName}'s`)
          }
        } catch (error) {
          console.error('Error fetching user profile:', error)
          toast.error("Failed to fetch user profile")
        }
      }
    }
    getUserName()
    fetchUserLogs()
  }, [session])

  const fetchUserLogs = async () => {
    if (!session?.user?.id) return
    try {
      const { data } = await axios.get('/api/daily-logs')
      const sortedData = data.sort((a: any, b: any) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      setPastLogs(sortedData)
    } catch (error) {
      toast.error("Failed to fetch logs")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setDailyLog(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleEdit = (log: DailyLog & { id: string }) => {
    setEditedLog(log)
    setIsEditing(log.id)
  }

  const handleSaveEdit = async (id: string) => {
    if (!editedLog) return
    
    try {
      await axios.put(`/api/daily-logs/${id}`, {
        ...editedLog,
        userId: session?.user?.id
      })
      
      toast.success("Entry updated successfully!")
      setIsEditing(null)
      setEditedLog(null)
      fetchUserLogs()
    } catch (error) {
      toast.error("Error updating entry")
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(null)
    setEditedLog(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return
    
    try {
      await axios.delete(`/api/daily-logs/${id}`)
      toast.success("Entry deleted successfully")
      fetchUserLogs()
    } catch (error) {
      toast.error("Error deleting entry")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (!session?.user?.id) {
        toast.error("User not authenticated")
        return
      }

      const url = '/api/daily-logs' + (isEditing ? `/${isEditing}` : '')
      const method = isEditing ? axios.put : axios.post
      await method(url, {
        ...dailyLog,
        userId: session.user.id
      })

      toast.success(isEditing ? "Entry updated successfully!" : "Daily log saved successfully!")
      setDailyLog({
        date: new Date().toISOString().split('T')[0],
        weight: 0,
        breakfast: '',
        morningSnack: '',
        lunch: '',
        afternoonSnack: '',
        dinner: '',
        workoutActivity: '',
        waterIntake: 0,
        notes: ''
      })
      setIsEditing(null)
      fetchUserLogs()
    } catch (error) {
      toast.error("An error occurred")
    }
  }

  const handleLogout = async () => {
    try {
      await signOut({ redirect: true, callbackUrl: '/login' })
      toast.success("Successfully logged out")
    } catch (error) {
      toast.error("Error logging out")
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/background-pattern.svg"
          alt="Background Pattern"
          fill
          className="object-cover opacity-20"
        />
      </div>
      
      <div className="w-full max-w-7xl mx-auto p-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-2xl relative z-10">
        <div className="absolute top-4 right-4">
          <Button
            onClick={handleLogout}
            className="bg-red-500 text-white hover:bg-red-600"
          >
            Logout
          </Button>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-purple-900">
            {userName || 'Weight Loss Program'}
          </h2>
          <h1 className="mt-6 text-3xl font-extrabold text-purple-900">
            Weight Tracker
          </h1>
        </div>

        {/* Add Weight Trend Chart */}
        {pastLogs.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-purple-900 mb-4">Weight Trend</h2>
            <WeightTrendChart 
              data={pastLogs.map(log => ({
                date: log.date,
                weight: log.weight
              }))}
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <Input
                type="date"
                name="date"
                value={dailyLog.date}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
              <Input
                type="number"
                step="0.1"
                name="weight"
                value={dailyLog.weight}
                onChange={handleChange}
                required
                placeholder="e.g., 75.5"
                min="0"
                max="500"
              />
              <p className="text-xs text-gray-500 mt-1">Enter weight in kilograms (e.g., 75.5)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Water Intake (liters)</label>
              <Input
                type="number"
                step="0.1"
                name="waterIntake"
                value={dailyLog.waterIntake}
                onChange={handleChange}
                placeholder="Water intake in liters"
              />
            </div>

            <div className="md:col-span-3 lg:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Breakfast</label>
                <Textarea
                  name="breakfast"
                  value={dailyLog.breakfast}
                  onChange={handleChange}
                  placeholder="What did you have for breakfast?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Morning Snack</label>
                <Textarea
                  name="morningSnack"
                  value={dailyLog.morningSnack}
                  onChange={handleChange}
                  placeholder="Morning snack details"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lunch</label>
                <Textarea
                  name="lunch"
                  value={dailyLog.lunch}
                  onChange={handleChange}
                  placeholder="What did you have for lunch?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Afternoon Snack</label>
                <Textarea
                  name="afternoonSnack"
                  value={dailyLog.afternoonSnack}
                  onChange={handleChange}
                  placeholder="Afternoon snack details"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dinner</label>
                <Textarea
                  name="dinner"
                  value={dailyLog.dinner}
                  onChange={handleChange}
                  placeholder="What did you have for dinner?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Workout Activity</label>
                <Textarea
                  name="workoutActivity"
                  value={dailyLog.workoutActivity}
                  onChange={handleChange}
                  placeholder="Describe your workout"
                />
              </div>
            </div>

            <div className="md:col-span-3 lg:col-span-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <Textarea
                name="notes"
                value={dailyLog.notes}
                onChange={handleChange}
                placeholder="Any additional notes for the day"
                rows={4}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full md:w-auto px-8 bg-purple-600 text-white hover:bg-purple-700"
          >
            Save Daily Log
          </Button>
        </form>

        {/* Past Entries Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-purple-900 mb-6">Past Entries</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Weight</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pastLogs.length > 0 ? pastLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(log.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing === log.id ? (
                        <Input
                          type="number"
                          step="0.1"
                          value={editedLog?.weight || log.weight}
                          onChange={(e) => setEditedLog(prev => ({
                            ...prev!,
                            weight: parseFloat(e.target.value)
                          }))}
                          className="w-24"
                        />
                      ) : (
                        `${log.weight} kg`
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      {isEditing === log.id ? (
                        <>
                          <Button
                            onClick={() => handleSaveEdit(log.id)}
                            className="bg-green-100 text-green-600 hover:bg-green-200"
                          >
                            Save
                          </Button>
                          <Button
                            onClick={handleCancelEdit}
                            className="bg-gray-100 text-gray-600 hover:bg-gray-200"
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            onClick={() => handleEdit(log)}
                            className="bg-blue-100 text-blue-600 hover:bg-blue-200"
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDelete(log.id)}
                            className="bg-red-100 text-red-600 hover:bg-red-200"
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                      No entries yet. Start tracking your progress!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
} 