import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About InspectAgents - Our Mission to Make AI Safe',
  description: 'Founded to prevent AI disasters after analyzing 500+ chatbot failures. Learn our story, mission, and commitment to making AI agent testing accessible to every business.',
  alternates: {
    canonical: 'https://inspectagents.com/about',
  },
  openGraph: {
    title: 'About InspectAgents - Our Mission to Make AI Safe',
    description: 'Founded to prevent AI disasters after analyzing 500+ chatbot failures. Learn our story and mission.',
    type: 'website',
    url: 'https://inspectagents.com/about',
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-stone-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-stone-100 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-stone-900 mb-6 leading-tight">
              Making AI Safe Shouldn't Be This Hard
            </h1>
            <p className="text-xl md:text-2xl text-stone-600 mb-8 leading-relaxed">
              After watching hundreds of companies get burned by AI failures,
              <br />
              <span className="text-stone-900 font-semibold">
                we decided someone had to fix this.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Founder Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-12">
              <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
                <div className="flex-shrink-0">
                  <Image
                    src="/images/linkedin_profile.jpeg"
                    alt="Leon Melamud, Founder of InspectAgents"
                    width={128}
                    height={128}
                    className="w-32 h-32 rounded-full object-cover shadow-lg"
                    priority
                  />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-stone-900 mb-2">The Story</h2>
                  <p className="text-lg text-stone-600 mb-1">
                    <span className="font-semibold text-stone-900">Leon Melamud, Founder</span>
                  </p>
                  <p className="text-sm text-stone-500 mb-4 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                    Miami, Florida
                  </p>
                  <a 
                    href="https://www.linkedin.com/in/leon-melamud" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    Connect on LinkedIn
                  </a>
                </div>
              </div>

              <div className="prose prose-lg max-w-none text-stone-700 space-y-6">
                <p className="text-xl leading-relaxed">
                  I'll never forget the day I watched Chevrolet's chatbot agree to sell a $70,000 SUV for $1.
                </p>
                
                <p>
                  It wasn't funny. It was terrifying. Because I knew <span className="font-semibold text-stone-900">that could be any of us</span>.
                </p>

                <p>
                  I'd spent years building AI systems at scale — products used by millions of people every day. I'd seen the promise. The magic of what these models could do. The excitement in every product meeting when someone said "what if we add AI to this?"
                </p>

                <p>
                  But I'd also seen the other side. The late-night Slack messages about hallucinations in production. The support tickets from confused users who got nonsensical answers. The security reviews that found prompt injection vulnerabilities nobody had thought to test for.
                </p>

                <p className="font-semibold text-stone-900">
                  The problem? Everyone was building AI agents. Nobody was testing them properly.
                </p>

                <p>
                  Not because they didn't care. Because <span className="italic">they didn't know how</span>. The tools were scattered. The knowledge was locked in research papers. The playbooks didn't exist.
                </p>

                <p>
                  So I started documenting every AI failure I could find. Chevrolet. Air Canada. DPD. Google Bard's $100 billion mistake. ChatGPT's lawyer citing fake cases. The list kept growing.
                </p>

                <p>
                  <span className="font-bold text-stone-900">500+ failures later</span>, the patterns became crystal clear:
                </p>

                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>90% of failures were preventable</strong> with proper testing</li>
                  <li><strong>Most companies had no testing process</strong> beyond "try it and see"</li>
                  <li><strong>The few who tested well</strong> caught vulnerabilities before launch</li>
                  <li><strong>Nobody was sharing what worked</strong> — everyone was learning the hard way</li>
                </ul>

                <p>
                  That's when it hit me: <span className="font-semibold text-stone-900">this is fixable</span>.
                </p>

                <p>
                  Not with another complex enterprise platform. Not with academic papers nobody reads. But with something simple: <span className="italic">help people understand their risks, learn from others' failures, and get a clear path forward</span>.
                </p>

                <p className="text-xl font-semibold text-stone-900 pt-4">
                  That's why I built InspectAgents.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gradient-to-b from-stone-100 to-primary-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-6">Our Mission</h2>
              <p className="text-2xl text-stone-600 leading-relaxed">
                Make AI agent testing <span className="text-primary-600 font-semibold">accessible, practical, and transparent</span> for every business — not just tech giants.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-stone-900 mb-3">Accessible</h3>
                <p className="text-stone-600">
                  No PhD required. No enterprise contracts. Start with a free quiz and get actionable insights in 5 minutes.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="text-4xl mb-4">🔧</div>
                <h3 className="text-xl font-bold text-stone-900 mb-3">Practical</h3>
                <p className="text-stone-600">
                  Learn from real failures, not theory. Get step-by-step playbooks, not abstract frameworks.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="text-4xl mb-4">🌐</div>
                <h3 className="text-xl font-bold text-stone-900 mb-3">Transparent</h3>
                <p className="text-stone-600">
                  Share what works. Build in public. Help the entire industry learn faster together.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
              <h3 className="text-2xl font-bold text-stone-900 mb-6">What We Believe</h3>
              <div className="space-y-4 text-stone-700">
                <div className="flex gap-4">
                  <span className="text-primary-600 font-bold text-xl">✓</span>
                  <p><strong className="text-stone-900">Every AI failure is a lesson</strong> — document it, learn from it, prevent it next time</p>
                </div>
                <div className="flex gap-4">
                  <span className="text-primary-600 font-bold text-xl">✓</span>
                  <p><strong className="text-stone-900">Testing should be simple</strong> — if it's complicated, nobody will do it</p>
                </div>
                <div className="flex gap-4">
                  <span className="text-primary-600 font-bold text-xl">✓</span>
                  <p><strong className="text-stone-900">Knowledge should be shared</strong> — keeping AI safety secrets doesn't help anyone</p>
                </div>
                <div className="flex gap-4">
                  <span className="text-primary-600 font-bold text-xl">✓</span>
                  <p><strong className="text-stone-900">Prevention beats reaction</strong> — catch issues before they reach customers</p>
                </div>
                <div className="flex gap-4">
                  <span className="text-primary-600 font-bold text-xl">✓</span>
                  <p><strong className="text-stone-900">Small teams can build safely</strong> — you don't need a 50-person safety team</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Work */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
              <h2 className="text-3xl font-bold text-stone-900 mb-6">What We're Building</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-stone-900 mb-3">📚 The Failure Database</h3>
                  <p className="text-stone-700 mb-2">
                    500+ documented AI failures with root causes, business impact, and prevention strategies. The most comprehensive public collection of AI incidents anywhere.
                  </p>
                  <Link href="/failures" className="text-primary-600 hover:text-primary-700 font-semibold">
                    Browse the database →
                  </Link>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-stone-900 mb-3">🎯 The Risk Quiz</h3>
                  <p className="text-stone-700 mb-2">
                    Free 5-minute assessment that identifies your biggest AI vulnerabilities based on 1,000+ real-world failure patterns.
                  </p>
                  <Link href="/quiz" className="text-primary-600 hover:text-primary-700 font-semibold">
                    Take the quiz →
                  </Link>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-stone-900 mb-3">📖 Testing Playbooks</h3>
                  <p className="text-stone-700 mb-2">
                    Step-by-step guides for hallucination detection, prompt injection testing, security audits, and more — written for developers, not researchers.
                  </p>
                  <Link href="/blog" className="text-primary-600 hover:text-primary-700 font-semibold">
                    Read the guides →
                  </Link>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-stone-900 mb-3">🔍 The Glossary</h3>
                  <p className="text-stone-700 mb-2">
                    Plain-English definitions of 20+ AI safety terms with real examples. No jargon, no academic papers — just clear explanations.
                  </p>
                  <Link href="/glossary" className="text-primary-600 hover:text-primary-700 font-semibold">
                    Explore the glossary →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 bg-gradient-to-b from-stone-100 to-primary-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-stone-900 mb-6">Join the Movement</h2>
            <p className="text-xl text-stone-600 mb-8 leading-relaxed">
              We're building a community of founders, developers, and product leaders who care about deploying AI safely.
            </p>
            
            <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-8">
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div>
                  <div className="text-4xl font-bold text-primary-600 mb-2">250+</div>
                  <div className="text-stone-600">AI teams trust us</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary-600 mb-2">1,000+</div>
                  <div className="text-stone-600">Risk assessments completed</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary-600 mb-2">100%</div>
                  <div className="text-stone-600">Free resources</div>
                </div>
              </div>

              <Link 
                href="/quiz"
                className="inline-block bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl text-lg"
              >
                Start Your Free Risk Assessment →
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl text-lg"
              >
                Request a Service
              </Link>
              <a 
                href="https://www.linkedin.com/in/leon-melamud" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border-2 border-primary-600 text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 transition-colors text-lg"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Connect on LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-300 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="text-white font-bold mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><Link href="/quiz" className="hover:text-white transition-colors">AI Risk Quiz</Link></li>
                  <li><Link href="/failures" className="hover:text-white transition-colors">Failures Database</Link></li>
                  <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                  <li><Link href="/glossary" className="hover:text-white transition-colors">Glossary</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-white font-bold mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                  <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                  <li><a href="https://www.linkedin.com/in/leon-melamud" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-bold mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-bold mb-4">InspectAgents</h3>
                <p className="text-sm">
                  Making AI agent testing accessible, practical, and transparent for every business.
                </p>
              </div>
            </div>

            <div className="border-t border-stone-700 pt-8 text-center text-sm">
              <p>&copy; {new Date().getFullYear()} InspectAgents. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
      </main>
  );
}
