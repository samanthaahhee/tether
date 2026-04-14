const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType, LevelFormat, PageBreak } = require('docx');
const fs = require('fs');

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

const brandGreen = "96D35F";
const brandCharcoal = "211E28";
const brandMid = "80798C";
const headerBg = "EDF8E4";

function headerCell(text, w) {
  return new TableCell({
    borders, width: { size: w, type: WidthType.DXA },
    shading: { fill: headerBg, type: ShadingType.CLEAR },
    margins: cellMargins,
    children: [new Paragraph({ children: [new TextRun({ text, bold: true, font: "Arial", size: 20 })] })]
  });
}
function cell(text, w) {
  return new TableCell({
    borders, width: { size: w, type: WidthType.DXA },
    margins: cellMargins,
    children: [new Paragraph({ children: [new TextRun({ text, font: "Arial", size: 20 })] })]
  });
}
function h1(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 360, after: 200 }, children: [new TextRun({ text, bold: true, font: "Arial", size: 32, color: brandCharcoal })] });
}
function h2(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 280, after: 160 }, children: [new TextRun({ text, bold: true, font: "Arial", size: 26, color: brandCharcoal })] });
}
function body(text) {
  return new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text, font: "Arial", size: 22, color: "3A3630" })] });
}
function bullet(text, ref = "bullets") {
  return new Paragraph({ numbering: { reference: ref, level: 0 }, spacing: { after: 60 }, children: [new TextRun({ text, font: "Arial", size: 22, color: "3A3630" })] });
}
function boldBullet(label, desc, ref = "bullets") {
  return new Paragraph({ numbering: { reference: ref, level: 0 }, spacing: { after: 60 }, children: [
    new TextRun({ text: label + ": ", bold: true, font: "Arial", size: 22, color: brandCharcoal }),
    new TextRun({ text: desc, font: "Arial", size: 22, color: "3A3630" })
  ]});
}

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 32, bold: true, font: "Arial", color: brandCharcoal }, paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 26, bold: true, font: "Arial", color: brandCharcoal }, paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 1 } },
    ]
  },
  numbering: {
    config: [
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbers", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    children: [
      // Title page
      new Paragraph({ spacing: { before: 2400 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Hey Otis", font: "Arial", size: 72, bold: true, color: brandGreen })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: "Go-to-Market Strategy", font: "Arial", size: 36, color: brandCharcoal })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: "Taking a Relationship Wellness App to Market", font: "Arial", size: 24, color: brandMid })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 600 }, children: [new TextRun({ text: "April 2026", font: "Arial", size: 22, color: brandMid })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Navigate together, grow closer.", font: "Arial", size: 22, italics: true, color: brandMid })] }),
      new Paragraph({ children: [new PageBreak()] }),

      // 1. Executive Summary
      h1("1. Executive Summary"),
      body("Hey Otis is an AI-powered relationship wellness app that guides couples from conflict to repair through a structured 4-step process: Vent, Understand, Prepare, and Nurture."),
      body("Built on five evidence-based therapeutic frameworks (Gottman Method, Emotionally Focused Therapy, Non-Violent Communication, Internal Family Systems, and Cognitive Behavioural Couples Therapy), the app provides a private, accessible alternative to traditional couples therapy."),
      body("Target launch: Q3 2026. Revenue model: Freemium with premium tier at $9.99/month."),
      new Paragraph({ children: [new PageBreak()] }),

      // 2. Target Audience
      h1("2. Target Audience"),
      h2("Primary Persona: The Conscious Partner"),
      boldBullet("Age", "25\u201338"),
      boldBullet("Gender split", "65% women, 35% men"),
      boldBullet("Relationship status", "In committed relationships (2+ years)"),
      boldBullet("Household income", "$50K\u2013$120K"),
      boldBullet("Psychographics", "Self-improvement oriented, therapy-curious but barrier-averse. Follows relationship content on Instagram/TikTok. Reads Esther Perel, Bren\u00e9 Brown, The Gottman Institute."),
      boldBullet("Pain points", "Recurring arguments, feeling unheard, not knowing how to start difficult conversations. Couples therapy feels too expensive or too big a step."),

      h2("Secondary Persona: The Therapy Graduate"),
      boldBullet("Age", "28\u201345"),
      boldBullet("Background", "Previously in couples therapy, looking for a maintenance tool"),
      boldBullet("Values", "Evidence-based approaches, privacy, independence"),
      boldBullet("Willingness to pay", "Higher than primary \u2014 already invested in relationship health"),
      new Paragraph({ children: [new PageBreak()] }),

      // 3. Competitive Landscape
      h1("3. Competitive Landscape"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1800, 1400, 3280, 2880],
        rows: [
          new TableRow({ children: [headerCell("App", 1800), headerCell("Price", 1400), headerCell("Key Differentiator", 3280), headerCell("Weakness", 2880)] }),
          new TableRow({ children: [cell("Paired", 1800), cell("$12/mo", 1400), cell("Daily relationship quizzes", 3280), cell("Gamified, lacks depth", 2880)] }),
          new TableRow({ children: [cell("Lasting", 1800), cell("$12/mo", 1400), cell("Structured programs", 3280), cell("Rigid curriculum, no AI", 2880)] }),
          new TableRow({ children: [cell("Relish", 1800), cell("$16/mo", 1400), cell("Coach-led sessions", 3280), cell("Expensive, human-dependent", 2880)] }),
          new TableRow({ children: [cell("Hey Otis", 1800), cell("Free start", 1400), cell("AI-guided conflict repair, 4-step process, 5 frameworks", 3280), cell("New entrant, no brand recognition", 2880)] }),
        ]
      }),
      body(""),
      body("Hey Otis differentiator: The only app focused on real-time conflict repair. Not generic relationship quizzes \u2014 a guided, AI-powered journey from rupture to repair, grounded in five therapeutic frameworks."),
      new Paragraph({ children: [new PageBreak()] }),

      // 4. Go-to-Market Phases
      h1("4. Go-to-Market Phases"),
      h2("Phase 1: Pre-Launch (Weeks 1\u20136) \u2014 $2,000"),
      bullet("Landing page with email capture (heyotis.app) \u2014 already built"),
      bullet("Instagram content calendar (3x/week): relationship tips, Esther Perel quotes, psychology stats"),
      bullet("Waitlist goal: 1,000 email signups"),
      bullet("Beta testers: 50 couples recruited from Instagram DMs and Reddit r/relationships"),
      bullet("PR outreach to relationship bloggers and podcasters"),

      h2("Phase 2: Soft Launch (Weeks 7\u201312) \u2014 $5,000"),
      bullet("Launch to waitlist and beta testers"),
      bullet("App Store Optimization: keyword research for \u201Ccouples app\u201D, \u201Crelationship help\u201D, \u201Ccommunication app\u201D"),
      bullet("Instagram paid ads: $30/day targeting relationship-interested audiences"),
      bullet("Micro-influencer partnerships: 10 creators ($200\u2013$500 each)"),
      bullet("Collect testimonials and App Store ratings"),

      h2("Phase 3: Growth (Months 4\u20136) \u2014 $12,000"),
      bullet("Scale best-performing ads to $50\u2013$100/day"),
      bullet("Launch TikTok content strategy (short-form relationship scenarios)"),
      bullet("Partner with 2\u20133 couples therapists as brand ambassadors"),
      bullet("Content marketing: blog posts on heyotis.app for SEO"),
      bullet("Referral program: invite your partner, both get premium free"),

      h2("Phase 4: Expansion (Months 7\u201312) \u2014 $15,000"),
      bullet("Introduce premium tier ($9.99/mo): unlimited sessions, partner linking, advanced insights"),
      bullet("Expand to TikTok and Apple Search Ads"),
      bullet("Community building: private Instagram/Discord for users"),
      new Paragraph({ children: [new PageBreak()] }),

      // 5. Marketing Channels
      h1("5. Marketing Channels"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2200, 1000, 1400, 1800, 2960],
        rows: [
          new TableRow({ children: [headerCell("Channel", 2200), headerCell("Priority", 1000), headerCell("Est. CPI", 1400), headerCell("Monthly", 1800), headerCell("Notes", 2960)] }),
          new TableRow({ children: [cell("Instagram (Organic)", 2200), cell("HIGH", 1000), cell("Free", 1400), cell("$0", 1800), cell("3\u20135 posts/week, Reels, Stories", 2960)] }),
          new TableRow({ children: [cell("Instagram (Paid)", 2200), cell("HIGH", 1000), cell("$2.50\u2013$4", 1400), cell("$900\u2013$3K", 1800), cell("Carousel ads, video testimonials", 2960)] }),
          new TableRow({ children: [cell("TikTok (Organic)", 2200), cell("HIGH", 1000), cell("Free", 1400), cell("$0", 1800), cell("Relationship scenarios, tips", 2960)] }),
          new TableRow({ children: [cell("Micro-Influencers", 2200), cell("MED", 1000), cell("$1.50\u2013$3", 1400), cell("$1K\u2013$2.5K", 1800), cell("10\u201320 creators/month", 2960)] }),
          new TableRow({ children: [cell("ASO", 2200), cell("MED", 1000), cell("N/A", 1400), cell("$500", 1800), cell("Keywords, screenshots", 2960)] }),
          new TableRow({ children: [cell("Content/SEO", 2200), cell("MED", 1000), cell("N/A", 1400), cell("$0 (time)", 1800), cell("Blog posts, guides", 2960)] }),
          new TableRow({ children: [cell("Podcasts", 2200), cell("LOW", 1000), cell("$3\u2013$5", 1400), cell("$1K\u2013$2K", 1800), cell("Niche relationship pods", 2960)] }),
        ]
      }),
      new Paragraph({ children: [new PageBreak()] }),

      // 6. Budget Summary
      h1("6. Budget Summary (12 Months)"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [3800, 2780, 2780],
        rows: [
          new TableRow({ children: [headerCell("Category", 3800), headerCell("Monthly", 2780), headerCell("Annual", 2780)] }),
          new TableRow({ children: [cell("Instagram Ads", 3800), cell("$900\u2013$3,000", 2780), cell("$12,000\u2013$36,000", 2780)] }),
          new TableRow({ children: [cell("Influencer Marketing", 3800), cell("$1,000\u2013$2,500", 2780), cell("$12,000\u2013$30,000", 2780)] }),
          new TableRow({ children: [cell("Content Creation", 3800), cell("$500", 2780), cell("$6,000", 2780)] }),
          new TableRow({ children: [cell("ASO & Tools", 3800), cell("$200", 2780), cell("$2,400", 2780)] }),
          new TableRow({ children: [cell("Podcast Sponsorships", 3800), cell("$500", 2780), cell("$6,000", 2780)] }),
          new TableRow({ children: [cell("PR & Outreach", 3800), cell("$200", 2780), cell("$2,400", 2780)] }),
          new TableRow({ children: [
            new TableCell({ borders, width: { size: 3800, type: WidthType.DXA }, shading: { fill: headerBg, type: ShadingType.CLEAR }, margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "Total (Conservative)", bold: true, font: "Arial", size: 20 })] })] }),
            new TableCell({ borders, width: { size: 2780, type: WidthType.DXA }, shading: { fill: headerBg, type: ShadingType.CLEAR }, margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "$3,300/mo", bold: true, font: "Arial", size: 20 })] })] }),
            new TableCell({ borders, width: { size: 2780, type: WidthType.DXA }, shading: { fill: headerBg, type: ShadingType.CLEAR }, margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "$34,000/yr", bold: true, font: "Arial", size: 20 })] })] }),
          ] }),
          new TableRow({ children: [
            new TableCell({ borders, width: { size: 3800, type: WidthType.DXA }, shading: { fill: headerBg, type: ShadingType.CLEAR }, margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "Total (Aggressive)", bold: true, font: "Arial", size: 20 })] })] }),
            new TableCell({ borders, width: { size: 2780, type: WidthType.DXA }, shading: { fill: headerBg, type: ShadingType.CLEAR }, margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "$6,900/mo", bold: true, font: "Arial", size: 20 })] })] }),
            new TableCell({ borders, width: { size: 2780, type: WidthType.DXA }, shading: { fill: headerBg, type: ShadingType.CLEAR }, margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "$82,800/yr", bold: true, font: "Arial", size: 20 })] })] }),
          ] }),
        ]
      }),
      body(""),
      body("Recommended starting budget: $3,000\u2013$4,000/month"),
      new Paragraph({ children: [new PageBreak()] }),

      // 7. KPIs
      h1("7. Key Metrics & KPIs"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [3000, 2120, 2120, 2120],
        rows: [
          new TableRow({ children: [headerCell("Metric", 3000), headerCell("Month 1", 2120), headerCell("Month 6", 2120), headerCell("Month 12", 2120)] }),
          new TableRow({ children: [cell("Waitlist Signups", 3000), cell("500", 2120), cell("N/A", 2120), cell("N/A", 2120)] }),
          new TableRow({ children: [cell("Monthly Active Users", 3000), cell("200", 2120), cell("2,000", 2120), cell("10,000", 2120)] }),
          new TableRow({ children: [cell("App Downloads", 3000), cell("300", 2120), cell("3,000", 2120), cell("15,000", 2120)] }),
          new TableRow({ children: [cell("Instagram Followers", 3000), cell("1,000", 2120), cell("5,000", 2120), cell("15,000", 2120)] }),
          new TableRow({ children: [cell("Free \u2192 Paid Rate", 3000), cell("N/A", 2120), cell("5%", 2120), cell("8%", 2120)] }),
          new TableRow({ children: [cell("MRR", 3000), cell("$0", 2120), cell("$1,000", 2120), cell("$8,000", 2120)] }),
          new TableRow({ children: [cell("D30 Retention", 3000), cell("25%", 2120), cell("35%", 2120), cell("40%", 2120)] }),
        ]
      }),
      new Paragraph({ children: [new PageBreak()] }),

      // 8. Content Pillars
      h1("8. Content Pillars for Social Media"),
      body("Content ratio: 40% Educate | 25% Inspire | 20% Demonstrate | 10% Relate | 5% Trust"),
      body(""),
      boldBullet("EDUCATE (40%)", "Relationship stats, psychology insights, framework explainers. Example: \u201CDid you know 69% of relationship conflicts never fully resolve?\u201D"),
      boldBullet("INSPIRE (25%)", "Esther Perel quotes, affirmations, success stories. Example: \u201CYour next argument could be your next breakthrough.\u201D"),
      boldBullet("DEMONSTRATE (20%)", "App walkthroughs, before/after scenarios, feature spotlights showing the 4-step flow."),
      boldBullet("RELATE (10%)", "Memes, \u201Ctag your partner\u201D moments, relatable relationship scenarios that drive shares."),
      boldBullet("TRUST (5%)", "Therapist endorsements, framework explanations, privacy and security messaging."),
      new Paragraph({ children: [new PageBreak()] }),

      // 9. Risk Mitigation
      h1("9. Risk Mitigation"),
      boldBullet("Low initial downloads", "Double down on organic Instagram + influencer seeding before scaling paid."),
      boldBullet("Low retention", "Push notifications for session follow-ups, weekly insight emails, streak mechanics."),
      boldBullet("Privacy concerns", "Lead with \u201C100% private\u201D messaging in all creative. Transparent data policy on landing page."),
      boldBullet("Competitor response", "Lean into AI-powered real-time conflict repair as unique differentiator. No other app does this."),
      body(""),

      // 10. 90-Day Action Plan
      h1("10. 90-Day Action Plan"),
      boldBullet("Weeks 1\u20132", "Finalise landing page, set up analytics (Mixpanel/Amplitude), create Instagram account, design first 12 posts."),
      boldBullet("Weeks 3\u20134", "Begin posting 3x/week, start waitlist ads at $20/day, recruit 50 beta testers."),
      boldBullet("Weeks 5\u20136", "Beta test with couples, collect feedback, iterate on onboarding and session flow."),
      boldBullet("Weeks 7\u20138", "Soft launch on App Store, begin micro-influencer outreach (10 creators)."),
      boldBullet("Weeks 9\u201310", "Scale best-performing ads, launch partner referral program."),
      boldBullet("Weeks 11\u201312", "First press/podcast outreach, analyse Month 1 data, plan Month 2 optimisations."),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/Users/samanthaahhee/tether/marketing/Hey-Otis-GTM-Strategy.docx", buffer);
  console.log("GTM Strategy document created successfully!");
});
