'use client'

import { Bell, LogOut, Menu } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { WorkspaceSwitcher } from '@/components/workspace/WorkspaceSwitcher'
import { useWorkspaceStore } from '@/lib/stores/workspaceStore'

export function TopNav() {
  const router = useRouter()
  const supabase = createClient()
  const { clearWorkspace, activeBusinessName } = useWorkspaceStore()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    clearWorkspace()
    router.push('/login')
  }

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-white px-4 lg:px-6 dark:bg-gray-950">
      <Button variant="ghost" size="icon" className="md:hidden">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      
      <div className="flex-1 flex items-center space-x-4">
        {/* CRITICAL UX RULE: Always show active workspace explicitly */}
        <div className="hidden sm:block">
          <span className="text-xs text-gray-500 font-medium">Active Workspace</span>
        </div>
        <WorkspaceSwitcher />
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-600 border border-white dark:border-gray-900" />
        </Button>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-600 dark:text-gray-400">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </header>
  )
}
