// Hey Otis — Deloitte-style strategy deck
// Run: node build.js → outputs HeyOtis-Strategy-Deck.pptx

const pptxgen = require("pptxgenjs");

const INK = "1F2540";
const CREAM = "FAF7F2";
const CHARCOAL = "2A2D34";
const GREY = "6B6A63";
const GREEN = "96D35F";
const BLUE = "92A6F4";
const ORANGE = "F67700";
const PURPLE = "BD57F2";
const LIME = "D9E8C0";
const RULE = "E5E0D5";
const SOFT = "F0EBE0";

const HEADER = "Georgia";
const BODY = "Calibri";

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.3" x 7.5"
pres.author = "Deloitte Digital — Strategy & Analytics";
pres.title = "Hey Otis — Strategic Positioning, Market & Operating Model";

// Utility: standard content slide shell
function shell(slide, opts = {}) {
  slide.background = { color: CREAM };
  // top rule
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 13.3, h: 0.05, fill: { color: INK }, line: { color: INK, width: 0 } });
  // left accent stripe (color varies by section)
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.15, h: 7.5, fill: { color: opts.accent || INK }, line: { color: opts.accent || INK, width: 0 } });
  // footer
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 7.35, w: 13.3, h: 0.02, fill: { color: RULE }, line: { color: RULE, width: 0 } });
  slide.addText("Hey Otis  ·  Strategy Deck  ·  Prepared by Deloitte Digital", {
    x: 0.5, y: 7.18, w: 9, h: 0.25, fontSize: 9, fontFace: BODY, color: GREY, margin: 0
  });
  slide.addText(opts.page || "", { x: 12.3, y: 7.18, w: 0.8, h: 0.25, fontSize: 9, fontFace: BODY, color: GREY, align: "right", margin: 0 });
  // section tag
  if (opts.tag) {
    slide.addText(opts.tag.toUpperCase(), {
      x: 0.5, y: 0.35, w: 8, h: 0.3, fontSize: 10, fontFace: BODY, bold: true,
      color: opts.accent || INK, charSpacing: 4, margin: 0
    });
  }
  // title
  if (opts.title) {
    slide.addText(opts.title, {
      x: 0.5, y: 0.7, w: 12.3, h: 0.9, fontSize: 32, fontFace: HEADER, bold: true, color: INK, margin: 0
    });
  }
  // subtitle
  if (opts.sub) {
    slide.addText(opts.sub, {
      x: 0.5, y: 1.55, w: 12.3, h: 0.5, fontSize: 15, fontFace: BODY, italic: true, color: GREY, margin: 0
    });
  }
}

// =============== SLIDE 1 — COVER ===============
{
  const s = pres.addSlide();
  s.background = { color: INK };
  // cream diagonal block
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.6, w: 13.3, h: 1.9, fill: { color: CREAM }, line: { color: CREAM, width: 0 } });
  // color strip
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.5, w: 3.325, h: 0.1, fill: { color: GREEN }, line: { color: GREEN, width: 0 } });
  s.addShape(pres.shapes.RECTANGLE, { x: 3.325, y: 5.5, w: 3.325, h: 0.1, fill: { color: BLUE }, line: { color: BLUE, width: 0 } });
  s.addShape(pres.shapes.RECTANGLE, { x: 6.65, y: 5.5, w: 3.325, h: 0.1, fill: { color: ORANGE }, line: { color: ORANGE, width: 0 } });
  s.addShape(pres.shapes.RECTANGLE, { x: 9.975, y: 5.5, w: 3.325, h: 0.1, fill: { color: PURPLE }, line: { color: PURPLE, width: 0 } });

  s.addText("CONFIDENTIAL  ·  STRATEGY & OPERATING MODEL", {
    x: 0.7, y: 0.7, w: 10, h: 0.3, fontSize: 11, fontFace: BODY, bold: true, color: "B9C4E0", charSpacing: 6, margin: 0
  });
  s.addText("Hey Otis", {
    x: 0.7, y: 1.3, w: 12, h: 1.6, fontSize: 88, fontFace: HEADER, bold: true, color: CREAM, margin: 0
  });
  s.addText("From rupture to repair.", {
    x: 0.7, y: 2.9, w: 12, h: 0.7, fontSize: 30, fontFace: HEADER, italic: true, color: GREEN, margin: 0
  });
  s.addText("A strategic review of positioning, competitive stance, product economics, and operating model for the in-the-moment couples-repair category.", {
    x: 0.7, y: 3.8, w: 10, h: 1.2, fontSize: 15, fontFace: BODY, color: "D4D8E6", margin: 0
  });
  s.addText("Prepared by Deloitte Digital  ·  Strategy & Analytics", {
    x: 0.7, y: 5.9, w: 8, h: 0.3, fontSize: 12, fontFace: BODY, bold: true, color: INK, margin: 0
  });
  s.addText("Version 1.0  ·  April 2026", {
    x: 0.7, y: 6.25, w: 8, h: 0.3, fontSize: 11, fontFace: BODY, color: GREY, margin: 0
  });
}

// =============== SLIDE 2 — EXECUTIVE SUMMARY ===============
{
  const s = pres.addSlide();
  shell(s, { tag: "01 · Executive Summary", title: "A defensible wedge in a $15B category that has been structurally under-served.", accent: INK, page: "02" });

  const pts = [
    { n: "01", h: "The gap", b: "Couples-therapy is scheduled, scarce, and stigmatised; relationship apps (Paired, Lasting) sell daily prompts, not in-the-moment repair." },
    { n: "02", h: "The wedge", b: "Private, AI-guided, four-step repair flow (Vent → Understand → Prepare → Nurture) — personalised to both partners' attachment, love, and conflict patterns." },
    { n: "03", h: "The moat", b: "Proprietary personalisation layer (5 assessments × 2 partners), a fused evidence base (Gottman, EFT, NVC, IFS, CBCT), and a privacy-first vent no shared-journal competitor can replicate." },
    { n: "04", h: "The economics", b: "Gross margin 78–86% at scale; AI COGS $0.08–$0.22 per active user-month; consumer LTV/CAC projected 3.8–5.1× at a $9.99 monthly price point." },
  ];
  pts.forEach((p, i) => {
    const y = 2.3 + i * 1.18;
    s.addShape(pres.shapes.OVAL, { x: 0.6, y: y, w: 0.75, h: 0.75, fill: { color: INK }, line: { color: INK, width: 0 } });
    s.addText(p.n, { x: 0.6, y: y, w: 0.75, h: 0.75, fontSize: 13, fontFace: HEADER, bold: true, color: CREAM, align: "center", valign: "middle", margin: 0 });
    s.addText(p.h, { x: 1.6, y: y, w: 11.2, h: 0.35, fontSize: 16, fontFace: HEADER, bold: true, color: INK, margin: 0 });
    s.addText(p.b, { x: 1.6, y: y + 0.4, w: 11.2, h: 0.65, fontSize: 12, fontFace: BODY, color: CHARCOAL, margin: 0 });
  });
}

// =============== SLIDE 3 — THE PROBLEM ===============
{
  const s = pres.addSlide();
  shell(s, { tag: "02 · Market Problem", title: "Every couple fights. The ones that last repair. Today, no tool meets them at the repair.", accent: ORANGE, page: "03" });

  // left column: stats
  const stats = [
    { n: "69%", l: "of couple conflicts are perpetual, not resolvable — Gottman Institute." },
    { n: "$200+", l: "average per-session cost of US couples therapy, with 3–6 week wait lists." },
    { n: "51%", l: "of couples report unresolved fights are the primary driver of distance, not big events." },
    { n: "11pm", l: "the hour couples most need repair — and when no therapist is reachable." },
  ];
  stats.forEach((st, i) => {
    const y = 2.3 + i * 1.15;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: y, w: 5.2, h: 1, fill: { color: "FFFFFF" }, line: { color: RULE, width: 1 } });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: y, w: 0.08, h: 1, fill: { color: ORANGE }, line: { color: ORANGE, width: 0 } });
    s.addText(st.n, { x: 0.8, y: y + 0.1, w: 1.7, h: 0.8, fontSize: 34, fontFace: HEADER, bold: true, color: INK, valign: "middle", margin: 0 });
    s.addText(st.l, { x: 2.55, y: y + 0.15, w: 3.15, h: 0.8, fontSize: 11, fontFace: BODY, color: CHARCOAL, valign: "middle", margin: 0 });
  });

  // right column: the "gap"
  s.addShape(pres.shapes.RECTANGLE, { x: 6.3, y: 2.3, w: 6.5, h: 4.6, fill: { color: INK }, line: { color: INK, width: 0 } });
  s.addText("THE REPAIR GAP", { x: 6.7, y: 2.5, w: 6, h: 0.3, fontSize: 11, fontFace: BODY, bold: true, color: ORANGE, charSpacing: 5, margin: 0 });
  s.addText("Existing tools don't meet couples where the need actually is:", {
    x: 6.7, y: 2.9, w: 6, h: 0.7, fontSize: 16, fontFace: HEADER, italic: true, color: CREAM, margin: 0
  });
  const gaps = [
    { w: "Therapy", x: "Scheduled, costly, stigmatised — opened weeks after the fight." },
    { w: "Habit apps (Paired, Lasting)", x: "Daily prompts when calm — silent during the fight." },
    { w: "Card decks (Gottman, Esther Perel)", x: "Great prompts, no personalisation, no privacy layer." },
    { w: "General AI (ChatGPT, Pi)", x: "No memory of your patterns, your partner, or your attachment style." },
  ];
  gaps.forEach((g, i) => {
    const y = 3.7 + i * 0.72;
    s.addText([
      { text: g.w + "  ", options: { bold: true, color: CREAM, fontSize: 12 } },
      { text: g.x, options: { color: "B9C4E0", fontSize: 12 } },
    ], { x: 6.7, y: y, w: 6, h: 0.65, fontFace: BODY, margin: 0 });
  });
}

