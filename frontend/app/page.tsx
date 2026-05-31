'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  BarChart3,
  Building2,
  Check,
  CheckCircle2,
  Clock,
  Heart,
  ImageIcon,
  LayoutDashboard,
  MapPin,
  Megaphone,
  MessageSquare,
  Star,
  TrendingUp,
  type LucideIcon,
  X,
  Zap,
} from 'lucide-react'

import { Button } from '@/components/ui/button'

type IconComponent = LucideIcon

const painPoints = [
  {
    icon: MessageSquare,
    title: 'Unanswered Messenger messages',
    impact: 'lost sales',
  },
  {
    icon: Star,
    title: 'No Google review replies',
    impact: 'damaged reputation',
  },
  {
    icon: Megaphone,
    title: 'Zero social media posting',
    impact: 'reduced visibility',
  },
  {
    icon: ImageIcon,
    title: 'No branded content',
    impact: 'high agency cost',
  },
  {
    icon: MapPin,
    title: 'Poor GBP optimization',
    impact: 'less map visibility',
  },
]

const features = [
  {
    icon: Megaphone,
    iconClassName: 'bg-primary/10 text-primary',
    title: 'AI Post Generator',
    body: 'AI generates captions based on your business knowledge: menu, offers, and services. It creates images, suggests optimal posting times, and publishes directly to your Facebook Page.',
    visual: 'posts',
  },
  {
    icon: MessageSquare,
    iconClassName: 'bg-blue-100 text-blue-600',
    title: 'Smart Auto-Replies',
    body: 'Connects to your Facebook Page inbox. AI reads incoming messages and generates relevant replies using your products, prices, and hours. Replies in under 60 seconds.',
    visual: 'chat',
  },
  {
    icon: Star,
    iconClassName: 'bg-amber-100 text-amber-600',
    title: 'Google Review Management',
    body: 'Fetches new Google reviews and generates personalized, professional replies for positive, neutral, and negative reviews. A 95%+ reply rate stays within reach.',
    visual: 'reviews',
  },
  {
    icon: Building2,
    iconClassName: 'bg-emerald-100 text-emerald-600',
    title: 'GBP Profile Advisor',
    body: 'Analyzes your profile completeness, recommends missing information, auto-generates GBP posts, and tracks weekly profile views.',
    visual: 'gbp',
  },
  {
    icon: BarChart3,
    iconClassName: 'bg-cyan-100 text-cyan-600',
    title: 'Performance Analytics',
    body: 'Weekly AI-generated summaries show what your AI agents did: posts published, messages handled, reviews replied, and hours saved.',
    visual: 'analytics',
  },
]

const comparisonRows = [
  ['Facebook Post AI Generation', 'Yes', 'No', 'No', 'Yes'],
  ['Bengali Language Support', 'Yes', 'No', 'Partial', 'Yes'],
  ['Google Review Auto-Reply', 'Yes', 'No', 'No', 'Yes'],
  ['Messenger AI Reply', 'Yes', 'No', 'Yes', 'Yes'],
  ['AI Image Generation', 'Yes', 'No', 'No', 'Yes'],
  ['Local SME Focus', 'Yes', 'No', 'No', 'Varies'],
  ['Monthly Cost (BDT)', 'BDT 500-5,000', 'BDT 3,000-10,000', 'BDT 2,000-8,000', 'BDT 15,000-40,000'],
]

const pricingPlans = [
  {
    name: 'Starter',
    price: 'BDT 500',
    features: ['Facebook posts: 10/mo', 'Google review replies', 'Monthly activity recap'],
  },
  {
    name: 'Growth',
    price: 'BDT 1,500',
    features: ['Unlimited posts', 'Messenger replies', 'GBP advisor'],
    popular: true,
  },
  {
    name: 'Pro',
    price: 'BDT 3,000',
    features: ['Everything in Growth', 'Instagram support', 'Priority support'],
  },
  {
    name: 'Business',
    price: 'BDT 5,000',
    features: ['Everything in Pro', 'Multi-branch support', 'Custom AI training'],
  },
]

const segments = [
  'Restaurants & Food',
  'Clinics & Healthcare',
  'Salons & Beauty',
  'Retail Shops',
  'Hotels & Hospitality',
  'Real Estate (Coming Soon)',
]

