'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { fetchWithAuth } from '@/lib/api'
import { Megaphone, MessageSquare, Star, ArrowUpRight, TrendingUp } from 'lucide-react'
import { useWorkspaceStore } from '@/lib/stores/workspaceStore'

export default function DashboardHome() {
  const { activeBusinessId } = useWorkspaceStore()
  const [stats, setStats] = useState<any>(null)
  
  useEffect(() => {
    async function loadStats() {
      try {
        const data = await fetchWithAuth('/analytics/summary')
        setStats(data)
      } catch (err) {
        console.error('Failed to load stats', err)
      }
    }
    if (activeBusinessId) {
      loadStats()
    }
  }, [activeBusinessId])

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Here's what your AI has been doing this week.</p>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 shadow-sm group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Posts Published</CardTitle>
            <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <Megaphone className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-3xl font-black text-slate-900 dark:text-white">{stats?.posts_published || 0}</div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center mt-2 font-semibold">
              <TrendingUp className="w-3.5 h-3.5 mr-1" /> +20% from last week
            </p>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 shadow-sm group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Messages Handled</CardTitle>
            <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <MessageSquare className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-3xl font-black text-slate-900 dark:text-white">{stats?.messages_handled || 0}</div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center mt-2 font-semibold">
              <TrendingUp className="w-3.5 h-3.5 mr-1" /> Avg reply: {stats?.avg_response_time_seconds || 0}s
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 shadow-sm group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Reviews Replied</CardTitle>
            <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <Star className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-3xl font-black text-slate-900 dark:text-white">{stats?.reviews_replied || 0}</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-semibold">
              100% reply rate maintained
            </p>
          </CardContent>
        </Card>
        
        {/* Weekly Summary Card with Electric Sapphire Gradient */}
        <Card className="rounded-2xl border-transparent bg-gradient-to-br from-primary via-blue-600 to-sky-600 text-white hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300 shadow-lg relative overflow-hidden flex flex-col justify-between p-1.5">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
          <CardHeader className="pb-1 space-y-0">
            <CardTitle className="text-xs font-bold text-white/90 uppercase tracking-widest flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-white animate-pulse" />
              AI Weekly Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <p className="text-xs md:text-sm leading-relaxed text-white/90 font-medium italic">
              "This week I engaged with 42 customers, secured 3 new 5-star reviews, and published a highly engaging post about your weekend special."
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Activities and Automations Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activity Timeline card */}
        <Card className="col-span-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-4">
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">Recent Activity</CardTitle>
            <CardDescription className="text-xs text-slate-500">Actions taken by your AI assistant.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 relative">
            {/* Vertical timeline connector */}
            <div className="absolute top-8 bottom-8 left-[38px] w-0.5 bg-slate-100 dark:bg-slate-800" />

            <div className="space-y-6">
              {/* Activity item 1 */}
              <div className="flex items-start gap-4 relative z-10">
                <div className="p-2.5 bg-primary/10 text-primary rounded-xl border-4 border-white dark:border-slate-900 shrink-0">
                  <Star className="w-4 h-4" />
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Auto-replied to a 5-star Google Review</p>
                  <p className="text-xs text-slate-500 mt-0.5">From customer: "Great food!"</p>
                </div>
                <div className="text-xs text-slate-400 pt-1 shrink-0">10m ago</div>
              </div>

              {/* Activity item 2 */}
              <div className="flex items-start gap-4 relative z-10">
                <div className="p-2.5 bg-primary/10 text-primary rounded-xl border-4 border-white dark:border-slate-900 shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Replied to Messenger inquiry</p>
                  <p className="text-xs text-slate-500 mt-0.5">Answered question about opening hours.</p>
                </div>
                <div className="text-xs text-slate-400 pt-1 shrink-0">1h ago</div>
              </div>

              {/* Activity item 3 */}
              <div className="flex items-start gap-4 relative z-10">
                <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl border-4 border-white dark:border-slate-900 shrink-0 dark:bg-emerald-950/30 dark:text-emerald-400">
                  <Megaphone className="w-4 h-4" />
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Published Facebook Post</p>
                  <p className="text-xs text-slate-500 mt-0.5">"Check out our new interior..."</p>
                </div>
                <div className="text-xs text-slate-400 pt-1 shrink-0">Yesterday</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Automations Status Toggles card */}
        <Card className="col-span-3 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-4">
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">Automations Status</CardTitle>
            <CardDescription className="text-xs text-slate-500">Your active AI agent settings</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 flex-1 flex flex-col justify-around gap-6">
            {/* Toggle 1 */}
            <div className="flex items-center justify-between p-1">
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Facebook Auto-Poster</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">Active (3 posts/week)</p>
              </div>
              <div className="w-11 h-6 bg-emerald-500 dark:bg-emerald-600 rounded-full relative cursor-pointer shadow-inner transition-colors duration-300">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform" />
              </div>
            </div>

            {/* Toggle 2 */}
            <div className="flex items-center justify-between p-1">
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Messenger Auto-Reply</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">Active (Under 60s)</p>
              </div>
              <div className="w-11 h-6 bg-emerald-500 dark:bg-emerald-600 rounded-full relative cursor-pointer shadow-inner transition-colors duration-300">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform" />
              </div>
            </div>

            {/* Toggle 3 */}
            <div className="flex items-center justify-between p-1">
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Review Auto-Reply</p>
                <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-0.5">Drafts Only (Requires Approval)</p>
              </div>
              <div className="w-11 h-6 bg-amber-400 dark:bg-amber-500 rounded-full relative cursor-pointer shadow-inner transition-colors duration-300">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
