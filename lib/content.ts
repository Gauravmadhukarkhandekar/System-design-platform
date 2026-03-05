import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getAllPaths } from './navigation';

const contentDir = path.join(process.cwd(), 'content');

export function getContentPath(section: string, slug: string): string {
  return path.join(contentDir, section, `${slug}.mdx`);
}

export function getContentByPath(filePath: string): string | null {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return null;
  }
}

export function getContent(section: string, slug: string): { content: string; matter: Record<string, unknown> } | null {
  const filePath = getContentPath(section, slug);
  const raw = getContentByPath(filePath);
  if (!raw) return null;
  const { content, data } = matter(raw);
  return { content, matter: data as Record<string, unknown> };
}

export function getAllContentPaths() {
  return getAllPaths();
}
