'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { fetchWithAuth } from '@/lib/api'
import { Megaphone, MessageSquare, Star, TrendingUp } from 'lucide-react'
import { useWorkspaceStore } from '@/lib/stores/workspaceStore'
import { motion } from 'framer-motion'

type AnalyticsSummary = {
  posts_published?: number
  messages_handled?: number
  reviews_replied?: number
  avg_response_time_seconds?: number
}

const fadeInUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } }
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
}

export default function DashboardHome() {
  const { activeBusinessId } = useWorkspaceStore()
  const [stats, setStats] = useState<AnalyticsSummary | null>(null)

  const [automations, setAutomations] = useState({
    facebookAutoPoster: true,
    messengerAutoReply: true,
    reviewAutoReplyDraftsOnly: true,
  })
  
  useEffect(() => {
    async function loadStats() {
      try {
        const data = await fetchWithAuth('/analytics/summary')
        setStats(data as AnalyticsSummary)
      } catch (err) {
        console.error('Failed to load stats', err)
      }
    }
    if (activeBusinessId) {
      loadStats()
    }
  }, [activeBusinessId])

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="space-y-8"
    >
      <motion.div variants={fadeInUp} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Here&apos;s what your AI has been doing this week.</p>
        </div>
      </motion.div>

      {/* Stats Cards Row */}
      <motion.div 
        variants={staggerContainer}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        <motion.div 
          variants={fadeInUp}
          whileHover={{ y: -4, scale: 1.015, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.05)' }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm group p-6 flex flex-col justify-between"
        >
          <div>
            <div className="flex flex-row items-center justify-between pb-2">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Posts Published</span>
              <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <Megaphone className="w-4 h-4" />
              </div>
            </div>
            <div className="pt-2">
              <div className="text-3xl font-black text-slate-900 dark:text-white">{stats?.posts_published || 0}</div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center mt-2 font-semibold">
                <TrendingUp className="w-3.5 h-3.5 mr-1" /> +20% from last week
              </p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          variants={fadeInUp}
          whileHover={{ y: -4, scale: 1.015, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.05)' }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm group p-6 flex flex-col justify-between"
        >
          <div>
            <div className="flex flex-row items-center justify-between pb-2">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Messages Handled</span>
              <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
            <div className="pt-2">
              <div className="text-3xl font-black text-slate-900 dark:text-white">{stats?.messages_handled || 0}</div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center mt-2 font-semibold">
                <TrendingUp className="w-3.5 h-3.5 mr-1" /> Avg reply: {stats?.avg_response_time_seconds || 0}s
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          variants={fadeInUp}
          whileHover={{ y: -4, scale: 1.015, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.05)' }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm group p-6 flex flex-col justify-between"
        >
          <div>
            <div className="flex flex-row items-center justify-between pb-2">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Reviews Replied</span>
              <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <Star className="w-4 h-4" />
              </div>
            </div>
            <div className="pt-2">
              <div className="text-3xl font-black text-slate-900 dark:text-white">{stats?.reviews_replied || 0}</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-semibold">
                100% reply rate maintained
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* Weekly Summary Card with Electric Sapphire Gradient */}
        <motion.div 
          variants={fadeInUp}
          whileHover={{ y: -4, scale: 1.015, boxShadow: '0 20px 25px -5px rgba(38, 86, 229, 0.15)' }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="rounded-2xl border-transparent bg-gradient-to-br from-primary via-blue-600 to-sky-600 text-white shadow-lg relative overflow-hidden flex flex-col justify-between p-6"
        >
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
          <div className="pb-1">
            <span className="text-xs font-bold text-white/90 uppercase tracking-widest flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-white animate-pulse" />
              AI Weekly Summary
            </span>
          </div>
          <div className="pb-4 mt-4">
            <p className="text-xs md:text-sm leading-relaxed text-white/90 font-medium italic">
              &quot;This week I engaged with 42 customers, secured 3 new 5-star reviews, and published a highly engaging post about your weekend special.&quot;
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Activities and Automations Grid */}
      <motion.div variants={fadeInUp} className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activity Timeline card */}
        <Card className="col-span-1 lg:col-span-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-4">
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">Recent Activity</CardTitle>
            <CardDescription className="text-xs text-slate-500">Actions taken by your AI assistant.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 relative">
            {/* Vertical timeline connector */}
            <div className="absolute top-8 bottom-8 left-[38px] w-0.5 bg-slate-100 dark:bg-slate-800" />

            <div className="space-y-6">
              {/* Activity item 1 */}
              <motion.div 
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
                className="flex items-start gap-4 relative z-10"
              >
                <div className="p-2.5 bg-primary/10 text-primary rounded-xl border-4 border-white dark:border-slate-900 shrink-0">
                  <Star className="w-4 h-4" />
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Auto-replied to a 5-star Google Review</p>
                  <p className="text-xs text-slate-500 mt-0.5">From customer: &quot;Great food!&quot;</p>
                </div>
                <div className="text-xs text-slate-400 pt-1 shrink-0">10m ago</div>
              </motion.div>

              {/* Activity item 2 */}
              <motion.div 
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
                className="flex items-start gap-4 relative z-10"
              >
                <div className="p-2.5 bg-primary/10 text-primary rounded-xl border-4 border-white dark:border-slate-900 shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Replied to Messenger inquiry</p>
                  <p className="text-xs text-slate-500 mt-0.5">Answered question about opening hours.</p>
                </div>
                <div className="text-xs text-slate-400 pt-1 shrink-0">1h ago</div>
              </motion.div>

              {/* Activity item 3 */}
              <motion.div 
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
                className="flex items-start gap-4 relative z-10"
              >
                <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl border-4 border-white dark:border-slate-900 shrink-0 dark:bg-emerald-950/30 dark:text-emerald-400">
                  <Megaphone className="w-4 h-4" />
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Published Facebook Post</p>
                  <p className="text-xs text-slate-500 mt-0.5">&quot;Check out our new interior...&quot;</p>
                </div>
                <div className="text-xs text-slate-400 pt-1 shrink-0">Yesterday</div>
              </motion.div>
            </div>
          </CardContent>
        </Card>

        {/* Automations Status Toggles card */}
        <Card className="col-span-1 lg:col-span-3 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-4">
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">Automations Status</CardTitle>
            <CardDescription className="text-xs text-slate-500">Your active AI agent settings</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 flex-1 flex flex-col justify-around gap-6">
            {/* Toggle 1 */}
            <div className="flex items-center justify-between p-1">
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Facebook Auto-Poster</p>
                <p className={automations.facebookAutoPoster ? "text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5" : "text-xs text-slate-400 dark:text-slate-500 font-semibold mt-0.5"}>
                  {automations.facebookAutoPoster ? 'Active (3 posts/week)' : 'Paused'}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={automations.facebookAutoPoster}
                onClick={() => setAutomations((s) => ({ ...s, facebookAutoPoster: !s.facebookAutoPoster }))}
                className={
                  "w-11 h-6 rounded-full relative shadow-inner transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 " +
                  (automations.facebookAutoPoster ? "bg-emerald-500 dark:bg-emerald-600" : "bg-slate-200 dark:bg-slate-700")
                }
              >
                <motion.span
                  animate={{ x: automations.facebookAutoPoster ? 20 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md"
                />
              </button>
            </div>

            {/* Toggle 2 */}
            <div className="flex items-center justify-between p-1">
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Messenger Auto-Reply</p>
                <p className={automations.messengerAutoReply ? "text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5" : "text-xs text-slate-400 dark:text-slate-500 font-semibold mt-0.5"}>
                  {automations.messengerAutoReply ? 'Active (Under 60s)' : 'Paused'}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={automations.messengerAutoReply}
                onClick={() => setAutomations((s) => ({ ...s, messengerAutoReply: !s.messengerAutoReply }))}
                className={
                  "w-11 h-6 rounded-full relative shadow-inner transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 " +
                  (automations.messengerAutoReply ? "bg-emerald-500 dark:bg-emerald-600" : "bg-slate-200 dark:bg-slate-700")
                }
              >
                <motion.span
                  animate={{ x: automations.messengerAutoReply ? 20 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md"
                />
              </button>
            </div>

            {/* Toggle 3 */}
            <div className="flex items-center justify-between p-1">
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Review Auto-Reply</p>
                <p className={automations.reviewAutoReplyDraftsOnly ? "text-xs text-amber-600 dark:text-amber-400 font-semibold mt-0.5" : "text-xs text-slate-400 dark:text-slate-500 font-semibold mt-0.5"}>
                  {automations.reviewAutoReplyDraftsOnly ? 'Drafts Only (Requires Approval)' : 'Off'}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={automations.reviewAutoReplyDraftsOnly}
                onClick={() => setAutomations((s) => ({ ...s, reviewAutoReplyDraftsOnly: !s.reviewAutoReplyDraftsOnly }))}
                className={
                  "w-11 h-6 rounded-full relative shadow-inner transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 " +
                  (automations.reviewAutoReplyDraftsOnly ? "bg-amber-400 dark:bg-amber-500" : "bg-slate-200 dark:bg-slate-700")
                }
              >
                <motion.span
                  animate={{ x: automations.reviewAutoReplyDraftsOnly ? 20 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md"
                />
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
