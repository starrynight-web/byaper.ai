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

  // Check for demo mode
  let isDemo = false;
  if (typeof window !== 'undefined') {
    isDemo = document.cookie.includes('demo_mode=true');
  }

  // Intercept specific endpoints for demo mode
  if (isDemo) {
    if (url === '/workspaces') {
      return [
        {
          business: { id: 'demo-business-123', name: 'Demo Cafe & Bakery', category: 'restaurant', location: 'Dhaka' },
          role: 'owner'
        }
      ]
    }
    if (url === '/analytics/summary') {
      return {
        posts_published: 12,
        messages_handled: 145,
        reviews_replied: 28,
        avg_response_time_seconds: 15
      }
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
