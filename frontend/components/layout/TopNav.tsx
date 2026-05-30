'use client'

import { useState } from 'react'
import { Bell, LogOut, Settings, Building2 } from 'lucide-react'
import { logout } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { WorkspaceSwitcher } from '@/components/workspace/WorkspaceSwitcher'
import { useWorkspaceStore } from '@/lib/stores/workspaceStore'

export function TopNav() {
  const { clearWorkspace, activeBusinessName } = useWorkspaceStore()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    clearWorkspace()
    await logout() // clears httpOnly cookie via backend + redirects to /login
  }

  return (
    <header className="flex h-16 items-center gap-4 border-b border-gray-100 bg-white px-4 lg:px-6 shrink-0">
      {/* Workspace context — always visible */}
      <div className="flex flex-1 items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 font-medium">
          <Building2 className="h-3.5 w-3.5" />
          <span>Workspace</span>
        </div>
        <WorkspaceSwitcher />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-xl">
          <Bell className="h-4 w-4 text-gray-500" />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-red-500 border border-white" />
        </Button>

        {/* Logout */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          disabled={loggingOut}
          className="h-9 rounded-xl text-gray-500 hover:text-gray-800 hover:bg-gray-100 text-sm gap-2"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">{loggingOut ? 'Signing out...' : 'Sign out'}</span>
        </Button>
      </div>
    </header>
  )
}
