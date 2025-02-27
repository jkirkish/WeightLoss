"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function WeightTrendChart({ data }) {
  const formattedData = data.map(entry => ({
    ...entry,
    date: new Date(entry.date).toLocaleDateString(),
  }))

  const weights = data.map(d => d.weight)
  const minWeight = Math.floor(Math.min(...weights) - 1)
  const maxWeight = Math.ceil(Math.max(...weights) + 1)

  return (
    <div className="w-full h-[400px] mt-8">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={formattedData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date"
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            domain={[minWeight, maxWeight]}
            label={{ 
              value: 'Weight (kg)', 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle' }
            }}
          />
          <Tooltip />
          <Bar 
            dataKey="weight" 
            fill="#8884d8"
            name="Weight"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
} 