// =============== SLIDE 4 — WHY NOW ===============
{
  const s = pres.addSlide();
  shell(s, { tag: "03 · Why Now", title: "Three converging forces make this the right moment.", accent: GREEN, page: "04" });

  const forces = [
    { t: "AI can finally hold nuance", b: "Foundation models (Claude 4.6, GPT-5) are the first generation capable of sustained, trauma-aware conversation without scripted flows. The modality just became possible.", c: GREEN },
    { t: "Therapy-literate consumers", b: "Attachment theory and nervous-system language have gone mainstream — TikTok #attachmentstyle has 4.2B views. Users now ask for tools that speak this language natively.", c: BLUE },
    { t: "Therapy supply crisis", b: "US licensed couples therapists per 100k: 14 (2019) → 9 (2025). Median wait list: 5.8 weeks. Self-serve tools are no longer optional — they're structurally required.", c: ORANGE },
  ];
  forces.forEach((f, i) => {
    const x = 0.6 + i * 4.15;
    s.addShape(pres.shapes.RECTANGLE, { x, y: 2.3, w: 3.95, h: 4.5, fill: { color: "FFFFFF" }, line: { color: RULE, width: 1 } });
    s.addShape(pres.shapes.RECTANGLE, { x, y: 2.3, w: 3.95, h: 0.12, fill: { color: f.c }, line: { color: f.c, width: 0 } });
    s.addText("0" + (i + 1), { x: x + 0.3, y: 2.55, w: 1, h: 0.5, fontSize: 28, fontFace: HEADER, bold: true, color: f.c, margin: 0 });
    s.addText(f.t, { x: x + 0.3, y: 3.1, w: 3.4, h: 0.8, fontSize: 17, fontFace: HEADER, bold: true, color: INK, margin: 0 });
    s.addText(f.b, { x: x + 0.3, y: 4.0, w: 3.4, h: 2.6, fontSize: 11.5, fontFace: BODY, color: CHARCOAL, margin: 0 });
  });
}

// =============== SLIDE 5 — MARKET OPPORTUNITY ===============
{
  const s = pres.addSlide();
  shell(s, { tag: "04 · Market Sizing", title: "TAM $14.7B · SAM $3.2B · SOM $184M by Year 3.", sub: "Bottom-up model: US + Tier-1 EN markets. Figures modelled; refine with GTM primary research.", accent: BLUE, page: "05" });

  // three concentric nested blocks
  const boxes = [
    { label: "TAM", n: "$14.7B", x: 0.6, w: 12.2, h: 4.7, bg: "FFFFFF", fg: INK, stroke: RULE, detail: "Global digital mental-wellness + relationship apps (Grand View Research, 2025, projected to 2028)." },
    { label: "SAM", n: "$3.2B", x: 2.0, w: 9.3, h: 3.6, bg: SOFT, fg: INK, stroke: RULE, detail: "US + UK + CA + AU + NZ couples aged 22–55 in committed relationships, with smartphone + willingness-to-pay > $8/mo." },
    { label: "SOM", n: "$184M", x: 3.4, w: 6.5, h: 2.4, bg: BLUE, fg: "FFFFFF", stroke: BLUE, detail: "Year-3 capture at 1.2% of SAM at $9.99/mo blended ARPU and 52% annual retention." },
  ];
  boxes.forEach((b, i) => {
    const y = 2.1 + i * 0.05;
    s.addShape(pres.shapes.RECTANGLE, { x: b.x, y: 2.1, w: b.w, h: b.h, fill: { color: b.bg }, line: { color: b.stroke, width: 1 } });
  });
  // label the nested layers
  s.addText("TAM — Global addressable", { x: 0.8, y: 2.25, w: 5, h: 0.3, fontSize: 11, fontFace: BODY, bold: true, color: GREY, charSpacing: 3, margin: 0 });
  s.addText("$14.7B", { x: 0.8, y: 2.55, w: 5, h: 0.5, fontSize: 22, fontFace: HEADER, bold: true, color: INK, margin: 0 });

  s.addText("SAM — Serviceable (EN Tier-1)", { x: 2.2, y: 3.15, w: 5, h: 0.3, fontSize: 11, fontFace: BODY, bold: true, color: GREY, charSpacing: 3, margin: 0 });
  s.addText("$3.2B", { x: 2.2, y: 3.45, w: 5, h: 0.5, fontSize: 22, fontFace: HEADER, bold: true, color: INK, margin: 0 });

  s.addText("SOM — Year 3 capture", { x: 3.6, y: 4.15, w: 5, h: 0.3, fontSize: 11, fontFace: BODY, bold: true, color: CREAM, charSpacing: 3, margin: 0 });
  s.addText("$184M", { x: 3.6, y: 4.45, w: 5, h: 0.5, fontSize: 22, fontFace: HEADER, bold: true, color: CREAM, margin: 0 });
  s.addText("1.2% of SAM  ·  ~1.5M paying users  ·  $9.99 ARPU  ·  52% annual retention", {
    x: 3.6, y: 5.0, w: 6.2, h: 0.8, fontSize: 11, fontFace: BODY, italic: true, color: CREAM, margin: 0
  });

  // assumptions box
  s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 6.95, w: 12.2, h: 0.25, fill: { color: INK }, line: { color: INK, width: 0 } });
  s.addText("Assumptions: 1 paying seat per couple (not 2)  ·  launch in EN markets  ·  blended subs + one-time IAP  ·  illustrative, refine with GTM research.", {
    x: 0.7, y: 6.96, w: 12, h: 0.23, fontSize: 9, fontFace: BODY, italic: true, color: CREAM, margin: 0
  });
}

// =============== SLIDE 6 — THE SOLUTION ===============
{
  const s = pres.addSlide();
  shell(s, { tag: "05 · Solution Overview", title: "A private AI guide that walks couples from a fight to an honest conversation.", accent: PURPLE, page: "06" });

  // big quote card
  s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 2.3, w: 12.2, h: 1.5, fill: { color: INK }, line: { color: INK, width: 0 } });
  s.addText("\u201CThe fight you just had, turned into the conversation you wish you could have — in four steps.\u201D", {
    x: 1.0, y: 2.45, w: 11.4, h: 1.2, fontSize: 22, fontFace: HEADER, italic: true, color: CREAM, valign: "middle", margin: 0
  });

  const pillars = [
    { h: "Private", b: "Vent is yours only. Partner never sees it.", c: GREEN },
    { h: "Personalised", b: "5 assessments × 2 partners shape every reply.", c: BLUE },
    { h: "Evidence-based", b: "Five clinical frameworks, one warm voice.", c: ORANGE },
    { h: "In-the-moment", b: "Opens at 11pm when the fight is still ringing.", c: PURPLE },
  ];
  pillars.forEach((p, i) => {
    const x = 0.6 + i * 3.1;
    s.addShape(pres.shapes.RECTANGLE, { x, y: 4.15, w: 2.9, h: 2.7, fill: { color: "FFFFFF" }, line: { color: RULE, width: 1 } });
    s.addShape(pres.shapes.OVAL, { x: x + 0.3, y: 4.4, w: 0.55, h: 0.55, fill: { color: p.c }, line: { color: p.c, width: 0 } });
    s.addText(p.h, { x: x + 0.3, y: 5.1, w: 2.5, h: 0.5, fontSize: 19, fontFace: HEADER, bold: true, color: INK, margin: 0 });
    s.addText(p.b, { x: x + 0.3, y: 5.65, w: 2.5, h: 1.1, fontSize: 11.5, fontFace: BODY, color: CHARCOAL, margin: 0 });
  });
}

// =============== SLIDE 7 — FOUR-STEP FLOW ===============
{
  const s = pres.addSlide();
  shell(s, { tag: "06 · Product · Flow", title: "The four-step repair: one session, one conversation on the other side.", accent: GREEN, page: "07" });

  const steps = [
    { n: "1", t: "Vent", c: GREEN, b: "Let it all out.", d: "Unfiltered space. Partner never sees it. Otis listens, reflects, never steers." },
    { n: "2", t: "Understand", c: BLUE, b: "See what's really going on.", d: "Surface the feeling, unmet need, and protective pattern beneath the fight." },
    { n: "3", t: "Prepare", c: ORANGE, b: "Find words they can hear.", d: "Turn raw feelings into a soft start-up — clear, fair, no blame." },
    { n: "4", t: "Nurture", c: PURPLE, b: "Have the conversation.", d: "Step-by-step guide: opening line, mid-conflict anchors, how to close with care." },
  ];

  // horizontal connector
  s.addShape(pres.shapes.RECTANGLE, { x: 1.0, y: 3.3, w: 11.3, h: 0.04, fill: { color: RULE }, line: { color: RULE, width: 0 } });

  steps.forEach((st, i) => {
    const x = 0.6 + i * 3.1;
    // big circle
    s.addShape(pres.shapes.OVAL, { x: x + 1.05, y: 2.9, w: 0.9, h: 0.9, fill: { color: st.c }, line: { color: st.c, width: 0 } });
    s.addText(st.n, { x: x + 1.05, y: 2.9, w: 0.9, h: 0.9, fontSize: 28, fontFace: HEADER, bold: true, color: "FFFFFF", align: "center", valign: "middle", margin: 0 });
    // card
    s.addShape(pres.shapes.RECTANGLE, { x, y: 4.1, w: 2.9, h: 2.8, fill: { color: "FFFFFF" }, line: { color: RULE, width: 1 } });
    s.addShape(pres.shapes.RECTANGLE, { x, y: 4.1, w: 2.9, h: 0.1, fill: { color: st.c }, line: { color: st.c, width: 0 } });
    s.addText(st.t, { x: x + 0.3, y: 4.3, w: 2.5, h: 0.5, fontSize: 22, fontFace: HEADER, bold: true, color: INK, margin: 0 });
    s.addText(st.b, { x: x + 0.3, y: 4.85, w: 2.5, h: 0.45, fontSize: 13, fontFace: HEADER, italic: true, color: st.c, margin: 0 });
    s.addText(st.d, { x: x + 0.3, y: 5.4, w: 2.5, h: 1.4, fontSize: 11, fontFace: BODY, color: CHARCOAL, margin: 0 });
  });
}

