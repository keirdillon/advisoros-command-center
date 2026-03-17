"use client";

import { useState } from "react";

/* ══════════════════════════════════════════════════════════════
   ADVISOROS — Project Command Center
   Dieter Rams Design System · Walnut · Cream · Chrome
   Complete build overview, tracking, and visualization
   ══════════════════════════════════════════════════════════════ */

const C = {
  warmWhite:"#FAF8F4", cream:"#F5F0E8", offWhite:"#EDEBE5",
  lightGray:"#D4D0C8", midGray:"#9B9688", warmGray:"#6B665C",
  charcoal:"#3A3832", nearBlack:"#1E1D1A",
  woodLight:"#C49A6C", woodMid:"#A07850", woodDark:"#7A5C3E",
  orange:"#D4663A", green:"#5A7A5C", red:"#C44B3F", chrome:"#B8B4AC",
};
const FD = "var(--font-instrument-serif), Georgia, serif";
const FB = "var(--font-dm-sans), sans-serif";

const caption = (extra: Record<string, unknown>={}) => ({ fontFamily:FB, fontSize:11, fontWeight:400, letterSpacing:3, textTransform:"uppercase" as const, color:C.midGray, ...extra });
const panelBg = { background:C.warmWhite, padding:24 };
const walnutGrad = `linear-gradient(90deg, ${C.woodDark}, ${C.woodMid} 20%, ${C.woodLight} 45%, ${C.woodMid} 70%, ${C.woodDark})`;
const walnutGrainOverlay = `repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(0,0,0,0.04) 4px, rgba(0,0,0,0.04) 5px)`;
const perfBg = { backgroundImage:`radial-gradient(circle, ${C.lightGray} 1px, transparent 1px)`, backgroundSize:"8px 8px" };
const seamGrid = (cols: string) => ({ display:"grid", gridTemplateColumns:cols, gap:1, background:C.lightGray, border:`1px solid ${C.lightGray}`, borderRadius:2, overflow:"hidden" as const });

function StatusItem({ text, color="green" }: { text: string; color?: string }) {
  const c = color==="green"?C.green:color==="orange"?C.orange:C.lightGray;
  const glow = color!=="gray" ? `0 0 4px ${c}55` : "none";
  return (
    <div style={{ display:"flex", alignItems:"center", gap:12, padding:"9px 0", borderBottom:`1px solid ${C.offWhite}` }}>
      <div style={{ width:6, height:6, borderRadius:"50%", background:c, boxShadow:glow, flexShrink:0 }} />
      <span style={{ fontSize:13, color:C.warmGray, lineHeight:1.4 }}>{text}</span>
    </div>
  );
}

function LED({ color="green", pulse=false, size=8 }: { color?: string; pulse?: boolean; size?: number }) {
  const c = color==="green"?C.green:color==="orange"?C.orange:color==="red"?C.red:color==="wood"?C.woodMid:C.lightGray;
  const glow = color!=="gray" ? `0 0 6px ${c}66, 0 0 12px ${c}22` : "none";
  return <div style={{ width:size, height:size, borderRadius:"50%", background:c, flexShrink:0, boxShadow:glow, animation: pulse?"ledPulse 2.5s ease-in-out infinite":"none" }} />;
}

function SH({ num, title, sub }: { num: string; title: string; sub?: string }) {
  return (
    <div style={{ display:"flex", alignItems:"baseline", gap:20, paddingBottom:16, borderBottom:`1px solid ${C.offWhite}`, marginBottom:24 }}>
      <span style={caption()}>{num}</span>
      <div>
        <h2 style={{ fontFamily:FD, fontSize:28, fontWeight:400, color:C.nearBlack, margin:0 }}>{title}</h2>
        {sub && <div style={{ fontSize:12, color:C.midGray, marginTop:4 }}>{sub}</div>}
      </div>
    </div>
  );
}

function WalnutDivider() {
  return (
    <div style={{ height:4, background:walnutGrad, borderRadius:2, margin:"28px 0", position:"relative" }}>
      <div style={{ position:"absolute", inset:0, background:walnutGrainOverlay, borderRadius:2 }} />
    </div>
  );
}

function MetricCard({ label, value, sub, stripColor, accent }: { label: string; value: string; sub: string; stripColor?: string; accent?: string }) {
  return (
    <div style={{ ...panelBg, position:"relative", overflow:"hidden", borderRadius:2 }}>
      <div style={{ position:"absolute", top:0, left:0, width:3, height:"100%", background:stripColor||C.green }} />
      <div style={{ position:"absolute", top:0, right:0, width:"30%", height:"100%", ...perfBg, opacity:0.25, pointerEvents:"none" as const }} />
      <div style={caption({ marginBottom:12 })}>{label}</div>
      <div style={{ fontFamily:FD, fontSize:36, color:accent||C.nearBlack, lineHeight:1, marginBottom:6 }}>{value}</div>
      <div style={{ fontSize:12, color:C.midGray }}>{sub}</div>
    </div>
  );
}

function PBar({ pct, color }: { pct: number; color?: string }) {
  return (
    <div style={{ width:"100%", height:6, background:C.offWhite, borderRadius:3, overflow:"hidden" }}>
      <div style={{ height:"100%", width:`${pct}%`, background:color||C.green, borderRadius:3, transition:"width 0.8s ease" }} />
    </div>
  );
}

