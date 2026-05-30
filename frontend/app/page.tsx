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
    
    const mockState = {
      state: {
        activeBusinessId: "demo-business-123",
        activeBusinessName: "Demo Cafe & Bakery",
        activeRole: "owner"
      },
      version: 0
    }
    localStorage.setItem('byaper-workspace-storage', JSON.stringify(mockState))
    
    setTimeout(() => {
      router.push('/demo-business-123')
    }, 600)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-primary/10 font-sans relative overflow-hidden">
      {/* Decorative background grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-20 opacity-60" />

      {/* Navigation */}
      <nav className="sticky top-0 bg-white/80 backdrop-blur-md z-50 border-b border-slate-200/60">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-950 to-slate-800">Byapar AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">Sign In</Button>
            </Link>
            <Button onClick={handleDemoLogin} disabled={isDemoLoading} className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6 py-5 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all font-semibold hover:-translate-y-0.5 active:translate-y-0 cursor-pointer">
              {isDemoLoading ? "Loading..." : "Try Demo"}
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-16 pb-28 px-6 max-w-7xl mx-auto text-center z-10">
        {/* Ambient light source */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-primary/10 rounded-full blur-[100px] -z-10" />
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200/80 text-primary text-xs font-semibold mb-8 shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
          Now available for SMEs in Bangladesh
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 mb-6 leading-[1.1] max-w-4xl mx-auto">
          Your Business, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-600 to-sky-500">Automated by AI</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
          Manage Facebook posts, reply to Messenger inquiries, and automatically handle Google Reviews—all powered by state-of-the-art AI.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <Button onClick={handleDemoLogin} size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/95 text-white rounded-2xl px-8 h-14 text-base font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-[1.03] cursor-pointer">
            Explore Demo Environment <ArrowRight className="ml-2 w-5 h-5 group-hover/button:translate-x-1 transition-transform" />
          </Button>
          <Link href="/login" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-2xl px-8 h-14 text-base font-bold border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all hover:scale-[1.03] shadow-sm">
              Sign Up for Free
            </Button>
          </Link>
        </div>

        {/* Live CSS Dashboard Mockup (WOW Factor) */}
        <div className="relative max-w-5xl mx-auto rounded-3xl border border-slate-200/80 bg-white/70 backdrop-blur-md p-3 shadow-2xl shadow-slate-200/80 transition-all hover:shadow-slate-300 duration-500 group">
          <div className="rounded-2xl border border-slate-200 bg-slate-950 text-white overflow-hidden text-left shadow-inner flex flex-col md:flex-row aspect-[16/9]">
            {/* Sidebar Mockup */}
            <div className="w-full md:w-48 bg-slate-900 border-r border-slate-800 p-4 flex flex-col gap-4 shrink-0">
              <div className="flex items-center gap-2 px-2">
                <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm font-bold text-slate-100">Byapar AI</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-primary text-white text-xs font-semibold">
                  <div className="w-3.5 h-3.5 rounded bg-white/20" />
                  Dashboard
                </div>
                <div className="flex items-center gap-2.5 px-3 py-2 text-slate-400 text-xs font-semibold hover:text-slate-200">
                  <div className="w-3.5 h-3.5 rounded bg-slate-800" />
                  Posts
                </div>
                <div className="flex items-center gap-2.5 px-3 py-2 text-slate-400 text-xs font-semibold hover:text-slate-200">
                  <div className="w-3.5 h-3.5 rounded bg-slate-800" />
                  Messages
                </div>
              </div>
            </div>
            {/* Content Mockup */}
            <div className="flex-1 bg-slate-950 p-6 flex flex-col gap-6 overflow-hidden">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div>
                  <div className="text-xs font-semibold text-slate-400">WORKSPACE</div>
                  <div className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Demo Cafe & Bakery
                  </div>
                </div>
                <div className="text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                  Owner view
                </div>
              </div>

              {/* Mock cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex flex-col gap-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Posts Published</span>
                  <span className="text-2xl font-extrabold text-white">12</span>
                  <span className="text-[10px] text-emerald-400 font-semibold flex items-center mt-1">▲ +20% from last week</span>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex flex-col gap-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Messages Handled</span>
                  <span className="text-2xl font-extrabold text-white">145</span>
                  <span className="text-[10px] text-emerald-400 font-semibold flex items-center mt-1">▲ Avg reply: 15s</span>
                </div>
                <div className="col-span-2 md:col-span-1 bg-primary border border-primary/40 p-4 rounded-xl flex flex-col justify-between">
                  <span className="text-[10px] text-white/80 font-bold uppercase tracking-wider">AI Auto-Pilot</span>
                  <span className="text-xs text-white leading-relaxed font-semibold">Active & responding to customer queries.</span>
                </div>
              </div>

              {/* Feed preview mockup */}
              <div className="flex-1 bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 flex flex-col gap-3">
                <span className="text-xs font-bold text-slate-400">Recent Activity Log</span>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 text-xs border-b border-slate-800/40 pb-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-slate-300 font-medium">Auto-replied to a 5-star Google Review</span>
                    <span className="ml-auto text-[10px] text-slate-500">10m ago</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-slate-300 font-medium">Published Facebook Post: "Check out our weekend special..."</span>
                    <span className="ml-auto text-[10px] text-slate-500">Yesterday</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights - Asymmetrical staggered layout */}
        <div className="grid md:grid-cols-3 gap-8 mt-36 text-left max-w-6xl mx-auto">
          {/* Card 1 */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200/60 shadow-[0_12px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.07)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Smart Auto-Replies</h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              AI instantly responds to Messenger and WhatsApp inquiries in your brand's unique voice and tone.
            </p>
          </div>

          {/* Card 2 - Elevated slightly to break the symmetry */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200/60 shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:shadow-[0_24px_56px_rgba(0,0,0,0.1)] hover:-translate-y-2.5 transition-all duration-300 md:-translate-y-4 flex flex-col">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center mb-6">
              <Megaphone className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">AI Post Generator</h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              Generate stunning images and engaging captions for Facebook and Google Business Profile automatically.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200/60 shadow-[0_12px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.07)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center mb-6">
              <Building2 className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Google Reviews</h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              Maintain a 100% reply rate on Google Maps with intelligent review responses that boost your SEO.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
