'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { fetchWithAuth } from '@/lib/api'
import { Switch } from '@/components/ui/switch'
import { Zap, MessageSquare, Star, Clock, Bot, LayoutTemplate } from 'lucide-react'

type Automation = {
  id: string
  trigger_type: string
  action_type: string
  description: string
  enabled: boolean
  config: Record<string, any>
}

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
        setAutomations(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [businessId])

  const toggleAutomation = async (id: string, currentEnabled: boolean) => {
    // Optimistic UI update
    setAutomations(prev => prev.map(a => a.id === id ? { ...a, enabled: !currentEnabled } : a))
    
    try {
      await fetchWithAuth(`/automations/${id}`, {
        method: 'PUT',
        headers: { 'X-Business-ID': businessId },
        body: JSON.stringify({ enabled: !currentEnabled, config: {} })
      })
    } catch {
      // Revert on error
      setAutomations(prev => prev.map(a => a.id === id ? { ...a, enabled: currentEnabled } : a))
    }
  }

  const getIconForAction = (action_type: string) => {
    switch (action_type) {
      case 'ai_messenger_reply': return <MessageSquare className="h-6 w-6 text-blue-600" />
      case 'ai_review_reply': return <Star className="h-6 w-6 text-amber-600" />
      case 'ai_post_generation': return <LayoutTemplate className="h-6 w-6 text-purple-600" />
      default: return <Bot className="h-6 w-6 text-gray-600" />
    }
  }

  const getBgForAction = (action_type: string) => {
    switch (action_type) {
      case 'ai_messenger_reply': return 'bg-blue-100'
      case 'ai_review_reply': return 'bg-amber-100'
      case 'ai_post_generation': return 'bg-purple-100'
      default: return 'bg-gray-100'
    }
  }

  const getTitle = (action_type: string) => {
    switch (action_type) {
      case 'ai_messenger_reply': return 'Messenger AI Auto-Reply'
      case 'ai_review_reply': return 'Google Review Auto-Reply'
      case 'ai_post_generation': return 'Weekly Post Generation'
      default: return 'Custom Automation'
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
          <Zap className="h-6 w-6 text-amber-500" /> Automations
        </h1>
        <p className="text-gray-500 mt-1">Control which AI agents run on autopilot for your business.</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-white rounded-3xl border border-gray-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6">
          {automations.map(auto => (
            <div 
              key={auto.id} 
              className={`bg-white rounded-3xl border transition-all p-6 sm:p-8 flex flex-col sm:flex-row gap-6 justify-between ${
                auto.enabled ? 'border-blue-200 shadow-sm shadow-blue-50' : 'border-gray-200 opacity-80'
              }`}
            >
              <div className="flex gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${getBgForAction(auto.action_type)}`}>
                  {getIconForAction(auto.action_type)}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{getTitle(auto.action_type)}</h2>
                  <p className="text-gray-500 mt-1 text-sm max-w-lg leading-relaxed">{auto.description}</p>
                  
                  <div className="flex items-center gap-4 mt-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                      <Clock className="h-3 w-3" /> 
                      {auto.trigger_type === 'schedule' ? 'Scheduled' : 'Instant (Webhook)'}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                      <Bot className="h-3 w-3" /> 
                      {auto.config?.model || 'Mistral-7B'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center sm:items-start justify-end sm:justify-start pt-2 sm:pt-0 border-t sm:border-0 border-gray-100">
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-semibold ${auto.enabled ? 'text-blue-600' : 'text-gray-400'}`}>
                    {auto.enabled ? 'Active' : 'Paused'}
                  </span>
                  <Switch 
                    checked={auto.enabled} 
                    onCheckedChange={() => toggleAutomation(auto.id, auto.enabled)} 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
