'use client';

import { ShoppingBag, Search, Star, Download } from 'lucide-react';

const placeholderSkills = [
  { name: 'Web Scraper Pro', category: 'Data Collection', rating: 4.8, downloads: '2.3k', emoji: '🕷️' },
  { name: 'Code Reviewer', category: 'Development', rating: 4.9, downloads: '5.1k', emoji: '🔍' },
  { name: 'Email Composer', category: 'Communication', rating: 4.6, downloads: '1.8k', emoji: '✉️' },
  { name: 'Data Analyst', category: 'Analytics', rating: 4.7, downloads: '3.4k', emoji: '📊' },
  { name: 'API Integrator', category: 'Infrastructure', rating: 4.5, downloads: '1.2k', emoji: '🔗' },
  { name: 'Content Writer', category: 'Marketing', rating: 4.8, downloads: '4.7k', emoji: '✍️' },
];

export function MarketplacePage() {
  return (
    <div className="min-h-screen bg-mc-bg text-mc-text">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <ShoppingBag className="w-8 h-8 text-mc-accent" />
            <h1 className="text-3xl font-display font-bold">Agent Skills Marketplace</h1>
          </div>
          <p className="text-mc-text-secondary text-lg">Coming Soon</p>
          <p className="text-mc-text-secondary mt-2 max-w-xl mx-auto">
            Discover and install pre-built skills, workflows, and integrations for your AI agents.
          </p>
        </div>

        <div className="relative max-w-xl mx-auto mb-12">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-mc-text-secondary" />
          <input
            type="text"
            placeholder="Search skills, workflows, integrations..."
            disabled
            className="w-full pl-12 pr-4 py-3 bg-mc-bg-secondary border border-mc-border rounded-lg text-mc-text placeholder:text-mc-text-secondary opacity-50 cursor-not-allowed"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {placeholderSkills.map((skill) => (
            <div
              key={skill.name}
              className="p-5 bg-mc-bg-secondary border border-mc-border rounded-lg opacity-60 cursor-not-allowed"
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">{skill.emoji}</span>
                <div>
                  <h3 className="font-medium">{skill.name}</h3>
                  <span className="text-xs text-mc-text-secondary">{skill.category}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-mc-text-secondary">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-mc-accent-yellow" />
                  <span>{skill.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="w-3 h-3" />
                  <span>{skill.downloads}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
