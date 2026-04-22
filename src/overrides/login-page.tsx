'use client'

import { Suspense, useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowRight, BookOpen, Feather, Loader2, Lock, Mail, CheckCircle2 } from 'lucide-react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { useAuth } from '@/lib/auth-context'
import { SITE_CONFIG } from '@/lib/site-config'

export const LOGIN_PAGE_OVERRIDE_ENABLED = true

/**
 * Editorial sign-in page.
 * The form is wired to the existing `useAuth` context — successful
 * credentials persist to localStorage via the untouched auth logic.
 */
export function LoginPageOverride() {
  return (
    <Suspense fallback={<LoginShellFallback />}>
      <LoginInner />
    </Suspense>
  )
}

function LoginShellFallback() {
  return (
    <div className="min-h-screen text-[color:var(--ml-ink)]">
      <NavbarShell />
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="ml-eyebrow">Opening the reading room…</div>
      </div>
      <Footer />
    </div>
  )
}

function LoginInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextUrl = searchParams.get('next') || '/articles'
  const { login, isAuthenticated, user, isLoading } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthenticated) {
      const timeout = setTimeout(() => router.replace(nextUrl), 600)
      return () => clearTimeout(timeout)
    }
  }, [isAuthenticated, nextUrl, router])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    const trimmedEmail = email.trim()
    if (!trimmedEmail || !password) {
      setError('Please enter both an email and a password to sign in.')
      return
    }
    if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      setError('That email address does not look quite right.')
      return
    }

    try {
      await login(trimmedEmail, password)
      setSuccess('Signed in — redirecting you to the reading room.')
    } catch (err) {
      console.warn('[mindful-lotus/login] failed', err)
      setError('We could not sign you in just now. Please try again in a moment.')
    }
  }

  return (
    <div className="min-h-screen text-[color:var(--ml-ink)]">
      <NavbarShell />
      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Editorial aside */}
          <aside className="lg:col-span-5">
            <p className="ml-eyebrow">Subscribers’ entrance</p>
            <h1 className="ml-serif-display mt-3 text-4xl leading-tight sm:text-5xl">
              Welcome back to the reading room.
            </h1>
            <p className="mt-5 text-[15px] leading-8 text-[color:var(--ml-ink-soft)]/90">
              Sign in to bookmark essays, continue where you left off, and receive the Sunday
              letter directly. Your session is kept locally — we never stash it on a server.
            </p>

            <ul className="mt-10 space-y-5 border-t border-[color:var(--ml-rule-strong)] pt-8">
              {[
                ['01', 'Bookmark essays to finish another afternoon.'],
                ['02', 'Continue reading from exactly where you paused.'],
                ['03', 'Receive the Sunday letter without the noise.'],
              ].map(([num, text]) => (
                <li key={num} className="grid grid-cols-[48px_1fr] items-baseline gap-4">
                  <span className="ml-counter text-xl">{num}</span>
                  <span className="text-[15px] leading-7 text-[color:var(--ml-ink-soft)]/90">{text}</span>
                </li>
              ))}
            </ul>

            <div className="mt-12 flex items-center gap-3 text-sm italic text-[color:var(--ml-sage-deep)]">
              <Feather className="h-4 w-4" aria-hidden="true" />
              <span>“Read slowly. Underline often. Come back tomorrow.”</span>
            </div>
          </aside>

          {/* Form card */}
          <section className="lg:col-span-7">
            <div className="ml-card p-8 sm:p-12">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="ml-eyebrow">Sign in to {SITE_CONFIG.name}</p>
                  <h2 className="ml-serif-display mt-2 text-3xl">
                    One line, one signature, you’re in.
                  </h2>
                </div>
                <BookOpen className="h-8 w-8 shrink-0 text-[color:var(--ml-brass)]" aria-hidden="true" />
              </div>

              <form className="mt-8 space-y-7" onSubmit={handleSubmit} noValidate>
                <label className="block">
                  <span className="ml-eyebrow flex items-center gap-2">
                    <Mail className="h-3 w-3" aria-hidden="true" /> Email address
                  </span>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    className="ml-input mt-3"
                    placeholder="you@quiet-corner.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </label>

                <label className="block">
                  <span className="ml-eyebrow flex items-center gap-2">
                    <Lock className="h-3 w-3" aria-hidden="true" /> Passphrase
                  </span>
                  <input
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    className="ml-input mt-3"
                    placeholder="A small, memorable phrase"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </label>

                <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                  <label className="inline-flex items-center gap-2 text-[color:var(--ml-ink-soft)]/90">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(event) => setRemember(event.target.checked)}
                      className="h-4 w-4 border border-[color:var(--ml-rule-strong)] bg-transparent accent-[color:var(--ml-sage-deep)]"
                    />
                    Remember this device
                  </label>
                  <Link href="/forgot-password" className="ml-link text-[color:var(--ml-sage-deep)]">
                    Lost your passphrase?
                  </Link>
                </div>

                {error ? (
                  <div
                    role="alert"
                    className="rounded-md border border-[color:var(--ml-rust)]/30 bg-[color:var(--ml-rust)]/10 px-4 py-3 text-sm text-[color:var(--ml-rust)]"
                  >
                    {error}
                  </div>
                ) : null}

                {success ? (
                  <div
                    role="status"
                    className="inline-flex items-center gap-2 rounded-md border border-[color:var(--ml-sage-deep)]/30 bg-[color:var(--ml-sage-deep)]/10 px-4 py-3 text-sm text-[color:var(--ml-sage-deep)]"
                  >
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    {success}
                  </div>
                ) : null}

                <button type="submit" className="ml-btn-solid w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      Signing you in…
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </>
                  )}
                </button>

                <p className="text-center text-sm text-[color:var(--ml-ink-soft)]/85">
                  New to the publication?{' '}
                  <Link href="/register" className="ml-link font-semibold">
                    Join the reading list
                  </Link>
                </p>
              </form>

              {isAuthenticated && user ? (
                <div className="mt-8 border-t border-[color:var(--ml-rule)] pt-6 text-sm text-[color:var(--ml-sage-deep)]">
                  Already signed in as <span className="font-semibold">{user.name}</span>.
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
