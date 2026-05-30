'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { fetchWithAuth } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Star, MessageSquare, Send, CheckCircle2, Clock, RefreshCw, Sparkles, Building2 } from 'lucide-react'

type Review = {
  id: string
  google_review_id: string
  reviewer_name: string
  rating: number
  review_text: string
  ai_reply_draft?: string
  posted_reply?: string
  reply_status: 'pending' | 'approved' | 'posted' | 'failed'
  review_date: string
}

export default function ReviewsPage() {
  const params = useParams()
  const businessId = params?.businessId as string

  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  const loadReviews = async () => {
    setLoading(true)
    try {
      const data = await fetchWithAuth(
        `/reviews`,
        { headers: { 'X-Business-ID': businessId } }
      )
      setReviews(data)
    } catch {
      setReviews([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReviews()
  }, [businessId])

  const handleSync = async () => {
    setSyncing(true)
    try {
      await fetchWithAuth(`/reviews/sync`, {
        method: 'POST',
        headers: { 'X-Business-ID': businessId }
      })
      await loadReviews()
    } finally {
      setSyncing(false)
    }
  }

  const pendingReviews = reviews.filter(r => r.reply_status === 'pending')
  const repliedReviews = reviews.filter(r => r.reply_status === 'posted')

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Google Reviews</h1>
          <p className="text-gray-500 mt-1">AI-assisted reputation management</p>
        </div>
        <Button 
          onClick={handleSync} 
          disabled={syncing}
          className="bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin text-blue-600' : ''}`} />
          {syncing ? 'Syncing...' : 'Sync from Google'}
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="h-64 bg-white rounded-3xl border border-gray-100 animate-pulse" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Star className="h-8 w-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No reviews found</h3>
          <p className="text-gray-500 max-w-sm mb-6">Connect your Google Business Profile and sync to pull in your latest customer reviews.</p>
          <Button onClick={handleSync} className="bg-blue-600 hover:bg-blue-700">Sync Now</Button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Action Required Section */}
          {pendingReviews.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-amber-600 flex items-center gap-2 mb-4">
                <Clock className="h-4 w-4" /> Action Required ({pendingReviews.length})
              </h2>
              <div className="space-y-4">
                {pendingReviews.map(review => (
                  <ReviewCard key={review.id} review={review} businessId={businessId} onRefresh={loadReviews} />
                ))}
              </div>
            </section>
          )}

          {/* Replied Section */}
          {repliedReviews.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-green-600 flex items-center gap-2 mb-4">
                <CheckCircle2 className="h-4 w-4" /> Replied ({repliedReviews.length})
              </h2>
              <div className="space-y-4">
                {repliedReviews.map(review => (
                  <ReviewCard key={review.id} review={review} businessId={businessId} onRefresh={loadReviews} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}

function ReviewCard({ review, businessId, onRefresh }: { review: Review; businessId: string; onRefresh: () => void }) {
  const [editedReply, setEditedReply] = useState(review.ai_reply_draft || '')
  const [sending, setSending] = useState(false)

  const handleSend = async (type: 'approve' | 'override') => {
    setSending(true)
    try {
      if (type === 'approve') {
        await fetchWithAuth(`/reviews/${review.id}/approve`, {
          method: 'PUT',
          headers: { 'X-Business-ID': businessId }
        })
      } else {
        await fetchWithAuth(`/reviews/${review.id}/override-reply`, {
          method: 'PUT',
          headers: { 'X-Business-ID': businessId },
          body: JSON.stringify({ reply_text: editedReply })
        })
      }
      onRefresh()
    } catch {
      onRefresh()
    } finally {
      setSending(false)
    }
  }

  const dateStr = new Date(review.review_date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  })

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
      {/* Customer Review Top Section */}
      <div className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
              <span className="text-lg font-bold text-gray-500">{review.reviewer_name.charAt(0)}</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{review.reviewer_name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} 
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-400">· {dateStr}</span>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-lg text-xs font-medium text-gray-500 border border-gray-100">
            <Building2 className="h-3.5 w-3.5" /> Google Review
          </div>
        </div>

        <p className="text-gray-700 text-sm leading-relaxed">{review.review_text}</p>
      </div>

      {/* Reply Section */}
      {review.reply_status === 'pending' ? (
        <div className="bg-blue-50/30 p-6 sm:p-8 border-t border-blue-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-900">AI Suggested Reply</span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-blue-100 p-2 shadow-sm mb-4">
            <Textarea
              value={editedReply}
              onChange={e => setEditedReply(e.target.value)}
              className="border-0 focus-visible:ring-0 resize-none text-sm text-gray-800 min-h-[100px]"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500 text-center sm:text-left">
              Review and edit before posting publicly to Google.
            </p>
            <div className="flex gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() => handleSend('override')}
                disabled={sending || editedReply === review.ai_reply_draft}
                className="flex-1 sm:flex-none rounded-xl"
              >
                Post Edited
              </Button>
              <Button
                onClick={() => handleSend('approve')}
                disabled={sending}
                className="flex-1 sm:flex-none rounded-xl bg-blue-600 hover:bg-blue-700"
              >
                <Send className="w-4 h-4 mr-2" />
                Approve & Post
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 p-6 sm:p-8 border-t border-gray-100">
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
              <Building2 className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-gray-900">Business Owner</span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-green-600 flex items-center gap-1 bg-green-50 px-1.5 py-0.5 rounded">
                  <CheckCircle2 className="w-3 h-3" /> Posted
                </span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{review.posted_reply}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
