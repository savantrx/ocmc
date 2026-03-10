/**
 * Agent Registry Manager
 *
 * Manages the registration, lookup, and status of agents,
 * with support for both OpenClaw and Agent Zero agent types.
 */

import { v4 as uuidv4 } from 'uuid';
import { queryAll, queryOne, run } from '@/lib/db';
import { encryptApiKey } from '@/lib/crypto';
import type { Agent, AgentType } from '@/lib/types';

export interface RegisterAgentInput {
  name: string;
  role: string;
  description?: string;
  avatar_emoji?: string;
  agent_type: AgentType;
  endpoint_url?: string;
  api_key?: string;
  workspace_id?: string;
}

/**
 * Get all registered agents with their type and endpoint info.
 */
export function getRegisteredAgents(workspaceId?: string): Agent[] {
  if (workspaceId) {
    return queryAll<Agent>(
      'SELECT * FROM agents WHERE workspace_id = ? ORDER BY agent_type, name',
      [workspaceId],
    );
  }
  return queryAll<Agent>(
    'SELECT * FROM agents ORDER BY agent_type, name',
  );
}

/**
 * Get only Agent Zero agents.
 */
export function getAgentZeroAgents(workspaceId?: string): Agent[] {
  if (workspaceId) {
    return queryAll<Agent>(
      "SELECT * FROM agents WHERE agent_type = 'agent_zero' AND workspace_id = ? ORDER BY name",
      [workspaceId],
    );
  }
  return queryAll<Agent>(
    "SELECT * FROM agents WHERE agent_type = 'agent_zero' ORDER BY name",
  );
}

/**
 * Register a new agent (OpenClaw or Agent Zero).
 */
export function registerAgent(input: RegisterAgentInput): Agent {
  const id = uuidv4();
  const now = new Date().toISOString();

  let apiKeyEncrypted: string | null = null;
  if (input.api_key) {
    apiKeyEncrypted = encryptApiKey(input.api_key);
  }

  run(
    `INSERT INTO agents (id, name, role, description, avatar_emoji, status, is_master, workspace_id, agent_type, endpoint_url, api_key_encrypted, source, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, 'standby', 0, ?, ?, ?, ?, 'local', ?, ?)`,
    [
      id,
      input.name,
      input.role,
      input.description || null,
      input.avatar_emoji || '🤖',
      input.workspace_id || 'default',
      input.agent_type,
      input.endpoint_url || null,
      apiKeyEncrypted,
      now,
      now,
    ],
  );

  return queryOne<Agent>('SELECT * FROM agents WHERE id = ?', [id])!;
}

/**
 * Update an agent's status after pinging its endpoint.
 */
export async function pingAgentZero(agentId: string): Promise<'online' | 'offline'> {
  const agent = queryOne<Agent>('SELECT * FROM agents WHERE id = ?', [agentId]);
  if (!agent || agent.agent_type !== 'agent_zero' || !agent.endpoint_url) {
    return 'offline';
  }

  try {
    const healthUrl = agent.endpoint_url.replace(/\/$/, '') + '/';
    const res = await fetch(healthUrl, {
      method: 'GET',
      signal: AbortSignal.timeout(5000),
    });

    const status = res.ok ? 'online' : 'offline';
    const now = new Date().toISOString();
    run(
      'UPDATE agents SET status = ?, updated_at = ? WHERE id = ?',
      [status === 'online' ? 'standby' : 'offline', now, agentId],
    );
    return status;
  } catch {
    const now = new Date().toISOString();
    run(
      "UPDATE agents SET status = 'offline', updated_at = ? WHERE id = ?",
      [now, agentId],
    );
    return 'offline';
  }
}

/**
 * Remove an agent (soft delete — sets status to offline).
 */
export function removeAgent(agentId: string): void {
  const now = new Date().toISOString();
  run(
    "UPDATE agents SET status = 'offline', updated_at = ? WHERE id = ?",
    [now, agentId],
  );
}
