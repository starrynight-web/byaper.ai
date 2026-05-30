'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopNav } from '@/components/layout/TopNav'
import { useWorkspaceStore } from '@/lib/stores/workspaceStore'
import { fetchWithAuth } from '@/lib/api'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const router = useRouter()
  const businessId = params.businessId as string
  const { activeBusinessId, setWorkspace } = useWorkspaceStore()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    async function validateAndSetWorkspace() {
      // If URL doesn't match Zustand state, we need to validate and update state
      if (businessId !== activeBusinessId) {
        try {
          const workspaces = await fetchWithAuth('/workspaces')
          const ws = workspaces.find((w: any) => w.business.id === businessId)
          if (ws) {
            setWorkspace(ws.business.id, ws.business.name, ws.role)
            setIsReady(true)
          } else {
            // User doesn't have access to this workspace
            router.push('/workspace')
          }
        } catch (e) {
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
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
