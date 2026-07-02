import React, { useState, useEffect, useRef } from 'react';
import { Camera, Sparkles, X, ChevronLeft, Trash2, Loader2, Check, Heart, Share2, Send, RefreshCw, Globe, Leaf } from 'lucide-react';

// ============ Forest Green + Warm Beige System ============
const C = {
  // Backgrounds — sage stone + verdant linen (RH gallery with more green)
  bg:          '#B0AE88',   // sage-stone — main bg (RH wall + plants)
  bgDeep:      '#9A9874',   // deeper sage-stone
  surface:     '#DCDBB6',   // sage linen parchment — cards
  surfaceAlt:  '#CFCEA8',   // deeper sage linen

  // Text — warm dark ink
  ink:         '#162010',   // deep forest-tinted black
  inkSoft:     'rgba(18,28,14,0.62)',
  inkFaint:    'rgba(18,28,14,0.40)',

  // Borders
  border:      'rgba(18,28,14,0.08)',
  borderStrong:'rgba(18,28,14,0.15)',

  // ── Forest greens — the hero colors ──
  forest:      '#0F2010',   // very dark forest (nav, primary buttons)
  forestMid:   '#1A3C1C',   // mid forest for gradients
  forestLight: '#2A5C2D',   // lighter forest for highlights

  sage:        '#1A3C1C',   // exact logo green — deep forest
  sageMid:     '#0F2010',   // matches logo darkest forest
  sageSoft:    '#C0D8C4',   // soft sage fill

  green:       '#3A7040',   // vivid mid green — active states
  greenSoft:   '#C4D8C8',   // soft green fill

  // ── Warm earthy accents ──
  ochre:       '#9C7028',   // antique brass — CTA accent (RH brass)
  ochreDark:   '#6E4E18',
  ochreSoft:   '#E8D2A0',   // warm brass-tinted fill

  clay:        '#704A26',   // walnut brown (RH wood)
  claySoft:    '#D8BC98',   // warm walnut fill

  sand:        '#D4B87A',   // golden sand
  sandSoft:    '#F5E8C8',   // light sand

  caramel:     '#C8963C',   // warm caramel
  caramelSoft: '#F2E0B0',

  bark:        '#2E1C0E',   // deep espresso walnut
  moss:        '#3D5230',   // deep moss
};

const OCCASIONS = [
  { id: 'work',      label: 'Work',         sub: 'Office ready',       color: C.sage,        bgColor: C.sageSoft,   emoji: '💼' },
  { id: 'date',      label: 'Date night',   sub: 'Turn heads',         color: C.ochreDark,   bgColor: C.ochreSoft,  emoji: '🌿' },
  { id: 'casual',    label: 'Casual day',   sub: 'Easy & real',        color: C.forestLight, bgColor: C.sageSoft,   emoji: '☕' },
  { id: 'brunch',    label: 'Brunch',       sub: 'Weekend golden',     color: C.clay,        bgColor: C.claySoft,   emoji: '🥐' },
  { id: 'formal',    label: 'Formal event', sub: 'Dress to impress',   color: C.forest,      bgColor: C.sageSoft,   emoji: '✨' },
  { id: 'night-out', label: 'Night out',    sub: 'Dark & striking',    color: C.bark,        bgColor: C.claySoft,   emoji: '🌙' },
  { id: 'travel',    label: 'Travel day',   sub: 'Pack light',         color: C.sageMid,     bgColor: C.sandSoft,   emoji: '✈️' },
  { id: 'gym',       label: 'Workout',      sub: 'Move in style',      color: C.clay,        bgColor: C.ochreSoft,  emoji: '⚡' }
];

function BeltIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="9" width="20" height="6" rx="1.5"/>
      <rect x="10" y="11" width="4" height="2" rx="0.3"/>
      <circle cx="12" cy="12" r="0.6" fill="currentColor"/>
    </svg>
  );
}

function LeafDot({ size = 10, color = C.ochre, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={style}>
      <path d="M12 2C6 2 2 8 2 14c0 3.3 1.4 6.3 3.6 8.4C8 20.2 10 18 12 18s4 2.2 6.4 4.4C20.6 20.3 22 17.3 22 14c0-6-4-12-10-12z"/>
    </svg>
  );
}

// Tea Tag logo — the chosen StyleStudio mark
function TeaTagLogo({ size = 36, fg = C.forest, ac = C.ochre }) {
  const s = size / 48;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* String from top-left corner */}
      <path d="M10 5 Q16 16 26 22" stroke={fg} strokeWidth={2 / s * (size / 36)} strokeLinecap="round" fill="none"/>
      {/* Leaf-shaped tag */}
      <path d="M26 22 C20 24 15 33 19 41 C25 46 33 41 33 33 C33 28 30 24 26 22 Z" fill={ac}/>
      {/* Vein down the center of the leaf */}
      <line x1="26" y1="22" x2="24" y2="41" stroke={fg} strokeWidth={0.7 / s * (size / 36)} opacity="0.45" strokeLinecap="round"/>
      {/* Side veins */}
      <path d="M26 27 L20 30" stroke={fg} strokeWidth={0.5 / s * (size / 36)} opacity="0.35" strokeLinecap="round"/>
      <path d="M26 32 L19 35" stroke={fg} strokeWidth={0.5 / s * (size / 36)} opacity="0.35" strokeLinecap="round"/>
      <path d="M25 37 L20 38" stroke={fg} strokeWidth={0.5 / s * (size / 36)} opacity="0.25" strokeLinecap="round"/>
      {/* Small square tag anchor at top of string */}
      <rect x="7" y="3" width="6" height="5" rx="1" fill={fg}/>
    </svg>
  );
}

// Leaf Hanger — the chosen StyleStudio logo mark
function LeafHangerLogo({ size = 36, fg = C.forest, ac = C.ochre }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* Hanger shoulders */}
      <path d="M8 36 C8 36 14 28 24 28 C34 28 40 36 40 36" stroke={fg} strokeWidth="2.8" strokeLinecap="round"/>
      {/* Hanger stem */}
      <path d="M24 28 L24 18" stroke={fg} strokeWidth="2.8" strokeLinecap="round"/>
      {/* Hook curling into a leaf */}
      <path d="M24 18 C24 18 24 10 30 10 C32 10 33 12 32 14 C31 16 29 16 27 15 C25 14 24 12 24 10" stroke={fg} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* Leaf accent on left shoulder */}
      <path d="M11 31 C9 27 11 23 15 24 C15 24 12 28 14 31" fill={ac} opacity="0.9"/>
    </svg>
  );
}

function SparkDot({ size = 10, color = C.ochre, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={style}>
      <path d="M12 0 C12 8,12 8,24 12 C12 16,12 16,12 24 C12 16,12 16,0 12 C12 8,12 8,12 0Z"/>
    </svg>
  );
}

const TYPE_FILTERS = [
  { id: 'all',         label: 'All',        icon: '✦'  },
  { id: 'accessories', label: 'Accessories',icon: '💎' },
  { id: 'top',         label: 'Tops',       icon: '👕' },
  { id: 'bottom',      label: 'Bottoms',    icon: '👖' },
  { id: 'dress',       label: 'Dresses',    icon: '👗' },
  { id: 'outerwear',   label: 'Outerwear',  icon: '🧥' },
  { id: 'shoes',       label: 'Shoes',      icon: '👟' },
  { id: 'bag',         label: 'Bags',       icon: '👜' },
  { id: 'belt',        label: 'Belts',      icon: 'belt' },
  { id: 'jewelry',     label: 'Jewelry',    icon: '💍' },
  { id: 'hat',         label: 'Hats',       icon: '🧢' },
  { id: 'eyewear',     label: 'Eyewear',    icon: '🕶️' },
  { id: 'scarf',       label: 'Scarves',    icon: '🧣' },
  { id: 'other',       label: 'Other',      icon: '✨' }
];

const ACCESSORY_TYPES = ['bag','belt','jewelry','hat','eyewear','scarf'];

const CATEGORY_GROUPS = [
  { label: 'Clothing',    color: C.sage,    types: ['top','bottom','dress','outerwear'] },
  { label: 'Footwear',    color: C.clay,    types: ['shoes'] },
  { label: 'Accessories', color: C.ochre,   types: ACCESSORY_TYPES },
  { label: 'Other',       color: C.sageMid, types: ['other'] }
];

const STYLE_TAG_COLORS = {
  minimal:    { bg: '#E4DECA', fg: C.bark },
  classic:    { bg: C.sageSoft, fg: C.sageMid },
  preppy:     { bg: C.sandSoft, fg: C.clay },
  streetwear: { bg: C.claySoft, fg: C.bark },
  romantic:   { bg: C.ochreSoft, fg: C.ochreDark },
  sporty:     { bg: C.claySoft, fg: C.clay },
  edgy:       { bg: '#E0D8C8', fg: C.bark },
  bohemian:   { bg: C.ochreSoft, fg: C.ochreDark },
  elegant:    { bg: C.sageSoft, fg: C.sageMid },
  default:    { bg: C.sandSoft, fg: C.clay }
};
const tagColor = t => STYLE_TAG_COLORS[t?.toLowerCase()] || STYLE_TAG_COLORS.default;

function uid(p = '') { return `${p}${Date.now()}_${Math.random().toString(36).slice(2,9)}`; }

