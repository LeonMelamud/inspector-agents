'use client';

import { useState } from 'react';
import Link from 'next/link';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [refNumber, setRefNumber] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setErrorMsg(data.error || 'Something went wrong. Please try again.');
        return;
      }

      setStatus('success');
      setRefNumber(data.refNumber || '');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
      setErrorMsg('Network error. Please check your connection and try again.');
    }
  }

  return (
    <main className="min-h-screen bg-stone-100">
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-50 to-stone-100 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-stone-900 mb-6 leading-tight">
              Request a Service
            </h1>
            <p className="text-xl text-stone-600 leading-relaxed mb-4">
              We're currently <span className="font-semibold text-amber-600">fully booked for this month</span> as
              we focus on educating the next generation of AI inspectors.
            </p>
            <p className="text-lg text-stone-600 leading-relaxed">
              But we're always looking ahead — leave a service request below and
              we'll reach out as soon as capacity opens up.
            </p>
          </div>
        </div>
      </section>

      {/* Status banner */}
      <section className="py-0">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto -mt-4 mb-8">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-4">
              <span className="text-2xl flex-shrink-0 mt-0.5">📅</span>
              <div>
                <p className="font-semibold text-amber-800 mb-1">
                  February 2026 — Fully Booked
                </p>
                <p className="text-amber-700 text-sm leading-relaxed">
                  Our team is currently running hands-on AI safety workshops and training
                  programs for enterprise teams. We're investing in building the next
                  wave of certified AI inspectors so we can serve more clients in the
                  coming months.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form + sidebar */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10">
            {/* Form */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-8 md:p-10">
                <h2 className="text-2xl font-bold text-stone-900 mb-6">
                  Leave a Service Request
                </h2>

                {status === 'success' ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                    <div className="text-4xl mb-3">✅</div>
                    <h3 className="text-xl font-bold text-green-800 mb-2">Request Received!</h3>
                    {refNumber && (
                      <div className="bg-white border border-green-200 rounded-lg px-4 py-3 mb-4 inline-block">
                        <p className="text-xs text-stone-500 uppercase tracking-wider mb-1">Your Reference Number</p>
                        <p className="text-xl font-mono font-bold text-primary-600">{refNumber}</p>
                      </div>
                    )}
                    <p className="text-green-700 mb-4">
                      Thanks for reaching out. We&apos;ll review your request and get back to
                      you within 24 hours. A confirmation email has been sent to your inbox.
                    </p>
                    <button
                      type="button"
                      onClick={() => setStatus('idle')}
                      className="text-primary-600 hover:text-primary-700 font-semibold"
                    >
                      Send another request
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {status === 'error' && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
                        {errorMsg}
                      </div>
                    )}

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-1.5">
                          Your Name
                        </label>
                        <input
                          id="name"
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                          placeholder="Jane Smith"
                          className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-stone-900 placeholder:text-stone-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1.5">
                          Work Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="email"
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                          placeholder="jane@company.com"
                          className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-stone-900 placeholder:text-stone-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-stone-700 mb-1.5">
                        What do you need help with?
                      </label>
                      <select
                        id="subject"
                        value={form.subject}
                        onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                        className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-stone-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors"
                      >
                        <option value="">Select a service...</option>
                        <option value="AI Agent Safety Audit">AI Agent Safety Audit</option>
                        <option value="Prompt Injection Testing">Prompt Injection Testing</option>
                        <option value="Hallucination Detection Setup">Hallucination Detection Setup</option>
                        <option value="AI Testing Strategy Consulting">AI Testing Strategy Consulting</option>
                        <option value="Team Training & Workshops">Team Training &amp; Workshops</option>
                        <option value="Custom Integration">Custom Integration</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-1.5">
                        Tell us about your project <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        required
                        rows={5}
                        minLength={10}
                        value={form.message}
                        onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                        placeholder="Describe your AI agent setup, what you're worried about, and how we can help..."
                        className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-stone-900 placeholder:text-stone-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors resize-y"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-8 py-3 text-white font-semibold hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-xl"
                    >
                      {status === 'submitting' ? (
                        <>
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Sending…
                        </>
                      ) : (
                        'Submit Service Request'
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Direct contact */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-stone-900 mb-4">Direct Contact</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <span className="text-lg">📧</span>
                    <div>
                      <div className="font-medium text-stone-700">Email</div>
                      <a
                        href="mailto:leonmelamud@gmail.com"
                        className="text-primary-600 hover:text-primary-700 break-all"
                      >
                        leonmelamud@gmail.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-lg">💼</span>
                    <div>
                      <div className="font-medium text-stone-700">LinkedIn</div>
                      <a
                        href="https://www.linkedin.com/in/leon-melamud"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700"
                      >
                        Leon Melamud
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* What to expect */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-stone-900 mb-4">What to Expect</h3>
                <ol className="space-y-3 text-sm text-stone-700">
                  <li className="flex items-start gap-3">
                    <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-xs font-bold">1</span>
                    <span>We acknowledge your request within 24 hours</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-xs font-bold">2</span>
                    <span>We schedule a 15-min discovery call when capacity opens</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-xs font-bold">3</span>
                    <span>You get a tailored proposal with a clear scope & timeline</span>
                  </li>
                </ol>
              </div>

              {/* Free resources */}
              <div className="bg-primary-50 rounded-xl p-6 border border-primary-100">
                <h3 className="text-lg font-bold text-stone-900 mb-3">Can't Wait?</h3>
                <p className="text-sm text-stone-600 mb-4">
                  Start assessing your AI risk right now — for free.
                </p>
                <div className="space-y-2">
                  <Link
                    href="/quiz"
                    className="block w-full rounded-lg bg-primary-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
                  >
                    Take the Risk Quiz
                  </Link>
                  <Link
                    href="/checklist"
                    className="block w-full rounded-lg border border-primary-300 px-4 py-2.5 text-center text-sm font-semibold text-primary-700 hover:bg-primary-100 transition-colors"
                  >
                    Download the Checklist
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
