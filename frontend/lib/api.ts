import { createClient } from '@/lib/supabase/client'

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  const headers = new Headers(options.headers || {})
  headers.set('Content-Type', 'application/json')
  
  if (session?.access_token) {
    headers.set('Authorization', `Bearer ${session.access_token}`)
  }

  // If we have an active business ID, inject it
  if (typeof window !== 'undefined') {
    const state = JSON.parse(localStorage.getItem('byaper-workspace-storage') || '{}')
    if (state.state?.activeBusinessId) {
      headers.set('X-Business-ID', state.state.activeBusinessId)
    }
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.detail || 'API request failed')
  }

  return response.json()
}
