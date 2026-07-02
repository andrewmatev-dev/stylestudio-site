'use client';

import { useEffect, useState } from 'react';
import { getSupabase } from '@/lib/supabase';
import StyleStudio from '@/components/StyleStudio';
import AuthScreen from '@/components/AuthScreen';

export default function Page() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sb = getSupabase();
    sb.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: { subscription } } = sb.auth.onAuthStateChange((_, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{
        height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#FFF8EE', color: '#2A2520', fontFamily: 'system-ui'
      }}>
        <div>Loading…</div>
      </div>
    );
  }

  if (!session) return <AuthScreen />;
  return <StyleStudio />;
}
