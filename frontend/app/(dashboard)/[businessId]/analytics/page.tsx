'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { fetchWithAuth } from '@/lib/api'
import { BarChart3, MessageSquare, Star, LayoutTemplate, Clock, TrendingUp } from 'lucide-react'
import dynamic from 'next/dynamic'

// Dynamically import Recharts to avoid SSR hydration issues
const AreaChart = dynamic(() => import('recharts').then(mod => mod.AreaChart), { ssr: false })
const Area = dynamic(() => import('recharts').then(mod => mod.Area), { ssr: false })
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false })
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false })
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false })
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false })
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false })

type AnalyticsSummary = {
  posts_published: number
  reviews_replied: number
  messages_handled: number
  hours_saved: number
  chart_data: Array<{
    name: string
    Messages: number
    Reviews: number
    Posts: number
  }>
}

export default function AnalyticsPage() {
  const params = useParams()
  const businessId = params?.businessId as string

  const [data, setData] = useState<AnalyticsSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const result = await fetchWithAuth(
          `/analytics/summary?period=30d`,
          { headers: { 'X-Business-ID': businessId } }
        )
        setData(result)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [businessId])

  if (loading || !data) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white rounded-3xl animate-pulse" />)}
        </div>
        <div className="h-[400px] bg-white rounded-3xl animate-pulse" />
      </div>
    )
  }

  const kpis = [
    { label: 'Time Saved', value: `${data.hours_saved} hrs`, icon: Clock, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { label: 'Messages Handled', value: data.messages_handled, icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { label: 'Reviews Replied', value: data.reviews_replied, icon: Star, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    { label: 'Posts Published', value: data.posts_published, icon: LayoutTemplate, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-blue-600" /> AI Performance Analytics
          </h1>
          <p className="text-gray-500 mt-1">Track how much time your AI agents are saving you (Last 30 Days)</p>
        </div>
        <select className="h-10 rounded-xl border-gray-200 bg-white text-sm font-medium shadow-sm outline-none px-4">
          <option>Last 30 Days</option>
          <option>Last 7 Days</option>
          <option>All Time</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <div key={i} className={`bg-white rounded-3xl border shadow-sm p-6 relative overflow-hidden group ${kpi.border}`}>
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${kpi.bg} opacity-50 group-hover:scale-110 transition-transform`} />
            <div className={`w-12 h-12 rounded-2xl ${kpi.bg} flex items-center justify-center mb-4 relative`}>
              <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
            </div>
            <p className="text-3xl font-bold text-gray-900 relative">{kpi.value}</p>
            <p className="text-sm font-medium text-gray-500 mt-1 relative">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Main Chart */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-lg font-bold text-gray-900">AI Actions Over Time</h2>
            <p className="text-sm text-gray-500 mt-1">Daily breakdown of AI agent activity</p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
            <TrendingUp className="h-4 w-4" /> Trending Up
          </div>
        </div>

        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.chart_data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorReviews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d97706" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ fontSize: '14px', fontWeight: 500 }}
              />
              <Area type="monotone" dataKey="Messages" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorMessages)" />
              <Area type="monotone" dataKey="Reviews" stroke="#d97706" strokeWidth={3} fillOpacity={1} fill="url(#colorReviews)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