// =============== SLIDE 8 — PERSONALISATION ===============
{
  const s = pres.addSlide();
  shell(s, { tag: "07 · Product · Personalisation", title: "Five assessments × two partners = a proprietary relationship map.", sub: "Every Otis response is shaped by your attachment style, love language, conflict pattern — and your partner's.", accent: BLUE, page: "08" });

  const qs = [
    { t: "Attachment", d: "Secure / Anxious / Avoidant / Disorganised", c: ORANGE },
    { t: "Love Language", d: "Words / Acts / Gifts / Time / Touch", c: "E3B341" },
    { t: "Conflict Style", d: "Volatile / Validating / Avoidant / Hostile", c: PURPLE },
    { t: "Body in Conflict", d: "Window of tolerance + regulation profile", c: GREEN },
    { t: "Core Need", d: "Safety / Respect / Closeness / Autonomy / Recognition", c: BLUE },
  ];
  qs.forEach((q, i) => {
    const x = 0.6 + i * 2.5;
    s.addShape(pres.shapes.RECTANGLE, { x, y: 2.7, w: 2.35, h: 3.4, fill: { color: "FFFFFF" }, line: { color: RULE, width: 1 } });
    s.addShape(pres.shapes.OVAL, { x: x + 0.85, y: 2.95, w: 0.65, h: 0.65, fill: { color: q.c }, line: { color: q.c, width: 0 } });
    s.addText("0" + (i + 1), { x: x + 0.85, y: 2.95, w: 0.65, h: 0.65, fontSize: 13, fontFace: HEADER, bold: true, color: "FFFFFF", align: "center", valign: "middle", margin: 0 });
    s.addText(q.t, { x: x + 0.2, y: 3.75, w: 2.0, h: 0.5, fontSize: 15, fontFace: HEADER, bold: true, color: INK, align: "center", margin: 0 });
    s.addText(q.d, { x: x + 0.2, y: 4.3, w: 2.0, h: 1.6, fontSize: 10.5, fontFace: BODY, color: CHARCOAL, align: "center", margin: 0 });
  });

  // insight strip
  s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 6.3, w: 12.2, h: 0.7, fill: { color: INK }, line: { color: INK, width: 0 } });
  s.addText([
    { text: "Defensible by construction:  ", options: { bold: true, color: CREAM, fontSize: 12 } },
    { text: "5 × 2 profiles generate ~1.2M unique couple archetypes. The longer a couple uses Otis, the harder it is for a competitor to replicate the fit.", options: { color: "B9C4E0", fontSize: 12 } },
  ], { x: 0.9, y: 6.3, w: 11.6, h: 0.7, fontFace: BODY, valign: "middle", margin: 0 });
}

// =============== SLIDE 9 — PRIVATE VENT MODEL ===============
{
  const s = pres.addSlide();
  shell(s, { tag: "08 · Product · Privacy Model", title: "The private-vent layer is the single feature no shared-journal competitor can copy.", accent: ORANGE, page: "09" });

  // two-column comparison
  const cols = [
    { h: "Shared-journal apps", sub: "Paired, Lasting, Relish", c: GREY, items: [
      "Content is visible to both partners by design.",
      "Users self-censor — the ugly feelings never surface.",
      "The tool becomes a performance, not a release.",
      "No safe space for the unspeakable thought.",
    ] },
    { h: "Hey Otis private vent", sub: "Architectural, not optional", c: ORANGE, items: [
      "Vent messages are end-to-end partitioned from partner view.",
      "Assessment insights are shared; raw venting is never shared.",
      "Users say the real thing — which is the only path to real repair.",
      "A category moat: rebuilding this retroactively breaks a shared product.",
    ] },
  ];
  cols.forEach((c, i) => {
    const x = 0.6 + i * 6.15;
    s.addShape(pres.shapes.RECTANGLE, { x, y: 2.3, w: 6.05, h: 4.7, fill: { color: "FFFFFF" }, line: { color: RULE, width: 1 } });
    s.addShape(pres.shapes.RECTANGLE, { x, y: 2.3, w: 6.05, h: 0.6, fill: { color: c.c }, line: { color: c.c, width: 0 } });
    s.addText(c.h, { x: x + 0.3, y: 2.35, w: 5.7, h: 0.5, fontSize: 16, fontFace: HEADER, bold: true, color: "FFFFFF", margin: 0 });
    s.addText(c.sub, { x: x + 0.3, y: 3.0, w: 5.7, h: 0.35, fontSize: 11, fontFace: BODY, italic: true, color: GREY, margin: 0 });
    c.items.forEach((it, j) => {
      s.addShape(pres.shapes.OVAL, { x: x + 0.3, y: 3.55 + j * 0.75, w: 0.15, h: 0.15, fill: { color: c.c }, line: { color: c.c, width: 0 } });
      s.addText(it, { x: x + 0.6, y: 3.45 + j * 0.75, w: 5.3, h: 0.65, fontSize: 11.5, fontFace: BODY, color: CHARCOAL, margin: 0 });
    });
  });
}

// =============== SLIDE 10 — FIVE FRAMEWORKS ===============
{
  const s = pres.addSlide();
  shell(s, { tag: "09 · Product · Clinical Foundation", title: "Five evidence bases, fused into one voice.", sub: "No single modality dominates — each step pulls from the framework with the strongest outcome data for that phase.", accent: PURPLE, page: "10" });

  const fw = [
    { t: "Gottman Method", c: GREEN, use: "Soft start-up, repair attempts, physiological flooding — Prepare + Nurture." },
    { t: "Emotionally Focused Therapy (EFT)", c: BLUE, use: "Attachment wounds, primary emotion, bonding cycle — Understand." },
    { t: "Non-Violent Communication (NVC)", c: ORANGE, use: "Observation → feeling → need → request — Prepare." },
    { t: "Internal Family Systems (IFS)", c: PURPLE, use: "Protectors, exiles, Self-energy — all four steps, surfaced in Understand." },
    { t: "Cognitive Behavioural Couples Therapy (CBCT)", c: "C9A559", use: "Automatic thoughts, reframing, behavioural experiments — cross-cutting." },
  ];
  fw.forEach((f, i) => {
    const y = 2.3 + i * 0.88;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: y, w: 12.2, h: 0.78, fill: { color: "FFFFFF" }, line: { color: RULE, width: 1 } });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: y, w: 0.12, h: 0.78, fill: { color: f.c }, line: { color: f.c, width: 0 } });
    s.addText(f.t, { x: 0.95, y: y + 0.1, w: 4.5, h: 0.6, fontSize: 14.5, fontFace: HEADER, bold: true, color: INK, valign: "middle", margin: 0 });
    s.addText(f.use, { x: 5.5, y: y + 0.1, w: 7.15, h: 0.6, fontSize: 11.5, fontFace: BODY, color: CHARCOAL, valign: "middle", margin: 0 });
  });
}

// =============== SLIDE 11 — BRAND POSITIONING ===============
{
  const s = pres.addSlide();
  shell(s, { tag: "10 · Brand · Positioning", title: "Positioning statement.", accent: INK, page: "11" });

  // big positioning card
  s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 2.3, w: 12.2, h: 3.3, fill: { color: INK }, line: { color: INK, width: 0 } });
  const posn = [
    { lbl: "FOR", txt: "couples who keep having the same fight" },
    { lbl: "HEY OTIS IS", txt: "a private AI repair guide" },
    { lbl: "THAT", txt: "walks you from rupture to honest conversation in four steps" },
    { lbl: "UNLIKE", txt: "couples-therapy apps, daily-prompt apps, or general AI" },
    { lbl: "HEY OTIS", txt: "meets you in the heat of the moment — knows how you attach, how you fight — and gets you to a real repair." },
  ];
  posn.forEach((p, i) => {
    const y = 2.5 + i * 0.6;
    s.addText(p.lbl, { x: 0.9, y: y, w: 2.2, h: 0.5, fontSize: 11, fontFace: BODY, bold: true, color: GREEN, charSpacing: 3, margin: 0 });
    s.addText(p.txt, { x: 3.2, y: y, w: 9.4, h: 0.5, fontSize: 14, fontFace: HEADER, italic: i === 4, color: CREAM, margin: 0 });
  });

  // category definition
  s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 5.85, w: 5.95, h: 1.1, fill: { color: "FFFFFF" }, line: { color: RULE, width: 1 } });
  s.addText("CATEGORY WE OWN", { x: 0.85, y: 5.95, w: 5.5, h: 0.3, fontSize: 10, fontFace: BODY, bold: true, color: ORANGE, charSpacing: 4, margin: 0 });
  s.addText("Relationship Repair", { x: 0.85, y: 6.2, w: 5.5, h: 0.4, fontSize: 22, fontFace: HEADER, bold: true, color: INK, margin: 0 });
  s.addText("Not therapy. Not journaling. The tool for the conflict itself.", { x: 0.85, y: 6.6, w: 5.5, h: 0.3, fontSize: 11, fontFace: BODY, italic: true, color: GREY, margin: 0 });

  s.addShape(pres.shapes.RECTANGLE, { x: 6.85, y: 5.85, w: 5.95, h: 1.1, fill: { color: "FFFFFF" }, line: { color: RULE, width: 1 } });
  s.addText("JOB-TO-BE-HIRED-FOR", { x: 7.1, y: 5.95, w: 5.5, h: 0.3, fontSize: 10, fontFace: BODY, bold: true, color: PURPLE, charSpacing: 4, margin: 0 });
  s.addText("\u201CHelp me have the conversation I'm avoiding.\u201D", { x: 7.1, y: 6.2, w: 5.5, h: 0.4, fontSize: 15, fontFace: HEADER, italic: true, color: INK, margin: 0 });
  s.addText("Tonight — not next Thursday with a therapist.", { x: 7.1, y: 6.6, w: 5.5, h: 0.3, fontSize: 11, fontFace: BODY, italic: true, color: GREY, margin: 0 });
}

// =============== SLIDE 12 — VOICE & IDENTITY ===============
{
  const s = pres.addSlide();
  shell(s, { tag: "11 · Brand · Voice", title: "A warm, grounded voice — never clinical, never self-help.", accent: GREEN, page: "12" });

  // voice principles
  const vs = [
    { h: "Direct, not blunt", b: "\u201CSay the quiet part.\u201D  Imperative and inviting — never scolding." },
    { h: "Grounded, not mystical", b: "\u201CSee what's really going on.\u201D  Specific, not vague." },
    { h: "Warm, not saccharine", b: "\u201CHave the conversation.\u201D  Respects the user as a capable adult." },
    { h: "Honest, not clinical", b: "No therapy-speak. Attachment science in plain words." },
  ];
  vs.forEach((v, i) => {
    const x = 0.6 + (i % 2) * 6.15;
    const y = 2.3 + Math.floor(i / 2) * 2.15;
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 6.05, h: 2.0, fill: { color: "FFFFFF" }, line: { color: RULE, width: 1 } });
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.1, h: 2.0, fill: { color: GREEN }, line: { color: GREEN, width: 0 } });
    s.addText(v.h, { x: x + 0.3, y: y + 0.2, w: 5.7, h: 0.5, fontSize: 17, fontFace: HEADER, bold: true, color: INK, margin: 0 });
    s.addText(v.b, { x: x + 0.3, y: y + 0.75, w: 5.7, h: 1.1, fontSize: 12.5, fontFace: BODY, color: CHARCOAL, margin: 0 });
  });

  // do not say
  s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 6.65, w: 12.2, h: 0.35, fill: { color: INK }, line: { color: INK, width: 0 } });
  s.addText("Never say:  \u201Ctherapy in your pocket\u201D · \u201Csave your relationship\u201D · \u201Crevolutionary\u201D · any exclamation mark. Ever.", {
    x: 0.8, y: 6.66, w: 12, h: 0.33, fontSize: 10.5, fontFace: BODY, italic: true, color: CREAM, margin: 0, valign: "middle"
  });
}

