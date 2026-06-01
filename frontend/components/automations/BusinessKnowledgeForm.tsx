'use client'

import { useState, useEffect } from 'react'
import { fetchWithAuth } from '@/lib/api'
import { Building2, Save } from 'lucide-react'

type Workspace = {
  business: {
    id: string
    name?: string
    category?: string
    location?: string
    description?: string
    services?: unknown
    opening_hours?: unknown
    phone?: string
    website?: string
  }
}

export function BusinessKnowledgeForm({ businessId }: { businessId: string }) {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    location: '',
    description: '',
    services: '',
    opening_hours: '',
    phone: '',
    website: ''
  })

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const workspaces = await fetchWithAuth('/workspaces')
        const ws = Array.isArray(workspaces)
          ? (workspaces as Workspace[]).find((w) => w.business.id === businessId)
          : undefined
        if (ws && ws.business) {
          setFormData({
            name: ws.business.name || '',
            category: ws.business.category || '',
            location: ws.business.location || '',
            description: ws.business.description || '',
            services: typeof ws.business.services === 'string' ? ws.business.services : JSON.stringify(ws.business.services || ''),
            opening_hours: typeof ws.business.opening_hours === 'string' ? ws.business.opening_hours : JSON.stringify(ws.business.opening_hours || ''),
            phone: ws.business.phone || '',
            website: ws.business.website || ''
          })
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [businessId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetchWithAuth('/automations/business-context', {
        method: 'PUT',
        headers: { 'X-Business-ID': businessId },
        body: JSON.stringify(formData)
      })
      alert('Business knowledge saved! AI will now use this for replies.')
    } catch {
      alert('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="h-40 bg-gray-100 rounded-3xl animate-pulse" />

  return (
    <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
          <Building2 className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">AI Knowledge Base</h2>
          <p className="text-sm text-gray-500">Provide details about your business. AI will use this to automatically reply to customers and write posts.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category (e.g. Restaurant, Clinic)</label>
          <input type="text" name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Short Description & Vibe</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows={2} placeholder="A cozy coffee shop in Dhanmondi known for fresh pastries and calm environment..." className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Services / Menu / Price List</label>
          <textarea name="services" value={formData.services} onChange={handleChange} rows={3} placeholder="List what you offer and their prices if you want AI to tell customers..." className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Opening Hours</label>
          <input type="text" name="opening_hours" value={formData.opening_hours} onChange={handleChange} placeholder="e.g. 10 AM to 10 PM daily" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : <><Save className="w-4 h-4" /> Save Knowledge</>}
        </button>
      </div>
    </div>
  )
}
