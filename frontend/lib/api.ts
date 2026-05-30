/**
 * API client — uses our own JWT (httpOnly cookie set by FastAPI backend).
 * The cookie is automatically sent by the browser on every request.
 * For server-side or manual token usage, reads from localStorage fallback.
 */

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (process.env.NODE_ENV === 'production' ? '/_/backend/api/v1' : 'http://localhost:8000/api/v1')

// Demo mock data — returned when demo_mode cookie is active
const DEMO_DATA: Record<string, unknown> = {
  '/workspaces': [
    {
      business: { id: 'demo-business-123', name: 'Demo Cafe & Bakery', category: 'restaurant', location: 'Dhaka', city: 'Dhaka' },
      role: 'owner',
    },
  ],
  '/analytics/summary': {
    posts_published: 12,
    messages_handled: 145,
    reviews_replied: 28,
    avg_response_time_seconds: 15,
  },
  '/posts': [
    { id: '1', content: '🌟 Weekend special! আমাদের নতুন মেনু আইটেম চেষ্টা করুন। #DemoCafe #Dhaka', image_url: 'https://image.pollinations.ai/prompt/cozy%20cafe%20bangladesh%20warm?width=800&height=600&nologo=true', status: 'published', platform: 'facebook', created_at: new Date(Date.now() - 86400000).toISOString() },
    { id: '2', content: '☕ Fresh coffee & pastries every morning! Come visit us.\n\n#MorningVibes #Coffee', image_url: 'https://image.pollinations.ai/prompt/fresh%20coffee%20bakery%20morning?width=800&height=600&nologo=true', status: 'scheduled', scheduled_time: new Date(Date.now() + 86400000).toISOString(), platform: 'facebook', created_at: new Date().toISOString() },
    { id: '3', content: 'নতুন উইকেন্ড স্পেশাল মেনু এসে গেছে!', status: 'draft', platform: 'facebook', created_at: new Date().toISOString() },
  ],
  '/messages': [
    { id: '1', sender_name: 'Rahim Ahmed', message_text: 'আপনাদের রেস্টুরেন্ট কতক্ষণ খোলা থাকে?', ai_reply_draft: 'আমাদের রেস্টুরেন্ট সকাল ৮টা থেকে রাত ১০টা পর্যন্ত খোলা থাকে। আপনাকে স্বাগতম!', reply_status: 'pending', is_read: false, received_at: new Date(Date.now() - 3600000).toISOString() },
    { id: '2', sender_name: 'Karim Bhai', message_text: 'Do you have home delivery?', ai_reply_draft: 'Yes! We offer home delivery within 5km radius. Please call us at 01XXXXXXXXX to place your order.', reply_status: 'sent', is_read: true, received_at: new Date(Date.now() - 7200000).toISOString() },
  ],
  '/reviews': [
    { id: '1', reviewer_name: 'Farhan Islam', rating: 5, review_text: 'Best coffee in Dhaka! Amazing ambiance and friendly staff.', ai_reply_draft: 'Thank you so much, Farhan! We\'re thrilled you enjoyed the experience. See you again soon! ☕', reply_status: 'pending', review_date: new Date(Date.now() - 86400000).toISOString() },
    { id: '2', reviewer_name: 'Nasrin Akter', rating: 3, review_text: 'Food was okay but service was slow.', ai_reply_draft: 'Dear Nasrin, thank you for your honest feedback. We sincerely apologize for the slow service and are working to improve. We hope to serve you better next time!', reply_status: 'pending', review_date: new Date(Date.now() - 172800000).toISOString() },
  ],
}

function isDemoMode(): boolean {
  if (typeof window === 'undefined') return false
  return document.cookie.includes('demo_mode=true')
}

export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<any> {
  // Demo mode — return mock data without hitting API
  if (isDemoMode()) {
    // Find matching demo data by path prefix
    for (const [key, val] of Object.entries(DEMO_DATA)) {
      if (url === key || url.startsWith(key + '?')) {
        await new Promise(r => setTimeout(r, 300)) // simulate latency
        return val
      }
    }
    // Default demo response for write operations
    if (options.method && options.method !== 'GET') {
      return { success: true, id: 'demo-' + Date.now() }
    }
  }

  const headers = new Headers(options.headers || {})
  headers.set('Content-Type', 'application/json')

  // Auto-inject active business ID from Zustand store (localStorage)
  if (typeof window !== 'undefined') {
    try {
      const state = JSON.parse(localStorage.getItem('byaper-workspace-storage') || '{}')
      const businessId = state?.state?.activeBusinessId
      if (businessId && !headers.has('X-Business-ID')) {
        headers.set('X-Business-ID', businessId)
      }
    } catch { /* ignore */ }
  }

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
    credentials: 'include', // CRITICAL: sends httpOnly JWT cookie automatically
  })

  if (response.status === 401) {
    // Token expired — redirect to login
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
    throw new Error('Unauthorized')
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error((err as any).detail || 'API request failed')
  }

  return response.json()
}

/** Redirect the browser to start the Google OAuth flow via our backend */
export function startGoogleLogin() {
  window.location.href = `${API_BASE}/auth/google/login`
}

/** Call backend logout endpoint to clear the httpOnly cookie */
export async function logout() {
  try {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    })
  } catch (err) {
    // ignore
  }
  if (typeof window !== 'undefined') {
    localStorage.removeItem('byaper-workspace-storage')
    document.cookie = 'demo_mode=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    window.location.href = '/login'
  }
}
