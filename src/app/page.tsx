'use client'

import { useState, useEffect, useRef, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [errorKey, setErrorKey] = useState(0)
  const [checkingSession, setCheckingSession] = useState(true)

  const emailRef = useRef<HTMLInputElement>(null)

  // Check existing session on mount — redirect if already logged in
  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user) {
        router.replace('/dashboard')
      } else {
        setCheckingSession(false)
      }
    }
    check()
  }, [router, supabase])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'signup') {
        if (password.length < 6) throw new Error('Password must be at least 6 characters.')
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setError('Account created! Check your email to confirm.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        setSuccess(true)
        setTimeout(() => router.replace('/dashboard'), 1200)
      }
    } catch (err) {
      let msg = err instanceof Error ? err.message : 'Something went wrong.'
      if (msg.includes('Invalid login credentials')) msg = 'Incorrect email or password.'
      if (msg.includes('Email not confirmed')) msg = 'Please confirm your email first.'
      if (msg.includes('rate limit')) msg = 'Too many attempts. Please wait.'
      setError(msg)
      setErrorKey(k => k + 1)
    } finally {
      setLoading(false)
    }
  }

  async function handleForgot() {
    if (!email) {
      setError('Enter your email first, then click Forgot Password.')
      setErrorKey(k => k + 1)
      return
    }
    setLoading(true)
    setError('')
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) throw error
      setError('Password reset email sent. Check your inbox.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email.')
      setErrorKey(k => k + 1)
    } finally {
      setLoading(false)
    }
  }

  if (checkingSession) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-midnight to-slateblue">
        <div className="text-warmwhite text-sm animate-pulse">Checking session…</div>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center p-5 bg-gradient-to-br from-midnight via-midnight to-slateblue overflow-hidden">
      {/* soft radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(184,115,79,0.18),transparent_60%)]" />

      {/* card */}
      <div className="relative w-full max-w-md animate-fade-in">
        <div className="rounded-[40px] border border-white/15 bg-white/10 backdrop-blur-2xl shadow-2xl p-8">
          {success ? (
            <div className="text-center py-6 animate-fade-up">
              <div className="mx-auto w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mb-4 shadow-[0_0_0_8px_rgba(34,197,94,0.2)]">
                <svg viewBox="0 0 52 52" className="w-10 h-10">
                  <path
                    d="M14 27 L22 35 L38 19"
                    fill="none"
                    stroke="white"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-green-400 mb-1">Welcome back!</h2>
              <p className="text-white/80 text-sm">Redirecting to your dashboard…</p>
            </div>
          ) : (
            <>
              <h1 className="text-2xl sm:text-3xl font-bold text-white text-center">
                {mode === 'login' ? 'Welcome Back!' : 'Create Account'}
              </h1>
              <p className="text-sm text-white/70 text-center mt-1 mb-6">
                {mode === 'login'
                  ? 'Sign in to your City Work account'
                  : 'Sign up to get started with City Work'}
              </p>

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-xs font-semibold text-white/80 mb-1.5">
                    Email
                  </label>
                  <input
                    ref={emailRef}
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full px-4 py-3.5 rounded-2xl bg-white/10 border-2 border-white/15 text-white placeholder:text-white/35 outline-none focus:border-copper focus:bg-white/15 focus:ring-4 focus:ring-copper/20 transition"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="block text-xs font-semibold text-white/80 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                      className="w-full px-4 pr-14 py-3.5 rounded-2xl bg-white/10 border-2 border-white/15 text-white placeholder:text-white/35 outline-none focus:border-copper focus:bg-white/15 focus:ring-4 focus:ring-copper/20 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 p-2"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? '🙈' : '👁'}
                    </button>
                  </div>
                </div>

                {mode === 'login' && (
                  <div className="flex items-center justify-between mb-4">
                    <label className="flex items-center gap-2 text-xs text-white/70 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={remember}
                        onChange={e => setRemember(e.target.checked)}
                        className="w-4 h-4 accent-copper"
                      />
                      Remember me
                    </label>
                    <button
                      type="button"
                      onClick={handleForgot}
                      disabled={loading}
                      className="text-sm font-semibold text-amber-200 hover:text-white disabled:opacity-50"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-copper hover:bg-copperhover text-white font-bold text-base shadow-lg shadow-copper/30 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed transition"
                >
                  {loading
                    ? mode === 'signup' ? 'Creating…' : 'Logging in…'
                    : mode === 'signup' ? 'Sign Up' : 'Login'}
                </button>

                {error && (
                  <div
                    key={errorKey}
                    className={`mt-3 text-sm text-center px-3 py-2.5 rounded-xl animate-shake ${
                      error.toLowerCase().includes('sent') || error.toLowerCase().includes('created')
                        ? 'text-green-300 bg-green-400/10 border border-green-400/20'
                        : 'text-red-300 bg-red-400/10 border border-red-400/20'
                    }`}
                  >
                    {error}
                  </div>
                )}
              </form>

              <div className="text-center text-sm text-white/70 mt-5">
                {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
                <button
                  type="button"
                  onClick={() => { setMode(m => m === 'login' ? 'signup' : 'login'); setError('') }}
                  className="font-bold text-amber-200 hover:text-white transition"
                >
                  {mode === 'login' ? 'Create one' : 'Sign in'}
                </button>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-xs text-white/40 mt-4">
          <span className="font-bold">City</span>
          <span className="font-bold text-copper">Work</span>
        </p>
      </div>
    </main>
  )
}