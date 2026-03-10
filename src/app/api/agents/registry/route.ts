/**
 * Agent Registry API
 *
 * GET  /api/agents/registry — list all agents with type/endpoint info
 * POST /api/agents/registry — register a new Agent Zero node
 */

import { NextRequest, NextResponse } from 'next/server';
import { getRegisteredAgents, registerAgent, pingAgentZero } from '@/lib/agent-registry';
import type { AgentType } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const workspaceId = request.nextUrl.searchParams.get('workspace_id') || undefined;
    const agents = getRegisteredAgents(workspaceId);

    return NextResponse.json(
      agents.map((a) => ({
        id: a.id,
        name: a.name,
        role: a.role,
        agent_type: a.agent_type,
        endpoint_url: a.endpoint_url || null,
        status: a.status,
        workspace_id: a.workspace_id,
        created_at: a.created_at,
      })),
    );
  } catch (error) {
    console.error('Failed to list registry:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

interface RegisterRequest {
  name: string;
  role: string;
  description?: string;
  avatar_emoji?: string;
  agent_type: AgentType;
  endpoint_url?: string;
  api_key?: string;
  workspace_id?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json();

    if (!body.name || !body.role) {
      return NextResponse.json({ error: 'name and role are required' }, { status: 400 });
    }

    if (body.agent_type === 'agent_zero' && !body.endpoint_url) {
      return NextResponse.json(
        { error: 'endpoint_url is required for Agent Zero nodes' },
        { status: 400 },
      );
    }

    const agent = registerAgent({
      name: body.name,
      role: body.role,
      description: body.description,
      avatar_emoji: body.avatar_emoji,
      agent_type: body.agent_type || 'openclaw',
      endpoint_url: body.endpoint_url,
      api_key: body.api_key,
      workspace_id: body.workspace_id,
    });

    // Ping Agent Zero nodes to verify connectivity
    if (agent.agent_type === 'agent_zero') {
      await pingAgentZero(agent.id);
    }

    return NextResponse.json(agent, { status: 201 });
  } catch (error) {
    console.error('Failed to register agent:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
