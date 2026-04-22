import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { ContentImage } from '@/components/shared/content-image'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'

export const TASK_POST_CARD_OVERRIDE_ENABLED = true

/**
 * Mindful Lotus editorial card — vertical ruled composition, serif
 * headline, small metadata column. Visually distinct from the base
 * rounded/shadowed directory cards of sibling sites.
 */
const stripHtml = (value?: string | null) =>
  (value || '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<\/?[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const excerpt = (value?: string | null, max = 160) => {
  const text = stripHtml(value)
  if (!text) return ''
  return text.length <= max ? text : `${text.slice(0, max).trimEnd()}…`
}

const getContent = (post: SitePost) =>
  (post.content && typeof post.content === 'object' ? post.content : {}) as Record<string, unknown>

const getImage = (post: SitePost) => {
  const media = Array.isArray(post.media) ? post.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  if (mediaUrl) return mediaUrl
  const content = getContent(post)
  const images = Array.isArray(content.images) ? (content.images as unknown[]) : []
  const firstImage = images.find((item) => typeof item === 'string') as string | undefined
  if (firstImage) return firstImage
  const logo = typeof content.logo === 'string' ? content.logo : null
  return logo || null
}

const getCategory = (post: SitePost) => {
  const content = getContent(post)
  if (typeof content.category === 'string' && content.category.trim()) return content.category.trim()
  const tag = Array.isArray(post.tags) ? post.tags.find((v) => typeof v === 'string') : null
  return tag || 'Essay'
}

const getAuthor = (post: SitePost) => {
  const content = getContent(post)
  if (typeof content.author === 'string' && content.author.trim()) return content.author.trim()
  return post.authorName || 'The Editors'
}

const formatDate = (iso?: string | null) => {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const readingMinutes = (post: SitePost) => {
  const content = getContent(post)
  const raw =
    typeof content.body === 'string'
      ? content.body
      : typeof content.description === 'string'
        ? content.description
        : typeof post.summary === 'string'
          ? post.summary
          : ''
  const words = stripHtml(raw).split(/\s+/).filter(Boolean).length
  return Math.max(3, Math.round(words / 220))
}

export function TaskPostCardOverride({
  post,
  href,
  taskKey,
  compact,
}: {
  post: SitePost
  href: string
  taskKey?: TaskKey
  compact?: boolean
}) {
  const image = getImage(post)
  const category = getCategory(post)
  const author = getAuthor(post)
  const date = formatDate(post.publishedAt)
  const minutes = readingMinutes(post)
  const description = excerpt(
    (getContent(post).description as string) || post.summary || '',
    compact ? 110 : 180
  )

  const isArticle = taskKey === 'article' || taskKey === undefined

  // Non-article task surfaces (kept available by URL) get a calm neutral
  // card that still matches the publication palette — they are not
  // visually primary anywhere in the publication chrome.
  if (!isArticle) {
    return (
      <Link
        href={href}
        className="group flex h-full flex-col border border-[color:var(--ml-rule)] bg-[color:var(--ml-paper-warm)]/90 p-5 transition-colors hover:bg-[color:var(--ml-paper-warm)]"
      >
        <span className="ml-eyebrow">{category}</span>
        <h3 className="ml-serif-display mt-3 text-xl leading-snug transition-colors group-hover:text-[color:var(--ml-sage-deep)]">
          {post.title}
        </h3>
        {description ? (
          <p className="mt-3 line-clamp-3 text-sm leading-7 text-[color:var(--ml-ink-soft)]/85">
            {description}
          </p>
        ) : null}
        <span className="mt-auto pt-5 text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--ml-sage-deep)]">
          Archived surface →
        </span>
      </Link>
    )
  }

  return (
    <Link href={href} className="group flex h-full flex-col">
      {image ? (
        <div className="relative overflow-hidden bg-[color:var(--ml-paper-mist)]">
          <div className={`relative ${compact ? 'aspect-[4/3]' : 'aspect-[4/5]'}`}>
            <ContentImage
              src={image}
              alt={`${post.title} — ${category}`}
              fill
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 380px"
              quality={78}
              className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
              intrinsicWidth={900}
              intrinsicHeight={1200}
            />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[color:var(--ml-ink)]/20 to-transparent" />
            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-[color:var(--ml-paper-warm)]/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-[color:var(--ml-ink)] backdrop-blur">
              {category}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex aspect-[4/5] items-center justify-center border border-[color:var(--ml-rule)] bg-[color:var(--ml-paper-warm)]">
          <span className="ml-serif-display text-4xl text-[color:var(--ml-brass)]/60">
            {post.title
              .split(' ')
              .map((word) => word[0])
              .join('')
              .slice(0, 3)
              .toUpperCase()}
          </span>
        </div>
      )}

      <div className="flex flex-1 flex-col pt-5">
        {!image ? <span className="ml-eyebrow">{category}</span> : null}
        <h3 className="ml-serif-display mt-2 text-xl leading-snug transition-colors group-hover:text-[color:var(--ml-sage-deep)] sm:text-[1.4rem]">
          {post.title}
        </h3>
        {description ? (
          <p className="mt-3 line-clamp-3 text-sm leading-7 text-[color:var(--ml-ink-soft)]/85">
            {description}
          </p>
        ) : null}

        <div className="ml-rule my-4" />
        <div className="ml-card-meta flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--ml-sage-deep)]">
          <span>— {author}</span>
          <span className="inline-flex items-center gap-1 text-[color:var(--ml-ink-soft)]/70">
            {date || `${minutes} min`}
            <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  )
}
