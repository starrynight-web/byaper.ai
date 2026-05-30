'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { SVGProps } from 'react'
import { LayoutDashboard, MessageSquare, Star, Megaphone, Settings, Users, Zap, BarChart3 } from 'lucide-react'

import { cn } from '@/lib/utils'
import { useWorkspaceStore } from '@/lib/stores/workspaceStore'

type SidebarProps = {
  onNavigate?: () => void
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname()
  const { activeBusinessId, activeRole, activeBusinessName } = useWorkspaceStore()

  if (!activeBusinessId) return null

  const basePath = `/${activeBusinessId}`

  const items = [
    { name: 'Dashboard', href: basePath, icon: LayoutDashboard },
    { name: 'Posts', href: `${basePath}/posts`, icon: Megaphone },
    { name: 'Messages', href: `${basePath}/messages`, icon: MessageSquare },
    { name: 'Reviews', href: `${basePath}/reviews`, icon: Star },
    { name: 'GBP Manager', href: `${basePath}/gbp`, icon: Building2Icon },
    { name: 'Automations', href: `${basePath}/automations`, icon: Zap },
    { name: 'Analytics', href: `${basePath}/analytics`, icon: BarChart3 },
    { name: 'Team', href: `${basePath}/team`, icon: Users, roles: ['owner'] },
    { name: 'Settings', href: `${basePath}/settings`, icon: Settings },
  ]

  return (
    <div className="flex h-full w-66 flex-col border-r border-slate-100 bg-white dark:bg-slate-950 dark:border-slate-900 shrink-0">
      {/* Brand Header */}
      <div className="flex h-16 items-center px-6 border-b border-slate-100 dark:border-slate-900">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-primary flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">BYAPAR AI</span>
        </div>
      </div>

      {/* Workspace Shield Context Panel (Crucial SaaS UX indicator) */}
      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/10">
        <div className="p-3.5 rounded-2xl border border-slate-200/80 bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm flex flex-col gap-1.5 relative overflow-hidden group">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Active Workspace</span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate flex-1">{activeBusinessName || 'Demo Workspace'}</span>
          </div>
          <div className="text-[9px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md w-fit mt-1 self-start capitalize">
            Role: {activeRole}
          </div>
        </div>
      </div>

      {/* Navigation menu */}
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-3">
          {items.map((item) => {
            if (item.roles && activeRole && !item.roles.includes(activeRole)) return null
            
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200",
                  isActive 
                    ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground/90 shadow-sm" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100"
                )}
              >
                <item.icon className={cn("h-4 w-4 transition-colors", isActive ? "text-primary" : "text-slate-400 dark:text-slate-500")} />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

function Building2Icon(props: SVGProps<SVGSVGElement>) {
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
