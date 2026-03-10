/**
 * A2A Bridge API Route
 *
 * Proxies task messages to Agent Zero nodes via the A2A protocol.
 * Looks up the agent's endpoint and decrypted API key, dispatches
 * the message, and returns the result.
 */

import { NextRequest, NextResponse } from 'next/server';
import { queryOne } from '@/lib/db';
import { dispatchToAgentZero } from '@/lib/agent-zero/client';
import { decryptApiKey } from '@/lib/crypto';
import type { Agent } from '@/lib/types';

export const dynamic = 'force-dynamic';

interface A2ABridgeRequest {
  agentId: string;
  taskId: string;
  message: string;
  reset?: boolean;
}

/**
 * POST /api/a2a-bridge
 *
 * Dispatches a message to an Agent Zero node and returns the result.
 * Activities are logged and broadcast in real-time by the client module.
 */
export async function POST(request: NextRequest) {
  try {
    const body: A2ABridgeRequest = await request.json();

    if (!body.agentId || !body.taskId || !body.message) {
      return NextResponse.json(
        { error: 'agentId, taskId, and message are required' },
        { status: 400 },
      );
    }

    // Look up agent
    const agent = queryOne<Agent>(
      'SELECT * FROM agents WHERE id = ?',
      [body.agentId],
    );

    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    if (agent.agent_type !== 'agent_zero') {
      return NextResponse.json(
        { error: 'Agent is not an Agent Zero node' },
        { status: 400 },
      );
    }

    if (!agent.endpoint_url) {
      return NextResponse.json(
        { error: 'Agent has no endpoint URL configured' },
        { status: 400 },
      );
    }

    if (!agent.api_key_encrypted) {
      return NextResponse.json(
        { error: 'Agent has no API key configured' },
        { status: 400 },
      );
    }

    // Decrypt API key
    let apiKey: string;
    try {
      apiKey = decryptApiKey(agent.api_key_encrypted);
    } catch {
      return NextResponse.json(
        { error: 'Failed to decrypt agent API key' },
        { status: 500 },
      );
    }

    // Dispatch to Agent Zero
    const result = await dispatchToAgentZero(
      agent.endpoint_url,
      apiKey,
      body.taskId,
      body.agentId,
      body.message,
      body.reset ?? false,
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 502 },
      );
    }

    return NextResponse.json({
      success: true,
      finalText: result.finalText,
    });
  } catch (error) {
    console.error('A2A bridge error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