export default function LandingPage() {
  const router = useRouter()
  const [isDemoLoading, setIsDemoLoading] = useState(false)

  const handleDemoLogin = () => {
    setIsDemoLoading(true)
    document.cookie = 'demo_mode=true; path=/;'

    const mockState = {
      state: {
        activeBusinessId: 'demo-business-123',
        activeBusinessName: 'Demo Cafe & Bakery',
        activeRole: 'owner',
      },
      version: 0,
    }
    localStorage.setItem('byaper-workspace-storage', JSON.stringify(mockState))

    setTimeout(() => {
      router.push('/demo-business-123')
    }, 600)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7f8fa] font-sans text-slate-950 selection:bg-primary/10">

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-xl focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-primary focus:shadow-lg focus-visible:ring-3 focus-visible:ring-primary/30"
      >
        Skip to main content
      </a>

      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 rounded-xl focus-visible:ring-3 focus-visible:ring-primary/30" aria-label="Byapar AI home">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-sm font-black text-white">
              B
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-950">Byapar AI</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/login">
              <Button variant="ghost" className="rounded-xl font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900">
                Sign In
              </Button>
            </Link>
            <Link href="#pricing" className="hidden rounded-lg text-sm font-bold text-slate-600 transition-colors hover:text-primary focus-visible:ring-3 focus-visible:ring-primary/30 sm:inline-flex">
              Pricing
            </Link>
            <Button
              onClick={handleDemoLogin}
              disabled={isDemoLoading}
              className="h-11 rounded-lg bg-primary px-5 font-semibold text-white shadow-none transition-colors hover:bg-primary/90 active:bg-primary/95"
            >
              {isDemoLoading ? 'Loading' : 'Try Demo'}
            </Button>
          </div>
        </div>
      </nav>

      <main id="main-content" className="relative z-10">
        <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-14 sm:px-6 md:grid-cols-[0.92fr_1.08fr] md:pb-24 md:pt-18 lg:gap-16">
          <div className="text-center md:text-left">
            <div className="mb-8 inline-flex items-center border-l-4 border-primary bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-700 shadow-sm">
              Now available for SMEs in Bangladesh
            </div>

            <h1 className="mb-5 text-balance text-5xl font-black leading-[1.02] tracking-tight text-slate-950 md:text-6xl">
              Your Business,
              <br />
              <span className="text-primary">Automated by AI</span>
            </h1>

            <p className="mb-4 font-serif text-base italic text-slate-500">&quot;AI for your Byapar&quot;</p>
            <p className="mx-auto mb-9 max-w-2xl text-lg font-medium leading-relaxed text-slate-600 md:mx-0">
              Byapar AI replaces your social media manager, customer support agent, and review manager at a fraction of the cost.
              Built exclusively for Bangladeshi SMEs.
            </p>

            <div className="mb-7 flex flex-col items-center gap-4 sm:flex-row md:items-start">
              <Button
                onClick={handleDemoLogin}
                size="lg"
                disabled={isDemoLoading}
                className="h-14 w-full rounded-lg bg-primary px-8 text-base font-bold text-white shadow-none transition-colors hover:bg-primary/95 active:bg-primary/90 sm:w-auto"
              >
                {isDemoLoading ? 'Loading Demo' : 'Explore Demo Environment'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Link href="/login" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 w-full rounded-lg border-slate-300 bg-white px-8 text-base font-bold text-slate-800 shadow-none transition-colors hover:bg-slate-50 active:bg-slate-100 sm:w-auto"
                >
                  Sign Up for Free
                </Button>
              </Link>
            </div>

            <div className="flex flex-col gap-3 text-sm font-bold text-slate-600 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-6 md:justify-start">
              <TrustBadge icon={Zap} label="Under 60s Response Time" />
              <TrustBadge icon={Megaphone} label="10 AI Posts/Month" />
              <TrustBadge icon={Star} label="95%+ Review Reply Rate" />
            </div>
          </div>

          <DashboardMockup />
        </section>

        <section className="border-y border-slate-200 bg-slate-100 px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 max-w-3xl">
                <h2 className="text-balance text-3xl font-bold tracking-tight text-slate-950">The reality for most Bangladeshi SMEs</h2>
                <p className="mt-3 text-lg text-slate-600">Too busy to manage digital presence. Too expensive to hire a team.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {painPoints.map((item) => (
                <PainPointCard key={item.title} {...item} />
              ))}
              <CostComparisonCard />
            </div>
          </div>
        </section>

        <section id="features" className="scroll-mt-24 px-4 py-24 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 max-w-2xl">
              <p className="text-sm font-black uppercase tracking-widest text-primary">MVP features</p>
              <h2 className="mt-3 text-balance text-4xl font-black tracking-tight text-slate-950">Five practical workflows your team can stop chasing manually</h2>
            </div>

            <div className="space-y-20">
              {features.map((feature, index) => (
                <FeatureRow key={feature.title} feature={feature} reverse={index % 2 === 1} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-24 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-widest text-primary">Competitive positioning</p>
                <h2 className="mt-3 text-balance text-3xl font-black tracking-tight text-slate-950 md:text-4xl">Why Byapar AI beats every alternative</h2>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 bg-white shadow-sm">
              <table className="min-w-[860px] w-full border-collapse bg-white text-left text-sm">
                <thead className="bg-slate-50 text-xs font-black uppercase tracking-widest text-slate-500">
                  <tr>
                    <th className="sticky left-0 z-10 border-b border-slate-200 bg-slate-50 px-5 py-4">Capability</th>
                    <th className="border-b border-l-2 border-primary bg-primary/5 px-5 py-4 text-primary">Byapar AI</th>
                    <th className="border-b border-slate-200 px-5 py-4">Buffer/Hootsuite</th>
                    <th className="border-b border-slate-200 px-5 py-4">Generic Chatbot</th>
                    <th className="border-b border-slate-200 px-5 py-4">Human Agency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {comparisonRows.map((row) => (
                    <tr key={row[0]} className="text-slate-700">
                      <td className="sticky left-0 z-10 bg-white px-5 py-4 font-bold text-slate-950">{row[0]}</td>
                      {row.slice(1).map((value, index) => (
                        <td key={`${row[0]}-${value}-${index}`} className={index === 0 ? 'border-l-2 border-primary bg-primary/5 px-5 py-4 font-bold' : 'px-5 py-4'}>
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

        <section id="pricing" className="scroll-mt-24 bg-slate-50 px-4 py-24 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <h2 className="text-balance text-4xl font-black tracking-tight text-slate-950">Simple pricing. Real results.</h2>
              <p className="mt-3 text-lg text-slate-600">Start free. Scale with your business. Cancel anytime.</p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4 lg:items-center">
              {pricingPlans.map((plan) => (
                <PricingCard key={plan.name} plan={plan} />
              ))}
            </div>

            <div className="mt-10 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-5 py-2 text-sm font-black text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
                BDT 0 for the first month - no credit card required.
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-24 sm:px-6">
          <div className="mx-auto max-w-5xl text-center">
            <h2 className="text-balance text-4xl font-black tracking-tight text-slate-950">Built for every Bangladeshi business</h2>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {segments.map((segment) => (
                <span key={segment} className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm">
                  {segment}
                </span>
              ))}
            </div>
            <blockquote className="mx-auto mt-12 max-w-3xl border border-slate-200 bg-white p-8 text-left shadow-sm">
              <p className="font-serif text-2xl italic leading-relaxed text-slate-800">
                &quot;I&apos;m too busy to manage social media. I lose customers because I don&apos;t reply fast enough.
                Byapar AI fixed that.&quot;
              </p>
              <footer className="mt-5 text-sm font-black text-slate-950">Rahim Bhai, Restaurant Owner, Dhaka</footer>
            </blockquote>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200/80 bg-white px-4 pb-8 pt-12 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
            <div className="max-w-sm">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-sm font-black text-white">
                  B
                </div>
                <span className="text-xl font-extrabold tracking-tight text-slate-950">Byapar AI</span>
              </div>
              <p className="mt-4 text-sm font-semibold text-slate-600">AI for your Byapar</p>
              <p className="mt-2 text-sm text-slate-500">(c) 2026 Byapar AI. All rights reserved.</p>
            </div>

            <div className="grid gap-8 sm:grid-cols-3 lg:min-w-[420px]">
              <FooterColumn title="Product" links={['Features', 'Pricing', 'Demo']} />
              <FooterColumn title="Company" links={['About', 'Blog', 'Careers']} />
              <FooterColumn title="Legal" links={['Privacy Policy', 'Terms of Service']} />
            </div>

            <div>
              <p className="flex items-center gap-1 text-sm font-semibold text-slate-600">
                Made with <Heart className="h-4 w-4 fill-rose-500 text-rose-500" /> by
              </p>
              <a
                href="https://www.unleft.space"
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block rounded-lg text-xl font-black text-slate-900 transition-colors hover:text-primary focus-visible:ring-3 focus-visible:ring-primary/30"
              >
                UNLEFT
              </a>
            </div>
          </div>
          <div className="mt-10 border-t border-slate-100 pt-6 text-xs font-semibold text-slate-400">Built for CloudCamp Bangladesh 2026</div>
        </div>
      </footer>
    </div>
  )
}

function TrustBadge({ icon: Icon, label }: { icon: IconComponent; label: string }) {
  return (
    <span className="inline-flex items-center justify-center gap-2 border-l-2 border-slate-300 bg-white px-3 py-2 text-slate-700">
      <Icon className="h-4 w-4 text-primary" />
      {label}
    </span>
  )
}

function DashboardMockup() {
  const navItems = [
    { label: 'Dashboard', active: true, icon: LayoutDashboard },
    { label: 'Posts', icon: Megaphone },
    { label: 'Messages', icon: MessageSquare },
    { label: 'Reviews', icon: Star },
  ]

  return (
    <div className="relative border border-slate-300 bg-white p-3 shadow-sm">
      <div className="aspect-[4/3] overflow-hidden border border-slate-200 bg-slate-50 text-left text-slate-900">
        <div className="flex h-full">
          <aside className="hidden w-48 shrink-0 flex-col border-r border-slate-200 bg-white p-4 sm:flex">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-950 text-[11px] font-black text-white">
                B
              </div>
              <span className="text-sm font-black tracking-tight text-slate-900">BYAPAR AI</span>
            </div>

            <div className="mt-5 border border-slate-200 bg-slate-50 p-3">
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Active Workspace</div>
              <div className="mt-1 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="truncate text-xs font-bold text-slate-800">Demo Cafe & Bakery</span>
              </div>
            </div>

            <nav className="mt-5 space-y-1.5">
              {navItems.map(({ label, active, icon: Icon }) => (
                <div
                  key={label}
                  className={
                    active
                      ? 'flex items-center gap-2.5 border-l-4 border-primary bg-slate-100 px-3 py-2 text-xs font-bold text-primary'
                      : 'flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-500'
                  }
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </div>
              ))}
            </nav>
          </aside>

          <div className="flex min-w-0 flex-1 flex-col gap-5 p-4 sm:p-6">
            <div>
              <h2 className="text-lg font-black text-slate-950">Overview</h2>
              <p className="mt-1 text-xs font-semibold text-slate-500">Here&apos;s what your AI has been doing this week.</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <MockStat title="Posts Published" value="12" meta="+20% from last week" />
              <MockStat title="Messages Handled" value="145" meta="Avg reply: 15s" />
              <div className="border border-primary bg-primary p-4 text-white">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-white/85">Auto-Pilot</span>
                <p className="mt-6 text-xs font-semibold leading-relaxed">Active and responding to customer queries.</p>
              </div>
            </div>

            <div className="min-h-0 flex-1 border border-slate-200 bg-white p-4">
              <span className="text-xs font-black text-slate-800">Recent Activity</span>
              <div className="mt-3 space-y-3">
                <ActivityItem text="Auto-replied to a 5-star Google Review" time="10m ago" />
                <ActivityItem text='Published Facebook Post: "Check out our weekend special..."' time="Yesterday" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MockStat({ title, value, meta }: { title: string; value: string; meta: string }) {
  return (
    <div className="border border-slate-200 bg-white p-4">
      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">{title}</span>
      <span className="mt-1 block text-2xl font-black text-slate-900">{value}</span>
      <span className="mt-1 flex items-center gap-1 text-[10px] font-bold text-emerald-700">
        <TrendingUp className="h-3 w-3" />
        {meta}
      </span>
    </div>
  )
}

function ActivityItem({ text, time }: { text: string; time: string }) {
  return (
    <div className="flex items-start gap-3 border-b border-slate-100 pb-3 text-xs last:border-0 last:pb-0">
      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
      <span className="font-semibold text-slate-700">{text}</span>
      <span className="ml-auto whitespace-nowrap text-[10px] font-semibold text-slate-400">{time}</span>
    </div>
  )
}

function PainPointCard({ icon: Icon, title, impact }: { icon: IconComponent; title: string; impact: string }) {
  return (
    <div className="flex min-h-44 flex-col justify-between border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <div className="mb-5 flex h-10 w-10 items-center justify-center border border-rose-200 bg-rose-50 text-rose-600">
          <Icon className="h-5 w-5" />
        </div>
        <p className="max-w-[18rem] font-bold leading-snug text-slate-950">{title}</p>
      </div>
      <p className="mt-4 text-sm font-semibold text-slate-600">
        leads to <span className="text-rose-700">{impact}</span>
      </p>
    </div>
  )
}

function CostComparisonCard() {
  return (
    <div className="flex min-h-44 flex-col justify-between border border-slate-300 bg-white p-6 shadow-sm">
      <div>
        <div className="mb-5 h-1 w-16 bg-primary" />
        <p className="text-xs font-black uppercase tracking-widest text-slate-500">Cost comparison</p>
        <h3 className="mt-2 max-w-[18rem] text-xl font-black leading-tight text-slate-950">A full-time digital team costs more than most SMEs can carry.</h3>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-200 pt-4 text-sm">
        <div>
          <p className="font-semibold text-slate-500">Full team</p>
          <p className="mt-1 font-black text-slate-950">BDT 15k-30k/mo</p>
        </div>
        <div>
          <p className="font-semibold text-slate-500">Byapar AI</p>
          <p className="mt-1 font-black text-primary">BDT 500-5k/mo</p>
        </div>
      </div>
    </div>
  )
}

function FeatureRow({ feature, reverse }: { feature: (typeof features)[number]; reverse: boolean }) {
  const Icon = feature.icon

  return (
    <div className="grid items-center gap-10 md:grid-cols-2 md:gap-12">
      <div className={reverse ? 'md:order-2' : undefined}>
        <div className={`mb-6 flex h-12 w-12 items-center justify-center border ${feature.iconClassName}`}>
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-3xl font-black tracking-tight text-slate-950">{feature.title}</h3>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">{feature.body}</p>
      </div>
      <FeatureVisual type={feature.visual} reverse={reverse} />
    </div>
  )
}

function FeatureVisual({ type, reverse }: { type: string; reverse: boolean }) {
  const commonClass = `border border-slate-200 bg-white p-5 shadow-sm ${reverse ? 'md:order-1' : ''}`

  if (type === 'chat') {
    return (
      <div className={commonClass}>
        <div className="space-y-4 bg-slate-50 p-5">
          <div className="ml-auto max-w-[82%] border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-700">
            Hi, are you open after 10 PM today?
          </div>
          <div className="max-w-[86%] border border-primary bg-primary p-4 text-sm font-semibold text-white">
            Yes, Demo Cafe is open until 11 PM tonight. Our weekend special is also available.
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
            <Clock className="h-4 w-4" />
            Replied in 15 seconds
          </div>
        </div>
      </div>
    )
  }

  if (type === 'reviews') {
    return (
      <div className={commonClass}>
        <div className="bg-slate-50 p-5">
          <div className="flex gap-1 text-amber-500">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} className="h-5 w-5 fill-current" />
            ))}
          </div>
          <p className="mt-4 text-sm font-semibold text-slate-700">Great coffee and the fastest delivery in Dhanmondi.</p>
          <div className="mt-5 border border-slate-200 bg-white p-4">
            <p className="text-xs font-black uppercase tracking-widest text-primary">AI reply</p>
            <p className="mt-2 text-sm text-slate-600">Thank you for the kind words. We are happy you enjoyed the coffee and delivery experience.</p>
          </div>
        </div>
      </div>
    )
  }

  if (type === 'gbp') {
    return (
      <div className={commonClass}>
        <div className="grid gap-4 bg-slate-50 p-5">
          {['Add Eid opening hours', 'Upload 6 menu photos', 'Publish weekly GBP post'].map((task, index) => (
            <div key={task} className="flex items-center gap-3 border border-slate-200 bg-white p-4">
              <div className="flex h-9 w-9 items-center justify-center border border-emerald-200 bg-emerald-50 text-emerald-700">{index + 1}</div>
              <span className="text-sm font-bold text-slate-700">{task}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (type === 'analytics') {
    return (
      <div className={commonClass}>
        <div className="bg-slate-50 p-5">
          <div className="grid grid-cols-3 gap-3">
            {[
              ['12', 'Posts'],
              ['145', 'Messages'],
              ['28', 'Reviews'],
            ].map(([value, label]) => (
              <div key={label} className="border border-slate-200 bg-white p-4 text-center">
                <div className="text-2xl font-black text-slate-950">{value}</div>
                <div className="mt-1 text-xs font-bold text-slate-500">{label}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 border-l-4 border-cyan-500 bg-cyan-50 p-4 text-sm font-semibold text-cyan-900">
            AI saved an estimated 9.5 owner hours this week.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={commonClass}>
      <div className="bg-slate-50 p-5">
        <div className="border border-slate-200 bg-white p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Facebook post draft</p>
              <p className="mt-1 text-sm font-bold text-slate-900">Weekend Special</p>
            </div>
            <Megaphone className="h-5 w-5 text-blue-600" />
          </div>
          <div className="aspect-[16/9] border border-primary bg-primary p-5 text-white">
            <p className="text-sm font-black uppercase tracking-widest text-white/70">Demo Cafe</p>
            <p className="mt-8 text-2xl font-black">Buy 1, Get 1 Coffee</p>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Best time: 7:30 PM</span>
            <span className="text-emerald-700">Ready to publish</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function CapabilityValue({ value, byapar }: { value: string; byapar?: boolean }) {
  if (value === 'Yes') {
    return (
      <span className={`inline-flex items-center gap-2 font-bold ${byapar ? 'text-primary' : 'text-emerald-700'}`}>
        <Check className="h-4 w-4" />
        Yes
      </span>
    )
  }

  if (value === 'No') {
    return (
      <span className="inline-flex items-center gap-2 font-bold text-rose-600">
        <X className="h-4 w-4" />
        No
      </span>
    )
  }

  return <span className={byapar ? 'font-black text-primary' : 'font-semibold text-slate-700'}>{value}</span>
}

function PricingCard({ plan }: { plan: (typeof pricingPlans)[number] }) {
  return (
    <div
      className={
        plan.popular
          ? 'relative border-2 border-primary bg-white p-8 shadow-sm'
          : 'border border-slate-200 bg-white p-8 shadow-sm'
      }
    >
      {plan.popular ? (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary px-4 py-1 text-xs font-black text-white shadow-sm">
          Most Popular
        </div>
      ) : null}
      <h3 className="text-xl font-black text-slate-950">{plan.name}</h3>
      <div className="mt-4">
        <span className="text-3xl font-black text-slate-950">{plan.price}</span>
        <span className="text-sm font-semibold text-slate-500">/mo</span>
      </div>
      <ul className="mt-6 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm font-semibold text-slate-600">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            {feature}
          </li>
        ))}
      </ul>
      <Button className={plan.popular ? 'mt-8 h-11 w-full rounded-xl bg-primary font-bold text-white' : 'mt-8 h-11 w-full rounded-xl font-bold'} variant={plan.popular ? 'default' : 'outline'}>
        Start Free
      </Button>
    </div>
  )
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">{title}</h3>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link}>
            <a href={getFooterHref(link)} className="rounded-lg text-sm font-semibold text-slate-600 transition-colors hover:text-primary focus-visible:ring-3 focus-visible:ring-primary/30">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

function getFooterHref(link: string) {
  if (link === 'Features') return '#features'
  if (link === 'Pricing') return '#pricing'
  if (link === 'Demo') return '#main-content'

  return '/'
}
