import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/site-config'
import { siteContent } from '@/config/site.content'

export const FOOTER_OVERRIDE_ENABLED = true

const readingLinks = [
  { label: 'Current issue', href: '/articles' },
  { label: 'Seasonal archive', href: '/articles?view=archive' },
  { label: 'Letters to the editor', href: '/community' },
]

const publicationLinks = [
  { label: 'About the publication', href: '/about' },
  { label: 'Editors & contributors', href: '/team' },
  { label: 'Write to the desk', href: '/contact' },
  { label: 'Contact', href: '/contact' },
  { label: 'Press', href: '/press' },
]

const fineprintLinks = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Cookies', href: '/cookies' },
  { label: 'Colophon', href: '/licenses' },
]

export function FooterOverride() {
  return (
    <footer className="mt-24 border-t border-[color:var(--ml-rule-strong)] bg-[color:var(--ml-paper-warm)] text-[color:var(--ml-ink)]">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
          {/* Colophon */}
          <div>
            <p className="ml-eyebrow">The colophon</p>
            <h3 className="ml-serif-display mt-4 text-4xl">{SITE_CONFIG.name}</h3>
            <p className="mt-2 text-sm italic text-[color:var(--ml-sage-deep)]">
              {siteContent.footer.tagline}
            </p>
            <p className="mt-6 max-w-sm text-sm leading-7 text-[color:var(--ml-ink-soft)]/90">
              A small, independent publication set in Fraunces &amp; Manrope, edited for cadence over
              engagement. Printed here in cream and ink for anyone who still underlines paragraphs.
            </p>

            <form
              action="/register"
              className="mt-8 flex items-center gap-0 border-b border-[color:var(--ml-rule-strong)] pb-2"
            >
              <input
                type="email"
                name="email"
                placeholder="you@your-quiet-corner.com"
                className="ml-input border-0 !pb-1"
                aria-label="Email address"
              />
              <button
                type="submit"
                className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.32em] text-[color:var(--ml-brass)] transition-colors hover:text-[color:var(--ml-ink)]"
              >
                Subscribe →
              </button>
            </form>
            <p className="mt-2 text-[11px] text-[color:var(--ml-ink-soft)]/70">
              One essay each Sunday. Nothing else.
            </p>
          </div>

          {/* Reading */}
          <div>
            <p className="ml-eyebrow">Reading</p>
            <ul className="mt-5 space-y-3 text-sm">
              {readingLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="ml-link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Publication */}
          <div>
            <p className="ml-eyebrow">Publication</p>
            <ul className="mt-5 space-y-3 text-sm">
              {publicationLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="ml-link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Fineprint */}
          <div>
            <p className="ml-eyebrow">Fine print</p>
            <ul className="mt-5 space-y-3 text-sm">
              {fineprintLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="ml-link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="ml-rule my-10" />

        <div className="flex flex-col items-start justify-between gap-3 text-[11px] uppercase tracking-[0.32em] text-[color:var(--ml-ink-soft)]/70 sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} {SITE_CONFIG.name}. Printed in cream and ink.</span>
          <span>Hand-set in Fraunces &amp; Manrope · Made for slow afternoons.</span>
        </div>
      </div>
    </footer>
  )
}