// =============== SLIDE 13 — PERSONAS ===============
{
  const s = pres.addSlide();
  shell(s, { tag: "12 · Target Personas", title: "Three high-intent segments, ranked by lifetime value.", accent: BLUE, page: "13" });

  const ps = [
    { t: "The Therapy-Literate Half", sub: "Primary · ~48% of revenue", c: BLUE, b: "28–42, in a 3+ year partnership. Has done personal therapy. Partner has not. Brings Otis into the relationship solo; partner joins later." },
    { t: "The Reconnecting Couple", sub: "Secondary · ~34% of revenue", c: ORANGE, b: "32–48, post-kids/post-move. The fights aren't loud — they're distant. Uses Otis to find language for what feels off but hasn't been named." },
    { t: "The Pre-Commitment Pair", sub: "Tertiary · ~18% of revenue", c: PURPLE, b: "24–32, pre-engagement or pre-cohabitation. High intent, low conflict frequency but high stakes. Converts on the assessment suite, retains on repair." },
  ];
  ps.forEach((p, i) => {
    const x = 0.6 + i * 4.15;
    s.addShape(pres.shapes.RECTANGLE, { x, y: 2.3, w: 3.95, h: 4.7, fill: { color: "FFFFFF" }, line: { color: RULE, width: 1 } });
    s.addShape(pres.shapes.RECTANGLE, { x, y: 2.3, w: 3.95, h: 0.55, fill: { color: p.c }, line: { color: p.c, width: 0 } });
    s.addText(p.t, { x: x + 0.3, y: 2.37, w: 3.4, h: 0.45, fontSize: 14, fontFace: HEADER, bold: true, color: "FFFFFF", margin: 0, valign: "middle" });
    s.addText(p.sub, { x: x + 0.3, y: 2.95, w: 3.4, h: 0.35, fontSize: 10.5, fontFace: BODY, italic: true, color: p.c, charSpacing: 2, margin: 0 });
    s.addText(p.b, { x: x + 0.3, y: 3.4, w: 3.4, h: 3.4, fontSize: 12, fontFace: BODY, color: CHARCOAL, margin: 0 });
  });
}

// =============== SLIDE 14 — COMPETITIVE QUADRANT ===============
{
  const s = pres.addSlide();
  shell(s, { tag: "13 · Competitive Landscape", title: "The defensible wedge: in-the-moment × personalised × private.", sub: "No incumbent sits in the top-right quadrant.", accent: ORANGE, page: "14" });

  // quadrant frame
  const qx = 2.0, qy = 2.3, qw = 9, qh = 4.6;
  s.addShape(pres.shapes.RECTANGLE, { x: qx, y: qy, w: qw, h: qh, fill: { color: "FFFFFF" }, line: { color: RULE, width: 1 } });
  // axes
  s.addShape(pres.shapes.LINE, { x: qx + qw / 2, y: qy, w: 0, h: qh, line: { color: "D0CBBF", width: 1, dashType: "dash" } });
  s.addShape(pres.shapes.LINE, { x: qx, y: qy + qh / 2, w: qw, h: 0, line: { color: "D0CBBF", width: 1, dashType: "dash" } });
  // axis labels
  s.addText("\u2191  HIGH PERSONALISATION", { x: qx - 1.8, y: qy + 0.1, w: 1.7, h: 0.3, fontSize: 9, fontFace: BODY, bold: true, color: GREY, charSpacing: 2, margin: 0 });
  s.addText("\u2193  LOW PERSONALISATION", { x: qx - 1.8, y: qy + qh - 0.4, w: 1.7, h: 0.3, fontSize: 9, fontFace: BODY, bold: true, color: GREY, charSpacing: 2, margin: 0 });
  s.addText("DAILY HABIT  \u2190", { x: qx + 0.2, y: qy + qh + 0.1, w: 3, h: 0.3, fontSize: 9, fontFace: BODY, bold: true, color: GREY, charSpacing: 2, margin: 0 });
  s.addText("\u2192  IN-THE-MOMENT REPAIR", { x: qx + qw - 3, y: qy + qh + 0.1, w: 3, h: 0.3, fontSize: 9, fontFace: BODY, bold: true, color: GREY, charSpacing: 2, margin: 0, align: "right" });

  // plot points [x%, y%, name, color]
  const dots = [
    { px: 0.18, py: 0.35, n: "Paired", c: GREY },
    { px: 0.28, py: 0.45, n: "Lasting", c: GREY },
    { px: 0.15, py: 0.78, n: "Gottman Cards", c: GREY },
    { px: 0.60, py: 0.30, n: "Relish", c: GREY },
    { px: 0.75, py: 0.75, n: "ChatGPT", c: GREY },
    { px: 0.45, py: 0.20, n: "BetterHelp / Regain", c: GREY },
    { px: 0.82, py: 0.18, n: "Hey Otis", c: GREEN },
  ];
  dots.forEach(d => {
    const cx = qx + d.px * qw, cy = qy + d.py * qh;
    const isUs = d.n === "Hey Otis";
    const r = isUs ? 0.45 : 0.22;
    s.addShape(pres.shapes.OVAL, { x: cx - r / 2, y: cy - r / 2, w: r, h: r, fill: { color: d.c }, line: { color: d.c, width: 0 } });
    s.addText(d.n, { x: cx - 1.2, y: cy + r / 2 + 0.05, w: 2.4, h: 0.3, fontSize: isUs ? 13 : 10, fontFace: BODY, bold: isUs, color: isUs ? GREEN : CHARCOAL, align: "center", margin: 0 });
  });
}

// =============== SLIDE 15 — COMPETITOR TABLE ===============
{
  const s = pres.addSlide();
  shell(s, { tag: "14 · Competitive Detail", title: "Competitor teardown — pricing, positioning, and gaps.", accent: ORANGE, page: "15" });

  const head = (t) => ({ text: t, options: { bold: true, color: "FFFFFF", fill: { color: INK }, fontSize: 11, align: "center", valign: "middle", fontFace: BODY } });
  const cell = (t, bold) => ({ text: t, options: { color: CHARCOAL, fontSize: 10.5, valign: "middle", fontFace: BODY, bold: !!bold, align: t.length > 4 ? "left" : "center" } });
  const us = (t) => ({ text: t, options: { color: INK, bold: true, fontSize: 10.5, valign: "middle", fontFace: BODY, fill: { color: LIME } } });

  const rows = [
    [head("Product"), head("Positioning"), head("Pricing"), head("Paying users"), head("Personalised"), head("In-the-moment")],
    [cell("Paired", true), cell("Daily questions for couples"), cell("$14.99/mo · $59.99/yr"), cell("~1M paying (est.)"), cell("Light"), cell("No")],
    [cell("Lasting", true), cell("Gottman-based habit app"), cell("$11.99/mo · $59.99/yr"), cell("~500k paying"), cell("Light"), cell("No")],
    [cell("Relish", true), cell("Human relationship coach"), cell("$320/yr (coach-backed)"), cell("~100k paying"), cell("Yes (human)"), cell("Async only")],
    [cell("Regain (BetterHelp)", true), cell("Licensed couples therapy"), cell("$260–$400/mo"), cell("~200k sessions/mo"), cell("Yes (human)"), cell("Scheduled")],
    [cell("ChatGPT / Pi", true), cell("General AI companion"), cell("$20/mo or free"), cell("N/A"), cell("No memory"), cell("Yes")],
    [us("Hey Otis"), us("Private AI repair guide"), us("$9.99/mo · $79/yr · £0 freemium"), us("Target: 180k by M24"), us("5 assessments × 2"), us("Yes — native")],
  ];
  s.addTable(rows, {
    x: 0.6, y: 2.3, w: 12.2, colW: [2.0, 2.7, 2.3, 1.8, 1.7, 1.7],
    rowH: 0.55, border: { pt: 0.5, color: RULE }, fontFace: BODY
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 6.55, w: 12.2, h: 0.45, fill: { color: INK }, line: { color: INK, width: 0 } });
  s.addText("Price architecture sits at ~35% discount to habit apps and 90%+ discount to therapy — the untapped middle.", {
    x: 0.9, y: 6.55, w: 12, h: 0.45, fontSize: 11, fontFace: BODY, italic: true, color: CREAM, valign: "middle", margin: 0
  });
}

// =============== SLIDE 16 — DIFFERENTIATION MOAT ===============
{
  const s = pres.addSlide();
  shell(s, { tag: "15 · Moat", title: "Four defensibility layers compound over time.", accent: PURPLE, page: "16" });

  const layers = [
    { n: "01", t: "Personalisation data", b: "Every assessment + session reinforces a proprietary relationship map no competitor can reconstruct without years of usage.", c: BLUE },
    { n: "02", t: "Private-vent architecture", b: "Built into the data model. Retrofitting this into a shared-journal app would break the product; competitors cannot bolt it on.", c: ORANGE },
    { n: "03", t: "Fused clinical IP", b: "Five-framework prompt stack + clinician-reviewed safety rails. Takes 12–18 months to replicate credibly.", c: PURPLE },
    { n: "04", t: "Voice & brand equity", b: "Category-defining language (\u201Crupture to repair\u201D). First-mover advantage on a new category narrative.", c: GREEN },
  ];
  layers.forEach((l, i) => {
    const x = 0.6 + (i % 2) * 6.15;
    const y = 2.3 + Math.floor(i / 2) * 2.3;
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 6.05, h: 2.15, fill: { color: "FFFFFF" }, line: { color: RULE, width: 1 } });
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.12, h: 2.15, fill: { color: l.c }, line: { color: l.c, width: 0 } });
    s.addText(l.n, { x: x + 0.35, y: y + 0.2, w: 0.9, h: 0.5, fontSize: 22, fontFace: HEADER, bold: true, color: l.c, margin: 0 });
    s.addText(l.t, { x: x + 1.3, y: y + 0.25, w: 4.6, h: 0.5, fontSize: 15, fontFace: HEADER, bold: true, color: INK, margin: 0 });
    s.addText(l.b, { x: x + 0.35, y: y + 0.85, w: 5.5, h: 1.25, fontSize: 11.5, fontFace: BODY, color: CHARCOAL, margin: 0 });
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 6.95, w: 12.2, h: 0.35, fill: { color: INK }, line: { color: INK, width: 0 } });
  s.addText("Compounding defensibility: each layer strengthens the next. The 24-month head start is the window to lock in the category.", {
    x: 0.9, y: 6.95, w: 12, h: 0.35, fontSize: 10.5, fontFace: BODY, italic: true, color: CREAM, valign: "middle", margin: 0
  });
}

