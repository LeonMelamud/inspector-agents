import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-primary-900 text-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="py-14 grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-accent-500 text-primary-900 text-sm font-bold">IA</span>
              <span className="font-display text-lg font-bold">InspectAgents</span>
            </div>
            <p className="text-primary-300 text-sm leading-relaxed">Making AI agent testing accessible, practical, and transparent for every business.</p>
          </div>
          <div>
            <h4 className="font-bold text-accent-400 text-sm tracking-wide uppercase mb-4">Resources</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/quiz" className="text-primary-300 hover:text-white transition-colors">AI Risk Quiz</Link></li>
              <li><Link href="/failures" className="text-primary-300 hover:text-white transition-colors">Failures Database</Link></li>
              <li><Link href="/blog" className="text-primary-300 hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/glossary" className="text-primary-300 hover:text-white transition-colors">Glossary</Link></li>
              <li><Link href="/checklist" className="text-primary-300 hover:text-white transition-colors">Testing Checklist</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-accent-400 text-sm tracking-wide uppercase mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/about" className="text-primary-300 hover:text-white transition-colors">About</Link></li>
              <li><a href="https://www.linkedin.com/in/leon-melamud" className="text-primary-300 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-accent-400 text-sm tracking-wide uppercase mb-4">Legal</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/privacy" className="text-primary-300 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-primary-300 hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-700 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-primary-400 text-sm">&copy; {new Date().getFullYear()} InspectAgents. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="https://www.linkedin.com/in/leon-melamud" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-white transition-colors" aria-label="Visit our LinkedIn">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
