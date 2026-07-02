// Server-side route that proxies vision requests to Anthropic.
// This is the ONLY place your API key is used. Never expose it client-side.
//
// Client calls: POST /api/analyze { dataUrl: "data:image/jpeg;base64,..." }
// Returns: { brand, name, type, color, colorHex, pattern, material, formality, style_tags, occasions, seasons }

import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const SYSTEM_PROMPT = `Analyze this clothing/accessory and respond ONLY with valid JSON:
{
  "brand": "brand name if you can identify it from a logo, tag, or distinctive design, else empty string",
  "name": "specific product name if recognizable (e.g. 'Air Force 1', 'Levi's 501'), else short descriptor max 5 words",
  "type": "one of: top, bottom, dress, outerwear, shoes, bag, belt, jewelry, hat, eyewear, scarf, other",
  "color": "primary color, short",
  "colorHex": "hex code of dominant color",
  "pattern": "solid, striped, plaid, floral, graphic, or other",
  "material": "main material if visible, else 'unknown'",
  "formality": 1-5,
  "style_tags": ["2-4 from: minimal, classic, preppy, streetwear, romantic, sporty, edgy, bohemian, elegant"],
  "occasions": ["from: work, date, casual, brunch, formal, night-out, travel, gym"],
  "seasons": ["from: spring, summer, fall, winter"]
}`;

export async function POST(request) {
  try {
    // Optional: verify the user is authenticated to prevent random people burning your API budget
    // (You'll want this in production once you have public traffic.)

    const { dataUrl } = await request.json();
    if (!dataUrl || !dataUrl.startsWith('data:image/')) {
      return Response.json({ error: 'Invalid image' }, { status: 400 });
    }

    const base64 = dataUrl.split(',')[1];
    const mediaType = dataUrl.match(/data:(image\/\w+);/)?.[1] || 'image/jpeg';

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
          { type: 'text', text: SYSTEM_PROMPT }
        ]
      }]
    });

    const text = response.content.filter(b => b.type === 'text').map(b => b.text).join('');
    const cleaned = text.replace(/```json|```/g, '').trim();
    const result = JSON.parse(cleaned);

    return Response.json(result);
  } catch (err) {
    console.error('analyze error', err);
    return Response.json({ error: 'Could not analyze image' }, { status: 500 });
  }
}
