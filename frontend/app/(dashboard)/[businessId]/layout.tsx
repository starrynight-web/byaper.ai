'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter, usePathname } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopNav } from '@/components/layout/TopNav'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { type Role, useWorkspaceStore } from '@/lib/stores/workspaceStore'
import { fetchWithAuth } from '@/lib/api'
import { motion, AnimatePresence } from 'framer-motion'

type Workspace = {
  business: {
    id: string
    name: string
  }
  role: Role
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const router = useRouter()
  const pathname = usePathname()
  const businessId = params.businessId as string
  const { activeBusinessId, setWorkspace } = useWorkspaceStore()
  const [isReady, setIsReady] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    async function validateAndSetWorkspace() {
      // If URL doesn't match Zustand state, we need to validate and update state
      if (businessId !== activeBusinessId) {
        try {
          const workspaces = await fetchWithAuth('/workspaces') as Workspace[]
          const ws = workspaces.find(w => w.business.id === businessId)
          if (ws) {
            setWorkspace(ws.business.id, ws.business.name, ws.role)
            setIsReady(true)
          } else {
            // User doesn't have access to this workspace
            router.push('/workspace')
          }
        } catch {
          router.push('/workspace')
        }
      } else {
        setIsReady(true)
      }
    }
    
    validateAndSetWorkspace()
  }, [businessId, activeBusinessId, setWorkspace, router])

  if (!isReady) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center dark:bg-gray-900" />
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="data-[side=left]:w-64 p-0 gap-0 lg:hidden" showCloseButton={false}>
          <SheetTitle className="sr-only">Dashboard navigation</SheetTitle>
          <Sidebar onNavigate={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopNav onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
