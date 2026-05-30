'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Settings, Save, Building2, Link as LinkIcon, Bot } from 'lucide-react'

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  
  const handleSave = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 1000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
          <Settings className="h-6 w-6 text-gray-600" /> Workspace Settings
        </h1>
        <p className="text-gray-500 mt-1">Manage your business profile and integrations.</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" /> Business Profile
          </h2>
        </div>
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Business Name</Label>
              <Input defaultValue="Demo Cafe & Bakery" className="h-11 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Category</Label>
              <Input defaultValue="Restaurant" className="h-11 rounded-xl" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">Location</Label>
            <Input defaultValue="Gulshan, Dhaka" className="h-11 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">Core Services / Offerings</Label>
            <Input defaultValue="Coffee, Pastries, Breakfast, Brunch" className="h-11 rounded-xl" />
            <p className="text-xs text-gray-500">AI uses this context to write better posts and replies.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <LinkIcon className="h-5 w-5 text-cyan-600" /> Connected Accounts
          </h2>
        </div>
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Facebook Page</h3>
                <p className="text-sm text-gray-500">Connected to "Demo Cafe Dhaka"</p>
              </div>
            </div>
            <Button variant="outline" className="text-rose-600 border-gray-200 hover:bg-rose-50">Disconnect</Button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <Building2 className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Google Business Profile</h3>
                <p className="text-sm text-gray-500">Not connected</p>
              </div>
            </div>
            <Button className="bg-gray-900 hover:bg-gray-800 text-white">Connect</Button>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button 
          onClick={handleSave} 
          disabled={loading}
          className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-base"
        >
          {loading ? 'Saving...' : <><Save className="h-4 w-4 mr-2" /> Save Changes</>}
        </Button>
      </div>
    </div>
  )
}
