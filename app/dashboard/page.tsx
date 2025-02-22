"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface Weight {
  id: number
  weight: number
  date: string
}

interface DailyLog {
  id?: number
  date: string
  breakfast: string
  morningSnack: string
  lunch: string
  afternoonSnack: string
  dinner: string
  workoutActivity: string
  waterIntake: number
}

export default function Dashboard() {
  const [weights, setWeights] = useState<Weight[]>([])
  const [newWeight, setNewWeight] = useState("")
  const [dailyLog, setDailyLog] = useState<DailyLog>({
    date: new Date().toISOString().split("T")[0],
    breakfast: "",
    morningSnack: "",
    lunch: "",
    afternoonSnack: "",
    dinner: "",
    workoutActivity: "",
    waterIntake: 0,
  })
  const router = useRouter()

  useEffect(() => {
    fetchWeights()
    fetchDailyLog()
  }, [])

  const fetchWeights = async () => {
    const response = await fetch("/api/weights")
    if (response.ok) {
      const data = await response.json()
      setWeights(data)
    } else {
      router.push("/login")
    }
  }

  const fetchDailyLog = async () => {
    const response = await fetch(`/api/daily-log?date=${dailyLog.date}`)
    if (response.ok) {
      const data = await response.json()
      if (data.id) {
        setDailyLog(data)
      }
    }
  }

  const addWeight = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!newWeight.trim()) return
    const response = await fetch("/api/weights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ weight: Number.parseFloat(newWeight) }),
    })
    if (response.ok) {
      setNewWeight("")
      fetchWeights()
    } else {
      const data = await response.json()
      alert(data.error)
    }
  }

  const deleteWeight = async (id: number) => {
    const response = await fetch(`/api/weights/${id}`, {
      method: "DELETE",
    })
    if (response.ok) {
      fetchWeights()
    } else {
      const data = await response.json()
      alert(data.error)
    }
  }

  const handleLogout = async () => {
    const response = await fetch("/api/logout", { method: "POST" })
    if (response.ok) {
      router.push("/login")
    }
  }

  const handleDailyLogChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setDailyLog((prev) => ({ ...prev, [name]: value }))
  }

  const saveDailyLog = async () => {
    const response = await fetch("/api/daily-log", {
      method: dailyLog.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dailyLog),
    })
    if (response.ok) {
      alert("Daily log saved successfully")
      fetchDailyLog()
    } else {
      const data = await response.json()
      alert(data.error)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold mb-4">Weight Loss Tracker</h1>
      <Button onClick={handleLogout} className="mb-4">
        Logout
      </Button>

      <div className="w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-2">Add Weight</h2>
        <form onSubmit={addWeight} className="flex space-x-2 mb-4">
          <Input
            type="number"
            step="0.1"
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
            placeholder="Enter weight"
          />
          <Button type="submit">Add</Button>
        </form>

        <h2 className="text-xl font-semibold mb-2">Weight History</h2>
        <ul className="space-y-2 mb-6">
          {weights.map((weight) => (
            <li key={weight.id} className="flex items-center space-x-2">
              <span>
                {weight.weight} kg - {new Date(weight.date).toLocaleDateString()}
              </span>
              <Button onClick={() => deleteWeight(weight.id)} variant="destructive" size="sm">
                Delete
              </Button>
            </li>
          ))}
        </ul>

        <h2 className="text-xl font-semibold mb-2">Daily Log</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-1">Date</label>
            <Input type="date" name="date" value={dailyLog.date} onChange={handleDailyLogChange} />
          </div>
          <div>
            <label className="block mb-1">Breakfast</label>
            <Textarea
              name="breakfast"
              value={dailyLog.breakfast}
              onChange={handleDailyLogChange}
              placeholder="What did you have for breakfast?"
            />
          </div>
          <div>
            <label className="block mb-1">Morning Snack</label>
            <Textarea
              name="morningSnack"
              value={dailyLog.morningSnack}
              onChange={handleDailyLogChange}
              placeholder="What did you have for your morning snack?"
            />
          </div>
          <div>
            <label className="block mb-1">Lunch</label>
            <Textarea
              name="lunch"
              value={dailyLog.lunch}
              onChange={handleDailyLogChange}
              placeholder="What did you have for lunch?"
            />
          </div>
          <div>
            <label className="block mb-1">Afternoon Snack</label>
            <Textarea
              name="afternoonSnack"
              value={dailyLog.afternoonSnack}
              onChange={handleDailyLogChange}
              placeholder="What did you have for your afternoon snack?"
            />
          </div>
          <div>
            <label className="block mb-1">Dinner</label>
            <Textarea
              name="dinner"
              value={dailyLog.dinner}
              onChange={handleDailyLogChange}
              placeholder="What did you have for dinner?"
            />
          </div>
          <div>
            <label className="block mb-1">Workout Activity</label>
            <Textarea
              name="workoutActivity"
              value={dailyLog.workoutActivity}
              onChange={handleDailyLogChange}
              placeholder="Describe your workout activity"
            />
          </div>
          <div>
            <label className="block mb-1">Water Intake (liters)</label>
            <Input
              type="number"
              step="0.1"
              name="waterIntake"
              value={dailyLog.waterIntake}
              onChange={handleDailyLogChange}
              placeholder="Enter water intake in liters"
            />
          </div>
          <Button onClick={saveDailyLog}>Save Daily Log</Button>
        </div>
      </div>
    </div>
  )
}

