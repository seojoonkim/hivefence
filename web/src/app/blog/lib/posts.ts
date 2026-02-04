import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), '..', 'blog');

export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  tags?: string[];
  author?: string;
  readTime?: string;
}

function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

function extractExcerpt(content: string): string {
  // Remove markdown formatting and get first paragraph
  const plainText = content
    .replace(/^#+\s+.+$/gm, '') // Remove headers
    .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.+?)\*/g, '$1') // Remove italic
    .replace(/`{1,3}[^`]+`{1,3}/g, '') // Remove code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
    .replace(/^[-*]\s+/gm, '') // Remove list markers
    .replace(/\n{2,}/g, '\n') // Collapse newlines
    .trim();
  
  const firstParagraph = plainText.split('\n').find(p => p.length > 50);
  return firstParagraph?.slice(0, 160) + '...' || plainText.slice(0, 160) + '...';
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const posts = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      // Extract title from first h1 if not in frontmatter
      const titleMatch = content.match(/^#\s+(.+)$/m);
      const title = data.title || titleMatch?.[1] || slug;

      return {
        slug,
        title,
        date: data.date || fs.statSync(fullPath).mtime.toISOString().split('T')[0],
        excerpt: data.excerpt || extractExcerpt(content),
        content,
        tags: data.tags || [],
        author: data.author || 'HiveFence Team',
        readTime: calculateReadTime(content),
      };
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1));

  return posts;
}

export function getPostBySlug(slug: string): Post | null {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = data.title || titleMatch?.[1] || slug;

  return {
    slug,
    title,
    date: data.date || fs.statSync(fullPath).mtime.toISOString().split('T')[0],
    excerpt: data.excerpt || extractExcerpt(content),
    content,
    tags: data.tags || [],
    author: data.author || 'HiveFence Team',
    readTime: calculateReadTime(content),
  };
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  return fs.readdirSync(postsDirectory)
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => fileName.replace(/\.md$/, ''));
}
