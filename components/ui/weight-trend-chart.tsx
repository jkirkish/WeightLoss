"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface WeightData {
  date: string
  weight: number
}

interface WeightTrendChartProps {
  data: WeightData[]
}

export default function WeightTrendChart({ data }: WeightTrendChartProps) {
  const formattedData = data
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(entry => ({
      ...entry,
      date: new Date(entry.date).toLocaleDateString(),
    }))

  // Find min and max weight to set y-axis domain
  const weights = data.map(d => d.weight)
  const minWeight = Math.floor(Math.min(...weights) - 1)
  const maxWeight = Math.ceil(Math.max(...weights) + 1)

  return (
    <div className="w-full h-[400px] mt-8">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
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
          <Line
            dataKey="weight" 
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ fill: "#8884d8", r: 4 }}
            activeDot={{ r: 6 }}
            name="Weight"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
} 