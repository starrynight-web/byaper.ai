'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, MessageSquare, Star, Megaphone, Settings, Users, Zap, BarChart3 } from 'lucide-react'

import { cn } from '@/lib/utils'
import { useWorkspaceStore } from '@/lib/stores/workspaceStore'

export function Sidebar() {
  const pathname = usePathname()
  const { activeBusinessId, activeRole } = useWorkspaceStore()

  if (!activeBusinessId) return null

  const basePath = `/${activeBusinessId}`

  const items = [
    { name: 'Dashboard', href: basePath, icon: LayoutDashboard },
    { name: 'Posts', href: `${basePath}/posts`, icon: Megaphone },
    { name: 'Messages', href: `${basePath}/messages`, icon: MessageSquare },
    { name: 'Reviews', href: `${basePath}/reviews`, icon: Star },
    { name: 'GBP Manager', href: `${basePath}/gbp`, icon: Building2Icon }, // Placeholder for GBP icon
    { name: 'Automations', href: `${basePath}/automations`, icon: Zap },
    { name: 'Analytics', href: `${basePath}/analytics`, icon: BarChart3 },
    { name: 'Team', href: `${basePath}/team`, icon: Users, roles: ['owner'] },
    { name: 'Settings', href: `${basePath}/settings`, icon: Settings },
  ]

  return (
    <div className="flex h-full w-64 flex-col border-r bg-white dark:bg-gray-950">
      <div className="flex h-14 items-center border-b px-4">
        <span className="text-xl font-bold text-blue-600 dark:text-blue-400">BYAPAR AI</span>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-2">
          {items.map((item) => {
            if (item.roles && activeRole && !item.roles.includes(activeRole)) return null
            
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200" 
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
                )}
              >
                <item.icon className={cn("h-4 w-4", isActive && "text-blue-600 dark:text-blue-400")} />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

function Building2Icon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </svg>
  )
}
