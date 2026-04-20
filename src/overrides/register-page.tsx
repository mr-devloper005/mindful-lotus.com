'use client'

import { Suspense, useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowRight, CheckCircle2, Feather, Loader2, Mail, PenLine, User } from 'lucide-react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { useAuth } from '@/lib/auth-context'
import { SITE_CONFIG } from '@/lib/site-config'

export const REGISTER_PAGE_OVERRIDE_ENABLED = true

export function RegisterPageOverride() {
  return (
    <Suspense fallback={<RegisterShellFallback />}>
      <RegisterInner />
    </Suspense>
  )
}

function RegisterShellFallback() {
  return (
    <div className="min-h-screen text-[color:var(--ml-ink)]">
      <NavbarShell />
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="ml-eyebrow">Preparing the subscriber list…</div>
      </div>
      <Footer />
    </div>
  )
}

function RegisterInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextUrl = searchParams.get('next') || '/articles'
  const { signup, isAuthenticated, isLoading } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [intent, setIntent] = useState('Reader')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    const presetEmail = searchParams.get('email')
    if (presetEmail) setEmail(presetEmail)
  }, [searchParams])

  useEffect(() => {
    if (isAuthenticated) {
      const timeout = setTimeout(() => router.replace(nextUrl), 700)
      return () => clearTimeout(timeout)
    }
  }, [isAuthenticated, nextUrl, router])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    const trimmedName = name.trim()
    const trimmedEmail = email.trim()

    if (!trimmedName) {
      setError('Please tell us what to call you on the subscriber list.')
      return
    }
    if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      setError('That email address does not look quite right.')
      return
    }
    if (password.length < 6) {
      setError('Please choose a passphrase of at least six characters.')
      return
    }

    try {
      await signup(trimmedName, trimmedEmail, password)
      setSuccess('Welcome to Mindful Lotus — opening the reading room.')
    } catch (err) {
      console.warn('[mindful-lotus/register] failed', err)
      setError('We could not create your account just now. Please try again in a moment.')
    }
  }

  return (
    <div className="min-h-screen text-[color:var(--ml-ink)]">
      <NavbarShell />
      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Editorial aside */}
          <aside className="lg:col-span-5">
            <p className="ml-eyebrow">Join the reading list</p>
            <h1 className="ml-serif-display mt-3 text-4xl leading-tight sm:text-5xl">
              One letter a week. Nothing in between.
            </h1>
            <p className="mt-5 text-[15px] leading-8 text-[color:var(--ml-ink-soft)]/90">
              Mindful Lotus sends a single email on Sunday with the week’s cover essay. We do not
              run trackers in our letters, and you can unsubscribe with a single click at any time.
            </p>

            <figure className="mt-10 border-l-2 border-[color:var(--ml-brass)] pl-5">
              <blockquote className="ml-serif-display text-xl italic leading-relaxed text-[color:var(--ml-ink)]">
                “I subscribe to a lot of newsletters. This is the only one I actually open on
                Sundays, with tea, like a small ceremony.”
              </blockquote>
              <figcaption className="mt-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-[color:var(--ml-sage-deep)]">
                — A longtime reader
              </figcaption>
            </figure>

            <div className="mt-10 flex items-center gap-3 text-sm italic text-[color:var(--ml-sage-deep)]">
              <Feather className="h-4 w-4" aria-hidden="true" />
              <span>Printed in cream and ink · {SITE_CONFIG.domain}</span>
            </div>
          </aside>

          {/* Form */}
          <section className="lg:col-span-7">
            <div className="ml-card p-8 sm:p-12">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="ml-eyebrow">Open a reader account</p>
                  <h2 className="ml-serif-display mt-2 text-3xl">
                    A gentle sign-up, three lines long.
                  </h2>
                </div>
                <PenLine className="h-8 w-8 shrink-0 text-[color:var(--ml-brass)]" aria-hidden="true" />
              </div>

              <form className="mt-8 space-y-7" onSubmit={handleSubmit} noValidate>
                <label className="block">
                  <span className="ml-eyebrow flex items-center gap-2">
                    <User className="h-3 w-3" aria-hidden="true" /> Reader’s name
                  </span>
                  <input
                    type="text"
                    name="name"
                    autoComplete="name"
                    className="ml-input mt-3"
                    placeholder="How we should address you on the letter"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                  />
                </label>

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
                  <span className="ml-eyebrow">A passphrase</span>
                  <input
                    type="password"
                    name="password"
                    autoComplete="new-password"
                    className="ml-input mt-3"
                    placeholder="At least six gentle characters"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </label>

                <fieldset>
                  <legend className="ml-eyebrow">I would most like to</legend>
                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {['Reader', 'Contributor', 'Both'].map((option) => (
                      <label
                        key={option}
                        className={`flex cursor-pointer items-center justify-center rounded-full border px-4 py-2.5 text-sm font-semibold uppercase tracking-[0.22em] transition-colors ${
                          intent === option
                            ? 'border-[color:var(--ml-ink)] bg-[color:var(--ml-ink)] text-[color:var(--ml-paper)]'
                            : 'border-[color:var(--ml-rule-strong)] text-[color:var(--ml-ink-soft)]/80 hover:bg-[color:var(--ml-paper-mist)]/60'
                        }`}
                      >
                        <input
                          type="radio"
                          name="intent"
                          value={option}
                          checked={intent === option}
                          onChange={() => setIntent(option)}
                          className="sr-only"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </fieldset>

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
                      Opening your reading room…
                    </>
                  ) : (
                    <>
                      Create my reader account
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </>
                  )}
                </button>

                <p className="text-center text-sm text-[color:var(--ml-ink-soft)]/85">
                  Already a reader?{' '}
                  <Link href="/login" className="ml-link font-semibold">
                    Sign in instead
                  </Link>
                </p>
              </form>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
