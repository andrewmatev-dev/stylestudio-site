// Server-side route for trip packing list generation.
// Client calls: POST /api/pack { destination, days, activities, weather, wardrobe }
// Returns: { summary, item_ids, day_outfits, missing, tips }

import Anthropic from '@anthropic-ai/sdk';

export async function POST(request) {
  try {
    const { destination, days, activities, weather, wardrobe } = await request.json();

    if (!Array.isArray(wardrobe) || wardrobe.length < 2) {
      return Response.json({ error: 'Need at least 2 wardrobe items' }, { status: 400 });
    }

    const prompt = `Build a packing list from this wardrobe for a trip.

Destination: ${destination || 'not specified'}
Days: ${days}
Activities: ${(activities || []).join(', ')}
Weather: ${weather || 'unknown'}

Wardrobe:
${JSON.stringify(wardrobe)}

Return ONLY valid JSON, no preamble:
{"summary":"one sentence overview","item_ids":["id1","id2"],"day_outfits":[{"day":1,"plan":"e.g. travel + dinner","item_ids":["id1"]}],"missing":"what they need to buy or pack from outside wardrobe","tips":"one short packing tip"}`;

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }]
    });

    const text = response.content.filter(b => b.type === 'text').map(b => b.text).join('');
    const cleaned = text.replace(/```json|```/g, '').trim();
    let result;
    try {
      result = JSON.parse(cleaned);
    } catch (e) {
      const m = text.match(/\{[\s\S]*\}/);
      if (m) result = JSON.parse(m[0]);
    }
    if (!result) throw new Error('Could not parse packing list');

    return Response.json(result);
  } catch (err) {
    console.error('pack error', err);
    return Response.json({ error: 'Could not build packing list' }, { status: 500 });
  }
}
