import { useState } from 'react';
import { FLOODING_WORDS, CRISIS_WORDS } from '../constants/data';
import { UserMemory } from './useAppState';

const API_URL = 'https://api.anthropic.com/v1/messages';
const API_KEY = 'YOUR_API_KEY_HERE';

// Only pass the last N messages to keep token cost flat regardless of session length
const HISTORY_WINDOW = 6;

const SUMMARISE_SYSTEM = `You are a session memory assistant for Tether, a relationship wellness app.
Given a conversation and a previous summary, produce a concise updated summary in plain text.
Structure it exactly like this (fill in each line, keep each to 1-2 sentences max):

Core emotion: [what the user is feeling and why]
Trigger: [the specific event or pattern that caused this]
Patterns: [attachment or conflict patterns observed]
Insights: [any realisations or shifts the user has had — leave blank if none yet]
Current state: [where the user is emotionally right now]

Total output must be under 120 words. Return only the structured summary — no preamble, no commentary.`;

const MEMORY_SYSTEM = `You are a long-term memory builder for Tether, a relationship wellness app.
After each session, you update a persistent memory of this person — who they are emotionally, what patterns recur, how they are growing, and what remains unresolved.

Given the session summary and the previous memory, return a JSON object with exactly these fields:
{
  "narrative": "A 3-5 sentence narrative about this person — their core emotional patterns, attachment style in action, recurring triggers, and where they are in their growth journey. Written in third person. Used verbatim as AI context.",
  "recurringThemes": ["theme 1", "theme 2"],
  "growthMoments": ["specific positive shift observed", "..."]
}

Rules:
- narrative must be under 150 words
- recurringThemes: max 5, short phrases only (e.g. "fear of abandonment", "stonewalling under pressure")
- growthMoments: only add genuinely new positive shifts observed in THIS session — cumulative across sessions
- If this is the first session, build from scratch
- Return ONLY valid JSON, no commentary`;

const CHECKIN_SYSTEM = `You are the opening voice of Tether, a relationship wellness app.
Based on what you know about this person and their last session, generate a single warm, specific check-in question to open the new session.

The question should:
- Reference something specific from their last session or a recurring theme
- Feel like continuity, not a cold start
- Be gentle and open — not leading or assumptive
- Be one sentence only

Return only the question, nothing else.`;

interface UseClaudeOptions {
  systemPrompt: string;
  userProfile: {
    name: string;
    attachment: string;
    love: string;
    conflict: string;
    window: string;
    need: string;
  };
  userMemory?: UserMemory | null;
}

