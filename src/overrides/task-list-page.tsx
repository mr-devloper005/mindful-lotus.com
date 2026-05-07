import Link from 'next/link'
import { ArrowRight, BookOpen } from 'lucide-react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { TaskListClient } from '@/components/tasks/task-list-client'
import { SchemaJsonLd } from '@/components/seo/schema-jsonld'
import { ContentImage } from '@/components/shared/content-image'
import { fetchTaskPosts } from '@/lib/task-data'
import { SITE_CONFIG, getTaskConfig, type TaskKey } from '@/lib/site-config'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { taskIntroCopy } from '@/config/site.content'
import type { SitePost } from '@/lib/site-connector'

export const TASK_LIST_PAGE_OVERRIDE_ENABLED = true

const getContent = (post: SitePost) =>
  (post.content && typeof post.content === 'object' ? post.content : {}) as Record<string, unknown>

const getCategoryLabel = (post: SitePost) => {
  const content = getContent(post)
  if (typeof content.category === 'string' && content.category.trim()) return content.category.trim()
  const tag = Array.isArray(post.tags) ? post.tags.find((value) => typeof value === 'string') : null
  return tag || 'Essay'
}

const getImage = (post: SitePost) => {
  const media = Array.isArray(post.media) ? post.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  if (mediaUrl) return mediaUrl
  const content = getContent(post)
  const images = Array.isArray(content.images) ? (content.images as unknown[]) : []
  const firstImage = images.find((item) => typeof item === 'string') as string | undefined
  if (firstImage) return firstImage
  return typeof content.logo === 'string' ? content.logo : null
}

