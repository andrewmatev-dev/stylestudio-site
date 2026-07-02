// Server-side route for outfit generation.
// Client calls: POST /api/outfits { occasion, genderPref, wardrobe }
// Returns: { outfits: [{ title, vibe, item_ids, styling_tip, missing }] }

import Anthropic from '@anthropic-ai/sdk';

export async function POST(request) {
  try {
    const { occasion, genderPref, wardrobe } = await request.json();

    if (!Array.isArray(wardrobe) || wardrobe.length < 2) {
      return Response.json({ error: 'Need at least 2 wardrobe items' }, { status: 400 });
    }

    const genderText = genderPref === 'men' ? 'masculine / menswear'
      : genderPref === 'women' ? 'feminine / womenswear'
      : 'any presentation, gender-neutral';

    const prompt = `Professional stylist. Compose 3 distinct outfits for "${occasion}". Style direction: ${genderText}.

Wardrobe (use ONLY these by id):
${JSON.stringify(wardrobe, null, 2)}

Rules:
- Each outfit 2-6 items that work together
- Use accessories (belts, bags, jewelry, hats, eyewear, scarves) where they elevate the look
- All items from wardrobe above
- Each outfit DIFFERENT in vibe

JSON only:
{"outfits":[{"title":"max 4 words","vibe":"one sentence","item_ids":["id1"],"styling_tip":"one tip","missing":""}]}`;

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }]
    });

    const text = response.content.filter(b => b.type === 'text').map(b => b.text).join('');
    const cleaned = text.replace(/```json|```/g, '').trim();
    const result = JSON.parse(cleaned);

    return Response.json(result);
  } catch (err) {
    console.error('outfits error', err);
    return Response.json({ error: 'Could not generate outfits' }, { status: 500 });
  }
}
