'use client'

import { useState, useEffect, useRef, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [emailValid, setEmailValid] = useState<null | boolean>(null)
  const [pwValid, setPwValid] = useState<null | boolean>(null)
  const [error, setError] = useState('')
  const [errorOk, setErrorOk] = useState(false)
  const [errorKey, setErrorKey] = useState(0)
  const [checking, setChecking] = useState(true)

  const emailRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user) router.replace('/dashboard')
      else setChecking(false)
    }
    check()
  }, [router, supabase])

  const validateEmail = (v: string) => {
    if (!v) return setEmailValid(null)
    setEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
  }
  const validatePw = (v: string) => {
    if (!v) return setPwValid(null)
    setPwValid(v.length >= 6)
  }

  function openSheet() {
    setOpen(true)
    setTimeout(() => emailRef.current?.focus(), 300)
  }
  function closeSheet() {
    setOpen(false)
    setError('')
  }

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
        setErrorOk(true)
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        setSuccess(true)
        setTimeout(() => router.replace('/dashboard'), 1500)
      }
    } catch (err) {
      let msg = err instanceof Error ? err.message : 'Something went wrong.'
      if (msg.includes('Invalid login credentials')) msg = 'Incorrect email or password.'
      if (msg.includes('Email not confirmed')) msg = 'Please confirm your email first.'
      if (msg.includes('rate limit')) msg = 'Too many attempts. Please wait.'
      setError(msg)
      setErrorOk(false)
      setErrorKey(k => k + 1)
    } finally {
      setLoading(false)
    }
  }

  async function handleForgot() {
    if (!email) {
      setError('Enter your email address first.')
      setErrorOk(false)
      setErrorKey(k => k + 1)
      return
    }
    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) throw error
      setError('Password reset email sent! Check your inbox.')
      setErrorOk(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email.')
      setErrorOk(false)
      setErrorKey(k => k + 1)
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="cw-spinner" />
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-end justify-center">
      {/* Background */}
      <div className="cw-bg" />

      {/* Fonts + icons via CDN */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />

      {/* Trigger bar */}
      <button
        onClick={openSheet}
        className={`cw-trigger ${open ? 'cw-trigger-hidden' : ''}`}
        aria-label="Open login form"
      >
        Log In <span className="arrow">↑</span>
      </button>

      {/* Overlay */}
      <div
        className={`cw-overlay ${open ? 'cw-overlay-active' : ''}`}
        onClick={closeSheet}
      />

      {/* Sheet */}
      <div className={`cw-sheet ${open ? 'cw-sheet-active' : ''}`} role="dialog" aria-modal="true">
        <button className="cw-close" onClick={closeSheet} aria-label="Close">
          ✕
        </button>

        {success ? (
          <div className="cw-success">
            <div className="cw-success-circle" />
            <h2>Welcome to City Work!</h2>
            <p>Redirecting you to your dashboard...</p>
          </div>
        ) : (
          <div className="cw-form-body">
            <h1 className="cw-title">
              {mode === 'login' ? 'Welcome Back!' : 'Create Account'}
            </h1>

            <form onSubmit={handleSubmit} noValidate>
              <div className="cw-input-wrap">
                <label className="cw-label" htmlFor="email">Email</label>
                <input
                  ref={emailRef}
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); validateEmail(e.target.value) }}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={`cw-input ${emailValid === false ? 'cw-input-error' : ''}`}
                />
                <span
                  className={`cw-icon ${emailValid !== null ? 'cw-icon-visible' : ''} ${
                    emailValid ? 'cw-icon-valid' : 'cw-icon-invalid'
                  }`}
                >
                  <i className={`fa-regular ${emailValid ? 'fa-circle-check' : 'fa-circle-xmark'}`} />
                </span>
              </div>

              <div className="cw-input-wrap cw-pw-wrap">
                <label className="cw-label" htmlFor="password">Password</label>
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); validatePw(e.target.value) }}
                  placeholder="••••••••"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  className={`cw-input ${pwValid === false ? 'cw-input-error' : ''}`}
                />
                <span
                  className={`cw-icon ${pwValid !== null ? 'cw-icon-visible' : ''} ${
                    pwValid ? 'cw-icon-valid' : 'cw-icon-invalid'
                  }`}
                >
                  <i className={`fa-regular ${pwValid ? 'fa-circle-check' : 'fa-circle-xmark'}`} />
                </span>
                <button
                  type="button"
                  className="cw-eye"
                  onClick={() => setShowPw(s => !s)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  <i className={`fa-regular ${showPw ? 'fa-eye-slash' : 'fa-eye'}`} />
                </button>
              </div>

              {mode === 'login' && (
                <div className="cw-row">
                  <label className="cw-remember">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={e => setRemember(e.target.checked)}
                    />
                    Remember Me
                  </label>
                  <button type="button" className="cw-link" onClick={handleForgot} disabled={loading}>
                    Forgot Password?
                  </button>
                </div>
              )}

              <button type="submit" className="cw-submit" disabled={loading}>
                {loading ? (
                  <>
                    <span>{mode === 'signup' ? 'Creating...' : 'Logging in...'}</span>
                    <span className="cw-spinner" />
                  </>
                ) : (
                  <>
                    <span>{mode === 'signup' ? 'Sign Up' : 'Login'}</span>
                    <i className="fa-solid fa-arrow-right" />
                  </>
                )}
              </button>

              {error && (
                <div
                  key={errorKey}
                  className={`cw-error ${errorOk ? 'cw-error-ok' : 'cw-error-err'}`}
                >
                  <i className={errorOk ? 'fa-regular fa-circle-check' : 'fa-solid fa-circle-exclamation'} />
                  <span>{error}</span>
                </div>
              )}
            </form>

            <div className="cw-toggle">
              <button type="button" className="cw-toggle-opt cw-toggle-opt-active">
                Email
              </button>
              <button
                type="button"
                className="cw-toggle-opt cw-toggle-opt-disabled"
                onClick={() => {
                  setError('Phone login is not available yet.')
                  setErrorOk(false)
                  setErrorKey(k => k + 1)
                }}
              >
                Phone <span style={{ fontSize: 10, opacity: 0.6 }}>(soon)</span>
              </button>
            </div>

            <div className="cw-footer">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => {
                  setMode(m => (mode === 'login' ? 'signup' : 'login'))
                  setError('')
                }}
              >
                {mode === 'login' ? 'Why?' : 'Sign in'}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}