import React from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
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
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

interface DataItem {
  year: string
  value: number
}

interface ChartProps {
  type: 'chart' | 'table'
  data: DataItem[]
  title: string
}

const chartConfig: ChartConfig = {
  value: {
    label: 'Value',
    color: '#2563eb',
  },
}

const DataVisualization: React.FC<ChartProps> = ({ type, data, title }) => {
  if (!data || data.length === 0) {
    return <div>No data available for visualization</div>
  }

  if (type === 'table') {
    return (
      <Table>
        <TableCaption>{title}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Year</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.year}</TableCell>
              <TableCell>{item.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  return (
    <div className="w-full">
      <h3 className="mb-4 text-center text-lg font-semibold">{title}</h3>
      <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
        <BarChart data={data}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="year"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="value" fill="var(--color-value)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  )
}

export default DataVisualization