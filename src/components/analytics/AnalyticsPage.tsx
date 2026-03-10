'use client';

import { BarChart3, History, CreditCard, Gauge, Server } from 'lucide-react';

const sections = [
  {
    icon: History,
    title: 'Session History',
    description: 'Review past agent sessions, conversations, and decision traces.',
    status: 'Planned',
  },
  {
    icon: CreditCard,
    title: 'API Billing',
    description: 'Track token usage, API costs, and budget allocation across agents.',
    status: 'Planned',
  },
  {
    icon: Gauge,
    title: 'Agent Efficiency',
    description: 'Measure task completion rates, response times, and quality scores.',
    status: 'Planned',
  },
  {
    icon: Server,
    title: 'VPS Health',
    description: 'Monitor infrastructure health, uptime, and resource utilization.',
    status: 'Planned',
  },
];

export function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-mc-bg text-mc-text">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <BarChart3 className="w-8 h-8 text-mc-accent" />
            <h1 className="text-3xl font-display font-bold">Analytics & Monitoring</h1>
          </div>
          <p className="text-mc-text-secondary text-lg">Coming Soon</p>
          <p className="text-mc-text-secondary mt-2 max-w-xl mx-auto">
            Monitor agent performance, track costs, and gain insights into your AI workforce.
          </p>
        </div>

        <div className="space-y-4">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div
                key={section.title}
                className="flex items-start gap-4 p-6 bg-mc-bg-secondary border border-mc-border rounded-lg opacity-60 cursor-not-allowed"
              >
                <div className="p-2 bg-mc-bg-tertiary rounded-lg shrink-0">
                  <Icon className="w-6 h-6 text-mc-accent" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-medium text-lg">{section.title}</h3>
                    <span className="text-xs px-2 py-0.5 bg-mc-accent-yellow/20 text-mc-accent-yellow rounded uppercase">
                      {section.status}
                    </span>
                  </div>
                  <p className="text-mc-text-secondary text-sm">{section.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
