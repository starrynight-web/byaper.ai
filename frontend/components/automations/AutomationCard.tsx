import { Switch } from '@/components/ui/switch'
import { Clock, Bot, Rocket } from 'lucide-react'
import { type ReactNode, useState } from 'react'
import { fetchWithAuth } from '@/lib/api'

export type Automation = {
  id: string
  type: string
  description?: string
  enabled: boolean
  full_auto_mode: boolean
  last_run_at?: string | null
  config?: {
    model?: string
  }
}

export function AutomationCard({
  businessId,
  automation,
  icon,
  bgColor,
  title,
  onUpdate
}: {
  businessId: string,
  automation: Automation,
  icon: ReactNode,
  bgColor: string,
  title: string,
  onUpdate: (id: string, updates: Partial<Automation>) => void
}) {
  const [updating, setUpdating] = useState(false)

  const handleToggle = async (enabled: boolean) => {
    setUpdating(true)
    onUpdate(automation.id, { ...automation, enabled })
    try {
      await fetchWithAuth(`/automations/${automation.id}`, {
        method: 'PUT',
        headers: { 'X-Business-ID': businessId },
        body: JSON.stringify({ enabled, full_auto_mode: automation.full_auto_mode })
      })
    } catch {
      onUpdate(automation.id, { ...automation, enabled: !enabled }) // revert
    } finally {
      setUpdating(false)
    }
  }

  const handleModeChange = async (full_auto_mode: boolean) => {
    setUpdating(true)
    onUpdate(automation.id, { ...automation, full_auto_mode })
    try {
      await fetchWithAuth(`/automations/${automation.id}`, {
        method: 'PUT',
        headers: { 'X-Business-ID': businessId },
        body: JSON.stringify({ enabled: automation.enabled, full_auto_mode })
      })
    } catch {
      onUpdate(automation.id, { ...automation, full_auto_mode: !full_auto_mode }) // revert
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className={`bg-white rounded-3xl border transition-all p-6 sm:p-8 flex flex-col gap-6 justify-between ${automation.enabled ? 'border-blue-200 shadow-sm shadow-blue-50' : 'border-gray-200 opacity-80'}`}>
      
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row gap-6 justify-between items-start">
        <div className="flex gap-5">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${bgColor}`}>
            {icon}
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
            <p className="text-gray-500 mt-1 text-sm max-w-lg leading-relaxed">{automation.description}</p>
            
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                <Clock className="h-3 w-3" /> 
                {automation.last_run_at ? `Last run: ${new Date(automation.last_run_at).toLocaleString()}` : 'Never run yet'}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                <Bot className="h-3 w-3" /> 
                {automation.config?.model || 'AI Model'}
              </span>
            </div>
          </div>
        </div>

        {/* Master Toggle */}
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-3">
            <span className={`text-sm font-semibold ${automation.enabled ? 'text-blue-600' : 'text-gray-400'}`}>
              {automation.enabled ? 'Active' : 'Paused'}
            </span>
            <Switch 
              checked={automation.enabled} 
              onCheckedChange={handleToggle}
              disabled={updating}
            />
          </div>
        </div>
      </div>

      {/* Settings Section (only if enabled) */}
      {automation.enabled && (
        <div className="mt-2 pt-5 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50 p-4 rounded-2xl">
          <div>
            <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
              <Rocket className="w-4 h-4 text-indigo-500" />
              24/7 Full Auto Mode
            </h3>
            <p className="text-xs text-gray-500 mt-1">If enabled, AI will send replies/posts instantly without waiting for your approval.</p>
          </div>
          <div className="shrink-0 flex bg-white p-1 rounded-xl border border-gray-200">
            <button 
              onClick={() => handleModeChange(false)}
              disabled={updating}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!automation.full_auto_mode ? 'bg-amber-100 text-amber-800 shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              Drafts Only (Review First)
            </button>
            <button 
              onClick={() => handleModeChange(true)}
              disabled={updating}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${automation.full_auto_mode ? 'bg-indigo-100 text-indigo-800 shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              Full Auto (24/7)
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
