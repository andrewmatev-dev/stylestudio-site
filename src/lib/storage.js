// Storage adapter that mimics the `window.storage` API from the Claude artifact,
// but persists everything to Supabase (Postgres + Storage bucket for images).
//
// This lets you keep the existing component logic almost as-is.
// Replace `window.storage.set(key, value)` with `storage.set(key, value)`.

import { getSupabase } from './supabase';

const BUCKET = 'items';

// ---------- helpers ----------

async function userId() {
  const sb = getSupabase();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  return user.id;
}

function parseKey(key) {
  // Keys look like:
  //   item:abc123
  //   outfit:abc123
  //   post:abc123
  //   profile  (for display_name, gender_pref, etc.)
  //   liked_posts
  const [type, id] = key.split(':');
  return { type, id };
}

// Upload a data URL to Supabase Storage, return storage path
async function uploadDataUrl(dataUrl, path) {
  const sb = getSupabase();
  const blob = await (await fetch(dataUrl)).blob();
  const { error } = await sb.storage.from(BUCKET).upload(path, blob, {
    upsert: true,
    contentType: 'image/jpeg'
  });
  if (error) throw error;
  return path;
}

// Get a temporary signed URL for an image path
async function signedUrl(path) {
  const sb = getSupabase();
  const { data, error } = await sb.storage.from(BUCKET).createSignedUrl(path, 60 * 60); // 1h
  if (error) throw error;
  return data.signedUrl;
}

// ---------- public API: matches window.storage shape ----------

export const storage = {

  async get(key, shared = false) {
    const sb = getSupabase();
    const { type, id } = parseKey(key);
    const uid = await userId();

    if (type === 'item') {
      const { data } = await sb.from('items').select('*').eq('id', id).eq('user_id', uid).maybeSingle();
      if (!data) throw new Error('Not found');
      const url = await signedUrl(data.image_path);
      return { key, value: JSON.stringify(itemToClient(data, url)) };
    }

    if (type === 'outfit') {
      const { data } = await sb.from('outfits').select('*').eq('id', id).eq('user_id', uid).maybeSingle();
      if (!data) throw new Error('Not found');
      return { key, value: JSON.stringify(outfitToClient(data)) };
    }

    if (type === 'post' && shared) {
      const { data } = await sb.from('posts').select('*').eq('id', id).maybeSingle();
      if (!data) throw new Error('Not found');
      return { key, value: JSON.stringify(postToClient(data)) };
    }

    if (key === 'display_name' || key === 'gender_pref') {
      const { data } = await sb.from('profiles').select('display_name, gender_pref').eq('id', uid).maybeSingle();
      if (!data) throw new Error('Not found');
      return { key, value: data[key] || '' };
    }

    if (key === 'user_id') return { key, value: uid };

    if (key === 'liked_posts') {
      const { data } = await sb.from('post_likes').select('post_id').eq('user_id', uid);
      const ids = (data || []).map(r => r.post_id);
      return { key, value: JSON.stringify(ids) };
    }

    // Comments live in their own table, keyed cmt:<postId>_<commentId>
    if (type === 'cmt') {
      const { data } = await sb.from('comments').select('*').eq('id', id.split('_').slice(1).join('_')).maybeSingle();
      if (!data) throw new Error('Not found');
      return { key, value: JSON.stringify(commentToClient(data)) };
    }

    // Everything else (profile_bio, profile_photo, default_public, saved_board,
    // rejected_outfits, etc.) is a simple per-user preference.
    {
      const { data } = await sb.from('user_prefs').select('value').eq('user_id', uid).eq('key', key).maybeSingle();
      if (!data) throw new Error('Not found');
      return { key, value: data.value };
    }
  },

  async set(key, value, shared = false) {
    const sb = getSupabase();
    const { type, id } = parseKey(key);
    const uid = await userId();

    if (type === 'item') {
      const item = JSON.parse(value);
      const imagePath = `${uid}/${item.id}.jpg`;
      if (item.dataUrl && item.dataUrl.startsWith('data:')) {
        await uploadDataUrl(item.dataUrl, imagePath);
      }
      const { error } = await sb.from('items').upsert({
        id: item.id, user_id: uid,
        brand: item.brand || '',
        name: item.name,
        type: item.type,
        color: item.color,
        color_hex: item.colorHex,
        pattern: item.pattern,
        material: item.material,
        formality: item.formality,
        style_tags: item.style_tags,
        occasions: item.occasions,
        seasons: item.seasons,
        image_path: imagePath
      });
      if (error) throw error;
      return { key, value };
    }

    if (type === 'outfit') {
      const o = JSON.parse(value);
      const { error } = await sb.from('outfits').upsert({
        id: o.id, user_id: uid,
        title: o.title, vibe: o.vibe, styling_tip: o.styling_tip || '',
        item_ids: o.item_ids, occasion: o.occasion, signature: o.signature
      });
      if (error) throw error;
      return { key, value };
    }

    if (type === 'post' && shared) {
      const p = JSON.parse(value);
      const { error } = await sb.from('posts').insert({
        id: p.id, author_id: uid, author_name: p.author,
        title: p.title, vibe: p.vibe, styling_tip: p.styling_tip || '',
        occasion: p.occasion,
        items: p.items
      });
      if (error) throw error;
      return { key, value };
    }

    if (key === 'display_name' || key === 'gender_pref') {
      const { error } = await sb.from('profiles').update({ [key]: value }).eq('id', uid);
      if (error) throw error;
      return { key, value };
    }

    if (key === 'liked_posts') {
      // Not used directly — we use the toggle RPC. Kept as no-op.
      return { key, value };
    }

    // Comments — key looks like cmt:<postId>_<commentId>
    if (type === 'cmt') {
      const c = JSON.parse(value);
      const { error } = await sb.from('comments').insert({
        id: c.id, post_id: c.postId, author_id: uid, author_name: c.author, text: c.text
      });
      if (error) throw error;
      return { key, value };
    }

    // Fallback: simple per-user preference (profile_bio, profile_photo,
    // default_public, saved_board, rejected_outfits, gender_pref, etc.)
    {
      const { error } = await sb.from('user_prefs').upsert({ user_id: uid, key, value });
      if (error) throw error;
      return { key, value };
    }
  },

  async delete(key, shared = false) {
    const sb = getSupabase();
    const { type, id } = parseKey(key);
    const uid = await userId();

    if (type === 'item') {
      const { data: item } = await sb.from('items').select('image_path').eq('id', id).eq('user_id', uid).maybeSingle();
      if (item?.image_path) await sb.storage.from(BUCKET).remove([item.image_path]);
      await sb.from('items').delete().eq('id', id).eq('user_id', uid);
      return { key, deleted: true };
    }
    if (type === 'outfit') {
      await sb.from('outfits').delete().eq('id', id).eq('user_id', uid);
      return { key, deleted: true };
    }
    if (type === 'post' && shared) {
      await sb.from('posts').delete().eq('id', id).eq('author_id', uid);
      return { key, deleted: true };
    }
    if (type === 'cmt') {
      await sb.from('comments').delete().eq('id', id.split('_').slice(1).join('_')).eq('author_id', uid);
      return { key, deleted: true };
    }
    // Preference key
    await sb.from('user_prefs').delete().eq('user_id', uid).eq('key', key);
    return { key, deleted: true };
  },

  async list(prefix, shared = false) {
    const sb = getSupabase();
    const uid = await userId();

    if (prefix === 'item:') {
      const { data } = await sb.from('items').select('id').eq('user_id', uid);
      return { keys: (data || []).map(r => `item:${r.id}`) };
    }
    if (prefix === 'outfit:') {
      const { data } = await sb.from('outfits').select('id').eq('user_id', uid);
      return { keys: (data || []).map(r => `outfit:${r.id}`) };
    }
    if (prefix === 'post:' && shared) {
      const { data } = await sb.from('posts').select('id').order('created_at', { ascending: false }).limit(100);
      return { keys: (data || []).map(r => `post:${r.id}`) };
    }
    // Comments for a post: prefix looks like cmt:<postId>_
    if (prefix.startsWith('cmt:') && shared) {
      const postId = prefix.slice(4).replace(/_$/, '');
      const { data } = await sb.from('comments').select('id').eq('post_id', postId).order('created_at', { ascending: true });
      return { keys: (data || []).map(r => `cmt:${postId}_${r.id}`) };
    }
    return { keys: [] };
  }
};

