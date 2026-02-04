import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPostBySlug, getAllSlugs } from '../lib/posts';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: 'Not Found | HiveFence Blog' };
  
  return {
    title: `${post.title} | HiveFence Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#0a0a0b]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0b]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-white font-semibold text-lg hover:opacity-80 transition-opacity">
            <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none">
              <path d="M24 4L42 14V34L24 44L6 34V14L24 4Z" stroke="currentColor" strokeWidth="2" fill="none" className="text-amber-500"/>
              <ellipse cx="24" cy="26" rx="6" ry="8" fill="currentColor" className="text-amber-500"/>
              <circle cx="24" cy="18" r="4" fill="currentColor" className="text-amber-500"/>
              <path d="M18 24h12M18 28h12" stroke="#0a0a0b" strokeWidth="2"/>
            </svg>
            HiveFence
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-zinc-400 hover:text-white transition-colors text-sm">
              Home
            </Link>
            <Link href="/blog" className="text-white text-sm">
              Blog
            </Link>
            <Link 
              href="https://github.com/seojoonkim/hivefence" 
              target="_blank"
              className="text-zinc-400 hover:text-white transition-colors text-sm"
            >
              GitHub
            </Link>
          </div>
        </div>
      </nav>

      {/* Article */}
      <article className="pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Back link */}
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-amber-500 transition-colors mb-8 text-sm"
          >
            ← Back to Blog
          </Link>

          {/* Header */}
          <header className="mb-12">
            {post.tags && post.tags.length > 0 && (
              <div className="flex gap-2 mb-4">
                {post.tags.map(tag => (
                  <span 
                    key={tag}
                    className="px-2 py-0.5 bg-amber-500/10 text-amber-500 text-xs rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-zinc-500">
              <span>{post.author}</span>
              <span>•</span>
              <span>{post.date}</span>
              <span>•</span>
              <span>{post.readTime}</span>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none
            prose-headings:text-white prose-headings:font-semibold
            prose-h1:text-3xl prose-h1:mt-12 prose-h1:mb-6
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-amber-500
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-zinc-300 prose-p:leading-relaxed
            prose-a:text-amber-500 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-white prose-strong:font-semibold
            prose-code:text-amber-400 prose-code:bg-zinc-800/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-normal prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl prose-pre:overflow-x-auto
            prose-ul:text-zinc-300 prose-ol:text-zinc-300
            prose-li:marker:text-amber-500
            prose-blockquote:border-l-amber-500 prose-blockquote:bg-amber-500/5 prose-blockquote:py-1 prose-blockquote:text-zinc-400
            prose-hr:border-white/10
            prose-table:text-sm
            prose-th:text-white prose-th:bg-zinc-800/50 prose-th:px-4 prose-th:py-2
            prose-td:px-4 prose-td:py-2 prose-td:border-white/10
          ">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Share / Navigate */}
          <footer className="mt-16 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between">
              <Link 
                href="/blog" 
                className="text-zinc-400 hover:text-amber-500 transition-colors text-sm"
              >
                ← Back to all posts
              </Link>
              <div className="flex items-center gap-4">
                <a 
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://hivefence.com/blog/${post.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-white transition-colors text-sm"
                >
                  Share on X
                </a>
              </div>
            </div>
          </footer>
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-sm text-zinc-500">
          <span>© 2026 HiveFence</span>
          <div className="flex items-center gap-4">
            <Link href="https://github.com/seojoonkim/hivefence" target="_blank" className="hover:text-white transition-colors">
              GitHub
            </Link>
            <Link href="https://discord.gg/clawd" target="_blank" className="hover:text-white transition-colors">
              Discord
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
