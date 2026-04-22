import Link from 'next/link'
import { ArrowRight, BookOpen } from 'lucide-react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { TaskListClient } from '@/components/tasks/task-list-client'
import { SchemaJsonLd } from '@/components/seo/schema-jsonld'
import { fetchTaskPosts } from '@/lib/task-data'
import { SITE_CONFIG, getTaskConfig, type TaskKey } from '@/lib/site-config'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { taskIntroCopy } from '@/config/site.content'

export const TASK_LIST_PAGE_OVERRIDE_ENABLED = true

const seasonLabel = () => {
  const now = new Date()
  const season = ['Winter', 'Spring', 'Summer', 'Autumn'][
    Math.floor(((now.getMonth() + 1) % 12) / 3)
  ]
  return `${season} ${now.getFullYear()}`
}

/**
 * Editorial articles index — and a calm, intentionally low-emphasis
 * surface for every other task route that is kept URL-accessible.
 * The article layout uses an issue masthead + two-column index, while
 * non-article routes render a compact "archived surface" notice that
 * still lists the posts (so nothing in the system is hidden).
 */
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

  const header = isArticle ? (
    <section className="border-b border-[color:var(--ml-rule-strong)] pb-10">
      <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.36em] text-[color:var(--ml-sage-deep)]">
        <span>Archive · {seasonLabel()}</span>
        <span className="hidden sm:inline">{posts.length} essays on file</span>
      </div>
      <div className="ml-rule-strong my-6" />
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <span className="ml-chip ml-chip-sage">
            <BookOpen className="h-3 w-3" aria-hidden="true" /> The reading room
          </span>
          <h1
            className="ml-serif-display mt-5 text-[clamp(2.3rem,4.6vw,4.2rem)] leading-[1.04]"
            style={{ fontWeight: 500 }}
          >
            Essays for the <span className="italic text-[color:var(--ml-sage-deep)]">slow half-hour</span>.
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-8 text-[color:var(--ml-ink-soft)]/90">
            The Mindful Lotus archive gathers every published essay in one place. The rhythm is
            deliberately unsorted by popularity — wander, read, return another day.
          </p>
        </div>

        <form
          action={taskConfig?.route || '#'}
          className="lg:col-span-4"
          method="get"
        >
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
            Themes are editorial, not algorithmic. Expect a short list of essays per theme, curated
            by the editors.
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

        {intro ? (
          <section className="mt-14 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="ml-eyebrow">Editor’s note</p>
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
              {isArticle ? 'All essays' : `All ${(taskConfig?.label || task).toLowerCase()}`}
            </p>
            <span className="text-[11px] uppercase tracking-[0.3em] text-[color:var(--ml-ink-soft)]/60">
              {posts.length} on file
            </span>
          </div>
          <div className="mt-10">
            <TaskListClient task={task} initialPosts={posts} category={normalizedCategory} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