const stripHtml = (value?: string | null) =>
  (value || '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<\/?[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const excerpt = (value?: string | null, max = 220) => {
  const text = stripHtml(value)
  if (!text) return ''
  return text.length <= max ? text : `${text.slice(0, max).trimEnd()}...`
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

export async function TaskListPageOverride({
  task,
  category,
}: {
  task: TaskKey
  category?: string
}) {
  const taskConfig = getTaskConfig(task)
  const posts = await fetchTaskPosts(task, 30)
  const normalizedCategory = category ? normalizeCategory(category) : 'all'
  const intro = taskIntroCopy[task]
  const baseUrl = SITE_CONFIG.baseUrl.replace(/\/$/, '')
  const schemaItems = posts.slice(0, 10).map((post, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    url: `${baseUrl}${taskConfig?.route || '/posts'}/${post.slug}`,
    name: post.title,
  }))

  const isArticle = task === 'article'
  const filteredPosts =
    normalizedCategory === 'all'
      ? posts
      : posts.filter((post) => normalizeCategory(getCategoryLabel(post)) === normalizedCategory)
  const lead = isArticle ? filteredPosts[0] : null
  const secondary = isArticle ? filteredPosts.slice(1, 5) : []
  const archive = isArticle ? filteredPosts.slice(5) : []

  const header = isArticle ? (
    <section className="border-b border-[color:var(--ml-rule-strong)] pb-10">
      <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.36em] text-[color:var(--ml-sage-deep)]">
        <span>Archive</span>
        <span className="hidden sm:inline">{filteredPosts.length} essays on file</span>
      </div>
      <div className="ml-rule-strong my-6" />
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <span className="ml-chip ml-chip-sage">
            <BookOpen className="h-3 w-3" aria-hidden="true" /> The reading room
          </span>
          <h1
            className="ml-serif-display mt-5 text-[clamp(2.5rem,4.8vw,4.5rem)] leading-[1.03]"
            style={{ fontWeight: 500 }}
          >
            Essays for the <span className="italic text-[color:var(--ml-sage-deep)]">slow half-hour</span>.
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-8 text-[color:var(--ml-ink-soft)]/90">
            A calmer archive shaped like a journal issue: one lead piece, a short editor&apos;s rail,
            and a tidy run of stories beneath it.
          </p>
        </div>

        <form action={taskConfig?.route || '#'} className="lg:col-span-4" method="get">
          <label className="block">
            <span className="ml-eyebrow">Filter by theme</span>
            <div className="mt-3 flex items-end gap-3 border-b border-[color:var(--ml-rule-strong)] pb-1">
              <select
                name="category"
                defaultValue={normalizedCategory}
                className="w-full bg-transparent py-1 text-base text-[color:var(--ml-ink)] focus:outline-none"
              >
                <option value="all">Every theme</option>
                {CATEGORY_OPTIONS.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.name}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.32em] text-[color:var(--ml-brass)] hover:text-[color:var(--ml-ink)]"
              >
                Apply →
              </button>
            </div>
          </label>
          <p className="mt-4 text-xs leading-5 text-[color:var(--ml-ink-soft)]/70">
            Themes are editorial, not algorithmic. Expect a small archive with quieter pacing.
          </p>
        </form>
      </div>
    </section>
  ) : (
    <section className="border-b border-[color:var(--ml-rule-strong)] pb-8">
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <span className="ml-eyebrow">Archived surface</span>
          <h1 className="ml-serif-display mt-3 text-3xl sm:text-4xl">
            {taskConfig?.label || task}
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-8 text-[color:var(--ml-ink-soft)]/90">
            This route remains reachable by URL for compatibility with the wider platform. The
            Mindful Lotus reading experience lives in the essays.
          </p>
        </div>
        <div className="lg:col-span-4">
          <Link href="/articles" className="ml-btn-solid w-full">
            Read the essays
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )

  return (
    <div className="min-h-screen text-[color:var(--ml-ink)]">
      <NavbarShell />
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-12 sm:px-6 lg:px-8">
        {isArticle ? (
          <SchemaJsonLd
            data={{
              '@context': 'https://schema.org',
              '@type': 'CollectionPage',
              name: `${taskConfig?.label || task} | ${SITE_CONFIG.name}`,
              url: `${baseUrl}${taskConfig?.route || ''}`,
              hasPart: schemaItems,
            }}
          />
        ) : null}

        {header}

        {isArticle && lead ? (
          <section className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_20rem]">
            <Link href={`${taskConfig?.route || '/articles'}/${lead.slug}`} className="group block">
              <div className="grid gap-6 border-b border-[color:var(--ml-rule)] pb-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(260px,0.85fr)] lg:items-start">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[color:var(--ml-sage-deep)]">
                    Lead essay • {getCategoryLabel(lead)}
                  </p>
                  <h2 className="ml-serif-display mt-4 text-[clamp(2rem,4vw,3.4rem)] leading-[1.06] transition-colors group-hover:text-[color:var(--ml-sage-deep)]">
                    {lead.title}
                  </h2>
                  <p className="mt-5 max-w-2xl text-[15px] leading-8 text-[color:var(--ml-ink-soft)]/88">
                    {excerpt((getContent(lead).description as string) || lead.summary || '', 280)}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--ml-sage-deep)]">
                    <span>{readingMinutes(lead)} min read</span>
                  </div>
                </div>

                <div className="relative overflow-hidden bg-[color:var(--ml-paper-mist)]">
                  <div className="relative aspect-[4/5]">
                    <ContentImage
                      src={getImage(lead) || undefined}
                      alt={lead.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      sizes="(max-width: 1024px) 100vw, 420px"
                      intrinsicWidth={1000}
                      intrinsicHeight={1250}
                    />
                  </div>
                </div>
              </div>
            </Link>

            <aside className="border-t border-[color:var(--ml-rule)] pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <p className="ml-eyebrow">From the same shelf</p>
              <div className="mt-5 space-y-6">
                {secondary.map((post) => (
                  <Link key={post.id} href={`${taskConfig?.route || '/articles'}/${post.slug}`} className="block border-b border-[color:var(--ml-rule)] pb-5 last:border-b-0 last:pb-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[color:var(--ml-sage-deep)]">
                      {getCategoryLabel(post)}
                    </p>
                    <h3 className="ml-serif-display mt-2 text-xl leading-snug transition-colors hover:text-[color:var(--ml-sage-deep)]">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-[color:var(--ml-ink-soft)]/78">
                      {readingMinutes(post)} min
                    </p>
                  </Link>
                ))}
              </div>
            </aside>
          </section>
        ) : null}

        {intro ? (
          <section className="mt-14 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="ml-eyebrow">Editor&apos;s note</p>
              <h2 className="ml-serif-display mt-3 text-2xl sm:text-3xl">
                {intro.title}
              </h2>
              <div className="mt-5 space-y-4 text-[15px] leading-8 text-[color:var(--ml-ink-soft)]/90">
                {intro.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>
            </div>
            <aside className="lg:col-span-5">
              <div className="ml-card p-7">
                <p className="ml-eyebrow">Wander into</p>
                <ul className="mt-4 divide-y divide-[color:var(--ml-rule)]">
                  {intro.links.map((link) => (
                    <li key={link.href} className="py-3">
                      <Link href={link.href} className="ml-link inline-flex items-center gap-2 text-sm font-semibold">
                        {link.label}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </section>
        ) : null}

        <section className="mt-16">
          <div className="flex items-end justify-between border-b border-[color:var(--ml-rule)] pb-4">
            <p className="ml-eyebrow">
              {isArticle ? 'Archive run' : `All ${(taskConfig?.label || task).toLowerCase()}`}
            </p>
            <span className="text-[11px] uppercase tracking-[0.3em] text-[color:var(--ml-ink-soft)]/60">
              {filteredPosts.length} on file
            </span>
          </div>

          {isArticle ? (
            archive.length ? (
              <div className="mt-10 grid gap-x-10 gap-y-12 md:grid-cols-2">
                {archive.map((post) => (
                  <Link key={post.id} href={`${taskConfig?.route || '/articles'}/${post.slug}`} className="group block border-b border-[color:var(--ml-rule)] pb-8">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[color:var(--ml-sage-deep)]">
                      {getCategoryLabel(post)}
                    </p>
                    <h3 className="ml-serif-display mt-3 text-2xl leading-snug transition-colors group-hover:text-[color:var(--ml-sage-deep)]">
                      {post.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[color:var(--ml-ink-soft)]/82">
                      {excerpt((getContent(post).description as string) || post.summary || '', 180)}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--ml-sage-deep)]">
                      <span>{readingMinutes(post)} min read</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-10 rounded-2xl border border-dashed border-[color:var(--ml-rule)] p-10 text-center text-[color:var(--ml-ink-soft)]">
                No essays are filed under this theme yet.
              </div>
            )
          ) : (
            <div className="mt-10">
              <TaskListClient task={task} initialPosts={posts} category={normalizedCategory} />
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}
