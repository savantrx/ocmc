/**
 * Agent Zero Client
 *
 * Dispatches tasks to Agent Zero nodes via the A2A (Agent-to-Agent) protocol.
 * Agent Zero exposes a POST endpoint that accepts a message and streams
 * SSE chunks back with thoughts, tool calls, and final text output.
 */

import { v4 as uuidv4 } from 'uuid';
import { run } from '@/lib/db';
import { broadcast } from '@/lib/events';
import type { AgentZeroSSEChunk, TaskActivity } from '@/lib/types';

export interface DispatchResult {
  success: boolean;
  error?: string;
  finalText?: string;
}

/**
 * Dispatch a task message to an Agent Zero endpoint.
 * Streams SSE response, logs activities, and broadcasts events in real-time.
 */
export async function dispatchToAgentZero(
  endpointUrl: string,
  apiKey: string,
  taskId: string,
  agentId: string,
  taskMessage: string,
  reset = false,
): Promise<DispatchResult> {
  const a2aUrl = endpointUrl.replace(/\/$/, '') + '/a2a';

  let response: Response;
  try {
    response = await fetch(a2aUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ message: taskMessage, reset }),
    });
  } catch (err) {
    return { success: false, error: `Failed to connect to Agent Zero at ${a2aUrl}: ${(err as Error).message}` };
  }

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    return { success: false, error: `Agent Zero returned ${response.status}: ${text}` };
  }

  if (!response.body) {
    return { success: false, error: 'Agent Zero returned no response body' };
  }

  // Stream SSE chunks and log activities
  let finalText = '';
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Parse SSE lines
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep incomplete line in buffer

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;

        const data = line.slice(6).trim();
        if (!data || data === '[DONE]') continue;

        try {
          const chunk: AgentZeroSSEChunk = JSON.parse(data);
          logChunkActivity(chunk, taskId, agentId);

          if (chunk.text) {
            finalText += chunk.text;
          }
        } catch {
          // Skip malformed JSON chunks
        }
      }
    }
  } catch (err) {
    return { success: false, error: `Stream read error: ${(err as Error).message}` };
  }

  return { success: true, finalText };
}

/**
 * Log an SSE chunk as a task activity and broadcast it.
 */
function logChunkActivity(chunk: AgentZeroSSEChunk, taskId: string, agentId: string): void {
  const now = new Date().toISOString();

  let activityType: string = 'updated';
  let message = '';

  if (chunk.thoughts && chunk.thoughts.length > 0) {
    message = `💭 ${chunk.thoughts.join(' → ')}`;
  } else if (chunk.tool_name) {
    const args = chunk.tool_args ? JSON.stringify(chunk.tool_args) : '';
    message = `🔧 Tool: ${chunk.tool_name}${args ? ` — ${args.slice(0, 200)}` : ''}`;
  } else if (chunk.text) {
    activityType = 'completed';
    message = `📝 ${chunk.text.slice(0, 500)}`;
  } else {
    return; // Nothing to log
  }

  const activityId = uuidv4();
  run(
    `INSERT INTO task_activities (id, task_id, agent_id, activity_type, message, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [activityId, taskId, agentId, activityType, message, now]
  );

  // Broadcast so LiveFeed picks it up
  const activity: TaskActivity = {
    id: activityId,
    task_id: taskId,
    agent_id: agentId,
    activity_type: activityType as TaskActivity['activity_type'],
    message,
    created_at: now,
  };

  broadcast({ type: 'activity_logged', payload: activity });
}
