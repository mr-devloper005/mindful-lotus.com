'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, X } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { SITE_CONFIG } from '@/lib/site-config'
import { siteContent } from '@/config/site.content'
import { cn } from '@/lib/utils'

export const NAVBAR_OVERRIDE_ENABLED = true

/**
 * Editorial masthead for Mindful Lotus.
 *
 * The brief is deliberately quiet: wordmark + thin rule + a handful of
 * named links. No gradient pill buttons, no "Add Listing" CTA, no task
 * bar — those patterns belong to the directory sibling sites.
 */
export function NavbarOverride() {
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const enabledArticleTask = useMemo(
    () => SITE_CONFIG.tasks.find((task) => task.enabled && task.key === 'article'),
    []
  )

  const issue = useMemo(() => {
    const now = new Date()
    const season = ['Winter', 'Spring', 'Summer', 'Autumn'][Math.floor(((now.getMonth() + 1) % 12) / 3)]
    return `${season} ${now.getFullYear()} · Vol. ${(now.getFullYear() - 2020).toString().padStart(2, '0')}`
  }, [])

  const navItems = [
    { label: 'Essays', href: enabledArticleTask?.route || '/articles' },
    { label: 'About', href: '/about' },
    { label: 'Archive', href: '/articles?view=archive' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full backdrop-blur transition-colors duration-500',
        scrolled
          ? 'bg-[color:var(--ml-paper-warm)]/92 shadow-[0_1px_0_var(--ml-rule)]'
          : 'bg-[color:var(--ml-paper-warm)]/70'
      )}
    >
      {/* Editorial top strip: issue info + small actions. */}
      <div className="border-b border-[color:var(--ml-rule)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-[color:var(--ml-sage-deep)] sm:px-6 lg:px-8">
          <span className="hidden sm:inline">{issue}</span>
          <span className="sm:hidden">Mindful Lotus</span>
          <div className="flex items-center gap-5">
            <Link href="/articles" className="ml-link hidden sm:inline-block">
              {siteContent.navbar.tagline}
            </Link>
            <Link href="/search" className="inline-flex items-center gap-1">
              <Search className="h-3 w-3" aria-hidden="true" />
              <span className="hidden sm:inline">Search</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Wordmark masthead. */}
      <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-6">
          <Link href="/" className="group inline-flex flex-col">
            <span
              className="ml-serif-display text-4xl sm:text-5xl lg:text-[3.4rem]"
              style={{ fontWeight: 500, letterSpacing: '-0.01em' }}
            >
              {SITE_CONFIG.name}
            </span>
            <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.42em] text-[color:var(--ml-sage-deep)]">
              — A contemplative reading room —
            </span>
          </Link>

          <div className="hidden items-center gap-3 md:flex">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="ml-eyebrow">Signed in as {user?.name?.split(' ')[0] || 'reader'}</span>
                <button
                  type="button"
                  onClick={logout}
                  className="ml-btn-ghost"
                  aria-label="Sign out"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="ml-btn-ghost">
                  Sign in
                </Link>
                <Link href="/register" className="ml-btn-solid">
                  Join the reading list
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--ml-rule-strong)] text-[color:var(--ml-ink)] md:hidden"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Inline nav — Roman-numeral editorial bar. */}
        <nav className="mt-6 hidden items-center gap-6 border-t border-[color:var(--ml-rule)] pt-3 text-sm md:flex">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  'ml-link inline-flex items-baseline gap-2 text-[13px] font-semibold uppercase tracking-[0.28em]',
                  isActive ? 'text-[color:var(--ml-ink)]' : 'text-[color:var(--ml-ink-soft)]/80'
                )}
              >
                <span className="ml-counter text-[11px]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Mobile sheet. */}
      {isMenuOpen && (
        <div className="border-t border-[color:var(--ml-rule)] bg-[color:var(--ml-paper-warm)] md:hidden">
          <div className="mx-auto max-w-6xl space-y-1 px-4 py-4 sm:px-6">
            {navItems.map((item, index) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-between border-b border-[color:var(--ml-rule)] py-3 text-sm font-semibold uppercase tracking-[0.28em] text-[color:var(--ml-ink)]"
              >
                <span className="inline-flex items-center gap-3">
                  <span className="ml-counter text-xs">{String(index + 1).padStart(2, '0')}</span>
                  {item.label}
                </span>
                <span aria-hidden>→</span>
              </Link>
            ))}

            <div className="pt-4">
              {isAuthenticated ? (
                <button type="button" onClick={logout} className="ml-btn-ghost w-full">
                  Sign out
                </button>
              ) : (
                <div className="grid gap-2">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)} className="ml-btn-ghost w-full">
                    Sign in
                  </Link>
                  <Link href="/register" onClick={() => setIsMenuOpen(false)} className="ml-btn-solid w-full">
                    Join the reading list
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