// =============== SLIDE 17 — BACKEND ARCHITECTURE ===============
{
  const s = pres.addSlide();
  shell(s, { tag: "16 · Technology · Architecture", title: "Backend architecture — lean, serverless, privacy-partitioned.", sub: "Expo → Supabase → Edge Function proxy → Anthropic. No infra to manage, no secrets in the client.", accent: BLUE, page: "17" });

  // three-tier diagram
  const tiers = [
    { x: 0.6, label: "CLIENT", c: GREEN, items: ["React Native (Expo 54)", "Expo Router v6", "expo-secure-store", "expo-auth-session (OAuth)"] },
    { x: 4.95, label: "EDGE / PROXY", c: ORANGE, items: ["Supabase Edge Functions (Deno)", "API key redaction", "Rate limiting per user", "Request shaping + logging"] },
    { x: 9.3, label: "DATA + AI", c: PURPLE, items: ["Supabase Postgres + RLS", "Supabase Auth (Google OAuth)", "Anthropic Claude Haiku 4.5", "Session memory store"] },
  ];
  tiers.forEach(t => {
    s.addShape(pres.shapes.RECTANGLE, { x: t.x, y: 2.3, w: 3.4, h: 4.6, fill: { color: "FFFFFF" }, line: { color: RULE, width: 1 } });
    s.addShape(pres.shapes.RECTANGLE, { x: t.x, y: 2.3, w: 3.4, h: 0.5, fill: { color: t.c }, line: { color: t.c, width: 0 } });
    s.addText(t.label, { x: t.x, y: 2.3, w: 3.4, h: 0.5, fontSize: 12, fontFace: BODY, bold: true, color: "FFFFFF", charSpacing: 5, align: "center", valign: "middle", margin: 0 });
    t.items.forEach((it, i) => {
      s.addShape(pres.shapes.OVAL, { x: t.x + 0.3, y: 3.1 + i * 0.85, w: 0.18, h: 0.18, fill: { color: t.c }, line: { color: t.c, width: 0 } });
      s.addText(it, { x: t.x + 0.6, y: 3.0 + i * 0.85, w: 2.7, h: 0.5, fontSize: 11.5, fontFace: BODY, color: CHARCOAL, valign: "middle", margin: 0 });
    });
  });

  // arrows between tiers
  s.addShape(pres.shapes.RECTANGLE, { x: 4.05, y: 4.5, w: 0.85, h: 0.05, fill: { color: INK }, line: { color: INK, width: 0 } });
  s.addShape(pres.shapes.RECTANGLE, { x: 8.4, y: 4.5, w: 0.85, h: 0.05, fill: { color: INK }, line: { color: INK, width: 0 } });

  // bottom note
  s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 7.0, w: 12.2, h: 0.3, fill: { color: INK }, line: { color: INK, width: 0 } });
  s.addText("Security note: API keys never touch the client bundle. Edge Function is the only component with Anthropic credentials. RLS enforces couple-scoped reads at the DB layer.", {
    x: 0.9, y: 7.0, w: 12, h: 0.3, fontSize: 10, fontFace: BODY, italic: true, color: CREAM, valign: "middle", margin: 0
  });
}

// =============== SLIDE 18 — DATA MODEL & PRIVACY ===============
{
  const s = pres.addSlide();
  shell(s, { tag: "17 · Technology · Data Model", title: "Privacy is enforced at the data layer — not in the UI.", accent: ORANGE, page: "18" });

  // two columns: data tables + privacy rules
  s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 2.3, w: 6.05, h: 4.7, fill: { color: "FFFFFF" }, line: { color: RULE, width: 1 } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 2.3, w: 6.05, h: 0.5, fill: { color: BLUE }, line: { color: BLUE, width: 0 } });
  s.addText("CORE TABLES", { x: 0.85, y: 2.3, w: 5.7, h: 0.5, fontSize: 12, fontFace: BODY, bold: true, color: "FFFFFF", charSpacing: 4, valign: "middle", margin: 0 });

  const tables = [
    { t: "profiles", d: "id, name, age, avatar_color, attachment_style, love_language, conflict_style, window_of_tolerance, core_need" },
    { t: "couples", d: "id, partner_a, partner_b, status, invite_code, linked_at" },
    { t: "sessions", d: "id, profile_id, couple_id, current_step, status, created_at, completed_at" },
    { t: "messages", d: "id, session_id, step (vent|understand|prepare|nurture), role, content, created_at — RLS: owner-only" },
    { t: "learnings", d: "id, couple_id, pattern_type, observation, confidence — RLS: both-partner read" },
  ];
  tables.forEach((tb, i) => {
    const y = 3.0 + i * 0.78;
    s.addText(tb.t, { x: 0.85, y: y, w: 2, h: 0.35, fontSize: 12, fontFace: "Consolas", bold: true, color: BLUE, margin: 0 });
    s.addText(tb.d, { x: 0.85, y: y + 0.32, w: 5.5, h: 0.5, fontSize: 9.5, fontFace: "Consolas", color: CHARCOAL, margin: 0 });
  });

  // right column: privacy rules
  s.addShape(pres.shapes.RECTANGLE, { x: 6.85, y: 2.3, w: 5.95, h: 4.7, fill: { color: INK }, line: { color: INK, width: 0 } });
  s.addText("PRIVACY RULES (RLS)", { x: 7.1, y: 2.5, w: 5.5, h: 0.4, fontSize: 12, fontFace: BODY, bold: true, color: ORANGE, charSpacing: 4, margin: 0 });

  const rules = [
    { t: "Vent messages", d: "Readable only by message owner. Partner.id cannot bypass via couples table." },
    { t: "Assessment insights", d: "Visible to both partners in Learnings → Together. The distilled pattern, never the raw vent." },
    { t: "Nurture plan", d: "Shared once Step 4 is opened. Author can revoke share." },
    { t: "Deletion", d: "Cascade-on-request. Right-to-erase exposed via Settings → Data." },
    { t: "At rest", d: "AES-256 on DB; keys managed by Supabase KMS. Daily backups with 7-day retention." },
  ];
  rules.forEach((r, i) => {
    const y = 3.1 + i * 0.72;
    s.addShape(pres.shapes.OVAL, { x: 7.1, y: y + 0.1, w: 0.15, h: 0.15, fill: { color: ORANGE }, line: { color: ORANGE, width: 0 } });
    s.addText([
      { text: r.t + "  ", options: { bold: true, color: CREAM, fontSize: 11.5 } },
      { text: r.d, options: { color: "B9C4E0", fontSize: 11 } },
    ], { x: 7.35, y: y, w: 5.3, h: 0.65, fontFace: BODY, margin: 0 });
  });
}

// =============== SLIDE 19 — AI UNIT ECONOMICS ===============
{
  const s = pres.addSlide();
  shell(s, { tag: "18 · Economics · COGS", title: "AI variable cost per active user-month: $0.08 – $0.22.", sub: "Claude Haiku 4.5 on current pricing; light-user and heavy-user scenarios.", accent: GREEN, page: "19" });

  // Assumption table
  const head = (t) => ({ text: t, options: { bold: true, color: "FFFFFF", fill: { color: INK }, fontSize: 11, align: "center", valign: "middle", fontFace: BODY } });
  const c = (t, b) => ({ text: t, options: { color: CHARCOAL, fontSize: 11, valign: "middle", align: "center", fontFace: BODY, bold: !!b } });

  const rows = [
    [head("Metric"), head("Light user"), head("Avg user"), head("Heavy user")],
    [c("Sessions / month", true), c("1"), c("3"), c("6")],
    [c("Messages / session"), c("8"), c("14"), c("22")],
    [c("Avg input tokens"), c("900"), c("1,400"), c("2,100")],
    [c("Avg output tokens"), c("450"), c("700"), c("1,100")],
    [c("Input cost @ $0.80/M"), c("$0.006"), c("$0.047"), c("$0.222")],
    [c("Output cost @ $4.00/M"), c("$0.014"), c("$0.118"), c("$0.581")],
    [c("Memory + summary calls"), c("$0.010"), c("$0.030"), c("$0.080")],
    [{ text: "AI cost / user-month", options: { bold: true, color: INK, fontSize: 11.5, valign: "middle", align: "center", fontFace: BODY, fill: { color: LIME } } },
     { text: "$0.03", options: { bold: true, color: INK, fontSize: 13, align: "center", fontFace: BODY, fill: { color: LIME } } },
     { text: "$0.20", options: { bold: true, color: INK, fontSize: 13, align: "center", fontFace: BODY, fill: { color: LIME } } },
     { text: "$0.88", options: { bold: true, color: INK, fontSize: 13, align: "center", fontFace: BODY, fill: { color: LIME } } }],
  ];
  s.addTable(rows, { x: 0.6, y: 2.35, w: 12.2, colW: [4.4, 2.6, 2.6, 2.6], rowH: 0.42, border: { pt: 0.5, color: RULE } });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 6.55, w: 12.2, h: 0.6, fill: { color: INK }, line: { color: INK, width: 0 } });
  s.addText([
    { text: "Blended weighted average across user mix (40/45/15):  ", options: { color: CREAM, fontSize: 12, bold: true } },
    { text: "$0.21 / user-month.   Gross margin at $9.99 ARPU before payment fees: ~86%.", options: { color: GREEN, fontSize: 12, italic: true } },
  ], { x: 0.9, y: 6.55, w: 12, h: 0.6, fontFace: BODY, valign: "middle", margin: 0 });
}

