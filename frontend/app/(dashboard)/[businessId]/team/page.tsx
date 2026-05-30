'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Users, UserPlus, Mail, Shield, ShieldAlert, Trash2 } from 'lucide-react'

export default function TeamPage() {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('manager')
  
  const members = [
    { id: '1', name: 'You', email: 'owner@example.com', role: 'owner', status: 'active' },
    { id: '2', name: 'Sarah Smith', email: 'sarah@example.com', role: 'manager', status: 'active' },
    { id: '3', name: 'John Doe', email: 'john@example.com', role: 'viewer', status: 'pending' },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
          <Users className="h-6 w-6 text-blue-600" /> Team Management
        </h1>
        <p className="text-gray-500 mt-1">Manage who has access to this workspace.</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Invite Member</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Email address" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="pl-9 h-11 rounded-xl"
            />
          </div>
          <select 
            value={role}
            onChange={e => setRole(e.target.value)}
            className="h-11 rounded-xl border border-gray-200 px-4 text-sm font-medium outline-none bg-gray-50"
          >
            <option value="manager">Manager</option>
            <option value="viewer">Viewer</option>
          </select>
          <Button className="h-11 rounded-xl bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
            <UserPlus className="h-4 w-4 mr-2" /> Send Invite
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Active Members</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {members.map(member => (
            <div key={member.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <span className="text-blue-700 font-bold">{member.name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    {member.name}
                    {member.status === 'pending' && (
                      <span className="text-[10px] uppercase font-bold tracking-wider text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                        Pending
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-500">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-sm font-medium text-gray-600">
                  {member.role === 'owner' ? <ShieldAlert className="h-4 w-4 text-rose-500" /> : <Shield className="h-4 w-4 text-blue-500" />}
                  <span className="capitalize">{member.role}</span>
                </div>
                {member.role !== 'owner' && (
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