export default function StyleStudio() {
  const [tab, setTab] = useState('closet');
  const [view, setView] = useState(null);
  const [items, setItems] = useState([]);
  const [savedOutfits, setSavedOutfits] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingFeed, setLoadingFeed] = useState(false);
  const [genderPref, setGenderPref] = useState('any');
  const [outfits, setOutfits] = useState([]);
  const [activeOccasion, setActiveOccasion] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [selectedOutfit, setSelectedOutfit] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [pendingItem, setPendingItem] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [feedFilter, setFeedFilter] = useState('all');
  const [savedIds, setSavedIds] = useState(new Set());
  const [rejectedOutfits, setRejectedOutfits] = useState(new Set());
  const [toast, setToast] = useState(null);
  const [userId, setUserId] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [postingOutfit, setPostingOutfit] = useState(null);
  const [showNameSetup, setShowNameSetup] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [postComments, setPostComments] = useState({});
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [showPacking, setShowPacking] = useState(false);
  const [packingResult, setPackingResult] = useState(null);
  const [generatingPack, setGeneratingPack] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileBio, setProfileBio] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [defaultPublic, setDefaultPublic] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [savedBoard, setSavedBoard] = useState(new Set());
  const fileInputRef = useRef(null);
  const profilePhotoInputRef = useRef(null);

  useEffect(() => { boot(); }, []);

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(null), 2400); }

  async function boot() {
    try {
      const ik = await window.storage.list('item:');
      const loaded = [];
      if (ik?.keys) for (const k of ik.keys) { try { const r = await window.storage.get(k); if (r?.value) loaded.push(JSON.parse(r.value)); } catch(e){} }
      loaded.sort((a,b) => b.dateAdded - a.dateAdded);
      setItems(loaded);

      const ok = await window.storage.list('outfit:');
      const sl = [];
      if (ok?.keys) for (const k of ok.keys) { try { const r = await window.storage.get(k); if (r?.value) sl.push(JSON.parse(r.value)); } catch(e){} }
      sl.sort((a,b) => b.dateSaved - a.dateSaved);
      setSavedOutfits(sl);
      setSavedIds(new Set(sl.map(o => o.signature)));

      try { const g = await window.storage.get('gender_pref'); if (g?.value) setGenderPref(g.value); } catch(e){}
      try { const rj = await window.storage.get('rejected_outfits'); if (rj?.value) setRejectedOutfits(new Set(JSON.parse(rj.value))); } catch(e){}

      let uid2;
      try { const u = await window.storage.get('user_id'); uid2 = u?.value; } catch(e){}
      if (!uid2) { uid2 = uid('u_'); try { await window.storage.set('user_id', uid2); } catch(e){} }
      setUserId(uid2);

      try { const n = await window.storage.get('display_name'); if (n?.value) setDisplayName(n.value); } catch(e){}
      try { const b = await window.storage.get('profile_bio'); if (b?.value) setProfileBio(b.value); } catch(e){}
      try { const ph = await window.storage.get('profile_photo'); if (ph?.value) setProfilePhoto(ph.value); } catch(e){}
      try { const dp = await window.storage.get('default_public'); if (dp?.value != null) setDefaultPublic(dp.value === 'true' || dp.value === true); } catch(e){}
      try { const sb = await window.storage.get('saved_board'); if (sb?.value) setSavedBoard(new Set(JSON.parse(sb.value))); } catch(e){}
      try { const l = await window.storage.get('liked_posts'); if (l?.value) setLikedPosts(new Set(JSON.parse(l.value))); } catch(e){}

      await loadFeed();
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function loadFeed() {
    setLoadingFeed(true);
    try {
      const keys = await window.storage.list('post:', true);
      const loaded = [];
      if (keys?.keys) for (const k of keys.keys) { try { const r = await window.storage.get(k, true); if (r?.value) loaded.push(JSON.parse(r.value)); } catch(e){} }
      loaded.sort((a,b) => b.dateCreated - a.dateCreated);
      setPosts(loaded);
    } catch(e) { console.error(e); }
    finally { setLoadingFeed(false); }
  }

  async function saveGenderPref(g) { setGenderPref(g); try { await window.storage.set('gender_pref', g); } catch(e){} }

  async function saveItem(item) { await window.storage.set(`item:${item.id}`, JSON.stringify(item)); setItems(prev => [item, ...prev]); }

  async function deleteItem(id) {
    try { await window.storage.delete(`item:${id}`); setItems(prev => prev.filter(i => i.id !== id)); showToast('Removed from closet'); } catch(e){}
  }

  async function incrementWear(itemIds) {
    const ids = Array.isArray(itemIds) ? itemIds : [itemIds];
    const now = Date.now();
    const updates = [];
    setItems(prev => prev.map(it => {
      if (ids.includes(it.id)) {
        const updated = { ...it, wearCount: (it.wearCount||0)+1, lastWorn: now };
        updates.push(updated);
        return updated;
      }
      return it;
    }));
    for (const u of updates) {
      try { await window.storage.set(`item:${u.id}`, JSON.stringify(u)); } catch(e){}
    }
    showToast(`Logged ${ids.length} ${ids.length===1?'piece':'pieces'} as worn 👟`);
  }

  function outfitSig(outfit, occasion) { return `${occasion}_${(outfit.item_ids||[]).slice().sort().join('-')}`; }

  async function toggleSave(outfit, occasion) {
    const sig = outfitSig(outfit, occasion);
    if (savedIds.has(sig)) {
      const ex = savedOutfits.find(o => o.signature === sig);
      if (ex) { try { await window.storage.delete(`outfit:${ex.id}`); setSavedOutfits(prev => prev.filter(o => o.id !== ex.id)); setSavedIds(prev => { const n=new Set(prev); n.delete(sig); return n; }); showToast('Removed'); } catch(e){} }
    } else {
      const id = uid('out_'); const om = OCCASIONS.find(o => o.id === occasion);
      const saved = { id, signature: sig, ...outfit, occasion, occasionLabel: om?.label||occasion, occasionColor: om?.color, occasionBg: om?.bgColor, occasionEmoji: om?.emoji, dateSaved: Date.now() };
      try { await window.storage.set(`outfit:${id}`, JSON.stringify(saved)); setSavedOutfits(prev => [saved,...prev]); setSavedIds(prev => new Set(prev).add(sig)); showToast('Saved to looks 🌿'); } catch(e){}
    }
  }

  async function deleteSaved(id) {
    const out = savedOutfits.find(o => o.id === id);
    try { await window.storage.delete(`outfit:${id}`); setSavedOutfits(prev => prev.filter(o => o.id !== id)); if (out) setSavedIds(prev => { const n=new Set(prev); n.delete(out.signature); return n; }); showToast('Removed'); } catch(e){}
  }

  async function rejectOutfit(outfit, occasion) {
    const sig = outfitSig(outfit, occasion);
    const next = new Set(rejectedOutfits); next.add(sig);
    setRejectedOutfits(next);
    setOutfits(prev => prev.filter(o => outfitSig({...o, occasion}, occasion) !== sig));
    try { await window.storage.set('rejected_outfits', JSON.stringify([...next])); } catch(e){}
    showToast('Won\'t suggest this again 🚫');
  }

  function requestPost(outfit) { if (!displayName) { setPostingOutfit(outfit); setShowNameSetup(true); } else setPostingOutfit(outfit); }

  async function saveDisplayName(name) {
    const t = name.trim().slice(0,24); if (!t) return;
    setDisplayName(t); try { await window.storage.set('display_name', t); } catch(e){}
    setShowNameSetup(false);
  }

  async function saveProfile({ name, bio, photo, isPublic }) {
    if (name != null) { const t = name.trim().slice(0,24); setDisplayName(t); try { await window.storage.set('display_name', t); } catch(e){} }
    if (bio != null) { const b = bio.slice(0,160); setProfileBio(b); try { await window.storage.set('profile_bio', b); } catch(e){} }
    if (photo != null) { setProfilePhoto(photo); try { await window.storage.set('profile_photo', photo); } catch(e){} }
    if (isPublic != null) { setDefaultPublic(isPublic); try { await window.storage.set('default_public', String(isPublic)); } catch(e){} }
    showToast('Profile updated ✓');
  }

  async function handleProfilePhoto(e) {
    const file = e.target.files?.[0]; if (!file) return;
    try {
      const dataUrl = await compressImage(file);
      await saveProfile({ photo: dataUrl });
    } catch(err) { showToast('Could not set photo'); }
    finally { if (profilePhotoInputRef.current) profilePhotoInputRef.current.value=''; }
  }

  async function toggleBoard(post) {
    const next = new Set(savedBoard);
    if (next.has(post.id)) { next.delete(post.id); showToast('Removed from board'); }
    else { next.add(post.id); showToast('Saved to your board 📌'); }
    setSavedBoard(next);
    try { await window.storage.set('saved_board', JSON.stringify([...next])); } catch(e){}
  }

  async function deleteAccount() {
    if (!confirm('This will erase your closet, looks, posts and profile on this device. This cannot be undone. Continue?')) return;
    try {
      const allKeys = [];
      for (const prefix of ['item:', 'outfit:', 'post:', 'cmt:']) {
        const r = await window.storage.list(prefix).catch(()=>null);
        if (r?.keys) allKeys.push(...r.keys);
      }
      for (const k of allKeys) { try { await window.storage.delete(k); } catch(e){} }
      for (const single of ['display_name','profile_bio','profile_photo','default_public','saved_board','gender_pref','rejected_outfits','liked_posts']) {
        try { await window.storage.delete(single); } catch(e){}
      }
      showToast('Account data cleared');
      setShowSettings(false);
      setTimeout(() => { try { window.location.reload(); } catch(e){} }, 800);
    } catch(e) { showToast('Could not clear data'); }
  }

  async function publishPost(outfit) {
    if (!displayName || !userId) return;
    setPublishing(true);
    try {
      const om = OCCASIONS.find(o => o.id === outfit.occasion);
      const embItems = (outfit.item_ids||[]).map(id => { const it = items.find(i => i.id === id); if (!it) return null; return { id: it.id, name: it.name, brand: it.brand||'', type: it.type, color: it.color, colorHex: it.colorHex, dataUrl: it.dataUrl }; }).filter(Boolean);
      const pid = uid('p_');
      const post = { id: pid, title: outfit.title, vibe: outfit.vibe, styling_tip: outfit.styling_tip||'', occasion: outfit.occasion, occasionLabel: om?.label||outfit.occasion, occasionColor: om?.color, occasionBg: om?.bgColor, occasionEmoji: om?.emoji, items: embItems, author: displayName, authorId: userId, dateCreated: Date.now(), likes: 0 };
      await window.storage.set(`post:${pid}`, JSON.stringify(post), true);
      setPosts(prev => [post,...prev]); setPostingOutfit(null); showToast('Shared to Inspire 🌿');
    } catch(e) { showToast('Could not share'); }
    finally { setPublishing(false); }
  }

  async function deletePost(pid) {
    try { await window.storage.delete(`post:${pid}`, true); setPosts(prev => prev.filter(p => p.id !== pid)); setSelectedPost(null); showToast('Removed'); } catch(e){}
  }

  async function toggleLike(post) {
    if (!userId) return;
    const wasLiked = likedPosts.has(post.id);
    const nl = new Set(likedPosts);
    let nc = post.likes || 0;
    if (wasLiked) { nl.delete(post.id); nc = Math.max(0, nc-1); } else { nl.add(post.id); nc = nc+1; }
    setLikedPosts(nl); setPosts(prev => prev.map(p => p.id === post.id ? {...p, likes: nc} : p));
    if (selectedPost?.id === post.id) setSelectedPost(prev => ({...prev, likes: nc}));
    try {
      await window.storage.set('liked_posts', JSON.stringify([...nl]));
      const r = await window.storage.get(`post:${post.id}`, true);
      if (r?.value) { const fr = JSON.parse(r.value); await window.storage.set(`post:${post.id}`, JSON.stringify({...fr, likes: Math.max(0,(fr.likes||0)+(wasLiked?-1:1))}), true); }
    } catch(e){}
  }

  // ============ COMMENTS ============
  async function loadComments(postId) {
    if (!postId) return;
    setLoadingComments(true);
    try {
      const r = await window.storage.list(`cmt:${postId}_`, true);
      const loaded = [];
      if (r?.keys) for (const k of r.keys) {
        try { const v = await window.storage.get(k, true); if (v?.value) loaded.push(JSON.parse(v.value)); } catch(e){}
      }
      loaded.sort((a,b) => a.dateCreated - b.dateCreated);
      setPostComments(prev => ({...prev, [postId]: loaded}));
    } catch(e) { console.error('loadComments failed', e); }
    finally { setLoadingComments(false); }
  }

  async function addComment(post, text) {
    if (!text?.trim() || !userId) return;
    if (!displayName) { setShowNameSetup(true); return; }
    setSubmittingComment(true);
    try {
      const cid = uid('c_');
      const comment = { id: cid, postId: post.id, text: text.trim().slice(0, 280), author: displayName, authorId: userId, dateCreated: Date.now() };
      await window.storage.set(`cmt:${post.id}_${cid}`, JSON.stringify(comment), true);
      setPostComments(prev => ({ ...prev, [post.id]: [...(prev[post.id]||[]), comment] }));
    } catch(e) { showToast('Could not post'); }
    finally { setSubmittingComment(false); }
  }

  async function deleteComment(post, commentId) {
    try {
      await window.storage.delete(`cmt:${post.id}_${commentId}`, true);
      setPostComments(prev => ({ ...prev, [post.id]: (prev[post.id]||[]).filter(c => c.id !== commentId) }));
    } catch(e) { showToast('Could not remove'); }
  }

  // ============ PACKING LIST ============
  async function generatePackingList(trip) {
    setGeneratingPack(true); setPackingResult(null);
    try {
      const wardrobe = items.map(it => ({id:it.id, name:it.name, brand:it.brand||'', type:it.type, color:it.color, formality:it.formality, style_tags:it.style_tags, occasions:it.occasions, seasons:it.seasons}));
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1500, messages:[{ role:"user", content:`Build a packing list from this wardrobe for a trip.

Destination: ${trip.destination || 'not specified'}
Days: ${trip.days}
Activities: ${trip.activities.join(', ')}
Weather: ${trip.weather || 'unknown'}

Wardrobe:
${JSON.stringify(wardrobe)}

Return ONLY valid JSON, no preamble:
{"summary":"one sentence overview","item_ids":["id1","id2"],"day_outfits":[{"day":1,"plan":"e.g. travel + dinner","item_ids":["id1"]}],"missing":"what they need to buy or pack from outside wardrobe","tips":"one short packing tip"}`}]})
      });
      if (!response.ok) throw new Error(`API ${response.status}`);
      const data = await response.json();
      const text = (data.content||[]).filter(b=>b.type==='text').map(b=>b.text).join('');
      const cleaned = text.replace(/```json|```/g,'').trim();
      let parsed = null;
      try { parsed = JSON.parse(cleaned); } catch(e) {
        const m = text.match(/\{[\s\S]*\}/); if (m) parsed = JSON.parse(m[0]);
      }
      if (!parsed) throw new Error('Could not read response');
      setPackingResult({...parsed, trip});
    } catch(e) { showToast('Could not build packing list'); console.error(e); }
    finally { setGeneratingPack(false); }
  }

  async function compressImage(file) {
    return new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = e => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 700; let {width, height} = img;
          if (width > height && width > maxDim) { height = (height*maxDim)/width; width = maxDim; }
          else if (height > maxDim) { width = (width*maxDim)/height; height = maxDim; }
          const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
          canvas.getContext('2d').drawImage(img, 0, 0, width, height);
          res(canvas.toDataURL('image/jpeg', 0.82));
        };
        img.onerror = rej; img.src = e.target.result;
      };
      reader.onerror = rej; reader.readAsDataURL(file);
    });
  }

  function defaultAnalysis() {
    return {
      brand: '', name: 'New item', type: 'top',
      color: 'unknown', colorHex: '#888888',
      pattern: 'solid', material: 'unknown', formality: 3,
      style_tags: ['classic'], occasions: ['casual'], seasons: ['spring','summer']
    };
  }

  async function analyzeClothing(dataUrl) {
    const base64 = dataUrl.split(',')[1];
    if (!base64) throw new Error('Bad image');

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        messages: [{
          role: "user",
          content: [
            {type:"image", source:{type:"base64", media_type:"image/jpeg", data:base64}},
            {type:"text", text:`Look at this clothing or accessory. Reply with ONLY a JSON object — no preamble, no markdown, no explanation.

Use exactly this format:
{"brand":"brand if visible else empty string","name":"max 5 word description","type":"top OR bottom OR dress OR outerwear OR shoes OR bag OR belt OR jewelry OR hat OR eyewear OR scarf OR other","color":"primary color name","colorHex":"#RRGGBB","pattern":"solid OR striped OR plaid OR floral OR graphic OR other","material":"material or unknown","formality":3,"style_tags":["minimal","classic"],"occasions":["casual"],"seasons":["spring","summer"]}`}
          ]
        }]
      })
    });

    if (!response.ok) {
      const errBody = await response.text().catch(() => '');
      console.error('API error', response.status, errBody);
      throw new Error(`API ${response.status}`);
    }

    const data = await response.json();
    const text = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
    console.log('AI raw response:', text);

    // Robust JSON extraction — finds the JSON object anywhere in the text
    let parsed = null;
    const cleaned = text.replace(/```json|```/g, '').trim();
    try {
      parsed = JSON.parse(cleaned);
    } catch (e1) {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        try { parsed = JSON.parse(match[0]); } catch (e2) {
          console.error('JSON parse failed twice', e2, match[0]);
        }
      }
    }

    if (!parsed) throw new Error('Could not read AI response');

    // Merge with defaults so missing fields don't break the UI
    return { ...defaultAnalysis(), ...parsed };
  }

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setAnalyzing(true);
    setView('add');

    let dataUrl = null;
    try {
      dataUrl = await compressImage(file);
      setPendingItem({dataUrl, analysis: null});
    } catch (compressErr) {
      console.error('Image compress failed:', compressErr);
      setError('Could not read that photo. Try a different image.');
      setAnalyzing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    try {
      const analysis = await analyzeClothing(dataUrl);
      setPendingItem({dataUrl, analysis});
    } catch (analyzeErr) {
      console.error('Analysis failed, using manual entry fallback:', analyzeErr);
      // Don't fail — let the user fill it in manually
      setPendingItem({dataUrl, analysis: defaultAnalysis()});
      setError('AI auto-tag didn\'t work this time — just fill in the details below and tap Add.');
    } finally {
      setAnalyzing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function confirmAdd() {
    if (!pendingItem?.analysis) return;
    const item = {id: uid('it_'), dataUrl: pendingItem.dataUrl, ...pendingItem.analysis, dateAdded: Date.now()};
    await saveItem(item); setPendingItem(null); setView(null); showToast('Added to closet 🌿');
  }

  async function generateOutfits(occasion) {
    if (items.length < 2) { setError('Add at least 2 items first.'); return; }
    setActiveOccasion(occasion); setGenerating(true); setOutfits([]); setError(null); setView('results');
    const wardrobe = items.map(it => ({id:it.id, name:it.name, type:it.type, color:it.color, pattern:it.pattern, material:it.material, formality:it.formality, style_tags:it.style_tags, occasions:it.occasions}));
    const gText = genderPref==='men'?'masculine/menswear':genderPref==='women'?'feminine/womenswear':'any presentation, gender-neutral';
    // Rejected combos for this occasion — tell AI to avoid these exact item groupings
    const rejectedForOccasion = [...rejectedOutfits].filter(sig => sig.startsWith(`${occasion}_`)).map(sig => sig.replace(`${occasion}_`, ''));
    const avoidText = rejectedForOccasion.length > 0
      ? `\n\nThe user has REJECTED these exact item combinations — do NOT recreate them (item ids, sorted):\n${rejectedForOccasion.join('\n')}`
      : '';
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({model:"claude-sonnet-4-20250514", max_tokens:1500, messages:[{role:"user", content:`Professional stylist. 3 distinct outfits for "${occasion}". Direction: ${gText}.\n\nWardrobe:\n${JSON.stringify(wardrobe)}${avoidText}\n\nJSON only:\n{"outfits":[{"title":"max 4 words","vibe":"one sentence","item_ids":["id1"],"styling_tip":"one tip","missing":""}]}`}]})
      });
      if (!response.ok) throw new Error(`API ${response.status}`);
      const data = await response.json();
      const text = data.content.filter(b=>b.type==='text').map(b=>b.text).join('');
      const cleaned = text.replace(/```json|```/g,'').trim();
      let parsed = null;
      try { parsed = JSON.parse(cleaned); } catch(e) { const m = text.match(/\{[\s\S]*\}/); if (m) parsed = JSON.parse(m[0]); }
      const all = (parsed?.outfits)||[];
      // Filter out any that match a rejected signature (belt-and-suspenders)
      const filtered = all.filter(o => !rejectedOutfits.has(`${occasion}_${(o.item_ids||[]).slice().sort().join('-')}`));
      setOutfits(filtered);
      if (filtered.length === 0 && all.length > 0) setError('All suggestions matched ones you rejected. Tap regenerate for fresh looks.');
    } catch(err) { setError('Could not generate outfits. Try again.'); }
    finally { setGenerating(false); }
  }

  const itemById = id => items.find(i => i.id === id);
  function shareOutfit(outfit) {
    const f = outfit.items||(outfit.item_ids||[]).map(itemById).filter(Boolean);
    const text = `${outfit.title}\n${outfit.vibe}\n\n${f.map(i=>`• ${i.brand?i.brand+' ':''}${i.name}`).join('\n')}\n\n${outfit.styling_tip?`Tip: ${outfit.styling_tip}`:''}`.trim();
    if (navigator.share) navigator.share({title:outfit.title, text}).catch(()=>{});
    else if (navigator.clipboard) navigator.clipboard.writeText(text).then(()=>showToast('Copied'));
  }

  const typeCount = items.reduce((acc, it) => { acc[it.type]=(acc[it.type]||0)+1; if (ACCESSORY_TYPES.includes(it.type)) acc['accessories']=(acc['accessories']||0)+1; return acc; }, {});
  function matchesSearch(it) {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      (it.name||'').toLowerCase().includes(q) ||
      (it.brand||'').toLowerCase().includes(q) ||
      (it.color||'').toLowerCase().includes(q) ||
      (it.type||'').toLowerCase().includes(q) ||
      (it.material||'').toLowerCase().includes(q) ||
      (it.pattern||'').toLowerCase().includes(q) ||
      (it.style_tags||[]).some(t => t.toLowerCase().includes(q)) ||
      (it.occasions||[]).some(o => o.toLowerCase().includes(q))
    );
  }
  const filteredItems = (filter==='all' ? items : filter==='accessories' ? items.filter(i=>ACCESSORY_TYPES.includes(i.type)) : items.filter(i=>i.type===filter)).filter(matchesSearch);
  const filteredPosts = feedFilter==='all' ? posts : posts.filter(p=>p.occasion===feedFilter);

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,700;9..144,900&family=Manrope:wght@400;500;600;700;800&display=swap');
    *{-webkit-tap-highlight-color:transparent;box-sizing:border-box}
    body,html{background:${C.bg}}
    .serif{font-family:'Fraunces',Georgia,serif;font-optical-sizing:auto}
    .sans{font-family:'Manrope',system-ui,sans-serif}
    .fade{animation:fadeIn .4s ease both}
    .up{animation:slideUp .45s cubic-bezier(.22,1,.36,1) both}
    .scale{animation:scaleIn .3s cubic-bezier(.34,1.56,.64,1) both}
    .stagger>*{animation:slideUp .5s cubic-bezier(.22,1,.36,1) both;opacity:0}
    .stagger>*:nth-child(1){animation-delay:.04s}
    .stagger>*:nth-child(2){animation-delay:.08s}
    .stagger>*:nth-child(3){animation-delay:.12s}
    .stagger>*:nth-child(4){animation-delay:.16s}
    .stagger>*:nth-child(5){animation-delay:.2s}
    .stagger>*:nth-child(6){animation-delay:.24s}
    .stagger>*:nth-child(7){animation-delay:.28s}
    .stagger>*:nth-child(8){animation-delay:.32s}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes slideUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
    @keyframes scaleIn{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}
    @keyframes pulse{0%,100%{opacity:.45;transform:scale(.9)}50%{opacity:1;transform:scale(1.05)}}
    .pulse{animation:pulse 1.4s ease-in-out infinite}
    @keyframes spin{to{transform:rotate(360deg)}}
    .spin{animation:spin 1s linear infinite}
    @keyframes sway{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}
    .sway{animation:sway 3s ease-in-out infinite}
    @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
    .float{animation:float 4s ease-in-out infinite}
    .scrollbar-hide::-webkit-scrollbar{display:none}
    .scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none}
    .bouncy{transition:transform .15s cubic-bezier(.34,1.56,.64,1)}
    .bouncy:active{transform:scale(.92)}
    .grad-forest{background:linear-gradient(135deg,${C.forest} 0%,${C.forestMid} 100%)}
    .grad-ochre{background:linear-gradient(135deg,${C.ochre} 0%,${C.clay} 100%)}
    .grad-sage{background:linear-gradient(135deg,${C.sageMid} 0%,${C.forestLight} 100%)}
    .grad-bark{background:linear-gradient(135deg,${C.bark} 0%,${C.forest} 100%)}
    .noise::before{content:'';position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.1) 1px,transparent 1px);background-size:4px 4px;pointer-events:none;mix-blend-mode:overlay}
    .texture{background-image:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")}
  `;

  return (
    <div className="sans" style={{minHeight:'100vh',background:C.bg,color:C.ink,paddingBottom:96}}>
      <style>{css}</style>

      {/* Floating deco */}
      <div style={{position:'fixed',top:80,right:12,pointerEvents:'none',zIndex:0}} className="float">
        <SparkDot size={18} color={C.ochreSoft} />
      </div>
      <div style={{position:'fixed',top:220,left:8,pointerEvents:'none',zIndex:0,opacity:.6}} className="float" style2={{animationDelay:'1.5s'}}>
        <LeafDot size={14} color={C.sageSoft} />
      </div>

      {/* Header */}
      <header className="texture" style={{position:'sticky',top:0,zIndex:30,backdropFilter:'blur(16px)',background:`rgba(176,174,136,.94)`,borderBottom:`1px solid ${C.border}`}}>
        <div style={{padding:'14px 20px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          {view ? (
            <button onClick={()=>{setView(null);setPendingItem(null);setError(null);}} style={{display:'flex',alignItems:'center',gap:4,fontSize:14,fontWeight:700,color:C.sageMid,background:'none',border:'none',cursor:'pointer',padding:0}}>
              <ChevronLeft size={18} strokeWidth={2.5}/> Back
            </button>
          ) : (
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <div style={{width:36,height:36,borderRadius:10,background:C.surface,border:`1.5px solid ${C.sage}30`,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 2px 8px rgba(15,32,16,.10)`}}>
                <LeafHangerLogo size={28} fg={C.forest} ac={C.ochre}/>
              </div>
              <span className="serif" style={{fontSize:20,fontWeight:700,letterSpacing:'-0.02em',color:C.ink}}>
                style<span style={{fontStyle:'italic',fontWeight:300,color:C.sage}}>studio</span>
              </span>
            </div>
          )}
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            {!view && tab==='inspire' && (
              <button onClick={loadFeed} className="bouncy" style={{width:32,height:32,borderRadius:'50%',background:C.surface,border:`1px solid ${C.border}`,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:C.sage}}>
                <RefreshCw size={13} strokeWidth={2} className={loadingFeed?'spin':''}/>
              </button>
            )}
            {!view && (
              <button onClick={()=>setShowProfile(true)} className="bouncy" aria-label="Profile" style={{width:36,height:36,borderRadius:'50%',background:profilePhoto?'transparent':C.forest,border:`2px solid ${C.sage}40`,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',overflow:'hidden',padding:0,flexShrink:0}}>
                {profilePhoto
                  ? <img src={profilePhoto} alt="me" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                  : <span style={{fontSize:14,fontWeight:800,color:C.ochre}}>{(displayName||'?').charAt(0).toUpperCase()}</span>}
              </button>
            )}
          </div>
        </div>
      </header>

      <main style={{position:'relative',zIndex:1}}>
        {loading ? (
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'80px 0',gap:12}} className="fade">
            <Leaf size={24} strokeWidth={1.5} className="pulse" style={{color:C.sage}}/>
            <span style={{fontSize:11,fontWeight:800,letterSpacing:'0.2em',textTransform:'uppercase',color:C.sage}}>Loading your closet</span>
          </div>
        ) : view==='add' ? (
          <AddView pendingItem={pendingItem} analyzing={analyzing} error={error} onConfirm={confirmAdd} onCancel={()=>{setPendingItem(null);setView(null);setError(null);}} onUpdate={u=>setPendingItem(prev=>({...prev,analysis:{...prev.analysis,...u}}))}/>
        ) : view==='results' ? (
          <ResultsView occasion={activeOccasion} generating={generating} outfits={outfits} itemById={itemById} onSelect={setSelectedOutfit} error={error} count={items.length} savedIds={savedIds} onSave={o=>toggleSave(o,activeOccasion)} onShare={shareOutfit} onReject={o=>rejectOutfit(o,activeOccasion)} onRegenerate={()=>generateOutfits(activeOccasion)}/>
        ) : tab==='closet' ? (
          <ClosetView items={filteredItems} total={items.length} typeCount={typeCount} filter={filter} setFilter={setFilter} searchQuery={searchQuery} setSearchQuery={setSearchQuery} onAdd={()=>fileInputRef.current?.click()} onDelete={deleteItem} onWear={incrementWear}/>
        ) : tab==='style' ? (
          <StyleView genderPref={genderPref} onGender={saveGenderPref} onOccasion={generateOutfits} count={items.length} onAdd={()=>fileInputRef.current?.click()} onPackTrip={()=>setShowPacking(true)}/>
        ) : tab==='inspire' ? (
          <InspireView posts={filteredPosts} total={posts.length} feedFilter={feedFilter} setFeedFilter={setFeedFilter} loading={loadingFeed} userId={userId} liked={likedPosts} onOpen={setSelectedPost} onLike={toggleLike}/>
        ) : tab==='saved' ? (
          <SavedView saved={savedOutfits} itemById={itemById} onOpen={setSelectedOutfit} onDelete={deleteSaved}/>
        ) : null}
      </main>

      {/* Bottom Nav */}
      {!view && (
        <nav style={{position:'fixed',bottom:0,left:0,right:0,zIndex:30,background:`rgba(15,32,16,.98)`,borderTop:`1px solid rgba(255,255,255,.08)`,backdropFilter:'blur(20px)'}}>
          <div style={{padding:'10px 8px 14px',display:'flex',alignItems:'center',justifyContent:'space-around',maxWidth:440,margin:'0 auto'}}>
            <NavBtn icon={<ShirtIcon/>} label="Closet" active={tab==='closet'} onClick={()=>setTab('closet')} ac={C.ochre}/>
            <NavBtn icon={<Sparkles size={19} strokeWidth={1.8}/>} label="Style" active={tab==='style'} onClick={()=>setTab('style')} ac={C.sand}/>
            <button onClick={()=>fileInputRef.current?.click()} className="bouncy" style={{width:52,height:52,borderRadius:'50%',background:`linear-gradient(135deg,${C.ochre},${C.clay})`,border:'none',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',boxShadow:`0 8px 24px ${C.ochre}60`,position:'relative',marginTop:-8}} aria-label="Add">
              <Camera size={22} strokeWidth={2.4} color="white"/>
            </button>
            <NavBtn icon={<Globe size={19} strokeWidth={1.8}/>} label="Inspire" active={tab==='inspire'} onClick={()=>setTab('inspire')} ac={C.sageSoft}/>
            <NavBtn icon={<Heart size={19} strokeWidth={1.8}/>} label="Looks" active={tab==='saved'} onClick={()=>setTab('saved')} ac={C.ochre} badge={savedOutfits.length}/>
          </div>
        </nav>
      )}

      {selectedOutfit && <OutfitDetail outfit={selectedOutfit} itemById={itemById} onClose={()=>setSelectedOutfit(null)} onShare={shareOutfit} onSave={()=>toggleSave(selectedOutfit, selectedOutfit.occasion||activeOccasion)} isSaved={savedIds.has(outfitSig(selectedOutfit, selectedOutfit.occasion||activeOccasion))} onPost={()=>requestPost(selectedOutfit)} onWear={()=>incrementWear(selectedOutfit.item_ids||[])}/>}
      {selectedPost && <PostDetail post={selectedPost} userId={userId} liked={likedPosts.has(selectedPost.id)} comments={postComments[selectedPost.id]||[]} loadingComments={loadingComments} submittingComment={submittingComment} onLoadComments={()=>loadComments(selectedPost.id)} onAddComment={t=>addComment(selectedPost, t)} onDeleteComment={cid=>deleteComment(selectedPost, cid)} displayName={displayName} onLike={()=>toggleLike(selectedPost)} onShare={()=>shareOutfit(selectedPost)} onDelete={()=>{if(confirm('Remove this post?'))deletePost(selectedPost.id);}} onClose={()=>{setSelectedPost(null);}}/>}
      {showNameSetup && <NameModal initial={displayName} onSave={saveDisplayName} onCancel={()=>{setShowNameSetup(false);setPostingOutfit(null);}}/>}
      {postingOutfit && !showNameSetup && displayName && <PostConfirm outfit={postingOutfit} displayName={displayName} publishing={publishing} itemById={itemById} onConfirm={()=>publishPost(postingOutfit)} onCancel={()=>setPostingOutfit(null)} onChangeName={()=>setShowNameSetup(true)}/>}
      {showPacking && <PackingModal items={items} generating={generatingPack} result={packingResult} itemById={itemById} onGenerate={generatePackingList} onClose={()=>{setShowPacking(false);setPackingResult(null);}}/>}

      {showProfile && <ProfileModal displayName={displayName} bio={profileBio} photo={profilePhoto} isPublic={defaultPublic} posts={posts} userId={userId} savedOutfits={savedOutfits} itemCount={items.length} onEditPhoto={()=>profilePhotoInputRef.current?.click()} onOpenSettings={()=>{setShowProfile(false);setShowSettings(true);}} onOpenPost={p=>{setShowProfile(false);setSelectedPost(p);}} onClose={()=>setShowProfile(false)}/>}

      {showSettings && <SettingsModal displayName={displayName} bio={profileBio} isPublic={defaultPublic} onSave={saveProfile} onDeleteAccount={deleteAccount} onClose={()=>setShowSettings(false)}/>}

      {toast && (
        <div style={{position:'fixed',bottom:100,left:'50%',transform:'translateX(-50%)',zIndex:50}} className="scale">
          <div className="grad-forest noise" style={{position:'relative',padding:'12px 20px',borderRadius:999,fontSize:13,fontWeight:700,color:'white',display:'flex',alignItems:'center',gap:8,boxShadow:`0 10px 32px ${C.forest}80`,whiteSpace:'nowrap'}}>
            <SparkDot size={10} color={C.ochre}/> {toast}
          </div>
        </div>
      )}

      <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handleFile} style={{display:'none'}}/>
      <input ref={profilePhotoInputRef} type="file" accept="image/*" onChange={handleProfilePhoto} style={{display:'none'}}/>
    </div>
  );
}

