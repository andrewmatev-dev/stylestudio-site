'use client';

import { useState } from 'react';
import { getSupabase } from '@/lib/supabase';

const F  = '#0F2010'; // forest
const FM = '#1A3C1C'; // forest mid
const CR = '#F2E8D0'; // warm cream
const O  = '#B87833'; // ochre gold
const S  = '#3E6844'; // sage

// Leaf Hanger mark — same logo used in the main app header
function LeafHangerLogo({ size = 40, fg = CR, ac = O }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path d="M8 36 C8 36 14 28 24 28 C34 28 40 36 40 36" stroke={fg} strokeWidth="2.8" strokeLinecap="round"/>
      <path d="M24 28 L24 18" stroke={fg} strokeWidth="2.8" strokeLinecap="round"/>
      <path d="M24 18 C24 18 24 10 30 10 C32 10 33 12 32 14 C31 16 29 16 27 15 C25 14 24 12 24 10" stroke={fg} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M11 31 C9 27 11 23 15 24 C15 24 12 28 14 31" fill={ac} opacity="0.9"/>
    </svg>
  );
}

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function submit() {
    if (!email || !email.includes('@')) { setError('Enter a valid email'); return; }
    setError(null);
    setLoading(true);
    try {
      const sb = getSupabase();
      const { error } = await sb.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined }
      });
      if (error) throw error;
      setSent(true);
    } catch (e) {
      setError(e.message || 'Could not send link');
    } finally { setLoading(false); }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: `linear-gradient(160deg, ${F} 0%, ${FM} 55%, ${F} 100%)`,
      padding: 28, color: CR, fontFamily: "'Manrope', system-ui, sans-serif",
      position: 'relative', overflow: 'hidden'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .ss-input::placeholder { color: rgba(242,232,208,0.45); }
        .ss-btn { transition: transform .15s ease, opacity .15s ease; }
        .ss-btn:active { transform: scale(0.97); }
      `}</style>

      {/* Subtle decorative leaf, faint, top right */}
      <div style={{ position: 'absolute', top: -30, right: -20, opacity: 0.06 }}>
        <LeafHangerLogo size={260} fg={CR} ac={CR} />
      </div>
      <div style={{ position: 'absolute', bottom: -10, left: -30, opacity: 0.05 }}>
        <LeafHangerLogo size={180} fg={CR} ac={CR} />
      </div>

      <div style={{ maxWidth: 380, width: '100%', textAlign: 'center', position: 'relative' }}>

        {/* Logo mark */}
        <div style={{
          width: 64, height: 64, borderRadius: 18, margin: '0 auto 20px',
          background: 'rgba(242,232,208,0.08)', border: `1.5px solid rgba(242,232,208,0.18)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <LeafHangerLogo size={38} fg={CR} ac={O} />
        </div>

        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.3em', textTransform: 'uppercase', color: O, marginBottom: 10 }}>
          The atelier in your pocket
        </div>

        <h1 style={{
          fontFamily: "'Fraunces', Georgia, serif", fontSize: 40, fontWeight: 700,
          letterSpacing: '-0.02em', lineHeight: 1.08, margin: '0 0 14px'
        }}>
          Dress like it's <span style={{ fontStyle: 'italic', fontWeight: 300, color: O }}>intentional.</span>
        </h1>

        <p style={{ fontSize: 14, color: 'rgba(242,232,208,0.7)', fontWeight: 500, lineHeight: 1.6, margin: '0 0 32px' }}>
          Your closet, catalogued. Your outfits, composed by AI.
          One email away from getting dressed with intention.
        </p>

        {sent ? (
          <div style={{
            background: 'rgba(242,232,208,0.07)', border: `1px solid rgba(242,232,208,0.15)`,
            borderRadius: 20, padding: '28px 24px'
          }}>
            <div style={{ fontSize: 30, marginBottom: 10 }}>📬</div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 19, fontWeight: 700, marginBottom: 6 }}>
              Check your email
            </div>
            <div style={{ fontSize: 13, color: 'rgba(242,232,208,0.65)', fontWeight: 500 }}>
              We sent a one-tap sign-in link to<br/>
              <span style={{ color: CR, fontWeight: 700 }}>{email}</span>
            </div>
          </div>
        ) : (
          <>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="ss-input"
              style={{
                width: '100%', padding: '15px 18px', borderRadius: 16,
                border: `1.5px solid rgba(242,232,208,0.2)`, fontSize: 16, marginBottom: 12, outline: 'none',
                background: 'rgba(242,232,208,0.06)', color: CR, fontWeight: 600,
                fontFamily: "'Manrope', sans-serif"
              }}
            />
            {error && <div style={{ color: '#E8A87C', fontSize: 13, fontWeight: 600, marginBottom: 12 }}>{error}</div>}
            <button onClick={submit} disabled={loading} className="ss-btn"
              style={{
                width: '100%', padding: '15px 18px', borderRadius: 16,
                border: 'none', background: O, color: F,
                fontWeight: 800, fontSize: 15, cursor: 'pointer',
                opacity: loading ? 0.6 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
              }}>
              {loading ? 'Sending…' : 'Send sign-in link →'}
            </button>
            <div style={{ marginTop: 18, fontSize: 11, color: 'rgba(242,232,208,0.45)', fontWeight: 600, letterSpacing: '0.02em' }}>
              No password to remember. Just one link, sent straight to you.
            </div>
          </>
        )}

        <div style={{ marginTop: 40, fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(242,232,208,0.3)' }}>
          Style<span style={{ fontStyle: 'italic', fontWeight: 300 }}>Studio</span> · For everyone with a closet
        </div>
      </div>
    </div>
  );
}
