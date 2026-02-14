'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { failures } from './data';
import type { AIFailure } from './types';

export default function FailuresPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  // Get unique values for filters
  const categories = useMemo(() => {
    return Array.from(new Set(failures.map(f => f.category))).sort();
  }, []);

  const severities: Array<'Low' | 'Medium' | 'High' | 'Critical'> = ['Low', 'Medium', 'High', 'Critical'];

  const dateRange = useMemo(() => {
    const dates = failures.map(f => f.date).sort();
    return { min: dates[0], max: dates[dates.length - 1] };
  }, []);

  const years = useMemo(() => {
    return Array.from(new Set(failures.map(f => new Date(f.date).getFullYear()))).sort((a, b) => b - a);
  }, []);

  // Filter failures based on search and filters
  const filteredFailures = useMemo(() => {
    return failures.filter(failure => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        failure.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        failure.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        failure.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        failure.impact.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory = selectedCategory === 'all' || failure.category === selectedCategory;

      // Severity filter
      const matchesSeverity = selectedSeverity === 'all' || failure.severity === selectedSeverity;

      // Date range filter
      const matchesDateFrom = !dateFrom || failure.date >= dateFrom;
      const matchesDateTo = !dateTo || failure.date <= dateTo;

      return matchesSearch && matchesCategory && matchesSeverity && matchesDateFrom && matchesDateTo;
    });
  }, [searchQuery, selectedCategory, selectedSeverity, dateFrom, dateTo]);

  // Severity color mapping
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Medium': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-stone-100 text-stone-800 border-stone-300';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Hallucination': 'bg-purple-100 text-purple-800',
      'Prompt Injection': 'bg-red-100 text-red-800',
      'Security': 'bg-blue-100 text-blue-800',
      'Bias': 'bg-pink-100 text-pink-800',
      'Jailbreak': 'bg-orange-100 text-orange-800',
      'Misinformation': 'bg-yellow-100 text-yellow-800',
      'Privacy': 'bg-indigo-100 text-indigo-800',
      'Safety': 'bg-red-100 text-red-800'
    };
    return colors[category] || 'bg-stone-100 text-stone-800';
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-gradient-to-b from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              AI Failures Database
            </h1>
            <p className="text-xl text-primary-50 max-w-3xl mx-auto mb-6">
              A comprehensive, searchable collection of real AI incidents, failures, and disasters. Learn from what went wrong.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-primary-50">
              <div className="text-center">
                <div className="text-3xl font-bold">{failures.length}</div>
                <div className="text-sm">Documented Failures</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{categories.length}</div>
                <div className="text-sm">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{years.length}</div>
                <div className="text-sm">Years Covered</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-b border-stone-200 sticky top-0 z-10 shadow-sm" data-agent-tool="search_failures" data-agent-description="Search and filter AI failures database">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search failures by company, incident, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-agent-field="query"
                data-agent-description="Free-text search across title, company, description, impact"
                className="w-full px-4 py-3 pl-12 border-2 border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
              />
              <svg className="absolute left-4 top-3.5 h-5 w-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                data-agent-field="category"
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Severity Filter */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Severity
              </label>
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                data-agent-field="severity"
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
              >
                <option value="all">All Severities</option>
                {severities.map(sev => (
                  <option key={sev} value={sev}>{sev}</option>
                ))}
              </select>
            </div>

            {/* Date From Filter */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                From Date
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                min={dateRange.min}
                max={dateTo || dateRange.max}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
              />
            </div>

            {/* Date To Filter */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                To Date
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                min={dateFrom || dateRange.min}
                max={dateRange.max}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
              />
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-stone-600">
            Showing <span className="font-semibold">{filteredFailures.length}</span> of {failures.length} failures
            {(searchQuery || selectedCategory !== 'all' || selectedSeverity !== 'all' || dateFrom || dateTo) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedSeverity('all');
                  setDateFrom('');
                  setDateTo('');
                }}
                className="ml-4 text-primary-600 hover:text-primary-700 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Failures Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredFailures.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-stone-600 text-lg">No failures match your search criteria.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedSeverity('all');
                setDateFrom('');
                setDateTo('');
              }}
              className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
            >
              Clear filters to see all failures
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredFailures.map(failure => (
              <div
                key={failure.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-stone-200 p-6"
              >
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-2xl font-bold text-stone-900 mb-2">
                      {failure.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-stone-600">
                      <span className="font-medium">{failure.company}</span>
                      <span>•</span>
                      <span>{new Date(failure.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(failure.category)}`}>
                      {failure.category}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(failure.severity)}`}>
                      {failure.severity}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-stone-700 mb-4">
                  {failure.description}
                </p>

                {/* Impact */}
                <div className="mb-4">
                  <h4 className="font-semibold text-stone-900 mb-2">Impact:</h4>
                  <p className="text-stone-700">{failure.impact}</p>
                  {failure.cost && (
                    <p className="text-red-600 font-semibold mt-2">
                      💰 Cost: {failure.cost}
                    </p>
                  )}
                </div>

                {/* Prevention Tips */}
                <div className="mb-4">
                  <h4 className="font-semibold text-stone-900 mb-2">How to Prevent:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {failure.prevention.map((tip, idx) => (
                      <li key={idx} className="text-stone-700 text-sm">{tip}</li>
                    ))}
                  </ul>
                </div>

                {/* Source */}
                <div className="pt-4 border-t border-stone-200">
                  <a
                    href={failure.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 font-medium text-sm inline-flex items-center"
                  >
                    <span>Source: {failure.source}</span>
                    <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Don't Let Your Company Be the Next Case Study
          </h2>
          <p className="text-xl text-primary-50 mb-6">
            Take our 2-minute quiz to identify your AI risks before they become failures.
          </p>
          <Link
            href="/quiz"
            className="inline-block bg-white text-primary-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-50 transition-colors shadow-lg"
          >
            Assess Your AI Risks Now →
          </Link>
          <p className="mt-4 text-sm text-primary-100">
            Join 1,000+ teams proactively managing AI safety
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-stone-400">
            <p className="mb-2">
              Database compiled and maintained by <Link href="/" className="text-primary-400 hover:text-primary-300">InspectAgents.com</Link>
            </p>
            <p className="text-sm">
              Know of an AI failure we should add? <a href="mailto:hello@inspectagents.com" className="text-primary-400 hover:text-primary-300">Contact us</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
