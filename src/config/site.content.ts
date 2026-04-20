import type { TaskKey } from '@/lib/site-config'

export const siteContent = {
  navbar: {
    tagline: 'A quiet publication',
  },
  footer: {
    tagline: 'Slow reading, intentional living',
  },
  hero: {
    badge: 'New essays, weekly',
    title: ['Writing for a slower,', 'more intentional kind of day.'],
    description:
      'Mindful Lotus is a reading-first publication of essays on attention, craft, nature, and the inner life — delivered with generous margins and none of the noise.',
    primaryCta: {
      label: 'Open the latest issue',
      href: '/articles',
    },
    secondaryCta: {
      label: 'Read the manifesto',
      href: '/about',
    },
    searchPlaceholder: 'Search essays, authors, and collections',
    focusLabel: 'This issue',
    featureCardBadge: 'Cover essay',
    featureCardTitle: 'A long essay on how to sit with a sentence before moving on to the next.',
    featureCardDescription:
      'Cover features rotate every Sunday. Older essays remain in the archive and hold their original reading experience.',
  },
  home: {
    metadata: {
      title: 'Essays on attention, craft, and slower living',
      description:
        'Mindful Lotus is a quiet, reading-first publication of essays on attention, craft, and a slower kind of day.',
      openGraphTitle: 'Mindful Lotus — essays on attention and slow living',
      openGraphDescription:
        'A reading-first publication of essays on presence, craft, and a quieter way to spend an afternoon.',
      keywords: [
        'mindful reading',
        'slow publication',
        'essays on attention',
        'long-form writing',
        'mindfulness',
        'contemplative essays',
      ],
    },
    introBadge: 'About the publication',
    introTitle: 'A small, independent publication built for the kind of reader who still underlines paragraphs.',
    introParagraphs: [
      'Mindful Lotus publishes essays that reward patience. Every piece is edited for cadence, not clicks — we would rather you finish one essay than skim ten.',
      'The library grows slowly: a new cover essay most Sundays, a shorter letter midweek, and a seasonal anthology pulled from the archive every quarter.',
      'There are no pop-ups, no recommendation feeds, and no infinite scroll. Just writing, a table of contents, and time enough to read it.',
    ],
    sideBadge: 'Inside this issue',
    sidePoints: [
      'Cover essay refreshed every Sunday morning.',
      'Midweek letter from the editor, shorter and quieter.',
      'A seasonal anthology from the archive, four times a year.',
      'Annotated margins, pull quotes, and room to think between paragraphs.',
    ],
    primaryLink: {
      label: 'Open the archive',
      href: '/articles',
    },
    secondaryLink: {
      label: 'Read about the editors',
      href: '/about',
    },
  },
  cta: {
    badge: 'Subscribe, quietly',
    title: 'One essay in your inbox each Sunday. Nothing in between.',
    description:
      'No promotional emails, no tracking pixels, no resurfaced old posts. A single link to the new cover essay, sent once a week.',
    primaryCta: {
      label: 'Join the reading list',
      href: '/register',
    },
    secondaryCta: {
      label: 'Read the current issue',
      href: '/articles',
    },
  },
  taskSectionHeading: 'Recent {label}',
  taskSectionDescriptionSuffix: 'The most recently published essays in the archive.',
} as const

export const taskPageMetadata: Record<Exclude<TaskKey, 'comment' | 'org' | 'social'>, { title: string; description: string }> = {
  article: {
    title: 'Essays & long-form writing',
    description:
      'Browse the Mindful Lotus archive of essays on attention, craft, nature, and the inner life.',
  },
  listing: {
    title: 'Directory (archived surface)',
    description: 'This surface is retained for compatibility; the Mindful Lotus publication focuses on essays.',
  },
  classified: {
    title: 'Notices (archived surface)',
    description: 'This surface is retained for compatibility; the Mindful Lotus publication focuses on essays.',
  },
  image: {
    title: 'Plates & photography (archived surface)',
    description: 'This surface is retained for compatibility; the Mindful Lotus publication focuses on essays.',
  },
  profile: {
    title: 'Contributors (archived surface)',
    description: 'This surface is retained for compatibility; the Mindful Lotus publication focuses on essays.',
  },
  sbm: {
    title: 'Reading list (archived surface)',
    description: 'This surface is retained for compatibility; the Mindful Lotus publication focuses on essays.',
  },
  pdf: {
    title: 'Printable editions (archived surface)',
    description: 'This surface is retained for compatibility; the Mindful Lotus publication focuses on essays.',
  },
}

export const taskIntroCopy: Record<
  TaskKey,
  { title: string; paragraphs: string[]; links: { label: string; href: string }[] }
> = {
  article: {
    title: 'Essays worth the quiet half-hour they ask for.',
    paragraphs: [
      'The Mindful Lotus archive is a slow river. Pieces are filed by season, not by trending topic, and the reading rhythm is set by the writing — not a feed algorithm.',
      'Every essay is hand-edited for pacing, with pull quotes, margin notes, and enough white space to think. You will not find ranked lists, engagement nudges, or five-minute-read labels.',
      'Use the archive to wander. Pick an essay, read it slowly, and come back another day.',
    ],
    links: [
      { label: 'The current issue', href: '/articles' },
      { label: 'About the editors', href: '/about' },
      { label: 'Write to the desk', href: '/contact' },
    ],
  },
  listing: {
    title: 'Archived surface',
    paragraphs: [
      'This route remains reachable by direct URL for compatibility with the wider platform, but it is not part of the Mindful Lotus reading experience.',
      'If you were looking for essays, the archive is the place to be.',
    ],
    links: [{ label: 'Read the essays', href: '/articles' }],
  },
  classified: {
    title: 'Archived surface',
    paragraphs: [
      'This route remains reachable by direct URL for compatibility, but the Mindful Lotus publication publishes essays, not notices.',
    ],
    links: [{ label: 'Read the essays', href: '/articles' }],
  },
  image: {
    title: 'Archived surface',
    paragraphs: [
      'Photography occasionally accompanies an essay, but we do not publish a standalone gallery.',
    ],
    links: [{ label: 'Read the essays', href: '/articles' }],
  },
  profile: {
    title: 'Archived surface',
    paragraphs: [
      'Contributor pages are folded into each essay; there is no separate directory on the publication.',
    ],
    links: [{ label: 'Read the essays', href: '/articles' }],
  },
  sbm: {
    title: 'Archived surface',
    paragraphs: [
      'The editors keep a private reading list; it is not a public surface on this site.',
    ],
    links: [{ label: 'Read the essays', href: '/articles' }],
  },
  pdf: {
    title: 'Archived surface',
    paragraphs: [
      'Printable editions are sent by email to subscribers, not hosted as a public library here.',
    ],
    links: [{ label: 'Read the essays', href: '/articles' }],
  },
  social: {
    title: 'Archived surface',
    paragraphs: [
      'Quick updates happen on the editor’s letter, not in a social feed.',
    ],
    links: [{ label: 'Read the essays', href: '/articles' }],
  },
  comment: {
    title: 'Letters to the editor',
    paragraphs: [
      'Responses are collected under each essay. This surface remains available by URL but is not part of the home-page rhythm.',
    ],
    links: [{ label: 'Read the essays', href: '/articles' }],
  },
  org: {
    title: 'Archived surface',
    paragraphs: [
      'Mindful Lotus is a small independent publication; there is no organization directory on the site.',
    ],
    links: [{ label: 'Read the essays', href: '/articles' }],
  },
}
