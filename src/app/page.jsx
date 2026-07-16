"use client";

import { useState, useEffect, useRef } from "react";

// ─── StyleStudio · Flat White (30A) — locked palette ─────────
const T = {
  bg: "#F6F0E8",
  bgSoft: "#EEE6D9",
  panel: "#E6DBCA",
  line: "rgba(58,48,40,0.14)",
  ink: "#3A302A",
  inkDim: "rgba(58,48,40,0.66)",
  inkFaint: "rgba(58,48,40,0.42)",
  deep: "#7A6650",
  accent: "#8E7A62",
  accentBright: "#6A5844",
  blockGrad: "#62503E",
  onDeep: "#F8F3EA",
  onDeepSub: "rgba(248,243,234,0.78)",
  shadow: "rgba(58,48,40,0.18)",
};

const serif = "'Fraunces', serif";
const sans = "'DM Sans', sans-serif";

const LOOKS = [
  { n: "01", name: "Boardroom Standard", line: "Sharp, quiet authority.", pieces: ["Charcoal blazer", "Ivory tee", "Wool trousers", "Leather loafers"], colors: ["#2E2A26", "#F1EAE0", "#6B5844"], img: "/assets/look-1.jpg", fig: { gender: "m", top: "blazer", legs: "slim" } },
  { n: "02", name: "Coffee Run", line: "Effortless, but on purpose.", pieces: ["Camel overshirt", "White tee", "Relaxed denim", "Retro sneakers"], colors: ["#C9A47A", "#F6F1E8", "#5A6B80"], img: "/assets/look-2.jpg", fig: { gender: "w", top: "overshirt", legs: "relaxed" } },
  { n: "03", name: "First Date", line: "Memorable without trying.", pieces: ["Black knit polo", "Pleated trousers", "Chelsea boots"], colors: ["#1E1C1A", "#8A8072", "#3E342A"], img: "/assets/look-3.jpg", fig: { gender: "m", top: "polo", legs: "slim" } },
  { n: "04", name: "Airport Uniform", line: "Six hours, zero regrets.", pieces: ["Beige trench", "Gray hoodie", "Wide-leg pants", "Leather tote"], colors: ["#C4B49A", "#8E8A84", "#4A4238"], img: "/assets/look-4.jpg", fig: { gender: "w", top: "trench", legs: "wide" } },
  { n: "05", name: "Gallery Night", line: "Art-opening polish.", pieces: ["Silk shirt", "Tailored slacks", "Minimal sneakers"], colors: ["#7E9B7C", "#2A2622", "#EDE6DA"], img: "/assets/look-5.jpg", fig: { gender: "w", top: "blouse", legs: "slim" } },
  { n: "06", name: "Gym to Street", line: "Performance that passes as fashion.", pieces: ["Tech jacket", "Tapered joggers", "Neutral runners"], colors: ["#3A3E42", "#1E2022", "#D8D2C6"], img: "/assets/look-6.jpg", fig: { gender: "m", top: "jacket", legs: "jogger" } },
  { n: "07", name: "Wedding Guest", line: "Celebratory, never upstaging.", pieces: ["Sage suit", "Cream shirt", "Suede loafers"], colors: ["#8BA888", "#F4EDE0", "#6E5844"], img: "/assets/look-7.jpg", fig: { gender: "m", top: "suit", legs: "slim" } },
];

