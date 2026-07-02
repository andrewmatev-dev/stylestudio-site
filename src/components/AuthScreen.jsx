'use client';

import { useState } from 'react';
import { getSupabase } from '@/lib/supabase';

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
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #FF9E4D 0%, #FF5757 60%, #F06595 100%)',
      padding: 24, color: 'white', fontFamily: 'system-ui'
    }}>
      <div style={{ maxWidth: 360, width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>✨</div>
        <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 8, lineHeight: 1.1 }}>
          style<i style={{ fontWeight: 300 }}>studio</i>
        </h1>
        <p style={{ opacity: 0.95, marginBottom: 32, fontSize: 15 }}>
          For men, women, and everyone. Your wardrobe, styled by AI.
        </p>

        {sent ? (
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 16, padding: 20 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>📬</div>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>Check your email</div>
            <div style={{ fontSize: 13, opacity: 0.9 }}>We sent a sign-in link to {email}</div>
          </div>
        ) : (
          <>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={{
                width: '100%', padding: '14px 16px', borderRadius: 16,
                border: 'none', fontSize: 16, marginBottom: 12, outline: 'none',
                background: 'rgba(255,255,255,0.95)', color: '#2A2520', fontWeight: 600
              }}
            />
            {error && <div style={{ color: '#FFE3E3', fontSize: 13, marginBottom: 12 }}>{error}</div>}
            <button onClick={submit} disabled={loading}
              style={{
                width: '100%', padding: '14px 16px', borderRadius: 16,
                border: 'none', background: '#2A2520', color: 'white',
                fontWeight: 800, fontSize: 15, cursor: 'pointer',
                opacity: loading ? 0.6 : 1
              }}>
              {loading ? 'Sending…' : 'Send sign-in link →'}
            </button>
            <div style={{ marginTop: 16, fontSize: 11, opacity: 0.8 }}>
              No password. We email you a one-tap sign-in link.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
