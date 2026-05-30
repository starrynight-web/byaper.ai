'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { fetchWithAuth } from '@/lib/api'
import { BarChart3, MessageSquare, Star, LayoutTemplate, Clock, TrendingUp } from 'lucide-react'

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

type Period = '7d' | '30d' | '90d'

const PERIOD_LABELS: Record<Period, string> = {
  '7d': 'Last 7 Days',
  '30d': 'Last 30 Days',
  '90d': 'Last 90 Days',
}

export default function AnalyticsPage() {
  const params = useParams()
  const businessId = params?.businessId as string

  const [data, setData] = useState<AnalyticsSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<Period>('30d')

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const result = await fetchWithAuth(
          `/analytics/summary?period=${period}`,
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
  }, [businessId, period])

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
    { label: 'Posts Published', value: data.posts_published, icon: LayoutTemplate, color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-100' },
  ]

  const series = [
    { key: 'Messages' as const, label: 'Messages', color: 'bg-blue-600' },
    { key: 'Reviews' as const, label: 'Reviews', color: 'bg-amber-600' },
    { key: 'Posts' as const, label: 'Posts', color: 'bg-cyan-600' },
  ]

  const chartMax = Math.max(
    1,
    ...data.chart_data.flatMap(point => [point.Messages, point.Reviews, point.Posts])
  )

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-blue-600" /> AI Performance Analytics
          </h1>
          <p className="text-gray-500 mt-1">Track how much time your AI agents are saving you ({PERIOD_LABELS[period]})</p>
        </div>
        <select
          aria-label="Select time period"
          value={period}
          onChange={event => setPeriod(event.target.value as Period)}
          className="h-10 rounded-xl border border-gray-200 bg-white text-sm font-medium shadow-sm outline-none px-4 text-gray-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
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

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {data.chart_data.map(point => (
            <div key={point.name} className="rounded-2xl border border-gray-100 bg-gray-50/40 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-gray-900">{point.name}</p>
                <p className="text-xs text-gray-400">Daily total</p>
              </div>
              <div className="mt-4 flex h-48 items-end gap-3">
                {series.map(item => {
                  const value = point[item.key]
                  const height = Math.max((value / chartMax) * 100, value > 0 ? 8 : 2)

                  return (
                    <div key={item.key} className="flex-1 flex flex-col items-center gap-2 h-full">
                      <div className="flex w-full flex-1 items-end rounded-t-2xl bg-white/70 p-1">
                        <div
                          className={`w-full rounded-t-xl ${item.color}`}
                          style={{ height: `${height}%` }}
                          aria-hidden="true"
                        />
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">{item.label}</p>
                        <p className="text-sm font-bold text-gray-900">{value}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
