'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { fetchWithAuth } from '@/lib/api'
import { useWorkspaceStore } from '@/lib/stores/workspaceStore'
import { Sparkles, Loader2 } from 'lucide-react'

/**
 * After Google OAuth, the backend sets an httpOnly JWT cookie and redirects here.
 * This page:
 * 1. Fetches the user's workspaces from our API (cookie is auto-sent)
 * 2. Stores the first workspace in Zustand
 * 3. Redirects to the correct dashboard
 */
export default function AuthCallback() {
  const router = useRouter()
  const { setWorkspace } = useWorkspaceStore()

  useEffect(() => {
    async function handleCallback() {
      try {
        // Cookie is already set by the backend redirect — fetch workspaces
        const workspaces: any[] = await fetchWithAuth('/workspaces')

        if (!workspaces || workspaces.length === 0) {
          // New user with no businesses — go to onboarding
          router.replace('/setup')
          return
        }

        // Set the first workspace as active
        const first = workspaces[0]
        setWorkspace(first.business.id, first.business.name, first.role)

        if (workspaces.length === 1) {
          // Single workspace — go directly to dashboard
          router.replace(`/${first.business.id}`)
        } else {
          // Multiple workspaces — show selector
          router.replace('/workspace')
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        router.replace('/login')
      }
    }

    handleCallback()
  }, [router, setWorkspace])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <div className="flex items-center gap-2 justify-center text-gray-600">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          <p className="text-lg font-medium">Setting up your workspace...</p>
        </div>
        <p className="text-sm text-gray-400 mt-2">You will be redirected automatically.</p>
      </div>
    </div>
  )
}
