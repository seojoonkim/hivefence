import Link from 'next/link';
import { getAllPosts } from './lib/posts';

export const metadata = {
  title: 'Blog | HiveFence',
  description: 'News, updates, and threat intelligence from the HiveFence collective defense network.',
};

export default function BlogPage() {
  const posts = getAllPosts();

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

      {/* Header */}
      <header className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-500 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
            Latest Updates
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            The Hive <span className="text-amber-500">Blog</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Threat intelligence reports, security updates, and insights from our collective defense network.
          </p>
        </div>
      </header>

      {/* Posts Grid */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-20 text-zinc-500">
              No posts yet. Check back soon!
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post, index) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className={`block group relative bg-zinc-900/50 border border-white/5 rounded-2xl p-6 md:p-8 transition-all duration-300 hover:border-amber-500/30 hover:bg-zinc-900/80 ${
                    index === 0 ? 'md:p-10' : ''
                  }`}
                >
                  {/* Featured badge for first post */}
                  {index === 0 && (
                    <div className="absolute -top-3 left-6 px-3 py-1 bg-amber-500 text-black text-xs font-semibold rounded-full">
                      Latest
                    </div>
                  )}

                  {/* Tags */}
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

                  {/* Title */}
                  <h2 className={`font-semibold text-white mb-3 group-hover:text-amber-500 transition-colors ${
                    index === 0 ? 'text-2xl md:text-3xl' : 'text-xl'
                  }`}>
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-zinc-400 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-sm text-zinc-500">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                    <span className="ml-auto text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      Read more →
                    </span>
                  </div>

                  {/* Hover accent line */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 rounded-l-2xl scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

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
