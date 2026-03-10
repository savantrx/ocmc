'use client';

import { Workflow, Clock, Webhook, Plug, GitBranch } from 'lucide-react';

const sections = [
  {
    icon: Clock,
    title: 'Cron Jobs',
    description: 'Schedule recurring tasks and agent workflows on a timer.',
    status: 'Planned',
  },
  {
    icon: Webhook,
    title: 'Webhooks',
    description: 'Trigger agent actions from external events and API calls.',
    status: 'Planned',
  },
  {
    icon: Plug,
    title: 'n8n / Windmill Integrations',
    description: 'Connect to existing automation platforms for complex orchestration.',
    status: 'Planned',
  },
  {
    icon: GitBranch,
    title: 'Spawn Logic',
    description: 'Define rules for automatic sub-agent creation and task delegation.',
    status: 'Planned',
  },
];

export function AutomationPage() {
  return (
    <div className="min-h-screen bg-mc-bg text-mc-text">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <Workflow className="w-8 h-8 text-mc-accent" />
            <h1 className="text-3xl font-display font-bold">Automations & Integrations</h1>
          </div>
          <p className="text-mc-text-secondary text-lg">Coming Soon</p>
          <p className="text-mc-text-secondary mt-2 max-w-xl mx-auto">
            Automate agent workflows with scheduled jobs, webhooks, and third-party integrations.
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
