import { useState } from 'react';
import { FLOODING_WORDS, CRISIS_WORDS } from '../constants/data';

const API_URL = 'https://api.anthropic.com/v1/messages';
const API_KEY = 'YOUR_API_KEY_HERE';

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
}

export function useClaude({ systemPrompt, userProfile }: UseClaudeOptions) {
  const [loading, setLoading] = useState(false);
  const [floodingDetected, setFloodingDetected] = useState(false);
  const [crisisDetected, setCrisisDetected] = useState(false);

  const buildSystem = () =>
    systemPrompt +
    '\n\nUser profile:\n' +
    '- Name: ' + (userProfile.name || 'unknown') + '\n' +
    '- Attachment: ' + (userProfile.attachment || 'unknown') + '\n' +
    '- Love language: ' + (userProfile.love || 'unknown') + '\n' +
    '- Conflict style: ' + (userProfile.conflict || 'unknown') + '\n' +
    '- Body response: ' + (userProfile.window || 'unknown') + '\n' +
    '- Core need: ' + (userProfile.need || 'unknown');

  const send = async (
    userText: string,
    history: { role: 'user' | 'assistant'; content: string }[]
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

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 600,
          system: buildSystem(),
          messages: [...history, { role: 'user', content: userText }],
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

  return { send, loading, floodingDetected, crisisDetected };
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
  return "Every moment of genuine connection builds what Gottman calls the emotional bank account. What feels most alive for you two right now?";
}
