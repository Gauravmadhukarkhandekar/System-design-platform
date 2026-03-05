import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getAllContentPaths } from '@/lib/content';
import { navigation } from '@/lib/navigation';
import { ContentLayout } from '@/components/ContentLayout';
import { CodeBlock } from '@/components/CodeBlock';
import { DiagramBlock } from '@/components/DiagramBlock';
import { Card } from '@/components/Card';
import { Callout } from '@/components/Callout';
import { SummaryBox } from '@/components/SummaryBox';
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
          <ul className="space-y-2">
            {sectionNav.items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-primary hover:underline font-medium"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </ContentLayout>
    );
  }

  const [section, ...rest] = slug;
  const slugStr = rest.join('/');
  const filePath = path.join(contentDir, section, `${slugStr}.mdx`);
  let raw: string;
  try {
    raw = fs.readFileSync(filePath, 'utf-8');
  } catch {
    notFound();
  }
  const { content, data } = matter(raw);
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
