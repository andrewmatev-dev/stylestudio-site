'use client';

import { useState } from 'react';
import { getSupabase } from '@/lib/supabase';

const NAVY  = '#0B1220';
const NAVY2 = '#16233D';
const GOLD  = '#D4A94A';
const CREAM = '#F3EEE3';
const ROSE  = '#C88B8B';
const SAGE  = '#7C9070';
const CREAM_BG = '#F5F0E4';
const INK   = '#2A2118';
const BORDER = 'rgba(212,169,74,0.2)';
const GLASS  = 'rgba(243,238,227,0.045)';

function Leaf({ size = 26, fg = CREAM, ac = GOLD }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path d="M8 36 C8 36 14 28 24 28 C34 28 40 36 40 36" stroke={fg} strokeWidth="2.8" strokeLinecap="round"/>
      <path d="M24 28 L24 18" stroke={fg} strokeWidth="2.8" strokeLinecap="round"/>
      <path d="M24 18 C24 18 24 10 30 10 C32 10 33 12 32 14 C31 16 29 16 27 15 C25 14 24 12 24 10" stroke={fg} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M11 31 C9 27 11 23 15 24 C15 24 12 28 14 31" fill={ac} opacity="0.9"/>
    </svg>
  );
}

const LOOKS = [
  { label: 'Office', sub: 'Sharp & easy', c: NAVY },
  { label: 'Date night', sub: 'Turn heads', c: '#8B4A54' },
  { label: 'Weekend', sub: 'Barely trying', c: SAGE },
  { label: 'Travel day', sub: 'Pack once', c: '#B87833' },
];