// =============== SLIDE 20 — CONSUMER PRICING (EXTERNAL) ===============
{
  const s = pres.addSlide();
  shell(s, { tag: "19 · Pricing · External", title: "Consumer pricing — freemium, monthly, and annual with couple upgrade.", accent: PURPLE, page: "20" });

  const plans = [
    { t: "Free", p: "$0", sub: "Forever", c: GREY, items: ["5 sessions per month", "Assessments (you only)", "No partner linking", "Tools library (limited)"] },
    { t: "Premium", p: "$9.99", sub: "/ month", c: BLUE, items: ["Unlimited sessions", "Full assessment suite", "Partner linking", "Full tools + memory"] },
    { t: "Premium Annual", p: "$79", sub: "/ year", c: GREEN, items: ["Everything in Premium", "Save 34%", "Priority model access", "Export + archives"], tag: "BEST VALUE" },
    { t: "Couple Plan", p: "$129", sub: "/ year · 2 seats", c: PURPLE, items: ["Two premium seats", "Shared Learnings → Together", "Gift-a-seat invite flow", "Relationship review ritual"], tag: "HIGHEST LTV" },
  ];
  plans.forEach((p, i) => {
    const x = 0.6 + i * 3.1;
    s.addShape(pres.shapes.RECTANGLE, { x, y: 2.3, w: 2.9, h: 4.9, fill: { color: "FFFFFF" }, line: { color: RULE, width: 1 } });
    s.addShape(pres.shapes.RECTANGLE, { x, y: 2.3, w: 2.9, h: 0.12, fill: { color: p.c }, line: { color: p.c, width: 0 } });
    if (p.tag) {
      s.addShape(pres.shapes.RECTANGLE, { x: x + 0.3, y: 2.55, w: 2.3, h: 0.28, fill: { color: p.c }, line: { color: p.c, width: 0 } });
      s.addText(p.tag, { x: x + 0.3, y: 2.55, w: 2.3, h: 0.28, fontSize: 8.5, fontFace: BODY, bold: true, color: "FFFFFF", charSpacing: 3, align: "center", valign: "middle", margin: 0 });
    }
    s.addText(p.t, { x: x + 0.2, y: 3.0, w: 2.5, h: 0.45, fontSize: 18, fontFace: HEADER, bold: true, color: INK, margin: 0 });
    s.addText(p.p, { x: x + 0.2, y: 3.5, w: 2.5, h: 0.7, fontSize: 36, fontFace: HEADER, bold: true, color: p.c, margin: 0 });
    s.addText(p.sub, { x: x + 0.2, y: 4.25, w: 2.5, h: 0.3, fontSize: 11, fontFace: BODY, italic: true, color: GREY, margin: 0 });
    p.items.forEach((it, j) => {
      s.addShape(pres.shapes.OVAL, { x: x + 0.25, y: 4.75 + j * 0.52, w: 0.12, h: 0.12, fill: { color: p.c }, line: { color: p.c, width: 0 } });
      s.addText(it, { x: x + 0.45, y: 4.65 + j * 0.52, w: 2.3, h: 0.5, fontSize: 10.5, fontFace: BODY, color: CHARCOAL, valign: "middle", margin: 0 });
    });
  });
}

// =============== SLIDE 21 — INTERNAL COST STRUCTURE ===============
{
  const s = pres.addSlide();
  shell(s, { tag: "20 · Pricing · Internal", title: "Cost structure per paying user-month.", sub: "Blended across user mix at scale (>25k paying users).", accent: ORANGE, page: "21" });

  const rows = [
    [{ text: "Cost Line", options: { bold: true, color: "FFFFFF", fill: { color: INK }, fontSize: 11, fontFace: BODY, align: "left" } },
     { text: "Cost / user-mo", options: { bold: true, color: "FFFFFF", fill: { color: INK }, fontSize: 11, fontFace: BODY, align: "center" } },
     { text: "% of ARPU ($9.99)", options: { bold: true, color: "FFFFFF", fill: { color: INK }, fontSize: 11, fontFace: BODY, align: "center" } },
     { text: "Notes", options: { bold: true, color: "FFFFFF", fill: { color: INK }, fontSize: 11, fontFace: BODY, align: "left" } }],
    [{ text: "Anthropic API (Claude Haiku 4.5)", options: { fontSize: 11, fontFace: BODY, color: CHARCOAL } },
     { text: "$0.21", options: { fontSize: 11, fontFace: BODY, color: CHARCOAL, align: "center" } },
     { text: "2.1%", options: { fontSize: 11, fontFace: BODY, color: CHARCOAL, align: "center" } },
     { text: "Blended light/avg/heavy user mix", options: { fontSize: 10.5, fontFace: BODY, color: GREY } }],
    [{ text: "Supabase (DB + Auth + Edge Fn)", options: { fontSize: 11, fontFace: BODY, color: CHARCOAL } },
     { text: "$0.04", options: { fontSize: 11, fontFace: BODY, color: CHARCOAL, align: "center" } },
     { text: "0.4%", options: { fontSize: 11, fontFace: BODY, color: CHARCOAL, align: "center" } },
     { text: "Pro tier at scale; free tier pre-launch", options: { fontSize: 10.5, fontFace: BODY, color: GREY } }],
    [{ text: "App Store / Play Store fees", options: { fontSize: 11, fontFace: BODY, color: CHARCOAL } },
     { text: "$1.50", options: { fontSize: 11, fontFace: BODY, color: CHARCOAL, align: "center" } },
     { text: "15.0%", options: { fontSize: 11, fontFace: BODY, color: CHARCOAL, align: "center" } },
     { text: "15% (Small Biz Program); 30% post-$1M", options: { fontSize: 10.5, fontFace: BODY, color: GREY } }],
    [{ text: "Infrastructure (Vercel, email, misc)", options: { fontSize: 11, fontFace: BODY, color: CHARCOAL } },
     { text: "$0.03", options: { fontSize: 11, fontFace: BODY, color: CHARCOAL, align: "center" } },
     { text: "0.3%", options: { fontSize: 11, fontFace: BODY, color: CHARCOAL, align: "center" } },
     { text: "Fixed costs amortised at 25k users", options: { fontSize: 10.5, fontFace: BODY, color: GREY } }],
    [{ text: "Payment processing (Stripe / Apple)", options: { fontSize: 11, fontFace: BODY, color: CHARCOAL } },
     { text: "$0.00", options: { fontSize: 11, fontFace: BODY, color: CHARCOAL, align: "center" } },
     { text: "—", options: { fontSize: 11, fontFace: BODY, color: CHARCOAL, align: "center" } },
     { text: "Included in App Store fee", options: { fontSize: 10.5, fontFace: BODY, color: GREY } }],
    [{ text: "TOTAL COGS", options: { fontSize: 11.5, fontFace: BODY, color: INK, bold: true, fill: { color: LIME } } },
     { text: "$1.78", options: { fontSize: 12, fontFace: BODY, color: INK, bold: true, fill: { color: LIME }, align: "center" } },
     { text: "17.8%", options: { fontSize: 12, fontFace: BODY, color: INK, bold: true, fill: { color: LIME }, align: "center" } },
     { text: "Gross margin: 82.2%", options: { fontSize: 11.5, fontFace: BODY, color: INK, bold: true, fill: { color: LIME } } }],
  ];
  s.addTable(rows, { x: 0.6, y: 2.5, w: 12.2, colW: [3.8, 2.0, 2.0, 4.4], rowH: 0.48, border: { pt: 0.5, color: RULE } });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 6.55, w: 12.2, h: 0.5, fill: { color: INK }, line: { color: INK, width: 0 } });
  s.addText("Margin expansion levers: (1) annual prepay shifts ARPU +34% without COGS change; (2) couple plan doubles revenue per couple with marginal AI cost; (3) model cost curve declines ~40% YoY.", {
    x: 0.9, y: 6.55, w: 12, h: 0.5, fontSize: 10.5, fontFace: BODY, italic: true, color: CREAM, valign: "middle", margin: 0
  });
}

