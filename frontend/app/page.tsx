'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import useEmblaCarousel from 'embla-carousel-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Globe2,
  Heart,
  MapPin,
  Megaphone,
  MessageSquare,
  MousePointer2,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const CobeGlobe = dynamic(() => import('@/components/ui/cobe-globe'), {
  ssr: false,
  loading: () => <div className="aspect-square w-full max-w-[520px] rounded-2xl bg-white border border-slate-100 shadow-sm" />,
})

type IconComponent = LucideIcon

const realityCards = [
  {
    icon: MessageSquare,
    title: 'Customer messages go unanswered',
    body: 'Messenger and WhatsApp inquiries at midnight, during a busy shift, or over Eid — they all pile up. Every missed reply is a sale that went to a competitor.',
    metric: 'Under 60s auto-reply',
  },
  {
    icon: Star,
    title: 'Google reviews sit without a response',
    body: 'Every unanswered review pushes your Google ranking down and signals to the next customer that nobody is home. A simple reply takes 10 minutes you don\'t have.',
    metric: '95%+ reply rate',
  },
  {
    icon: MapPin,
    title: 'Your Google Business Profile is fading',
    body: 'Outdated hours, missing photos, and zero weekly posts quietly reduce your map visibility — even when the business itself is doing well.',
    metric: 'Weekly profile fixes',
  },
  {
    icon: BarChart3,
    title: 'A digital team costs more than it earns',
    body: 'A social media manager, support agent, designer, and agency retainer can run ৳15,000–৳40,000 per month. Most SMEs can\'t sustain that.',
    metric: '৳500–৳5,000/mo',
  },
]

const featureBriefings = [
  {
    icon: Megaphone,
    title: 'Facebook Post Generator',
    body: 'Turns your menu, offers, and seasonal moments into ready-to-publish Facebook posts — with AI-generated visuals. Publishes on schedule via Meta Graph API.',
    stat: '12 posts published this week',
    visual: 'posts',
  },
  {
    icon: MessageSquare,
    title: 'Messenger Auto-Reply',
    body: 'Reads incoming Messenger questions and answers from your business knowledge base — prices, hours, products, policies, and location — in under 60 seconds.',
    stat: '145 messages handled',
    visual: 'messages',
  },
  {
    icon: Star,
    title: 'Google Review Manager',
    body: 'Fetches new Google reviews nightly and generates personal, professional replies for positive, neutral, and negative reviews. Posts back via GBP API.',
    stat: '28 reviews answered',
    visual: 'reviews',
  },
  {
    icon: Globe2,
    title: 'GBP Profile Advisor',
    body: 'Analyzes your Google Business Profile completeness, recommends missing content, and auto-generates GBP posts — improving local map discoverability week by week.',
    stat: '+31% map actions',
    visual: 'gbp',
  },
]

const comparisonRows = [
  ['Facebook Post AI Generation', 'Yes', 'No', 'No', 'Yes'],
  ['Bengali Language Support', 'Yes', 'No', 'Partial', 'Yes'],
  ['Google Review Auto-Reply', 'Yes', 'No', 'No', 'Yes'],
  ['Messenger AI Reply', 'Yes', 'No', 'Yes', 'Yes'],
  ['AI Image Generation', 'Yes', 'No', 'No', 'Yes'],
  ['Monthly Cost (BDT)', '৳500–৳5,000', '৳3,000–৳10,000', '৳2,000–৳8,000', '৳15,000–৳40,000'],
]

const pricingPlans = [
  {
    name: 'Starter',
    price: '৳500',
    note: 'For solo shops and food stalls just testing AI operations.',
    features: ['10 Facebook posts/mo', 'Google Review replies', 'Monthly performance recap'],
  },
  {
    name: 'Growth',
    price: '৳1,500',
    note: 'The default for busy SMEs: restaurants, salons, clinics.',
    features: ['Unlimited posts', 'Messenger auto-replies', 'GBP Advisor'],
    popular: true,
  },
  {
    name: 'Pro',
    price: '৳3,000',
    note: 'For shops with multiple active channels.',
    features: ['Everything in Growth', 'Instagram support', 'Priority support'],
  },
  {
    name: 'Business',
    price: '৳5,000',
    note: 'For chains, agencies, and multi-branch operations.',
    features: ['Everything in Pro', 'Multi-branch support', 'Custom AI training'],
  },
]

const testimonials = [
  {
    quote: 'I used to lose customers when I couldn\'t reply in time. Now every Messenger message gets answered in seconds — even when I\'m on the floor.',
    name: 'Rahim Bhai',
    role: 'Restaurant Owner, Dhaka',
  },
  {
    quote: 'It feels like having a small digital team that never forgets the follow-up work. My Google reviews are always responded to now.',
    name: 'Nadia Ahmed',
    role: 'Clinic Manager, Chattogram',
  },
]

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' as const } },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

