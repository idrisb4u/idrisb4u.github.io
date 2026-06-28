import { RESUME_TEXT, SYSTEM_INSTRUCTION } from '../src/context.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { messages, userText } = req.body;

    if (!userText) {
      return res.status(400).json({ error: 'Missing userText' });
    }

    // Resolve API key
    let apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey.startsWith("AQ_")) {
      apiKey = apiKey.replace("AQ_", "AQ.");
    }
    
    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API Key is not configured on Vercel.' });
    }

    // Build the grounding prompt
    const requestContents = [
      {
        role: 'user',
        parts: [{ text: `Here is the professional resume and background of Idris Ali:\n\n${RESUME_TEXT}\n\nGround all your responses in this context.` }]
      },
      {
        role: 'model',
        parts: [{ text: "Understood. I am Idris Ali's AI twin. I will speak in the first person as Idris Ali and answer all questions based exactly on this professional resume and background context." }]
      }
    ];

    // Append dialogue history (filtered)
    if (messages && Array.isArray(messages)) {
      messages.forEach(msg => {
        if (msg.id === 'welcome' || msg.isError) return;
        requestContents.push({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      });
    }

    // Append current message
    requestContents.push({
      role: 'user',
      parts: [{ text: userText }]
    });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: requestContents,
          systemInstruction: {
            parts: [{ text: SYSTEM_INSTRUCTION }]
          },
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 1000,
          }
        })
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error(`Gemini API error: ${errText}`);
      return res.status(response.status).json({ 
        error: `Gemini API returned status ${response.status}`,
        details: errText 
      });
    }

    const data = await response.json();
    const botResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!botResponseText) {
      return res.status(500).json({ error: 'Invalid response from Gemini API' });
    }

    return res.status(200).json({ text: botResponseText });
  } catch (error) {
    console.error(`Handler error: ${error.message}`);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}