function NavBtn({icon, label, active, onClick, ac, badge}) {
  return (
    <button onClick={onClick} style={{position:'relative',display:'flex',flexDirection:'column',alignItems:'center',gap:2,padding:'4px 10px',background:'none',border:'none',cursor:'pointer',flex:1}} className="bouncy">
      <div style={{color: active ? ac : 'rgba(255,255,255,.35)', transition:'color .2s'}}>{icon}</div>
      <span style={{fontSize:'9.5px',fontWeight:800,letterSpacing:'.05em',textTransform:'uppercase',color: active ? ac : 'rgba(255,255,255,.35)'}}>{label}</span>
      {active && <div style={{position:'absolute',bottom:-2,width:4,height:4,borderRadius:'50%',background:ac}}/>}
      {badge>0 && <span style={{position:'absolute',top:0,right:2,minWidth:15,height:15,padding:'0 3px',borderRadius:999,background:C.ochre,color:'white',fontSize:9,fontWeight:800,display:'flex',alignItems:'center',justifyContent:'center'}} className="scale">{badge}</span>}
    </button>
  );
}

function ShirtIcon() {
  return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>;
}

function SectionTag({children, color=C.sage}) {
  return <div style={{display:'inline-flex',alignItems:'center',gap:6,padding:'4px 12px',borderRadius:999,background:color,color:C.surface,fontSize:10,fontWeight:800,letterSpacing:'0.18em',textTransform:'uppercase',marginBottom:8}}><SparkDot size={8} color={C.ochreSoft}/>{children}</div>;
}

