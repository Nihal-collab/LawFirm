const Groq = require('groq-sdk');
const { LEGAL_SYSTEM_PROMPT } = require('./prompts/legal.prompt');
const { runRuleEngine } = require('./ruleEngine.service');

let groqClient = null;

const getGroqClient = () => {
  if (!groqClient && process.env.GROQ_API_KEY) {
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groqClient;
};

/**
 * Call Groq AI with the legal system prompt.
 * Falls back to the rule engine if Groq is unavailable.
 * @param {string} userMessage
 * @param {Array} conversationHistory - Array of {role, content} objects
 * @returns {{ response: string, method: 'groq' | 'rule-engine' }}
 */
const callAI = async (userMessage, conversationHistory = []) => {
  const client = getGroqClient();

  if (client) {
    try {
      // Build message history for context (last 10 messages max)
      const recentHistory = conversationHistory.slice(-10).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const completion = await client.chat.completions.create({
        model: process.env.GROQ_MODEL || 'llama3-8b-8192',
        messages: [
          { role: 'system', content: LEGAL_SYSTEM_PROMPT },
          ...recentHistory,
          { role: 'user', content: userMessage },
        ],
        temperature: 0.2,
        max_tokens: 500,
      });

      const response = completion.choices[0]?.message?.content;
      if (response) {
        return { response, method: 'groq' };
      }
    } catch (error) {
      console.error('[Groq AI Error]', error.message);
      // Fall through to rule engine
    }
  }

  // Fallback rule engine
  const response = runRuleEngine(userMessage);
  return { response, method: 'rule-engine' };
};

module.exports = { callAI };
