'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { fetchWithAuth } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import {
  MessageSquare, Search, Send, CheckCircle2,
  Clock, Bot, User as UserIcon, RefreshCw, Sparkles, ArrowLeft
} from 'lucide-react'

type Message = {
  id: string
  sender_name: string
  message_text: string
  ai_reply_draft?: string
  reply_text?: string
  reply_status: 'pending' | 'approved' | 'sent' | 'failed'
  is_read: boolean
  received_at: string
}

const TABS = [
  { key: 'all', label: 'All Messages' },
  { key: 'pending', label: 'Action Required' },
  { key: 'sent', label: 'Resolved' },
] as const

type TabKey = (typeof TABS)[number]['key']

export default function MessagesPage() {
  const params = useParams()
  const businessId = params?.businessId as string

  const [messages, setMessages] = useState<Message[]>([])
  const [tab, setTab] = useState<TabKey>('pending')
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeMsgId, setActiveMsgId] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const data = await fetchWithAuth(
          `/messages`,
          { headers: { 'X-Business-ID': businessId } }
        )
        setMessages(data)
      } catch {
        setMessages([])
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [businessId])

  const loadMessages = async () => {
    setLoading(true)
    try {
      const data = await fetchWithAuth(
        `/messages`,
        { headers: { 'X-Business-ID': businessId } }
      )
      setMessages(data)
    } catch {
      setMessages([])
    } finally {
      setLoading(false)
    }
  }

  const filtered = messages
    .filter(m => (tab === 'all' ? true : tab === 'pending' ? m.reply_status === 'pending' : m.reply_status !== 'pending'))
    .filter(m => m.sender_name?.toLowerCase().includes(search.toLowerCase()) || m.message_text.toLowerCase().includes(search.toLowerCase()))

  const activeMsg = filtered.find(m => m.id === activeMsgId) ?? null

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">Messenger Inbox</h1>
            <p className="text-xs text-gray-500">AI-assisted customer support</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={loadMessages} className="text-gray-600 border-gray-200">
          <RefreshCw className="h-4 w-4 mr-1.5" /> Refresh
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Conversation List */}
        <div className={`${activeMsg ? 'hidden md:flex' : 'flex'} w-full md:w-80 flex-col border-r border-gray-100 bg-white`}>
          {/* Tabs & Search */}
          <div className="p-4 border-b border-gray-50 space-y-3">
            <div className="grid grid-cols-3 gap-1 p-1 bg-gray-100 rounded-lg w-full">
              {TABS.map(t => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`h-8 px-1.5 text-[10px] font-medium rounded-md transition-all min-w-0 truncate flex items-center justify-center ${
                    tab === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search messages..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 h-9 rounded-lg border-gray-200 bg-gray-50 text-sm"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-gray-100 shrink-0" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-100 rounded w-1/2" />
                      <div className="h-3 bg-gray-100 rounded w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">
                No conversations found.
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {filtered.map(msg => (
                  <button
                    key={msg.id}
                    onClick={() => setActiveMsgId(msg.id)}
                    className={`w-full text-left p-4 hover:bg-gray-50 transition-colors flex gap-3 ${
                      activeMsgId === msg.id ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                        <UserIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      {!msg.is_read && (
                        <div className="absolute top-0 right-0 w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm font-semibold truncate ${!msg.is_read ? 'text-gray-900' : 'text-gray-700'}`}>
                          {msg.sender_name}
                        </span>
                        <span className="text-xs text-gray-400 shrink-0">
                          {new Date(msg.received_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className={`text-xs truncate ${!msg.is_read ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
                        {msg.message_text}
                      </p>
                      <div className="mt-2 flex items-center gap-1.5">
                        {msg.reply_status === 'pending' ? (
                          <span className="text-[10px] uppercase font-bold tracking-wider text-amber-600 flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded">
                            <Clock className="w-3 h-3" /> Action Needed
                          </span>
                        ) : msg.reply_status === 'sent' ? (
                          <span className="text-[10px] uppercase font-bold tracking-wider text-green-600 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Resolved
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Pane - Chat View */}
        <div className={`${activeMsg ? 'flex' : 'hidden md:flex'} flex-1 flex-col bg-gray-50/30`}>
          {activeMsg ? (
            <ChatPane key={activeMsg.id} msg={activeMsg} businessId={businessId} onRefresh={loadMessages} onBack={() => setActiveMsgId(null)} />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
              <MessageSquare className="h-12 w-12 mb-4 text-gray-200" />
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ChatPane({ msg, businessId, onRefresh, onBack }: { msg: Message; businessId: string; onRefresh: () => void; onBack: () => void }) {
  const [editedReply, setEditedReply] = useState(msg.ai_reply_draft || '')
  const [sending, setSending] = useState(false)

  const handleSend = async (type: 'approve' | 'override') => {
    setSending(true)
    try {
      if (type === 'approve') {
        await fetchWithAuth(`/messages/${msg.id}/approve`, {
          method: 'PUT',
          headers: { 'X-Business-ID': businessId }
        })
      } else {
        await fetchWithAuth(`/messages/${msg.id}/override-reply`, {
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

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Customer profile header */}
      <div className="h-16 border-b border-gray-100 flex items-center px-6 bg-white shrink-0">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="md:hidden -ml-2 h-9 w-9 rounded-full"
            aria-label="Back to inbox"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
            <UserIcon className="h-4 w-4 text-gray-500" />
          </div>
          <h2 className="font-semibold text-gray-900">{msg.sender_name}</h2>
        </div>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Customer Message */}
        <div className="flex gap-4">
          <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0 flex items-center justify-center mt-1">
            <UserIcon className="h-4 w-4 text-gray-500" />
          </div>
          <div>
            <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-sm shadow-sm max-w-lg">
              <p className="text-sm text-gray-800">{msg.message_text}</p>
            </div>
            <p className="text-xs text-gray-400 mt-1 ml-1">
              {new Date(msg.received_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        {/* Resolved Reply */}
        {msg.reply_status === 'sent' && msg.reply_text && (
          <div className="flex gap-4 flex-row-reverse">
            <div className="w-8 h-8 rounded-full bg-blue-600 shrink-0 flex items-center justify-center mt-1 shadow-sm">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="flex flex-col items-end">
              <div className="bg-blue-600 text-white p-4 rounded-2xl rounded-tr-sm shadow-sm max-w-lg">
                <p className="text-sm">{msg.reply_text}</p>
              </div>
              <p className="text-xs text-gray-400 mt-1 mr-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Replied by AI
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Draft Area (if pending) */}
      {msg.reply_status === 'pending' && (
        <div className="p-6 bg-white border-t border-gray-100 shrink-0">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <h3 className="text-sm font-semibold text-gray-800">AI Draft Suggestion</h3>
          </div>
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-2 mb-4">
            <Textarea
              value={editedReply}
              onChange={e => setEditedReply(e.target.value)}
              className="border-0 bg-transparent focus-visible:ring-0 resize-none text-sm text-gray-800 min-h-[80px]"
            />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">You can edit this draft before sending.</p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleSend('override')}
                disabled={sending || editedReply === msg.ai_reply_draft}
                className="rounded-full"
              >
                Send Edited
              </Button>
              <Button
                onClick={() => handleSend('approve')}
                disabled={sending}
                className="rounded-full bg-blue-600 hover:bg-blue-700"
              >
                <Send className="w-4 h-4 mr-2" />
                Approve & Send Draft
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
