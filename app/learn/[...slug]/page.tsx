import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getAllContentPaths } from '@/lib/content';
import { navigation, type NavItem } from '@/lib/navigation';
import { ContentLayout } from '@/components/ContentLayout';
import { CodeBlock } from '@/components/CodeBlock';
import { DiagramBlock } from '@/components/DiagramBlock';
import { Card } from '@/components/Card';
import { Callout } from '@/components/Callout';
import { SummaryBox } from '@/components/SummaryBox';
import { ComparisonTable } from '@/components/ComparisonTable';
import { LatencyThroughputSimulator } from '@/components/LatencyThroughputSimulator';
import { RequestLifecycleSimulator } from '@/components/RequestLifecycleSimulator';
import { ScalingMindsetExplorer } from '@/components/ScalingMindsetExplorer';
import { SyncAsyncSimulator } from '@/components/SyncAsyncSimulator';
import { SyncAsyncWorkflow } from '@/components/SyncAsyncWorkflow';
import { BackOfEnvelopeCalculator } from '@/components/BackOfEnvelopeCalculator';
import { CapacityHeadroomBar } from '@/components/CapacityHeadroomBar';
import { CapacityStrategyCards, KeyCapacityMetricsGrid } from '@/components/CapacityVisualBlocks';
import { ReliabilityPillarBoxes } from '@/components/ReliabilityPillarBoxes';
import { SlaUptimeCalculator } from '@/components/SlaUptimeCalculator';
import { AcidPropertiesCards } from '@/components/AcidPropertiesCards';
import { BasePropertiesCards } from '@/components/BasePropertiesCards';
import { MetricTable } from '@/components/MetricTable';
import { ReadWriteExamplesTable } from '@/components/ReadWriteExamplesTable';
import { CachingStrategiesVisual } from '@/components/CachingStrategiesVisual';
import { CacheEvictionSimulator } from '@/components/CacheEvictionSimulator';
import { IsolationComparisonTable, IsolationLevelCards } from '@/components/IsolationLevelsVisual';
import { MdxTable } from '@/components/MdxTable';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import matter from 'gray-matter';
import fs from 'fs';
import path from 'path';

const mdxComponents = {
  pre: (props: React.HTMLAttributes<HTMLPreElement> & { children?: React.ReactNode }) => {
    const child = props.children as React.ReactElement | undefined;
    const className = child?.props?.className as string | undefined;
    const codeChildren = child?.props?.children as string | undefined;
    if (className?.startsWith('language-')) {
      if (className?.includes('mermaid')) {
        return <DiagramBlock chart={String(codeChildren ?? '').trim()} />;
      }
      return (
        <CodeBlock className={className} title={child?.props?.title as string}>
          {String(codeChildren ?? '')}
        </CodeBlock>
      );
    }
    return <pre {...props} />;
  },
  code: (props: React.HTMLAttributes<HTMLElement>) => {
    const { children, className, ...rest } = props;
    return <code className={className} {...rest}>{children}</code>;
  },
  DiagramBlock,
  CodeBlock,
  Card,
  Callout,
  SummaryBox,
  ComparisonTable,
  LatencyThroughputSimulator,
  RequestLifecycleSimulator,
  ScalingMindsetExplorer,
  SyncAsyncSimulator,
  SyncAsyncWorkflow,
  BackOfEnvelopeCalculator,
  CapacityHeadroomBar,
  CapacityStrategyCards,
  KeyCapacityMetricsGrid,
  ReliabilityPillarBoxes,
  SlaUptimeCalculator,
  AcidPropertiesCards,
  BasePropertiesCards,
  MetricTable,
  ReadWriteExamplesTable,
  CachingStrategiesVisual,
  CacheEvictionSimulator,
  IsolationComparisonTable,
  IsolationLevelCards,
  table: MdxTable,
};

const contentDir = path.join(process.cwd(), 'content');
const sectionNames = ['fundamentals', 'hld', 'lld', 'case-studies'];