// ─── Fashion-sketch figure (inline SVG, no external images) ──
function LookFigure({ look }) {
  const [topC, midC, botC] = look.colors;
  const { gender, top, legs } = look.fig;
  const skin = "#C9B4A0";
  const hair = "#4A3A2E";
  const longTop = top === "trench";
  const hemY = longTop ? 208 : top === "overshirt" || top === "jacket" ? 168 : 158;
  const legW = legs === "wide" ? 17 : legs === "relaxed" ? 14 : legs === "jogger" ? 12 : 11;

  return (
    <svg viewBox="0 0 200 300" style={{ width: "100%", height: "100%", display: "block" }}>
      {/* backdrop */}
      <rect x="0" y="0" width="200" height="300" fill="#F3EBDF" />
      <circle cx="100" cy="120" r="78" fill="#EDE2D0" />
      <rect x="0" y="262" width="200" height="4" fill="rgba(58,48,40,0.15)" />

      {/* hair behind head (women: longer) */}
      {gender === "w" ? (
        <path d="M 78 52 Q 74 96 82 112 L 118 112 Q 126 96 122 52 Q 116 34 100 34 Q 84 34 78 52 Z" fill={hair} />
      ) : null}

      {/* head + neck */}
      <rect x="94" y="62" width="12" height="14" fill={skin} />
      <circle cx="100" cy="52" r="15" fill={skin} />

      {/* hair front */}
      {gender === "w" ? (
        <path d="M 85 48 Q 87 34 100 34 Q 113 34 115 48 Q 108 42 100 42 Q 92 42 85 48 Z" fill={hair} />
      ) : (
        <path d="M 85 49 Q 86 35 100 35 Q 114 35 115 49 Q 110 41 100 41 Q 90 41 85 49 Z" fill={hair} />
      )}

      {/* inner layer (tee/shirt) peeking */}
      <rect x="88" y="76" width="24" height="40" fill={midC} />

      {/* top garment */}
      {top === "blouse" || top === "polo" ? (
        // fitted top, small open collar showing midC
        <path d={`M 78 82 Q 100 72 122 82 L 118 ${hemY} L 82 ${hemY} Z`} fill={topC} />
      ) : (
        // jacket / coat: open front revealing midC strip
        <>
          <path d={`M 76 82 Q 100 70 124 82 L 121 ${hemY} L 106 ${hemY} L 104 88 L 96 88 L 94 ${hemY} L 79 ${hemY} Z`} fill={topC} />
          {/* lapels */}
          <path d="M 96 80 L 90 96 L 96 90 Z" fill={botC} opacity="0.45" />
          <path d="M 104 80 L 110 96 L 104 90 Z" fill={botC} opacity="0.45" />
        </>
      )}

      {/* arms */}
      <path d={`M 78 86 Q 66 110 70 ${hemY - 18} L 79 ${hemY - 18} Q 76 112 84 92 Z`} fill={topC} />
      <path d={`M 122 86 Q 134 110 130 ${hemY - 18} L 121 ${hemY - 18} Q 124 112 116 92 Z`} fill={topC} />
      {/* hands */}
      <circle cx="73" cy={hemY - 12} r="5" fill={skin} />
      <circle cx="127" cy={hemY - 12} r="5" fill={skin} />

      {/* legs */}
      <path d={`M ${100 - legW - 4} ${hemY} L ${100 - 2} ${hemY} L ${legs === "wide" ? 100 - legW - 8 : 100 - legW + 2} 252 L ${100 - legW - (legs === "wide" ? 24 : 14)} 252 Z`} fill={botC} />
      <path d={`M ${100 + 2} ${hemY} L ${100 + legW + 4} ${hemY} L ${100 + legW + (legs === "wide" ? 24 : 14)} 252 L ${legs === "wide" ? 100 + legW + 8 : 100 + legW - 2} 252 Z`} fill={botC} />
      {/* jogger cuffs */}
      {legs === "jogger" ? (
        <>
          <rect x={100 - legW - 14} y="244" width="13" height="8" fill={midC} opacity="0.8" />
          <rect x={100 + legW + 1} y="244" width="13" height="8" fill={midC} opacity="0.8" />
        </>
      ) : null}

      {/* shoes */}
      <path d={`M ${100 - legW - (legs === "wide" ? 24 : 14)} 252 L ${legs === "wide" ? 100 - legW - 8 : 100 - legW + 2} 252 L ${100 - legW + 4} 262 L ${100 - legW - (legs === "wide" ? 30 : 20)} 262 Z`} fill="#3A302A" />
      <path d={`M ${legs === "wide" ? 100 + legW + 8 : 100 + legW - 2} 252 L ${100 + legW + (legs === "wide" ? 24 : 14)} 252 L ${100 + legW + (legs === "wide" ? 30 : 20)} 262 L ${100 + legW - 4} 262 Z`} fill="#3A302A" />

      {/* trench belt */}
      {longTop ? <rect x="80" y="138" width="40" height="7" fill={botC} opacity="0.7" /> : null}
    </svg>
  );
}

