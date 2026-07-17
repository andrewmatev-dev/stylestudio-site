'use client';

import { useEffect, useMemo, useState } from 'react';
import { getSupabase } from '@/lib/supabase';

// ── Creme + Espresso palette ──
const BG = '#FDFAF2', SURFACE = '#F2E9D7', INK = '#42392C', GOLD = '#C89F4E';
const INKSOFT = 'rgba(66,57,44,0.62)', BORDER = 'rgba(0,0,0,0.06)';
const TINTS = ['#F2E1DE', '#E8EBDB', '#F1E3C8'];

export default function AdminPage() {
  const [checking, setChecking] = useState(true);
  const [users, setUsers] = useState([]);        // {id, name, joined, isPublic, photo}
  const [items, setItems] = useState([]);        // {id, userId, name, path, url}
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('all');   // all | public | private
  const [sort, setSort] = useState('newest');    // newest | name
  const [busy, setBusy] = useState(null);        // item id being deleted
  const [err, setErr] = useState(null);

  useEffect(() => {
    (async () => {
      const sb = getSupabase();
      try {
        const { data: { session } } = await sb.auth.getSession();
        if (!session) { window.location.href = '/'; return; }
        const uid = session.user.id;

        // Gate: only admins may stay
        const { data: me } = await sb.from('profiles').select('is_admin').eq('id', uid).maybeSingle();
        if (!me || me.is_admin !== true) { window.location.href = '/'; return; }

        // Load everything in parallel
        const [profilesRes, prefsRes, itemsRes] = await Promise.all([
          sb.from('profiles').select('id, display_name, created_at'),
          sb.from('user_prefs').select('user_id, key, value').in('key', ['profile_photo', 'default_public']),
          sb.from('items').select('id, user_id, name, image_path, created_at').order('created_at', { ascending: false }),
        ]);

        const prefs = {};
        (prefsRes.data || []).forEach(p => {
          prefs[p.user_id] = prefs[p.user_id] || {};
          prefs[p.user_id][p.key] = p.value;
        });

        setUsers((profilesRes.data || []).map(p => ({
          id: p.id,
          name: p.display_name || 'Unnamed',
          joined: p.created_at ? new Date(p.created_at) : null,
          isPublic: String(prefs[p.id]?.default_public) === 'true',
          photo: prefs[p.id]?.profile_photo || null,
        })));

        setItems((itemsRes.data || []).map(it => ({
          id: it.id,
          userId: it.user_id,
          name: it.name || 'Item',
          path: it.image_path,
          url: it.image_path ? sb.storage.from('items').getPublicUrl(it.image_path).data.publicUrl : null,
        })));

        setChecking(false);
      } catch (e) {
        setErr(e.message || 'Could not load admin data');
        setChecking(false);
      }
    })();
  }, []);

  async function deletePhoto(item) {
    if (!confirm(`Delete this photo (“${item.name}”) permanently? The user's item will be removed.`)) return;
    setBusy(item.id); setErr(null);
    const sb = getSupabase();
    try {
      if (item.path) {
        const { error: sErr } = await sb.storage.from('items').remove([item.path]);
        if (sErr) throw sErr;
      }
      const { error: dErr } = await sb.from('items').delete().eq('id', item.id);
      if (dErr) throw dErr;
      setItems(prev => prev.filter(x => x.id !== item.id));
    } catch (e) {
      setErr('Delete failed: ' + (e.message || 'unknown error'));
    } finally { setBusy(null); }
  }

  const shown = useMemo(() => {
    let list = users;
    if (q.trim()) list = list.filter(u => u.name.toLowerCase().includes(q.trim().toLowerCase()));
    if (filter === 'public') list = list.filter(u => u.isPublic);
    if (filter === 'private') list = list.filter(u => !u.isPublic);
    list = [...list].sort((a, b) => sort === 'name'
      ? a.name.localeCompare(b.name)
      : (b.joined?.getTime() || 0) - (a.joined?.getTime() || 0));
    return list;
  }, [users, q, filter, sort]);

  const itemsByUser = useMemo(() => {
    const m = {};
    items.forEach(it => { (m[it.userId] = m[it.userId] || []).push(it); });
    return m;
  }, [items]);

  if (checking) {
    return <div style={{ minHeight: '100vh', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', color: INK, fontFamily: 'system-ui' }}>Checking access…</div>;
  }

  const chip = (on) => ({
    padding: '7px 14px', borderRadius: 999, fontSize: 12, fontWeight: 800, cursor: 'pointer',
    border: `1px solid ${on ? INK : BORDER}`, background: on ? INK : SURFACE, color: on ? 'white' : INK,
  });

  return (
    <div style={{ minHeight: '100vh', background: BG, color: INK, fontFamily: "system-ui,-apple-system,sans-serif", padding: '22px 16px 80px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD }}>Owner tools</div>
            <h1 style={{ fontSize: 24, fontWeight: 800, margin: '4px 0 0' }}>Admin</h1>
          </div>
          <button onClick={() => (window.location.href = '/')} style={{ padding: '10px 16px', borderRadius: 999, border: 'none', background: INK, color: 'white', fontWeight: 800, fontSize: 13, cursor: 'pointer' }}>← Back to app</button>
        </div>

        {err && <div style={{ background: '#F2E1DE', border: `1px solid ${BORDER}`, color: INK, padding: '10px 14px', borderRadius: 12, fontSize: 13, fontWeight: 600, marginBottom: 14 }}>{err}</div>}

        {/* Controls */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 18 }}>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search username…"
            style={{ flex: '1 1 200px', padding: '11px 14px', borderRadius: 12, border: `2px solid ${GOLD}30`, background: SURFACE, color: INK, fontSize: 14, fontWeight: 600, outline: 'none' }} />
          {['all', 'public', 'private'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={chip(filter === f)}>{f[0].toUpperCase() + f.slice(1)}</button>
          ))}
          <button onClick={() => setSort(sort === 'newest' ? 'name' : 'newest')} style={chip(false)}>
            Sort: {sort === 'newest' ? 'Newest' : 'Name'} ⇅
          </button>
        </div>

        <div style={{ fontSize: 12, color: INKSOFT, fontWeight: 700, marginBottom: 12 }}>
          {shown.length} user{shown.length === 1 ? '' : 's'} · {items.length} photo{items.length === 1 ? '' : 's'} in the closet bucket
        </div>

        {/* User cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {shown.map((u, ui) => (
            <div key={u.id} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 20, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 46, height: 46, borderRadius: '50%', overflow: 'hidden', background: INK, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {u.photo
                    ? <img src={u.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ color: GOLD, fontWeight: 800, fontSize: 18 }}>{u.name[0]?.toUpperCase() || '?'}</span>}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</div>
                  <div style={{ fontSize: 11, color: INKSOFT, fontWeight: 600 }}>
                    Joined {u.joined ? u.joined.toLocaleDateString() : '—'}
                  </div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', padding: '4px 10px', borderRadius: 999, background: u.isPublic ? '#E8EBDB' : '#F2E1DE', color: INK }}>
                  {u.isPublic ? 'PUBLIC' : 'PRIVATE'}
                </span>
              </div>

              {/* Their photos */}
              {(itemsByUser[u.id] || []).length === 0 ? (
                <div style={{ fontSize: 12, color: INKSOFT, fontWeight: 600, background: TINTS[ui % 3], borderRadius: 12, padding: '10px 12px' }}>No photos uploaded</div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {itemsByUser[u.id].map((it, i) => (
                    <div key={it.id} style={{ borderRadius: 12, overflow: 'hidden', background: TINTS[i % 3], border: `1px solid ${BORDER}` }}>
                      <div style={{ aspectRatio: '3/4', position: 'relative' }}>
                        {it.url && <img src={it.url} alt={it.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={e => { e.currentTarget.style.display = 'none'; }} />}
                      </div>
                      <button onClick={() => deletePhoto(it)} disabled={busy === it.id}
                        style={{ width: '100%', border: 'none', background: INK, color: 'white', fontSize: 10, fontWeight: 800, padding: '7px 0', cursor: 'pointer', opacity: busy === it.id ? 0.5 : 1 }}>
                        {busy === it.id ? 'Deleting…' : 'Delete photo'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {shown.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: INKSOFT, fontWeight: 700 }}>No users match that search.</div>
        )}
      </div>
    </div>
  );
}