function extractHeadings(content: string): { id: string; text: string; level: number }[] {
  const headings: { id: string; text: string; level: number }[] = [];
  const regex = /^(#{1,3})\s+(.+)$/gm;
  let m;
  while ((m = regex.exec(content)) !== null) {
    const level = m[1].length;
    const text = m[2].replace(/#+\s*$/, '').trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    headings.push({ id, text, level });
  }
  return headings;
}

function renderSectionItems(items: NavItem[] | undefined) {
  const hasGroups = items?.some((i) => i.items?.length);
  if (!hasGroups) {
    return (
      <ul className="space-y-2">
        {items?.map((item) =>
          item.href ? (
            <li key={item.href}>
              <Link href={item.href} className="text-primary hover:underline font-medium">
                {item.title}
              </Link>
            </li>
          ) : null
        )}
      </ul>
    );
  }
  return items?.map((item) => {
    if (item.items?.length) {
      return (
        <div key={item.title} className="mb-6">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {item.title}
          </h2>
          <ul className="space-y-1">
            {item.items.map((sub) =>
              sub.href ? (
                <li key={sub.href}>
                  <Link href={sub.href} className="text-primary hover:underline font-medium">
                    {sub.title}
                  </Link>
                </li>
              ) : null
            )}
          </ul>
        </div>
      );
    }
    return item.href ? (
      <li key={item.href}>
        <Link href={item.href} className="text-primary hover:underline font-medium">
          {item.title}
        </Link>
      </li>
    ) : null;
  });
}

export async function generateStaticParams() {
  const paths = getAllContentPaths();
  const docParams = paths.map(({ section, slug }) => ({ slug: [section, slug] }));
  const sectionParams = sectionNames.map((s) => ({ slug: [s] }));
  return [...docParams, ...sectionParams];
}

export default async function LearnPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  if (!slug?.length) notFound();

  if (slug.length === 1) {
    const section = slug[0];
    const sectionNav = navigation.find((n) => n.href === `/learn/${section}`);
    if (!sectionNav?.items?.length) notFound();

    return (
      <ContentLayout toc={[]}>
        <div className="space-y-8">
          <h1 className="text-3xl font-bold">{sectionNav.title}</h1>
          <p className="text-muted-foreground">
            Choose a topic to get started.
          </p>
          <div className="space-y-2">{renderSectionItems(sectionNav.items)}</div>
        </div>
      </ContentLayout>
    );
  }

  const [section, ...rest] = slug;
  const slugStr = rest.join('/');
  const filePath = path.join(contentDir, section, `${slugStr}.mdx`);
  const allPaths = getAllContentPaths();
  const pathExists = allPaths.some((p) => p.section === section && p.slug === slugStr);

  let raw: string | null = null;
  try {
    raw = fs.readFileSync(filePath, 'utf-8');
  } catch {
    if (!pathExists) notFound();
  }

  if (!raw && pathExists) {
    const titleFromSlug = slugStr.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    return (
      <ContentLayout toc={[]}>
        <div className="relative">
          <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-b from-muted/30 to-transparent dark:from-muted/20" aria-hidden />
          <article className="content-page prose prose-neutral dark:prose-invert max-w-none rounded-2xl px-4 py-6 sm:px-6 sm:py-8 md:px-8">
            <h1>{titleFromSlug}</h1>
            <p className="text-muted-foreground">Content coming soon.</p>
          </article>
        </div>
      </ContentLayout>
    );
  }

  const { content, data } = matter(raw!);
  const toc = extractHeadings(content);

  return (
    <ContentLayout toc={toc}>
      <div className="relative">
        <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-b from-muted/30 to-transparent dark:from-muted/20" aria-hidden />
        <article className="content-page prose prose-neutral dark:prose-invert max-w-none rounded-2xl px-4 py-6 sm:px-6 sm:py-8 md:px-8">
          <MDXRemote
            source={content}
            options={{
              mdxOptions: {
                rehypePlugins: [
                  rehypeSlug,
                  [rehypeAutolinkHeadings, { behavior: 'wrap' }],
                ],
              },
            }}
            components={mdxComponents}
          />
        </article>
      </div>
    </ContentLayout>
  );
}