const FEATURES = [
  { n: "01", title: "Home & AI Stylist", copy: "A daily edit built from your closet, your calendar, and the weather. Your stylist learns what you love — and quietly retires what you don't." },
  { n: "02", title: "Digital Closet", copy: "Photograph each piece once and it's catalogued forever — searchable by color, season, fabric, and how often you actually wear it." },
  { n: "03", title: "Creative Canvas", copy: "Drag, layer, and remix your pieces on a buttery-smooth canvas with studio effects. Moodboard energy, made from clothes you already own." },
  { n: "04", title: "Outfit Calendar", copy: "Assign looks to dates, dress for the forecast, and never repeat an outfit at the same dinner table twice." },
  { n: "05", title: "Social Studio", copy: "Link your accounts, share fits with friends, and see which looks earn the loudest applause." },
];

const FAQS = [
  { q: "How do I add clothes to my digital closet?", a: "Photograph each piece in the Closet tab — StyleStudio handles cataloguing with smart tags for color, category, and season. Most people digitize their entire wardrobe in one cozy evening." },
  { q: "What makes the AI stylist different?", a: "It only recommends clothes you actually own. It blends your closet, your calendar, the local weather, and what you've loved before into a daily edit — no generic shopping links, just you at your best." },
  { q: "Is StyleStudio free to use?", a: "Yes — you can build your digital closet, get daily AI picks, and plan outfits on the calendar. Premium tools unlock as the studio grows with you." },
  { q: "Which platforms is StyleStudio on?", a: "StyleStudio runs right in your browser on any phone or computer — nothing to download. Sign in at stylestudio.to and your closet is with you everywhere." },
];

