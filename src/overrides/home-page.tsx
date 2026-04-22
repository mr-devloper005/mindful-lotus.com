import Link from 'next/link'
import { ArrowRight, BookOpen, Feather, Leaf, PenLine } from 'lucide-react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { SchemaJsonLd } from '@/components/seo/schema-jsonld'
import { ContentImage } from '@/components/shared/content-image'
import { fetchTaskPosts } from '@/lib/task-data'
import { SITE_CONFIG } from '@/lib/site-config'
import { siteContent } from '@/config/site.content'
import type { SitePost } from '@/lib/site-connector'

export const HOME_PAGE_OVERRIDE_ENABLED = true

const seasonLabel = () => {
  const now = new Date()
  const season = ['Winter', 'Spring', 'Summer', 'Autumn'][
    Math.floor(((now.getMonth() + 1) % 12) / 3)
  ]
  return `${season} ${now.getFullYear()}`
}

const formatDate = (iso?: string | null) => {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

const getAuthor = (post: SitePost) => {
  const content = (post.content && typeof post.content === 'object' ? post.content : {}) as Record<
    string,
    unknown
  >
  if (typeof content.author === 'string' && content.author.trim()) return content.author.trim()
  if (post.authorName && post.authorName.trim()) return post.authorName.trim()
  return 'The Editors'
}

const getCategory = (post: SitePost) => {
  const content = (post.content && typeof post.content === 'object' ? post.content : {}) as Record<
    string,
    unknown
  >
  if (typeof content.category === 'string' && content.category.trim()) return content.category.trim()
  const tag = Array.isArray(post.tags) ? post.tags.find((value) => typeof value === 'string') : null
  return tag || 'Essay'
}

const getImage = (post: SitePost) => {
  const media = Array.isArray(post.media) ? post.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = (post.content && typeof post.content === 'object' ? post.content : {}) as Record<
    string,
    unknown
  >
  const contentImages = Array.isArray(content.images) ? content.images : []
  const firstContentImage = contentImages.find((item) => typeof item === 'string') as string | undefined
  return mediaUrl || firstContentImage || null
}

const readingMinutes = (post: SitePost) => {
  const content = (post.content && typeof post.content === 'object' ? post.content : {}) as Record<
    string,
    unknown
  >
  const raw =
    typeof content.body === 'string'
      ? content.body
      : typeof content.description === 'string'
        ? content.description
        : typeof post.summary === 'string'
          ? post.summary
          : ''
  const words = raw.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length
  return Math.max(4, Math.round(words / 220))
}

export async function HomePageOverride() {
  const articles = await fetchTaskPosts('article', 12, { allowMockFallback: false, fresh: true })
  const cover = articles[0]
  const secondary = articles.slice(1, 3)
  const rest = articles.slice(3, 9)
  const archiveTail = articles.slice(9, 12)

  const schemaData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.baseUrl,
      logo: `${SITE_CONFIG.baseUrl.replace(/\/$/, '')}${SITE_CONFIG.defaultOgImage}`,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.baseUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_CONFIG.baseUrl.replace(/\/$/, '')}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ]

  return (
    <div className="min-h-screen text-[color:var(--ml-ink)]">
      <NavbarShell />
      <SchemaJsonLd data={schemaData} />

      <main>
        {/* ───── 1. Issue masthead + cover essay ───── */}
        <section className="relative">
          <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 lg:px-8 lg:pt-14">
            <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.36em] text-[color:var(--ml-sage-deep)]">
              <span>Issue · {seasonLabel()}</span>
              <span className="hidden sm:inline">{siteContent.hero.badge}</span>
            </div>
            <div className="ml-rule-strong my-6" />

            <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
              {/* Left: typographic hero */}
              <div className="lg:col-span-7">
                <span className="ml-chip ml-chip-sage">
                  <Leaf className="h-3 w-3" aria-hidden="true" /> Cover essay · {seasonLabel()}
                </span>
                <h1
                  className="ml-serif-display mt-5 text-[clamp(2.4rem,5vw,4.6rem)] leading-[1.02]"
                  style={{ fontWeight: 500 }}
                >
                  {siteContent.hero.title[0]}
                  <br />
                  <span className="italic text-[color:var(--ml-sage-deep)]">
                    {siteContent.hero.title[1]}
                  </span>
                </h1>
                <p className="mt-6 max-w-xl text-base leading-8 text-[color:var(--ml-ink-soft)]/90">
                  {siteContent.hero.description}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link href={siteContent.hero.primaryCta.href} className="ml-btn-solid">
                    {siteContent.hero.primaryCta.label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href={siteContent.hero.secondaryCta.href} className="ml-btn-ghost">
                    {siteContent.hero.secondaryCta.label}
                  </Link>
                </div>

                <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-[color:var(--ml-rule)] pt-8 text-left sm:max-w-xl">
                  {[
                    ['01', 'New essay each Sunday'],
                    ['02', 'Edited for cadence'],
                    ['03', 'Ad-free, unranked archive'],
                  ].map(([num, label]) => (
                    <div key={num}>
                      <dt className="ml-counter text-2xl">{num}</dt>
                      <dd className="mt-2 text-sm leading-6 text-[color:var(--ml-ink-soft)]/85">
                        {label}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Right: cover card (if we have an article) */}
              <div className="lg:col-span-5">
                {cover ? (
                  <Link
                    href={`/articles/${cover.slug}`}
                    className="group block"
                  >
                    <div className="ml-card overflow-hidden">
                      <div className="relative aspect-[4/5] overflow-hidden bg-[color:var(--ml-paper-mist)]">
                        {getImage(cover) ? (
                          <ContentImage
                            src={getImage(cover) || undefined}
                            alt={cover.title}
                            fill
                            className="object-cover transition-transform duration-[900ms] group-hover:scale-[1.03]"
                            sizes="(max-width: 1024px) 90vw, 480px"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <BookOpen className="h-14 w-14 text-[color:var(--ml-brass)]/60" />
                          </div>
                        )}
                        <div className="absolute left-4 top-4">
                          <span className="ml-chip bg-[color:var(--ml-paper-warm)]/95">
                            {getCategory(cover)}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <p className="ml-eyebrow">
                          {formatDate(cover.publishedAt) || 'Cover essay'} · {readingMinutes(cover)} min read
                        </p>
                        <h2 className="ml-serif-display mt-3 text-2xl leading-tight sm:text-3xl">
                          {cover.title}
                        </h2>
                        {cover.summary ? (
                          <p className="mt-3 text-sm leading-7 text-[color:var(--ml-ink-soft)]/85 line-clamp-3">
                            {cover.summary}
                          </p>
                        ) : null}
                        <div className="mt-5 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.3em] text-[color:var(--ml-sage-deep)]">
                          <span>— {getAuthor(cover)}</span>
                          <span className="ml-link inline-flex items-center gap-1 text-[color:var(--ml-ink)]">
                            Read on
                            <ArrowRight className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="ml-card flex h-full flex-col items-start justify-center gap-5 p-10">
                    <BookOpen className="h-10 w-10 text-[color:var(--ml-brass)]" />
                    <h2 className="ml-serif-display text-3xl">The first essay is being set.</h2>
                    <p className="text-sm leading-7 text-[color:var(--ml-ink-soft)]/85">
                      Mindful Lotus is preparing its opening issue. Come back on Sunday for the cover
                      essay, or leave your email in the footer and we will post it to you quietly.
                    </p>
                    <Link href="/register" className="ml-link text-sm font-semibold">
                      Join the reading list →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ───── 2. Table of contents ───── */}
        <section className="mt-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between gap-4 border-b border-[color:var(--ml-rule-strong)] pb-5">
              <div>
                <p className="ml-eyebrow">Section I</p>
                <h2 className="ml-serif-display mt-2 text-3xl sm:text-4xl">
                  Table of contents
                </h2>
              </div>
              <Link href="/articles" className="ml-link text-sm font-semibold uppercase tracking-[0.28em]">
                Open the archive →
              </Link>
            </div>

            {secondary.length > 0 ? (
              <div className="mt-10 grid gap-8 md:grid-cols-2">
                {secondary.map((post, index) => (
                  <Link
                    key={post.id}
                    href={`/articles/${post.slug}`}
                    className="group grid gap-5 md:grid-cols-[72px_1fr] md:items-start"
                  >
                    <div className="ml-counter text-[2.5rem] leading-none md:leading-[0.85] md:mt-1">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <div className="ml-eyebrow">
                        {getCategory(post)} · {readingMinutes(post)} min
                      </div>
                      <h3 className="ml-serif-display mt-2 text-2xl leading-snug transition-colors group-hover:text-[color:var(--ml-sage-deep)]">
                        {post.title}
                      </h3>
                      {post.summary ? (
                        <p className="mt-3 text-sm leading-7 text-[color:var(--ml-ink-soft)]/85 line-clamp-3">
                          {post.summary}
                        </p>
                      ) : null}
                      <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-[color:var(--ml-sage-deep)]">
                        — {getAuthor(post)} · {formatDate(post.publishedAt)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-8 max-w-xl text-sm leading-7 text-[color:var(--ml-ink-soft)]/80">
                The table of contents is being set for this issue. Revisit on Sunday when the cover
                essay and its companion pieces go up together.
              </p>
            )}
          </div>
        </section>

        {/* ───── 3. Editor's letter / about intro ───── */}
        <section className="mt-24">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
            <div className="lg:col-span-5">
              <p className="ml-eyebrow">Section II</p>
              <h2 className="ml-serif-display mt-2 text-3xl sm:text-4xl">
                {siteContent.home.introTitle}
              </h2>
              <div className="mt-6 space-y-5 text-[15px] leading-8 text-[color:var(--ml-ink-soft)]/90">
                {siteContent.home.introParagraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 30)}>{paragraph}</p>
                ))}
              </div>
              <div className="mt-8 flex items-center gap-3">
                <Feather className="h-5 w-5 text-[color:var(--ml-brass)]" aria-hidden="true" />
                <span className="font-['Fraunces',serif] italic text-[color:var(--ml-ink)]">
                  — Ananya &amp; Ishaan, editors
                </span>
              </div>
            </div>

            <aside className="lg:col-span-7">
              <div className="ml-card-ink p-8 sm:p-10">
                <p className="text-[10px] font-semibold uppercase tracking-[0.36em] text-[color:var(--ml-brass-soft)]">
                  {siteContent.home.sideBadge}
                </p>
                <ol className="mt-6 space-y-5">
                  {siteContent.home.sidePoints.map((point, index) => (
                    <li key={point} className="grid grid-cols-[48px_1fr] items-baseline gap-4">
                      <span
                        className="ml-counter text-2xl"
                        style={{ color: 'var(--ml-brass-soft)' }}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <p className="text-[15px] leading-7 text-[color:var(--ml-paper)]/92">{point}</p>
                    </li>
                  ))}
                </ol>
                <div className="mt-8 flex flex-wrap gap-3 border-t border-white/10 pt-6">
                  <Link
                    href={siteContent.home.primaryLink.href}
                    className="inline-flex items-center gap-2 rounded-full bg-[color:var(--ml-paper)] px-5 py-2.5 text-sm font-semibold text-[color:var(--ml-ink)] transition-transform hover:-translate-y-0.5"
                  >
                    {siteContent.home.primaryLink.label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href={siteContent.home.secondaryLink.href}
                    className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-[color:var(--ml-paper)] transition-colors hover:bg-white/5"
                  >
                    {siteContent.home.secondaryLink.label}
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* ───── 4. Archive ribbon ───── */}
        {rest.length > 0 ? (
          <section className="mt-24">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between gap-4 border-b border-[color:var(--ml-rule-strong)] pb-5">
                <div>
                  <p className="ml-eyebrow">Section III</p>
                  <h2 className="ml-serif-display mt-2 text-3xl sm:text-4xl">
                    From the archive
                  </h2>
                </div>
                <Link
                  href="/articles"
                  className="ml-link hidden text-sm font-semibold uppercase tracking-[0.28em] sm:inline-flex"
                >
                  Wander further →
                </Link>
              </div>

              <ul className="mt-8 divide-y divide-[color:var(--ml-rule)]">
                {rest.map((post, index) => (
                  <li key={post.id}>
                    <Link
                      href={`/articles/${post.slug}`}
                      className="group grid items-center gap-4 py-6 transition-colors hover:bg-[color:var(--ml-paper-mist)]/40 sm:grid-cols-[60px_1fr_160px_auto] sm:gap-6 sm:px-3"
                    >
                      <span className="ml-counter text-2xl">
                        {String(index + 3).padStart(2, '0')}
                      </span>
                      <div>
                        <p className="ml-eyebrow">{getCategory(post)}</p>
                        <h3 className="ml-serif-display mt-1 text-xl leading-snug transition-colors group-hover:text-[color:var(--ml-sage-deep)] sm:text-2xl">
                          {post.title}
                        </h3>
                      </div>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[color:var(--ml-sage-deep)]">
                        — {getAuthor(post)}
                      </span>
                      <span className="hidden text-[11px] uppercase tracking-[0.3em] text-[color:var(--ml-ink-soft)]/60 sm:inline">
                        {formatDate(post.publishedAt) || `${readingMinutes(post)} min`}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        {/* ───── 5. Subscribe CTA ───── */}
        <section className="mt-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="ml-card overflow-hidden">
              <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="p-8 sm:p-12 lg:p-16">
                  <p className="ml-eyebrow">Section IV</p>
                  <h2 className="ml-serif-display mt-3 text-3xl sm:text-4xl lg:text-5xl">
                    {siteContent.cta.title}
                  </h2>
                  <p className="mt-5 max-w-lg text-base leading-8 text-[color:var(--ml-ink-soft)]/90">
                    {siteContent.cta.description}
                  </p>
                  <form action="/register" className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-end">
                    <label className="flex-1">
                      <span className="ml-eyebrow">Email address</span>
                      <input
                        type="email"
                        name="email"
                        placeholder="reader@example.com"
                        className="ml-input mt-2"
                      />
                    </label>
                    <button type="submit" className="ml-btn-solid">
                      {siteContent.cta.primaryCta.label}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </form>
                  <p className="mt-3 text-xs text-[color:var(--ml-ink-soft)]/70">
                    You can unsubscribe in a single click from the footer of any letter.
                  </p>
                </div>

                <aside className="relative hidden overflow-hidden lg:block">
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(145deg, rgba(28,36,31,0.96) 0%, rgba(79,106,80,0.95) 100%)',
                    }}
                    aria-hidden="true"
                  />
                  <div className="relative z-10 flex h-full flex-col justify-between p-10 text-[color:var(--ml-paper)]">
                    <PenLine className="h-10 w-10 text-[color:var(--ml-brass-soft)]" aria-hidden="true" />
                    <blockquote className="font-['Fraunces',serif] text-2xl leading-[1.35] italic">
                      “A sentence is a form of attention. Give it ten seconds more than you normally would.”
                    </blockquote>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[color:var(--ml-brass-soft)]">
                      — From an editor’s letter, Vol. 03
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </section>

        {/* ───── 6. Archive tail / quiet exit ───── */}
        {archiveTail.length > 0 ? (
          <section className="mt-24">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <p className="ml-eyebrow">Also in this anthology</p>
              <div className="mt-5 grid gap-6 sm:grid-cols-3">
                {archiveTail.map((post) => (
                  <Link
                    key={post.id}
                    href={`/articles/${post.slug}`}
                    className="group block border-t border-[color:var(--ml-rule-strong)] pt-5"
                  >
                    <p className="ml-eyebrow">{getCategory(post)}</p>
                    <h3 className="ml-serif-display mt-2 text-lg leading-snug transition-colors group-hover:text-[color:var(--ml-sage-deep)]">
                      {post.title}
                    </h3>
                    <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--ml-ink-soft)]/70">
                      — {getAuthor(post)}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <div className="h-24" />
      </main>

      <Footer />
    </div>
  )
}
