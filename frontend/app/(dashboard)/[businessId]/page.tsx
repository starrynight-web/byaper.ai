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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Overview</h1>
        <p className="text-gray-500 dark:text-gray-400">Here's what your AI has been doing this week.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Posts Published</CardTitle>
            <Megaphone className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.posts_published || 0}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" /> +20% from last week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Messages Handled</CardTitle>
            <MessageSquare className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.messages_handled || 0}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" /> Avg reply: {stats?.avg_response_time_seconds || 0}s
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Reviews Replied</CardTitle>
            <Star className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.reviews_replied || 0}</div>
            <p className="text-xs text-gray-500 mt-1">
              100% reply rate maintained
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-600 text-white">
          <CardHeader className="pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-blue-100">AI Weekly Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">
              "This week I engaged with 42 customers, secured 3 new 5-star reviews, and published a highly engaging post about your weekend special."
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Actions taken by your AI assistant.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-full text-blue-600"><Star className="w-4 h-4" /></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Auto-replied to a 5-star Google Review</p>
                <p className="text-xs text-gray-500">From customer: "Great food!"</p>
              </div>
              <div className="text-xs text-gray-400">10m ago</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-full text-blue-600"><MessageSquare className="w-4 h-4" /></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Replied to Messenger inquiry</p>
                <p className="text-xs text-gray-500">Answered question about opening hours.</p>
              </div>
              <div className="text-xs text-gray-400">1h ago</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 rounded-full text-green-600"><Megaphone className="w-4 h-4" /></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Published Facebook Post</p>
                <p className="text-xs text-gray-500">"Check out our new interior..."</p>
              </div>
              <div className="text-xs text-gray-400">Yesterday</div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Automations Status</CardTitle>
            <CardDescription>Your AI agents</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Facebook Auto-Poster</p>
                <p className="text-xs text-green-600">Active (3 posts/week)</p>
              </div>
              <div className="w-10 h-5 bg-green-500 rounded-full relative">
                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Messenger Auto-Reply</p>
                <p className="text-xs text-green-600">Active (Under 60s)</p>
              </div>
              <div className="w-10 h-5 bg-green-500 rounded-full relative">
                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Review Auto-Reply</p>
                <p className="text-xs text-yellow-600">Drafts Only (Requires Approval)</p>
              </div>
              <div className="w-10 h-5 bg-yellow-400 rounded-full relative">
                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