function CheckItem({ text, done, onToggle }: { text: string; done: boolean; onToggle: () => void }) {
  return (
    <div onClick={onToggle} style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"10px 0", borderBottom:`1px solid ${C.offWhite}`, cursor:"pointer", transition:"background 0.15s" }}>
      <div style={{ width:20, height:20, borderRadius:3, border:`2px solid ${done?C.green:C.lightGray}`, background:done?C.green:"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1, transition:"all 0.2s" }}>
        {done && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </div>
      <span style={{ fontSize:13, color:done?C.midGray:C.charcoal, lineHeight:1.5, textDecoration:done?"line-through":"none", transition:"all 0.2s" }}>{text}</span>
    </div>
  );
}

// ═══════════════════════════════════════════
// KANBAN BOARD
// ═══════════════════════════════════════════
function KanbanBoard() {
  const [cards, setCards] = useState({
    backlog: [
      { id:"b1", text:"Create 24-question Typeform intake", priority:"high" },
      { id:"b2", text:"Write TOS, Privacy Policy, AUP", priority:"med" },
      { id:"b3", text:"Record Loom demo walkthrough", priority:"med" },
      { id:"b4", text:"Build sales/demo page with sample output", priority:"high" },
      { id:"b5", text:"Set up Sentry error monitoring", priority:"low" },
      { id:"b6", text:"Create Calendly for kickoff calls", priority:"med" },
    ],
    inProgress: [
      { id:"i1", text:"Polish landing page design (match Rams JSX)", priority:"high" },
      { id:"i2", text:"Test full payment flow end-to-end", priority:"high" },
      { id:"i3", text:"Refine AI generation prompts", priority:"high" },
    ],
    done: [
      { id:"d1", text:"Write comprehensive PRD (21 sections)", priority:"high" },
      { id:"d2", text:"Build complete UI (24 routes, 31 files)", priority:"high" },
      { id:"d3", text:"Connect Railway Postgres (15 models)", priority:"high" },
      { id:"d4", text:"Wire magic link auth via Resend", priority:"high" },
      { id:"d5", text:"Integrate Stripe payments", priority:"high" },
      { id:"d6", text:"Build Claude API generation pipeline", priority:"high" },
      { id:"d7", text:"Build Edit with AI chat (real Claude)", priority:"high" },
      { id:"d8", text:"Deploy to Vercel", priority:"high" },
      { id:"d9", text:"Connect custom domain", priority:"med" },
      { id:"d10", text:"Push to GitHub", priority:"med" },
    ],
  });

  const [dragging, setDragging] = useState<{cardId: string; fromCol: string} | null>(null);

  const onDragStart = (cardId: string, fromCol: string) => { setDragging({ cardId, fromCol }); };
  const onDrop = (toCol: string) => {
    if (!dragging) return;
    const { cardId, fromCol } = dragging;
    if (fromCol === toCol) { setDragging(null); return; }
    const card = cards[fromCol as keyof typeof cards].find(c => c.id === cardId);
    if (!card) return;
    setCards(prev => ({
      ...prev,
      [fromCol]: prev[fromCol as keyof typeof prev].filter(c => c.id !== cardId),
      [toCol]: [...prev[toCol as keyof typeof prev], card],
    }));
    setDragging(null);
  };

  const priColor = (p: string) => p==="high"?C.red:p==="med"?C.orange:C.midGray;
  const colConfig = { backlog: { title:"Backlog", color:C.midGray }, inProgress: { title:"In Progress", color:C.orange }, done: { title:"Done", color:C.green } };

  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:1, background:C.lightGray, border:`1px solid ${C.lightGray}`, borderRadius:2, overflow:"hidden" }}>
      {Object.entries(colConfig).map(([key, cfg]) => (
        <div key={key} onDragOver={e=>e.preventDefault()} onDrop={()=>onDrop(key)}
          style={{ background:C.warmWhite, padding:20, minHeight:400 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
            <LED color={key==="done"?"green":key==="inProgress"?"orange":"gray"} />
            <span style={caption({ color:cfg.color })}>{cfg.title}</span>
            <span style={{ fontFamily:FD, fontSize:18, color:C.nearBlack, marginLeft:"auto" }}>{cards[key as keyof typeof cards].length}</span>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {cards[key as keyof typeof cards].map(card => (
              <div key={card.id} draggable onDragStart={()=>onDragStart(card.id, key)}
                style={{ padding:"12px 14px", background:C.cream, borderRadius:3, borderLeft:`3px solid ${priColor(card.priority)}`, cursor:"grab", fontSize:13, color:C.charcoal, lineHeight:1.5, transition:"transform 0.15s, box-shadow 0.15s" }}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform="translateY(-1px)";(e.currentTarget as HTMLElement).style.boxShadow="0 2px 8px rgba(0,0,0,0.08)"}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform="translateY(0)";(e.currentTarget as HTMLElement).style.boxShadow="none"}}>
                {card.text}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════
// TAB: OVERVIEW
// ═══════════════════════════════════════════
function TabOverview() {
  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:1, background:C.lightGray, border:`1px solid ${C.lightGray}`, borderRadius:2, overflow:"hidden", marginBottom:28 }}>
        <MetricCard label="Routes Built" value="24" sub="Public + Portal + Admin + API" stripColor={C.green} />
        <MetricCard label="Build Time" value="~2h" sub="Idea to deployed product" stripColor={C.woodMid} />
        <MetricCard label="Database Models" value="15" sub="11 business + 4 NextAuth" stripColor={C.orange} />
        <MetricCard label="Target MRR" value="$5K" sub="5 clients × $997/month" stripColor={C.green} accent={C.green} />
      </div>

      <SH num="01" title="What AdvisorOS Is" />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:1, background:C.lightGray, border:`1px solid ${C.lightGray}`, borderRadius:2, overflow:"hidden", marginBottom:28 }}>
        <div style={{ ...panelBg, borderLeft:`4px solid ${C.green}` }}>
          <div style={caption({ color:C.green, marginBottom:12 })}>The Product</div>
          <div style={{ fontFamily:FD, fontSize:20, color:C.nearBlack, lineHeight:1.3, marginBottom:10 }}>AI-Powered Brand Agency for Financial Advisors</div>
          <p style={{ fontSize:13, lineHeight:1.7, color:C.warmGray, margin:0 }}>Every independent advisor gets a done-for-you brand and marketing agency. One-time brand foundation, then monthly content packages — all AI-generated, human-reviewed, delivered through a premium portal.</p>
        </div>
        <div style={{ ...panelBg, borderLeft:`4px solid ${C.woodMid}` }}>
          <div style={caption({ color:C.woodMid, marginBottom:12 })}>The Business Model</div>
          <div style={{ fontFamily:FD, fontSize:20, color:C.nearBlack, lineHeight:1.3, marginBottom:10 }}>Foundation Fee + Monthly Retainer</div>
          <p style={{ fontSize:13, lineHeight:1.7, color:C.warmGray, margin:0 }}>~$4,997 one-time brand foundation package. $997/month content retainer. Single tier in Phase One. Target: 5 paying clients to prove output quality before scaling.</p>
        </div>
      </div>

      <SH num="02" title="Build Timeline" sub="March 14, 2026 — One Evening" />
      <div style={{ position:"relative", paddingLeft:32, marginBottom:28 }}>
        <div style={{ position:"absolute", left:11, top:8, bottom:8, width:2, background:`linear-gradient(to bottom, ${C.green}, ${C.woodMid})` }} />
        {[
          { time:"4:00 PM", title:"PRD Session Begins", desc:"40-question interrogation, every screen and flow specified", color:C.green },
          { time:"5:30 PM", title:"Claude Code Initialized", desc:"Project setup, Prisma schema, Tailwind with Rams tokens", color:C.green },
          { time:"5:45 PM", title:"Landing Page Built", desc:"Full sales page with hero, pricing, FAQ — Rams design system", color:C.green },
          { time:"6:00 PM", title:"Portal & Dashboard", desc:"7 advisor screens, admin panel, walnut crown navigation", color:C.green },
          { time:"6:10 PM", title:"Stripe Integrated", desc:"Checkout, subscriptions, webhooks — test mode live", color:C.green },
          { time:"6:20 PM", title:"Brand Playbook + Content Engine", desc:"Full review UI, monthly packages, compliance workflow", color:C.green },
          { time:"6:25 PM", title:"Admin Panel Complete", desc:"Command center, client management, generation controls, prompt editor", color:C.green },
          { time:"6:35 PM", title:"Edit with AI + Metrics", desc:"Slide-out chat with real Claude, admin metrics dashboard", color:C.green },
          { time:"6:45 PM", title:"Database Connected", desc:"Railway Postgres, 15 tables migrated and verified", color:C.green },
          { time:"6:57 PM", title:"Authentication Live", desc:"Magic link emails via Resend, branded Rams templates", color:C.green },
          { time:"7:10 PM", title:"Stripe Payments Live", desc:"Real products created, checkout flow end-to-end", color:C.green },
          { time:"7:22 PM", title:"AI Generation Pipeline", desc:"6-call foundation pipeline, 41,602 chars of brand content generated", color:C.green },
          { time:"7:28 PM", title:"Edit with AI — Real Claude", desc:"4-second revisions, chat sessions stored, version tracking", color:C.green },
          { time:"7:40 PM", title:"GitHub + Vercel Deployed", desc:"214 objects pushed, production build live", color:C.green },
          { time:"8:15 PM", title:"Custom Domain Live", desc:"theadvisoros.com — SSL provisioned, DNS propagated", color:C.woodMid },
        ].map((item, i) => (
          <div key={i} style={{ display:"flex", gap:16, marginBottom:16, position:"relative" }}>
            <div style={{ position:"absolute", left:-25, top:4, width:10, height:10, borderRadius:"50%", background:item.color, boxShadow:`0 0 6px ${item.color}44` }} />
            <div style={{ width:70, flexShrink:0, fontSize:11, fontFamily:"monospace", color:C.midGray, marginTop:2 }}>{item.time}</div>
            <div>
              <div style={{ fontSize:14, fontWeight:500, color:C.nearBlack }}>{item.title}</div>
              <div style={{ fontSize:12, color:C.warmGray, marginTop:2 }}>{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// TAB: ARCHITECTURE
// ═══════════════════════════════════════════
function TabArchitecture() {
  const stack = [
    { layer:"Frontend", items:[
      { name:"Next.js 14", desc:"App Router, React 18, SSR" },
      { name:"Tailwind CSS", desc:"Customized with Rams design tokens" },
      { name:"Framer Motion", desc:"Micro-interactions, transitions" },
    ]},
    { layer:"Backend", items:[
      { name:"Next.js API Routes", desc:"Server-side logic, no separate backend" },
      { name:"Prisma ORM", desc:"Type-safe Postgres queries, migrations" },
      { name:"NextAuth.js", desc:"Magic link auth via Resend" },
    ]},
    { layer:"AI Engine", items:[
      { name:"Claude API", desc:"Anthropic SDK — all content generation" },
      { name:"6-Call Foundation", desc:"Strategy → Messaging → Voice → Visual → Bios → Content" },
      { name:"7-Call Monthly", desc:"Theme → Posts → Blog × 2 → Email → Captions → Graphics" },
    ]},
    { layer:"Infrastructure", items:[
      { name:"Vercel", desc:"Frontend hosting, edge network, auto-deploy" },
      { name:"Railway Postgres", desc:"15 models, cloud database" },
      { name:"Stripe", desc:"Checkout + Subscriptions + Customer Portal" },
    ]},
    { layer:"Services", items:[
      { name:"Resend", desc:"Transactional email (13 templates)" },
      { name:"Cloudinary", desc:"Brand assets, graphics, image transforms" },
      { name:"GitHub", desc:"Version control, CI/CD trigger" },
    ]},
  ];

  const routes = [
    { cat:"Public", items:["/ — Landing page", "/login — Magic link login", "/verify — Email verification", "/welcome — Post-payment onboarding"] },
    { cat:"Advisor Portal", items:["/ dashboard — Home + onboarding stepper", "/brand — Brand Playbook review (7 sections)", "/content — Monthly Package (10 pieces)", "/content/archive — Past Packages", "/input — Monthly Brief (6 questions)", "/settings — Profile, billing, pause/cancel"] },
    { cat:"Admin Panel", items:["/admin — Command Center + needs-attention queue", "/admin/clients — Client list with lifecycle status", "/admin/clients/[id] — 6-tab client detail", "/admin/generate — Generation queue + bulk controls", "/admin/prompts — 13 templates with code editor", "/admin/metrics — Business + product + quality metrics"] },
    { cat:"API", items:["/api/auth/* — NextAuth handlers", "/api/checkout — Stripe Checkout session", "/api/webhooks/stripe — Payment events", "/api/webhooks/typeform — Intake submissions", "/api/generate/foundation — 6-call AI pipeline", "/api/chat/[pieceId] — Edit with AI endpoint", "/api/billing/portal — Stripe Customer Portal"] },
  ];

  return (
    <div>
      <SH num="01" title="Tech Stack" sub="Five layers, zero unnecessary complexity" />
      {stack.map((layer, li) => (
        <div key={li} style={{ marginBottom:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
            <span style={caption({ fontSize:10 })}>LAYER {String(li+1).padStart(2,"0")}</span>
            <span style={{ fontFamily:FD, fontSize:18, color:C.nearBlack }}>{layer.layer}</span>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:`repeat(${layer.items.length},1fr)`, gap:1, background:C.lightGray, border:`1px solid ${C.lightGray}`, borderRadius:2, overflow:"hidden" }}>
            {layer.items.map((item, i) => (
              <div key={i} style={{ ...panelBg, position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:0, right:0, width:"20%", height:"100%", ...perfBg, opacity:0.15, pointerEvents:"none" as const }} />
                <div style={{ fontFamily:"monospace", fontSize:13, fontWeight:500, color:C.nearBlack, marginBottom:6 }}>{item.name}</div>
                <div style={{ fontSize:12, color:C.warmGray, lineHeight:1.5 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <WalnutDivider />

      <SH num="02" title="Route Map" sub="24 routes across 4 categories" />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:1, background:C.lightGray, border:`1px solid ${C.lightGray}`, borderRadius:2, overflow:"hidden" }}>
        {routes.map((cat, ci) => (
          <div key={ci} style={{ ...panelBg }}>
            <div style={caption({ color:ci===0?C.midGray:ci===1?C.green:ci===2?C.orange:C.woodMid, marginBottom:14 })}>{cat.cat}</div>
            {cat.items.map((r, ri) => (
              <div key={ri} style={{ display:"flex", alignItems:"center", gap:10, padding:"7px 0", borderBottom:ri<cat.items.length-1?`1px solid ${C.offWhite}`:"none" }}>
                <div style={{ width:5, height:5, borderRadius:"50%", background:ci===0?C.midGray:ci===1?C.green:ci===2?C.orange:C.woodMid, flexShrink:0 }} />
                <span style={{ fontSize:12, color:C.charcoal, fontFamily:"monospace" }}>{r}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <WalnutDivider />

      <SH num="03" title="Data Flow" sub="How content moves through the system" />
      <div style={{ display:"flex", alignItems:"center", gap:0, flexWrap:"wrap" }}>
        {["Advisor Pays","Intake Form","Kickoff Call","Brand Profile Compiled","Claude Generates (6 calls)","Admin Reviews","Delivered to Portal","Advisor Signs Off","Compliance Cleared","Ready to Post"].map((step, i) => (
          <div key={i} style={{ display:"flex", alignItems:"center" }}>
            <div style={{ padding:"10px 16px", background:i===9?C.nearBlack:i<6?C.warmWhite:C.cream, border:`1px solid ${C.lightGray}`, borderRadius:2, fontSize:11, fontWeight:400, color:i===9?C.warmWhite:C.charcoal, letterSpacing:0.5, whiteSpace:"nowrap" }}>{step}</div>
            {i<9 && <span style={{ padding:"0 6px", color:C.lightGray, fontSize:12 }}>→</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// TAB: PHASES
// ═══════════════════════════════════════════
function TabPhases() {
  const phases = [
    { num:"01", title:"Phase One — MVP", status:"Building", statusColor:"orange", pct:75, target:"5 clients · $5K MRR",
      features:[
        { text:"Typeform intake (24 questions, 5 sections)", done:true },
        { text:"20-min hybrid kickoff call", done:false },
        { text:"AI-generated Brand Playbook (7 sections)", done:true },
        { text:"Premium advisor portal (7 screens)", done:true },
        { text:"Monthly content engine (8 posts, 2 articles, email, 4 graphics, captions)", done:true },
        { text:"Edit with AI — scoped chat for content revision", done:true },
        { text:"Monthly Brief — 5-min advisor input form", done:true },
        { text:"Multiple download formats (PDF, Word, PNG, clipboard, ZIP)", done:true },
        { text:"Compliance workflow with audit trail", done:true },
        { text:"Admin panel with generation controls", done:true },
        { text:"Stripe billing (foundation + monthly retainer)", done:true },
        { text:"Magic link authentication", done:true },
        { text:"13 transactional email templates", done:false },
        { text:"Landing page at theadvisoros.com", done:true },
        { text:"Advisors post content themselves", done:true },
      ]},
    { num:"02", title:"Phase Two — Automation", status:"Planned", statusColor:"gray", pct:0, target:"25+ clients · Automation",
      features:[
        { text:"Auto-publishing to LinkedIn, Instagram, Facebook", done:false },
        { text:"Canva integration (branded templates, API-driven)", done:false },
        { text:"Website module (templated branded site per advisor)", done:false },
        { text:"Second pricing tier", done:false },
        { text:"SEO content generation with keyword targeting", done:false },
        { text:"Email platform integration (Mailchimp, ConvertKit)", done:false },
        { text:"Video and audio scripts activated", done:false },
        { text:"Enhanced portal analytics", done:false },
        { text:"Formal referral program", done:false },
        { text:"Help/FAQ section + AI support chat", done:false },
      ]},
    { num:"03", title:"Phase Three — Agents & Scale", status:"Future", statusColor:"gray", pct:0, target:"100+ clients · Distribution",
      features:[
        { text:"OpenClaw agents running autonomously", done:false },
        { text:"Multi-advisor firm accounts", done:false },
        { text:"Distribution through advisor networks (BD partnerships)", done:false },
        { text:"On-demand collateral engine", done:false },
        { text:"Campaign builder (multi-channel)", done:false },
        { text:"White-label / partner version", done:false },
        { text:"AI-generated strategy recommendations", done:false },
        { text:"Full knowledge base + AI support agent", done:false },
      ]},
  ];

  return (
    <div>
      {phases.map((phase, pi) => (
        <div key={pi}>
          <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:16 }}>
            <span style={caption({ fontSize:10 })}>PHASE {phase.num}</span>
            <span style={{ fontFamily:FD, fontSize:22, color:C.nearBlack }}>{phase.title}</span>
            <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:8 }}>
              <LED color={phase.statusColor} pulse={phase.statusColor==="orange"} />
              <span style={{ fontSize:11, letterSpacing:2, textTransform:"uppercase" as const, color:phase.statusColor==="orange"?C.orange:C.midGray }}>{phase.status}</span>
            </div>
          </div>
          <div style={{ ...panelBg, border:`1px solid ${C.lightGray}`, borderRadius:2, borderLeft:`4px solid ${pi===0?C.green:pi===1?C.woodMid:C.midGray}`, marginBottom:12, position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, right:0, width:"15%", height:"100%", ...perfBg, opacity:0.15, pointerEvents:"none" as const }} />
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
              <span style={{ fontSize:12, color:C.warmGray }}>{phase.target}</span>
              <span style={{ fontFamily:FD, fontSize:24, color:C.nearBlack }}>{phase.pct}%</span>
            </div>
            <PBar pct={phase.pct} color={pi===0?C.green:pi===1?C.woodMid:C.midGray} />
            <div style={{ marginTop:16, columns:2, columnGap:24 }}>
              {phase.features.map((f, fi) => (
                <div key={fi} style={{ display:"flex", alignItems:"flex-start", gap:8, padding:"5px 0", breakInside:"avoid" as const }}>
                  <div style={{ width:14, height:14, borderRadius:2, border:`1.5px solid ${f.done?C.green:C.lightGray}`, background:f.done?C.green:"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>
                    {f.done && <svg width="8" height="8" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <span style={{ fontSize:12, color:f.done?C.midGray:C.charcoal, lineHeight:1.4 }}>{f.text}</span>
                </div>
              ))}
            </div>
          </div>
          {pi < 2 && <WalnutDivider />}
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════
// TAB: KANBAN
// ═══════════════════════════════════════════
function TabKanban() {
  return (
    <div>
      <SH num="01" title="Task Board" sub="Drag cards between columns to track progress" />
      <KanbanBoard />

      <WalnutDivider />

      <SH num="02" title="Priority Legend" />
      <div style={{ display:"flex", gap:24 }}>
        {[{ color:C.red, label:"High Priority" },{ color:C.orange, label:"Medium" },{ color:C.midGray, label:"Low" }].map((p,i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:16, height:4, background:p.color, borderRadius:2 }} />
            <span style={{ fontSize:12, color:C.warmGray }}>{p.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// TAB: CHECKLIST
// ═══════════════════════════════════════════
function TabChecklist() {
  const [checks, setChecks] = useState({
    launch: [
      { text:"Test full payment flow with Stripe test card (4242 4242 4242 4242)", done:false },
      { text:"Verify magic link login sends email and creates session", done:false },
      { text:"Test every portal screen on desktop and mobile", done:false },
      { text:"Create 24-question Typeform intake form", done:false },
      { text:"Connect Typeform webhook to /api/webhooks/typeform", done:false },
      { text:"Set up Calendly for kickoff call scheduling", done:false },
      { text:"Refine AI prompts — run 3+ test generations and improve output", done:false },
      { text:"Switch Stripe to live mode (swap test keys for live keys)", done:false },
      { text:"Update NEXTAUTH_URL to production domain in Vercel", done:false },
      { text:"Draft Terms of Service", done:false },
      { text:"Draft Privacy Policy", done:false },
      { text:"Draft Acceptable Use Policy", done:false },
      { text:"Create admin user account in database", done:false },
    ],
    sales: [
      { text:"Build sales/demo page showing sample Brand Playbook and content", done:false },
      { text:"Record 3-5 minute Loom walkthrough of advisor portal", done:false },
      { text:"Write 3-4 LinkedIn outreach message templates", done:false },
      { text:"Create 2-3 LinkedIn posts demonstrating sample output", done:false },
      { text:"Identify first 20 target prospects (independent RIAs, solo agents)", done:false },
      { text:"Send personal outreach to 5 warm contacts", done:false },
      { text:"Offer founding member incentive for first 5 clients", done:false },
    ],
    polish: [
      { text:"Polish landing page — match Rams JSX aesthetic more closely", done:false },
      { text:"Add images and visual elements to landing page", done:false },
      { text:"Refine all portal screens for design consistency", done:false },
      { text:"Test and fix mobile responsive issues", done:false },
      { text:"Set up Sentry for error monitoring", done:false },
      { text:"Build branded email templates for all 13 notification types", done:false },
      { text:"Test edge cases: expired links, failed payments, empty states", done:false },
      { text:"Set up Cloudinary for brand asset storage", done:false },
    ],
  });

  const toggle = (cat: string, idx: number) => {
    setChecks(prev => ({
      ...prev,
      [cat]: prev[cat as keyof typeof prev].map((c, i) => i === idx ? { ...c, done: !c.done } : c),
    }));
  };

  const countDone = (cat: string) => checks[cat as keyof typeof checks].filter(c => c.done).length;
  const countTotal = (cat: string) => checks[cat as keyof typeof checks].length;

  return (
    <div>
      {[
        { key:"launch", title:"Pre-Launch Essentials", num:"01", color:C.red },
        { key:"sales", title:"Sales & First Clients", num:"02", color:C.woodMid },
        { key:"polish", title:"Polish & Hardening", num:"03", color:C.midGray },
      ].map((section, si) => (
        <div key={si}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
            <SH num={section.num} title={section.title} />
            <span style={{ fontFamily:FD, fontSize:20, color:C.nearBlack }}>{countDone(section.key)}/{countTotal(section.key)}</span>
          </div>
          <PBar pct={(countDone(section.key)/countTotal(section.key))*100} color={section.color} />
          <div style={{ ...panelBg, border:`1px solid ${C.lightGray}`, borderRadius:2, marginTop:12, marginBottom:si<2?12:0 }}>
            {checks[section.key as keyof typeof checks].map((item, i) => (
              <CheckItem key={i} text={item.text} done={item.done} onToggle={() => toggle(section.key, i)} />
            ))}
          </div>
          {si < 2 && <WalnutDivider />}
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════
// TAB: CONNECTIONS
// ═══════════════════════════════════════════
function TabConnections() {
  const connections = [
    { name:"Railway Postgres", status:"live", desc:"15 models, all tables migrated. Cloud database.", url:"railway.app" },
    { name:"Vercel", status:"live", desc:"Auto-deploy on git push. Production environment.", url:"vercel.com" },
    { name:"GitHub", status:"live", desc:"Private repo. 214 objects. All commits pushed.", url:"github.com/keirdillon/advisoros" },
    { name:"Stripe", status:"live", desc:"Test mode. Foundation $4,997 + Monthly $997. Checkout working.", url:"stripe.com" },
    { name:"Resend", status:"live", desc:"Magic link emails. Branded Rams templates.", url:"resend.com" },
    { name:"Claude API", status:"live", desc:"6-call foundation pipeline. 41K chars generated. Edit with AI.", url:"console.anthropic.com" },
    { name:"Custom Domain", status:"live", desc:"theadvisoros.com — DNS propagated, SSL provisioning.", url:"theadvisoros.com" },
    { name:"Typeform", status:"pending", desc:"Webhook endpoint built. Form needs to be created (24 questions).", url:"typeform.com" },
    { name:"Calendly", status:"pending", desc:"For kickoff call scheduling. Not yet set up.", url:"calendly.com" },
    { name:"Cloudinary", status:"pending", desc:"For brand asset storage and image transforms.", url:"cloudinary.com" },
    { name:"Sentry", status:"pending", desc:"Error monitoring. Not yet connected.", url:"sentry.io" },
  ];

  return (
    <div>
      <SH num="01" title="System Connections" sub="All external services and their status" />
      <div style={{ display:"flex", flexDirection:"column", gap:1, background:C.lightGray, border:`1px solid ${C.lightGray}`, borderRadius:2, overflow:"hidden" }}>
        {connections.map((conn, i) => (
          <div key={i} style={{ ...panelBg, display:"flex", alignItems:"center", gap:16, position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, left:0, width:4, height:"100%", background:conn.status==="live"?C.green:C.lightGray }} />
            <LED color={conn.status==="live"?"green":"gray"} pulse={conn.status==="live"} size={10} />
            <div style={{ width:160, flexShrink:0 }}>
              <div style={{ fontSize:14, fontWeight:500, color:C.nearBlack }}>{conn.name}</div>
              <div style={{ fontSize:10, fontFamily:"monospace", color:C.midGray, marginTop:2 }}>{conn.url}</div>
            </div>
            <div style={{ flex:1, fontSize:13, color:C.warmGray, lineHeight:1.5 }}>{conn.desc}</div>
            <span style={{ fontSize:10, letterSpacing:2, textTransform:"uppercase" as const, color:conn.status==="live"?C.green:C.midGray, flexShrink:0 }}>{conn.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// TAB: USER EXPERIENCE JOURNEY
// ═══════════════════════════════════════════
function TabExperience() {
  const [activeStage, setActiveStage] = useState(0);

  const journey = [
    {
      stage:"01", phase:"Discovery", title:"Advisor Finds AdvisorOS", icon:"\u{1F50D}",
      duration:"Day 0", color:C.midGray,
      touchpoints:["LinkedIn post or DM from founder","Referral from another advisor","Direct visit to theadvisoros.com"],
      experience:"The advisor lands on theadvisoros.com. They see a clean, premium landing page that speaks directly to their pain — no time for marketing, inconsistent posting, generic content from DIY tools. The headline hits: 'Your clients deserve a world-class brand. You deserve a marketing team that doesn\u2019t need managing.' Sample output shows real Brand Playbook quality. Pricing is transparent. No 'book a call to learn more' gatekeeping.",
      whatTheySee:"Landing page: hero section with Instrument Serif headline, pain points section (3-4 advisor frustrations), How It Works (3 steps with walnut step numbers), What\u2019s Included (foundation + monthly breakdown), transparent pricing ($4,997 + $997/mo), FAQ (compliance, time, cancellation), and bold Get Started CTA buttons throughout.",
      emotion:"Intrigued. This feels different from other marketing tools. It looks more premium than most advisor websites. The sample output is better than what they currently have. Transparent pricing builds immediate trust.",
      systemAction:"No system action. Static Next.js landing page. Stripe Checkout wired to all CTA buttons. Analytics tracking page views.",
    },
    {
      stage:"02", phase:"Purchase", title:"Advisor Clicks Get Started", icon:"\u{1F4B3}",
      duration:"Day 0", color:C.woodMid,
      touchpoints:["Landing page CTA button","Stripe Checkout page","Welcome page","Welcome email"],
      experience:"They click Get Started. Stripe Checkout opens — clean, familiar, trustworthy. Foundation fee plus monthly retainer displayed clearly. They enter their card. Payment processes instantly. They are redirected to a Welcome page with a green LED 'Payment Confirmed' indicator and a 4-step onboarding timeline with walnut-accented step numbers.",
      whatTheySee:"Stripe Checkout with AdvisorOS branding. Then the Welcome page: Step 1 (Payment — green checkmark), Step 2 (Complete Brand Intake — prominent walnut CTA button linking to Typeform), Step 3 (Book Kickoff Call), Step 4 (Receive Brand Playbook). Plus a link to sign into their new portal.",
      emotion:"Excited and reassured. The payment was smooth. The welcome page immediately shows what happens next with no ambiguity. They feel momentum — something is already in motion.",
      systemAction:"Stripe checkout.session.completed webhook fires \u2192 Advisor record created in Postgres (lifecycle: 'paid') \u2192 Stripe customer ID and subscription ID stored \u2192 Magic link generated \u2192 Welcome email sent via Resend (branded Rams template with walnut accent, AdvisorOS wordmark) \u2192 Typeform intake link included.",
    },
    {
      stage:"03", phase:"Brand Intake", title:"24-Question Creative Consultation", icon:"\u{1F4CB}",
      duration:"Days 1\u20133", color:C.orange,
      touchpoints:["Welcome email with Typeform link","Day 2 reminder if not started","Typeform intake (5 sections, ~20 min)","Completion confirmation email"],
      experience:"The advisor receives a branded email with the intake link. The Typeform is organized into 5 sections that feel like a creative consultation, not a boring form. They describe their ideal client, articulate what makes them different, explain what clients love about them. The final Brand Aesthetic section is the fun part: style sliders (Modern to Classic, Bold to Understated, Luxury to Accessible), uploading 3-5 inspiration images — a Porsche, a Rolex, their favorite hotel lobby, a website they admire — and picking colors they are drawn to.",
      whatTheySee:"Section 1: About You and Your Firm (7 questions). Section 2: Ideal Client and Differentiation (7 questions). Section 3: Brand and Personality (3 questions). Section 4: Goals (3 questions). Section 5: Brand Aesthetic (6 style sliders, image upload for 3-5 inspiration images, color gut check with visual swatches).",
      emotion:"Engaged and self-reflective. Many advisors have never articulated their brand this clearly. The process itself is valuable — they are thinking about their business in ways they have not before.",
      systemAction:"Typeform webhook \u2192 IntakeSubmission created (full JSON payload) \u2192 Inspiration images downloaded from Typeform CDN to Cloudinary \u2192 Claude analyzes each image \u2192 Text descriptions embedded in profile \u2192 Lifecycle status: 'intake_completed' \u2192 Admin notification.",
    },
    {
      stage:"04", phase:"Kickoff Call", title:"20-Minute Strategic Deep Dive", icon:"\u{1F4DE}",
      duration:"Days 3\u20135", color:C.woodMid,
      touchpoints:["Calendly booking link","20-minute call","Post-call confirmation email"],
      experience:"The advisor books a call via Calendly. The founder does not re-ask form questions. Instead they go deeper: 'Tell me what that first conversation with a new client usually looks like.' They listen for natural language, personality cues, excitement, frustration. They end with a specific insight that cements the relationship.",
      whatTheySee:"Calendly booking page, then a Zoom or phone call. This is a purely human touchpoint — no product interface involved.",
      emotion:"Heard, understood, and confident. This is the highest-trust moment in the entire journey.",
      systemAction:"Founder fills structured KickoffNotes template in admin \u2192 'Compile Brand Profile' triggered \u2192 Intake data + call notes assembled into a Claude-ready creative brief \u2192 Brand Profile stored in Postgres (versioned).",
    },
    {
      stage:"05", phase:"AI Generation", title:"Claude Builds the Complete Brand", icon:"\u{1F916}",
      duration:"Days 5\u201312 (advisor waits)", color:C.green,
      touchpoints:["No advisor touchpoint","Founder reviews in admin panel"],
      experience:"The advisor waits. Behind the scenes, Claude runs 6 sequential API calls, each building on the last. The founder reviews every section in the admin panel, rates quality 1-5, and edits anything that is not exceptional.",
      whatTheySee:"If they log into the portal during this phase, they see the onboarding stepper with 'Brand Playbook Delivered' as the next step. The status LED pulses orange — 'Building.'",
      emotion:"Anticipation. The 5-7 day wait is intentional — it signals that real work is being done.",
      systemAction:"Admin triggers generation \u2192 Call 1: Brand Strategy \u2192 Call 2: Messaging \u2192 Call 3: Voice and Tone \u2192 Call 4: Visual Identity \u2192 Call 5: Bio and About Copy \u2192 Call 6: Content Strategy \u2192 Assembly \u2192 Admin reviews, edits, rates \u2192 Pushes to portal.",
    },
    {
      stage:"06", phase:"Brand Reveal", title:"The Wow Moment \u2014 Brand Playbook Delivered", icon:"\u2728",
      duration:"Days 12\u201317", color:C.green,
      touchpoints:["'Your Brand Playbook is ready' email","Portal: Brand Playbook review screen","Edit with AI chat","Request Revision notes","Celebration on full approval"],
      experience:"The advisor gets an email: 'Your Brand Playbook is ready for review.' They log in. The first thing they see is their firm name rendered in a beautiful serif font, on a background of their primary brand color. Then 7 expandable sections, each a piece of their brand.",
      whatTheySee:"Hero section: typographic logo on primary brand color background, tagline, one-liner. Progress bar: 'X of 7 sections signed off'. Seven expandable cards with Sign Off, Request Revision, and Edit with AI buttons.",
      emotion:"This is the moment that justifies the price. If the output is exceptional, the advisor feels like they hired a world-class agency.",
      systemAction:"Each section Sign Off updates BrandProfile status \u2192 Edit with AI: slide-out panel with scoped Claude chat \u2192 All 7 signed off: lifecycle \u2192 'active', monthly retainer billing starts.",
    },
    {
      stage:"07", phase:"First Content", title:"Monthly Package \u2014 Content Engine Ignites", icon:"\u{1F4E6}",
      duration:"Days 25\u201330", color:C.green,
      touchpoints:["Monthly Brief reminder (1st of month)","Monthly Brief form (5 min)","Content delivered notification","Portal: Monthly Package review","Edit with AI on any piece","Compliance workflow","Download and post"],
      experience:"Around the 1st, the advisor gets a Monthly Brief reminder. Six quick questions — under 5 minutes. Around the 10th, the email arrives: 'Your March content package is ready.' They log in to find a grid of content: 8 LinkedIn posts, 2 blog articles, an email draft, 4 branded graphics, bonus captions.",
      whatTheySee:"Strategy Note in a walnut-accented panel at top. Content cards in seam grid with type labels, platform badges, expandable text preview. Three buttons per piece. Compliance badges. Download buttons.",
      emotion:"Relief and delight. Professional, on-brand content is just there — ready to go.",
      systemAction:"1st: Monthly Brief reminder \u2192 5th: Brief due \u2192 6th: Generation triggers (7 Claude calls) \u2192 Admin reviews \u2192 Pushes to portal \u2192 Advisor reviews, signs off, handles compliance \u2192 Downloads and posts.",
    },
    {
      stage:"08", phase:"Ongoing", title:"The Monthly Rhythm \u2014 Retention Engine", icon:"\u{1F504}",
      duration:"Every month, indefinitely", color:C.green,
      touchpoints:["Monthly Brief (5 min)","Content delivery (~10th)","Review and approve","Post to channels","Quarterly satisfaction check"],
      experience:"The advisor settles into a rhythm. Every month: 5 minutes on the Brief, content arrives, review it (80%+ approved first-pass), tweak anything with Edit with AI, handle compliance, download, post. Total monthly time: about 30 minutes.",
      whatTheySee:"The same premium portal each month with fresh content. Past Packages archive growing. Dashboard shows active status with green LED.",
      emotion:"Trust, dependency, and relief. This is the retention engine. The advisor stops thinking about marketing. It just happens.",
      systemAction:"Automated monthly cycle repeats indefinitely. Admin monitors engagement tracking, churn risk flags, quality scores trending.",
    },
  ];

  const active = journey[activeStage];

  return (
    <div>
      <SH num="01" title="Advisor Journey" sub="Click any stage to explore the full experience" />
      <div style={{ display:"flex", gap:0, marginBottom:28, overflowX:"auto", paddingBottom:8 }}>
        {journey.map((step, i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", flexShrink:0 }}>
            <div onClick={() => setActiveStage(i)}
              style={{ padding:"12px 14px", background:i===activeStage?C.nearBlack:i<=5?C.cream:C.warmWhite, border:`1px solid ${i===activeStage?C.nearBlack:C.lightGray}`, borderRadius:3, cursor:"pointer", transition:"all 0.25s ease", minWidth:90, textAlign:"center" }}>
              <div style={{ fontSize:18, marginBottom:4 }}>{step.icon}</div>
              <div style={{ fontSize:9, letterSpacing:1.5, textTransform:"uppercase" as const, color:i===activeStage?C.woodLight:C.midGray, marginBottom:2 }}>{step.phase}</div>
              <div style={{ fontSize:10, color:i===activeStage?C.warmWhite:C.charcoal, fontWeight:i===activeStage?500:400 }}>{step.duration}</div>
            </div>
            {i < journey.length - 1 && (
              <div style={{ width:20, height:2, background:i<activeStage?C.green:C.lightGray, flexShrink:0, transition:"background 0.3s" }} />
            )}
          </div>
        ))}
      </div>

      <div style={{ border:`1px solid ${C.lightGray}`, borderRadius:3, overflow:"hidden", background:C.warmWhite, marginBottom:28 }}>
        <div style={{ padding:"24px 28px", borderBottom:`1px solid ${C.offWhite}`, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:0, left:0, width:5, height:"100%", background:active.color }} />
          <div style={{ position:"absolute", top:0, right:0, width:"25%", height:"100%", ...perfBg, opacity:0.2, pointerEvents:"none" as const }} />
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <span style={{ fontSize:32 }}>{active.icon}</span>
            <div>
              <div style={caption({ color:active.color, marginBottom:4 })}>Stage {active.stage} — {active.phase}</div>
              <div style={{ fontFamily:FD, fontSize:24, color:C.nearBlack }}>{active.title}</div>
            </div>
            <div style={{ marginLeft:"auto", fontSize:12, color:C.midGray }}>{active.duration}</div>
          </div>
        </div>

        <div style={{ padding:"16px 28px", borderBottom:`1px solid ${C.offWhite}`, background:C.cream }}>
          <div style={caption({ marginBottom:10, color:C.woodMid })}>Touchpoints</div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {active.touchpoints.map((tp, i) => (
              <div key={i} style={{ padding:"5px 12px", background:C.warmWhite, border:`1px solid ${C.lightGray}`, borderRadius:20, fontSize:11, color:C.charcoal }}>{tp}</div>
            ))}
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:1, background:C.lightGray }}>
          <div style={{ ...panelBg }}>
            <div style={caption({ color:C.green, marginBottom:10 })}>The Experience</div>
            <p style={{ fontSize:13, lineHeight:1.8, color:C.warmGray, margin:0 }}>{active.experience}</p>
          </div>
          <div style={{ ...panelBg }}>
            <div style={caption({ color:C.woodMid, marginBottom:10 })}>What They See</div>
            <p style={{ fontSize:13, lineHeight:1.8, color:C.warmGray, margin:0 }}>{active.whatTheySee}</p>
          </div>
          <div style={{ ...panelBg }}>
            <div style={caption({ color:C.orange, marginBottom:10 })}>How They Feel</div>
            <p style={{ fontSize:13, lineHeight:1.8, color:C.warmGray, margin:0 }}>{active.emotion}</p>
          </div>
          <div style={{ background:C.offWhite, padding:24 }}>
            <div style={caption({ marginBottom:10 })}>Under the Hood</div>
            <p style={{ fontSize:12, lineHeight:1.8, color:C.warmGray, margin:0, fontFamily:"monospace" }}>{active.systemAction}</p>
          </div>
        </div>
      </div>

      <SH num="02" title="Full Journey Map" sub="Click any stage to jump to details" />
      <div style={{ position:"relative", paddingLeft:36 }}>
        <div style={{ position:"absolute", left:13, top:0, bottom:0, width:2, background:`linear-gradient(to bottom, ${C.midGray}, ${C.woodMid}, ${C.green})` }} />
        {journey.map((step, i) => (
          <div key={i} onClick={() => { setActiveStage(i); window.scrollTo({ top:0, behavior:'smooth' }); }}
            style={{ display:"flex", gap:16, marginBottom:20, cursor:"pointer", position:"relative" }}>
            <div style={{ position:"absolute", left:-27, top:6, width:16, height:16, borderRadius:"50%", background:i===activeStage?C.nearBlack:C.warmWhite, border:`2px solid ${step.color}`, display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s" }}>
              {i===activeStage && <div style={{ width:5, height:5, borderRadius:"50%", background:C.woodLight }} />}
            </div>
            <div style={{ flex:1, padding:"14px 18px", background:i===activeStage?C.cream:C.warmWhite, border:`1px solid ${i===activeStage?C.woodMid:C.offWhite}`, borderRadius:3, transition:"all 0.2s" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
                <span style={{ fontSize:16 }}>{step.icon}</span>
                <span style={caption({ fontSize:9, color:step.color })}>{step.phase} — {step.duration}</span>
              </div>
              <div style={{ fontFamily:FD, fontSize:16, color:C.nearBlack }}>{step.title}</div>
            </div>
          </div>
        ))}
      </div>

      <WalnutDivider />

      <SH num="03" title="Experience KPIs" sub="What success looks like at each stage" />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:1, background:C.lightGray, border:`1px solid ${C.lightGray}`, borderRadius:2, overflow:"hidden" }}>
        <MetricCard label="Intake Completion" value="<20m" sub="24 questions across 5 sections" stripColor={C.orange} />
        <MetricCard label="Foundation Delivery" value="5\u20137d" sub="From kickoff call to playbook" stripColor={C.woodMid} />
        <MetricCard label="First-Pass Approval" value="80%+" sub="Content approved without changes" stripColor={C.green} accent={C.green} />
        <MetricCard label="Monthly Advisor Time" value="~30m" sub="Brief + review + approve + post" stripColor={C.green} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// TAB: EXIT STRATEGY
// ═══════════════════════════════════════════
function TabExit() {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const ExitAccordion = ({ id, title, subtitle, badge, children }: { id: string; title: string; subtitle?: string; badge?: string; children: React.ReactNode }) => {
    const isOpen = openAccordion === id;
    return (
      <div style={{ background:C.warmWhite, border:`1px solid ${isOpen?C.woodLight:C.offWhite}`, borderRadius:2, marginBottom:1, overflow:"hidden", transition:"all 0.3s ease" }}>
        <button onClick={()=>setOpenAccordion(isOpen?null:id)} style={{ width:"100%", display:"flex", alignItems:"center", gap:16, padding:"16px 28px", background:"transparent", border:"none", cursor:"pointer", textAlign:"left" }}>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <span style={{ fontFamily:FD, fontSize:18, color:C.nearBlack }}>{title}</span>
              {badge && <span style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase" as const, padding:"2px 10px", borderRadius:2, background:badge==="MOST LIKELY"?C.green:badge==="LIKELY"?C.woodMid:badge==="STRATEGIC"?C.orange:C.midGray, color:C.warmWhite, fontFamily:FB, fontWeight:500 }}>{badge}</span>}
            </div>
            {subtitle && <div style={{ fontSize:12, color:C.midGray, marginTop:4 }}>{subtitle}</div>}
          </div>
          <svg width="16" height="16" viewBox="0 0 16 16" style={{ transform:isOpen?"rotate(90deg)":"rotate(0deg)", transition:"transform 200ms ease", opacity:0.3, flexShrink:0 }}>
            <path d="M5 2.5l5 5.5-5 5.5" stroke={C.nearBlack} strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
        </button>
        {isOpen && <div style={{ padding:"0 28px 24px" }}>{children}</div>}
      </div>
    );
  };

  const ExitTable = ({ headers, rows, compact }: { headers: string[]; rows: string[][]; compact?: boolean }) => (
    <div style={{ overflowX:"auto", margin:"12px 0", borderRadius:2, border:`1px solid ${C.lightGray}`, overflow:"hidden" }}>
      <table style={{ width:"100%", borderCollapse:"collapse", fontSize:compact?12:13, fontFamily:FB }}>
        <thead>
          <tr>{headers.map((h,i) => (
            <th key={i} style={{ background:C.nearBlack, color:C.warmWhite, padding:compact?"7px 12px":"10px 14px", textAlign:"left", fontWeight:400, fontSize:compact?10:11, letterSpacing:1.5, textTransform:"uppercase" as const, whiteSpace:"nowrap" }}>{h}</th>
          ))}</tr>
        </thead>
        <tbody>{rows.map((row,ri) => (
          <tr key={ri}>
            {row.map((cell,ci) => (
              <td key={ci} style={{ padding:compact?"6px 12px":"9px 14px", color:C.warmGray, borderTop:`1px solid ${C.offWhite}`, lineHeight:1.5, verticalAlign:"top", background:ri%2===0?C.warmWhite:C.cream }}>{cell}</td>
            ))}
          </tr>
        ))}</tbody>
      </table>
    </div>
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:0 }}>

      <div style={{ ...seamGrid("repeat(4,1fr)"), marginBottom:36 }}>
        <MetricCard label="Median ARR Multiple" value="4\u20137\u00D7" sub="Private SaaS (2025\u20132026)" stripColor={C.green} />
        <MetricCard label="Vertical Premium" value="+30%" sub="Financial services vs. horizontal" stripColor={C.woodMid} />
        <MetricCard label="AI-Native Multiple" value="7\u20139\u00D7" sub="Vertical SaaS + embedded AI" stripColor={C.orange} />
        <MetricCard label="Rule of 40 Target" value="40+" sub="Growth % + Profit Margin %" stripColor={C.green} />
      </div>

      <SH num="01" title="Market Landscape" />
      <div style={{ background:C.nearBlack, borderRadius:2, padding:28, marginBottom:16, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:0, right:0, width:"30%", height:"100%", backgroundImage:`radial-gradient(circle, ${C.charcoal} 1px, transparent 1px)`, backgroundSize:"8px 8px", opacity:0.3, pointerEvents:"none" as const }} />
        <div style={caption({ color:C.woodLight, marginBottom:14 })}>THE OPPORTUNITY</div>
        <div style={{ fontSize:15, color:"rgba(255,255,255,0.8)", lineHeight:1.7, fontFamily:FB, maxWidth:800 }}>
          No platform today delivers AI-native brand strategy + visual identity + content engine for financial advisors. The incumbents — Snappy Kraken (~7,000 advisors, $12.6M raised) and FMG Suite (4 acquisitions, thousands of advisors) — are content libraries and campaign automation tools. They help advisors <em>distribute</em> marketing. Advisor OS helps advisors <em>build</em> a differentiated brand from scratch — replacing a $60\u2013120K/year agency engagement with a $17K/year platform.
        </div>
      </div>

      <ExitTable headers={["Platform", "Founded", "Users", "Funding", "Core Model", "Gap"]} rows={[
        ["Snappy Kraken", "2016", "~7,000", "$12.6M", "Marketing automation + campaigns", "No brand strategy"],
        ["FMG Suite", "2011", "Thousands", "Undisclosed", "Content library + websites", "Template-based, no differentiation"],
        ["AdvisorStream", "\u2014", "\u2014", "\u2014", "Content curation", "Aggregated, not custom"],
        ["Advisor OS", "2026", "Pre-launch", "Bootstrapped", "AI brand + visuals + content", "Full-stack agency replacement"],
      ]} compact />

      <div style={{ background:C.cream, border:`1px solid ${C.offWhite}`, borderRadius:2, padding:"16px 24px", marginTop:8 }}>
        <div style={caption({ color:C.woodMid, marginBottom:8 })}>COMPETITIVE POSITIONING</div>
        <div style={{ fontSize:14, color:C.warmGray, lineHeight:1.7 }}>
          Advisor OS competes with <strong style={{color:C.nearBlack}}>$5,000\u2013$10,000/month marketing agencies</strong>, not with Snappy Kraken or FMG Suite. The platform compresses 80% of what an agency delivers into an AI-powered system at 15% of the cost.
        </div>
      </div>

      <WalnutDivider />

      <SH num="02" title="Valuation Framework" />
      <div style={{ ...seamGrid("1fr 1fr"), marginBottom:16 }}>
        <div style={{ ...panelBg, borderLeft:`4px solid ${C.green}` }}>
          <div style={caption({ color:C.green, marginBottom:12 })}>WHAT GETS YOU 3\u00D7 (BASELINE)</div>
          {["$1\u20132M ARR with moderate growth (20\u201330% YoY)","Churn under 5% monthly, NRR around 100%","Strong product but limited distribution proof","Small team, lean operations, approaching profitability","Single-channel distribution (Coastal Wealth only)"].map((t,i) => (
            <StatusItem key={i} text={t} color="green" />
          ))}
        </div>
        <div style={{ ...panelBg, borderLeft:`4px solid ${C.woodMid}` }}>
          <div style={caption({ color:C.woodMid, marginBottom:12 })}>WHAT GETS YOU 5\u20137\u00D7 (PREMIUM)</div>
          {["$5M+ ARR growing 50%+ YoY","NRR above 110%, monthly churn under 3%","Multi-firm distribution (3+ enterprise accounts)","Rule of 40 score above 60","AI-native with demonstrable cost advantage vs. incumbents"].map((t,i) => (
            <StatusItem key={i} text={t} color="orange" />
          ))}
        </div>
      </div>

      <div style={{ ...seamGrid("1fr"), marginBottom:0 }}>
        {[
          { metric:"Net Revenue Retention (NRR)", why:"Companies with NRR above 120% trade at 8\u00D7+ revenue. Below 90% drops to ~1.2\u00D7. Nonlinear.", led:"green" },
          { metric:"Rule of 40", why:"Growth rate + profit margin \u2265 40. Strongest single predictor of valuation.", led:"green" },
          { metric:"AI-Native Architecture", why:"AI-referenced deals comprised 72% of all SaaS transactions in 2025 (12\u00D7 increase since 2018).", led:"orange" },
          { metric:"Vertical Depth & Switching Costs", why:"Vertical SaaS earns its premium through deeper workflow integration, lower churn, and regulatory expertise.", led:"green" },
          { metric:"Capital Efficiency", why:"AI startups reaching $5M ARR in 24 months (vs. 37 months for traditional SaaS). Revenue per employee of $1M+ is the new standard.", led:"orange" },
        ].map((d,i) => (
          <div key={i} style={{ ...panelBg, padding:"14px 28px", display:"flex", alignItems:"flex-start", gap:14 }}>
            <LED color={d.led} size={8} />
            <div>
              <div style={{ fontSize:14, fontWeight:500, color:C.nearBlack, marginBottom:4 }}>{d.metric}</div>
              <div style={{ fontSize:13, color:C.warmGray, lineHeight:1.6 }}>{d.why}</div>
            </div>
          </div>
        ))}
      </div>

      <WalnutDivider />

      <SH num="03" title="18-Month Scenarios" />

      <div style={{ background:C.nearBlack, borderRadius:2, padding:28, marginBottom:24, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, ...perfBg, opacity:0.15, pointerEvents:"none" as const }} />
        <div style={caption({ color:C.woodLight, marginBottom:20 })}>PRICING MODEL</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24, position:"relative" }}>
          {[
            { val:"$5,000", label:"SETUP / ONBOARDING", desc:"Brand strategy questionnaire, visual identity build, positioning & competitive analysis, initial content library" },
            { val:"$1,000", label:"MONTHLY RECURRING", desc:"Monthly content engine (Instagram + LinkedIn scripts), brand refinements, performance insights, platform access" },
            { val:"$17K", label:"YEAR-ONE LTV", desc:"$5K setup + $12K annual recurring. Replaces $60\u2013120K agency spend \u2014 85% cost reduction for the advisor." },
          ].map((p,i) => (
            <div key={i}>
              <div style={{ fontFamily:FD, fontSize:36, color:C.warmWhite, lineHeight:1 }}>{p.val}</div>
              <div style={{ fontSize:10, letterSpacing:2, textTransform:"uppercase" as const, color:C.woodLight, marginTop:8 }}>{p.label}</div>
              <div style={{ fontSize:13, color:"rgba(255,255,255,0.6)", marginTop:10, lineHeight:1.6 }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:1, background:C.lightGray, border:`1px solid ${C.lightGray}`, borderRadius:2, overflow:"hidden", marginBottom:24 }}>
        <div style={{ ...panelBg, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:0, right:0, width:"20%", height:"100%", ...perfBg, opacity:0.15, pointerEvents:"none" as const }} />
          <div style={caption({ marginBottom:12 })}>LOW \u2014 FOUNDATION</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
            {[{l:"Advisors",v:"150"},{l:"MRR",v:"$150K"},{l:"ARR",v:"$1.8M"},{l:"Setup Rev",v:"$750K"}].map((s,i) => (
              <div key={i}><div style={{ fontSize:10, letterSpacing:1, textTransform:"uppercase" as const, color:C.midGray }}>{s.l}</div><div style={{ fontFamily:FD, fontSize:24, color:C.nearBlack }}>{s.v}</div></div>
            ))}
          </div>
          <div style={{ borderTop:`1px solid ${C.offWhite}`, paddingTop:14, marginBottom:12 }}>
            <div style={{ fontSize:10, letterSpacing:1, textTransform:"uppercase" as const, color:C.midGray, marginBottom:4 }}>VALUATION</div>
            <div style={{ fontFamily:FD, fontSize:32, color:C.midGray }}>$3.6\u20135.4M</div>
            <div style={{ fontSize:12, color:C.midGray }}>2\u20133\u00D7 ARR</div>
          </div>
          <div style={{ fontSize:13, color:C.warmGray, lineHeight:1.65 }}>Coastal Wealth network partially penetrated. Concept proven but limited traction beyond initial network.</div>
        </div>

        <div style={{ background:C.warmWhite, padding:28, position:"relative", overflow:"hidden", borderLeft:`4px solid ${C.woodMid}` }}>
          <div style={{ position:"absolute", top:0, right:0, width:"25%", height:"100%", ...perfBg, opacity:0.2, pointerEvents:"none" as const }} />
          <div style={caption({ color:C.woodMid, marginBottom:12 })}>MEDIUM \u2014 TARGET</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
            {[{l:"Advisors",v:"400\u2013500"},{l:"MRR",v:"$400\u2013500K"},{l:"ARR",v:"$4.8\u20136M"},{l:"Setup Rev",v:"$2\u20132.5M"}].map((s,i) => (
              <div key={i}><div style={{ fontSize:10, letterSpacing:1, textTransform:"uppercase" as const, color:C.midGray }}>{s.l}</div><div style={{ fontFamily:FD, fontSize:24, color:C.nearBlack }}>{s.v}</div></div>
            ))}
          </div>
          <div style={{ borderTop:`1px solid ${C.offWhite}`, paddingTop:14, marginBottom:12 }}>
            <div style={{ fontSize:10, letterSpacing:1, textTransform:"uppercase" as const, color:C.midGray, marginBottom:4 }}>VALUATION</div>
            <div style={{ fontFamily:FD, fontSize:32, color:C.woodMid }}>$15\u201330M</div>
            <div style={{ fontSize:12, color:C.woodMid }}>3\u20135\u00D7 ARR (strategic premium)</div>
          </div>
          <div style={{ fontSize:13, color:C.warmGray, lineHeight:1.65 }}>Coastal + 1\u20132 MassMutual firms. Repeatable sales motion. <strong style={{color:C.nearBlack}}>Realistic sweet spot for 18-month exit.</strong></div>
        </div>

        <div style={{ ...panelBg, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:0, right:0, width:"20%", height:"100%", ...perfBg, opacity:0.15, pointerEvents:"none" as const }} />
          <div style={caption({ color:C.green, marginBottom:12 })}>HIGH \u2014 BREAKOUT</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
            {[{l:"Advisors",v:"800\u20131K+"},{l:"MRR",v:"$800K\u20131M"},{l:"ARR",v:"$9.6\u201312M"},{l:"Setup Rev",v:"$4\u20135M"}].map((s,i) => (
              <div key={i}><div style={{ fontSize:10, letterSpacing:1, textTransform:"uppercase" as const, color:C.midGray }}>{s.l}</div><div style={{ fontFamily:FD, fontSize:24, color:C.nearBlack }}>{s.v}</div></div>
            ))}
          </div>
          <div style={{ borderTop:`1px solid ${C.offWhite}`, paddingTop:14, marginBottom:12 }}>
            <div style={{ fontSize:10, letterSpacing:1, textTransform:"uppercase" as const, color:C.midGray, marginBottom:4 }}>VALUATION</div>
            <div style={{ fontFamily:FD, fontSize:32, color:C.green }}>$48\u201384M</div>
            <div style={{ fontSize:12, color:C.green }}>5\u20137\u00D7 ARR (AI-native premium)</div>
          </div>
          <div style={{ fontSize:13, color:C.warmGray, lineHeight:1.65 }}>Multi-BD distribution. MassMutual corporate partnership. 60\u201380 advisors/month. $1M+ revenue per employee.</div>
        </div>
      </div>

      <ExitTable headers={["Month", "Advisors", "MRR", "ARR", "Setup Fees", "Scenario Gate"]} rows={[
        ["3", "30", "$30K", "$360K", "$150K", "All scenarios aligned"],
        ["6", "75\u2013100", "$75\u2013100K", "$900K\u20131.2M", "$375\u2013500K", "Low diverges here"],
        ["9", "120\u2013250", "$120\u2013250K", "$1.4\u20133.0M", "$600K\u20131.25M", "Medium emerging"],
        ["12", "150\u2013500", "$150\u2013500K", "$1.8\u20136.0M", "$750K\u20132.5M", "Scenarios fully diverge"],
        ["15", "150\u2013750", "$150\u2013750K", "$1.8\u20139.0M", "$750K\u20133.75M", "Enterprise deals required for High"],
        ["18", "150\u20131,000+", "$150K\u20131M+", "$1.8\u201312M+", "$750K\u20135M+", "Exit window opens"],
      ]} compact />

      <WalnutDivider />

      <SH num="04" title="Metrics Buyers Scrutinize" />
      <ExitTable headers={["Metric", "Definition", "Premium Target", "Baseline", "Impact"]} rows={[
        ["MRR", "Recurring subscription revenue/month", "$500K+", "$150K+", "Primary valuation input"],
        ["NRR", "Net revenue retention (expansion + churn)", "\u2265110%", "\u2265100%", "NRR >120% \u2192 8\u00D7+ multiples"],
        ["Logo Churn", "% customers lost per month", "<3%", "<5%", "Signals product-market fit"],
        ["CAC Payback", "Months to recoup acquisition cost", "<6 mo", "<12 mo", "Efficient growth = scalability"],
        ["Rule of 40", "Growth % + profit margin", ">60", ">40", "Strongest valuation predictor"],
        ["LTV:CAC", "Lifetime value \u00F7 acquisition cost", ">5:1", ">3:1", "Unit economics health"],
        ["Rev/Employee", "ARR \u00F7 headcount", ">$500K", ">$250K", "AI cos hitting $1M+"],
        ["Gross Margin", "Revenue minus COGS", ">80%", ">70%", "Watch AI inference costs"],
      ]} compact />

      <WalnutDivider />

      <SH num="05" title="Acquirer Landscape" />
      <div style={{ display:"flex", flexDirection:"column", gap:1, background:C.lightGray, border:`1px solid ${C.lightGray}`, borderRadius:2, overflow:"hidden" }}>
        <ExitAccordion id="t1" title="Tier 1 \u2014 Wealthtech Platforms" subtitle="Building end-to-end advisor platforms. Marketing is the gap." badge="MOST LIKELY">
          <ExitTable headers={["Company", "Recent M&A", "Why They'd Buy", "Deal Range"]} rows={[
            ["Orion Advisor Solutions", "Summit Wealth (2025), Redtail (2022), Brinker (2020)", "Missing top-of-funnel marketing/brand piece.", "$15\u201340M"],
            ["Nitrogen (fka Riskalyze)", "Unbundling/rebundling suite", "Has risk + planning + research. Lacks growth/marketing layer.", "$10\u201325M"],
            ["Envestnet", "Prolific acquirer across stack", "Largest ecosystem. Marketing deepens lock-in.", "$20\u201350M"],
          ]} />
        </ExitAccordion>
        <ExitAccordion id="t2" title="Tier 2 \u2014 Marketing Incumbents" subtitle="Snappy Kraken, FMG Suite, and their investors would rather absorb than compete." badge="LIKELY">
          <ExitTable headers={["Company", "Profile", "Why They'd Buy", "Deal Range"]} rows={[
            ["Snappy Kraken", "~7K advisors, $12.6M raised, FINTOP-backed", "Solves what they can\u2019t: differentiated brand strategy at scale.", "$10\u201320M"],
            ["FMG Suite", "4 acquisitions, San Diego HQ", "Template model aging. AI-native leapfrogs roadmap.", "$10\u201320M"],
            ["FINTOP Capital", "PE \u2014 advisor tech consolidation thesis", "Standalone portfolio co or merge into Snappy Kraken.", "$8\u201315M"],
          ]} />
        </ExitAccordion>
        <ExitAccordion id="t3" title="Tier 3 \u2014 Broker-Dealers & Aggregators" subtitle="They don\u2019t want software revenue \u2014 they want advisor retention." badge="STRATEGIC">
          <ExitTable headers={["Company", "Advisors", "Why They'd Buy", "Deal Range"]} rows={[
            ["MassMutual", "~10,000+", "Proven in Coastal \u2192 deploy across network.", "$20\u201350M"],
            ["Osaic", "~10,000+", "Largest independent BD network.", "$15\u201330M"],
            ["LPL Financial", "~23,000+", "Already investing in advisor tech.", "$20\u201340M"],
            ["Cetera", "~12,000+", "Active in AI tools.", "$15\u201330M"],
          ]} />
        </ExitAccordion>
        <ExitAccordion id="t4" title="Tier 4 \u2014 PE Roll-Up Plays" subtitle="Financial buyers building advisor tech portfolios." badge="FINANCIAL">
          <ExitTable headers={["Firm", "Thesis", "How Advisor OS Fits", "Structure"]} rows={[
            ["Vista Equity", "Enterprise software roll-ups", "Bolt-on to advisor tech portfolio co", "60\u201380% cash, 20\u201340% rollover"],
            ["Thoma Bravo", "Software consolidation", "Vertical finserv SaaS matches thesis", "Majority acquisition"],
            ["FINTOP Capital", "Advisor tech consolidation", "Direct thesis match", "Growth equity or full acq"],
            ["Genstar Capital", "Backed Orion", "Tuck-in to Orion platform", "Bolt-on, integrated post-close"],
          ]} />
        </ExitAccordion>
      </div>

      <WalnutDivider />

      <SH num="06" title="The Strategic Pitch" />
      <div style={{ background:C.nearBlack, borderRadius:2, padding:28, marginBottom:16, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:walnutGrainOverlay, opacity:0.3, pointerEvents:"none" as const }} />
        <div style={caption({ color:C.woodLight, marginBottom:14 })}>ONE-LINE PITCH</div>
        <div style={{ fontFamily:FD, fontSize:20, color:C.warmWhite, lineHeight:1.5, fontStyle:"italic", maxWidth:760, position:"relative" }}>
          &ldquo;We&rsquo;ve figured out how to use AI to deliver $60\u2013120K/year of agency services for $17K/year, specifically for financial advisors, with built-in compliance awareness and a distribution channel into 1,000+ advisors through MassMutual-affiliated firms.&rdquo;
        </div>
      </div>

      <div style={seamGrid("1fr 1fr 1fr")}>
        {[
          { label:"VALUE FOR ADVISOR", color:C.green, items:["85% cost reduction vs. agency ($17K vs. $60\u2013120K)","Differentiated brand \u2014 not template content","Always-on content engine","Positioned as serious firm, not hobbyist"] },
          { label:"VALUE FOR PLATFORM / BD", color:C.woodMid, items:["Advisor retention lever \u2014 growth = loyalty","Recruiting differentiator vs. competing BDs","Revenue share / licensing opportunity","Data on what marketing works (strategic asset)"] },
          { label:"VALUE FOR ACQUIRER", color:C.orange, items:["AI tech: 18\u201336 months to replicate","Pre-built MassMutual distribution","Vertical expertise + compliance = moat","80%+ gross margins on SaaS + AI delivery"] },
        ].map((col,i) => (
          <div key={i} style={{ ...panelBg, borderTop:`3px solid ${col.color}` }}>
            <div style={caption({ color:col.color, marginBottom:14 })}>{col.label}</div>
            {col.items.map((t,j) => <StatusItem key={j} text={t} color={i===0?"green":"orange"} />)}
          </div>
        ))}
      </div>

      <WalnutDivider />

      <SH num="07" title="18-Month Priority Stack" />
      <div style={{ ...seamGrid("1fr"), marginBottom:0 }}>
        {[
          { n:"01", t:"Get to $1M ARR as fast as possible", d:"Credibility threshold. Below $1M, buyers see a lifestyle business. Above = revenue multiples. Target: Month 8\u201310.", led:"green" },
          { n:"02", t:"Prove retention \u2014 make churn the #1 metric", d:"Monthly logo churn under 5% is baseline. Under 3% is premium.", led:"green" },
          { n:"03", t:"Document the distribution flywheel", d:"Jeremy\u2019s network \u2192 Coastal \u2192 case studies \u2192 MassMutual expansion \u2192 other BDs.", led:"orange" },
          { n:"04", t:"Land one enterprise deal outside Coastal", d:"The single most important proof point. One BD/RIA with 200+ advisors signing an enterprise agreement.", led:"orange" },
          { n:"05", t:"Keep team at 3\u20135 people", d:"AI-native cos doing $1M+ rev/employee. A 3\u20135 person team at $3M ARR is wildly attractive to acquirers.", led:"green" },
          { n:"06", t:"Build 3 case studies with AUM growth data", d:"Advisors who used Advisor OS and grew their book X% in Y months. Track from Day 1.", led:"gray" },
          { n:"07", t:"Establish compliance workflow early", d:"FINRA/SEC awareness built into platform (not bolted on). Table stakes for enterprise sales.", led:"gray" },
        ].map((item,i) => (
          <div key={i} style={{ ...panelBg, padding:"14px 28px 14px 36px", display:"flex", alignItems:"center", gap:16, position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, left:0, width:4, height:"100%", background:item.led==="green"?C.green:item.led==="orange"?C.orange:C.lightGray }} />
            <LED color={item.led} size={8} />
            <span style={{ fontFamily:FD, fontSize:18, color:C.lightGray, width:24, flexShrink:0 }}>{item.n}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:500, color:C.nearBlack, marginBottom:2 }}>{item.t}</div>
              <div style={{ fontSize:13, color:C.warmGray, lineHeight:1.5 }}>{item.d}</div>
            </div>
          </div>
        ))}
      </div>

      <WalnutDivider />

      <div style={{ background:C.nearBlack, borderRadius:2, padding:32, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:0, right:0, width:"40%", height:"100%", backgroundImage:`radial-gradient(circle, ${C.charcoal} 1px, transparent 1px)`, backgroundSize:"8px 8px", opacity:0.25, pointerEvents:"none" as const }} />
        <div style={caption({ color:C.woodLight, marginBottom:14 })}>BOTTOM LINE</div>
        <div style={{ fontFamily:FD, fontSize:28, color:C.warmWhite, marginBottom:16, lineHeight:1.2 }}>The Realistic Path to a Meaningful Exit</div>
        <div style={{ fontSize:15, color:"rgba(255,255,255,0.75)", lineHeight:1.7, fontFamily:FB, maxWidth:720 }}>
          The sweet spot for an 18-month exit is the <strong style={{ color:C.warmWhite }}>$15\u201330M range</strong> \u2014 the Medium scenario. That requires roughly <strong style={{ color:C.warmWhite }}>$3\u20135M ARR</strong>, sub-5% monthly churn, and a clear distribution story beyond Coastal Wealth.
        </div>
        <div style={{ fontSize:15, color:"rgba(255,255,255,0.75)", lineHeight:1.7, fontFamily:FB, maxWidth:720, marginTop:12 }}>
          Either way, the first six months prove one thing: <strong style={{ color:C.warmWhite }}>advisors who use Advisor OS grow faster than advisors who don&rsquo;t.</strong> That proof point \u2014 documented with real AUM data \u2014 separates a $5M exit from a $50M exit.
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// TAB: DISTRIBUTION & GO-TO-MARKET
// ═══════════════════════════════════════════
function TabDistribution() {
  const [activeChannel, setActiveChannel] = useState(0);
  const [activePath, setActivePath] = useState(2);
  const [activeModel, setActiveModel] = useState(2);

  const channels = [
    { id:"incubate", title:"Incubate at Coastal Wealth", phase:"Phase 1", timeline:"Months 1\u20133", color:C.green, led:"green", pulse:true,
      strategy:"Prove the product works with 5\u201310 hand-picked advisors inside Coastal Wealth. Select advisors who are active on LinkedIn, hungry for growth, and willing to be early adopters. Keir runs every onboarding personally.",
      mechanics:["Hand-pick 5\u201310 advisors across niches","Founding member pricing or first-month free for testimonial commitment","Keir runs all kickoff calls and reviews all AI output","Track posting frequency, LinkedIn impressions, inbound leads, AUM movement","Document before/after: brand quality, content consistency, digital presence","Build 3 case studies with quantifiable results within 90 days"],
      unlocks:"Proven output quality. Real testimonials. Case studies with data.", risk:"Low \u2014 fully within our control." },
    { id:"coastal-expand", title:"Expand Across Coastal Wealth", phase:"Phase 1\u20132", timeline:"Months 3\u20136", color:C.green, led:"green", pulse:false,
      strategy:"Once 5\u201310 advisors are producing results, open AdvisorOS to all 200 Coastal advisors. Jeremy champions it internally. Position as a firm-level benefit.",
      mechanics:["Jeremy presents results at advisor meetings","Co-branded rollout: 'Coastal Wealth x AdvisorOS'","Firm-rate pricing for Coastal advisors ($697/mo vs. $997 retail)","Royalty to Coastal: 10\u201315% of subscription revenue per advisor","Self-serve onboarding flow","Monthly reporting to Jeremy"],
      unlocks:"50\u2013100 advisors. $50K+ MRR. Coastal earning royalty revenue.", risk:"Medium \u2014 depends on Jeremy championing it." },
    { id:"massmutual-firms", title:"MassMutual-Affiliated Firms", phase:"Phase 2", timeline:"Months 6\u201312", color:C.woodMid, led:"orange", pulse:false,
      strategy:"MassMutual has ~50 affiliated firms with 6,500+ advisors total. Use the Coastal case study to pitch firm leadership at sister agencies.",
      mechanics:["Identify top 10 MassMutual firms by advisor count","Jeremy makes warm introductions to firm leaders","Present Coastal results","Per-firm royalty agreement: firm earns 10\u201315%","Each firm gets a dedicated onboarding cohort","Replicate the Coastal playbook"],
      unlocks:"Multi-firm distribution. 200\u2013500 advisors. $150K\u2013400K MRR.", risk:"Medium \u2014 requires strong Coastal results." },
    { id:"massmutual-corporate", title:"MassMutual Corporate Blessing", phase:"Phase 2\u20133", timeline:"Months 9\u201315", color:C.orange, led:"orange", pulse:false,
      strategy:"The ultimate MassMutual unlock: corporate endorses or licenses AdvisorOS for their entire network.",
      mechanics:["Build relationships with MassMutual corporate marketing","Present aggregated data from Coastal + 2\u20133 affiliated firms","Propose corporate royalty","Offer MassMutual co-branding with compliance pre-approval","Build compliance integration","Position as recruiting differentiator"],
      unlocks:"6,500 advisor TAM via one relationship. Corporate-level revenue.", risk:"High \u2014 corporate cycles are 6\u201312 months." },
    { id:"major-networks", title:"Expand to Major Networks", phase:"Phase 3", timeline:"Months 12\u201318", color:C.orange, led:"gray", pulse:false,
      strategy:"Once MassMutual is proven, pitch other major networks. TAM expands from 6,500 to 50,000+ advisors.",
      mechanics:["Northwestern Mutual (~6,000 advisors)","New York Life (~12,000 advisors)","Guardian Life (~3,000 advisors)","Pacific Life, Equitable, Ameritas","Same royalty model per network","Each network proves the model works industry-wide"],
      unlocks:"50,000+ advisor TAM. Industry-standard platform.", risk:"Medium \u2014 requires MassMutual success story." },
    { id:"direct-advisor", title:"Direct to Independent Advisors", phase:"Phase 2\u20133", timeline:"Months 6\u201318", color:C.midGray, led:"gray", pulse:false,
      strategy:"Parallel direct channel for independent RIAs and solo agents. Full retail pricing, no revenue share \u2014 highest margin channel.",
      mechanics:["LinkedIn content: Keir posts about AI + marketing for advisors","Targeted outreach to independent RIAs","Partnerships with advisor communities: XYPN, NAPFA","Referral program: existing advisors earn a month free per referral","Webinar series","SEO play (Phase 2)"],
      unlocks:"Diversified revenue. Highest margins. Brand awareness.", risk:"Low \u2014 standard SaaS go-to-market." },
  ];

  const paths = [
    { id:"a", title:"Path A \u2014 Advisor First", subtitle:"Bottom-Up Organic", color:C.green, recommended:false,
      desc:"Start with individual advisors at Coastal. Prove results through word of mouth. Let adoption pull you into the firm.",
      pros:["Lowest risk \u2014 one advisor at a time","Organic proof that is undeniable","No executive buy-in needed to start","Each advisor is a walking case study"],
      cons:["Slowest path to scale","Revenue stays small for 6+ months","Dependent on advisor word-of-mouth","Jeremy may not engage deeply without firm-level upside"],
      timeline:"5 advisors \u2192 20 \u2192 50 \u2192 firm adoption (12\u201318 months to 100+)", jeremy:"Passive \u2014 provides access, observes results" },
    { id:"b", title:"Path B \u2014 Corporate First", subtitle:"Top-Down Enterprise", color:C.orange, recommended:false,
      desc:"Go directly to Jeremy for a firm-level deal. Coastal buys AdvisorOS for all 200 advisors as a firm benefit.",
      pros:["Fastest revenue acceleration","Jeremy financially incentivized via royalty","Firm-level deal creates instant case study","Positions for MassMutual corporate faster"],
      cons:["Higher risk \u2014 one 'no' from Jeremy slows everything","Requires Jeremy to commit budget","Firm-level deals have longer decision cycles","If Coastal says no, back to Path A"],
      timeline:"Firm deal Month 2 \u2192 100 advisors Month 4 \u2192 MassMutual pitch Month 6", jeremy:"Active \u2014 executive sponsor, earns royalty" },
    { id:"c", title:"Path C \u2014 Hybrid", subtitle:"Bottom-Up Proof, Top-Down Scale", color:C.woodMid, recommended:true,
      desc:"Start bottom-up with 5 advisors (Path A) while getting Jeremy\u2019s blessing to position as a firm initiative once results prove out. Best of both.",
      pros:["Organic proof removes Jeremy\u2019s risk","Royalty incentivizes Jeremy from the start","Case studies from both advisor AND firm level","Fastest credible path to MassMutual expansion","Jeremy chooses his level of involvement"],
      cons:["Slightly slower than pure Path B in months 1\u20133","Requires managing two motions simultaneously"],
      timeline:"5 advisors Month 1 \u2192 results Month 3 \u2192 firm rollout Month 4 \u2192 100+ Month 6 \u2192 MassMutual pitch Month 8", jeremy:"Progressive \u2014 starts as access provider, becomes champion, earns royalty throughout" },
  ];

  const revenueModels = [
    { title:"Model 1: Revenue Share", subtitle:"Simplest \u2014 firm earns % of every subscription", color:C.green,
      split:"Firm gets 10\u201315% of monthly subscription", example:"At $997/mo, firm earns $100\u2013150/advisor/month",
      at100:"$10\u201315K/month passive revenue (100 advisors)", at500:"$50\u201375K/month passive revenue (500 across network)",
      firmCost:"Zero. Firm invests nothing. Pure upside.", bestFor:"Jeremy conversation. Zero risk for Coastal. Easy yes." },
    { title:"Model 2: Firm-Subsidized", subtitle:"Firm buys in bulk \u2014 recruiting differentiator", color:C.woodMid,
      split:"Firm pays flat $30\u201350K/month for up to 200 advisors ($150\u2013250/advisor)", example:"Firm absorbs cost or passes through. Advisors get 'free' agency.",
      at100:"$30\u201350K/month guaranteed (regardless of adoption)", at500:"$150\u2013250K/month across multiple firm deals",
      firmCost:"$30\u201350K/month. Firm treats as recruiting budget.", bestFor:"Firms with recruiting budgets." },
    { title:"Model 3: Hybrid Royalty", subtitle:"Recommended \u2014 bounty + royalty, zero firm cost", color:C.woodMid,
      split:"Advisors pay own subscription ($997 retail or $697 firm rate). Firm gets $500 bounty per signup + 10% ongoing royalty ($70\u2013100/mo).", example:"Firm earns $500 upfront + $70\u2013100/month per advisor.",
      at100:"$50K bounties + $7\u201310K/month ongoing (100 advisors)", at500:"$250K bounties + $35\u201350K/month ongoing (500 across network)",
      firmCost:"Zero. Firm invests nothing. Earns from day one.", bestFor:"Default for Jeremy. Zero risk, immediate revenue, perfect alignment." },
  ];

  const active = channels[activeChannel];
  const activePth = paths[activePath];
  const activeMdl = revenueModels[activeModel];

  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:1, background:C.lightGray, border:`1px solid ${C.lightGray}`, borderRadius:2, overflow:"hidden", marginBottom:28 }}>
        <MetricCard label="Coastal Wealth" value="200" sub="Advisors \u2014 our proving ground" stripColor={C.green} />
        <MetricCard label="MassMutual Network" value="6,500" sub="Across ~50 affiliated firms" stripColor={C.woodMid} />
        <MetricCard label="Major Networks TAM" value="50K+" sub="NWM, NYL, Guardian, Pacific, Equitable" stripColor={C.orange} />
        <MetricCard label="Agency Replacement" value="85%" sub="Cost savings ($17K vs $120K)" stripColor={C.green} />
      </div>

      <SH num="01" title="Distribution Thesis" />
      <div style={{ background:C.nearBlack, borderRadius:2, padding:28, marginBottom:16, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, ...perfBg, opacity:0.12, pointerEvents:"none" as const }} />
        <div style={caption({ color:C.woodLight, marginBottom:14 })}>THE UNFAIR ADVANTAGE</div>
        <div style={{ fontSize:15, color:"rgba(255,255,255,0.85)", lineHeight:1.8, fontFamily:FB, maxWidth:820 }}>Most SaaS companies spend 18 months searching for distribution. We already have it. Coastal Wealth (200 advisors) is our proving ground. MassMutual gives us 6,500. Beyond that: Northwestern Mutual (6,000+), New York Life (12,000+), Guardian (3,000+), and others represent 50,000+ advisors with the same problem. The playbook: prove at Coastal, expand through MassMutual, replicate across every major network.</div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:1, background:C.lightGray, border:`1px solid ${C.lightGray}`, borderRadius:2, overflow:"hidden", marginBottom:28 }}>
        {[{name:"MassMutual",advisors:"~6,500",firms:"~50 affiliated firms",status:"Beachhead network",color:C.green,led:"green"},{name:"Northwestern Mutual",advisors:"~6,000",firms:"District offices nationwide",status:"Target \u2014 Year 1\u20132",color:C.woodMid,led:"orange"},{name:"New York Life",advisors:"~12,000",firms:"General offices nationwide",status:"Target \u2014 Year 1\u20132",color:C.woodMid,led:"orange"},{name:"Guardian Life",advisors:"~3,000",firms:"Agency network",status:"Target \u2014 Year 2",color:C.midGray,led:"gray"},{name:"Pacific / Equitable",advisors:"~3,000",firms:"BD and advisor networks",status:"Target \u2014 Year 2",color:C.midGray,led:"gray"},{name:"Independent RIAs",advisors:"~40,000+",firms:"Solo and small firms",status:"Direct \u2014 ongoing",color:C.midGray,led:"gray"}].map((n,i) => (
          <div key={i} style={{ ...panelBg, padding:"14px 18px", position:"relative" }}>
            <div style={{ position:"absolute", top:0, left:0, width:4, height:"100%", background:n.color }} />
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}><LED color={n.led} size={7} /><span style={{ fontFamily:FD, fontSize:15, color:C.nearBlack }}>{n.name}</span></div>
            <div style={{ fontFamily:FD, fontSize:22, color:n.color }}>{n.advisors}</div>
            <div style={{ fontSize:11, color:C.midGray }}>{n.firms}</div>
            <div style={{ fontSize:9, letterSpacing:1.5, textTransform:"uppercase" as const, color:n.color, marginTop:4 }}>{n.status}</div>
          </div>))}
      </div>

      <WalnutDivider />

      <SH num="02" title="Go-to-Market Paths" sub="Three strategic options \u2014 Path C recommended" />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:1, background:C.lightGray, border:`1px solid ${C.lightGray}`, borderRadius:2, overflow:"hidden", marginBottom:24 }}>
        {paths.map((p,i) => (
          <div key={i} onClick={()=>setActivePath(i)} style={{ ...panelBg, padding:20, cursor:"pointer", borderTop:i===activePath?`4px solid ${p.color}`:`4px solid transparent`, background:i===activePath?C.cream:C.warmWhite, transition:"all 0.2s", position:"relative" }}>
            {p.recommended && <div style={{ position:"absolute", top:8, right:12, fontSize:9, letterSpacing:1.5, textTransform:"uppercase" as const, padding:"2px 8px", borderRadius:2, background:C.woodMid, color:C.warmWhite }}>Recommended</div>}
            <div style={{ fontFamily:FD, fontSize:18, color:C.nearBlack, marginBottom:4 }}>{p.title}</div>
            <div style={{ fontSize:12, color:C.midGray, marginBottom:8 }}>{p.subtitle}</div>
            <div style={{ fontSize:12, color:C.warmGray, lineHeight:1.6 }}>{p.desc.substring(0,120)}...</div>
          </div>))}
      </div>
      <div style={{ border:`1px solid ${C.lightGray}`, borderRadius:3, overflow:"hidden", marginBottom:28 }}>
        <div style={{ padding:"20px 28px", background:C.warmWhite, borderBottom:`1px solid ${C.offWhite}`, borderLeft:`5px solid ${activePth.color}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}><div style={{ fontFamily:FD, fontSize:22, color:C.nearBlack }}>{activePth.title}</div>{activePth.recommended && <span style={{ fontSize:9, letterSpacing:1.5, textTransform:"uppercase" as const, padding:"2px 10px", borderRadius:2, background:C.woodMid, color:C.warmWhite }}>Recommended</span>}</div>
          <div style={{ fontSize:13, color:C.warmGray, marginTop:6, lineHeight:1.7 }}>{activePth.desc}</div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:1, background:C.lightGray }}>
          <div style={{ ...panelBg }}><div style={caption({ color:C.green, marginBottom:10 })}>Advantages</div>{activePth.pros.map((p,i) => <StatusItem key={i} text={p} color="green" />)}</div>
          <div style={{ ...panelBg }}><div style={caption({ color:C.orange, marginBottom:10 })}>Considerations</div>{activePth.cons.map((c,i) => <StatusItem key={i} text={c} color="orange" />)}</div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:1, background:C.lightGray }}>
          <div style={{ background:C.cream, padding:20 }}><div style={caption({ marginBottom:8 })}>Timeline</div><div style={{ fontSize:13, color:C.charcoal, lineHeight:1.6, fontFamily:"monospace" }}>{activePth.timeline}</div></div>
          <div style={{ background:C.cream, padding:20 }}><div style={caption({ color:C.woodMid, marginBottom:8 })}>Jeremy&rsquo;s Role</div><div style={{ fontSize:13, color:C.charcoal, lineHeight:1.6 }}>{activePth.jeremy}</div></div>
        </div>
      </div>

      <WalnutDivider />

      <SH num="03" title="Revenue Share Models" sub="How the firm earns from advisor adoption" />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:1, background:C.lightGray, border:`1px solid ${C.lightGray}`, borderRadius:2, overflow:"hidden", marginBottom:24 }}>
        {revenueModels.map((m,i) => (
          <div key={i} onClick={()=>setActiveModel(i)} style={{ ...panelBg, padding:20, cursor:"pointer", borderTop:i===activeModel?`4px solid ${m.color}`:`4px solid transparent`, background:i===activeModel?C.cream:C.warmWhite, transition:"all 0.2s", position:"relative" }}>
            {i===2 && <div style={{ position:"absolute", top:8, right:12, fontSize:9, letterSpacing:1.5, textTransform:"uppercase" as const, padding:"2px 8px", borderRadius:2, background:C.woodMid, color:C.warmWhite }}>Recommended</div>}
            <div style={{ fontFamily:FD, fontSize:16, color:C.nearBlack, marginBottom:4 }}>{m.title}</div>
            <div style={{ fontSize:11, color:C.midGray }}>{m.subtitle}</div>
          </div>))}
      </div>
      <div style={{ border:`1px solid ${C.lightGray}`, borderRadius:3, overflow:"hidden", marginBottom:28 }}>
        <div style={{ padding:"20px 28px", background:C.warmWhite, borderBottom:`1px solid ${C.offWhite}`, borderLeft:`5px solid ${activeMdl.color}` }}>
          <div style={{ fontFamily:FD, fontSize:20, color:C.nearBlack, marginBottom:4 }}>{activeMdl.title}</div>
          <div style={{ fontSize:13, color:C.warmGray }}>{activeMdl.subtitle}</div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:1, background:C.lightGray }}>
          <div style={{ ...panelBg }}><div style={caption({ color:C.green, marginBottom:8 })}>Split Structure</div><div style={{ fontSize:13, color:C.charcoal, lineHeight:1.7 }}>{activeMdl.split}</div></div>
          <div style={{ ...panelBg }}><div style={caption({ marginBottom:8 })}>Example</div><div style={{ fontSize:13, color:C.charcoal, lineHeight:1.7 }}>{activeMdl.example}</div></div>
          <div style={{ ...panelBg }}><div style={caption({ color:C.woodMid, marginBottom:8 })}>Firm Cost</div><div style={{ fontSize:13, color:C.charcoal, lineHeight:1.7 }}>{activeMdl.firmCost}</div></div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:1, background:C.lightGray }}>
          <div style={{ background:C.cream, padding:20 }}><div style={caption({ marginBottom:6 })}>At 100 Advisors</div><div style={{ fontFamily:FD, fontSize:18, color:C.green }}>{activeMdl.at100}</div></div>
          <div style={{ background:C.cream, padding:20 }}><div style={caption({ marginBottom:6 })}>At 500 Advisors</div><div style={{ fontFamily:FD, fontSize:18, color:C.woodMid }}>{activeMdl.at500}</div></div>
          <div style={{ background:C.cream, padding:20 }}><div style={caption({ marginBottom:6 })}>Best For</div><div style={{ fontSize:13, color:C.charcoal, lineHeight:1.6 }}>{activeMdl.bestFor}</div></div>
        </div>
      </div>

      <WalnutDivider />

      <SH num="05" title="Channel Playbook" sub="Click any channel to explore the full strategy" />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:1, background:C.lightGray, border:`1px solid ${C.lightGray}`, borderRadius:2, overflow:"hidden", marginBottom:24 }}>
        {channels.map((ch,i) => (
          <div key={i} onClick={()=>setActiveChannel(i)} style={{ ...panelBg, padding:"14px 18px", cursor:"pointer", borderLeft:i===activeChannel?`4px solid ${ch.color}`:`4px solid transparent`, background:i===activeChannel?C.cream:C.warmWhite, transition:"all 0.2s" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}><LED color={ch.led} pulse={ch.pulse} size={7} /><span style={{ fontSize:9, letterSpacing:1.5, textTransform:"uppercase" as const, color:ch.color }}>{ch.phase}</span></div>
            <div style={{ fontFamily:FD, fontSize:14, color:C.nearBlack, marginBottom:2 }}>{ch.title}</div>
            <div style={{ fontSize:10, color:C.midGray }}>{ch.timeline}</div>
          </div>))}
      </div>
      <div style={{ border:`1px solid ${C.lightGray}`, borderRadius:3, overflow:"hidden", marginBottom:28 }}>
        <div style={{ padding:"20px 28px", background:C.warmWhite, borderBottom:`1px solid ${C.offWhite}`, borderLeft:`5px solid ${active.color}` }}>
          <div style={caption({ color:active.color, marginBottom:4 })}>{active.phase} \u2014 {active.timeline}</div>
          <div style={{ fontFamily:FD, fontSize:22, color:C.nearBlack }}>{active.title}</div>
        </div>
        <div style={{ padding:"16px 28px", background:C.cream, borderBottom:`1px solid ${C.offWhite}` }}><p style={{ fontSize:13, lineHeight:1.8, color:C.warmGray, margin:0 }}>{active.strategy}</p></div>
        <div style={{ padding:"16px 28px", background:C.warmWhite, borderBottom:`1px solid ${C.offWhite}` }}>
          <div style={caption({ color:C.green, marginBottom:10 })}>Mechanics</div>
          {active.mechanics.map((m,i) => (<div key={i} style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"5px 0" }}><div style={{ width:5, height:5, borderRadius:"50%", background:active.color, flexShrink:0, marginTop:6 }} /><span style={{ fontSize:12, color:C.charcoal, lineHeight:1.6 }}>{m}</span></div>))}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:1, background:C.lightGray }}>
          <div style={{ ...panelBg, padding:20 }}><div style={caption({ color:C.green, marginBottom:6 })}>Unlocks</div><div style={{ fontSize:12, color:C.warmGray, lineHeight:1.6 }}>{active.unlocks}</div></div>
          <div style={{ ...panelBg, padding:20 }}><div style={caption({ color:C.orange, marginBottom:6 })}>Risk</div><div style={{ fontSize:12, color:C.warmGray, lineHeight:1.6 }}>{active.risk}</div></div>
        </div>
      </div>

      <WalnutDivider />

      <SH num="06" title="Stickiness and Moat" sub="Why advisors cannot leave once embedded" />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:1, background:C.lightGray, border:`1px solid ${C.lightGray}`, borderRadius:2, overflow:"hidden", marginBottom:24 }}>
        <div style={{ ...panelBg, borderLeft:`4px solid ${C.green}` }}>
          <div style={caption({ color:C.green, marginBottom:12 })}>PRODUCT STICKINESS</div>
          {["Brand Profile: 24-question intake + kickoff creates deeply personalized identity","Content archive grows monthly \u2014 6+ months of history and compliance records","Edit with AI learns preferences \u2014 revision patterns create invisible personalization","Compliance audit trail \u2014 exportable records that compliance officers depend on","Team familiarity \u2014 assistants, compliance, partners all learn the portal"].map((t,i) => <StatusItem key={i} text={t} color="green" />)}
        </div>
        <div style={{ ...panelBg, borderLeft:`4px solid ${C.woodMid}` }}>
          <div style={caption({ color:C.woodMid, marginBottom:12 })}>SWITCHING COST BY MONTH</div>
          {["Month 1: Low \u2014 just started, easy to walk away","Month 3: Medium \u2014 posted content, building recognition","Month 6: High \u2014 identity established, compliance accumulated","Month 12: Very high \u2014 full year of archive, brand equity","Month 18+: Embedded \u2014 like ripping out FMG"].map((t,i) => <StatusItem key={i} text={t} color="orange" />)}
        </div>
      </div>

      <WalnutDivider />

      <SH num="07" title="Scaling Timeline" sub="5 advisors to 1,000+ in 18 months" />
      <div style={{ ...seamGrid("1fr"), marginBottom:0 }}>
        {[{month:"Months 1\u20133",advisors:"5\u201310",channel:"Coastal Wealth (hand-picked)",milestone:"Prove quality. 3 case studies.",color:C.green,led:"green"},{month:"Months 3\u20136",advisors:"30\u201375",channel:"Coastal firm-wide + royalty active",milestone:"Jeremy champions. Self-serve onboarding.",color:C.green,led:"green"},{month:"Months 6\u20139",advisors:"75\u2013200",channel:"Coastal + 1\u20132 MassMutual sister firms",milestone:"First non-Coastal firm.",color:C.woodMid,led:"orange"},{month:"Months 9\u201312",advisors:"200\u2013500",channel:"3\u20135 MassMutual firms + direct",milestone:"MassMutual corporate conversations.",color:C.woodMid,led:"orange"},{month:"Months 12\u201315",advisors:"500\u2013750",channel:"MassMutual + NWM/NYL pitches begin",milestone:"Corporate blessing. Major network pitches.",color:C.orange,led:"gray"},{month:"Months 15\u201318",advisors:"750\u20131,000+",channel:"Multi-network + corporate agreements",milestone:"Strategic acquirers engaged. Exit window.",color:C.orange,led:"gray"}].map((row,i) => (
          <div key={i} style={{ ...panelBg, padding:"14px 28px 14px 36px", display:"flex", alignItems:"center", gap:20, position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, left:0, width:4, height:"100%", background:row.color }} />
            <LED color={row.led} size={8} />
            <div style={{ width:100, flexShrink:0 }}><div style={{ fontSize:11, fontWeight:500, color:C.nearBlack }}>{row.month}</div><div style={{ fontFamily:FD, fontSize:22, color:row.color }}>{row.advisors}</div></div>
            <div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:500, color:C.nearBlack, marginBottom:2 }}>{row.channel}</div><div style={{ fontSize:12, color:C.warmGray, lineHeight:1.5 }}>{row.milestone}</div></div>
          </div>))}
      </div>

      <WalnutDivider />

      <div style={{ background:C.nearBlack, borderRadius:2, padding:32, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:0, right:0, width:"40%", height:"100%", backgroundImage:`radial-gradient(circle, ${C.charcoal} 1px, transparent 1px)`, backgroundSize:"8px 8px", opacity:0.25, pointerEvents:"none" as const }} />
        <div style={caption({ color:C.woodLight, marginBottom:14 })}>THE DISTRIBUTION ADVANTAGE</div>
        <div style={{ fontFamily:FD, fontSize:24, color:C.warmWhite, marginBottom:16, lineHeight:1.3 }}>We don&rsquo;t need to find advisors. We need to activate the channels that already have them.</div>
        <div style={{ fontSize:15, color:"rgba(255,255,255,0.75)", lineHeight:1.8, fontFamily:FB, maxWidth:760 }}>200 advisors at Coastal. 6,500 across MassMutual. 50,000+ across Northwestern, New York Life, Guardian, and others. The royalty model means every firm leader becomes a distribution partner. The compliance moat means every advisor past 6 months is nearly impossible to churn. By month 12, switching off AdvisorOS should feel like turning off the electricity.</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// TAB: COMPETITIVE ANALYSIS — HEARSAY
// ═══════════════════════════════════════════
function TabCompetitor() {
  const [swotActive, setSwotActive] = useState(0);

  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:1, background:C.lightGray, border:`1px solid ${C.lightGray}`, borderRadius:2, overflow:"hidden", marginBottom:28 }}>
        <MetricCard label="Hearsay Advisors" value="260K+" sub="BlackRock, Schwab, NYL, etc." stripColor={C.midGray} />
        <MetricCard label="Yext Acquisition" value="$125M" sub="+ $95M earnout (mid-2024)" stripColor={C.midGray} />
        <MetricCard label="RepVue PMF Score" value="3.3/5" sub="31% of reps hitting quota" stripColor={C.orange} />
        <MetricCard label="AdvisorOS Edge" value="AI-Native" sub="Created, not curated" stripColor={C.green} />
      </div>

      <SH num="01" title="Know the Enemy" sub="What Hearsay actually is \u2014 and is not" />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:1, background:C.lightGray, border:`1px solid ${C.lightGray}`, borderRadius:2, overflow:"hidden", marginBottom:24 }}>
        <div style={{ ...panelBg, borderLeft:`4px solid ${C.midGray}` }}>
          <div style={caption({ marginBottom:12 })}>What Hearsay Does</div>
          {["Compliance monitoring across social, text, voice, websites","Pre-approval workflows with real-time alerts","Supervision dashboards for firm compliance officers","Content library curated from third-party sources","Social scheduling and publishing","Archival and audit trails for FINRA, SEC, IIROC, FCA","Serves 260,000+ advisors at BlackRock, Schwab, New York Life"].map((t,i) => <StatusItem key={i} text={t} color="gray" />)}
        </div>
        <div style={{ ...panelBg, borderLeft:`4px solid ${C.red}` }}>
          <div style={caption({ color:C.red, marginBottom:12 })}>What Hearsay Does NOT Do</div>
          {["Does not create original content \u2014 curates third-party articles","Does not build unique brand identities for advisors","Does not generate personalized voice or messaging","Does not differentiate one advisor from another","Does not use LLMs for content generation","Does not provide brand strategy or visual identity","Does not replace a marketing agency"].map((t,i) => <StatusItem key={i} text={t} color="orange" />)}
        </div>
      </div>

      <div style={{ background:C.nearBlack, borderRadius:2, padding:28, marginBottom:24, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, ...perfBg, opacity:0.12, pointerEvents:"none" as const }} />
        <div style={caption({ color:C.woodLight, marginBottom:14 })}>THE FUNDAMENTAL DIFFERENCE</div>
        <div style={{ fontSize:15, color:"rgba(255,255,255,0.85)", lineHeight:1.8, fontFamily:FB, maxWidth:820 }}>
          Hearsay is a <strong style={{ color:C.warmWhite }}>distribution and supervision platform</strong>. Advisors get a library of pre-made content from Forbes, The Economist, and firm marketing \u2014 then Hearsay routes it through compliance and publishes it. The content is generic. <strong style={{ color:C.warmWhite }}>AdvisorOS is a brand creation and content generation platform.</strong> Every piece of content is original, written in the advisor&rsquo;s unique voice, built on their specific positioning.
        </div>
      </div>

      <WalnutDivider />

      <SH num="02" title="SWOT Analysis" sub="Hearsay\u2019s position after the Yext acquisition" />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:1, background:C.lightGray, border:`1px solid ${C.lightGray}`, borderRadius:2, overflow:"hidden", marginBottom:24 }}>
        {[
          { title:"Strengths", color:C.green, items:["260K+ advisor installed base","15+ years of enterprise compliance trust","FINRA/SEC/FCA regulatory credibility","Deep integrations with major broker-dealers","Proven supervision and archival workflows"] },
          { title:"Weaknesses", color:C.red, items:["Content is borrowed, not created","No brand differentiation between advisors","Legacy architecture \u2014 2018-era NLP","Yext acquisition adding integration complexity","3.3/5 PMF score, only 31% quota attainment","Users report lack of customization"] },
          { title:"Opportunities", color:C.woodMid, items:["Could add AI content generation","Could acquire a brand-building tool","Yext\u2019s digital presence platform synergies","Expansion into international markets"] },
          { title:"Threats", color:C.orange, items:["AI-native competitors (AdvisorOS)","Advisors demanding differentiated content","Social platforms favoring original over shared content","LinkedIn algorithm penalizing third-party scheduling","Yext integration distracting from core product"] },
        ].map((quad, i) => (
          <div key={i} onClick={() => setSwotActive(i)} style={{ ...panelBg, padding:16, borderTop:`4px solid ${quad.color}`, cursor:"pointer", background:i===swotActive?C.cream:C.warmWhite, transition:"all 0.2s" }}>
            <div style={caption({ color:quad.color, marginBottom:10, fontSize:10 })}>{quad.title}</div>
            {quad.items.map((item, j) => (
              <div key={j} style={{ display:"flex", alignItems:"flex-start", gap:8, padding:"4px 0" }}>
                <div style={{ width:4, height:4, borderRadius:"50%", background:quad.color, flexShrink:0, marginTop:6 }} />
                <span style={{ fontSize:11, color:C.charcoal, lineHeight:1.5 }}>{item}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <WalnutDivider />

      <SH num="03" title="Feature Comparison" sub="Head-to-head: what each platform delivers" />
      <div style={{ overflowX:"auto", borderRadius:2, border:`1px solid ${C.lightGray}`, overflow:"hidden", marginBottom:24 }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13, fontFamily:FB }}>
          <thead>
            <tr>
              <th style={{ background:C.nearBlack, color:C.warmWhite, padding:"12px 16px", textAlign:"left", fontWeight:400, fontSize:11, letterSpacing:1.5, textTransform:"uppercase" as const, width:"30%" }}>Capability</th>
              <th style={{ background:C.nearBlack, color:C.warmWhite, padding:"12px 16px", textAlign:"center", fontWeight:400, fontSize:11, letterSpacing:1.5, textTransform:"uppercase" as const, width:"20%" }}>Hearsay</th>
              <th style={{ background:C.nearBlack, color:C.warmWhite, padding:"12px 16px", textAlign:"center", fontWeight:400, fontSize:11, letterSpacing:1.5, textTransform:"uppercase" as const, width:"20%" }}>AdvisorOS</th>
              <th style={{ background:C.nearBlack, color:C.warmWhite, padding:"12px 16px", textAlign:"left", fontWeight:400, fontSize:11, letterSpacing:1.5, textTransform:"uppercase" as const, width:"30%" }}>Edge</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Brand Strategy & Positioning", "\u274C", "\u2705", "AdvisorOS builds unique brand identity from 150+ data points"],
              ["Original Content Creation", "\u274C", "\u2705", "AI generates 40K+ chars of original content per advisor"],
              ["Personalized Voice & Messaging", "\u274C", "\u2705", "Every piece sounds like the advisor, not a template"],
              ["Visual Identity (Colors, Fonts, Logo)", "\u274C", "\u2705", "Custom palette derived from inspiration imagery"],
              ["Content Library (Third-Party)", "\u2705", "\u274C", "Hearsay curates Forbes/Economist \u2014 but it\u2019s generic"],
              ["Compliance Pre-Screening", "\u2705 Keyword", "\u2705 AI-Native", "AdvisorOS understands context, not just keywords"],
              ["Pre-Approval Workflows", "\u2705", "\u2705", "Both handle review cycles"],
              ["Social Publishing", "\u2705", "\u{1F51C} Phase 2", "Hearsay leads here today"],
              ["Archival & Audit Trail", "\u2705", "\u2705", "Both provide regulatory-grade records"],
              ["Supervision Dashboard", "\u2705", "\u2705", "Admin panel with client oversight"],
              ["Voice/Text Monitoring", "\u2705", "\u274C", "Different product scope"],
              ["Edit with AI (Real-Time Revisions)", "\u274C", "\u2705", "4-second Claude-powered content editing"],
              ["Monthly Content Engine", "\u274C", "\u2705", "8 posts, 2 articles, email, graphics"],
              ["Advisor Brand Differentiation", "\u274C", "\u2705", "No two advisors get the same brand or content"],
            ].map((row, i) => (
              <tr key={i}>
                <td style={{ padding:"10px 16px", color:C.charcoal, borderTop:`1px solid ${C.offWhite}`, fontWeight:500, background:i%2===0?C.warmWhite:C.cream }}>{row[0]}</td>
                <td style={{ padding:"10px 16px", textAlign:"center", borderTop:`1px solid ${C.offWhite}`, fontSize:16, background:i%2===0?C.warmWhite:C.cream }}>{row[1]}</td>
                <td style={{ padding:"10px 16px", textAlign:"center", borderTop:`1px solid ${C.offWhite}`, fontSize:16, background:i%2===0?C.warmWhite:C.cream }}>{row[2]}</td>
                <td style={{ padding:"10px 16px", color:C.warmGray, borderTop:`1px solid ${C.offWhite}`, fontSize:12, lineHeight:1.5, background:i%2===0?C.warmWhite:C.cream }}>{row[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <WalnutDivider />

      <SH num="04" title="How We Take Them Down" sub="The strategic playbook against Hearsay" />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:1, background:C.lightGray, border:`1px solid ${C.lightGray}`, borderRadius:2, overflow:"hidden", marginBottom:24 }}>
        {[
          { num:"01", title:"Win on Content Quality", color:C.green,
            desc:"Hearsay gives every advisor the same Forbes article. We give every advisor original content in their unique voice.",
            action:"Produce case studies showing AdvisorOS content vs. Hearsay content." },
          { num:"02", title:"Win on AI-Native Compliance", color:C.woodMid,
            desc:"Hearsay uses keyword-based lexicon scanning. Our AI compliance pre-screen understands context. This cuts false positives by 70%+.",
            action:"Build the compliance pre-screen layer. Demo it against Hearsay\u2019s keyword approach." },
          { num:"03", title:"Win on Total Cost", color:C.orange,
            desc:"The advisor is paying Hearsay plus an agency or freelancer. AdvisorOS replaces both for $997/month.",
            action:"Frame the pitch as: 'You\u2019re paying $X for Hearsay + $Y for content creation. We replace both for $997/month.'" },
        ].map((s, i) => (
          <div key={i} style={{ ...panelBg, borderTop:`4px solid ${s.color}`, position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, right:0, width:"15%", height:"100%", ...perfBg, opacity:0.15, pointerEvents:"none" as const }} />
            <div style={caption({ color:s.color, marginBottom:6 })}>{s.num}</div>
            <div style={{ fontFamily:FD, fontSize:18, color:C.nearBlack, marginBottom:10, lineHeight:1.3 }}>{s.title}</div>
            <div style={{ fontSize:13, color:C.warmGray, lineHeight:1.7, marginBottom:14 }}>{s.desc}</div>
            <div style={{ padding:"10px 14px", background:C.cream, borderRadius:2, borderLeft:`3px solid ${s.color}` }}>
              <div style={{ fontSize:11, fontWeight:500, color:C.nearBlack }}>{s.action}</div>
            </div>
          </div>
        ))}
      </div>

      <WalnutDivider />

      <SH num="05" title="Their Rebuild Problem" sub="Why Hearsay can\u2019t easily replicate AdvisorOS" />
      <div style={{ ...seamGrid("1fr"), marginBottom:24 }}>
        {[
          { challenge:"AI-Native Content Generation", time:"12\u201318 months", why:"Hearsay\u2019s entire architecture is built around distributing existing content, not creating it.", led:"green" },
          { challenge:"Brand Strategy Engine", time:"18\u201324 months", why:"The 24-question intake, inspiration image analysis, and 6-call AI pipeline does not exist in Hearsay\u2019s product DNA.", led:"green" },
          { challenge:"Personalized Voice Model", time:"12\u201318 months", why:"Building a per-advisor voice engine requires a fundamentally different content architecture.", led:"green" },
          { challenge:"Yext Integration Burden", time:"Ongoing", why:"Engineering team focused on integrating into Yext\u2019s platform. Innovation deprioritized. This is our window.", led:"orange" },
          { challenge:"Cultural Shift", time:"2\u20133 years", why:"Hearsay\u2019s DNA is compliance and supervision. Companies rarely make this kind of pivot successfully \u2014 especially post-acquisition.", led:"orange" },
        ].map((item, i) => (
          <div key={i} style={{ ...panelBg, padding:"16px 28px 16px 36px", display:"flex", alignItems:"flex-start", gap:16, position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, left:0, width:4, height:"100%", background:item.led==="green"?C.green:C.orange }} />
            <LED color={item.led} size={8} />
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:4 }}>
                <span style={{ fontSize:14, fontWeight:500, color:C.nearBlack }}>{item.challenge}</span>
                <span style={{ fontSize:10, letterSpacing:1.5, textTransform:"uppercase" as const, padding:"2px 8px", borderRadius:2, background:C.cream, color:C.warmGray }}>{item.time}</span>
              </div>
              <div style={{ fontSize:13, color:C.warmGray, lineHeight:1.7 }}>{item.why}</div>
            </div>
          </div>
        ))}
      </div>

      <WalnutDivider />

      <div style={{ background:C.nearBlack, borderRadius:2, padding:32, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:0, right:0, width:"40%", height:"100%", backgroundImage:`radial-gradient(circle, ${C.charcoal} 1px, transparent 1px)`, backgroundSize:"8px 8px", opacity:0.25, pointerEvents:"none" as const }} />
        <div style={caption({ color:C.woodLight, marginBottom:14 })}>THE KILL SHOT</div>
        <div style={{ fontFamily:FD, fontSize:24, color:C.warmWhite, marginBottom:16, lineHeight:1.3 }}>
          Hearsay helps advisors distribute someone else&rsquo;s content through compliance. AdvisorOS helps advisors build a differentiated brand and create original content that actually sounds like them.
        </div>
        <div style={{ fontSize:15, color:"rgba(255,255,255,0.75)", lineHeight:1.8, fontFamily:FB, maxWidth:760 }}>
          260,000 advisors use Hearsay \u2014 and every single one of them still has the same problem: their content looks like everyone else&rsquo;s. AdvisorOS gives them what Hearsay never will: <strong style={{ color:C.warmWhite }}>a brand that&rsquo;s actually theirs.</strong>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// MAIN CHASSIS
// ═══════════════════════════════════════════
const TABS = ["Overview", "Architecture", "Phases", "Experience", "Distribution", "Competitor", "Board", "Checklist", "Connections", "Exit"];

export default function AdvisorOSCommandCenter() {
  const [tab, setTab] = useState(0);

  return (
    <>
      <style>{`
        @keyframes ledPulse { 0%,100%{opacity:.55} 50%{opacity:1} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing:border-box; margin:0; padding:0; }
        .aos-tab { position:relative; cursor:pointer; transition: color 0.25s ease; }
        .aos-tab::after { content:''; position:absolute; bottom:-1px; left:24px; right:24px; height:2px; background:${C.woodMid}; transform:scaleX(0); transform-origin:left; transition: transform 0.3s cubic-bezier(0.16,1,0.3,1); }
        .aos-tab:hover:not(.aos-tab-active) { color:${C.charcoal} !important; }
        .aos-tab:hover:not(.aos-tab-active)::after { transform:scaleX(1); }
        .aos-tab-active::after { display:none; }
      `}</style>

      <div style={{ minHeight:"100vh", background:"#E8E4DC", fontFamily:FB, fontWeight:300, display:"flex", justifyContent:"center", padding:"40px 24px", WebkitFontSmoothing:"antialiased" }}>
        <div style={{ width:"100%", maxWidth:1280, background:C.cream, borderRadius:4, overflow:"hidden", boxShadow:"0 1px 0 rgba(255,255,255,0.5), 0 4px 12px rgba(0,0,0,0.06), 0 20px 60px rgba(0,0,0,0.1)", border:`1px solid ${C.lightGray}` }}>

          {/* Walnut Crown */}
          <div style={{ height:14, background:walnutGrad, position:"relative" }}>
            <div style={{ position:"absolute", inset:0, background:walnutGrainOverlay }} />
            <div style={{ position:"absolute", bottom:0, left:0, right:0, height:1, background:"rgba(0,0,0,0.1)" }} />
          </div>

          {/* Topbar */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"20px 40px", background:C.warmWhite, borderBottom:`1px solid ${C.offWhite}` }}>
            <div style={{ display:"flex", alignItems:"center", gap:16 }}>
              <div style={{ width:40, height:40, borderRadius:"50%", background:`linear-gradient(145deg,${C.woodLight},${C.woodDark})`, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)" }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:C.warmWhite, opacity:0.85 }} />
              </div>
              <div>
                <div style={{ fontFamily:FD, fontSize:24, color:C.nearBlack }}>AdvisorOS</div>
                <div style={{ fontSize:12, color:C.midGray, marginTop:1 }}>Project Command Center \u2014 March 2026</div>
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:20 }}>
              <div style={{ display:"flex", alignItems:"center", gap:7 }}><LED color="green" pulse size={8} /><span style={{ fontSize:10, letterSpacing:2, textTransform:"uppercase" as const, color:C.midGray }}>Live</span></div>
              <div style={{ display:"flex", alignItems:"center", gap:7 }}><LED color="orange" size={8} /><span style={{ fontSize:10, letterSpacing:2, textTransform:"uppercase" as const, color:C.midGray }}>Building</span></div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display:"flex", padding:"0 40px", background:C.warmWhite, borderBottom:`1px solid ${C.offWhite}`, overflowX:"auto" }}>
            {TABS.map((t, i) => (
              <button key={i} onClick={() => setTab(i)}
                className={`aos-tab ${tab===i?"aos-tab-active":""}`}
                style={{ padding:"14px 20px", fontFamily:FB, fontSize:11, fontWeight:400, letterSpacing:0.5, border:"none", cursor:"pointer", background:"transparent", color:tab===i?C.nearBlack:C.midGray, borderBottom:tab===i?`2px solid ${C.nearBlack}`:"2px solid transparent", transition:"all 0.25s ease", whiteSpace:"nowrap" }}>
                {t}
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{ padding:"32px 40px 40px", animation:"fadeIn 0.4s ease" }} key={tab}>
            {tab===0 && <TabOverview />}
            {tab===1 && <TabArchitecture />}
            {tab===2 && <TabPhases />}
            {tab===3 && <TabExperience />}
            {tab===4 && <TabDistribution />}
            {tab===5 && <TabCompetitor />}
            {tab===6 && <TabKanban />}
            {tab===7 && <TabChecklist />}
            {tab===8 && <TabConnections />}
            {tab===9 && <TabExit />}
          </div>

          {/* Footer */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"20px 40px", background:C.offWhite, borderTop:`1px solid ${C.lightGray}` }}>
            <div style={{ fontFamily:FD, fontSize:14, fontStyle:"italic", color:C.midGray }}>Weniger, aber besser.</div>
            <div style={{ fontSize:10, letterSpacing:2, textTransform:"uppercase" as const, color:C.lightGray }}>AdvisorOS Command Center v1.0</div>
          </div>

          {/* Walnut Foot */}
          <div style={{ height:8, background:walnutGrad, position:"relative" }}>
            <div style={{ position:"absolute", inset:0, background:walnutGrainOverlay }} />
          </div>
        </div>
      </div>
    </>
  );
}
