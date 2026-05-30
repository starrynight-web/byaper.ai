'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { fetchWithAuth } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { 
  Building2, MapPin, Eye, MousePointerClick, 
  Search, Phone, AlertCircle, CheckCircle2, TrendingUp, Sparkles
} from 'lucide-react'

type ProfileData = {
  score: number
  missing_fields: string[]
  recommendations: string[]
  is_connected: boolean
}

type InsightsData = {
  views: number
  searches: number
  clicks: number
  calls: number
  directions: number
  trend_percentage: number
}

export default function GBPPage() {
  const params = useParams()
  const businessId = params?.businessId as string

  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [insights, setInsights] = useState<InsightsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const [profData, insData] = await Promise.all([
          fetchWithAuth(`/gbp/profile`, { headers: { 'X-Business-ID': businessId } }),
          fetchWithAuth(`/gbp/insights`, { headers: { 'X-Business-ID': businessId } })
        ])
        setProfile(profData)
        setInsights(insData)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [businessId])

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="h-40 bg-white rounded-3xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 bg-white rounded-3xl animate-pulse" />
          <div className="h-32 bg-white rounded-3xl animate-pulse" />
          <div className="h-32 bg-white rounded-3xl animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Google Business Profile</h1>
        <p className="text-gray-500 mt-1">Manage your local search presence</p>
      </div>

      {!profile?.is_connected ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center flex flex-col items-center shadow-sm">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
            <Building2 className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Connect your Google Business Profile</h2>
          <p className="text-gray-500 max-w-md mb-8">
            Sync your account to manage reviews, track search performance, and get AI recommendations to rank higher on Google Maps.
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700 h-12 px-8 rounded-xl text-base">
            Connect with Google
          </Button>
        </div>
      ) : (
        <>
          {/* Top Cards: Score & AI Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Score Card */}
            <div className="lg:col-span-1 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="relative w-32 h-32 mb-4">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-100"
                    strokeWidth="3"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={profile.score >= 80 ? "text-green-500" : profile.score >= 50 ? "text-amber-500" : "text-red-500"}
                    strokeDasharray={`${profile.score}, 100`}
                    strokeWidth="3"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-3xl font-bold text-gray-900">{profile.score}</span>
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mt-1">Score</span>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900">Profile Optimization</h3>
              <p className="text-sm text-gray-500 mt-1">
                {profile.score >= 80 ? 'Excellent! Your profile is highly visible.' : 'Needs improvement to rank higher.'}
              </p>
            </div>

            {/* Recommendations Card */}
            <div className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 shadow-md text-white">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="h-5 w-5 text-blue-200" />
                <h3 className="text-lg font-bold">AI Advisor Recommendations</h3>
              </div>
              <div className="space-y-4">
                {profile.recommendations.map((rec, i) => (
                  <div key={i} className="flex gap-3 items-start bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
                    {profile.score >= 80 ? (
                      <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-amber-300 shrink-0 mt-0.5" />
                    )}
                    <p className="text-blue-50 text-sm leading-relaxed font-medium">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Performance Insights */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">30-Day Performance</h2>
              {insights?.trend_percentage && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                  <TrendingUp className="h-4 w-4" /> +{insights.trend_percentage}%
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { label: 'Views', value: insights?.views, icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Searches', value: insights?.searches, icon: Search, color: 'text-cyan-600', bg: 'bg-cyan-50' },
                { label: 'Clicks', value: insights?.clicks, icon: MousePointerClick, color: 'text-amber-600', bg: 'bg-amber-50' },
                { label: 'Calls', value: insights?.calls, icon: Phone, color: 'text-green-600', bg: 'bg-green-50' },
                { label: 'Directions', value: insights?.directions, icon: MapPin, color: 'text-rose-600', bg: 'bg-rose-50' },
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <div className={`w-8 h-8 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value?.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 font-medium mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
