    import React from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface DataItem {
  year: string
  value: number
}

interface ChartProps {
  type: 'chart' | 'table'
  data: DataItem[]
  title: string
}

const DataVisualization: React.FC<ChartProps> = ({ type, data, title }) => {
  if (!data || data.length === 0) {
    return <div className="text-gray-500 dark:text-gray-400">No data available for visualization</div>
  }

  if (type === 'table') {
    return (
      <Card className="w-full bg-white dark:bg-[#241242] shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-800 dark:text-gray-200">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Year</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Value</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr 
                    key={index} 
                    className={`border-b border-gray-100 dark:border-gray-800 ${
                      index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800/30' : 'bg-white dark:bg-[#241242]'
                    }`}
                  >
                    <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">{item.year}</td>
                    <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full bg-white dark:bg-[#241242] shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-800 dark:text-gray-200">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="year" 
                tick={{ fill: '#718096' }}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <YAxis 
                tick={{ fill: '#718096' }}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '4px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}
                itemStyle={{ color: '#4a5568' }}
                cursor={{ fill: 'rgba(0, 0, 0, 0.04)' }}
              />
              <Bar 
                dataKey="value" 
                fill="#718096" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export default DataVisualization