export default function LandingPage() {
  const router = useRouter()
  const [isDemoLoading, setIsDemoLoading] = useState(false)
  const [activeMobileTab, setActiveMobileTab] = useState<number | null>(0)
  const realityRef = useRef<HTMLElement>(null)
  const featuresRef = useRef<HTMLElement>(null)
  const realityProgress = useScrollProgress(realityRef)
  const featuresProgress = useScrollProgress(featuresRef)
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'center', containScroll: 'trimSnaps', dragFree: false })
  const activeIndex = Math.min(
    realityCards.length - 1,
    Math.floor(realityProgress * (realityCards.length + 0.5))
  )
  const activeFeature = Math.min(featureBriefings.length - 1, Math.floor(featuresProgress * featureBriefings.length))

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.scrollTo(activeIndex)
  }, [emblaApi, activeIndex])

  const handleDemoLogin = () => {
    setIsDemoLoading(true)
    document.cookie = 'demo_mode=true; path=/;'
    localStorage.setItem(
      'byaper-workspace-storage',
      JSON.stringify({
        state: {
          activeBusinessId: 'demo-business-123',
          activeBusinessName: 'Demo Cafe & Bakery',
          activeRole: 'owner',
        },
        version: 0,
      })
    )

    setTimeout(() => {
      router.push('/demo-business-123')
    }, 600)
  }

  const handleMobileTabClick = (index: number, event: React.MouseEvent<HTMLDivElement>) => {
    const isCurrentlyActive = activeMobileTab === index
    const nextTab = isCurrentlyActive ? null : index
    setActiveMobileTab(nextTab)
    if (!isCurrentlyActive) {
      const target = event.currentTarget
      setTimeout(() => {
        const yOffset = -80 // height of sticky header
        const y = target.getBoundingClientRect().top + window.scrollY + yOffset
        window.scrollTo({ top: y, behavior: 'smooth' })
      }, 120)
    }
  }

  return (
    <div className="min-h-screen overflow-x-clip bg-slate-50 font-sans text-slate-800 selection:bg-primary/10">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-xl focus:bg-white focus:border focus:border-slate-200 focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-primary focus:shadow-sm"
      >
        Skip to main content
      </a>

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -8, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur"
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-4 sm:px-6 md:px-8">
          <Link href="/" className="flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="Byapar AI home">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-base font-bold text-white shadow-sm">B</span>
            <span className="text-lg font-bold tracking-wider text-slate-900">BYAPAR AI</span>
          </Link>
          
          {/* Quick Navigation Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link href="#problems" className="rounded-md px-2.5 py-1.5 text-sm font-semibold text-slate-600 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              Problems
            </Link>
            <Link href="#features" className="rounded-md px-2.5 py-1.5 text-sm font-semibold text-slate-600 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              Features
            </Link>
            <Link href="#compare" className="rounded-md px-2.5 py-1.5 text-sm font-semibold text-slate-600 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              Compare
            </Link>
            <Link href="#pricing" className="rounded-md px-2.5 py-1.5 text-sm font-semibold text-slate-600 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              Pricing
            </Link>
            <Link href="#testimonials" className="rounded-md px-2.5 py-1.5 text-sm font-semibold text-slate-600 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              Testimonials
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-6">
            <Link href="/login" className="rounded-md px-3 py-1.5 text-sm font-semibold text-slate-600 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              Sign In
            </Link>
            <Button
              onClick={handleDemoLogin}
              disabled={isDemoLoading}
              className="h-11 rounded-xl bg-primary text-white shadow-sm hover:bg-primary/95 transition-all font-semibold px-5 active:scale-[0.98] cursor-pointer"
            >
              {isDemoLoading ? 'Loading' : 'Try Demo'}
            </Button>
          </div>
        </div>
      </motion.nav>

      <main id="main-content">
        {/* Unified Hero & Section 2 wrapper */}
        <div className="relative bg-slate-50 overflow-x-clip">
          
          <section className="relative z-20 flex flex-col pt-14 sm:pt-20 lg:pt-24 min-h-[50vh]">
            {/* Hero text content */}
            <div className="mx-auto flex flex-col items-center text-center max-w-6xl px-4 sm:px-6 pb-12">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="flex flex-col items-center"
              >
                <motion.h1 
                  variants={fadeInUp}
                  className="max-w-4xl text-balance text-5xl font-extrabold leading-[1.08] tracking-tight text-slate-900 sm:text-6xl lg:text-7xl"
                >
                  Your business,
                  <br />
                  <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">automated by AI.</span>
                </motion.h1>
                <motion.p 
                  variants={fadeInUp}
                  className="mt-6 max-w-2xl text-lg font-normal leading-8 text-slate-600"
                >
                  Byapar AI replaces your social media manager, customer support agent, and review manager — at the cost of a cup of tea per day. Built for restaurants, clinics, salons, and shops across Bangladesh.
                </motion.p>

                <motion.div 
                  variants={fadeInUp}
                  className="mt-8 flex flex-col gap-4 sm:flex-row justify-center w-full relative z-30"
                >
                  <Button
                    onClick={handleDemoLogin}
                    disabled={isDemoLoading}
                    size="lg"
                    className="h-14 rounded-xl bg-primary px-8 text-base font-bold text-white shadow-md hover:bg-primary/95 transition-all active:scale-[0.98] cursor-pointer"
                  >
                    {isDemoLoading ? 'Opening Demo' : 'Explore Demo'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Link href="/login">
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-14 w-full rounded-xl border border-slate-250 bg-white px-8 text-base font-bold text-slate-800 hover:bg-slate-50 transition-all active:scale-[0.98] sm:w-auto"
                    >
                      Start Free
                    </Button>
                  </Link>
                </motion.div>

                <motion.div 
                  variants={fadeInUp}
                  className="mt-10 flex flex-wrap gap-4 justify-center"
                >
                  <HeroProof icon={Clock} label="Under 60s AI replies" />
                  <HeroProof icon={ShieldCheck} label="95%+ review reply rate" />
                  <HeroProof icon={Globe2} label="Dhaka to global, built local" />
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* Globe positioned squarely between the Hero text and Section 2 */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 1.0, ease: 'easeOut' as const }}
            className="absolute left-1/2 top-[38vh] -translate-x-1/2 w-[80vw] max-w-[750px] aspect-square z-0 pointer-events-none"
          >
            <div className="w-full h-full pointer-events-auto">
              <CobeGlobe />
            </div>
          </motion.div>

          {/* Section 2 — Reality Check (Pain Points) 
              This now sits below the hero without a hard boundary, sharing the same container.
              The background is transparent so the globe shows through behind the cards. */}
          <section id="problems" ref={realityRef} className="relative h-[300vh] scroll-mt-20">
            <div className="sticky top-0 flex h-screen items-center overflow-hidden bg-transparent">
            <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 md:px-8">
              <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="mt-3 max-w-3xl text-balance text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl">
                    The digital work your business is carrying alone.
                  </h2>
                </div>
              </div>

              <div ref={emblaRef} className="overflow-hidden py-4 -mx-4 sm:-mx-6 md:-mx-8 px-4 sm:px-6 md:px-8">
                <div className="flex touch-pan-y gap-6">
                  {realityCards.map((item, index) => (
                    <RealityCard 
                      key={item.title} 
                      item={item} 
                      index={index + 1} 
                      isActive={index === activeIndex}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

        {/* Wrapper for Features Section to support responsive navigation scrolls */}
        <div id="features" className="scroll-mt-20">
          {/* Section 3 — Features (Operational Stack) - Desktop */}
          <section ref={featuresRef} className="hidden lg:block relative h-[320vh] bg-slate-50">
            <div className="sticky top-0 flex h-screen items-center overflow-hidden bg-slate-50 pt-20">
              <div className="mx-auto grid w-full max-w-[1440px] gap-8 px-4 sm:px-6 md:px-8 lg:grid-cols-[1fr_1.15fr] items-center">
                <div>
                  <h2 className="mt-3 max-w-xl text-balance text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl">
                    Four modules. One AI command center.
                  </h2>

                  <div className="mt-8 space-y-3">
                    {featureBriefings.map((feature, index) => {
                      const Icon = feature.icon
                      const active = index === activeFeature

                      return (
                        <div
                          key={feature.title}
                          className={`rounded-2xl border p-4 transition-all duration-300 ${
                            active 
                              ? 'bg-white border-slate-200/80 shadow-md translate-x-1.5 text-slate-900 opacity-100' 
                              : 'bg-transparent border-transparent text-slate-400 opacity-50'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <span className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${
                              active ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-400'
                            }`}>
                              <Icon className="h-4 w-4" />
                            </span>
                            <div>
                              <h3 className="text-lg font-bold">{feature.title}</h3>
                              <p className="mt-1.5 text-[13px] font-normal leading-5 text-slate-550">{feature.body}</p>
                              <p className="mt-2.5 text-xs font-bold uppercase tracking-wider text-primary">{feature.stat}</p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* High-fidelity Dashboard Mockup */}
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden p-6 md:p-8 lg:min-h-[560px] md:min-h-[500px] min-h-[460px] flex flex-col justify-between">
                  <div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                      <div>
                        <h3 className="text-2xl font-extrabold tracking-tight text-slate-900">Overview</h3>
                        <p className="text-slate-550 text-xs mt-1">Here&apos;s what your AI has been doing this week.</p>
                      </div>
                      <div className="bg-gradient-to-r from-primary to-blue-600 text-white rounded-full px-4 py-1.5 text-xs font-bold shadow-sm tracking-wide">
                        Active Workspace
                      </div>
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeFeature}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.35 }}
                      >
                        <DashboardMockup activeFeatureIndex={activeFeature} />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3 — Features (Operational Stack) - Mobile/Tablet Accordion */}
          <section className="lg:hidden block bg-slate-50 py-16 px-4 sm:px-6 md:px-8">
            <div className="mx-auto w-full max-w-[1440px] space-y-8">
              <div>
                <h2 className="text-3xl font-extrabold leading-tight text-slate-900">
                  Four modules. One AI command center.
                </h2>
              </div>

              <div className="space-y-3">
                {featureBriefings.map((feature, index) => {
                  const Icon = feature.icon
                  const active = index === activeMobileTab

                  return (
                    <div
                      key={feature.title}
                      onClick={(e) => handleMobileTabClick(index, e)}
                      className={`rounded-2xl transition-all duration-300 bg-white border border-slate-100 overflow-hidden cursor-pointer shadow-sm ${
                        active ? 'ring-2 ring-primary/20 shadow-md' : 'opacity-85'
                      }`}
                    >
                      {/* Header always visible */}
                      <div className="flex items-center justify-between p-5">
                        <div className="flex items-center gap-4">
                          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${
                            active ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-400'
                          }`}>
                            <Icon className="h-4 w-4" />
                          </span>
                          <h3 className="text-base font-bold text-slate-900">{feature.title}</h3>
                        </div>
                        <ChevronDown className={`h-5 w-5 text-slate-450 transition-transform duration-300 ${active ? 'rotate-180 text-primary' : ''}`} />
                      </div>

                      {/* Collapsible content (Combined dropdown with both texts and preview mockup inline) */}
                      <AnimatePresence initial={false}>
                        {active && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="px-5 pb-5 border-t border-slate-50 pt-4 space-y-5"
                          >
                            <div>
                              <p className="text-[13px] font-normal leading-5 text-slate-500">{feature.body}</p>
                              <p className="mt-3 text-xs font-bold uppercase tracking-wider text-primary">{feature.stat}</p>
                            </div>

                            {/* Inline High-fidelity Dashboard Mockup preview */}
                            <div className="bg-white rounded-2xl border border-slate-150 shadow-md overflow-hidden p-4 sm:p-5 min-h-[380px] flex flex-col justify-between">
                              <div>
                                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                                  <h4 className="text-xs font-bold text-slate-450 uppercase tracking-wider">Live Preview</h4>
                                  <div className="bg-gradient-to-r from-primary to-blue-600 text-white rounded-full px-2.5 py-0.5 text-[9px] font-bold shadow-sm tracking-wide">
                                    Active Demo
                                  </div>
                                </div>
                                <DashboardMockup activeFeatureIndex={index} />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        </div>

        {/* Competitive Table */}
        <CompetitiveTable />

        {/* Pricing Section */}
        <PricingSection onDemo={handleDemoLogin} isLoading={isDemoLoading} />

        {/* Testimonials */}
        <TestimonialsSection />

        {/* Early Access / Email Sign Up */}
        <EmailSection />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8 pt-16 pb-10">
          <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">

            {/* Brand column */}
            <div>
              <Link href="/" className="flex items-center gap-3 w-fit" aria-label="Byapar AI home">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-base font-bold text-white shadow-sm">B</span>
                <span className="text-lg font-bold tracking-wider text-slate-900">BYAPAR AI</span>
              </Link>
              <p className="mt-4 max-w-xs text-sm font-normal leading-6 text-slate-500">
                Replacing your social media manager, support agent, and review manager — with AI. Built for Bangladesh SMEs.
              </p>
              <div className="mt-6 flex gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Byapar AI on Facebook"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:border-primary hover:text-primary transition-colors"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Byapar AI on LinkedIn"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:border-primary hover:text-primary transition-colors"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </div>
            </div>

            {/* Product column */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Product</h3>
              <ul className="mt-5 space-y-3.5">
                {[
                  { label: 'Features', href: '#features' },
                  { label: 'Pricing', href: '#pricing' },
                  { label: 'Try Demo', href: '#', onClick: true },
                  { label: 'Sign In', href: '/login' },
                ].map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="text-sm font-semibold text-slate-500 hover:text-primary transition-colors">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company column */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Company</h3>
              <ul className="mt-5 space-y-3.5">
                {[
                  { label: 'About', href: '#' },
                  { label: 'CloudCamp 2026', href: '#' },
                  { label: 'Contact', href: '#' },
                  { label: 'UNLEFT Studio', href: 'https://www.unleft.space' },
                ].map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                      className="text-sm font-semibold text-slate-500 hover:text-primary transition-colors"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal column */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Legal</h3>
              <ul className="mt-5 space-y-3.5">
                {[
                  { label: 'Privacy Policy', href: '#' },
                  { label: 'Terms of Service', href: '#' },
                  { label: 'Cookie Policy', href: '#' },
                ].map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="text-sm font-semibold text-slate-500 hover:text-primary transition-colors">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Bottom bar */}
          <div className="mt-14 flex flex-col gap-3 border-t border-slate-100 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-semibold text-slate-400">
              © 2026 Byapar AI · All rights reserved.
            </p>
            <p className="text-xs font-semibold text-slate-400">
              Made with <Heart className="inline h-3.5 w-3.5 fill-[#FF2157] text-[#FF2157] mx-0.5" /> by{' '}
              <a href="https://www.unleft.space" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                UNLEFT
              </a>
              {' '}· Built for CloudCamp Bangladesh 2026
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function useScrollProgress(ref: React.RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const node = ref.current
      if (!node) return

      const rect = node.getBoundingClientRect()
      const scrollable = Math.max(1, rect.height - window.innerHeight)
      const next = Math.min(1, Math.max(0, -rect.top / scrollable))
      setProgress(next)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)

    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [ref])

  return progress
}

function HeroProof({ icon: Icon, label }: { icon: IconComponent; label: string }) {
  return (
    <span className="flex min-h-16 items-center gap-3 rounded-2xl bg-white border border-slate-200/85 px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm">
      <Icon className="h-5 w-5 shrink-0 text-primary" />
      {label}
    </span>
  )
}

function RealityCard({ item, index, isActive }: { item: (typeof realityCards)[number]; index: number; isActive: boolean }) {
  const Icon = item.icon

  return (
    <article 
      className={`relative min-w-[min(85vw,480px)] md:min-w-[520px] rounded-3xl bg-white p-8 transition-all duration-300 overflow-hidden ${
        isActive 
          ? 'shadow-[0_20px_50px_rgba(15,23,42,0.18)] scale-[1.02] z-20 opacity-100' 
          : 'opacity-40 scale-100 shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-bold uppercase tracking-widest text-primary">0{index}</span>
        <span className="rounded-xl bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-primary">{item.metric}</span>
      </div>
      <Icon className="mt-12 h-11 w-11 text-primary" />
      <h3 className="mt-6 max-w-lg text-2xl font-extrabold leading-tight text-slate-900">{item.title}</h3>
      <p className="mt-4 max-w-xl text-base font-normal leading-7 text-slate-550">{item.body}</p>
    </article>
  )
}

function DashboardMockup({ activeFeatureIndex }: { activeFeatureIndex: number }) {
  return (
    <div className="space-y-6 pt-6 animate-in fade-in duration-500">
      {/* Overview Stat Cards Row */}
      <div className="grid gap-4 grid-cols-3">
        {/* Stat card 1 */}
        <motion.div 
          animate={{
            scale: activeFeatureIndex === 0 ? 1.02 : 1.0,
            backgroundColor: activeFeatureIndex === 0 ? 'rgba(38, 86, 229, 0.05)' : 'rgba(248, 250, 252, 0.5)',
            borderColor: activeFeatureIndex === 0 ? 'var(--primary)' : 'var(--border)',
            opacity: activeFeatureIndex === 0 ? 1.0 : 0.6
          }}
          transition={{ duration: 0.25 }}
          className="rounded-2xl border p-4 shadow-sm"
        >
          <div className="flex items-center justify-between pb-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Posts</span>
            <Megaphone className={`w-3.5 h-3.5 ${activeFeatureIndex === 0 ? 'text-primary' : 'text-slate-400'}`} />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">12</div>
          <p className="text-[10px] text-emerald-600 flex items-center mt-1.5 font-bold">
            <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +20%
          </p>
        </motion.div>

        {/* Stat card 2 */}
        <motion.div 
          animate={{
            scale: activeFeatureIndex === 1 ? 1.02 : 1.0,
            backgroundColor: activeFeatureIndex === 1 ? 'rgba(38, 86, 229, 0.05)' : 'rgba(248, 250, 252, 0.5)',
            borderColor: activeFeatureIndex === 1 ? 'var(--primary)' : 'var(--border)',
            opacity: activeFeatureIndex === 1 ? 1.0 : 0.6
          }}
          transition={{ duration: 0.25 }}
          className="rounded-2xl border p-4 shadow-sm"
        >
          <div className="flex items-center justify-between pb-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Messages</span>
            <MessageSquare className={`w-3.5 h-3.5 ${activeFeatureIndex === 1 ? 'text-primary' : 'text-slate-400'}`} />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">145</div>
          <p className="text-[10px] text-emerald-600 flex items-center mt-1.5 font-bold">
            <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> 15s avg
          </p>
        </motion.div>

        {/* Stat card 3 */}
        <motion.div 
          animate={{
            scale: activeFeatureIndex === 2 ? 1.02 : 1.0,
            backgroundColor: activeFeatureIndex === 2 ? 'rgba(38, 86, 229, 0.05)' : 'rgba(248, 250, 252, 0.5)',
            borderColor: activeFeatureIndex === 2 ? 'var(--primary)' : 'var(--border)',
            opacity: activeFeatureIndex === 2 ? 1.0 : 0.6
          }}
          transition={{ duration: 0.25 }}
          className="rounded-2xl border p-4 shadow-sm"
        >
          <div className="flex items-center justify-between pb-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reviews</span>
            <Star className={`w-3.5 h-3.5 ${activeFeatureIndex === 2 ? 'text-primary' : 'text-slate-400'}`} />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">28</div>
          <p className="text-[10px] text-slate-550 flex items-center mt-1.5 font-semibold">
            100% rate
          </p>
        </motion.div>
      </div>

      {/* Content Area split layout matching actual page.tsx */}
      <div className="grid gap-6 md:grid-cols-7 pt-2">
        {/* Recent Activity Card */}
        <div className="md:col-span-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm relative">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">Recent Activity</h4>
          
          <div className="absolute top-12 bottom-6 left-[28px] w-0.5 bg-slate-100" />
          
          <div className="space-y-4 mt-4 relative">
            {/* Timeline item 1 */}
            <motion.div 
              animate={{ 
                opacity: activeFeatureIndex === 2 ? 1.0 : 0.4,
                scale: activeFeatureIndex === 2 ? 1.02 : 1.0,
                x: activeFeatureIndex === 2 ? 4 : 0
              }}
              transition={{ duration: 0.25 }}
              className="flex items-start gap-3 relative z-10"
            >
              <div className="p-1.5 bg-primary/10 text-primary rounded-lg border-2 border-white shrink-0">
                <Star className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 pt-0.5 min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">Auto-replied to a 5-star Review</p>
                <p className="text-[10px] text-slate-400 truncate">&quot;Great coffee!&quot; replied automatically</p>
              </div>
              <div className="text-[10px] text-slate-400 pt-0.5 shrink-0">10m ago</div>
            </motion.div>

            {/* Timeline item 2 */}
            <motion.div 
              animate={{ 
                opacity: activeFeatureIndex === 1 ? 1.0 : 0.4,
                scale: activeFeatureIndex === 1 ? 1.02 : 1.0,
                x: activeFeatureIndex === 1 ? 4 : 0
              }}
              transition={{ duration: 0.25 }}
              className="flex items-start gap-3 relative z-10"
            >
              <div className="p-1.5 bg-primary/10 text-primary rounded-lg border-2 border-white shrink-0">
                <MessageSquare className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 pt-0.5 min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">Replied to Messenger inquiry</p>
                <p className="text-[10px] text-slate-400 truncate">Sent address & parking hours</p>
              </div>
              <div className="text-[10px] text-slate-400 pt-0.5 shrink-0">1h ago</div>
            </motion.div>

            {/* Timeline item 3 */}
            <motion.div 
              animate={{ 
                opacity: activeFeatureIndex === 0 ? 1.0 : 0.4,
                scale: activeFeatureIndex === 0 ? 1.02 : 1.0,
                x: activeFeatureIndex === 0 ? 4 : 0
              }}
              transition={{ duration: 0.25 }}
              className="flex items-start gap-3 relative z-10"
            >
              <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg border-2 border-white shrink-0">
                <Megaphone className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 pt-0.5 min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">Published Facebook Post</p>
                <p className="text-[10px] text-slate-400 truncate">&quot;Weekend coffee special offer...&quot;</p>
              </div>
              <div className="text-[10px] text-slate-400 pt-0.5 shrink-0">Yesterday</div>
            </motion.div>
          </div>
        </div>

        {/* Automations Status Toggles / GBP advisor task card */}
        <div className="md:col-span-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-between">
          {activeFeatureIndex === 3 ? (
            <div className="h-full flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">Advisor Actions</h4>
                <div className="space-y-3 mt-4">
                  {[
                    'Add Eid opening hours',
                    'Upload 6 fresh photos',
                    'Publish weekly GBP post'
                  ].map((task, idx) => (
                    <motion.div 
                      key={task} 
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.08, duration: 0.25 }}
                      className="flex items-center gap-2.5 p-2 bg-slate-50 rounded-xl border border-slate-100"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="text-[11px] font-bold text-slate-700 leading-none">{task}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="mt-4 bg-primary/10 rounded-xl p-3 border border-primary/20">
                <p className="text-[10px] text-primary font-bold uppercase tracking-wider flex items-center">
                  <Globe2 className="w-3.5 h-3.5 mr-1 animate-pulse" /> GBP Advisor
                </p>
                <p className="text-[11px] font-bold text-slate-800 mt-1 leading-normal">+31% map visibility actions generated.</p>
              </div>
            </div>
          ) : (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">Automation Status</h4>
              <div className="space-y-4 mt-4">
                {/* Toggle 1 */}
                <div className="flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <p className="text-[11px] font-bold text-slate-800 leading-tight">Post Generator</p>
                    <p className={`text-[9px] font-bold mt-0.5 truncate ${activeFeatureIndex === 0 ? 'text-emerald-500' : 'text-slate-400'}`}>
                      {activeFeatureIndex === 0 ? 'Active (3/wk)' : 'Paused'}
                    </p>
                  </div>
                  <div className={`w-9 h-5 rounded-full relative transition-colors duration-300 shadow-inner shrink-0 ${activeFeatureIndex === 0 ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                    <motion.span 
                      animate={{ x: activeFeatureIndex === 0 ? 16 : 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm"
                    />
                  </div>
                </div>

                {/* Toggle 2 */}
                <div className="flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <p className="text-[11px] font-bold text-slate-800 leading-tight">Messenger Auto-Reply</p>
                    <p className={`text-[9px] font-bold mt-0.5 truncate ${activeFeatureIndex === 1 ? 'text-emerald-500' : 'text-slate-400'}`}>
                      {activeFeatureIndex === 1 ? 'Active (60s)' : 'Paused'}
                    </p>
                  </div>
                  <div className={`w-9 h-5 rounded-full relative transition-colors duration-300 shadow-inner shrink-0 ${activeFeatureIndex === 1 ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                    <motion.span 
                      animate={{ x: activeFeatureIndex === 1 ? 16 : 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm"
                    />
                  </div>
                </div>

                {/* Toggle 3 */}
                <div className="flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <p className="text-[11px] font-bold text-slate-800 leading-tight">Review Reply Drafts</p>
                    <p className={`text-[9px] font-bold mt-0.5 truncate ${activeFeatureIndex === 2 ? 'text-amber-500' : 'text-slate-400'}`}>
                      {activeFeatureIndex === 2 ? 'Active (Drafts)' : 'Paused'}
                    </p>
                  </div>
                  <div className={`w-9 h-5 rounded-full relative transition-colors duration-300 shadow-inner shrink-0 ${activeFeatureIndex === 2 ? 'bg-amber-500' : 'bg-slate-200'}`}>
                    <motion.span 
                      animate={{ x: activeFeatureIndex === 2 ? 16 : 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CompetitiveTable() {
  return (
    <section id="compare" className="bg-slate-50 px-4 py-24 sm:px-6 md:px-8 scroll-mt-20">
      <div className="mx-auto max-w-[1440px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <h2 className="mt-3 max-w-3xl text-balance text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl">
            Built for the work generic tools leave behind.
          </h2>
        </motion.div>

        <div className="mt-10 overflow-x-auto no-scrollbar rounded-3xl bg-white border border-slate-200/80 p-3 shadow-sm">
          <table className="w-full min-w-[900px] border-collapse text-left text-sm">
            <thead>
              <tr className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                <th className="px-5 py-4">Capability</th>
                <th className="px-5 py-4 text-primary font-extrabold">Byapar AI</th>
                <th className="px-5 py-4">Buffer/Hootsuite</th>
                <th className="px-5 py-4">Generic chatbot</th>
                <th className="px-5 py-4">Human agency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {comparisonRows.map((row) => (
                <tr key={row[0]} className="font-semibold text-slate-655">
                  <td className="px-5 py-5 text-slate-900 font-bold">{row[0]}</td>
                  {row.slice(1).map((value, index) => (
                    <td key={`${row[0]}-${value}-${index}`} className={`px-5 py-5 ${index === 0 ? 'bg-primary/5 text-primary font-bold' : ''}`}>
                      <CapabilityValue value={value} byapar={index === 0} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

function CapabilityValue({ value, byapar }: { value: string; byapar?: boolean }) {
  if (value === 'Yes') {
    return (
      <span className={`inline-flex items-center gap-2 ${byapar ? 'text-primary' : 'text-emerald-500'}`}>
        <Check className="h-4 w-4" />
        Yes
      </span>
    )
  }

  if (value === 'No') return <span className="font-bold text-rose-500">No</span>

  return <span className={byapar ? 'font-bold text-primary' : ''}>{value}</span>
}

function PricingSection({ onDemo, isLoading }: { onDemo: () => void; isLoading: boolean }) {
  return (
    <section id="pricing" className="scroll-mt-24 bg-slate-50 px-4 py-24 sm:px-6 md:px-8">
      <div className="mx-auto max-w-[1440px]">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="mt-3 text-balance text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl">
            Simple plans. Real first month free.
          </h2>
          <p className="mt-4 text-slate-550 text-base font-medium">Start on any plan for ৳0 in Month 1.</p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4"
        >
          {pricingPlans.map((plan) => (
            <motion.article
              key={plan.name}
              variants={fadeInUp}
              className={`relative rounded-3xl bg-white p-8 border shadow-sm flex flex-col justify-between ${
                plan.popular ? 'border-primary ring-2 ring-primary/20 scale-[1.01]' : 'border-slate-200/80 scale-100'
              }`}
            >
              <div>
                {plan.popular ? (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                    Most Popular
                  </div>
                ) : null}
                <h3 className="text-2xl font-extrabold text-slate-900">{plan.name}</h3>
                <p className="mt-3 min-h-12 text-sm font-medium leading-6 text-slate-550">{plan.note}</p>
                <p className="mt-6 text-4xl font-black text-slate-900">
                  {plan.price}
                  <span className="text-sm font-normal text-slate-400">/mo</span>
                </p>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm font-semibold text-slate-655">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                onClick={onDemo}
                disabled={isLoading}
                className={`mt-8 h-12 w-full rounded-xl font-bold transition-all active:scale-[0.98] cursor-pointer ${
                  plan.popular ? 'bg-primary text-white hover:bg-primary/95 shadow-md' : 'bg-slate-50 border border-slate-200/80 text-primary hover:bg-slate-100'
                }`}
              >
                Start Free
              </Button>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  return (
    <section id="testimonials" className="bg-slate-50 px-4 py-24 sm:px-6 md:px-8 scroll-mt-20">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="mt-3 text-balance text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl">
              Local operators need fewer dashboards and faster hands.
            </h2>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid gap-6"
          >
            {testimonials.map((item) => (
              <motion.blockquote 
                key={item.name} 
                variants={fadeInUp}
                className="rounded-3xl bg-white border border-slate-200/80 p-8 shadow-sm"
              >
                <p className="text-lg font-semibold leading-8 text-slate-900">&quot;{item.quote}&quot;</p>
                <footer className="mt-5 text-sm font-bold uppercase tracking-wider text-primary">
                  {item.name} / {item.role}
                </footer>
              </motion.blockquote>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function EmailSection() {
  return (
    <section className="bg-slate-50 px-4 pb-24 sm:px-6 md:px-8">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="mx-auto max-w-5xl rounded-3xl bg-white p-8 shadow-md"
      >
        <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-slate-900">Get the next SME automation drop.</h2>
            <p className="mt-3 text-sm font-normal leading-6 text-slate-500">
              One update when new features, pricing tiers, or integrations ship. No spam.
            </p>
          </div>
          <form className="flex flex-col gap-3 sm:flex-row" onSubmit={(event) => event.preventDefault()}>
            <Input
              type="email"
              aria-label="Email address"
              placeholder="owner@business.com"
              className="h-12 rounded-xl bg-slate-50 border border-slate-200 px-4 font-semibold text-slate-800 placeholder-slate-400 focus-visible:ring-2 focus-visible:ring-primary"
            />
            <Button className="h-12 rounded-xl bg-primary px-6 font-bold text-white shadow-md hover:bg-primary/95 transition-all active:scale-[0.98] cursor-pointer">
              <Send className="mr-2 h-4 w-4" />
              Join
            </Button>
          </form>
        </div>
      </motion.div>
    </section>
  )
}
