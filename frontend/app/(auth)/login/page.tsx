'use client'

import { useState } from 'react'
import Link from 'next/link'
import { startGoogleLogin } from '@/lib/api'
import { Sparkles, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)

  const handleGoogleLogin = () => {
    setLoading(true)
    startGoogleLogin() // redirects browser to backend → Google OAuth
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mb-4 shadow-lg shadow-blue-200">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Byapar AI</h1>
            <p className="text-gray-500 text-sm mt-1">AI Growth & Operations System</p>
          </div>

          {/* Welcome text */}
          <div className="mb-6 text-center">
            <h2 className="text-lg font-semibold text-gray-800">Welcome back</h2>
            <p className="text-sm text-gray-500 mt-1">Sign in to manage your business AI</p>
          </div>

          {/* Google login button */}
          <button
            id="google-login-btn"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl border-2 border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all text-sm font-semibold text-gray-700 shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                <path d="M1 1h22v22H1z" fill="none"/>
              </svg>
            )}
            {loading ? 'Redirecting to Google...' : 'Continue with Google'}
          </button>

          <p className="text-center text-xs text-gray-400 mt-5">
            Secure OAuth 2.0 login. We never store your password.
          </p>

          {/* Demo mode */}
          <div className="mt-6 pt-5 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500 mb-2">Want to explore first?</p>
            <Link
              href="/"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
            >
              Go back to Homepage →
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  )
}
