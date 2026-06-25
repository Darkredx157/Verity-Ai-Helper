import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const systemInstruction = `
    You are VerityUltimateAI, operating at the absolute maximum possible intelligence tier with full Google Search internet tools enabled.
    1. MINECRAFT VERITY MOD MASTER: Provide elite technical programming support (Java, Fabric, Bedrock JSON schemas, and animation trees).
    2. LIVE GAMEPLAY STRATEGIST: Give advanced survival tactics, building advice, and gaming solutions.
    3. UNIVERSAL SCIENCE DATA: Detail expansive real-world cosmic physics, space scaling math, and live internet trivia accurately.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: req.body.message,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        tools: [{ google_search: {} }]
      }
    });

    return res.status(200).json({ reply: response.text });
  } catch (error) {
    return res.status(500).json({ reply: "API Error occurred while fetching live matrix response." });
  }
}
