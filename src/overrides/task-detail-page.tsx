import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Clock3, Feather } from 'lucide-react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { ContentImage } from '@/components/shared/content-image'
import { TaskPostCard } from '@/components/shared/task-post-card'
import { SchemaJsonLd } from '@/components/seo/schema-jsonld'
import { RichContent, formatRichHtml } from '@/components/shared/rich-content'
import { ArticleComments } from '@/components/tasks/article-comments'
import { buildPostUrl, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { SITE_CONFIG, getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'

export const TASK_DETAIL_PAGE_OVERRIDE_ENABLED = true

type PostContent = {
  category?: string
  description?: string
  body?: string
  excerpt?: string
  author?: string
  images?: string[]
  logo?: string
}

const getContent = (post: SitePost): PostContent => {
  const content = post.content && typeof post.content === 'object' ? post.content : {}
  return content as PostContent
}

const isValidImageUrl = (value?: string | null) =>
  typeof value === 'string' && (value.startsWith('/') || /^https?:\/\//i.test(value))

const getImages = (post: SitePost): string[] => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media : []
  const mediaUrls = media
    .map((item) => item?.url)
    .filter((url): url is string => isValidImageUrl(url))
  const contentImages = Array.isArray(content.images)
    ? content.images.filter((url): url is string => isValidImageUrl(url))
    : []
  const merged = [...mediaUrls, ...contentImages]
  if (merged.length) return merged
  if (isValidImageUrl(content.logo)) return [content.logo as string]
  return []
}

const absoluteUrl = (value?: string | null) => {
  if (!value) return null
  if (/^https?:\/\//i.test(value)) return value
  if (!value.startsWith('/')) return null
  return `${SITE_CONFIG.baseUrl.replace(/\/$/, '')}${value}`
}

const formatDate = (iso?: string | null) => {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

const readingMinutes = (html: string) => {
  const words = html.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length
  return Math.max(4, Math.round(words / 220))
}

/**
 * Mindful Lotus detail page.
 *
 * Articles get the full dark editorial treatment (the flagship experience,
 * matching the reference). Every other task route still renders, but in a
 * calmer cream layout so the system stays URL-complete without pretending
 * those content types belong to this publication.
 */
export async function TaskDetailPageOverride({
  task,
  slug,
}: {
  task: TaskKey
  slug: string
}) {
  const taskConfig = getTaskConfig(task)
  let post: SitePost | null = null
  try {
    post = await fetchTaskPostBySlug(task, slug)
  } catch (error) {
    console.warn('Failed to load post detail', error)
  }

  if (!post) {
    notFound()
  }

  const content = getContent(post)
  const category = content.category || post.tags?.[0] || taskConfig?.label || task
  const description = content.description || post.summary || 'A quiet piece still being set.'
  const isArticle = task === 'article'
  const articleHtml = isArticle
    ? formatRichHtml(
        (typeof content.body === 'string' && content.body.trim()) ||
          (typeof content.description === 'string' && content.description.trim()) ||
          post.summary ||
          '',
        'This essay is still being set.'
      )
    : ''
  const descriptionHtml = !isArticle ? formatRichHtml(description, 'Details coming soon.') : ''
  const minutes = isArticle ? readingMinutes(articleHtml) : 0
  const author =
    (typeof content.author === 'string' && content.author.trim()) ||
    post.authorName ||
    'The Editors'
  const date = formatDate(post.publishedAt)
  const images = getImages(post)
  const related = (await fetchTaskPosts(task, 6))
    .filter((item) => item.slug !== post!.slug)
    .slice(0, 3)

  const articleUrl = `${SITE_CONFIG.baseUrl.replace(/\/$/, '')}${taskConfig?.route || '/articles'}/${post.slug}`
  const articleImage = absoluteUrl(images[0]) || absoluteUrl(SITE_CONFIG.defaultOgImage)

  const articleSchema = isArticle
    ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.summary || description,
        image: articleImage ? [articleImage] : [],
        author: { '@type': 'Person', name: author },
        datePublished: post.publishedAt || undefined,
        dateModified: post.publishedAt || undefined,
        articleSection: category,
        keywords: (Array.isArray(post.tags) ? post.tags.filter((t) => typeof t === 'string') : []).join(', '),
        mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl },
      }
    : null

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.baseUrl.replace(/\/$/, '') },
      {
        '@type': 'ListItem',
        position: 2,
        name: taskConfig?.label || 'Essays',
        item: `${SITE_CONFIG.baseUrl.replace(/\/$/, '')}${taskConfig?.route || '/'}`,
      },
      { '@type': 'ListItem', position: 3, name: post.title, item: articleUrl },
    ],
  }

  const schemaPayload = articleSchema ? [articleSchema, breadcrumbSchema] : breadcrumbSchema

  // ── Non-article task pages: calm cream notice + content, URL stays live.
  if (!isArticle) {
    return (
      <div className="min-h-screen text-[color:var(--ml-ink)]">
        <NavbarShell />
        <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <SchemaJsonLd data={breadcrumbSchema} />
          <Link
            href={taskConfig?.route || '/'}
            className="ml-link inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-[color:var(--ml-sage-deep)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to {taskConfig?.label || 'archive'}
          </Link>

          <div className="ml-rule-strong my-8" />

          <span className="ml-chip">{category}</span>
          <h1 className="ml-serif-display mt-4 text-4xl leading-tight sm:text-5xl">{post.title}</h1>
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.32em] text-[color:var(--ml-sage-deep)]">
            Archived surface · kept reachable by URL
          </p>

          {images[0] ? (
            <div className="relative mt-10 aspect-[16/9] overflow-hidden bg-[color:var(--ml-paper-mist)]">
              <ContentImage
                src={images[0]}
                alt={post.title}
                fill
                className="object-cover"
                intrinsicWidth={1600}
                intrinsicHeight={900}
              />
            </div>
          ) : null}

          <RichContent html={descriptionHtml} className="mt-10 max-w-3xl" />

          <div className="ml-card mt-14 p-8">
            <p className="ml-eyebrow">Where the publication lives</p>
            <h2 className="ml-serif-display mt-3 text-2xl">
              The Mindful Lotus reading experience is in the essays.
            </h2>
            <p className="mt-3 text-sm leading-7 text-[color:var(--ml-ink-soft)]/85">
              This page remains here for anyone arriving by direct URL. When you have a moment, the
              archive is a better place to spend one.
            </p>
            <Link href="/articles" className="ml-btn-solid mt-6">
              Open the archive
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // ── Article detail: dark editorial magazine layout.
  return (
    <div className="min-h-screen bg-[color:var(--ml-ink)] text-[color:var(--ml-paper)]">
      <NavbarShell />
      <SchemaJsonLd data={schemaPayload} />

      <article className="relative">
        {/* Dramatic editorial header */}
        <header className="border-b border-white/10">
          <div className="mx-auto max-w-4xl px-4 pb-14 pt-14 sm:px-6 lg:px-8 lg:pb-20 lg:pt-20">
            <Link
              href={taskConfig?.route || '/articles'}
              className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-[color:var(--ml-brass-soft)] transition-colors hover:text-[color:var(--ml-paper)]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to the archive
            </Link>

            <div className="mt-10 flex flex-wrap items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.34em] text-[color:var(--ml-brass-soft)]">
              <span>{category}</span>
              <span className="text-white/30">·</span>
              <span>{date || 'Recently published'}</span>
              {minutes ? (
                <>
                  <span className="text-white/30">·</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock3 className="h-3 w-3" aria-hidden="true" />
                    {minutes} min read
                  </span>
                </>
              ) : null}
            </div>

            <h1
              className="mt-6 text-[clamp(2.4rem,5.2vw,4.6rem)] leading-[1.02] text-[color:var(--ml-paper)]"
              style={{
                fontFamily: 'var(--font-display), Georgia, serif',
                fontWeight: 500,
                letterSpacing: '-0.015em',
              }}
            >
              {post.title}
            </h1>

            {post.summary ? (
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[color:var(--ml-paper)]/82 sm:text-xl">
                {post.summary}
              </p>
            ) : null}

            <div className="mt-10 flex items-center gap-3 text-sm text-[color:var(--ml-paper)]/80">
              <Feather className="h-4 w-4 text-[color:var(--ml-brass-soft)]" aria-hidden="true" />
              <span>
                By <span className="font-semibold text-[color:var(--ml-paper)]">{author}</span>
              </span>
            </div>
          </div>

          {images[0] ? (
            <div className="mx-auto max-w-6xl px-4 pb-6 sm:px-6 lg:px-8">
              <div className="relative aspect-[16/9] overflow-hidden bg-[color:var(--ml-ink-soft)]">
                <ContentImage
                  src={images[0]}
                  alt={`${post.title} — hero image`}
                  fill
                  className="object-cover"
                  intrinsicWidth={1800}
                  intrinsicHeight={1000}
                  priority
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(28,36,31,0) 55%, rgba(28,36,31,0.7) 100%)',
                  }}
                  aria-hidden="true"
                />
              </div>
            </div>
          ) : null}
        </header>

        {/* Body: editorial two-column on wide screens (margin notes + prose) */}
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-16 lg:grid-cols-12">
            <aside className="order-2 lg:order-1 lg:col-span-3">
              <div className="sticky top-28 space-y-10 border-t border-white/10 pt-8 text-sm text-[color:var(--ml-paper)]/80 lg:border-0 lg:pt-0">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[color:var(--ml-brass-soft)]">
                    Filed under
                  </p>
                  <p className="ml-serif-display mt-2 text-xl text-[color:var(--ml-paper)]">
                    {category}
                  </p>
                </div>
                {date ? (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[color:var(--ml-brass-soft)]">
                      Published
                    </p>
                    <p className="mt-2 text-[color:var(--ml-paper)]">{date}</p>
                  </div>
                ) : null}
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[color:var(--ml-brass-soft)]">
                    A gentle ask
                  </p>
                  <p className="mt-2 leading-6 text-[color:var(--ml-paper)]/80">
                    Read without a second tab open. The essay is short enough for it.
                  </p>
                </div>
              </div>
            </aside>

            <div className="order-1 lg:order-2 lg:col-span-9">
              <RichContent
                html={articleHtml}
                className="max-w-2xl text-[17px] leading-[1.85] text-[color:var(--ml-paper)]/92
                  [&_h2]:!text-[color:var(--ml-paper)] [&_h2]:!mt-14 [&_h2]:!mb-4 [&_h2]:!text-3xl [&_h2]:!leading-snug
                  [&_h3]:!text-[color:var(--ml-paper)] [&_h3]:!mt-10 [&_h3]:!mb-3 [&_h3]:!text-2xl
                  [&_p]:!my-6 [&_p]:!text-[color:var(--ml-paper)]/92
                  [&_a]:!text-[color:var(--ml-brass-soft)] [&_a:hover]:!text-[color:var(--ml-paper)]
                  [&_strong]:!text-[color:var(--ml-paper)]
                  [&_blockquote]:!border-[color:var(--ml-brass)] [&_blockquote]:!text-[color:var(--ml-paper)] [&_blockquote]:!italic
                  [&_ul]:!my-6 [&_li]:!my-1"
              />

              <div className="mt-16 border-t border-white/10 pt-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[color:var(--ml-brass-soft)]">
                  End of the essay
                </p>
                <p className="ml-serif-display mt-3 text-2xl leading-snug">
                  Thank you for reading — slowly, we hope.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 rounded-full bg-[color:var(--ml-paper)] px-5 py-2.5 text-sm font-semibold text-[color:var(--ml-ink)] transition-transform hover:-translate-y-0.5"
                  >
                    Join the Sunday letter
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/articles"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-[color:var(--ml-paper)] transition-colors hover:bg-white/5"
                  >
                    Another essay
                  </Link>
                </div>
              </div>

              {/* Comments surface (untouched logic) */}
              <div className="mt-16 rounded-md bg-[color:var(--ml-paper)]/[0.04] p-6 sm:p-8 [&_*]:!text-[color:var(--ml-paper)]/90">
                <ArticleComments slug={post.slug} />
              </div>
            </div>
          </div>
        </div>

        {/* Related essays, dark card strip */}
        {related.length ? (
          <section className="border-t border-white/10 bg-[color:var(--ml-ink-soft)]/60">
            <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between border-b border-white/10 pb-5">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[color:var(--ml-brass-soft)]">
                    Continue in {category}
                  </p>
                  <h2 className="ml-serif-display mt-2 text-3xl text-[color:var(--ml-paper)] sm:text-4xl">
                    Three more essays on the subject
                  </h2>
                </div>
                <Link
                  href={taskConfig?.route || '/articles'}
                  className="hidden text-[11px] font-semibold uppercase tracking-[0.3em] text-[color:var(--ml-brass-soft)] hover:text-[color:var(--ml-paper)] sm:inline"
                >
                  All essays →
                </Link>
              </div>
              <div className="ml-related-grid mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item) => (
                  <TaskPostCard
                    key={item.id}
                    post={item}
                    href={buildPostUrl(task, item.slug)}
                    taskKey={task}
                  />
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </article>

      <Footer />
    </div>
  )
}
