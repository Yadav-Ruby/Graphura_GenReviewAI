import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts'

const tooltipStyle = {
  backgroundColor: '#181820',
  border: '1px solid #232330',
  borderRadius: 12,
  fontSize: 12,
  color: '#e2e8f0',
}

export function MonthlyTrendChart({ data }: { data: { month: string; reviews: number; positive: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#232330" vertical={false} />
        <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Line type="monotone" dataKey="reviews" stroke="#4F46E5" strokeWidth={2.5} dot={false} name="Total Reviews" />
        <Line type="monotone" dataKey="positive" stroke="#8B5CF6" strokeWidth={2.5} dot={false} name="Positive" />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function SentimentPieChart({ data }: { data: { name: string; value: number; color: string }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={0} outerRadius={90} paddingAngle={2}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} stroke="none" />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
      </PieChart>
    </ResponsiveContainer>
  )
}

export function RatingBarChart({ data }: { data: { rating: string; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#232330" vertical={false} />
        <XAxis dataKey="rating" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(79,70,229,0.08)' }} />
        <Bar dataKey="count" fill="#4F46E5" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function PlatformDonutChart({ data }: { data: { name: string; value: number; color: string }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={3}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} stroke="none" />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
      </PieChart>
    </ResponsiveContainer>
  )
}

export function CityBarChart({ data }: { data: { city: string; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#232330" horizontal={false} />
        <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis dataKey="city" type="category" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} width={80} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(79,70,229,0.08)' }} />
        <Bar dataKey="count" fill="#8B5CF6" radius={[0, 8, 8, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
