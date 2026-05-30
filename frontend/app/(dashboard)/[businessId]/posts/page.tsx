'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { fetchWithAuth } from '@/lib/api'
import { useWorkspaceStore } from '@/lib/stores/workspaceStore'
import PostComposerModal from '@/components/posts/PostComposerModal'
import { Button } from '@/components/ui/button'
import {
  PlusIcon,
  CalendarIcon,
  ImageIcon,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Megaphone,
  RefreshCw,
} from 'lucide-react'

type Post = {
  id: string
  content: string
  image_url?: string
  status: 'draft' | 'scheduled' | 'published' | 'failed'
  scheduled_time?: string
  platform: string
  created_at: string
}

const STATUS_CONFIG = {
  draft:     { label: 'Draft',     icon: FileText,      bg: 'bg-gray-100',   text: 'text-gray-600',   dot: 'bg-gray-400'  },
  scheduled: { label: 'Scheduled', icon: Clock,         bg: 'bg-blue-50',    text: 'text-blue-700',   dot: 'bg-blue-500'  },
  published: { label: 'Published', icon: CheckCircle2,  bg: 'bg-green-50',   text: 'text-green-700',  dot: 'bg-green-500' },
  failed:    { label: 'Failed',    icon: XCircle,       bg: 'bg-red-50',     text: 'text-red-700',    dot: 'bg-red-500'   },
}

const TABS = [
  { key: 'all',       label: 'All Posts' },
  { key: 'draft',     label: 'Drafts' },
  { key: 'scheduled', label: 'Scheduled' },
  { key: 'published', label: 'Published' },
] as const

type TabKey = (typeof TABS)[number]['key']

export default function PostsPage() {
  const params = useParams()
  const businessId = params?.businessId as string
  const { activeBusinessId } = useWorkspaceStore()

  const [posts, setPosts] = useState<Post[]>([])
  const [tab, setTab] = useState<TabKey>('all')
  const [loading, setLoading] = useState(true)
  const [composerOpen, setComposerOpen] = useState(false)

  const loadPosts = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchWithAuth(
        `/posts${tab !== 'all' ? `?status=${tab}` : ''}`,
        { headers: { 'X-Business-ID': businessId } }
      )
      setPosts(Array.isArray(data) ? data : [])
    } catch {
      // demo mode fallback
      setPosts(DEMO_POSTS)
    } finally {
      setLoading(false)
    }
  }, [businessId, tab])

  useEffect(() => {
    loadPosts()
  }, [loadPosts])

  const filtered = tab === 'all' ? posts : posts.filter(p => p.status === tab)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Posts</h1>
          <p className="text-sm text-gray-500 mt-1">AI-generated content for your Facebook page.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadPosts}
            className="text-gray-600 border-gray-200 hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4 mr-1.5" />
            Refresh
          </Button>
          <Button
            onClick={() => setComposerOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-100 rounded-full px-5"
          >
            <PlusIcon className="h-4 w-4 mr-1.5" />
            Create Post
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100/80 rounded-xl w-fit">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              tab === t.key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
            {t.key !== 'all' && (
              <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                tab === t.key ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-500'
              }`}>
                {posts.filter(p => p.status === t.key).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Post Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl bg-gray-100 animate-pulse h-72" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState onCreatePost={() => setComposerOpen(true)} tab={tab} />
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(post => (
            <PostCard key={post.id} post={post} onRefresh={loadPosts} businessId={businessId} />
          ))}
        </div>
      )}

      {/* Composer Modal */}
      <PostComposerModal
        open={composerOpen}
        onClose={() => setComposerOpen(false)}
        onSuccess={() => { setComposerOpen(false); loadPosts() }}
        businessId={businessId}
      />
    </div>
  )
}

function PostCard({ post, onRefresh, businessId }: { post: Post; onRefresh: () => void; businessId: string }) {
  const cfg = STATUS_CONFIG[post.status]
  const StatusIcon = cfg.icon
  const [scheduling, setScheduling] = useState(false)

  const handleSchedule = async () => {
    setScheduling(true)
    try {
      await fetchWithAuth(`/posts/${post.id}/schedule`, {
        method: 'POST',
        headers: { 'X-Business-ID': businessId },
        body: JSON.stringify({ scheduled_time: new Date().toISOString() }),
      })
      onRefresh()
    } catch {
      // demo: just refresh
      onRefresh()
    } finally {
      setScheduling(false)
    }
  }

  return (
    <div className="group rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
      {/* Image */}
      {post.image_url ? (
        <div className="relative h-44 overflow-hidden bg-gray-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.image_url}
            alt="Post visual"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      ) : (
        <div className="h-44 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <ImageIcon className="h-10 w-10 text-blue-200" />
        </div>
      )}

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        {/* Status badge */}
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </span>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Megaphone className="h-3 w-3" />
            {post.platform}
          </span>
        </div>

        {/* Caption */}
        <p className="text-sm text-gray-700 leading-relaxed line-clamp-3 flex-1">
          {post.content}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          {post.scheduled_time ? (
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <CalendarIcon className="h-3 w-3" />
              {new Date(post.scheduled_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
          ) : (
            <span className="text-xs text-gray-400">
              {new Date(post.created_at).toLocaleDateString()}
            </span>
          )}
          {post.status === 'draft' && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleSchedule}
              disabled={scheduling}
              className="text-xs h-7 rounded-full border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              {scheduling ? 'Scheduling...' : 'Schedule'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function EmptyState({ onCreatePost, tab }: { onCreatePost: () => void; tab: TabKey }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 rounded-2xl border border-dashed border-gray-200 bg-gray-50/50">
      <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mb-4">
        <Megaphone className="h-8 w-8 text-blue-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-1">
        {tab === 'all' ? 'No posts yet' : `No ${tab} posts`}
      </h3>
      <p className="text-sm text-gray-500 mb-6 text-center max-w-xs">
        {tab === 'all'
          ? 'Generate your first AI-powered Facebook post with one click.'
          : `You have no posts with "${tab}" status.`}
      </p>
      {tab === 'all' && (
        <Button
          onClick={onCreatePost}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Create First Post
        </Button>
      )}
    </div>
  )
}

// Demo data for testing without backend
const DEMO_POSTS: Post[] = [
  {
    id: '1', content: '🌟 এই সপ্তাহের বিশেষ অফার! আমাদের নতুন মেনু আইটেম চেষ্টা করুন এবং ২০% ছাড় পান। আজই আসুন!\n\n#DemoCafe #Dhaka #BestFood',
    image_url: 'https://image.pollinations.ai/prompt/cozy%20cafe%20interior%20bangladesh%20warm%20lighting?width=800&height=600&nologo=true',
    status: 'published', platform: 'facebook', created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '2', content: '☕ Start your morning right! Our freshly brewed coffee and homemade pastries are waiting for you. Come visit us at Demo Cafe & Bakery, Dhaka.\n\n#MorningVibes #Coffee #Bakery',
    image_url: 'https://image.pollinations.ai/prompt/fresh%20coffee%20pastries%20bakery%20morning?width=800&height=600&nologo=true',
    status: 'scheduled', scheduled_time: new Date(Date.now() + 86400000).toISOString(), platform: 'facebook', created_at: new Date().toISOString(),
  },
  {
    id: '3', content: 'আমাদের নতুন উইকেন্ড স্পেশাল মেনু এসে গেছে! প্রিয় গ্রাহকদের জন্য বিশেষ ছাড়। রবিবার পর্যন্ত।',
    status: 'draft', platform: 'facebook', created_at: new Date().toISOString(),
  },
]
