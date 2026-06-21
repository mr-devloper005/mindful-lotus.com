import Link from "next/link";
import { PageShell } from "@/components/shared/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/lib/site-config";

const principles = [
  {
    title: "Reading-first by design",
    description:
      "Pages are built for long attention, with generous spacing, quiet hierarchy, and no feed-style interruptions.",
  },
  {
    title: "Human editorial rhythm",
    description:
      "Publishing cadence is intentional and paced. We prioritize clarity, craft, and usefulness over volume.",
  },
  {
    title: "Calm over noise",
    description:
      "We avoid growth hacks, clutter, and urgency patterns. The experience should feel focused and breathable.",
  },
];

export default function AboutPage() {
  return (
    <PageShell
      title={`About ${SITE_CONFIG.name}`}
      description={`${SITE_CONFIG.name} is an independent, reading-first publication built for slower, deeper attention.`}
      actions={
        <Button asChild>
          <Link href="/contact">Contact</Link>
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-border bg-card">
          <CardContent className="space-y-4 p-6">
            <h2 className="text-2xl font-semibold text-foreground">A quiet publication for deliberate reading.</h2>
            <p className="text-sm leading-7 text-muted-foreground">
              {SITE_CONFIG.name} is designed as a calm editorial space. We publish carefully, keep interfaces simple,
              and shape every page around readability instead of engagement loops.
            </p>
            <p className="text-sm leading-7 text-muted-foreground">
              If something feels slower here, that is intentional. The goal is a site people can actually stay with.
            </p>
          </CardContent>
        </Card>
        <div className="space-y-4">
          {principles.map((item) => (
            <Card key={item.title} className="border-border bg-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
