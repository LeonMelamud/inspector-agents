import { Metadata } from 'next';
import Link from 'next/link';
import { generateSEO } from '@/lib/seo';

export const metadata: Metadata = generateSEO({
  title: 'Blog - AI Agent Testing Insights & Case Studies',
  description:
    'Expert insights on AI agent testing, real-world failure analysis, and practical guides to prevent AI chatbot disasters. Learn from 500+ documented AI incidents.',
  keywords: [
    'AI agent testing blog',
    'AI chatbot failures',
    'AI safety guides',
    'LLM testing tutorials',
    'AI incident analysis',
  ],
  canonical: 'https://inspectagents.com/blog',
});

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  category: string;
  featured?: boolean;
}

const blogPosts: BlogPost[] = [
  {
    slug: 'ai-chatbot-failures-2025-2026',
    title: 'The Complete List of AI Chatbot Failures (2025-2026)',
    description:
      'A comprehensive, continuously updated database of AI agent failures, hallucinations, and security breaches. Learn from real incidents that cost companies millions.',
    date: '2026-01-24',
    readTime: '12 min read',
    category: 'Case Studies',
    featured: true,
  },
  {
    slug: 'how-to-test-ai-agents',
    title: 'How to Test AI Agents Before Deployment: A Practical Guide',
    description:
      'Step-by-step testing framework for AI agents covering hallucination detection, prompt injection prevention, security validation, and production monitoring.',
    date: '2026-01-24',
    readTime: '15 min read',
    category: 'Guides',
    featured: true,
  },
  {
    slug: 'chevrolet-ai-failure-breakdown',
    title: "Chevrolet's $1 Car Fiasco: Full Breakdown & Prevention Guide",
    description:
      'Deep dive into how a prompt injection attack led Chevrolet\'s chatbot to sell a 2024 Tahoe for $1. Complete timeline, technical analysis, and prevention strategies.',
    date: '2026-01-24',
    readTime: '10 min read',
    category: 'Case Studies',
    featured: true,
  },
];

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function BlogPage() {
  const featuredPosts = blogPosts.filter((post) => post.featured);
  const regularPosts = blogPosts.filter((post) => !post.featured);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/"
            className="text-green-600 hover:text-green-700 font-medium inline-flex items-center gap-2 mb-4"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">
            AI Agent Testing Blog
          </h1>
          <p className="text-xl text-stone-600 max-w-3xl">
            Real-world AI failures, practical testing guides, and expert
            insights to help you deploy AI agents safely and confidently.
          </p>
        </div>
      </header>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-stone-900 mb-8">
            Featured Articles
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-stone-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-block px-3 py-1 text-xs font-medium text-green-700 bg-green-50 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-sm text-stone-500">
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 mb-3 group-hover:text-green-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-stone-600 mb-4 line-clamp-3">
                    {post.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <time
                      className="text-sm text-stone-500"
                      dateTime={post.date}
                    >
                      {formatDate(post.date)}
                    </time>
                    <span className="text-green-600 font-medium group-hover:text-green-700">
                      Read more →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* All Posts */}
      {regularPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-stone-900 mb-8">
            All Articles
          </h2>
          <div className="space-y-6">
            {regularPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-stone-200 p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="inline-block px-3 py-1 text-xs font-medium text-green-700 bg-green-50 rounded-full">
                        {post.category}
                      </span>
                      <span className="text-sm text-stone-500">
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-stone-900 mb-2 group-hover:text-green-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-stone-600">{post.description}</p>
                  </div>
                  <div className="flex items-center gap-4 md:flex-col md:items-end">
                    <time
                      className="text-sm text-stone-500"
                      dateTime={post.date}
                    >
                      {formatDate(post.date)}
                    </time>
                    <span className="text-green-600 font-medium group-hover:text-green-700">
                      Read more →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-green-600 to-green-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Discover Your AI Risk Level
          </h2>
          <p className="text-green-50 text-lg mb-8">
            Take our 2-minute quiz to identify your biggest AI vulnerabilities
            and get a personalized action plan.
          </p>
          <Link
            href="/quiz"
            className="inline-block bg-white text-green-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition-colors shadow-lg"
          >
            Take the AI Risk Quiz →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold mb-4">InspectAgents</h3>
              <p className="text-sm">
                AI agent testing and safety platform preventing chatbot
                failures.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/blog" className="hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/failures" className="hover:text-white">
                    AI Failures Database
                  </Link>
                </li>
                <li>
                  <Link href="/checklist" className="hover:text-white">
                    Risk Checklist
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/quiz" className="hover:text-white">
                    Take Quiz
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://twitter.com/inspectagents"
                    className="hover:text-white"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="https://linkedin.com/company/inspectagents"
                    className="hover:text-white"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-stone-800 mt-8 pt-8 text-sm text-center">
            <p>
              &copy; {new Date().getFullYear()} InspectAgents. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
