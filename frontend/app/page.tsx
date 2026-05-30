'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, Building2, MessageSquare, Megaphone, CheckCircle2 } from 'lucide-react'

export default function LandingPage() {
  const router = useRouter()
  const [isDemoLoading, setIsDemoLoading] = useState(false)

  const handleDemoLogin = () => {
    setIsDemoLoading(true)
    document.cookie = "demo_mode=true; path=/;"
    
    // Set a mock workspace in Zustand via localStorage to skip the selector in demo mode
    const mockState = {
      state: {
        activeBusinessId: "demo-business-123",
        activeBusinessName: "Demo Cafe & Bakery",
        activeRole: "owner"
      },
      version: 0
    }
    localStorage.setItem('byaper-workspace-storage', JSON.stringify(mockState))
    
    // Give it a tiny delay for realism and cookie propagation
    setTimeout(() => {
      router.push('/demo-business-123')
    }, 600)
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-blue-100 font-sans">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">Byapar AI</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="font-medium text-gray-600 hover:text-gray-900">Sign In</Button>
          </Link>
          <Button onClick={handleDemoLogin} disabled={isDemoLoading} className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 shadow-md shadow-blue-200 transition-all">
            {isDemoLoading ? "Loading Demo..." : "Try Demo"}
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-20 pb-32 px-6 max-w-7xl mx-auto text-center">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[500px] bg-blue-50/50 rounded-full blur-3xl -z-10" />
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-8">
          <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
          Now available for SMEs in Bangladesh
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
          Your Business, <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Automated by AI</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Manage Facebook posts, reply to Messenger inquiries, and automatically handle Google Reviews—all powered by state-of-the-art AI.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button onClick={handleDemoLogin} size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 h-14 text-lg shadow-xl shadow-blue-200 transition-all hover:scale-105">
            Explore Demo Environment <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Link href="/login" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-full px-8 h-14 text-lg border-gray-200 text-gray-700 hover:bg-gray-50">
              Sign Up for Free
            </Button>
          </Link>
        </div>

        {/* Feature Highlights - Glassmorphism cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 text-left">
          <div className="p-8 rounded-3xl bg-white/60 backdrop-blur-xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center mb-6">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Auto-Replies</h3>
            <p className="text-gray-600 leading-relaxed">
              AI instantly responds to Messenger and WhatsApp inquiries in your brand's unique voice and tone.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white/60 backdrop-blur-xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center mb-6">
              <Megaphone className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">AI Post Generator</h3>
            <p className="text-gray-600 leading-relaxed">
              Generate stunning images and engaging captions for Facebook and Google Business Profile automatically.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white/60 backdrop-blur-xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center mb-6">
              <Building2 className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Google Reviews</h3>
            <p className="text-gray-600 leading-relaxed">
              Maintain a 100% reply rate on Google Maps with intelligent review responses that boost your SEO.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
