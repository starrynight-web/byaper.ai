'use client'

import { useState } from 'react'
import { Bell, LogOut, Menu } from 'lucide-react'
import { logout } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { WorkspaceSwitcher } from '@/components/workspace/WorkspaceSwitcher'
import { useWorkspaceStore } from '@/lib/stores/workspaceStore'

type TopNavProps = {
  onMenuClick?: () => void
}

export function TopNav({ onMenuClick }: TopNavProps) {
  const { clearWorkspace } = useWorkspaceStore()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    clearWorkspace()
    await logout() // clears httpOnly cookie via backend + redirects to /login
  }

  return (
    <header className="flex h-16 items-center gap-3 border-b border-slate-100 bg-white/80 backdrop-blur-md px-4 sm:px-6 dark:bg-slate-950/80 dark:border-slate-900 shrink-0">
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuClick}
        className="lg:hidden h-9.5 w-9.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 shadow-sm"
        aria-label="Open navigation menu"
      >
        <Menu className="h-4 w-4 text-slate-600 dark:text-slate-300" />
      </Button>

      {/* Workspace context switcher */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <WorkspaceSwitcher />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative h-9.5 w-9.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 shadow-sm transition-all duration-200">
          <Bell className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-rose-500 border-2 border-white dark:border-slate-900" />
        </Button>

        {/* Logout */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          disabled={loggingOut}
          className="h-9.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 hover:text-slate-800 shadow-sm text-slate-600 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 text-xs font-bold gap-2 px-3.5 transition-all duration-200 cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span>{loggingOut ? 'Signing out...' : 'Sign out'}</span>
        </Button>
      </div>
    </header>
  )
}