function Counter({ target, suffix = "", decimals = 0 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const t0 = performance.now();
          const dur = 1600;
          const tick = (t) => {
            const p = Math.min((t - t0) / dur, 1);
            setVal(target * (1 - Math.pow(1 - p, 3)));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );
    if (el) obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {val.toLocaleString(undefined, { maximumFractionDigits: decimals, minimumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}

function Eyebrow({ children }) {
  return (
    <div style={{ fontFamily: sans, fontSize: 11, letterSpacing: "0.26em", textTransform: "uppercase", color: T.accent, marginBottom: 16 }}>
      {children}
    </div>
  );
}

function H2({ children }) {
  return (
    <h2 style={{ fontFamily: serif, fontWeight: 500, fontSize: "clamp(30px, 4.5vw, 48px)", lineHeight: 1.1, margin: "0 0 18px", color: T.ink }}>
      {children}
    </h2>
  );
}

const Em = ({ children }) => <em style={{ fontStyle: "italic", color: T.accentBright }}>{children}</em>;

function GhostBtn({ children, onClick }) {
  return (
    <button onClick={onClick} style={{ fontFamily: sans, fontSize: 14.5, fontWeight: 500, color: T.ink, background: "transparent", border: `1px solid ${T.line}`, borderRadius: 999, padding: "13px 26px", cursor: "pointer" }}>
      {children}
    </button>
  );
}

function SolidBtn({ children, onClick, href }) {
  const style = { display: "inline-block", textDecoration: "none", fontFamily: sans, fontSize: 14.5, fontWeight: 700, color: T.onDeep, background: `linear-gradient(120deg, ${T.accent}, ${T.accentBright})`, border: "none", borderRadius: 999, padding: "14px 28px", cursor: "pointer", boxShadow: `0 12px 28px -12px ${T.shadow}` };
  if (href) return <a href={href} style={style}>{children}</a>;
  return <button onClick={onClick} style={style}>{children}</button>;
}

export default function StyleStudioLanding() {
  const [feature, setFeature] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div style={{ background: T.bg, color: T.ink, fontFamily: sans, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;1,9..144,400;1,9..144,500&family=DM+Sans:wght@400;500;700&display=swap');
        html { scroll-behavior: smooth; }
        * { box-sizing: border-box; }
        .lookrow { display: flex; gap: 18px; overflow-x: auto; padding-bottom: 12px; }
        .lookcard { transition: transform 350ms ease; }
        .lookcard:hover { transform: translateY(-6px); }
        .navlink { color: ${T.inkDim}; font-size: 14px; cursor: pointer; background: none; border: none; font-family: 'DM Sans', sans-serif; padding: 0; }
        .navlink:hover { color: ${T.ink}; }
        input::placeholder { color: ${T.inkFaint}; }
        @media (max-width: 860px) {
          .hero-grid, .feat-grid, .test-grid, .steps-grid { grid-template-columns: 1fr !important; }
          .navlinks { display: none !important; }
        }
        @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } * { transition: none !important; } }
      `}</style>

      {/* ── Nav ── */}
      <nav
        style={{
          position: "sticky", top: 0, zIndex: 50,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "18px clamp(20px, 5vw, 64px)",
          background: "rgba(246,240,232,0.85)", backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${T.line}`,
        }}
      >
        <div style={{ fontFamily: serif, fontSize: 21 }}>
          Style<Em>Studio</Em>
        </div>
        <div className="navlinks" style={{ display: "flex", gap: 28 }}>
          {[["Features", "features"], ["Lookbook", "lookbook"], ["How it works", "how"], ["FAQ", "faq"]].map(([label, id]) => (
            <button key={id} className="navlink" onClick={() => scrollTo(id)}>{label}</button>
          ))}
        </div>
        <SolidBtn href="/login">Sign in</SolidBtn>
      </nav>

      {/* ── Hero ── */}
      <header style={{ padding: "clamp(60px, 10vw, 110px) clamp(20px, 5vw, 64px) 60px", maxWidth: 1200, margin: "0 auto" }}>
        <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: 56, alignItems: "center" }}>
          <div>
            <Eyebrow>The fashion app, reimagined</Eyebrow>
            <h1 style={{ fontFamily: serif, fontWeight: 500, fontSize: "clamp(40px, 6vw, 68px)", lineHeight: 1.05, margin: "0 0 22px" }}>
              Your wardrobe, curated by <Em>intelligence.</Em>
            </h1>
            <p style={{ fontSize: 17, lineHeight: 1.65, color: T.inkDim, maxWidth: 480, margin: "0 0 30px" }}>
              Digitize your closet, compose outfits on a creative canvas, plan every look on your
              calendar — and let your personal AI stylist do the thinking.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 46 }}>
              <SolidBtn href="/login">Get started free</SolidBtn>
              <GhostBtn onClick={() => scrollTo("features")}>Explore features</GhostBtn>
            </div>
          </div>

          {/* Phone preview */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ width: 300, borderRadius: 36, border: `1px solid ${T.line}`, background: `linear-gradient(180deg, #FBF7F0, ${T.bgSoft})`, padding: 22, boxShadow: `0 40px 80px -30px ${T.shadow}` }}>
              <div style={{ fontSize: 12, color: T.inkFaint, marginBottom: 4 }}>Good evening</div>
              <div style={{ fontFamily: serif, fontSize: 26, marginBottom: 18 }}>
                What are we <Em>wearing?</Em>
              </div>
              <div style={{ borderRadius: 18, padding: 16, background: `linear-gradient(140deg, ${T.deep}, ${T.blockGrad})`, marginBottom: 14 }}>
                <div style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: T.onDeepSub, marginBottom: 8 }}>
                  AI Stylist ✦ New pick
                </div>
                <div style={{ fontSize: 14.5, lineHeight: 1.5, color: T.onDeep }}>
                  Cream knit, tailored trousers — 18°C and clear skies tonight.
                </div>
              </div>
              <div style={{ borderRadius: 18, padding: 16, border: `1px solid ${T.line}`, marginBottom: 14, background: "#FBF7F0" }}>
                <div style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: T.inkFaint, marginBottom: 8 }}>
                  Friday, 7 pm
                </div>
                <div style={{ fontSize: 14.5 }}>Gallery opening · look planned</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {[T.accent, "#C9BFA8", "#8A8478", T.deep].map((c, i) => (
                  <div key={i} style={{ flex: 1, height: 54, borderRadius: 12, background: c, opacity: 0.9 }} />
                ))}
              </div>
              <div style={{ fontSize: 11.5, color: T.inkFaint, marginTop: 10 }}>Closet · 128 items</div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Features ── */}
      <section id="features" style={{ padding: "80px clamp(20px, 5vw, 64px)", maxWidth: 1200, margin: "0 auto" }}>
        <Eyebrow>The atelier in your pocket</Eyebrow>
        <H2>Five tools. One <Em>signature</Em> style.</H2>
        <p style={{ color: T.inkDim, maxWidth: 520, margin: "0 0 40px", lineHeight: 1.6 }}>
          Everything in StyleStudio lives around your real wardrobe — select a feature to see it on screen.
        </p>
        <div className="feat-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
          <div>
            {FEATURES.map((f, i) => (
              <button
                key={f.n}
                onClick={() => setFeature(i)}
                style={{
                  display: "block", width: "100%", textAlign: "left", background: "none",
                  border: "none", borderBottom: `1px solid ${T.line}`, padding: "18px 4px",
                  cursor: "pointer", fontFamily: serif, fontSize: 22,
                  color: i === feature ? T.accentBright : T.inkDim, transition: "color 250ms ease",
                }}
              >
                <span style={{ fontFamily: sans, fontSize: 12, marginRight: 14, color: T.inkFaint }}>{f.n}</span>
                {f.title}
              </button>
            ))}
          </div>
          <div style={{ borderRadius: 24, border: `1px solid ${T.line}`, background: T.panel, padding: 34, display: "flex", flexDirection: "column", justifyContent: "center", minHeight: 280, boxShadow: `0 24px 48px -28px ${T.shadow}` }}>
            <div style={{ fontFamily: serif, fontSize: 26, marginBottom: 14 }}>{FEATURES[feature].title}</div>
            <p style={{ color: T.inkDim, lineHeight: 1.7, fontSize: 15.5, margin: 0 }}>{FEATURES[feature].copy}</p>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" style={{ padding: "80px clamp(20px, 5vw, 64px)", maxWidth: 1200, margin: "0 auto" }}>
        <Eyebrow>From hanger to head-turner</Eyebrow>
        <H2>Three steps to a <Em>smarter</Em> wardrobe.</H2>
        <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22, marginTop: 36 }}>
          {[
            ["№1", "Capture your closet", "Snap your pieces once. StyleStudio tags color, category, and season automatically, building a wardrobe you can search like a boutique."],
            ["№2", "Compose & plan", "Style outfits on the canvas, then drop them onto your calendar — date nights, interviews, and Tuesdays all deserve intention."],
            ["№3", "Let the AI refine you", "Your stylist studies what you wear and love, then serves daily recommendations that feel like you — only sharper."],
          ].map(([n, title, copy]) => (
            <div key={n} style={{ borderRadius: 22, border: `1px solid ${T.line}`, padding: 28, background: T.bgSoft }}>
              <div style={{ fontFamily: serif, fontSize: 22, color: T.accent, marginBottom: 14 }}>{n}</div>
              <div style={{ fontFamily: serif, fontSize: 21, marginBottom: 10 }}>{title}</div>
              <p style={{ color: T.inkDim, fontSize: 14.5, lineHeight: 1.65, margin: 0 }}>{copy}</p>
            </div>
          ))}
        </div>
        <blockquote style={{ margin: "56px auto 0", maxWidth: 640, textAlign: "center", fontFamily: serif, fontStyle: "italic", fontSize: "clamp(19px, 2.4vw, 24px)", lineHeight: 1.5, color: T.ink }}>
          “Style is a way to say who you are without having to speak. StyleStudio just makes sure you never mumble.”
          <div style={{ fontFamily: sans, fontStyle: "normal", fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: T.inkFaint, marginTop: 16 }}>
            — The StyleStudio philosophy
          </div>
        </blockquote>
      </section>

      {/* ── Lookbook ── */}
      <section id="lookbook" style={{ padding: "80px 0 80px clamp(20px, 5vw, 64px)" }}>
        <div style={{ maxWidth: 1200, marginBottom: 34 }}>
          <Eyebrow>The lookbook</Eyebrow>
          <H2>Tomorrow's looks, in <Em>orbit.</Em></H2>
          <p style={{ color: T.inkDim, margin: 0 }}>A rotating edit of StyleStudio signature outfits — scroll on.</p>
        </div>
        <div className="lookrow">
          {LOOKS.map((l) => (
            <div key={l.n} className="lookcard" style={{ flex: "0 0 auto", width: 250, borderRadius: 20, overflow: "hidden", border: `1px solid ${T.line}`, background: "#FBF7F0", boxShadow: `0 18px 36px -22px ${T.shadow}` }}>
              {/* Outfit photo — the illustrated figure shows automatically until the photo exists */}
              <div style={{ height: 280, position: "relative" }}>
                <LookFigure look={l} />
                <img
                  src={l.img}
                  alt={`${l.name} outfit`}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
              {/* Fit palette strip */}
              <div style={{ display: "flex", height: 8 }}>
                {l.colors.map((c, i) => (
                  <div key={i} style={{ flex: 1, background: c }} />
                ))}
              </div>
              <div style={{ padding: "16px 16px 18px" }}>
                <div style={{ marginBottom: 6 }}>
                  <span style={{ fontSize: 11.5, color: T.inkFaint, marginRight: 10 }}>Look {l.n}</span>
                  <span style={{ fontFamily: serif, fontStyle: "italic", fontSize: 17, color: T.accentBright }}>{l.name}</span>
                </div>
                <div style={{ fontSize: 12.5, color: T.inkDim, marginBottom: 12 }}>{l.line}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {l.pieces.map((p) => (
                    <span key={p} style={{ fontSize: 11.5, color: T.inkDim, border: `1px solid ${T.line}`, borderRadius: 999, padding: "4px 10px", background: T.bg }}>
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={{ padding: "80px clamp(20px, 5vw, 64px)", maxWidth: 1200, margin: "0 auto" }}>
        <Eyebrow>Word on the street style</Eyebrow>
        <H2>Loved by people with <Em>great taste.</Em></H2>
        <div className="test-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22, marginTop: 32 }}>
          {[
            ["Danielle S.", "Verified member · LA", "I travel for work twice a month and used to overpack every time. Now I plan a week of outfits in five minutes and my carry-on actually closes."],
            ["Marcus T.", "Early access user", "Didn't expect a fashion app to stick, but the daily pick is the first notification I actually open. It knows my closet better than I do."],
            ["Priya N.", "Content creator", "I photograph fits for a living and StyleStudio's canvas replaced three apps in my workflow. Planning a month of content takes one coffee."],
          ].map(([name, role, quote]) => (
            <div key={name} style={{ borderRadius: 22, border: `1px solid ${T.line}`, padding: 26, background: "#FBF7F0", boxShadow: `0 18px 36px -26px ${T.shadow}` }}>
              <div style={{ color: T.accent, letterSpacing: 3, marginBottom: 14 }}>★★★★★</div>
              <p style={{ fontSize: 14.5, lineHeight: 1.7, color: T.inkDim, margin: "0 0 20px" }}>“{quote}”</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: T.deep, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: serif, color: T.onDeep }}>
                  {name[0]}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{name}</div>
                  <div style={{ fontSize: 12, color: T.inkFaint }}>{role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ padding: "80px clamp(20px, 5vw, 64px)", maxWidth: 780, margin: "0 auto" }}>
        <Eyebrow>Questions, answered</Eyebrow>
        <H2>Before you <Em>commit</Em> to the fit.</H2>
        <div style={{ marginTop: 22 }}>
          {FAQS.map((f, i) => (
            <div key={f.q} style={{ borderBottom: `1px solid ${T.line}` }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                style={{
                  width: "100%", textAlign: "left", background: "none", border: "none",
                  padding: "20px 4px", cursor: "pointer", display: "flex",
                  justifyContent: "space-between", alignItems: "center", gap: 16,
                  fontFamily: serif, fontSize: 18.5,
                  color: openFaq === i ? T.accentBright : T.ink,
                }}
              >
                {f.q}
                <span style={{ fontFamily: sans, fontSize: 20, color: T.inkFaint }}>{openFaq === i ? "−" : "+"}</span>
              </button>
              {openFaq === i && (
                <p style={{ fontSize: 14.5, lineHeight: 1.7, color: T.inkDim, margin: "0 0 22px", padding: "0 4px" }}>{f.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Signup CTA ── */}
      <section
        id="download"
        style={{
          margin: "40px auto 80px", maxWidth: 1000,
          borderRadius: 30, border: `1px solid ${T.line}`,
          background: `linear-gradient(150deg, ${T.deep}, ${T.blockGrad})`,
          padding: "clamp(40px, 6vw, 70px)", textAlign: "center",
          color: T.onDeep, boxShadow: `0 32px 64px -32px ${T.shadow}`,
        }}
      >
        <div style={{ fontFamily: sans, fontSize: 11, letterSpacing: "0.26em", textTransform: "uppercase", color: T.onDeepSub, marginBottom: 16 }}>
          Free to start
        </div>
        <h2 style={{ fontFamily: serif, fontWeight: 500, fontSize: "clamp(30px, 4.5vw, 48px)", lineHeight: 1.1, margin: "0 0 18px", color: T.onDeep }}>
          Dress like it's <em style={{ fontStyle: "italic", color: "#EFDFC6" }}>intentional.</em>
        </h2>
        <p style={{ color: T.onDeepSub, maxWidth: 480, margin: "0 auto 28px", lineHeight: 1.65 }}>
          Create your account, photograph your first pieces tonight, and wake up to an outfit
          already picked for you.
        </p>
        <a
          href="/login"
          style={{ display: "inline-block", textDecoration: "none", fontFamily: sans, fontSize: 15, fontWeight: 700, color: T.accentBright, background: T.onDeep, borderRadius: 999, padding: "15px 34px" }}
        >
          Create your free account
        </a>
        <div style={{ fontSize: 12.5, color: T.onDeepSub, marginTop: 14 }}>
          Works beautifully on your phone — no download needed.
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: `1px solid ${T.line}`, padding: "50px clamp(20px, 5vw, 64px) 40px", background: T.bgSoft }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 40, justifyContent: "space-between" }}>
          <div style={{ maxWidth: 280 }}>
            <div style={{ fontFamily: serif, fontSize: 20, marginBottom: 12 }}>
              Style<Em>Studio</Em>
            </div>
            <p style={{ fontSize: 13.5, color: T.inkFaint, lineHeight: 1.65, margin: 0 }}>
              The fashion app that turns the clothes you own into the wardrobe you've always wanted.
            </p>
          </div>
          {[
            ["Product", ["Features", "How it works", "Lookbook", "Sign in"]],
            ["Company", ["About", "Stories", "Careers", "Press"]],
            ["Support", ["FAQ", "Contact", "Privacy", "Terms"]],
          ].map(([head, links]) => (
            <div key={head}>
              <div style={{ fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", color: T.inkFaint, marginBottom: 14 }}>{head}</div>
              {links.map((l) => (
                <div key={l} style={{ fontSize: 14, color: T.inkDim, padding: "5px 0", cursor: "pointer" }}>{l}</div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ maxWidth: 1200, margin: "36px auto 0", fontSize: 12.5, color: T.inkFaint }}>
          © 2026 StyleStudio. All rights reserved. Made with intention — and a very organized closet.
        </div>
      </footer>
    </div>
  );
}