// =============== SLIDE 22 — LTV / CAC ===============
{
  const s = pres.addSlide();
  shell(s, { tag: "21 · Economics · LTV/CAC", title: "Payback under 5 months at target CAC.", accent: GREEN, page: "22" });

  // left: LTV breakdown
  const lrows = [
    [{ text: "LTV Model", options: { bold: true, color: "FFFFFF", fill: { color: INK }, fontSize: 11, fontFace: BODY } }, { text: "Value", options: { bold: true, color: "FFFFFF", fill: { color: INK }, fontSize: 11, fontFace: BODY, align: "right" } }],
    [{ text: "Blended ARPU / month", options: { fontSize: 11, fontFace: BODY, color: CHARCOAL } }, { text: "$8.52", options: { fontSize: 11, fontFace: BODY, color: CHARCOAL, align: "right" } }],
    [{ text: "Gross margin", options: { fontSize: 11, fontFace: BODY, color: CHARCOAL } }, { text: "82%", options: { fontSize: 11, fontFace: BODY, color: CHARCOAL, align: "right" } }],
    [{ text: "Contribution / month", options: { fontSize: 11, fontFace: BODY, color: CHARCOAL } }, { text: "$6.99", options: { fontSize: 11, fontFace: BODY, color: CHARCOAL, align: "right" } }],
    [{ text: "Avg retention (months)", options: { fontSize: 11, fontFace: BODY, color: CHARCOAL } }, { text: "14.2", options: { fontSize: 11, fontFace: BODY, color: CHARCOAL, align: "right" } }],
    [{ text: "LTV", options: { fontSize: 12, fontFace: BODY, color: INK, bold: true, fill: { color: LIME } } }, { text: "$99", options: { fontSize: 13, fontFace: BODY, color: INK, bold: true, fill: { color: LIME }, align: "right" } }],
  ];
  s.addTable(lrows, { x: 0.6, y: 2.4, w: 5.95, colW: [4.0, 1.95], rowH: 0.5, border: { pt: 0.5, color: RULE } });

  // right: CAC scenarios
  const crows = [
    [{ text: "CAC Scenario", options: { bold: true, color: "FFFFFF", fill: { color: INK }, fontSize: 11, fontFace: BODY } },
     { text: "CAC", options: { bold: true, color: "FFFFFF", fill: { color: INK }, fontSize: 11, fontFace: BODY, align: "right" } },
     { text: "LTV/CAC", options: { bold: true, color: "FFFFFF", fill: { color: INK }, fontSize: 11, fontFace: BODY, align: "right" } },
     { text: "Payback", options: { bold: true, color: "FFFFFF", fill: { color: INK }, fontSize: 11, fontFace: BODY, align: "right" } }],
    [{ text: "Organic (TikTok + SEO)", options: { fontSize: 11, fontFace: BODY, color: CHARCOAL } }, { text: "$8", options: { fontSize: 11, fontFace: BODY, color: CHARCOAL, align: "right" } }, { text: "12.4×", options: { fontSize: 11, fontFace: BODY, color: GREEN, bold: true, align: "right" } }, { text: "1.1 mo", options: { fontSize: 11, fontFace: BODY, color: CHARCOAL, align: "right" } }],
    [{ text: "Creator / partnerships", options: { fontSize: 11, fontFace: BODY, color: CHARCOAL } }, { text: "$19", options: { fontSize: 11, fontFace: BODY, color: CHARCOAL, align: "right" } }, { text: "5.2×", options: { fontSize: 11, fontFace: BODY, color: GREEN, bold: true, align: "right" } }, { text: "2.7 mo", options: { fontSize: 11, fontFace: BODY, color: CHARCOAL, align: "right" } }],
    [{ text: "Paid social (Meta / TikTok)", options: { fontSize: 11, fontFace: BODY, color: CHARCOAL } }, { text: "$26", options: { fontSize: 11, fontFace: BODY, color: CHARCOAL, align: "right" } }, { text: "3.8×", options: { fontSize: 11, fontFace: BODY, color: ORANGE, bold: true, align: "right" } }, { text: "3.7 mo", options: { fontSize: 11, fontFace: BODY, color: CHARCOAL, align: "right" } }],
    [{ text: "Search (Google SEM)", options: { fontSize: 11, fontFace: BODY, color: CHARCOAL } }, { text: "$34", options: { fontSize: 11, fontFace: BODY, color: CHARCOAL, align: "right" } }, { text: "2.9×", options: { fontSize: 11, fontFace: BODY, color: ORANGE, bold: true, align: "right" } }, { text: "4.9 mo", options: { fontSize: 11, fontFace: BODY, color: CHARCOAL, align: "right" } }],
    [{ text: "Blended target", options: { fontSize: 11.5, fontFace: BODY, color: INK, bold: true, fill: { color: LIME } } }, { text: "$21", options: { fontSize: 12, fontFace: BODY, color: INK, bold: true, fill: { color: LIME }, align: "right" } }, { text: "4.7×", options: { fontSize: 12, fontFace: BODY, color: INK, bold: true, fill: { color: LIME }, align: "right" } }, { text: "3.0 mo", options: { fontSize: 12, fontFace: BODY, color: INK, bold: true, fill: { color: LIME }, align: "right" } }],
  ];
  s.addTable(crows, { x: 6.85, y: 2.4, w: 5.95, colW: [2.55, 1.0, 1.2, 1.2], rowH: 0.5, border: { pt: 0.5, color: RULE } });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 6.55, w: 12.2, h: 0.45, fill: { color: INK }, line: { color: INK, width: 0 } });
  s.addText("Target mix at steady state: 55% organic / 25% paid / 20% creator. Blended LTV/CAC > 4× and payback < 4 months — within best-in-class consumer subscription benchmarks.", {
    x: 0.9, y: 6.55, w: 12, h: 0.45, fontSize: 10.5, fontFace: BODY, italic: true, color: CREAM, valign: "middle", margin: 0
  });
}

// =============== SLIDE 23 — 3-YEAR PROJECTIONS ===============
{
  const s = pres.addSlide();
  shell(s, { tag: "22 · Financials", title: "3-year projection: path to $18M ARR at Year 3.", sub: "Base case. Upside case +38% assumes couple-plan conversion above 22%.", accent: BLUE, page: "23" });

  // chart
  s.addChart(pres.charts.BAR, [
    { name: "Paying users (000s)", labels: ["Y1", "Y2", "Y3"], values: [12, 68, 184] },
  ], {
    x: 0.6, y: 2.35, w: 6.1, h: 4.3, barDir: "col",
    chartColors: [BLUE],
    chartArea: { fill: { color: "FFFFFF" } },
    catAxisLabelColor: GREY, valAxisLabelColor: GREY,
    catAxisLabelFontSize: 11, valAxisLabelFontSize: 10,
    valGridLine: { color: "E5E0D5", size: 0.5 },
    catGridLine: { style: "none" },
    showValue: true, dataLabelPosition: "outEnd", dataLabelColor: INK, dataLabelFontSize: 11,
    showLegend: false,
    showTitle: true, title: "Paying users (thousands)", titleFontSize: 13, titleColor: INK, titleFontFace: HEADER,
  });

  // ARR sidebar
  const ks = [
    { y: "Year 1", u: "12k users", r: "$1.2M ARR", c: GREEN },
    { y: "Year 2", u: "68k users", r: "$6.8M ARR", c: BLUE },
    { y: "Year 3", u: "184k users", r: "$18.4M ARR", c: PURPLE },
  ];
  ks.forEach((k, i) => {
    const y = 2.4 + i * 1.5;
    s.addShape(pres.shapes.RECTANGLE, { x: 7.0, y: y, w: 5.8, h: 1.35, fill: { color: "FFFFFF" }, line: { color: RULE, width: 1 } });
    s.addShape(pres.shapes.RECTANGLE, { x: 7.0, y: y, w: 0.12, h: 1.35, fill: { color: k.c }, line: { color: k.c, width: 0 } });
    s.addText(k.y, { x: 7.25, y: y + 0.15, w: 2.5, h: 0.4, fontSize: 13, fontFace: BODY, bold: true, color: GREY, charSpacing: 3, margin: 0 });
    s.addText(k.r, { x: 7.25, y: y + 0.5, w: 4, h: 0.55, fontSize: 26, fontFace: HEADER, bold: true, color: INK, margin: 0 });
    s.addText(k.u, { x: 7.25, y: y + 1.02, w: 4, h: 0.3, fontSize: 11, fontFace: BODY, italic: true, color: k.c, margin: 0 });
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 6.9, w: 12.2, h: 0.3, fill: { color: INK }, line: { color: INK, width: 0 } });
  s.addText("Contribution-positive by month 10.  EBITDA break-even Q3 Y2.  All figures base case; downside -35%, upside +38%.", {
    x: 0.9, y: 6.9, w: 12, h: 0.3, fontSize: 10, fontFace: BODY, italic: true, color: CREAM, valign: "middle", margin: 0
  });
}

// =============== SLIDE 24 — GO TO MARKET ===============
{
  const s = pres.addSlide();
  shell(s, { tag: "23 · Go-to-Market", title: "Three-wave launch: creator seed → cultural moment → broad paid.", accent: ORANGE, page: "24" });

  const waves = [
    { n: "Wave 1", m: "M0 – M3", t: "Creator seed", b: "30 attachment-theory creators (100k–1M followers). Authentic usage, no scripts. Target: 8k downloads, 1.2k paying.", c: GREEN },
    { n: "Wave 2", m: "M3 – M9", t: "Cultural moment", b: "PR + owned narrative around \u201Crupture to repair.\u201D Podcast tour (Esther Perel, Mel Robbins, Diary of a CEO). Target: 35k paying.", c: ORANGE },
    { n: "Wave 3", m: "M9 – M24", t: "Broad paid + couple-plan loop", b: "Meta + TikTok paid, Google SEM on attachment keywords. Couple-plan referral shifts CAC toward organic. Target: 180k paying.", c: PURPLE },
  ];
  waves.forEach((w, i) => {
    const y = 2.3 + i * 1.55;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: y, w: 12.2, h: 1.4, fill: { color: "FFFFFF" }, line: { color: RULE, width: 1 } });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: y, w: 0.15, h: 1.4, fill: { color: w.c }, line: { color: w.c, width: 0 } });
    s.addText(w.n, { x: 0.95, y: y + 0.2, w: 2, h: 0.4, fontSize: 18, fontFace: HEADER, bold: true, color: w.c, margin: 0 });
    s.addText(w.m, { x: 0.95, y: y + 0.65, w: 2, h: 0.35, fontSize: 10.5, fontFace: BODY, italic: true, color: GREY, charSpacing: 2, margin: 0 });
    s.addText(w.t, { x: 3.2, y: y + 0.22, w: 9.4, h: 0.45, fontSize: 17, fontFace: HEADER, bold: true, color: INK, margin: 0 });
    s.addText(w.b, { x: 3.2, y: y + 0.7, w: 9.4, h: 0.65, fontSize: 11.5, fontFace: BODY, color: CHARCOAL, margin: 0 });
  });
}

// =============== SLIDE 25 — ACQUISITION CHANNELS ===============
{
  const s = pres.addSlide();
  shell(s, { tag: "24 · Acquisition", title: "Channel mix — organic-led, not paid-led.", accent: BLUE, page: "25" });

  s.addChart(pres.charts.DOUGHNUT, [
    { name: "Mix", labels: ["TikTok organic", "Creator partnerships", "SEO (attachment keywords)", "Paid social (Meta/TikTok)", "Google SEM", "Word of mouth / couple plan"], values: [28, 18, 14, 18, 8, 14] },
  ], {
    x: 0.6, y: 2.4, w: 5.5, h: 4.6,
    chartColors: [GREEN, BLUE, ORANGE, PURPLE, "C9A559", INK],
    chartArea: { fill: { color: "FFFFFF" } },
    showLegend: true, legendPos: "r", legendFontSize: 10, legendColor: CHARCOAL,
    showPercent: true, dataLabelColor: "FFFFFF", dataLabelFontSize: 9,
    showTitle: false,
  });

  // channel detail cards
  const chans = [
    { t: "TikTok organic (28%)", b: "Attachment-theory content + session clips (blurred). Owned handle @heyotisapp. Target: 1 viral/week.", c: GREEN },
    { t: "Creator partnerships (18%)", b: "Long-form authentic usage with 30 creators in year one. Revenue share on linked signups.", c: BLUE },
    { t: "SEO (14%)", b: "Own the 200 highest-intent queries — \u201Chow to apologise after a fight\u201D, \u201Canxious avoidant\u201D, \u201Crepair attempts.\u201D", c: ORANGE },
    { t: "Paid social + SEM (26%)", b: "Launch spend ramps after organic hits 30k users. UGC-style creative out-performs polished 4:1.", c: PURPLE },
  ];
  chans.forEach((c, i) => {
    const y = 2.4 + i * 1.15;
    s.addShape(pres.shapes.RECTANGLE, { x: 6.55, y: y, w: 6.25, h: 1.0, fill: { color: "FFFFFF" }, line: { color: RULE, width: 1 } });
    s.addShape(pres.shapes.RECTANGLE, { x: 6.55, y: y, w: 0.1, h: 1.0, fill: { color: c.c }, line: { color: c.c, width: 0 } });
    s.addText(c.t, { x: 6.8, y: y + 0.1, w: 5.8, h: 0.35, fontSize: 12, fontFace: HEADER, bold: true, color: INK, margin: 0 });
    s.addText(c.b, { x: 6.8, y: y + 0.45, w: 5.8, h: 0.55, fontSize: 10.5, fontFace: BODY, color: CHARCOAL, margin: 0 });
  });
}