// ============ CLOSET VIEW ============
function ClosetView({items, total, typeCount, filter, setFilter, searchQuery, setSearchQuery, onAdd, onDelete, onWear}) {
  if (total === 0) {
    return (
      <div style={{padding:'28px 18px'}} className="fade">
        <div className="grad-forest noise texture" style={{borderRadius:28,padding:'32px 24px',position:'relative',overflow:'hidden',color:'white'}}>
          <div style={{position:'absolute',top:16,right:20}} className="float"><LeafDot size={32} color={`${C.ochre}40`}/></div>
          <div style={{position:'absolute',bottom:16,left:16,opacity:.4}} className="float" ><SparkDot size={24} color={C.sand}/></div>
          <div style={{position:'relative'}}>
            <div style={{fontSize:11,fontWeight:800,letterSpacing:'0.2em',textTransform:'uppercase',color:C.ochre,marginBottom:10}}>Welcome</div>
            <h2 className="serif" style={{fontSize:34,fontWeight:700,lineHeight:1.05,letterSpacing:'-0.02em',marginBottom:12,margin:'0 0 12px'}}>
              Your wardrobe,<br/><span style={{fontStyle:'italic',fontWeight:300}}>styled by AI.</span>
            </h2>
            <p style={{fontSize:15,opacity:.9,lineHeight:1.6,margin:'0 0 24px'}}>
              For everyone. Photograph your clothes, shoes, belts, bags, jewelry — we catalog every piece by brand, color, and style.
            </p>
          </div>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginTop:14}}>
          {[{icon:'📸',t:'Snap it',d:'Quick photo'},{icon:'🪄',t:'AI tags it',d:'Brand, color, style'},{icon:'✨',t:'Style me',d:'Outfits on tap'}].map((s,i)=>(
            <div key={i} style={{borderRadius:20,padding:'14px 10px',textAlign:'center',background:C.surface,border:`1px solid ${C.border}`}}>
              <div style={{fontSize:24,marginBottom:6}}>{s.icon}</div>
              <div style={{fontSize:11,fontWeight:800,color:C.ink}}>{s.t}</div>
              <div style={{fontSize:10,color:C.inkSoft,marginTop:2}}>{s.d}</div>
            </div>
          ))}
        </div>

        <button onClick={onAdd} className="grad-ochre noise bouncy" style={{marginTop:16,width:'100%',padding:'16px',borderRadius:20,border:'none',color:'white',fontWeight:800,fontSize:16,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8,position:'relative',boxShadow:`0 10px 28px ${C.ochre}50`}}>
          <Camera size={18} strokeWidth={2.4}/> Add your first piece
        </button>

        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8,marginTop:24}}>
          {[[C.sageSoft,'👕'],[C.sageSoft,'👖'],[C.claySoft,'👟'],[C.sageSoft,'🧥'],[C.sageSoft,'👗'],[C.ochreSoft,'👜'],[C.sageSoft,'🕶️'],[C.claySoft,'🧢']].map(([bg,e],i)=>(
            <div key={i} style={{aspectRatio:'1',borderRadius:18,background:bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:24}}>{e}</div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="fade">
      <div style={{padding:'16px 20px 8px'}}>
        <h2 className="serif" style={{fontSize:32,fontWeight:700,letterSpacing:'-0.02em',color:C.ink,margin:0}}>
          Your <span style={{fontStyle:'italic',fontWeight:300,color:C.sage}}>closet</span>
        </h2>
        <p style={{fontSize:13,color:C.inkSoft,fontWeight:600,marginTop:4}}>
          <span style={{color:C.sage,fontWeight:800}}>{total}</span> {total===1?'piece':'pieces'} ready to style
        </p>
      </div>

      {total > 0 && (
        <div style={{padding:'4px 20px 12px'}}>
          <div style={{position:'relative'}}>
            <svg style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:C.sage,pointerEvents:'none'}} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7"/>
              <line x1="21" y1="21" x2="16.5" y2="16.5"/>
            </svg>
            <input
              value={searchQuery}
              onChange={e=>setSearchQuery(e.target.value)}
              placeholder="Search by brand, color, style, type…"
              style={{
                width:'100%',
                padding:'12px 40px 12px 40px',
                borderRadius:999,
                fontSize:13,
                fontWeight:600,
                border:`2px solid ${C.sage}30`,
                background:C.surface,
                color:C.ink,
                outline:'none',
                fontFamily:'inherit'
              }}
            />
            {searchQuery && (
              <button onClick={()=>setSearchQuery('')} style={{position:'absolute',right:8,top:'50%',transform:'translateY(-50%)',width:26,height:26,borderRadius:'50%',background:C.forest,border:'none',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'white'}} className="bouncy">
                <X size={12} strokeWidth={2.5}/>
              </button>
            )}
          </div>
        </div>
      )}

      {total >= 2 && (
        <div style={{padding:'4px 20px 0'}}>
          <div className="grad-forest noise" style={{borderRadius:18,padding:'12px 14px',position:'relative',overflow:'hidden'}}>
            <div style={{fontSize:9,fontWeight:800,letterSpacing:'0.18em',textTransform:'uppercase',color:C.ochre,marginBottom:8}}>Your wardrobe breakdown</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4, 1fr)',gap:8}}>
              {(() => {
                const breakdown = [
                  { label:'Tops',     count: typeCount['top']||0,                                                                   icon:'👕' },
                  { label:'Bottoms',  count: typeCount['bottom']||0,                                                                icon:'👖' },
                  { label:'Shoes',    count: typeCount['shoes']||0,                                                                 icon:'👟' },
                  { label:'Outerwear',count: typeCount['outerwear']||0,                                                             icon:'🧥' },
                  { label:'Dresses',  count: typeCount['dress']||0,                                                                 icon:'👗' },
                  { label:'Bags',     count: typeCount['bag']||0,                                                                   icon:'👜' },
                  { label:'Eyewear',  count: typeCount['eyewear']||0,                                                               icon:'🕶️' },
                  { label:'Hats',     count: typeCount['hat']||0,                                                                   icon:'🧢' },
                  { label:'Belts',    count: typeCount['belt']||0,                                                                  icon:'belt' },
                  { label:'Jewelry',  count: typeCount['jewelry']||0,                                                               icon:'💍' },
                  { label:'Scarves',  count: typeCount['scarf']||0,                                                                 icon:'🧣' },
                  { label:'Other',    count: typeCount['other']||0,                                                                 icon:'✨' },
                ].filter(b => b.count > 0).slice(0, 8);
                return breakdown.map((b,i) => (
                  <div key={i} style={{textAlign:'center',padding:'6px 4px',borderRadius:12,background:'rgba(255,255,255,.08)'}}>
                    <div style={{fontSize:14,marginBottom:2}}>{b.icon==='belt'?<span style={{color:C.ochre}}><BeltIcon size={13}/></span>:b.icon}</div>
                    <div className="serif" style={{fontSize:18,fontWeight:700,color:'white',lineHeight:1}}>{b.count}</div>
                    <div style={{fontSize:8,fontWeight:800,letterSpacing:'0.08em',textTransform:'uppercase',color:'rgba(255,255,255,.6)',marginTop:2}}>{b.label}</div>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      )}

      <div style={{marginTop:10,marginBottom:14,overflowX:'auto'}} className="scrollbar-hide">
        <div style={{display:'flex',gap:8,padding:'0 20px',width:'max-content'}}>
          {TYPE_FILTERS.map(f => {
            const active = filter===f.id;
            const count = f.id==='all'?total:(typeCount[f.id]||0);
            if (f.id!=='all' && count===0) return null;
            return (
              <button key={f.id} onClick={()=>setFilter(f.id)} className="bouncy" style={{display:'flex',alignItems:'center',gap:6,padding:'7px 14px',borderRadius:999,fontSize:11,fontWeight:800,whiteSpace:'nowrap',background: active?C.forest:C.surface,color: active?'white':C.ink,border:`2px solid ${active?C.forest:`${C.sage}30`}`,cursor:'pointer',boxShadow:active?`0 4px 14px ${C.forest}40`:'none'}}>
                <span style={{fontSize:13}}>{f.icon==='belt'?<BeltIcon size={13}/>:f.icon}</span>
                {f.label}
                <span style={{opacity:.7,fontWeight:800,fontSize:10,color:active?'white':C.sage}}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {items.length===0 ? (
        <div style={{padding:'48px 20px',textAlign:'center'}} className="fade">
          <div style={{fontSize:36,marginBottom:8}}>{searchQuery ? '🔍' : '🪞'}</div>
          <div style={{fontSize:14,color:C.inkSoft,fontWeight:600}}>
            {searchQuery ? <>No matches for "<b style={{color:C.ink}}>{searchQuery}</b>"</> : 'Nothing here yet'}
          </div>
          {searchQuery && (
            <button onClick={()=>setSearchQuery('')} className="bouncy" style={{marginTop:12,padding:'8px 14px',borderRadius:999,background:C.forest,border:'none',color:'white',fontWeight:800,fontSize:12,cursor:'pointer'}}>
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div style={{padding:'0 14px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}} className="stagger">
          {items.map(item => <ClosetCard key={item.id} item={item} onDelete={onDelete} onWear={onWear}/>)}
        </div>
      )}
    </div>
  );
}

function ClosetCard({item, onDelete, onWear}) {
  const [acts, setActs] = useState(false);
  const tm = TYPE_FILTERS.find(t=>t.id===item.type);
  const wears = item.wearCount || 0;
  return (
    <div onClick={()=>setActs(s=>!s)} className="bouncy" style={{borderRadius:20,overflow:'hidden',background:C.surface,border:`1px solid ${C.border}`,boxShadow:`0 2px 10px rgba(0,0,0,.25)`,cursor:'pointer',position:'relative'}}>
      <div style={{aspectRatio:'3/4',overflow:'hidden',position:'relative',background:item.colorHex||C.bgDeep}}>
        <img src={item.dataUrl} alt={item.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
        <div style={{position:'absolute',top:8,left:8,background:`rgba(251,247,237,.94)`,backdropFilter:'blur(8px)',borderRadius:12,padding:'3px 8px',fontSize:9,fontWeight:800,textTransform:'uppercase',letterSpacing:'.1em',display:'flex',alignItems:'center',gap:4,color:C.ink}}>
          {tm?.icon==='belt'?<BeltIcon size={9}/>:<span style={{fontSize:11}}>{tm?.icon}</span>} {tm?.label}
        </div>
        {wears > 0 && (
          <div style={{position:'absolute',top:8,right:8,background:C.forest,color:C.ochre,borderRadius:12,padding:'3px 7px',fontSize:9,fontWeight:800,letterSpacing:'.05em',display:'flex',alignItems:'center',gap:3,boxShadow:'0 2px 6px rgba(0,0,0,0.2)'}}>
            <span>👟</span> {wears}
          </div>
        )}
        {item.colorHex && <div style={{position:'absolute',bottom:8,left:8,width:18,height:18,borderRadius:'50%',background:item.colorHex,border:'2px solid white',boxShadow:'0 1px 4px rgba(0,0,0,.2)'}}/>}
      </div>
      <div style={{padding:'10px 12px'}}>
        {item.brand && <div style={{fontSize:9,fontWeight:800,letterSpacing:'.18em',textTransform:'uppercase',color:C.sage,marginBottom:2}}>{item.brand}</div>}
        <div className="serif" style={{fontSize:14,fontWeight:700,letterSpacing:'-0.01em',color:C.ink,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{item.name}</div>
        {item.style_tags?.length>0 && (
          <div style={{display:'flex',flexWrap:'wrap',gap:4,marginTop:6}}>
            {item.style_tags.slice(0,2).map(tag => { const c=tagColor(tag); return <span key={tag} style={{fontSize:9,padding:'2px 7px',borderRadius:999,fontWeight:800,textTransform:'uppercase',letterSpacing:'.08em',background:c.bg,color:c.fg}}>{tag}</span>; })}
          </div>
        )}
      </div>
      {acts && (
        <div style={{position:'absolute',top:8,right:8,display:'flex',flexDirection:'column',gap:6}} className="fade">
          <button onClick={e=>{e.stopPropagation();onWear&&onWear(item.id);setActs(false);}} title="Mark as worn" style={{width:32,height:32,borderRadius:'50%',background:C.ochre,border:'none',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'white',boxShadow:'0 3px 10px rgba(0,0,0,0.25)'}}>
            <span style={{fontSize:14}}>👟</span>
          </button>
          <button onClick={e=>{e.stopPropagation();if(confirm(`Remove ${item.name}?`))onDelete(item.id);}} title="Remove" style={{width:32,height:32,borderRadius:'50%',background:C.forest,border:'none',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'white',boxShadow:'0 3px 10px rgba(0,0,0,0.25)'}}>
            <Trash2 size={13} strokeWidth={2.2}/>
          </button>
        </div>
      )}
    </div>
  );
}

// ============ ADD ITEM VIEW ============
function AddView({pendingItem, analyzing, error, onConfirm, onCancel, onUpdate}) {
  if (!pendingItem) return <div style={{padding:24,textAlign:'center'}}><Loader2 className="spin" size={20} style={{color:C.sage}}/></div>;
  const a = pendingItem.analysis;
  return (
    <div className="fade" style={{paddingBottom:80}}>
      <div style={{padding:'16px 20px 20px'}}>
        <SectionTag color={C.forest}>New piece</SectionTag>
        <h2 className="serif" style={{fontSize:30,fontWeight:700,letterSpacing:'-0.02em',color:C.ink,margin:0}}>
          {analyzing ? <>Reading the <span style={{fontStyle:'italic',fontWeight:300,color:C.sage}}>details</span>…</> : a ? <>Confirm <span style={{fontStyle:'italic',fontWeight:300,color:C.sage}}>details</span></> : 'Loading…'}
        </h2>
      </div>

      <div style={{padding:'0 18px'}}>
        <div style={{borderRadius:24,overflow:'hidden',marginBottom:20,boxShadow:`0 8px 32px rgba(0,0,0,.35)`}}>
          <div style={{aspectRatio:'4/5',position:'relative',background:a?.colorHex||C.bgDeep}}>
            <img src={pendingItem.dataUrl} alt="new" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
            {analyzing && (
              <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:12,background:'rgba(242,232,208,.90)',backdropFilter:'blur(8px)'}}>
                <Leaf size={30} strokeWidth={1.5} className="pulse" style={{color:C.sage}}/>
                <div style={{fontSize:11,fontWeight:800,letterSpacing:'0.2em',textTransform:'uppercase',color:C.sageMid}}>Analyzing</div>
              </div>
            )}
          </div>
        </div>

        {error && <div style={{padding:'12px 16px',borderRadius:16,fontSize:13,fontWeight:700,background:C.claySoft,color:C.bark,marginBottom:16}}>{error}</div>}

        {a && !analyzing && (
          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              <div>
                <label style={{fontSize:10,fontWeight:800,letterSpacing:'0.18em',textTransform:'uppercase',color:C.sage}}>Brand <span style={{fontSize:9,opacity:.7,letterSpacing:0,textTransform:'none'}}>optional</span></label>
                <input value={a.brand||''} onChange={e=>onUpdate({brand:e.target.value})} placeholder="e.g. Nike, Zara" className="serif" style={{width:'100%',marginTop:6,padding:'10px 12px',borderRadius:14,fontSize:15,fontWeight:700,border:`2px solid ${C.borderStrong}`,background:C.surface,color:C.ink,outline:'none'}}/>
              </div>
              <div>
                <label style={{fontSize:10,fontWeight:800,letterSpacing:'0.18em',textTransform:'uppercase',color:C.sage}}>Product name</label>
                <input value={a.name||''} onChange={e=>onUpdate({name:e.target.value})} placeholder="Air Force 1" className="serif" style={{width:'100%',marginTop:6,padding:'10px 12px',borderRadius:14,fontSize:15,fontWeight:700,border:`2px solid ${C.borderStrong}`,background:C.surface,color:C.ink,outline:'none'}}/>
              </div>
            </div>

            <div>
              <label style={{fontSize:10,fontWeight:800,letterSpacing:'0.18em',textTransform:'uppercase',color:C.sage}}>Category</label>
              <div style={{marginTop:8,display:'flex',flexDirection:'column',gap:10}}>
                {CATEGORY_GROUPS.map(group=>(
                  <div key={group.label}>
                    <div style={{fontSize:9,fontWeight:800,letterSpacing:'0.15em',textTransform:'uppercase',color:group.color,marginBottom:6,display:'flex',alignItems:'center',gap:5}}>
                      <div style={{width:3,height:3,borderRadius:'50%',background:group.color}}/> {group.label}
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:6}}>
                      {group.types.map(tid => {
                        const t = TYPE_FILTERS.find(f=>f.id===tid); if (!t) return null;
                        const active = a.type===tid;
                        return <button key={tid} onClick={()=>onUpdate({type:tid})} className="bouncy" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:5,padding:'8px 4px',borderRadius:12,fontSize:11,fontWeight:800,cursor:'pointer',background:active?C.forest:C.surface,color:active?'white':C.ink,border:`2px solid ${active?C.forest:C.border}`}}>
                          {t.icon==='belt'?<BeltIcon size={11}/>:<span style={{fontSize:12}}>{t.icon}</span>} {t.label}
                        </button>;
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
              {[['Color',a.color,a.colorHex],['Material',a.material||'—',null],['Pattern',a.pattern,null],['Formality','●'.repeat(a.formality||0)+'○'.repeat(5-(a.formality||0)),null]].map(([l,v,hex])=>(
                <div key={l} style={{padding:'10px 12px',borderRadius:14,background:C.surface,border:`1px solid ${C.border}`}}>
                  <div style={{fontSize:9,fontWeight:800,letterSpacing:'0.15em',textTransform:'uppercase',color:C.sage}}>{l}</div>
                  <div className="serif" style={{fontSize:14,fontWeight:700,marginTop:2,color:C.ink,display:'flex',alignItems:'center',gap:5,textTransform:'capitalize'}}>
                    {hex && <span style={{width:12,height:12,borderRadius:'50%',background:hex,border:`1px solid ${C.border}`,flexShrink:0}}/>}
                    {v}
                  </div>
                </div>
              ))}
            </div>

            {a.style_tags?.length>0 && (
              <div>
                <div style={{fontSize:10,fontWeight:800,letterSpacing:'0.18em',textTransform:'uppercase',color:C.sage,marginBottom:8}}>Style</div>
                <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                  {a.style_tags.map(t=>{const c=tagColor(t);return <span key={t} style={{padding:'6px 12px',borderRadius:999,fontSize:11,fontWeight:800,textTransform:'capitalize',background:c.bg,color:c.fg}}>{t}</span>;})}
                </div>
              </div>
            )}

            {a.occasions?.length>0 && (
              <div>
                <div style={{fontSize:10,fontWeight:800,letterSpacing:'0.18em',textTransform:'uppercase',color:C.sage,marginBottom:8}}>Perfect for</div>
                <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                  {a.occasions.map(t=>{const occ=OCCASIONS.find(o=>o.id===t);return <span key={t} style={{padding:'6px 12px',borderRadius:999,fontSize:11,fontWeight:800,background:occ?.bgColor||C.sandSoft,color:occ?.color||C.ink,display:'flex',alignItems:'center',gap:4}}>{occ?.emoji} {occ?.label||t}</span>;})}
                </div>
              </div>
            )}

            <div style={{display:'flex',gap:10,paddingTop:4}}>
              <button onClick={onCancel} className="bouncy" style={{flex:1,padding:'14px',borderRadius:18,fontSize:14,fontWeight:800,background:C.surface,border:`2px solid ${C.borderStrong}`,color:C.ink,cursor:'pointer'}}>Discard</button>
              <button onClick={onConfirm} className="grad-forest noise bouncy" style={{flex:1,padding:'14px',borderRadius:18,fontSize:14,fontWeight:800,color:'white',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6,position:'relative',boxShadow:`0 8px 24px ${C.forest}50`}}>
                <Check size={16} strokeWidth={2.5}/> Add to closet
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============ STYLE VIEW ============
function StyleView({genderPref, onGender, onOccasion, count, onAdd, onPackTrip}) {
  if (count < 2) {
    return (
      <div style={{padding:'28px 18px'}} className="fade">
        <div className="grad-bark noise" style={{borderRadius:28,padding:'32px 24px',color:'white',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',top:16,right:16}} className="float"><LeafDot size={28} color={`${C.sand}50`}/></div>
          <div style={{position:'relative'}}>
            <SectionTag color={`rgba(255,255,255,.2)`}>Style assistant</SectionTag>
            <h2 className="serif" style={{fontSize:30,fontWeight:700,letterSpacing:'-0.02em',margin:'8px 0 12px'}}>Add a few <span style={{fontStyle:'italic',fontWeight:300}}>pieces</span> first.</h2>
            <p style={{fontSize:14,opacity:.9,lineHeight:1.6,margin:'0 0 20px'}}>Need at least 2 items to mix & match outfits for you.</p>
            <button onClick={onAdd} style={{padding:'12px 20px',borderRadius:999,fontSize:13,fontWeight:800,background:'white',color:C.bark,border:'none',cursor:'pointer',display:'flex',alignItems:'center',gap:6}} className="bouncy">
              <Camera size={15} strokeWidth={2.4}/> Add a piece
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fade">
      <div style={{padding:'16px 20px 20px'}}>
        <SectionTag color={C.sageMid}>Style me</SectionTag>
        <h2 className="serif" style={{fontSize:32,fontWeight:700,letterSpacing:'-0.02em',color:C.ink,margin:'8px 0 0'}}>
          Where are you <span style={{fontStyle:'italic',fontWeight:300,color:C.sage}}>going?</span>
        </h2>
      </div>

      <div style={{padding:'0 20px 16px'}}>
        <div style={{fontSize:10,fontWeight:800,letterSpacing:'0.18em',textTransform:'uppercase',color:C.sage,marginBottom:8}}>Styling for</div>
        <div style={{display:'flex',gap:4,padding:4,borderRadius:999,background:C.surface,border:`1px solid ${C.border}`}}>
          {[{id:'women',l:'Women',e:'♀'},{id:'men',l:'Men',e:'♂'},{id:'any',l:'Open',e:'✦'}].map(opt=>{
            const ac = genderPref===opt.id;
            return <button key={opt.id} onClick={()=>onGender(opt.id)} className="bouncy" style={{flex:1,padding:'10px 4px',borderRadius:999,fontSize:12,fontWeight:800,display:'flex',alignItems:'center',justifyContent:'center',gap:5,background:ac?C.forest:'transparent',color:ac?'white':C.inkSoft,border:'none',cursor:'pointer'}}>
              <span style={{color:ac?C.ochre:'currentColor'}}>{opt.e}</span> {opt.l}
            </button>;
          })}
        </div>
      </div>

      <div style={{padding:'0 20px 12px',fontSize:10,fontWeight:800,letterSpacing:'0.18em',textTransform:'uppercase',color:C.sage}}>Pick an occasion</div>

      <div style={{padding:'0 14px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}} className="stagger">
        {OCCASIONS.map(o=>(
          <button key={o.id} onClick={()=>onOccasion(o.id)} className="bouncy" style={{textAlign:'left',padding:'18px 16px',borderRadius:22,background:o.bgColor,border:`1px solid ${o.color}30`,cursor:'pointer'}}>
            <div style={{fontSize:28,marginBottom:10}}>{o.emoji}</div>
            <div className="serif" style={{fontSize:18,fontWeight:700,letterSpacing:'-0.01em',color:C.ink,lineHeight:1.1}}>{o.label}</div>
            <div style={{fontSize:11,fontWeight:700,color:o.color,marginTop:4}}>{o.sub}</div>
          </button>
        ))}
      </div>

      <div style={{padding:'24px 20px 12px',fontSize:10,fontWeight:800,letterSpacing:'0.18em',textTransform:'uppercase',color:C.sage}}>Going somewhere?</div>

      <div style={{padding:'0 14px'}}>
        <button onClick={onPackTrip} className="grad-bark noise bouncy" style={{width:'100%',padding:'18px 18px',borderRadius:22,border:'none',color:'white',cursor:'pointer',display:'flex',alignItems:'center',gap:14,textAlign:'left',position:'relative',overflow:'hidden',boxShadow:`0 8px 24px ${C.bark}50`}}>
          <div style={{fontSize:34}}>🧳</div>
          <div style={{flex:1}}>
            <div className="serif" style={{fontSize:18,fontWeight:700,letterSpacing:'-0.01em'}}>Pack for a trip</div>
            <div style={{fontSize:11,fontWeight:700,opacity:.75,marginTop:2}}>AI builds your packing list from your closet</div>
          </div>
          <div style={{fontSize:18,fontWeight:800,color:C.ochre}}>→</div>
        </button>
      </div>
    </div>
  );
}

// ============ RESULTS VIEW ============
function ResultsView({occasion, generating, outfits, itemById, onSelect, error, count, savedIds, onSave, onShare, onReject, onRegenerate}) {
  const om = OCCASIONS.find(o=>o.id===occasion);
  return (
    <div className="fade">
      <div style={{padding:'16px 20px 20px'}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:6,padding:'5px 12px',borderRadius:999,background:om?.bgColor,color:om?.color,fontSize:11,fontWeight:800,marginBottom:10}}>
          <span style={{fontSize:16}}>{om?.emoji}</span> {om?.label}
        </div>
        <h2 className="serif" style={{fontSize:32,fontWeight:700,letterSpacing:'-0.02em',color:C.ink,margin:0}}>
          {generating?<>Composing <span style={{fontStyle:'italic',fontWeight:300,color:C.sage}}>looks</span>…</>:<>Rate your <span style={{fontStyle:'italic',fontWeight:300,color:C.sage}}>looks</span></>}
        </h2>
        {!generating && outfits.length>0 && (
          <p style={{fontSize:12,color:C.inkSoft,fontWeight:600,marginTop:6}}>
            <span style={{color:'#3A7D44',fontWeight:800}}>✓ keep</span> the ones you love · <span style={{color:'#C0392B',fontWeight:800}}>✕ ditch</span> ones to never see again
          </p>
        )}
      </div>

      {generating && (
        <div style={{margin:'0 18px',padding:'28px 20px',borderRadius:22,background:om?.bgColor,textAlign:'center'}}>
          <Leaf size={26} strokeWidth={1.5} className="pulse" style={{color:om?.color,margin:'0 auto 12px'}}/>
          <div className="serif" style={{fontSize:16,fontWeight:500,fontStyle:'italic',color:om?.color}}>Curating from your {count} pieces…</div>
        </div>
      )}

      {error && <div style={{margin:'0 18px 14px',padding:'12px 16px',borderRadius:16,fontSize:13,fontWeight:700,background:C.claySoft,color:C.bark}}>{error}</div>}

      {!generating && outfits.length>0 && (
        <div style={{padding:'0 14px',display:'flex',flexDirection:'column',gap:14}} className="stagger">
          {outfits.map((outfit,idx)=>{
            const sig = `${occasion}_${(outfit.item_ids||[]).slice().sort().join('-')}`;
            const saved = savedIds.has(sig);
            return <OutfitCard key={sig} outfit={{...outfit,occasion}} idx={idx} itemById={itemById} onTap={()=>onSelect({...outfit,occasion})} onSave={()=>onSave(outfit)} onShare={()=>onShare(outfit)} onReject={()=>onReject(outfit)} isSaved={saved} om={om}/>;
          })}
        </div>
      )}

      {!generating && (outfits.length>0 || error) && (
        <div style={{padding:'18px 14px 8px'}}>
          <button onClick={onRegenerate} className="bouncy" style={{width:'100%',padding:'14px',borderRadius:18,fontSize:14,fontWeight:800,background:C.surface,border:`2px solid ${C.sage}40`,color:C.sage,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
            <RefreshCw size={15} strokeWidth={2.2}/> Generate fresh looks
          </button>
        </div>
      )}
    </div>
  );
}

function OutfitCard({outfit, idx, itemById, onTap, onSave, onShare, onReject, isSaved, om}) {
  const its = (outfit.item_ids||[]).map(itemById).filter(Boolean);
  const lookLabel = ['First look','Second look','Third look'][idx] || `Look ${idx+1}`;
  const [leaving, setLeaving] = useState(null); // 'save' | 'reject'

  function handleSave(e) { e.stopPropagation(); onSave(); setLeaving('save'); }
  function handleReject(e) { e.stopPropagation(); setLeaving('reject'); setTimeout(() => onReject(), 260); }

  return (
    <div onClick={onTap} className="bouncy" style={{
      borderRadius:22, overflow:'hidden', background:C.surface, border:`1px solid ${C.border}`,
      boxShadow:`0 4px 20px rgba(0,0,0,.28)`, cursor:'pointer',
      transition:'transform .25s ease, opacity .25s ease',
      transform: leaving==='reject' ? 'translateX(-120%) rotate(-6deg)' : leaving==='save' ? 'scale(0.97)' : 'none',
      opacity: leaving==='reject' ? 0 : 1,
      borderColor: leaving==='save' ? '#3A7D44' : C.border
    }}>
      <div style={{padding:'16px 16px 12px'}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:4,padding:'3px 8px',borderRadius:999,background:om?.bgColor,color:om?.color,fontSize:9,fontWeight:800,textTransform:'uppercase',letterSpacing:'.1em',marginBottom:8}}>{lookLabel}</div>
        <div className="serif" style={{fontSize:22,fontWeight:700,letterSpacing:'-0.02em',color:C.ink,lineHeight:1.15}}>{outfit.title}</div>
        <p style={{fontSize:13,color:C.inkSoft,fontWeight:600,margin:'6px 0 0',lineHeight:1.5}}>{outfit.vibe}</p>
      </div>

      <div style={{padding:'0 12px 12px',display:'flex',gap:8,overflowX:'auto'}} className="scrollbar-hide">
        {its.map(it=>(
          <div key={it.id} style={{flexShrink:0,width:88}}>
            <div style={{aspectRatio:'3/4',borderRadius:14,overflow:'hidden',background:it.colorHex||C.bgDeep}}>
              <img src={it.dataUrl} alt={it.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
            </div>
            <div style={{fontSize:9,fontWeight:700,color:C.inkSoft,marginTop:5,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
              {it.brand?`${it.brand} · `:''}{it.name}
            </div>
          </div>
        ))}
      </div>

      {outfit.missing && <div style={{margin:'0 12px 12px',padding:'8px 12px',borderRadius:12,fontSize:11,fontWeight:700,background:C.sandSoft,color:C.clay,display:'flex',gap:6}}><span>💡</span><span><b>Missing:</b> {outfit.missing}</span></div>}

      {/* Rate row — green check / red X */}
      <div style={{display:'flex',gap:10,padding:'0 12px 14px',alignItems:'center'}}>
        <button onClick={handleReject} className="bouncy" style={{flex:1,padding:'13px',borderRadius:16,border:`2px solid #C0392B`,background: leaving==='reject'?'#C0392B':'transparent',color: leaving==='reject'?'white':'#C0392B',fontWeight:800,fontSize:14,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
          <X size={18} strokeWidth={3}/> Never
        </button>
        <button onClick={handleSave} className="bouncy" style={{flex:1,padding:'13px',borderRadius:16,border:`2px solid #3A7D44`,background: (isSaved||leaving==='save')?'#3A7D44':'transparent',color: (isSaved||leaving==='save')?'white':'#3A7D44',fontWeight:800,fontSize:14,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
          <Check size={18} strokeWidth={3}/> {(isSaved||leaving==='save')?'Saved':'Keep'}
        </button>
        <button onClick={e=>{e.stopPropagation();onShare();}} className="bouncy" style={{width:46,padding:'13px 0',borderRadius:16,border:`2px solid ${C.borderStrong}`,background:C.surface,color:C.inkSoft,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <Share2 size={15} strokeWidth={2}/>
        </button>
      </div>
    </div>
  );
}

// ============ INSPIRE VIEW ============
function InspireView({posts, total, feedFilter, setFeedFilter, loading, userId, liked, onOpen, onLike}) {
  return (
    <div className="fade">
      <div style={{padding:'16px 20px 16px'}}>
        <SectionTag color={C.sageMid}>Community</SectionTag>
        <h2 className="serif" style={{fontSize:32,fontWeight:700,letterSpacing:'-0.02em',color:C.ink,margin:'8px 0 4px'}}>
          Outfits <span style={{fontStyle:'italic',fontWeight:300,color:C.sage}}>in the wild</span>
        </h2>
        <p style={{fontSize:13,color:C.inkSoft,fontWeight:600,margin:0}}>What everyone's wearing</p>
      </div>

      <div style={{overflowX:'auto',marginBottom:14}} className="scrollbar-hide">
        <div style={{display:'flex',gap:8,padding:'0 20px',width:'max-content'}}>
          {[{id:'all',l:'All',e:'✦'},...OCCASIONS.map(o=>({id:o.id,l:o.label,e:o.emoji}))].map(f=>(
            <button key={f.id} onClick={()=>setFeedFilter(f.id)} className="bouncy" style={{padding:'6px 14px',borderRadius:999,fontSize:11,fontWeight:800,whiteSpace:'nowrap',background:feedFilter===f.id?C.forest:C.surface,color:feedFilter===f.id?'white':C.ink,border:`2px solid ${feedFilter===f.id?C.forest:C.border}`,cursor:'pointer',display:'flex',alignItems:'center',gap:5}}>
              <span>{f.e}</span> {f.l}
            </button>
          ))}
        </div>
      </div>

      {loading && posts.length===0 ? (
        <div style={{padding:'48px 0',textAlign:'center'}}><Leaf size={22} className="pulse" style={{color:C.sage,margin:'0 auto 8px'}}/><div style={{fontSize:11,fontWeight:800,letterSpacing:'0.2em',textTransform:'uppercase',color:C.sage}}>Loading feed</div></div>
      ) : total===0 ? (
        <div style={{padding:'0 18px'}} className="fade">
          <div className="grad-sage noise" style={{borderRadius:28,padding:'32px 24px',color:'white',position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',top:16,right:16}} className="float"><SparkDot size={22} color={`${C.sand}60`}/></div>
            <Globe size={28} strokeWidth={1.5} style={{marginBottom:12}}/>
            <h2 className="serif" style={{fontSize:28,fontWeight:700,letterSpacing:'-0.02em',margin:'0 0 10px'}}>Be the <span style={{fontStyle:'italic',fontWeight:300}}>first</span> to post.</h2>
            <p style={{fontSize:14,opacity:.9,lineHeight:1.6,margin:0}}>Save a look you love, then share it here. Your outfit will be visible to all StyleStudio users.</p>
          </div>
        </div>
      ) : posts.length===0 ? (
        <div style={{padding:'48px 0',textAlign:'center'}}>
          <div style={{fontSize:32,marginBottom:8}}>🌿</div>
          <div style={{fontSize:14,color:C.inkSoft,fontWeight:600}}>No posts in this category yet</div>
        </div>
      ) : (
        <div style={{padding:'0 14px',display:'flex',flexDirection:'column',gap:14}} className="stagger">
          {posts.map(post=><PostCard key={post.id} post={post} userId={userId} isLiked={liked.has(post.id)} onTap={()=>onOpen(post)} onLike={e=>{e.stopPropagation();onLike(post);}}/>)}
        </div>
      )}
    </div>
  );
}

function PostCard({post, userId, isLiked, onTap, onLike}) {
  const isOwn = post.authorId===userId;
  const its = post.items||[];
  return (
    <div onClick={onTap} className="bouncy" style={{borderRadius:22,overflow:'hidden',background:C.surface,border:`1px solid ${C.border}`,boxShadow:`0 4px 20px rgba(0,0,0,.28)`,cursor:'pointer'}}>
      <div style={{padding:'14px 14px 10px',display:'flex',alignItems:'center',gap:10}}>
        <div style={{width:40,height:40,borderRadius:'50%',background:post.occasionBg||C.sageSoft,border:`2px solid ${post.occasionColor||C.sage}30`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
          <span style={{fontSize:14,fontWeight:800,color:post.occasionColor||C.sage}}>{(post.author||'?').charAt(0).toUpperCase()}</span>
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:13,fontWeight:800,color:C.ink,display:'flex',alignItems:'center',gap:5}}>
            {post.author}
            {isOwn && <span style={{fontSize:9,padding:'2px 6px',borderRadius:999,background:C.ochre,color:'white',fontWeight:800}}>YOU</span>}
          </div>
          <div style={{fontSize:10,fontWeight:700,color:post.occasionColor||C.sage}}>{post.occasionEmoji} {post.occasionLabel}</div>
        </div>
        <div style={{fontSize:10,fontWeight:700,color:C.inkFaint}}>{timeAgo(post.dateCreated)}</div>
      </div>
      <div style={{padding:'0 14px 10px'}}>
        <div className="serif" style={{fontSize:19,fontWeight:700,letterSpacing:'-0.01em',color:C.ink,marginBottom:5}}>{post.title}</div>
        <p style={{fontSize:13,color:C.inkSoft,fontWeight:600,margin:0,lineHeight:1.5}}>{post.vibe}</p>
      </div>
      <div style={{display:'grid',gap:2,padding:'0 12px 12px',gridTemplateColumns:`repeat(${Math.min(its.length,4)},1fr)`,height:130}}>
        {its.slice(0,4).map((it,i)=>(
          <div key={it.id||i} style={{borderRadius:12,overflow:'hidden',position:'relative',background:it.colorHex||C.bgDeep}}>
            <img src={it.dataUrl} alt={it.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
            {its.length>4 && i===3 && <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:16,color:'white',background:'rgba(26,20,13,.55)'}}>+{its.length-4}</div>}
          </div>
        ))}
      </div>
      <div style={{padding:'10px 14px 14px',display:'flex',alignItems:'center',justifyContent:'space-between',borderTop:`1px solid ${C.border}`}}>
        <button onClick={onLike} className="bouncy" style={{display:'flex',alignItems:'center',gap:6,padding:'7px 12px',borderRadius:999,background:isLiked?C.ochreSoft:'transparent',border:'none',cursor:'pointer',color:isLiked?C.ochre:C.inkSoft}}>
          <Heart size={15} strokeWidth={2} fill={isLiked?C.ochre:'none'}/>
          <span style={{fontSize:12,fontWeight:800}}>{post.likes||0}</span>
        </button>
        <div style={{fontSize:11,fontWeight:800,color:post.occasionColor||C.sage}}>Tap to view →</div>
      </div>
    </div>
  );
}

function timeAgo(ts) {
  const d=Date.now()-ts, m=Math.floor(d/60000);
  if (m<1) return 'just now'; if (m<60) return `${m}m`;
  const h=Math.floor(m/60); if (h<24) return `${h}h`;
  const dy=Math.floor(h/24); if (dy<7) return `${dy}d`;
  return new Date(ts).toLocaleDateString();
}

// ============ SAVED VIEW ============
function SavedView({saved, itemById, onOpen, onDelete}) {
  if (saved.length===0) {
    return (
      <div style={{padding:'28px 18px'}} className="fade">
        <div className="grad-ochre noise" style={{borderRadius:28,padding:'32px 24px',color:'white',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',top:12,right:16}} className="float"><Heart size={28} fill="rgba(255,255,255,.3)" strokeWidth={0}/></div>
          <Heart size={28} strokeWidth={1.5} style={{marginBottom:12}}/>
          <h2 className="serif" style={{fontSize:28,fontWeight:700,letterSpacing:'-0.02em',margin:'0 0 10px'}}>Save looks you <span style={{fontStyle:'italic',fontWeight:300}}>love.</span></h2>
          <p style={{fontSize:14,opacity:.9,lineHeight:1.6,margin:0}}>Tap the heart on any outfit. Your favorites live here forever.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fade">
      <div style={{padding:'16px 20px 16px'}}>
        <SectionTag color={C.ochre}>Your looks</SectionTag>
        <h2 className="serif" style={{fontSize:32,fontWeight:700,letterSpacing:'-0.02em',color:C.ink,margin:'8px 0 0'}}>Saved <span style={{fontStyle:'italic',fontWeight:300,color:C.sage}}>outfits</span></h2>
      </div>
      <div style={{padding:'0 14px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}} className="stagger">
        {saved.map(o=><SavedCard key={o.id} outfit={o} itemById={itemById} onOpen={()=>onOpen(o)} onDelete={()=>{if(confirm('Remove this look?'))onDelete(o.id);}}/>)}
      </div>
    </div>
  );
}

function SavedCard({outfit, itemById, onOpen, onDelete}) {
  const its = (outfit.item_ids||[]).map(itemById).filter(Boolean);
  return (
    <div onClick={onOpen} className="bouncy" style={{borderRadius:20,overflow:'hidden',background:C.surface,border:`1px solid ${C.border}`,boxShadow:`0 2px 10px rgba(0,0,0,.25)`,cursor:'pointer',position:'relative'}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:1,aspectRatio:'1',background:outfit.occasionBg||C.sageSoft}}>
        {its.slice(0,4).map(it=><div key={it.id} style={{overflow:'hidden',background:it.colorHex||C.bgDeep}}><img src={it.dataUrl} alt={it.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/></div>)}
        {[...Array(Math.max(0,4-its.length))].map((_,i)=><div key={`e${i}`} style={{background:outfit.occasionBg||C.sageSoft}}/>)}
      </div>
      <div style={{padding:'10px 12px'}}>
        <div style={{display:'flex',alignItems:'center',gap:4,marginBottom:3}}>
          <span style={{fontSize:11}}>{outfit.occasionEmoji}</span>
          <span style={{fontSize:9,fontWeight:800,letterSpacing:'0.12em',textTransform:'uppercase',color:outfit.occasionColor||C.sage}}>{outfit.occasionLabel}</span>
        </div>
        <div className="serif" style={{fontSize:13,fontWeight:700,color:C.ink,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{outfit.title}</div>
      </div>
      <button onClick={e=>{e.stopPropagation();onDelete();}} style={{position:'absolute',top:8,right:8,width:26,height:26,borderRadius:'50%',background:'rgba(251,247,237,.92)',border:'none',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:C.ink}}>
        <X size={12} strokeWidth={2.5}/>
      </button>
    </div>
  );
}

// ============ OUTFIT DETAIL ============
function OutfitDetail({outfit, itemById, onClose, onShare, onSave, isSaved, onPost, onWear}) {
  const its = (outfit.item_ids||[]).map(itemById).filter(Boolean);
  const om = OCCASIONS.find(o=>o.id===outfit.occasion);
  const [wornToast, setWornToast] = useState(false);

  function handleWear() {
    if (onWear) {
      onWear();
      setWornToast(true);
      setTimeout(() => setWornToast(false), 2400);
    }
  }

  return (
    <div style={{position:'fixed',inset:0,zIndex:50,background:'rgba(26,20,13,.55)',backdropFilter:'blur(10px)'}} className="fade">
      <div style={{position:'absolute',left:0,right:0,bottom:0,top:32,borderRadius:'28px 28px 0 0',overflowY:'auto',background:C.bg}} className="up">
        <div style={{position:'sticky',top:0,zIndex:10,padding:'14px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',background:`rgba(176,174,136,.94)`,backdropFilter:'blur(12px)',borderBottom:`1px solid ${C.border}`}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:6,padding:'5px 12px',borderRadius:999,background:om?.bgColor,color:om?.color,fontSize:11,fontWeight:800}}>
            <span style={{fontSize:16}}>{om?.emoji}</span> {om?.label||'The look'}
          </div>
          <button onClick={onClose} className="bouncy" style={{width:36,height:36,borderRadius:'50%',background:C.forest,border:'none',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'white'}}>
            <X size={15} strokeWidth={2.5}/>
          </button>
        </div>

        <div style={{padding:'24px 20px'}}>
          <h2 className="serif" style={{fontSize:38,fontWeight:700,letterSpacing:'-0.02em',color:C.ink,margin:'0 0 8px'}}>{outfit.title}</h2>
          <p style={{fontSize:14,color:C.inkSoft,fontWeight:600,lineHeight:1.6,margin:'0 0 20px'}}>{outfit.vibe}</p>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:12}}>
            <button onClick={onSave} className="bouncy" style={{padding:'12px',borderRadius:999,fontSize:13,fontWeight:800,display:'flex',alignItems:'center',justifyContent:'center',gap:6,background:isSaved?C.ochre:C.surface,color:isSaved?'white':C.ink,border:`2px solid ${isSaved?C.ochre:C.borderStrong}`,cursor:'pointer'}}>
              <Heart size={15} strokeWidth={2} fill={isSaved?'white':'none'}/>{isSaved?'Saved ✓':'Save look'}
            </button>
            <button onClick={()=>onShare(outfit)} className="bouncy" style={{padding:'12px',borderRadius:999,fontSize:13,fontWeight:800,display:'flex',alignItems:'center',justifyContent:'center',gap:6,background:C.surface,color:C.ink,border:`2px solid ${C.borderStrong}`,cursor:'pointer'}}>
              <Share2 size={15} strokeWidth={2}/> Share
            </button>
          </div>

          {its.length>0 && onWear && (
            <button onClick={handleWear} className="grad-forest noise bouncy" style={{width:'100%',marginBottom:12,padding:'13px',borderRadius:999,fontSize:13,fontWeight:800,color:'white',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8,position:'relative',boxShadow:`0 6px 20px ${C.forest}40`}}>
              <span style={{fontSize:16}}>👟</span> {wornToast ? 'Logged ✓' : `I wore this outfit (${its.length} pieces)`}
            </button>
          )}

          {its.length>0 && (
            <button onClick={onPost} className="grad-sage noise bouncy" style={{width:'100%',marginBottom:20,padding:'13px',borderRadius:999,fontSize:13,fontWeight:800,color:'white',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6,position:'relative',boxShadow:`0 6px 20px ${C.sage}50`}}>
              <Globe size={15} strokeWidth={2}/> Post to Inspire 🌿
            </button>
          )}

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:20}}>
            {its.map(it=>{
              const tm=TYPE_FILTERS.find(t=>t.id===it.type);
              return <div key={it.id} style={{borderRadius:18,overflow:'hidden',background:C.surface,border:`1px solid ${C.border}`}}>
                <div style={{aspectRatio:'3/4',background:it.colorHex||C.bgDeep}}><img src={it.dataUrl} alt={it.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/></div>
                <div style={{padding:'10px 12px'}}>
                  {it.brand && <div style={{fontSize:9,fontWeight:800,letterSpacing:'0.15em',textTransform:'uppercase',color:C.ochre,marginBottom:2}}>{it.brand}</div>}
                  <div className="serif" style={{fontSize:13,fontWeight:700,color:C.ink}}>{it.name}</div>
                  <div style={{fontSize:9,fontWeight:800,textTransform:'uppercase',letterSpacing:'.1em',color:C.inkSoft,marginTop:2,display:'flex',alignItems:'center',gap:3}}>
                    {tm?.icon==='belt'?<BeltIcon size={9}/>:<span style={{fontSize:10}}>{tm?.icon}</span>} {tm?.label}
                  </div>
                </div>
              </div>;
            })}
          </div>

          {outfit.styling_tip && (
            <div className="grad-bark noise" style={{borderRadius:22,padding:'20px',marginBottom:16,color:'white',position:'relative'}}>
              <div style={{fontSize:10,fontWeight:800,letterSpacing:'0.18em',textTransform:'uppercase',opacity:.7,marginBottom:8}}>Stylist's note</div>
              <p className="serif" style={{fontSize:17,fontStyle:'italic',fontWeight:400,lineHeight:1.5,margin:0}}>"{outfit.styling_tip}"</p>
            </div>
          )}

          {outfit.missing && <div style={{padding:'12px 16px',borderRadius:14,fontSize:12,fontWeight:700,background:C.sandSoft,color:C.clay,display:'flex',gap:6}}><span>💡</span><span><b>To complete this look:</b> {outfit.missing}</span></div>}
        </div>
      </div>
    </div>
  );
}

// ============ POST DETAIL ============
function PostDetail({post, userId, liked, comments=[], loadingComments, submittingComment, displayName, onLoadComments, onAddComment, onDeleteComment, onLike, onShare, onDelete, onClose}) {
  const its=post.items||[], isOwn=post.authorId===userId;
  const [commentText, setCommentText] = useState('');

  useEffect(() => { if (onLoadComments) onLoadComments(); }, [post.id]);

  function handleSubmit() {
    if (!commentText.trim()) return;
    onAddComment(commentText);
    setCommentText('');
  }
  return (
    <div style={{position:'fixed',inset:0,zIndex:50,background:'rgba(26,20,13,.55)',backdropFilter:'blur(10px)'}} className="fade">
      <div style={{position:'absolute',left:0,right:0,bottom:0,top:32,borderRadius:'28px 28px 0 0',overflowY:'auto',background:C.bg}} className="up">
        <div style={{position:'sticky',top:0,zIndex:10,padding:'14px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',background:`rgba(176,174,136,.94)`,backdropFilter:'blur(12px)',borderBottom:`1px solid ${C.border}`}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:36,height:36,borderRadius:'50%',background:post.occasionBg||C.sageSoft,display:'flex',alignItems:'center',justifyContent:'center',border:`2px solid ${post.occasionColor||C.sage}40`}}>
              <span style={{fontSize:13,fontWeight:800,color:post.occasionColor||C.sage}}>{(post.author||'?').charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <div style={{fontSize:13,fontWeight:800,color:C.ink,display:'flex',alignItems:'center',gap:5}}>
                {post.author} {isOwn&&<span style={{fontSize:9,padding:'2px 6px',borderRadius:999,background:C.ochre,color:'white',fontWeight:800}}>YOU</span>}
              </div>
              <div style={{fontSize:10,fontWeight:700,color:post.occasionColor||C.sage}}>{post.occasionEmoji} {post.occasionLabel} · {timeAgo(post.dateCreated)}</div>
            </div>
          </div>
          <button onClick={onClose} className="bouncy" style={{width:36,height:36,borderRadius:'50%',background:C.forest,border:'none',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'white'}}>
            <X size={15} strokeWidth={2.5}/>
          </button>
        </div>

        <div style={{padding:'24px 20px'}}>
          <h2 className="serif" style={{fontSize:38,fontWeight:700,letterSpacing:'-0.02em',color:C.ink,margin:'0 0 8px'}}>{post.title}</h2>
          <p style={{fontSize:14,color:C.inkSoft,fontWeight:600,lineHeight:1.6,margin:'0 0 20px'}}>{post.vibe}</p>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:20}}>
            <button onClick={onLike} className="bouncy" style={{padding:'12px',borderRadius:999,fontSize:13,fontWeight:800,display:'flex',alignItems:'center',justifyContent:'center',gap:6,background:liked?C.ochre:C.surface,color:liked?'white':C.ink,border:`2px solid ${liked?C.ochre:C.borderStrong}`,cursor:'pointer'}}>
              <Heart size={15} strokeWidth={2} fill={liked?'white':'none'}/> {post.likes||0} {(post.likes||0)===1?'like':'likes'}
            </button>
            {isOwn ? (
              <button onClick={onDelete} className="bouncy" style={{padding:'12px',borderRadius:999,fontSize:13,fontWeight:800,display:'flex',alignItems:'center',justifyContent:'center',gap:6,background:C.surface,color:C.ink,border:`2px solid ${C.borderStrong}`,cursor:'pointer'}}>
                <Trash2 size={14} strokeWidth={2}/> Remove
              </button>
            ) : (
              <button onClick={onShare} className="bouncy" style={{padding:'12px',borderRadius:999,fontSize:13,fontWeight:800,display:'flex',alignItems:'center',justifyContent:'center',gap:6,background:C.surface,color:C.ink,border:`2px solid ${C.borderStrong}`,cursor:'pointer'}}>
                <Share2 size={15} strokeWidth={2}/> Share
              </button>
            )}
          </div>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:20}}>
            {its.map(it=>{
              const tm=TYPE_FILTERS.find(t=>t.id===it.type);
              return <div key={it.id} style={{borderRadius:18,overflow:'hidden',background:C.surface,border:`1px solid ${C.border}`}}>
                <div style={{aspectRatio:'3/4',background:it.colorHex||C.bgDeep}}><img src={it.dataUrl} alt={it.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/></div>
                <div style={{padding:'10px 12px'}}>
                  {it.brand && <div style={{fontSize:9,fontWeight:800,letterSpacing:'0.15em',textTransform:'uppercase',color:C.ochre,marginBottom:2}}>{it.brand}</div>}
                  <div className="serif" style={{fontSize:13,fontWeight:700,color:C.ink}}>{it.name}</div>
                  <div style={{fontSize:9,fontWeight:800,textTransform:'uppercase',letterSpacing:'.1em',color:C.inkSoft,marginTop:2,display:'flex',alignItems:'center',gap:3}}>
                    {tm?.icon==='belt'?<BeltIcon size={9}/>:<span style={{fontSize:10}}>{tm?.icon}</span>} {tm?.label}
                  </div>
                </div>
              </div>;
            })}
          </div>

          {post.styling_tip && (
            <div className="grad-bark noise" style={{borderRadius:22,padding:'20px',color:'white',position:'relative',marginBottom:20}}>
              <div style={{fontSize:10,fontWeight:800,letterSpacing:'0.18em',textTransform:'uppercase',opacity:.7,marginBottom:8}}>Stylist's note</div>
              <p className="serif" style={{fontSize:17,fontStyle:'italic',fontWeight:400,lineHeight:1.5,margin:0}}>"{post.styling_tip}"</p>
            </div>
          )}

          {/* Comments section */}
          <div style={{marginTop: post.styling_tip ? 0 : 20}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}>
              <div style={{fontSize:10,fontWeight:800,letterSpacing:'0.18em',textTransform:'uppercase',color:C.sage}}>
                Comments
              </div>
              <div style={{fontSize:10,fontWeight:800,color:C.ochre,background:C.sageSoft,padding:'2px 8px',borderRadius:999}}>
                {comments.length}
              </div>
            </div>

            {/* Comment input */}
            <div style={{display:'flex',gap:8,marginBottom:14,alignItems:'flex-start'}}>
              <div style={{width:34,height:34,borderRadius:'50%',background:C.sageSoft,display:'flex',alignItems:'center',justifyContent:'center',border:`2px solid ${C.sage}30`,flexShrink:0}}>
                <span style={{fontSize:12,fontWeight:800,color:C.sage}}>{(displayName||'?').charAt(0).toUpperCase()}</span>
              </div>
              <div style={{flex:1,display:'flex',gap:6}}>
                <input
                  value={commentText}
                  onChange={e=>setCommentText(e.target.value)}
                  onKeyDown={e=>{ if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
                  placeholder={displayName ? "Say something nice..." : "Pick a display name to comment"}
                  maxLength={280}
                  style={{flex:1,padding:'10px 14px',borderRadius:18,fontSize:13,fontWeight:600,border:`2px solid ${C.borderStrong}`,background:C.surface,color:C.ink,outline:'none'}}/>
                <button onClick={handleSubmit} disabled={!commentText.trim()||submittingComment} className="bouncy" style={{padding:'10px 14px',borderRadius:18,border:'none',background:commentText.trim()?C.forest:C.surface,color:commentText.trim()?'white':C.inkFaint,fontWeight:800,fontSize:13,cursor:'pointer',opacity:submittingComment?.5:1}}>
                  {submittingComment ? <Loader2 className="spin" size={14}/> : <Send size={14} strokeWidth={2.4}/>}
                </button>
              </div>
            </div>

            {/* Comment list */}
            {loadingComments && comments.length===0 ? (
              <div style={{textAlign:'center',padding:'16px 0',fontSize:11,color:C.inkFaint,fontWeight:600}}>
                <Loader2 className="spin" size={14} style={{margin:'0 auto 6px',color:C.sage}}/>
                Loading…
              </div>
            ) : comments.length===0 ? (
              <div style={{textAlign:'center',padding:'24px 0',fontSize:13,color:C.inkSoft,fontWeight:600,background:C.surface,borderRadius:16,border:`1px solid ${C.border}`}}>
                <div style={{fontSize:24,marginBottom:6}}>💬</div>
                Be the first to comment
              </div>
            ) : (
              <div style={{display:'flex',flexDirection:'column',gap:10}} className="stagger">
                {comments.map(c => {
                  const ownComment = c.authorId === userId;
                  return (
                    <div key={c.id} style={{display:'flex',gap:10,padding:'12px 14px',borderRadius:16,background:C.surface,border:`1px solid ${C.border}`}}>
                      <div style={{width:30,height:30,borderRadius:'50%',background:C.sageSoft,display:'flex',alignItems:'center',justifyContent:'center',border:`2px solid ${C.sage}30`,flexShrink:0}}>
                        <span style={{fontSize:11,fontWeight:800,color:C.sage}}>{(c.author||'?').charAt(0).toUpperCase()}</span>
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:2}}>
                          <span style={{fontSize:12,fontWeight:800,color:C.ink}}>{c.author}</span>
                          {ownComment && <span style={{fontSize:8,padding:'1px 5px',borderRadius:999,background:C.ochre,color:'white',fontWeight:800}}>YOU</span>}
                          <span style={{fontSize:10,fontWeight:700,color:C.inkFaint}}>· {timeAgo(c.dateCreated)}</span>
                          {ownComment && (
                            <button onClick={()=>{if(confirm('Remove this comment?'))onDeleteComment(c.id);}} style={{marginLeft:'auto',background:'none',border:'none',color:C.inkFaint,cursor:'pointer',padding:0,fontSize:11}}>
                              <Trash2 size={11} strokeWidth={2}/>
                            </button>
                          )}
                        </div>
                        <div style={{fontSize:13,fontWeight:500,color:C.ink,lineHeight:1.5,wordBreak:'break-word'}}>{c.text}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ NAME MODAL ============
function NameModal({initial, onSave, onCancel}) {
  const [name, setName] = useState(initial||'');
  return (
    <div style={{position:'fixed',inset:0,zIndex:50,display:'flex',alignItems:'flex-end',justifyContent:'center',padding:16,background:'rgba(26,20,13,.55)',backdropFilter:'blur(8px)'}} className="fade">
      <div style={{width:'100%',maxWidth:380,borderRadius:28,overflow:'hidden',background:C.bg}} className="up">
        <div style={{padding:24}}>
          <SectionTag color={C.sageMid}>Pick a name</SectionTag>
          <h3 className="serif" style={{fontSize:26,fontWeight:700,letterSpacing:'-0.02em',color:C.ink,margin:'8px 0 10px'}}>What should we <span style={{fontStyle:'italic',fontWeight:300,color:C.sage}}>call you?</span></h3>
          <p style={{fontSize:13,color:C.inkSoft,fontWeight:600,lineHeight:1.5,margin:'0 0 16px'}}>This shows on your posts. 24 characters max.</p>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Alex from NYC" maxLength={24} autoFocus className="serif" style={{width:'100%',padding:'12px 16px',borderRadius:16,fontSize:17,fontWeight:700,border:`2px solid ${C.borderStrong}`,background:C.surface,color:C.ink,outline:'none',marginBottom:6}}/>
          <div style={{fontSize:10,fontWeight:800,color:C.inkFaint,textAlign:'right',marginBottom:16}}>{name.length}/24</div>
          <div style={{display:'flex',gap:10}}>
            <button onClick={onCancel} className="bouncy" style={{flex:1,padding:'13px',borderRadius:999,fontSize:14,fontWeight:800,background:C.surface,border:`2px solid ${C.borderStrong}`,color:C.ink,cursor:'pointer'}}>Cancel</button>
            <button onClick={()=>onSave(name)} disabled={!name.trim()} className="grad-sage noise bouncy" style={{flex:1,padding:'13px',borderRadius:999,fontSize:14,fontWeight:800,color:'white',border:'none',cursor:'pointer',position:'relative',opacity:name.trim()?1:.5}}>Continue →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ POST CONFIRM ============
function PostConfirm({outfit, displayName, publishing, itemById, onConfirm, onCancel, onChangeName}) {
  const its=(outfit.item_ids||[]).map(itemById).filter(Boolean);
  const om=OCCASIONS.find(o=>o.id===outfit.occasion);
  return (
    <div style={{position:'fixed',inset:0,zIndex:50,display:'flex',alignItems:'flex-end',justifyContent:'center',padding:16,background:'rgba(26,20,13,.55)',backdropFilter:'blur(8px)'}} className="fade">
      <div style={{width:'100%',maxWidth:380,borderRadius:28,overflow:'hidden',background:C.bg}} className="up">
        <div style={{padding:24}}>
          <SectionTag color={C.sageMid}>Post to Inspire</SectionTag>
          <h3 className="serif" style={{fontSize:24,fontWeight:700,letterSpacing:'-0.02em',color:C.ink,margin:'8px 0 8px'}}>Share this <span style={{fontStyle:'italic',fontWeight:300,color:C.sage}}>look?</span></h3>
          <p style={{fontSize:13,color:C.inkSoft,fontWeight:600,lineHeight:1.5,margin:'0 0 16px'}}>This will be <b style={{color:C.ink}}>visible to all StyleStudio users</b>. You can remove it anytime.</p>

          <div style={{borderRadius:18,overflow:'hidden',background:C.surface,border:`1px solid ${C.border}`,marginBottom:16}}>
            <div style={{padding:'12px 14px',display:'flex',alignItems:'center',gap:8,borderBottom:`1px solid ${C.border}`}}>
              <div style={{width:32,height:32,borderRadius:'50%',background:om?.bgColor,display:'flex',alignItems:'center',justifyContent:'center',border:`2px solid ${om?.color}30`}}>
                <span style={{fontSize:11,fontWeight:800,color:om?.color}}>{displayName.charAt(0).toUpperCase()}</span>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12,fontWeight:800,color:C.ink,display:'flex',alignItems:'center',gap:5}}>
                  {displayName}
                  <button onClick={onChangeName} style={{fontSize:10,fontWeight:700,color:C.sage,background:'none',border:'none',cursor:'pointer',textDecoration:'underline',padding:0}}>edit</button>
                </div>
                <div style={{fontSize:10,fontWeight:700,color:om?.color}}>{om?.emoji} {om?.label}</div>
              </div>
            </div>
            <div style={{padding:'10px 14px'}}>
              <div className="serif" style={{fontSize:15,fontWeight:700,color:C.ink,marginBottom:8}}>{outfit.title}</div>
              <div style={{display:'flex',gap:4,height:60}}>
                {its.slice(0,4).map(it=>(
                  <div key={it.id} style={{flex:1,borderRadius:10,overflow:'hidden',background:it.colorHex||C.bgDeep}}>
                    <img src={it.dataUrl} alt={it.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{display:'flex',gap:10}}>
            <button onClick={onCancel} disabled={publishing} className="bouncy" style={{flex:1,padding:'13px',borderRadius:999,fontSize:14,fontWeight:800,background:C.surface,border:`2px solid ${C.borderStrong}`,color:C.ink,cursor:'pointer',opacity:publishing?.5:1}}>Not yet</button>
            <button onClick={onConfirm} disabled={publishing} className="grad-sage noise bouncy" style={{flex:1,padding:'13px',borderRadius:999,fontSize:14,fontWeight:800,color:'white',border:'none',cursor:'pointer',position:'relative',display:'flex',alignItems:'center',justifyContent:'center',gap:6,opacity:publishing?.6:1}}>
              {publishing?<Loader2 className="spin" size={14}/>:<Send size={14} strokeWidth={2.4}/>}
              {publishing?'Posting…':'Share it 🌿'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ PACKING MODAL ============
function PackingModal({items, generating, result, itemById, onGenerate, onClose}) {
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(4);
  const [activities, setActivities] = useState(['casual']);
  const [weather, setWeather] = useState('');

  const ACTS = [
    { id:'casual',     label:'Casual',         emoji:'☕' },
    { id:'business',   label:'Business',       emoji:'💼' },
    { id:'dinners',    label:'Dinners out',    emoji:'🍷' },
    { id:'formal',     label:'Formal event',   emoji:'✨' },
    { id:'beach',      label:'Beach',          emoji:'🏖️' },
    { id:'workout',    label:'Workouts',       emoji:'⚡' },
    { id:'outdoor',    label:'Outdoor / hike', emoji:'🥾' },
    { id:'night-out',  label:'Night out',      emoji:'🌙' }
  ];

  const WEATHER_OPTS = [
    { id:'hot',     label:'Hot',     emoji:'☀️' },
    { id:'warm',    label:'Warm',    emoji:'🌤️' },
    { id:'mild',    label:'Mild',    emoji:'⛅' },
    { id:'cold',    label:'Cold',    emoji:'❄️' },
    { id:'rainy',   label:'Rainy',   emoji:'🌧️' }
  ];

  function toggleActivity(id) {
    setActivities(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  }

  function handleBuild() {
    if (activities.length === 0) return;
    onGenerate({
      destination: destination.trim(),
      days,
      activities: activities.map(a => ACTS.find(x => x.id === a)?.label || a),
      weather: weather ? WEATHER_OPTS.find(w => w.id === weather)?.label : ''
    });
  }

  // ─── RESULT VIEW ───
  if (result) {
    const packed = (result.item_ids || []).map(itemById).filter(Boolean);
    return (
      <div style={{position:'fixed',inset:0,zIndex:50,background:'rgba(26,20,13,.55)',backdropFilter:'blur(10px)'}} className="fade">
        <div style={{position:'absolute',left:0,right:0,bottom:0,top:32,borderRadius:'28px 28px 0 0',overflowY:'auto',background:C.bg}} className="up">
          <div style={{position:'sticky',top:0,zIndex:10,padding:'14px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',background:`rgba(176,174,136,.94)`,backdropFilter:'blur(12px)',borderBottom:`1px solid ${C.border}`}}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <div style={{fontSize:22}}>🧳</div>
              <div>
                <div style={{fontSize:9,fontWeight:800,letterSpacing:'0.2em',textTransform:'uppercase',color:C.sage}}>Your packing list</div>
                <div className="serif" style={{fontSize:16,fontWeight:700,color:C.ink}}>{result.trip.destination || 'Trip'} · {result.trip.days}d</div>
              </div>
            </div>
            <button onClick={onClose} className="bouncy" style={{width:36,height:36,borderRadius:'50%',background:C.forest,border:'none',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'white'}}>
              <X size={15} strokeWidth={2.5}/>
            </button>
          </div>

          <div style={{padding:'20px'}}>
            <div className="grad-bark noise" style={{borderRadius:20,padding:'16px 18px',marginBottom:16,color:'white'}}>
              <div style={{fontSize:10,fontWeight:800,letterSpacing:'0.18em',textTransform:'uppercase',opacity:.7,marginBottom:6}}>Overview</div>
              <p className="serif" style={{fontSize:16,fontStyle:'italic',fontWeight:400,lineHeight:1.5,margin:0}}>"{result.summary}"</p>
            </div>

            <div style={{marginBottom:18}}>
              <div style={{fontSize:11,fontWeight:800,letterSpacing:'0.18em',textTransform:'uppercase',color:C.sage,marginBottom:10}}>
                What to pack — {packed.length} pieces
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                {packed.map(it => {
                  const tm = TYPE_FILTERS.find(t=>t.id===it.type);
                  return (
                    <div key={it.id} style={{borderRadius:16,overflow:'hidden',background:C.surface,border:`1px solid ${C.border}`}}>
                      <div style={{aspectRatio:'3/4',background:it.colorHex||C.bgDeep}}>
                        <img src={it.dataUrl} alt={it.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                      </div>
                      <div style={{padding:'8px 10px'}}>
                        {it.brand && <div style={{fontSize:8,fontWeight:800,letterSpacing:'.15em',textTransform:'uppercase',color:C.sage,marginBottom:1}}>{it.brand}</div>}
                        <div className="serif" style={{fontSize:12,fontWeight:700,color:C.ink,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{it.name}</div>
                        <div style={{fontSize:8,fontWeight:800,color:C.inkFaint,textTransform:'uppercase',letterSpacing:'.08em',marginTop:1,display:'flex',alignItems:'center',gap:3}}>
                          {tm?.icon==='belt'?<BeltIcon size={8}/>:<span style={{fontSize:9}}>{tm?.icon}</span>} {tm?.label}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {result.day_outfits?.length > 0 && (
              <div style={{marginBottom:18}}>
                <div style={{fontSize:11,fontWeight:800,letterSpacing:'0.18em',textTransform:'uppercase',color:C.sage,marginBottom:10}}>Day by day</div>
                <div style={{display:'flex',flexDirection:'column',gap:10}}>
                  {result.day_outfits.map((d,i)=>{
                    const its = (d.item_ids||[]).map(itemById).filter(Boolean);
                    return (
                      <div key={i} style={{borderRadius:16,background:C.surface,border:`1px solid ${C.border}`,padding:'12px 14px'}}>
                        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                          <div style={{width:28,height:28,borderRadius:'50%',background:C.forest,color:C.ochre,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:800}}>{d.day}</div>
                          <div style={{flex:1}}>
                            <div className="serif" style={{fontSize:13,fontWeight:700,color:C.ink}}>{d.plan}</div>
                          </div>
                        </div>
                        {its.length>0 && (
                          <div style={{display:'flex',gap:6,overflowX:'auto'}} className="scrollbar-hide">
                            {its.map(it => (
                              <div key={it.id} style={{width:48,height:60,borderRadius:8,overflow:'hidden',background:it.colorHex||C.bgDeep,flexShrink:0}}>
                                <img src={it.dataUrl} alt={it.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {result.missing && (
              <div style={{padding:'12px 16px',borderRadius:14,fontSize:12,fontWeight:700,background:C.sandSoft,color:C.clay,marginBottom:12,display:'flex',gap:8}}>
                <span style={{fontSize:16}}>🛒</span>
                <div><b>Don't forget to pack/buy:</b> {result.missing}</div>
              </div>
            )}

            {result.tips && (
              <div style={{padding:'12px 16px',borderRadius:14,fontSize:12,fontWeight:700,background:C.sageSoft,color:C.sage,marginBottom:20,display:'flex',gap:8}}>
                <span style={{fontSize:16}}>💡</span>
                <div><b>Tip:</b> {result.tips}</div>
              </div>
            )}

            <button onClick={onClose} className="grad-forest noise bouncy" style={{width:'100%',padding:'14px',borderRadius:18,border:'none',color:'white',fontWeight:800,fontSize:14,cursor:'pointer'}}>
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── BUILDER VIEW ───
  return (
    <div style={{position:'fixed',inset:0,zIndex:50,background:'rgba(26,20,13,.55)',backdropFilter:'blur(10px)'}} className="fade">
      <div style={{position:'absolute',left:0,right:0,bottom:0,top:32,borderRadius:'28px 28px 0 0',overflowY:'auto',background:C.bg}} className="up">
        <div style={{position:'sticky',top:0,zIndex:10,padding:'14px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',background:`rgba(176,174,136,.94)`,backdropFilter:'blur(12px)',borderBottom:`1px solid ${C.border}`}}>
          <SectionTag color={C.sageMid}>Pack for a trip</SectionTag>
          <button onClick={onClose} className="bouncy" style={{width:36,height:36,borderRadius:'50%',background:C.forest,border:'none',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'white'}}>
            <X size={15} strokeWidth={2.5}/>
          </button>
        </div>

        <div style={{padding:'24px 20px'}}>
          <h2 className="serif" style={{fontSize:30,fontWeight:700,letterSpacing:'-0.02em',color:C.ink,margin:'0 0 8px'}}>
            Where you <span style={{fontStyle:'italic',fontWeight:300,color:C.sage}}>going?</span>
          </h2>
          <p style={{fontSize:13,color:C.inkSoft,fontWeight:600,margin:'0 0 24px',lineHeight:1.5}}>
            Tell me a few details and I'll build a packing list from your closet of {items.length} pieces.
          </p>

          <div style={{marginBottom:18}}>
            <label style={{fontSize:10,fontWeight:800,letterSpacing:'0.18em',textTransform:'uppercase',color:C.sage,marginBottom:6,display:'block'}}>
              Destination <span style={{opacity:.5,letterSpacing:0,textTransform:'none'}}>(optional)</span>
            </label>
            <input
              value={destination}
              onChange={e=>setDestination(e.target.value)}
              placeholder="e.g. Miami, Tokyo, ski trip"
              className="serif"
              style={{width:'100%',padding:'12px 16px',borderRadius:14,fontSize:15,fontWeight:700,border:`2px solid ${C.borderStrong}`,background:C.surface,color:C.ink,outline:'none'}}/>
          </div>

          <div style={{marginBottom:18}}>
            <label style={{fontSize:10,fontWeight:800,letterSpacing:'0.18em',textTransform:'uppercase',color:C.sage,marginBottom:8,display:'block'}}>
              How many days
            </label>
            <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
              {[2,3,4,5,7,10,14].map(d => (
                <button key={d} onClick={()=>setDays(d)} className="bouncy" style={{padding:'8px 14px',borderRadius:999,fontSize:13,fontWeight:800,cursor:'pointer',background:days===d?C.forest:C.surface,color:days===d?'white':C.ink,border:`2px solid ${days===d?C.forest:`${C.sage}30`}`}}>
                  {d}d
                </button>
              ))}
            </div>
          </div>

          <div style={{marginBottom:18}}>
            <label style={{fontSize:10,fontWeight:800,letterSpacing:'0.18em',textTransform:'uppercase',color:C.sage,marginBottom:8,display:'block'}}>
              What you'll do <span style={{opacity:.5,letterSpacing:0,textTransform:'none'}}>(pick all that apply)</span>
            </label>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
              {ACTS.map(a => {
                const on = activities.includes(a.id);
                return (
                  <button key={a.id} onClick={()=>toggleActivity(a.id)} className="bouncy" style={{padding:'10px 12px',borderRadius:14,fontSize:12,fontWeight:800,cursor:'pointer',background:on?C.forest:C.surface,color:on?'white':C.ink,border:`2px solid ${on?C.forest:`${C.sage}30`}`,display:'flex',alignItems:'center',gap:6,textAlign:'left'}}>
                    <span style={{fontSize:16}}>{a.emoji}</span> {a.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{marginBottom:24}}>
            <label style={{fontSize:10,fontWeight:800,letterSpacing:'0.18em',textTransform:'uppercase',color:C.sage,marginBottom:8,display:'block'}}>
              Weather <span style={{opacity:.5,letterSpacing:0,textTransform:'none'}}>(optional)</span>
            </label>
            <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
              {WEATHER_OPTS.map(w => (
                <button key={w.id} onClick={()=>setWeather(weather===w.id?'':w.id)} className="bouncy" style={{padding:'8px 12px',borderRadius:999,fontSize:12,fontWeight:800,cursor:'pointer',background:weather===w.id?C.forest:C.surface,color:weather===w.id?'white':C.ink,border:`2px solid ${weather===w.id?C.forest:`${C.sage}30`}`,display:'flex',alignItems:'center',gap:4}}>
                  <span>{w.emoji}</span> {w.label}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleBuild} disabled={generating || activities.length===0 || items.length<2} className="grad-forest noise bouncy" style={{width:'100%',padding:'16px',borderRadius:18,border:'none',color:'white',fontWeight:800,fontSize:15,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8,opacity:(generating||activities.length===0||items.length<2)?.5:1}}>
            {generating ? <><Loader2 className="spin" size={16}/> Building your packing list…</> : <>🧳 Build packing list</>}
          </button>

          {items.length < 2 && (
            <div style={{marginTop:14,padding:'12px 14px',borderRadius:12,background:C.claySoft,color:C.clay,fontSize:12,fontWeight:700}}>
              Add at least 2 items to your closet first.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============ PROFILE MODAL ============
function ProfileModal({displayName, bio, photo, isPublic, posts, userId, savedOutfits, itemCount, onEditPhoto, onOpenSettings, onOpenPost, onClose}) {
  const myPosts = posts.filter(p => p.authorId === userId);
  const totalLikes = myPosts.reduce((sum, p) => sum + (p.likes||0), 0);

  return (
    <div style={{position:'fixed',inset:0,zIndex:50,background:'rgba(26,20,13,.55)',backdropFilter:'blur(10px)'}} className="fade">
      <div style={{position:'absolute',left:0,right:0,bottom:0,top:32,borderRadius:'28px 28px 0 0',overflowY:'auto',background:C.bg}} className="up">
        <div style={{position:'sticky',top:0,zIndex:10,padding:'14px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',background:`rgba(176,174,136,.94)`,backdropFilter:'blur(12px)',borderBottom:`1px solid ${C.border}`}}>
          <SectionTag color={C.sageMid}>Your profile</SectionTag>
          <div style={{display:'flex',gap:8}}>
            <button onClick={onOpenSettings} className="bouncy" style={{width:36,height:36,borderRadius:'50%',background:C.surface,border:`1px solid ${C.border}`,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:C.sage}} aria-label="Settings">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </button>
            <button onClick={onClose} className="bouncy" style={{width:36,height:36,borderRadius:'50%',background:C.forest,border:'none',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'white'}}>
              <X size={15} strokeWidth={2.5}/>
            </button>
          </div>
        </div>

        <div style={{padding:'24px 20px'}}>
          {/* Avatar + name */}
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center',marginBottom:24}}>
            <button onClick={onEditPhoto} className="bouncy" style={{position:'relative',width:96,height:96,borderRadius:'50%',background:photo?'transparent':C.forest,border:`3px solid ${C.ochre}`,display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',cursor:'pointer',padding:0,marginBottom:14}}>
              {photo
                ? <img src={photo} alt="me" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                : <span style={{fontSize:36,fontWeight:800,color:C.ochre,fontFamily:"'Fraunces',serif"}}>{(displayName||'?').charAt(0).toUpperCase()}</span>}
              <div style={{position:'absolute',bottom:0,right:0,width:30,height:30,borderRadius:'50%',background:C.ochre,border:`2px solid ${C.bg}`,display:'flex',alignItems:'center',justifyContent:'center',color:'white'}}>
                <Camera size={13} strokeWidth={2.4}/>
              </div>
            </button>
            <h2 className="serif" style={{fontSize:26,fontWeight:700,letterSpacing:'-0.02em',color:C.ink,margin:0}}>
              {displayName || 'Set your name'}
            </h2>
            {bio
              ? <p style={{fontSize:14,color:C.inkSoft,fontWeight:600,lineHeight:1.5,margin:'8px 0 0',maxWidth:280}}>{bio}</p>
              : <button onClick={onOpenSettings} style={{fontSize:13,color:C.sage,fontWeight:700,background:'none',border:'none',cursor:'pointer',marginTop:8,textDecoration:'underline'}}>+ Add a bio</button>}
            <div style={{display:'inline-flex',alignItems:'center',gap:5,marginTop:12,padding:'4px 12px',borderRadius:999,background:isPublic?C.sageSoft:C.claySoft,color:isPublic?C.sage:C.clay,fontSize:11,fontWeight:800}}>
              {isPublic ? '🌍 Public profile' : '🔒 Private profile'}
            </div>
          </div>

          {/* Stats */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:24}}>
            {[
              { n: itemCount, l: 'Pieces' },
              { n: myPosts.length, l: 'Posts' },
              { n: totalLikes, l: 'Likes' },
            ].map((s,i)=>(
              <div key={i} className="grad-forest noise" style={{borderRadius:18,padding:'16px 8px',textAlign:'center',position:'relative'}}>
                <div className="serif" style={{fontSize:26,fontWeight:700,color:'white',lineHeight:1}}>{s.n}</div>
                <div style={{fontSize:9,fontWeight:800,letterSpacing:'0.15em',textTransform:'uppercase',color:C.ochre,marginTop:4}}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* My posts */}
          <div style={{fontSize:10,fontWeight:800,letterSpacing:'0.18em',textTransform:'uppercase',color:C.sage,marginBottom:12}}>Your public looks</div>
          {myPosts.length === 0 ? (
            <div style={{textAlign:'center',padding:'32px 0',background:C.surface,borderRadius:18,border:`1px solid ${C.border}`}}>
              <div style={{fontSize:30,marginBottom:8}}>📸</div>
              <div style={{fontSize:13,color:C.inkSoft,fontWeight:600}}>You haven't posted any looks yet</div>
              <div style={{fontSize:11,color:C.inkFaint,fontWeight:600,marginTop:4}}>Save an outfit, then post it to Inspire</div>
            </div>
          ) : (
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              {myPosts.map(post => {
                const its = post.items || [];
                return (
                  <div key={post.id} onClick={()=>onOpenPost(post)} className="bouncy" style={{borderRadius:16,overflow:'hidden',background:C.surface,border:`1px solid ${C.border}`,cursor:'pointer'}}>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:1,aspectRatio:'1',background:post.occasionBg||C.sageSoft}}>
                      {its.slice(0,4).map((it,i)=><div key={i} style={{overflow:'hidden',background:it.colorHex||C.bgDeep}}><img src={it.dataUrl} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/></div>)}
                    </div>
                    <div style={{padding:'8px 10px'}}>
                      <div className="serif" style={{fontSize:12,fontWeight:700,color:C.ink,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{post.title}</div>
                      <div style={{display:'flex',alignItems:'center',gap:4,marginTop:3}}>
                        <Heart size={11} fill={C.ochre} strokeWidth={0}/>
                        <span style={{fontSize:10,fontWeight:800,color:C.ochre}}>{post.likes||0}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============ SETTINGS MODAL ============
function SettingsModal({displayName, bio, isPublic, onSave, onDeleteAccount, onClose}) {
  const [name, setName] = useState(displayName||'');
  const [bioText, setBioText] = useState(bio||'');
  const [pub, setPub] = useState(isPublic);

  function handleSave() {
    onSave({ name, bio: bioText, isPublic: pub });
    onClose();
  }

  return (
    <div style={{position:'fixed',inset:0,zIndex:55,background:'rgba(26,20,13,.6)',backdropFilter:'blur(10px)'}} className="fade">
      <div style={{position:'absolute',left:0,right:0,bottom:0,top:32,borderRadius:'28px 28px 0 0',overflowY:'auto',background:C.bg}} className="up">
        <div style={{position:'sticky',top:0,zIndex:10,padding:'14px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',background:`rgba(176,174,136,.94)`,backdropFilter:'blur(12px)',borderBottom:`1px solid ${C.border}`}}>
          <SectionTag color={C.sageMid}>Settings</SectionTag>
          <button onClick={onClose} className="bouncy" style={{width:36,height:36,borderRadius:'50%',background:C.forest,border:'none',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'white'}}>
            <X size={15} strokeWidth={2.5}/>
          </button>
        </div>

        <div style={{padding:'24px 20px'}}>
          {/* Username */}
          <div style={{marginBottom:20}}>
            <label style={{fontSize:10,fontWeight:800,letterSpacing:'0.18em',textTransform:'uppercase',color:C.sage,marginBottom:8,display:'block'}}>Username</label>
            <input value={name} onChange={e=>setName(e.target.value)} maxLength={24} placeholder="e.g. alex_nyc" className="serif" style={{width:'100%',padding:'12px 16px',borderRadius:14,fontSize:16,fontWeight:700,border:`2px solid ${C.borderStrong}`,background:C.surface,color:C.ink,outline:'none'}}/>
            <div style={{fontSize:10,fontWeight:700,color:C.inkFaint,textAlign:'right',marginTop:4}}>{name.length}/24</div>
          </div>

          {/* Bio */}
          <div style={{marginBottom:20}}>
            <label style={{fontSize:10,fontWeight:800,letterSpacing:'0.18em',textTransform:'uppercase',color:C.sage,marginBottom:8,display:'block'}}>Bio</label>
            <textarea value={bioText} onChange={e=>setBioText(e.target.value)} maxLength={160} rows={3} placeholder="A line about your style…" style={{width:'100%',padding:'12px 16px',borderRadius:14,fontSize:14,fontWeight:600,border:`2px solid ${C.borderStrong}`,background:C.surface,color:C.ink,outline:'none',resize:'none',fontFamily:'inherit'}}/>
            <div style={{fontSize:10,fontWeight:700,color:C.inkFaint,textAlign:'right',marginTop:4}}>{bioText.length}/160</div>
          </div>

          {/* Privacy toggle */}
          <div style={{marginBottom:24}}>
            <label style={{fontSize:10,fontWeight:800,letterSpacing:'0.18em',textTransform:'uppercase',color:C.sage,marginBottom:8,display:'block'}}>Default privacy for new posts</label>
            <div style={{display:'flex',gap:8}}>
              <button onClick={()=>setPub(true)} className="bouncy" style={{flex:1,padding:'14px',borderRadius:14,fontSize:13,fontWeight:800,cursor:'pointer',background:pub?C.forest:C.surface,color:pub?'white':C.ink,border:`2px solid ${pub?C.forest:C.border}`,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                <span style={{fontSize:18}}>🌍</span> Public
                <span style={{fontSize:9,fontWeight:600,opacity:.7}}>Anyone can see</span>
              </button>
              <button onClick={()=>setPub(false)} className="bouncy" style={{flex:1,padding:'14px',borderRadius:14,fontSize:13,fontWeight:800,cursor:'pointer',background:!pub?C.forest:C.surface,color:!pub?'white':C.ink,border:`2px solid ${!pub?C.forest:C.border}`,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                <span style={{fontSize:18}}>🔒</span> Private
                <span style={{fontSize:9,fontWeight:600,opacity:.7}}>Only you</span>
              </button>
            </div>
          </div>

          <button onClick={handleSave} className="grad-forest noise bouncy" style={{width:'100%',padding:'15px',borderRadius:16,border:'none',color:'white',fontWeight:800,fontSize:15,cursor:'pointer',marginBottom:24,position:'relative'}}>
            Save changes
          </button>

          {/* Account section — these wire to Supabase on deploy */}
          <div style={{borderTop:`1px solid ${C.border}`,paddingTop:20}}>
            <div style={{fontSize:10,fontWeight:800,letterSpacing:'0.18em',textTransform:'uppercase',color:C.inkFaint,marginBottom:12}}>Account</div>

            <button disabled style={{width:'100%',padding:'13px 16px',borderRadius:14,border:`2px solid ${C.border}`,background:C.surface,color:C.inkFaint,fontWeight:700,fontSize:13,cursor:'not-allowed',display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
              <span>Change email</span>
              <span style={{fontSize:9,fontWeight:800,textTransform:'uppercase',letterSpacing:'0.05em',background:C.bgDeep,padding:'3px 7px',borderRadius:8}}>on launch</span>
            </button>
            <button disabled style={{width:'100%',padding:'13px 16px',borderRadius:14,border:`2px solid ${C.border}`,background:C.surface,color:C.inkFaint,fontWeight:700,fontSize:13,cursor:'not-allowed',display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
              <span>Reset password</span>
              <span style={{fontSize:9,fontWeight:800,textTransform:'uppercase',letterSpacing:'0.05em',background:C.bgDeep,padding:'3px 7px',borderRadius:8}}>on launch</span>
            </button>
            <p style={{fontSize:11,color:C.inkFaint,fontWeight:600,lineHeight:1.5,margin:'4px 0 16px'}}>
              Email & password tools turn on automatically once the app is deployed with accounts.
            </p>

            <button onClick={onDeleteAccount} className="bouncy" style={{width:'100%',padding:'13px 16px',borderRadius:14,border:`2px solid ${C.clay}`,background:'transparent',color:C.clay,fontWeight:800,fontSize:13,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
              <Trash2 size={14} strokeWidth={2}/> Delete all my data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