export function useClaude({ systemPrompt, userProfile, userMemory }: UseClaudeOptions) {
  const [loading, setLoading] = useState(false);
  const [floodingDetected, setFloodingDetected] = useState(false);
  const [crisisDetected, setCrisisDetected] = useState(false);

  const buildSystem = (summary?: string) => {
    let system = systemPrompt;

    system +=
      '\n\nUser profile:' +
      '\n- Name: ' + (userProfile.name || 'unknown') +
      '\n- Attachment: ' + (userProfile.attachment || 'unknown') +
      '\n- Love language: ' + (userProfile.love || 'unknown') +
      '\n- Conflict style: ' + (userProfile.conflict || 'unknown') +
      '\n- Body response: ' + (userProfile.window || 'unknown') +
      '\n- Core need: ' + (userProfile.need || 'unknown');

    if (userMemory?.narrative) {
      system +=
        '\n\nLong-term memory (who this person is across sessions — use to personalise and avoid repeating ground):\n' +
        userMemory.narrative;
      if (userMemory.recurringThemes?.length) {
        system += '\nRecurring themes: ' + userMemory.recurringThemes.join(', ');
      }
    }

    if (summary) {
      system +=
        '\n\nSession summary (what this person has shared so far — use this to stay coherent without re-asking):\n' +
        summary;
    }

    return system;
  };

  const send = async (
    userText: string,
    history: { role: 'user' | 'assistant'; content: string }[],
    summary?: string,
  ): Promise<string> => {
    const lower = userText.toLowerCase();
    setFloodingDetected(FLOODING_WORDS.some((w) => lower.includes(w)));
    setCrisisDetected(CRISIS_WORDS.some((w) => lower.includes(w)));
    setLoading(true);

    if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
      await new Promise((r) => setTimeout(r, 1200));
      setLoading(false);
      return getFallback(systemPrompt);
    }

    // Only send the last HISTORY_WINDOW messages — summary covers the rest
    const windowedHistory = history.slice(-HISTORY_WINDOW);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 600,
          system: buildSystem(summary),
          messages: [...windowedHistory, { role: 'user', content: userText }],
        }),
      });
      const data = await response.json();
      setLoading(false);
      return data.content?.[0]?.text || "I'm here with you. Can you tell me more?";
    } catch {
      setLoading(false);
      return getFallback(systemPrompt);
    }
  };

  // Called after each exchange to compress the session into a rolling summary.
  // Uses Haiku (cheapest model) — small input, small output.
  const summarise = async (
    history: { role: 'user' | 'assistant'; content: string }[],
    previousSummary?: string,
  ): Promise<string> => {
    if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') return previousSummary || '';

    // Only summarise user messages to keep it focused and cheap
    const userMessages = history
      .filter((m) => m.role === 'user')
      .map((m) => m.content)
      .join('\n---\n');

    if (!userMessages.trim()) return previousSummary || '';

    const contextMsg = previousSummary
      ? `Previous summary:\n${previousSummary}\n\nNew messages to incorporate:\n${userMessages}`
      : `Messages to summarise:\n${userMessages}`;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 200,
          system: SUMMARISE_SYSTEM,
          messages: [{ role: 'user', content: contextMsg }],
        }),
      });
      const data = await response.json();
      return data.content?.[0]?.text || previousSummary || '';
    } catch {
      return previousSummary || '';
    }
  };

  // Called when a session is resolved. Builds/updates the cross-session user memory.
  const generateMemoryUpdate = async (
    sessionSummary: string,
    previousMemory?: UserMemory | null,
  ): Promise<UserMemory | null> => {
    if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') return null;
    if (!sessionSummary.trim()) return null;

    const contextMsg = previousMemory?.narrative
      ? `Previous memory:\n${previousMemory.narrative}\n\nRecurring themes: ${(previousMemory.recurringThemes || []).join(', ')}\nGrowth moments: ${(previousMemory.growthMoments || []).join('; ')}\n\nNew session summary:\n${sessionSummary}`
      : `First session summary:\n${sessionSummary}`;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 400,
          system: MEMORY_SYSTEM,
          messages: [{ role: 'user', content: contextMsg }],
        }),
      });
      const data = await response.json();
      const text = data.content?.[0]?.text || '';
      const parsed = JSON.parse(text);
      return {
        narrative: parsed.narrative || '',
        recurringThemes: parsed.recurringThemes || [],
        growthMoments: [
          ...(previousMemory?.growthMoments || []),
          ...(parsed.growthMoments || []),
        ].slice(0, 20),
        sessionCount: (previousMemory?.sessionCount || 0) + 1,
        lastUpdated: new Date().toISOString(),
      };
    } catch {
      return null;
    }
  };

  // Called when a new session starts. Returns a warm contextual opening question.
  const generateCheckIn = async (
    memory: UserMemory,
    lastSummary?: string,
  ): Promise<string | null> => {
    if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') return null;

    const contextMsg = `User memory:\n${memory.narrative}\n\nRecurring themes: ${(memory.recurringThemes || []).join(', ')}` +
      (lastSummary ? `\n\nLast session summary:\n${lastSummary}` : '');

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 80,
          system: CHECKIN_SYSTEM,
          messages: [{ role: 'user', content: contextMsg }],
        }),
      });
      const data = await response.json();
      return data.content?.[0]?.text || null;
    } catch {
      return null;
    }
  };

  return { send, summarise, generateMemoryUpdate, generateCheckIn, loading, floodingDetected, crisisDetected };
}

function getFallback(systemPrompt: string): string {
  if (systemPrompt.includes('VENT')) {
    const opts = [
      "That sounds incredibly difficult. What part of this is sitting heaviest with you right now?",
      "I hear you. It makes complete sense to feel this way. Can you tell me more about what happened?",
      "Your feelings are completely valid. What do you most need right now?",
    ];
    return opts[Math.floor(Math.random() * opts.length)];
  }
  if (systemPrompt.includes('UNDERSTAND')) {
    return "It sounds like there might be a pattern worth exploring gently. Often what we fight about on the surface points to something deeper. Does that resonate?";
  }
  if (systemPrompt.includes('PREPARE')) {
    return "A powerful shift: separate the observation from the interpretation. Not 'you ignored me' but 'when you didn't respond for three hours'. Want to try building this into a message?";
  }
  if (systemPrompt.includes('BRIDGE')) {
    return "Let's compose your message together. Start with a specific observation — what happened, without judgment — then we'll add how it made you feel and what you need.";
  }
  return "I'm here with you. Can you tell me more about what you're experiencing?";
}