// ---------- shape adapters: DB rows -> client-side objects ----------

function itemToClient(row, signedImageUrl) {
  return {
    id: row.id,
    brand: row.brand || '',
    name: row.name,
    type: row.type,
    color: row.color,
    colorHex: row.color_hex,
    pattern: row.pattern,
    material: row.material,
    formality: row.formality,
    style_tags: row.style_tags || [],
    occasions: row.occasions || [],
    seasons: row.seasons || [],
    dataUrl: signedImageUrl,        // signed URL replaces the original base64 dataUrl
    dateAdded: new Date(row.created_at).getTime()
  };
}

function outfitToClient(row) {
  return {
    id: row.id,
    title: row.title, vibe: row.vibe, styling_tip: row.styling_tip,
    item_ids: row.item_ids,
    occasion: row.occasion,
    signature: row.signature,
    dateSaved: new Date(row.created_at).getTime()
  };
}

function postToClient(row) {
  return {
    id: row.id,
    title: row.title, vibe: row.vibe, styling_tip: row.styling_tip,
    occasion: row.occasion,
    items: row.items,
    author: row.author_name,
    authorId: row.author_id,
    likes: row.likes,
    dateCreated: new Date(row.created_at).getTime()
  };
}

function commentToClient(row) {
  return {
    id: row.id,
    postId: row.post_id,
    text: row.text,
    author: row.author_name,
    authorId: row.author_id,
    dateCreated: new Date(row.created_at).getTime()
  };
}

// ---------- RPC: toggle like ----------

export async function togglePostLike(postId) {
  const sb = getSupabase();
  const { data, error } = await sb.rpc('toggle_post_like', { p_post_id: postId });
  if (error) throw error;
  return data; // returns new like count
}
