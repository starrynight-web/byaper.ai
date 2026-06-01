'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { fetchWithAuth } from '@/lib/api'
import { Zap, MessageSquare, Star, LayoutTemplate, Bot } from 'lucide-react'
import { BusinessKnowledgeForm } from '@/components/automations/BusinessKnowledgeForm'
import { AutomationCard, type Automation } from '@/components/automations/AutomationCard'

export default function AutomationsPage() {
  const params = useParams()
  const businessId = params?.businessId as string

  const [automations, setAutomations] = useState<Automation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const data = await fetchWithAuth(
          `/automations`,
          { headers: { 'X-Business-ID': businessId } }
        )
        setAutomations(Array.isArray(data) ? data as Automation[] : [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [businessId])

  const handleUpdate = (id: string, updates: Partial<Automation>) => {
    setAutomations(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a))
  }

  const getIconForType = (type: string) => {
    switch (type) {
      case 'messenger_reply': return <MessageSquare className="h-6 w-6 text-blue-600" />
      case 'review_reply': return <Star className="h-6 w-6 text-amber-600" />
      case 'post_scheduler': return <LayoutTemplate className="h-6 w-6 text-indigo-600" />
      default: return <Bot className="h-6 w-6 text-gray-600" />
    }
  }

  const getBgForType = (type: string) => {
    switch (type) {
      case 'messenger_reply': return 'bg-blue-100'
      case 'review_reply': return 'bg-amber-100'
      case 'post_scheduler': return 'bg-indigo-100'
      default: return 'bg-gray-100'
    }
  }

  const getTitle = (type: string) => {
    switch (type) {
      case 'messenger_reply': return 'Messenger AI Auto-Reply'
      case 'review_reply': return 'Google Review Auto-Reply'
      case 'post_scheduler': return 'AI Post Generation & Scheduling'
      default: return 'Custom Automation'
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
          <Zap className="h-6 w-6 text-amber-500" /> 24/7 AI Automation Hub
        </h1>
        <p className="text-gray-500 mt-1">Configure your AI agents to automatically handle customers and marketing.</p>
      </div>

      {/* Step 1: Business Context */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
            Teach your AI Agent
          </h2>
          <p className="text-sm text-gray-500 ml-8">Fill this out so the AI knows how to answer customer questions.</p>
        </div>
        <BusinessKnowledgeForm businessId={businessId} />
      </section>

      {/* Step 2: Automation Controls */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="bg-indigo-100 text-indigo-800 w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
            Activate AI Agents
          </h2>
          <p className="text-sm text-gray-500 ml-8">Turn on the agents and choose whether they send automatically (24/7 Mode) or save as drafts.</p>
        </div>
        
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-40 bg-white rounded-3xl border border-gray-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6">
            {automations.map(auto => (
              <AutomationCard
                key={auto.id}
                businessId={businessId}
                automation={auto}
                icon={getIconForType(auto.type)}
                bgColor={getBgForType(auto.type)}
                title={getTitle(auto.type)}
                onUpdate={handleUpdate}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