export default function AuthScreen() {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);

  async function handleLogin() {
    if (!username.trim() || !password) { setError('Enter your username and password'); return; }
    setError(null); setInfo(null); setLoading(true);
    try {
      const sb = getSupabase();
      const { data: resolvedEmail, error: lookupErr } = await sb.rpc('get_email_for_username', { p_username: username.trim() });
      if (lookupErr || !resolvedEmail) { setError('No account found with that username'); return; }
      const { error: signInErr } = await sb.auth.signInWithPassword({ email: resolvedEmail, password });
      if (signInErr) { setError('Incorrect password'); return; }
    } catch (e) {
      setError(e.message || 'Could not sign in');
    } finally { setLoading(false); }
  }

  async function handleSignup() {
    if (!username.trim() || username.trim().length < 3) { setError('Username must be at least 3 characters'); return; }
    if (!email || !email.includes('@')) { setError('Enter a valid email'); return; }
    if (!password || password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setError(null); setInfo(null); setLoading(true);
    try {
      const sb = getSupabase();
      const { data, error: signUpErr } = await sb.auth.signUp({ email, password });
      if (signUpErr) { setError(signUpErr.message || 'Could not create account'); return; }
      if (data.session) {
        const { error: nameErr } = await sb.from('profiles').update({ display_name: username.trim() }).eq('id', data.user.id);
        if (nameErr) {
          if (nameErr.message?.includes('duplicate') || nameErr.code === '23505') setError('That username is already taken — try another');
          else setError('Account created, but could not save username. You can set it later in Settings.');
          return;
        }
      } else {
        setInfo('Account created! Check your email to confirm, then log in.');
        setMode('login');
      }
    } catch (e) {
      setError(e.message || 'Could not create account');
    } finally { setLoading(false); }
  }

  function submit() { if (mode === 'login') handleLogin(); else handleSignup(); }

  return (
    <div style={{minHeight:'100vh',background:CREAM_BG,color:INK,fontFamily:"'Manrope',system-ui,sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,600;9..144,700;9..144,900&family=Manrope:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .ss-input::placeholder { color: rgba(242,239,232,0.3); }
        .ss-input:focus { border-color: ${GOLD} !important; box-shadow: 0 0 0 3px rgba(212,169,74,0.12); }
        .ss-btn { transition: transform .15s ease, opacity .15s ease; }
        .ss-btn:active { transform: scale(0.97); }
        .ss-carousel { display:flex; gap:12px; overflow-x:auto; scroll-snap-type:x mandatory; padding:4px 24px 4px; -ms-overflow-style:none; scrollbar-width:none; }
        .ss-carousel::-webkit-scrollbar { display:none; }
        .ss-card { scroll-snap-align:center; flex-shrink:0; }
      `}</style>

      <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:9,padding:'28px 20px 8px'}}>
        <div style={{width:30,height:30,borderRadius:9,background:NAVY,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <Leaf size={17} fg={CREAM} ac={GOLD}/>
        </div>
        <span style={{fontFamily:"'Fraunces',serif",fontSize:15,fontWeight:700,color:INK}}>style<span style={{fontStyle:'italic',fontWeight:300,color:GOLD}}>studio</span></span>
      </div>

      <div style={{textAlign:'center',padding:'12px 24px 26px'}}>
        <div style={{fontSize:10,fontWeight:800,letterSpacing:'.28em',textTransform:'uppercase',color:GOLD,marginBottom:12}}>Every piece, one system</div>
        <h1 style={{fontFamily:"'Fraunces',serif",fontSize:30,fontWeight:700,letterSpacing:'-0.02em',lineHeight:1.12,margin:0,color:INK}}>
          Your closet,<br/><span style={{fontStyle:'italic',fontWeight:300,color:GOLD}}>finally makes sense.</span>
        </h1>
      </div>

      <div style={{marginBottom:8}}>
        <div className="ss-carousel">
          {LOOKS.map((l,i) => (
            <div key={i} className="ss-card" style={{width:150,height:200,borderRadius:20,background:`linear-gradient(160deg, ${l.c} 0%, #0000 140%)`,border:`1px solid ${BORDER}`,position:'relative',overflow:'hidden',display:'flex',flexDirection:'column',justifyContent:'flex-end',padding:16}}>
              <div style={{position:'absolute',top:12,right:12,opacity:.25}}><Leaf size={16}/></div>
              <div style={{fontFamily:"'Fraunces',serif",fontSize:16,fontWeight:700,fontStyle:'italic'}}>{l.label}</div>
              <div style={{fontSize:10,fontWeight:700,color:GOLD,marginTop:2}}>{l.sub}</div>
            </div>
          ))}
        </div>
        <div style={{textAlign:'center',fontSize:10,fontWeight:700,color:'rgba(42,33,24,.4)',letterSpacing:'.1em',textTransform:'uppercase',marginTop:8}}>
          ← swipe through what AI composes →
        </div>
      </div>

      <div style={{padding:'20px 20px 40px',display:'flex',justifyContent:'center'}}>
        <div style={{
          width:'100%', maxWidth:360, position:'relative',
          background: `linear-gradient(165deg, ${NAVY} 0%, ${NAVY2} 100%)`,
          border:`1px solid rgba(212,169,74,0.35)`, borderRadius:22, padding:'26px 24px',
          boxShadow:'0 20px 50px rgba(11,18,32,0.25)'
        }}>
          <div style={{display:'flex',gap:4,padding:4,borderRadius:12,background:'rgba(242,239,232,0.03)',border:`1px solid ${BORDER}`,marginBottom:18}}>
            {['login','signup'].map(m => (
              <button key={m} onClick={()=>{setMode(m);setError(null);setInfo(null);}}
                style={{flex:1,padding:'10px 0',borderRadius:9,border:'none',cursor:'pointer',fontWeight:800,fontSize:12,
                  background: mode===m ? GOLD : 'transparent', color: mode===m ? NAVY : 'rgba(242,239,232,0.5)'}}>
                {m === 'login' ? 'Log in' : 'Sign up'}
              </button>
            ))}
          </div>

          <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Username" className="ss-input"
            style={{width:'100%',padding:'13px 16px',borderRadius:12,border:`1px solid ${BORDER}`,background:'rgba(242,239,232,0.03)',color:CREAM,fontSize:14,fontWeight:600,marginBottom:10,outline:'none',fontFamily:'inherit'}}/>

          {mode === 'signup' && (
            <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="your@email.com" className="ss-input"
              style={{width:'100%',padding:'13px 16px',borderRadius:12,border:`1px solid ${BORDER}`,background:'rgba(242,239,232,0.03)',color:CREAM,fontSize:14,fontWeight:600,marginBottom:10,outline:'none',fontFamily:'inherit'}}/>
          )}

          <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" className="ss-input"
            onKeyDown={e => { if (e.key === 'Enter') submit(); }}
            style={{width:'100%',padding:'13px 16px',borderRadius:12,border:`1px solid ${BORDER}`,background:'rgba(242,239,232,0.03)',color:CREAM,fontSize:14,fontWeight:600,marginBottom:14,outline:'none',fontFamily:'inherit'}}/>

          {error && <div style={{color:'#E8A87C',fontSize:12,fontWeight:600,marginBottom:12,lineHeight:1.5}}>{error}</div>}
          {info && <div style={{color:GOLD,fontSize:12,fontWeight:600,marginBottom:12,lineHeight:1.5}}>{info}</div>}

          <button onClick={submit} disabled={loading} className="ss-btn"
            style={{width:'100%',padding:'14px',borderRadius:12,border:'none',background:GOLD,color:NAVY,fontWeight:800,fontSize:14,cursor:'pointer',opacity:loading?0.6:1,boxShadow:'0 8px 24px rgba(212,169,74,0.25)'}}>
            {loading ? 'Please wait…' : mode === 'login' ? 'Log in →' : 'Create account →'}
          </button>

          <div style={{fontSize:11,color:'rgba(242,239,232,0.35)',fontWeight:600,marginTop:14,textAlign:'center',lineHeight:1.5}}>
            {mode === 'login'
              ? <>New here? <span style={{color:GOLD,cursor:'pointer'}} onClick={()=>setMode('signup')}>Create an account</span></>
              : 'Your email is only used for account recovery.'}
          </div>
        </div>
      </div>

      <div style={{textAlign:'center',padding:'0 24px 28px',fontSize:9,fontWeight:700,letterSpacing:'.15em',textTransform:'uppercase',color:'rgba(42,33,24,.35)'}}>
        Style·Studio · For everyone with a closet
      </div>
    </div>
  );
}
