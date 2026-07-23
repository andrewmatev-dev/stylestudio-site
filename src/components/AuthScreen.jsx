'use client';

import { useState } from 'react';
import { getSupabase } from '@/lib/supabase';
import { Heart } from 'lucide-react';

// ── Flat White (30A) — same tokens as the landing page ──
const PAGE="#F6F0E8", SOFT="#EEE6D9", PANEL="#E6DBCA", CARD="#FBF7F0";
const INK="#3A302A", INKDIM="rgba(58,48,40,.66)", INKFAINT="rgba(58,48,40,.42)", LINE="rgba(58,48,40,.14)";
const DEEP="#7A6650", DEEP2="#62503E", ACCENT="#8E7A62", ACCENT2="#6A5844";
const ONDEEP="#F8F3EA", ONDEEPSUB="rgba(248,243,234,.78)";

function Leaf({ size = 30, fg = "#fff", ac = "#000" }) {
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
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);

  function isAtLeast18(dateStr) {
    if (!dateStr) return false;
    const dob = new Date(dateStr);
    if (isNaN(dob.getTime())) return false;
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return age >= 18;
  }

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
    if (!birthdate) { setError('Enter your date of birth'); return; }
    if (!isAtLeast18(birthdate)) { setError('You must be 18 or older to use StyleStudio'); return; }
    setError(null); setInfo(null); setLoading(true);
    try {
      const sb = getSupabase();
      const { data, error: signUpErr } = await sb.auth.signUp({ email, password });
      if (signUpErr) { setError(signUpErr.message || 'Could not create account'); return; }

      if (data.session) {
        const { error: nameErr } = await sb.from('profiles').update({ display_name: username.trim() }).eq('id', data.user.id);
        if (nameErr) {
          if (nameErr.message?.includes('duplicate') || nameErr.code === '23505') {
            setError('That username is already taken — try another');
          } else {
            setError('Account created, but could not save username. You can set it later in Settings.');
          }
          return;
        }
      } else {
        setInfo('Account created! Check your email to confirm, then log in with your username and password.');
        setMode('login');
      }
    } catch (e) {
      setError(e.message || 'Could not create account');
    } finally { setLoading(false); }
  }

  function submit() {
    if (mode === 'login') handleLogin(); else handleSignup();
  }

  const inputStyle = {
    width:'100%',padding:'13px 16px',borderRadius:10,border:`1px solid rgba(248,243,234,.3)`,
    background:'rgba(248,243,234,.1)',color:ONDEEP,fontSize:14,fontWeight:600,marginBottom:10,
    outline:'none',fontFamily:'inherit'
  };

  return (
    <div style={{background:PAGE,fontFamily:"'DM Sans','Manrope',system-ui,sans-serif",color:INK}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,300;1,9..144,400&family=DM+Sans:opsz,wght@9..40,400..800&display=swap');
        * { box-sizing: border-box; }
        .ss-input::placeholder { color: rgba(248,243,234,0.5); }
        .ss-btn { transition: transform .15s ease, opacity .15s ease; }
        .ss-btn:active { transform: scale(0.97); }
      `}</style>

      {/* ── Light hero, like the landing page ── */}
      <div style={{padding:'36px 22px 34px',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:-30,right:-20,opacity:.07}}><Leaf size={200} fg={DEEP}/></div>

        <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:26,position:'relative'}}>
          <div style={{width:32,height:32,borderRadius:9,background:CARD,border:`1px solid ${LINE}`,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <Leaf size={18} fg={DEEP} ac={ACCENT}/>
          </div>
          <span style={{fontFamily:"'Fraunces',serif",fontSize:16,fontWeight:700}}>style<span style={{fontStyle:'italic',fontWeight:300,color:ACCENT2}}>studio</span></span>
        </div>

        <div style={{fontSize:9,fontWeight:800,letterSpacing:'.3em',textTransform:'uppercase',color:ACCENT,marginBottom:12,position:'relative'}}>Good morning</div>
        <h1 style={{fontFamily:"'Fraunces',serif",fontSize:30,fontWeight:700,letterSpacing:'-0.02em',lineHeight:1.1,margin:'0 0 14px',position:'relative'}}>
          Everything you own,<br/><span style={{fontStyle:'italic',fontWeight:300,color:ACCENT2}}>finally makes sense.</span>
        </h1>
        <p style={{fontSize:13,color:INKDIM,fontWeight:500,lineHeight:1.6,marginBottom:22,maxWidth:300,position:'relative'}}>
          Photograph your closet once. From then on, we already know what you'd wear.
        </p>

        {/* ── The one deep taupe anchor: the login card ── */}
        <div style={{maxWidth:340,position:'relative',borderRadius:18,padding:'18px 18px 16px',background:`linear-gradient(150deg,${DEEP},${DEEP2})`,boxShadow:'0 24px 48px -24px rgba(58,48,40,.4)'}}>
          <div style={{display:'flex',gap:4,padding:4,borderRadius:12,background:'rgba(248,243,234,.08)',border:'1px solid rgba(248,243,234,.16)',marginBottom:14}}>
            {['login','signup'].map(m => (
              <button key={m} onClick={()=>{setMode(m);setError(null);setInfo(null);}}
                style={{flex:1,padding:'9px 0',borderRadius:9,border:'none',cursor:'pointer',fontWeight:800,fontSize:12,
                  background: mode===m ? ONDEEP : 'transparent', color: mode===m ? DEEP2 : ONDEEPSUB}}>
                {m === 'login' ? 'Log in' : 'Create account'}
              </button>
            ))}
          </div>

          <input
            value={username} onChange={e=>setUsername(e.target.value)}
            placeholder="Username"
            className="ss-input"
            style={inputStyle}
          />

          {mode === 'signup' && (
            <input
              value={email} onChange={e=>setEmail(e.target.value)}
              type="email" placeholder="your@email.com"
              className="ss-input"
              style={inputStyle}
            />
          )}

          {mode === 'signup' && (
            <>
              <div style={{fontSize:10,fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',color:ONDEEPSUB,margin:'2px 0 6px'}}>Date of birth</div>
              <input
                value={birthdate} onChange={e=>setBirthdate(e.target.value)}
                type="date"
                className="ss-input"
                style={{...inputStyle,padding:'12px 16px',colorScheme:'dark'}}
              />
            </>
          )}

          <input
            value={password} onChange={e=>setPassword(e.target.value)}
            type="password" placeholder="Password"
            className="ss-input"
            onKeyDown={e => { if (e.key === 'Enter') submit(); }}
            style={inputStyle}
          />

          {error && <div style={{color:'#F5D3A8',fontSize:12,fontWeight:600,marginBottom:10}}>{error}</div>}
          {info && <div style={{color:'#EFDFC6',fontSize:12,fontWeight:600,marginBottom:10,lineHeight:1.5}}>{info}</div>}

          <button onClick={submit} disabled={loading} className="ss-btn"
            style={{width:'100%',padding:'14px',borderRadius:10,border:'none',background:ONDEEP,color:ACCENT2,fontWeight:800,fontSize:14,cursor:'pointer',opacity:loading?0.6:1}}>
            {loading ? 'Please wait…' : mode === 'login' ? 'Log in →' : 'Create account →'}
          </button>

          <div style={{fontSize:11,color:ONDEEPSUB,fontWeight:600,marginTop:10}}>
            {mode === 'login' ? "New here? Tap \"Create account\" above." : 'You must be 18 or older to join. Your email is only used for account recovery.'}
          </div>
        </div>
      </div>

      <div style={{padding:'26px 22px 6px'}}>
        <div style={{fontSize:9,fontWeight:800,letterSpacing:'.2em',textTransform:'uppercase',color:ACCENT,marginBottom:6}}>Already put together</div>
        <h2 style={{fontFamily:"'Fraunces',serif",fontSize:22,fontWeight:700,margin:'0 0 16px'}}>
          Three outfits, <span style={{fontStyle:'italic',fontWeight:300,color:ACCENT2}}>ready when you are.</span>
        </h2>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:1,marginBottom:34}}>
        {[['Office','#D8CFC0','/assets/auth-office.jpg'],['Date night','#C88B8B','/assets/auth-date.jpg'],['Weekend','#A8B89C','/assets/auth-weekend.jpg']].map(([l,c,img],i)=>(
          <div key={i} style={{background:c,aspectRatio:'3/4',display:'flex',alignItems:'flex-end',padding:10,position:'relative',overflow:'hidden'}}>
            <img src={img} alt="" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}} onError={e=>{e.currentTarget.style.display='none';}}/>
            <span style={{fontFamily:"'Fraunces',serif",fontSize:12,fontWeight:700,fontStyle:'italic',color:INK,position:'relative',background:'rgba(251,247,240,.9)',padding:'3px 9px',borderRadius:999}}>{l}</span>
          </div>
        ))}
      </div>

      <div style={{padding:'0 22px 34px'}}>
        <div style={{fontSize:9,fontWeight:800,letterSpacing:'.2em',textTransform:'uppercase',color:ACCENT,marginBottom:6}}>Your people</div>
        <h2 style={{fontFamily:"'Fraunces',serif",fontSize:22,fontWeight:700,margin:'0 0 10px'}}>
          Show off your look. <span style={{fontStyle:'italic',fontWeight:300,color:ACCENT2}}>See theirs too.</span>
        </h2>
        <p style={{fontSize:12,color:INKDIM,fontWeight:600,marginBottom:16,lineHeight:1.6}}>
          Post an outfit you're proud of. Scroll what everyone else is wearing. Save the ones that catch your eye.
        </p>
        <div style={{background:CARD,borderRadius:14,border:`1px solid ${LINE}`,padding:14}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
            <div style={{width:28,height:28,borderRadius:'50%',background:'#C88B8B'}}/>
            <div style={{fontSize:12,fontWeight:800,flex:1}}>Vivienne K.</div>
            <div style={{display:'flex',alignItems:'center',gap:3,background:SOFT,padding:'4px 10px',borderRadius:999}}>
              <Heart size={12} fill={ACCENT} strokeWidth={0}/><span style={{fontSize:11,fontWeight:800,color:ACCENT2}}>62</span>
            </div>
          </div>
          <div style={{fontFamily:"'Fraunces',serif",fontSize:13,fontWeight:700,fontStyle:'italic'}}>Friday Night Out</div>
        </div>
      </div>

      <div style={{background:SOFT,borderTop:`1px solid ${LINE}`,borderBottom:`1px solid ${LINE}`,padding:'30px 22px'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          {[
            ['📸','Snap a photo','We tag the brand, color, and style for you'],
            ['✨','Get dressed','Three outfit options, picked for the day'],
            ['🌿','Share it','Post it, or just keep it for yourself'],
            ['👟','Know your closet','See what you actually reach for'],
          ].map(([icon,title,sub],i)=>(
            <div key={i} style={{background:CARD,border:`1px solid ${LINE}`,borderRadius:12,padding:14}}>
              <div style={{fontSize:18,marginBottom:6}}>{icon}</div>
              <div style={{fontFamily:"'Fraunces',serif",fontSize:13,fontWeight:700,marginBottom:3}}>{title}</div>
              <div style={{fontSize:10,color:INKDIM,fontWeight:600,lineHeight:1.4}}>{sub}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{textAlign:'center',padding:'24px 22px',fontSize:9,fontWeight:700,letterSpacing:'.15em',textTransform:'uppercase',color:INKFAINT}}>
        Style·Studio · For everyone with a closet · 18+
      </div>
    </div>
  );
}