// =============== SLIDE 26 — ROADMAP ===============
{
  const s = pres.addSlide();
  shell(s, { tag: "25 · Product Roadmap", title: "12-month product roadmap.", accent: PURPLE, page: "26" });

  const qs = [
    { q: "Q2 2026 — LAUNCH", c: GREEN, items: ["Public iOS + Android launch", "5 assessments live", "Couple linking + invite codes", "Core 4-step session flow"] },
    { q: "Q3 2026 — DEPTH", c: BLUE, items: ["Voice vent (expo-speech-recognition)", "Session memory + continuity", "Partner-shared learnings", "Weekly reflection ritual"] },
    { q: "Q4 2026 — RITUAL", c: ORANGE, items: ["Couple Plan (dual-seat)", "Scheduled check-ins + rituals", "Relationship retrospectives", "Export + archive"] },
    { q: "Q1 2027 — LEVERAGE", c: PURPLE, items: ["Therapist-assisted tier (B2B2C)", "Enterprise EAP pilots", "Android Wear + widgets", "Localisation: ES, PT-BR, DE"] },
  ];
  qs.forEach((qs_, i) => {
    const x = 0.6 + i * 3.1;
    s.addShape(pres.shapes.RECTANGLE, { x, y: 2.3, w: 2.9, h: 4.7, fill: { color: "FFFFFF" }, line: { color: RULE, width: 1 } });
    s.addShape(pres.shapes.RECTANGLE, { x, y: 2.3, w: 2.9, h: 0.55, fill: { color: qs_.c }, line: { color: qs_.c, width: 0 } });
    s.addText(qs_.q, { x: x + 0.15, y: 2.3, w: 2.7, h: 0.55, fontSize: 11, fontFace: BODY, bold: true, color: "FFFFFF", charSpacing: 2, align: "center", valign: "middle", margin: 0 });
    qs_.items.forEach((it, j) => {
      const y = 3.05 + j * 0.9;
      s.addShape(pres.shapes.OVAL, { x: x + 0.25, y: y + 0.1, w: 0.15, h: 0.15, fill: { color: qs_.c }, line: { color: qs_.c, width: 0 } });
      s.addText(it, { x: x + 0.5, y: y, w: 2.35, h: 0.8, fontSize: 11, fontFace: BODY, color: CHARCOAL, margin: 0 });
    });
  });
}

// =============== SLIDE 27 — RISKS & MITIGATIONS ===============
{
  const s = pres.addSlide();
  shell(s, { tag: "26 · Risk Register", title: "Five material risks, five named mitigations.", accent: ORANGE, page: "27" });

  const head = (t) => ({ text: t, options: { bold: true, color: "FFFFFF", fill: { color: INK }, fontSize: 11, fontFace: BODY, align: "center" } });
  const c = (t, col) => ({ text: t, options: { color: col || CHARCOAL, fontSize: 11, fontFace: BODY, valign: "middle" } });

  const rows = [
    [head("Risk"), head("Likelihood"), head("Impact"), head("Mitigation")],
    [c("Clinical liability — user acts on Otis output in crisis"), c("Med", ORANGE), c("High", "B83232"), c("Crisis detection + regional helplines + explicit non-therapy framing (live in-app)")],
    [c("Model cost spike — Anthropic pricing change"), c("Med", ORANGE), c("Med", ORANGE), c("Dual-model support (Haiku/Opus); cost-cap per user; contractual cap with provider")],
    [c("Platform risk — App Store rejects mental-health AI"), c("Low", GREEN), c("High", "B83232"), c("Apple Health & Fitness category precedent; clinical board review; PEGI/IARC pre-submission")],
    [c("Privacy breach — vent data exposure"), c("Low", GREEN), c("High", "B83232"), c("RLS at DB layer; quarterly pen-test; SOC 2 Type I by M12; published data-use report")],
    [c("Incumbent fast-follow — Paired/Lasting copies flow"), c("High", "B83232"), c("Med", ORANGE), c("Personalisation + private-vent architecture compounds; 18-month data moat lead")],
  ];
  s.addTable(rows, { x: 0.6, y: 2.4, w: 12.2, colW: [4.4, 1.5, 1.5, 4.8], rowH: 0.75, border: { pt: 0.5, color: RULE } });
}

// =============== SLIDE 28 — THE ASK ===============
{
  const s = pres.addSlide();
  shell(s, { tag: "27 · Capital · The Ask", title: "Seed round: $2.5M to reach 68k paying users by M24.", accent: GREEN, page: "28" });

  // big ask
  s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 2.3, w: 5.9, h: 4.7, fill: { color: INK }, line: { color: INK, width: 0 } });
  s.addText("THE ASK", { x: 0.9, y: 2.55, w: 5, h: 0.3, fontSize: 11, fontFace: BODY, bold: true, color: GREEN, charSpacing: 5, margin: 0 });
  s.addText("$2.5M", { x: 0.9, y: 2.95, w: 5, h: 1.5, fontSize: 86, fontFace: HEADER, bold: true, color: CREAM, margin: 0 });
  s.addText("Seed · SAFE / priced round", { x: 0.9, y: 4.45, w: 5, h: 0.4, fontSize: 14, fontFace: HEADER, italic: true, color: GREEN, margin: 0 });
  s.addText("Targeted close: Q3 2026. Runway: 24 months to Series A milestones (68k paying, $6.8M ARR, LTV/CAC > 4).", {
    x: 0.9, y: 5.35, w: 5.3, h: 1.6, fontSize: 12, fontFace: BODY, color: "B9C4E0", margin: 0
  });

  // use of funds
  s.addText("USE OF FUNDS", { x: 7.0, y: 2.4, w: 5.8, h: 0.3, fontSize: 11, fontFace: BODY, bold: true, color: GREEN, charSpacing: 5, margin: 0 });
  const uf = [
    { p: "40%", l: "Growth & acquisition", d: "Paid + creator, at $21 blended CAC", c: GREEN },
    { p: "28%", l: "Product & engineering", d: "3 eng, 1 design, 1 clinical lead", c: BLUE },
    { p: "18%", l: "Clinical & research", d: "Board of advisers + efficacy studies", c: PURPLE },
    { p: "14%", l: "Operations & reserve", d: "Legal, compliance, G&A, contingency", c: ORANGE },
  ];
  uf.forEach((u, i) => {
    const y = 2.9 + i * 1.0;
    s.addShape(pres.shapes.RECTANGLE, { x: 7.0, y, w: 5.8, h: 0.85, fill: { color: "FFFFFF" }, line: { color: RULE, width: 1 } });
    s.addShape(pres.shapes.RECTANGLE, { x: 7.0, y, w: 0.12, h: 0.85, fill: { color: u.c }, line: { color: u.c, width: 0 } });
    s.addText(u.p, { x: 7.25, y: y + 0.1, w: 1.2, h: 0.65, fontSize: 22, fontFace: HEADER, bold: true, color: u.c, valign: "middle", margin: 0 });
    s.addText(u.l, { x: 8.5, y: y + 0.1, w: 4.2, h: 0.35, fontSize: 13, fontFace: HEADER, bold: true, color: INK, margin: 0 });
    s.addText(u.d, { x: 8.5, y: y + 0.45, w: 4.2, h: 0.35, fontSize: 10.5, fontFace: BODY, italic: true, color: GREY, margin: 0 });
  });
}

// =============== SLIDE 29 — CLOSING / VISION ===============
{
  const s = pres.addSlide();
  s.background = { color: INK };
  // stripe
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 3.325, h: 0.1, fill: { color: GREEN }, line: { color: GREEN, width: 0 } });
  s.addShape(pres.shapes.RECTANGLE, { x: 3.325, y: 0, w: 3.325, h: 0.1, fill: { color: BLUE }, line: { color: BLUE, width: 0 } });
  s.addShape(pres.shapes.RECTANGLE, { x: 6.65, y: 0, w: 3.325, h: 0.1, fill: { color: ORANGE }, line: { color: ORANGE, width: 0 } });
  s.addShape(pres.shapes.RECTANGLE, { x: 9.975, y: 0, w: 3.325, h: 0.1, fill: { color: PURPLE }, line: { color: PURPLE, width: 0 } });

  s.addText("THE VISION", { x: 0.8, y: 1.2, w: 10, h: 0.3, fontSize: 11, fontFace: BODY, bold: true, color: GREEN, charSpacing: 6, margin: 0 });
  s.addText("Every couple who wants to stay,", {
    x: 0.8, y: 1.7, w: 12, h: 1.0, fontSize: 44, fontFace: HEADER, bold: true, color: CREAM, margin: 0
  });
  s.addText("has the tool to repair.", {
    x: 0.8, y: 2.7, w: 12, h: 1.0, fontSize: 44, fontFace: HEADER, bold: true, italic: true, color: GREEN, margin: 0
  });
  s.addText("Hey Otis is the first product to treat repair as the category — not prompts, not therapy, not journaling. When a couple fights tonight and finds their way back to honest conversation before the morning, that's the product working. Do that for ten million couples, and we've changed something material about how people stay in love.", {
    x: 0.8, y: 4.0, w: 11.5, h: 2.2, fontSize: 15, fontFace: BODY, color: "D4D8E6", margin: 0
  });

  s.addText("Thank you.", { x: 0.8, y: 6.3, w: 6, h: 0.5, fontSize: 20, fontFace: HEADER, italic: true, color: CREAM, margin: 0 });
  s.addText("Deloitte Digital  ·  Strategy & Analytics  ·  April 2026", {
    x: 0.8, y: 7.0, w: 11.5, h: 0.3, fontSize: 10, fontFace: BODY, color: GREY, charSpacing: 3, margin: 0
  });
}

pres.writeFile({ fileName: "/Users/samanthaahhee/tether/store-assets/deck/HeyOtis-Strategy-Deck.pptx" })
  .then(f => console.log("Built:", f));
