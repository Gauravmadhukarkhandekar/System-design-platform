'use client';

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { CodeBlock } from './CodeBlock';
import { DiagramBlock } from './DiagramBlock';
import { Card } from './Card';

const mdxComponents = {
  pre: (props: React.HTMLAttributes<HTMLPreElement> & { children?: React.ReactNode }) => {
    const child = props.children as React.ReactElement | undefined;
    const className = child?.props?.className as string | undefined;
    const codeChildren = child?.props?.children as string | undefined;
    if (className?.startsWith('language-')) {
      if (className.includes('mermaid')) {
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
    return (
      <code className={className} {...rest}>
        {children}
      </code>
    );
  },
  DiagramBlock,
  CodeBlock,
  Card,
};

type Props = {
  source: MDXRemoteSerializeResult;
};

export function MdxContent({ source }: Props) {
  return <MDXRemote {...source} components={mdxComponents} />;
}
