export const ASSESSMENT_DETAIL: Record<string, Record<string, {
  label: string;
  emoji: string;
  subtitle: string;
  about: string[];
  inConflict: string;
  strengths: string[];
  growthEdges: string[];
  partnerNeedsToKnow: string;
  dailyPatterns: string[];
}>> = {

  attachment: {

    secure: {
      label: "Secure",
      emoji: "🌿",
      subtitle: "You trust that love is stable",
      about: [
        "Secure attachment develops when, early in life, the people who cared for you were consistently available — not perfect, but reliably present and responsive enough that you learned a fundamental truth: when I reach out, someone reaches back. That foundational experience became the quiet confidence you carry into every relationship you have as an adult.",
        "With a secure attachment style, you tend to feel comfortable with both closeness and independence. You can let someone in without losing yourself, and you can give a partner space without spiralling into fear. Intimacy doesn't feel like a trap, and distance doesn't feel like abandonment. This flexibility is the hallmark of security — not the absence of need, but a settled trust that needs can be expressed and met.",
        "It's worth saying clearly: secure attachment is not about being emotionally uncomplicated or never feeling anxious or hurt. Secure people get scared and sad and frustrated too. The difference is in recovery — you tend to bounce back from ruptures more readily, seek repair naturally, and hold onto the belief that the relationship can survive difficulty. That resilience is a gift, and understanding it helps you offer compassion to partners whose early experiences didn't gift them the same foundation."
      ],
      inConflict: "When conflict arises, you tend to stay relatively grounded. You can hold your own perspective and your partner's at the same time, which lets you argue without it feeling like the end of the world. You're usually able to say what you need without attacking, and to hear feedback without fully collapsing or shutting down. That said, even secure people can get activated when a conflict touches on something deep — a core fear, a long-held wound — and in those moments you may notice your usual steadiness wobble. The good news is that you naturally orient toward repair: you'd rather resolve it than win it.",
      strengths: [
        "Able to ask for what you need without excessive fear of rejection",
        "Can tolerate a partner's bad moods without taking them personally",
        "Natural capacity for repair — you reach back toward connection after conflict",
        "Comfortable with interdependence: close without losing yourself"
      ],
      growthEdges: [
        "Because conflict feels manageable to you, it can be easy to underestimate how destabilising it is for a less-secure partner",
        "Your steadiness can sometimes read as emotional unavailability or lack of passion to anxiously-attached partners",
        "Worth examining whether your 'security' occasionally shades into avoidance of difficult feelings you'd rather not sit with",
        "Growth edge: practise deeper curiosity about a partner's inner world, not just their behaviour"
      ],
      partnerNeedsToKnow: "I tend to feel grounded in relationships, but I genuinely care about understanding your experience — please tell me when something lands differently for you than it does for me.",
      dailyPatterns: [
        "When your partner is distant or quiet, you notice it but don't immediately assume something is wrong with you or the relationship",
        "After an argument, you often feel motivated to check in or offer a small gesture of connection relatively quickly",
        "You can spend time apart from your partner — a weekend trip, a long work week — without your sense of the relationship's solidity changing"
      ]
    },

    anxious: {
      label: "Anxious",
      emoji: "🌊",
      subtitle: "You love deeply and fear losing it",
      about: [
        "Anxious attachment takes root when early caregiving was inconsistent — warm and available sometimes, preoccupied or distant at others. When you couldn't predict whether reaching out would bring comfort or nothing, your nervous system learned to stay on high alert: scan for signs of disconnection, amplify distress signals to make sure they're heard, and don't relax until you feel certain the person is still there. That strategy made complete sense then. It travels with you now.",
        "In adult relationships, this shows up as a deep hunger for closeness alongside a near-constant fear that it won't last. You may find yourself hypervigilant to shifts in a partner's tone, mood, or availability — reading a slow text reply as potential rejection, or a quiet evening as evidence of growing distance. The irony is that the very pursuit of reassurance that feels most urgent is sometimes the thing that creates the distance you fear most. This is not a character flaw; it is a learned nervous-system pattern.",
        "Anxious attachment also carries extraordinary gifts that are easy to overlook when you're focused on the fear side. You are deeply attuned to other people's emotional states, capable of fierce loyalty and tenderness, and you invest in relationships with your whole heart. The work, over time, is learning to soothe your own nervous system enough that your love doesn't get hijacked by fear — and building the capacity to trust that connection can survive the ordinary gaps and silences of shared life."
      ],
      inConflict: "Conflict tends to feel high-stakes and urgent for you — almost an emergency. Your nervous system floods quickly, and in that flooded state you may escalate, push for resolution right now, or say more than you intended trying to break through the disconnection. Gottman's research identifies this as 'pursuing' — a bid for contact that, when it becomes too intense, can cause a partner to withdraw further, triggering an exhausting cycle. You may also notice that even after a conflict is 'resolved', you struggle to believe it truly is — you might return to it, seek more reassurance, or feel a residual anxiety that something is still wrong. What helps most is slowing down: taking a breath, naming what you feel, and asking for what you need rather than pursuing through escalation.",
      strengths: [
        "Deeply attuned to your partner's emotional states and needs",
        "Highly invested in the relationship — you show up with your whole heart",
        "Motivated to resolve conflict quickly, which can prevent issues from festering",
        "Your capacity for emotional depth creates real intimacy when trust is established"
      ],
      growthEdges: [
        "Learning to sit with uncertainty without immediately seeking reassurance — each moment of tolerating not-knowing builds trust in yourself",
        "Practising self-soothing: your nervous system needs tools that don't depend entirely on your partner's response",
        "Noticing when you're expressing a need versus pursuing through pressure, and choosing the former",
        "Building an identity and life outside the relationship so that closeness is something you add to fullness, not something you need to feel whole"
      ],
      partnerNeedsToKnow: "When I go quiet or seem clingy, I'm almost always feeling disconnected and scared — a small, genuine acknowledgement goes further for me than you might expect.",
      dailyPatterns: [
        "When a partner takes longer than usual to reply to a message, you notice a quick internal story forming — something must be wrong, or they're pulling away",
        "After a good evening together you feel lighter and more confident; after a night where your partner seemed distracted, you replay the evening looking for what it meant",
        "You often rehearse difficult conversations in your head before having them, trying to anticipate how to say things so they won't cause distance"
      ]
    },

    avoidant: {
      label: "Avoidant",
      emoji: "🪨",
      subtitle: "You value independence and find closeness complicated",
      about: [
        "Avoidant attachment typically develops when emotional needs were consistently met with dismissal, withdrawal, or overwhelm — when the message learned early was that needing people is inconvenient, or that depending on others leads to disappointment. The brilliant adaptation was to stop visibly needing: to turn down the volume on emotional experience, to build a strong self-sufficient identity, and to maintain emotional distance as a form of protection. That strategy served you well then. It costs something now.",
        "As an adult, you likely feel most comfortable when you have plenty of space — both literal and emotional. Intimacy can feel suffocating rather than nourishing, and a partner's emotional needs may feel overwhelming rather than connective. You may idealise freedom and independence, find yourself most drawn to someone when they're not quite available, and feel a reflexive urge to pull back whenever closeness increases. This isn't indifference — often there is deep feeling underneath — but the nervous system has learned that closeness is dangerous, and it acts accordingly.",
        "Avoidant attachment is frequently mischaracterised as cold or unloving, and that's simply not accurate. Many avoidantly-attached people have rich inner emotional lives; they've just learned to contain them privately rather than express them outwardly. The growth edge is learning to tolerate vulnerability in doses — discovering that depending on someone, or being depended on, doesn't have to mean losing yourself. Healing often involves noticing the moment you want to pull away and pausing there long enough to ask what you actually feel."
      ],
      inConflict: "In conflict, your instinct is to disengage — to shut down, change the subject, leave the room, or give such flat, minimal responses that communication effectively stops. Gottman calls this 'stonewalling', and while it often looks like not caring, it typically indicates that your nervous system has gone into a kind of protective lockdown. You may genuinely feel flooded, blank, or overwhelmed, and retreat feels like the only available option. The problem is that withdrawal, even as self-protection, sends a powerful message of abandonment to a partner who needs engagement. The most powerful shift available to you in conflict is learning to say 'I'm flooded — I need twenty minutes' rather than just disappearing.",
      strengths: [
        "Calm and non-reactive under ordinary pressure — you don't catastrophise easily",
        "Highly self-sufficient and capable of independent problem-solving",
        "You tend not to merge with a partner's emotional state, which can be stabilising",
        "Often thoughtful and measured when you do choose to engage emotionally"
      ],
      growthEdges: [
        "Practising staying present during emotionally charged moments rather than defaulting to withdrawal",
        "Learning to name feelings in real time — even simply 'I feel something but I'm not sure what' is a meaningful step",
        "Noticing the difference between healthy alone time and avoidance of intimacy, and being honest with yourself about which one is happening",
        "Allowing yourself to receive care without immediately reframing it as a burden or threat to autonomy"
      ],
      partnerNeedsToKnow: "When I go quiet or pull away, it's almost never about not caring — it's usually that I'm overwhelmed and don't yet have words for it.",
      dailyPatterns: [
        "After a particularly connected or vulnerable moment with your partner, you often notice an urge to create distance — a sudden need for a solo project, a long run, time with headphones in",
        "In arguments, you find yourself mentally constructing how to exit the conversation or shut it down rather than thinking about what you want to say",
        "You feel most relaxed and positive about the relationship when you've had a few hours to yourself — the 'missing' you feel then often surprises you with its warmth"
      ]
    },

    disorganised: {
      label: "Disorganised",
      emoji: "🌪️",
      subtitle: "You crave deep connection and fear it at the same time",
      about: [
        "Disorganised attachment — sometimes called fearful-avoidant — develops in the most difficult early circumstances: when the person who was supposed to be your safe haven was also a source of fear or unpredictability. When closeness brings both comfort and threat, the nervous system faces an impossible dilemma: approach or withdraw? Run toward or run away? Unable to do either consistently, it does both, and the result is a relational style that can look chaotic, contradictory, or intensely confusing — to others and to yourself.",
        "In adult relationships, this tends to show up as a powerful longing for deep intimacy alongside an equally powerful terror of it. You might oscillate between intense closeness and sudden withdrawal, between idealising a partner and feeling convinced they'll hurt or leave you. Trust is hard-won and easily shattered. You may have a heightened threat-detection system that picks up on every shift in tone or energy, and a history of relationships that have swung between wonderful and painful without much middle ground. None of this means you are broken — it means your nervous system learned a particular set of lessons about love.",
        "Of all the attachment styles, disorganised attachment is the one most associated with early trauma, and it deserves the most compassion — including from yourself. Healing is absolutely possible. It tends to require a combination of relational experiences that are consistently safe (often including therapy), body-based work that helps the nervous system learn to tolerate closeness, and patient, deliberate development of the ability to stay present when you most want to flee or collapse. Many people with disorganised attachment become extraordinarily empathic, self-aware partners once they have the support and tools to work with their nervous system rather than against it."
      ],
      inConflict: "Conflict can feel genuinely dangerous at a body level — not metaphorically, but somatically, as a threat response that hijacks your thinking brain. You may swing between flooding with intense emotion (fighting, accusing, pursuing) and collapsing into numbness or dissociation. It's not uncommon to say or do things during conflict that you later can't fully account for, or to shift positions so rapidly that your partner can't keep track. Repair is complicated because part of you wants it desperately while another part expects it to be a trap. The most stabilising thing you can do in conflict is name what's happening in your body — even just 'I'm getting scared' — and agree in advance with a partner that pauses are okay and not the same as abandonment.",
      strengths: [
        "Profound emotional depth and the capacity for intense, genuine connection when you feel safe",
        "Unusually developed empathy — you've learned to read emotional environments very carefully",
        "Strong drive toward self-understanding; many people with this style become deeply reflective over time",
        "Enormous resilience — you have already survived things that shaped you profoundly"
      ],
      growthEdges: [
        "Developing the ability to 'name and tame' nervous system activation — building a vocabulary for what's happening inside so you can communicate it rather than act from it",
        "Learning to tolerate the in-between space in a relationship: not euphoric, not terrible, just ordinary — and practising believing ordinary is safe",
        "Working with a therapist or somatic practitioner to process early experiences that may still be driving responses in present relationships",
        "Practising repair after ruptures rather than either catastrophising them or glossing over them too quickly"
      ],
      partnerNeedsToKnow: "I want closeness more than almost anything, and it also frightens me — your patience and consistency mean everything, even when my reactions make no sense in the moment.",
      dailyPatterns: [
        "You might have an amazing evening with your partner and then wake up at 3am convinced something is wrong with the relationship, unable to access the warmth you felt just hours before",
        "Small moments of perceived rejection — a distracted response, a tone that seemed off — can send you into an intense spiral that feels completely disproportionate but impossible to interrupt",
        "You sometimes push a partner away precisely when you want them closest, then feel confused and ashamed when they take the space you seemed to be asking for"
      ]
    }

  },

  love: {

    words: {
      label: "Words of Affirmation",
      emoji: "💬",
      subtitle: "You feel loved when you're told so, clearly and often",
      about: [
        "For people whose primary love language is words of affirmation, language is the most direct carrier of love. It's not that you need constant compliments or flowery declarations — what matters is that you hear clearly and specifically that you are seen, valued, and cherished. A thoughtful 'I noticed how hard you worked today' can mean more than an expensive gift. The right sentence at the right moment lands in your body as warmth.",
        "This love language is rooted in the human need for verbal attunement — to be mirrored back in language. When the people you love express appreciation, admiration, encouragement, and affection through words, it tells you that you matter to them and that they are paying attention. Conversely, criticism, harsh language, or long silences without verbal reassurance can feel disproportionately wounding, because the channel through which you most easily receive love is also the channel through which hurt travels most directly.",
        "People who don't share this love language sometimes struggle to understand why words matter so much — 'but I show you through what I do.' For you, actions carry meaning, but they don't translate automatically into the felt sense of being loved the way that words do. Understanding this isn't about being high-maintenance; it's about recognising the specific vocabulary your heart speaks most fluently."
      ],
      inConflict: "In conflict, words carry outsized weight for you. Criticism, contempt, or a dismissive tone can feel devastating — and can be hard to recover from even after the argument is technically over. The way something is said often matters as much as what is said. You may find yourself replaying specific phrases long after a fight, stuck on a particular sentence that stung. On the positive side, a genuine verbal acknowledgement — 'I understand why you're hurt' or 'I was wrong to say that' — can shift your emotional state dramatically and open the door to real repair.",
      strengths: [
        "Generous with verbal encouragement and appreciation toward others",
        "Highly articulate about emotional experience — you often find words where others don't",
        "Notice and remember kind things people say; you hold them as meaningful touchstones",
        "Your affirmations have genuine impact on others, even those who don't share this love language"
      ],
      growthEdges: [
        "Practising receiving love in non-verbal forms without dismissing them — a partner who shows up through action is expressing something real",
        "Noticing when you interpret absence of words as absence of love, and pausing to check whether that's actually true",
        "Becoming aware of when your hunger for verbal reassurance tips into seeking validation rather than genuine connection",
        "Communicating clearly to partners what kinds of words matter most — specificity helps people who don't share this language"
      ],
      partnerNeedsToKnow: "Telling me what you love or appreciate about me — specifically and often — is one of the fastest ways to help me feel safe and close to you.",
      dailyPatterns: [
        "You notice and are moved when your partner spontaneously says something kind or specific — 'you handled that so well' or 'I really love being around you' — in a way that stays with you for hours",
        "When a partner sends a short but warm text during the day, your mood lifts noticeably; radio silence has the opposite effect",
        "You are probably the person in the relationship who says 'I love you' most often, and who notices when it hasn't been said in a while"
      ]
    },

    acts: {
      label: "Acts of Service",
      emoji: "🛠️",
      subtitle: "You feel loved when someone lightens your load",
      about: [
        "Acts of service is the love language that says: love is a verb. For people who speak this language most fluently, nothing communicates care quite like someone noticing what needs to be done and doing it — without being asked, without being reminded, without making it a transaction. Whether it's making dinner after a hard day, handling an admin task you'd been dreading, or quietly refuelling the car, these actions say 'I see you, and I want to make your life a little easier.'",
        "This language is deeply rooted in attentiveness. When a partner acts in service of you, they are demonstrating that they've been paying attention — they know what's on your plate, what drains you, what you need. That attunement is what makes the act feel loving rather than merely functional. It's not the task itself; it's the message it carries. Conversely, when you feel like you're managing everything alone, or that a partner could see your struggle and didn't move to help, that can register as a profound form of being unloved.",
        "People who love through acts of service are often extraordinarily giving — sometimes so giving that they become depleted, or resentful when reciprocation doesn't come in kind. Understanding your love language helps you make explicit requests rather than waiting for a partner to intuit your needs, and helps you appreciate the ways others show up even when it doesn't match the specific form you find most nourishing."
      ],
      inConflict: "In conflict, you may feel most hurt by what wasn't done — the task left undone despite knowing it mattered to you, the promise that wasn't followed through. You can carry a particular kind of resentment that builds slowly from accumulated unmet expectations, and it can be hard to articulate because it's about a pattern rather than a single event. You may also notice that during or after a conflict, a partner offering a small act of care — making tea, handling something without being asked — is one of the most effective repair gestures available, even before any words are exchanged.",
      strengths: [
        "Highly attentive to the practical needs of people you love — you are often the one who just handles things",
        "Your love is tangible and visible; partners rarely have to wonder whether you care",
        "Natural capacity for reliability and follow-through in relationships",
        "You express care even when emotions are hard to verbalise — you show up through action"
      ],
      growthEdges: [
        "Practising asking for what you need rather than hoping a partner will notice — most people genuinely miss things they haven't been told matter",
        "Watching for the pattern of over-giving and then withdrawing when reciprocity doesn't come; the gap between what you give and what you ask for is worth examining",
        "Learning to receive care that doesn't look like acts of service — a verbal 'I love you' or physical affection is real love in a different form",
        "Noticing when 'doing for others' is also a way to feel in control or avoid emotional vulnerability"
      ],
      partnerNeedsToKnow: "When you notice what I need and just do something about it — without me having to ask — that lands as love more powerfully than almost anything else.",
      dailyPatterns: [
        "You often handle things for your partner quietly and don't necessarily mention it — and you notice when those things go unremarked",
        "When you're overwhelmed, you feel the absence of practical support acutely — you want a partner to see it and step in, not just offer sympathy",
        "You feel most cared for on the days when your partner has silently managed something you'd been putting off or dreading"
      ]
    },

    touch: {
      label: "Physical Touch",
      emoji: "🤝",
      subtitle: "You feel loved through physical presence and contact",
      about: [
        "Physical touch as a love language is rooted in one of the most ancient channels of human communication: the body. Long before we had language, we communicated safety, belonging, and care through contact — a hand held, a shoulder squeezed, a body leaned against. For people whose primary love language is physical touch, this channel remains the most direct path to feeling loved. It doesn't have to be sexual; it's often the casual, daily physical contact that matters most.",
        "Polyvagal theory helps explain why touch is so regulating: safe, consensual physical contact activates the ventral vagal system — the part of the nervous system associated with social connection and calm. A hand on your back at a stressful moment, a hug that lasts a little longer, lying side by side — these are not just nice gestures; they're physiological signals of safety. When you go without physical affection for a period of time, you may notice yourself feeling disconnected, restless, or vaguely sad in a way that's hard to articulate.",
        "People who don't share this language sometimes find the level of touch you want overwhelming or distracting — and that can leave you feeling rejected even when it isn't personal. Being able to name this love language to a partner, and being curious about theirs, opens space for negotiating affection in a way that genuinely works for both of you rather than leaving you silently depleted."
      ],
      inConflict: "In conflict, the absence of physical connection is especially painful for you — arguments that involve withdrawal of touch, or a partner who goes cold physically during a disagreement, can feel like a withdrawal of love itself. On the other hand, a moment of physical connection during or after conflict — a hand held briefly, a hug after a hard conversation — can do more to signal safety and repair than a lengthy verbal negotiation. You may find that you can process difficult feelings much more easily when there is some physical proximity and contact maintained.",
      strengths: [
        "Naturally warm and physically present — others often feel soothed and welcomed around you",
        "Attuned to physical signals of connection and disconnection, which makes you responsive to a partner's emotional state",
        "Your affection is direct and often deeply comforting to those who receive it",
        "Embodied and present — you tend to experience connection as a full-body phenomenon"
      ],
      growthEdges: [
        "Communicating explicitly that physical affection is a need, not just a preference — partners who don't share this language won't intuit how much it matters",
        "Developing other channels for feeling connected when physical touch isn't available — distance, illness, or a partner's stress can create gaps",
        "Distinguishing between physical touch as comfort-seeking and physical touch as genuine connection — they're related but not the same",
        "Practising patience with partners who need more space or have different physical boundaries, without interpreting that as rejection"
      ],
      partnerNeedsToKnow: "Physical closeness — even small gestures like a hand on my arm or sitting near me — tells my nervous system that we're okay in a way words alone can't quite replicate.",
      dailyPatterns: [
        "You feel noticeably better after a proper hug — not a quick pat, but a real one — and the difference between having that and not having it in a day is measurable",
        "During a difficult conversation, you instinctively reach for physical contact — your hand moves toward your partner even mid-argument",
        "When your partner is distracted or stressed and physical affection goes missing for a few days, you start to feel a quiet but growing sense of disconnection even if everything else seems fine"
      ]
    },

    time: {
      label: "Quality Time",
      emoji: "⏳",
      subtitle: "You feel loved when someone is fully present with you",
      about: [
        "For people whose primary love language is quality time, presence is the point. Not just being in the same room — real presence, where attention is undivided and the interaction has a quality of genuine engagement. It could be a long walk with no agenda, a dinner where phones stay away, or an evening of watching something together with full attention. What matters is that someone chose to be here, with you, fully.",
        "This love language speaks to something fundamental: the human need to feel like we matter enough to be prioritised. When someone gives you their real attention — not the multitasking kind, but the kind where you can feel that you are the most important thing in this moment — it says 'you are worth showing up for completely.' Conversely, when someone is physically present but mentally elsewhere, or when time together keeps getting deprioritised for other things, that can register as a quiet but persistent form of neglect.",
        "In modern life, full presence is increasingly rare and increasingly precious. Notifications, work spillover, and the general busyness of adult life conspire against it. If quality time is your love language, you may find that you need to be more explicit than feels natural about what you actually want — not just time, but the quality of it — because a partner may genuinely believe they're showing up while their attention is scattered."
      ],
      inConflict: "In conflict, you may feel most wounded by the sense that a partner is never really available — that you're always competing with something else, or that you have to fight for a sliver of real attention. Arguments that happen in passing, or that get cut short before resolution, can feel especially unsatisfying. What helps you most in conflict is the sense that a partner is genuinely setting aside time to understand you — not rushing through the conversation to get back to something else, not half-listening, but actually here. That felt sense of being prioritised can change the entire texture of a difficult conversation.",
      strengths: [
        "Genuinely present with people you love — your attention is a gift you give freely",
        "Good at creating meaningful shared experiences that become relational touchstones",
        "You invest in understanding your partner deeply because you actually listen",
        "Relationships feel nourishing to you; you bring intention and engagement to shared time"
      ],
      growthEdges: [
        "Communicating the difference between 'time together' and 'quality time' — not all time counts equally for you, and that's worth explaining",
        "Practising feeling secure when a partner has less capacity for undivided time — busyness isn't always deprioritisation",
        "Noticing if the hunger for quality time sometimes tips into monitoring a partner's attention in a way that creates pressure",
        "Developing capacity to feel connected through shorter, less 'ideal' interactions rather than always needing the full conditions"
      ],
      partnerNeedsToKnow: "Being with you without distractions — even for half an hour where you're genuinely present — fills me up in a way that hours of half-there time can't.",
      dailyPatterns: [
        "You feel most connected to your partner after a conversation where you both actually talked and listened — not caught up on logistics, but genuinely shared something",
        "When your partner reaches for their phone during a meal you were looking forward to, you notice a quiet deflation that's hard to shake",
        "You often suggest activities to do together not because you need to be entertained but because shared experience is how you feel close — the being-together is the point"
      ]
    },

    gifts: {
      label: "Thoughtful Gifts",
      emoji: "🎁",
      subtitle: "You feel loved when someone remembers and surprises you",
      about: [
        "Receiving gifts as a love language is often misunderstood as materialism, and that misunderstanding does a disservice to what it's actually about. For people who speak this language, a gift is not about the object or its cost — it is evidence of thought, attention, and intentionality. The message a well-chosen gift carries is: 'I was thinking about you when you weren't here. I noticed something that reminded me of you. I wanted to mark this moment.' That is a profound expression of love.",
        "What makes a gift feel loving is its specificity — the sense that it was chosen for you, not just grabbed. A small, inexpensive thing that demonstrates someone paid attention to who you are will outperform a large, generic gesture every time. It might be a book left on your pillow by the author you mentioned once, a snack you'd said you'd been craving, a photograph printed and framed. The common thread is attentiveness: someone was listening, remembering, and choosing.",
        "People who don't share this love language sometimes dismiss it as shallow, but there is something genuinely beautiful about the way gifts-oriented people turn everyday moments into opportunities for creative expression of love. The growth edge, often, is learning to experience the love that comes in other forms — the acts, the words, the presence — and to tell a partner specifically what kinds of gestures land best, rather than hoping they'll guess."
      ],
      inConflict: "In conflict, you may feel the absence of thoughtful gestures acutely — the sense that a partner has stopped paying attention, stopped making small bids of care. You may also find that a thoughtful, unexpected gesture during or after a difficult period is one of the most powerful repair signals available to you — not because you can be 'bought off', but because the gesture communicates that a partner is still thinking of you, still wanting to make you feel good, still invested in your happiness. A partner who gives you something specific during a hard stretch is saying: 'I see you and I haven't stopped caring.'",
      strengths: [
        "Excellent at remembering the details of what people love and using that knowledge to express care",
        "Gifts you give tend to be thoughtful and specific — people feel genuinely seen by them",
        "You mark milestones and meaningful moments, which creates a shared history of acknowledged occasions",
        "Your attentiveness extends beyond gifts — you're generally someone who notices and remembers things about people you love"
      ],
      growthEdges: [
        "Communicating explicitly that thoughtful gifts matter to you — without this, a partner who doesn't share the language may not understand why a missed occasion feels like a missed message",
        "Separating the value of the gesture from the value of the relationship — a partner who forgets an anniversary is not necessarily telling you you don't matter",
        "Practising receiving and appreciating love that comes in non-tangible forms, especially from partners who express care through time, words, or actions",
        "Noticing if gift-giving sometimes functions as a way to show love without the vulnerability of verbal or physical intimacy"
      ],
      partnerNeedsToKnow: "It doesn't have to be big or expensive — what moves me is knowing you were thinking of me when we weren't together.",
      dailyPatterns: [
        "You feel a quiet joy when you spot something — a small book, an odd little snack, a card — that makes you think 'that's so them', and you want to get it",
        "When a partner remembers something specific you mentioned and acts on it, even weeks later, it stays with you as evidence of love",
        "You notice and feel deflated when occasions that feel meaningful to you — anniversaries, milestones, ordinary victories — pass without acknowledgement"
      ]
    }

  },

  conflict: {

    criticise: {
      label: "Direct / Critical",
      emoji: "⚡",
      subtitle: "You name problems directly — sometimes more sharply than you intend",
      about: [
        "A direct or critical conflict style typically emerges from a belief that problems should be named and addressed rather than glossed over. There's something admirable underneath it: a commitment to honesty, a refusal to let resentment fester, a desire to actually solve things rather than paper over them. People with this style are rarely conflict-avoiders — if anything, they move toward problems rather than away from them, which takes a particular kind of courage.",
        "The shadow side, as Gottman's research extensively documents, is the shift from criticising a behaviour to criticising a person. 'You forgot the shopping again' is a complaint about a specific action; 'you always forget, you never think about what I need' is a global attack on character. When criticism moves into the second territory, it triggers shame and defensiveness in the other person and rapidly erodes the sense of safety that makes real repair possible. The intention might be to solve a problem, but the delivery creates a new one.",
        "It's worth understanding where the sharpness comes from. For many people with a critical style, it's rooted in a deep fear of being ignored or dismissed — the criticism escalates because the underlying fear is: 'if I don't make this loud, nothing will change.' Underneath the criticism, there is usually a need and a longing. Learning to lead with that — 'I feel hurt when..., and what I need is...' — is the practice that transforms this style from abrasive into genuinely powerful."
      ],
      inConflict: "During arguments, you tend to move quickly toward the problem and name it directly — sometimes more directly and forcefully than you intended. You may notice that once you're activated, your language sharpens and widens: specific complaints become patterns, patterns become character judgements. Partners often feel attacked or overwhelmed by the speed and intensity of this, and may shut down or respond defensively rather than engage with the actual concern. The frustration of not being heard can then make you go louder, creating an escalation cycle. The most impactful thing you can practise is pausing before you speak when activated and asking: 'Am I about to criticise an action, or attack a person?'",
      strengths: [
        "Problems get named and addressed rather than silently accumulating",
        "Your directness means partners know where they stand — you don't do confusing silence",
        "High commitment to resolving issues rather than sweeping them under the rug",
        "Your honesty, channelled well, creates relationships where real things can be said"
      ],
      growthEdges: [
        "Practising the difference between complaint ('this specific thing hurt me') and criticism ('you are the kind of person who...') — this is the most important distinction available to you",
        "Learning to slow down before conflict, especially when flooded — the first version of what comes out when you're activated is rarely the most accurate version",
        "Developing curiosity about a partner's perspective before launching into yours — it changes the whole dynamic",
        "Noticing what fear or need is underneath the criticism, and naming that instead"
      ],
      partnerNeedsToKnow: "When I go sharp, I'm usually scared or hurt underneath it — I'm working on leading with that instead of the edge.",
      dailyPatterns: [
        "When something bothers you, you address it quickly — sometimes within minutes — which means you're often bringing up a concern before your partner has even registered there was an issue",
        "In an argument, you notice your language widening: 'you did this' becomes 'you always do this' becomes 'you never think about me' — and the escalation surprises even you sometimes",
        "After a conflict, you often feel relief — you said what needed to be said. The confusion comes when your partner seems more hurt than relieved by the same conversation."
      ]
    },

    defensive: {
      label: "Self-Protective",
      emoji: "🛡️",
      subtitle: "You protect yourself quickly when you feel blamed",
      about: [
        "Defensiveness is one of the most universally human responses to perceived criticism — when we feel attacked, the nervous system moves to protect. Biologically, it makes perfect sense. Interpersonally, it tends to get in the way. People who identify strongly with a defensive conflict style have usually developed a very quick, very sensitive threat-detection system: at the first hint of blame or criticism, a counterargument rises. The most important thing to understand about defensiveness is that it almost always feels like self-defence from the inside, but looks like counter-attack from the outside.",
        "Gottman identifies defensiveness as one of his 'four horsemen' — conflict patterns that predict relationship deterioration — not because the person is doing something villainous, but because it derails the conversation. When someone shares a concern and is met with 'actually, here's why that's your fault', the original concern goes unheard. The person who raised it feels dismissed. They escalate. The defensive partner escalates in response. The issue never gets resolved — it just accrues.",
        "The shift that changes everything with this style is learning to absorb a small amount of perceived criticism without immediately deflecting it. That requires building a certain confidence in your own worth that doesn't depend on being perfect or always right. When you can hear a concern as information rather than as a verdict on your character, defensiveness loses its urgency. You can listen, acknowledge what's true, and then share your own perspective — in that order."
      ],
      inConflict: "When a conflict begins, your attention immediately goes to protecting yourself from the incoming criticism — mounting counter-evidence, identifying the ways in which the other person is equally or more at fault, or explaining why what you did was justified. From the inside, this feels fair; from the outside, it looks like you're not listening and don't care about the impact of your actions. What your partner needs to see is some acknowledgement that what they're saying landed — even just 'I hear that' or 'that makes sense' — before you bring in your own perspective. That small step of acknowledgement can completely change where a conversation goes.",
      strengths: [
        "Good at self-advocacy — you don't stay silent when something feels unfair",
        "Usually clear on your own perspective and able to articulate it",
        "Not likely to absorb blame that genuinely isn't yours — there's an appropriate self-protectiveness here",
        "Often very aware of the dynamics of fairness in relationships"
      ],
      growthEdges: [
        "Practising the 'acknowledgement before self-defence' principle — hearing and naming a partner's concern before presenting your own",
        "Distinguishing between criticism of a behaviour and attacks on your character — the former deserves a response; the latter needs a different kind of engagement",
        "Noticing the physical feeling of defensiveness rising — that's the moment to pause, breathe, and slow down before responding",
        "Sitting with the discomfort of being partially responsible for something, rather than needing to establish complete innocence to feel okay"
      ],
      partnerNeedsToKnow: "When you bring a concern to me, try to be specific about one thing at a time — the more it sounds like a global verdict, the harder it is for me to hear you, even when I genuinely want to.",
      dailyPatterns: [
        "When your partner says something that sounds like criticism — even mildly — you notice a quick internal gathering of evidence about why they're wrong or equally at fault",
        "In conflict, you often feel that your partner is failing to acknowledge what you do right, and your defence includes listing those things",
        "After an argument where you later recognise your defensiveness, you sometimes feel genuine remorse — you wanted to be heard but ended up preventing the same for your partner"
      ]
    },

    stonewall: {
      label: "Inward Processor",
      emoji: "🧊",
      subtitle: "You go quiet when overwhelmed — but you're still there",
      about: [
        "Stonewalling — shutting down, going quiet, becoming a wall of non-response during conflict — looks from the outside like indifference or contempt. From the inside, it almost always feels like the opposite: an overwhelm so complete that there are no words available, or a protective withdrawal that feels like the only way to prevent things from getting worse. For people with this conflict pattern, emotional flooding is very real and very physiologically intense. Heart rate climbs, thoughts race or go blank, and the capacity to engage meaningfully simply isn't available.",
        "This pattern often has roots in environments where expressing emotion wasn't safe, or where withdrawal was the least-bad option in an escalating situation. For some people, stonewalling developed as a way to not make things worse; for others, it was a response to emotional overwhelm that nobody taught them to navigate differently. Either way, it is a learned behaviour, and it can be unlearned — not by forcing yourself to engage when flooded, but by developing the skills to recognise flooding early, call a genuine break, and return to the conversation once your nervous system has come back into a regulated state.",
        "The crucial distinction Gottman's research makes is between a genuine time-out — clearly communicating 'I need to pause, I'll come back in twenty minutes' — and stonewalling, which involves going silent without explanation and leaving a partner to manage both the unresolved conflict and the terror of not knowing what's happening. The first is self-regulation. The second is, however inadvertently, a form of emotional abandonment."
      ],
      inConflict: "During conflict, you typically hit a wall — a point at which you go silent, your face flattens, your responses become monosyllabic or stop entirely. Your partner often reads this as contempt or not caring, when the truth is usually that you are overwhelmed, flooded, or genuinely don't know what to say. The longer the silence goes on, the more anxious or escalated a partner may become, which floods you further. The most transformative single habit you can develop is learning to name the wall before it goes up: 'I'm getting overwhelmed — I need fifteen minutes. I'm coming back.' That simple sentence contains a world of difference.",
      strengths: [
        "Tend not to say things in conflict you'll seriously regret — your silence prevents escalation of words",
        "Often reflective and thoughtful processors who arrive at genuine insight given enough time",
        "Not likely to steamroll a partner with words or escalate to verbal aggression",
        "Your presence, when you do speak, tends to carry weight because it's deliberate"
      ],
      growthEdges: [
        "Developing the practice of named time-outs — communicating that you're pausing, and following through on coming back",
        "Building body awareness so you can recognise flooding earlier, before you've completely shut down",
        "Learning that returning to the conversation is as important as taking the break — the break is incomplete without the return",
        "Practising partial engagement — 'I don't have words yet but I'm still here, I'm still listening' — so partners don't feel abandoned"
      ],
      partnerNeedsToKnow: "When I go quiet, I'm not punishing you or checking out — I'm overwhelmed. Tell me it's okay to take a break and I'll come back to the conversation, I promise.",
      dailyPatterns: [
        "In a heated conversation, there's a moment where you feel yourself go inside — almost like a visor coming down — and after that point the words just don't come",
        "After arguments where you went quiet, you often process it extensively in your own head — arriving at clarity, understanding, even things you want to say — but that inner work is invisible to your partner",
        "You find it genuinely easier to send a thoughtful text or letter after a difficult conversation than to have the conversation in real time — the asynchronous format feels much safer"
      ]
    },

    peacekeep: {
      label: "Peace-Keeper",
      emoji: "🕊️",
      subtitle: "You keep the peace — sometimes at the cost of your own needs",
      about: [
        "Peace-keeping as a conflict style is rooted in an orientation toward harmony — a genuine wish for things to be okay, for everyone to feel comfortable, for the relationship to be preserved. There is a real generosity in this. Peace-keepers are often extraordinarily good at de-escalating tension, seeing multiple perspectives, and ensuring that no one leaves a conversation feeling decimated. These are genuine skills, and relationships with a peace-keeper can feel spacious and safe in important ways.",
        "The shadow side of peace-keeping is the accumulation it enables. When your own needs, hurts, and boundaries are consistently softened or silenced in service of keeping the peace, two things happen: your unexpressed needs don't disappear — they go underground, building quietly into resentment. And your partner loses access to the true state of the relationship, because the feedback they're getting is 'everything's fine' when it isn't. This dynamic, over time, can create an implosion: a sudden, enormous argument that seems to come from nowhere but is actually the deferred product of years of accumulated unsaid things.",
        "Peace-keeping often develops in environments where conflict felt dangerous — where arguments led to genuine emotional, relational, or sometimes physical harm, and where smoothing things over was a survival strategy. Understanding that history with compassion is important. So is recognising that in your current relationships, you have more choices available than the strategy that kept you safe then. The key question to practise asking yourself is: 'What would I say if I trusted that the relationship could survive my honesty?'"
      ],
      inConflict: "In conflict, you tend to accommodate, apologise, or smooth things over before the real substance of what's happening has been expressed or addressed. You may find yourself saying sorry before you even know what you're sorry for, or finding ways to frame things that minimise your own hurt in order to reduce the other person's discomfort. This often ends the surface-level conflict quickly but leaves the underlying issue unresolved and something unsaid inside you. Over time, these accumulated unsaid things can come out as passive withdrawal, resentment, or a sudden and seemingly disproportionate explosion.",
      strengths: [
        "Natural ability to de-escalate tension and hold space for multiple perspectives",
        "Rarely causes direct harm through sharp words or escalating conflict",
        "Often very good at genuine empathy — you can see and feel a partner's side",
        "Brings warmth and safety to the relational space; people tend to feel comfortable around you"
      ],
      growthEdges: [
        "Practising speaking your actual experience before defaulting to accommodation — even one honest sentence before the deflection",
        "Distinguishing between genuine repair and conflict-avoidance; peace that preserves your own hurt isn't really peace",
        "Building tolerance for the discomfort of someone else's momentary displeasure — their upset doesn't mean the relationship is over",
        "Recognising that your needs and honesty are not threats to the relationship; they are necessary parts of a real one"
      ],
      partnerNeedsToKnow: "I sometimes say 'it's fine' before I've checked whether it actually is — please ask me twice, because the second answer is usually the real one.",
      dailyPatterns: [
        "When you sense tension brewing, you feel a strong pull to do something to prevent it — change the subject, make a joke, offer something — before the conflict can actually surface",
        "After arguments where you gave in or apologised just to end it, you sometimes feel a residue of something unresolved that you can't quite name",
        "Your friends or partner may comment that you're 'so easy-going', and part of you knows that isn't the full picture — you have opinions and needs, they're just not always audible"
      ]
    }

  },

  window: {

    hyper: {
      label: "Hyperarousal",
      emoji: "🌋",
      subtitle: "Your system floods quickly — intensity is your signal to slow down",
      about: [
        "Hyperarousal refers to the state where your nervous system shifts into a high-activation, high-alert mode — what we might recognise as fight-or-flight. Heart rate climbs, thoughts speed up or become narrow and focused on threat, muscles tense, breathing shallows. In this state, the rational, reflective part of your brain becomes much less accessible and the reactive, survival-oriented part takes over. For people who experience hyperarousal frequently or intensely, emotional situations can quickly feel physically overwhelming.",
        "Polyvagal theory, developed by Stephen Porges, helps us understand this as a function of the autonomic nervous system doing exactly what it evolved to do — mobilising energy to respond to perceived danger. The problem is that in relational or emotional conflict, the 'danger' is usually not physical, but the body doesn't know that. A raised voice, a critical tone, a perceived rejection can trigger the same cascade of activation as an actual threat. When you're in hyperarousal, you're running on older brain circuitry that isn't particularly interested in nuance, empathy, or problem-solving.",
        "Understanding your window of tolerance — the zone in which you can think, feel, and relate effectively — is foundational for relational wellbeing. When you're in hyperarousal, you've gone above that window. The skills that help are not about suppressing the activation but about recognising it earlier, giving it somewhere to go (breath, movement, cold water on the face), and returning to the window before attempting to engage with difficult material."
      ],
      inConflict: "Conflict tends to activate you quickly — within a short period of tension, you may notice your heart racing, your voice rising, your thoughts moving fast and narrowing onto the point of injury. In this state, you may say things you later regret, or push in ways that overwhelm a partner. The activation itself is not the problem; what you do with it is. The most powerful practice available to you is learning your personal early warning signs — the physical signals that precede full flooding — so you can intervene before you're too activated to choose your response rather than react from it.",
      strengths: [
        "High emotional responsiveness — you feel things deeply and that is not a flaw",
        "When you're not flooded, you bring intensity and presence to relationships",
        "Strong motivation to address and resolve things — you don't let things fester passively",
        "Your activation can signal to others that something genuinely matters to you"
      ],
      growthEdges: [
        "Developing a personal map of your physiological early warning signs — what does activation feel like in your body just before it tips into flooding?",
        "Building a regulated pause practice: one or two breaths, a step outside, cold water — something that interrupts the cascade before it goes full",
        "Learning to differentiate between 'I feel strongly about this' and 'I am too flooded to engage with this productively right now'",
        "Working with a therapist or somatic practitioner if flooding is frequent — there may be earlier experiences contributing to your nervous system's sensitivity"
      ],
      partnerNeedsToKnow: "When I escalate, it's my body in alarm, not just my feelings — I'm not trying to overwhelm you. A calm, grounded response from you helps more than matching my energy.",
      dailyPatterns: [
        "You notice that even mild conflict — a slightly sharp tone, a misunderstanding — can suddenly have your heart racing and your thoughts racing to keep up",
        "After an intense conversation, it can take you a while to come down — you might find yourself still activated hours later, replaying and refining",
        "Physical movement — a walk, a run, anything that uses the activated energy — is one of the fastest ways back to yourself after an emotionally intense moment"
      ]
    },

    hypo: {
      label: "Hypoarousal",
      emoji: "🌫️",
      subtitle: "Your system goes quiet when overwhelmed — you need gentle re-entry",
      about: [
        "Hypoarousal is the other side of the window of tolerance: rather than flooding with activation, the nervous system drops below the window into a kind of shutdown. This can show up as going blank, feeling numb, losing access to words or thoughts, becoming physically still, dissociating slightly, or feeling a heaviness that makes engagement seem impossible. From the outside it can look like not caring, being checked out, or stonewalling — but from the inside it's usually an experience of having simply gone somewhere inaccessible.",
        "In polyvagal terms, this is the dorsal vagal response — the most ancient and primitive of the nervous system's survival strategies. When a situation feels overwhelming and escape or fighting aren't possible, the system conserves energy by going offline. It is an involuntary protective response, not a choice. Understanding this is important for people who experience it — it can generate a lot of shame, especially in relational contexts where a partner is trying to connect and you have simply... gone.",
        "Hypoarousal is particularly common in people who have histories of experiences where expressing emotional distress didn't lead to relief, or where the overwhelm was so sustained that the body eventually found it more efficient to stop responding. Healing involves learning to recognise the early signs of descent — before full shutdown — and finding gentle, slow ways to return: small movements, soft stimulation, a calm voice, an anchor to the present moment."
      ],
      inConflict: "In conflict, you may reach a point where you simply can't engage — not because you don't care, but because your system has shut down. Words become inaccessible, thoughts become foggy, and you go flat. A partner may push harder, trying to get a response, which can send you deeper into shutdown. What helps you is not pressure but gentleness: a slower pace, a quieter tone, being given physical and emotional space to re-surface. Agreeing in advance with a partner on a code word or signal that means 'I'm shutting down, not checking out — give me a moment' can prevent a great deal of distress for both of you.",
      strengths: [
        "Rarely if ever says things in conflict that cause lasting harm — the shutdown prevents escalation",
        "Often deeply empathic and sensitive; the same system that shuts down when overwhelmed also feels others' experiences very deeply",
        "Tends toward reflection and deep processing, even if it happens internally and asynchronously",
        "Your calm presence in ordinary life can be genuinely stabilising for others"
      ],
      growthEdges: [
        "Learning to recognise the early signs of going toward shutdown — a certain heaviness, a blurring of thought — so you can signal to a partner before you've gone fully offline",
        "Developing gentle re-entry practices: slow movement, breath, grounding into the body through sensation",
        "Communicating your shutdown experience to a partner who may interpret it as rejection or indifference",
        "Working with a trauma-informed therapist if shutdown is frequent, as it may have roots that benefit from professional support"
      ],
      partnerNeedsToKnow: "When I go blank or quiet, I'm not shutting you out on purpose — my system has gone offline. Soft, gentle contact and no pressure helps me come back.",
      dailyPatterns: [
        "In high-stress situations — a difficult conversation, a crowded place, an overwhelming day — you sometimes notice yourself becoming quiet and distant in a way that's hard to interrupt from the inside",
        "You sometimes come back to yourself after a conversation and realise you have little memory of what was said or how you responded — you were present in body but absent in some important way",
        "Very loud noise, harsh light, emotional intensity, or fast-moving situations can push you toward shutdown even when the situation isn't interpersonally threatening"
      ]
    },

    mixed: {
      label: "Mixed",
      emoji: "🎢",
      subtitle: "Your response depends on the situation — you read the room carefully",
      about: [
        "Some people don't have a single, consistent pattern of nervous system response — instead, they experience hyperarousal in some contexts and hypoarousal in others, or can move between states within a single interaction. This is called a mixed window of tolerance, and it can feel confusing both to experience and to explain to a partner. Why did this conversation send you into shutdown while a similar one last week had you escalating? The answer usually lies in the specific emotional content, the relational dynamic, or the broader context — your nervous system is reading signals that may not be obvious on the surface.",
        "Mixed responses often reflect the complexity of individual history: you may have learned to fight in some situations and freeze in others, depending on which strategy worked, or which threat felt more manageable. Some people flip into activation under perceived abandonment cues and into shutdown under perceived criticism cues, or vice versa. The patterning is individual, and understanding your own particular triggers and responses is some of the most valuable self-knowledge you can develop.",
        "From a polyvagal perspective, having a mixed window isn't a sign of instability — it's a sign of a nervous system that is responding to a complex world with a range of strategies. The goal is not to eliminate the variation but to develop enough awareness that you can recognise which state you're in, communicate it, and access skills that help you work within your window rather than beyond it."
      ],
      inConflict: "Conflict can go different ways for you depending on what's being activated. Sometimes you flood — heart racing, words coming fast, intensity rising. Sometimes you shut down — going flat, losing access to language, becoming unreachable. Your partner may find this hard to track and may not know whether to give you space or engage more. The most useful thing you can offer is real-time narration: 'I'm getting activated' or 'I'm going inside' — both give a partner information to work with rather than leaving them guessing at what's happening and how to respond.",
      strengths: [
        "Adaptable — you have multiple responses available rather than only one gear",
        "Often highly empathic and sensitive because your system reads emotional environments carefully",
        "Self-knowledge, once developed, tends to be nuanced and specific rather than generic",
        "Capacity to understand both hyperaroused and hypoaroused partners in a way that people with only one pattern sometimes can't"
      ],
      growthEdges: [
        "Developing a personal map of your triggers — which situations or emotional qualities send you toward activation, and which toward shutdown?",
        "Learning to name your current state in real time, especially during conflict, so a partner can adjust their approach",
        "Building a toolkit of regulation strategies for both states — activation needs different tools than shutdown",
        "Exploring with a therapist the underlying patterns if the mixed responses feel unpredictable or distressing"
      ],
      partnerNeedsToKnow: "My reaction to stress can go different ways depending on what's happening — please check in with me about what I need rather than assuming, because it genuinely varies.",
      dailyPatterns: [
        "You might notice that the same kind of argument plays out very differently depending on factors that are hard to name — your energy that day, the tone, something else entirely — and that your response surprises even you sometimes",
        "In some emotionally charged situations you feel very activated and vocal; in others you feel an urge to retreat entirely, and you can't always predict which one it will be in advance",
        "People close to you may sometimes say 'I can't tell where you are right now' — and you understand why, even if you can't fully explain it yourself"
      ]
    },

    regulated: {
      label: "Well-Regulated",
      emoji: "⚓",
      subtitle: "You stay mostly in your window — your calm is a real resource",
      about: [
        "Being well-regulated doesn't mean being without feeling — it means your nervous system has developed the capacity to experience a range of emotional intensities while remaining within the window of tolerance: the zone in which you can think, reflect, empathise, and respond thoughtfully rather than react automatically. This capacity is partly temperamental, partly the product of early experiences, and partly the result of learned skills and supportive relationships.",
        "From a polyvagal perspective, regulation is mediated by the ventral vagal system — the part of the nervous system associated with social engagement, calm, curiosity, and connection. When this system is active, you can meet difficulty without it overwhelming you, and you can engage with others' distress without being swamped by it. This is a genuine resource — for you and for the people you're in relationship with.",
        "It's worth acknowledging, though, that 'well-regulated' isn't a permanent state or a moral achievement. Even the most regulated person has edges — situations, topics, relationships that can push them beyond their window. Understanding where your edges are, and what happens when you approach them, is just as important as understanding your general capacity for regulation. Nobody is infinitely regulated, and believing otherwise can lead to a kind of rigidity that is its own form of difficulty."
      ],
      inConflict: "You tend to be able to stay present and engaged during conflict without completely flooding or shutting down. You can hear difficult things without your nervous system treating them as emergencies, and you can usually maintain some capacity for empathy even when you're hurt or frustrated. This is a significant strength in relationships. The growth edge is recognising that your partner may not share this capacity, and that your calm — however genuine — can sometimes feel invalidating or even dismissive to someone who is more activated. Your steadiness is a gift; it needs to be paired with genuine warmth to land as support rather than distance.",
      strengths: [
        "Able to engage with difficult conversations without escalating or shutting down",
        "Your regulated presence can help co-regulate a more activated partner",
        "Can usually think clearly even when emotionally engaged — you have access to nuance",
        "Tends to repair well from conflict and return to connection relatively smoothly"
      ],
      growthEdges: [
        "Noticing when your calm is genuinely grounded versus when it's a subtle form of avoidance — there's a difference between being regulated and being defended",
        "Developing sensitivity to how your regulation is experienced by more activated partners — do they feel steadied or dismissed?",
        "Identifying your own edges — every nervous system has them — so you're not caught off-guard when you hit yours",
        "Practising expressing more of your inner emotional experience to partners who may need to see your feeling to feel met"
      ],
      partnerNeedsToKnow: "I can usually stay steady in hard conversations, but I do have feelings — if I seem too calm, try asking me directly what I'm carrying, because I might be holding more than shows.",
      dailyPatterns: [
        "In situations that visibly activate others — a heated argument, a sudden crisis, a tense group dynamic — you find yourself relatively clear-headed and able to function, sometimes to the surprise of people around you",
        "You usually recover from conflict or a hard day without it lasting into the next day in a significant way",
        "People often come to you with difficult things precisely because you don't react in ways that make it worse — you hold space well"
      ]
    }

  },

  need: {

    seen: {
      label: "To Feel Seen",
      emoji: "👁️",
      subtitle: "You need to feel understood, not just heard",
      about: [
        "The need to feel seen is one of the most fundamental human longings — the wish to be known by another person, not just in your external actions and words, but in your interior experience, your complexities, your particular way of being in the world. Being seen is different from being heard: you can hear the words someone says without tracking what they mean, what they carry, what it costs them to say them. Being seen means someone has tracked all of that.",
        "For people whose core emotional need is to feel seen, misattunement — being misunderstood, having your intentions misread, or finding that a partner is responding to a version of you that doesn't quite match your actual experience — can be deeply painful. It's not about being agreed with; you don't need someone to always think you're right. What you need is to know that they genuinely grasp what's happening for you. That experience of being accurately received is, in itself, profoundly regulating and connecting.",
        "This need often becomes most acute in conflict, where the urgency to be understood can lead to over-explaining, repeating the same points, or escalating in an attempt to finally break through. Understanding that this need is legitimate — and developing language around it — helps enormously. Being able to say 'I don't need you to agree with me, I just need to feel like you understand what I'm trying to say' can transform a stuck conversation."
      ],
      inConflict: "In conflict, your primary suffering is often not about the surface issue but about whether your partner is actually tracking your experience. If you feel misunderstood or mischaracterised — if you sense that they're responding to a caricature of your position rather than its genuine texture — you may push, re-explain, and escalate in an attempt to finally be received accurately. This can look like over-explaining or going in circles, which is exhausting for both of you. What helps most is a partner saying something like 'so what I'm hearing you say is...' and getting it approximately right. That moment of recognition can defuse a significant amount of tension very quickly.",
      strengths: [
        "Highly attuned to others' inner experiences — you often see people accurately and deeply",
        "Your need to be seen often makes you exceptionally good at seeing others in return",
        "Rich inner life and a capacity for self-reflection that makes deep relationship possible",
        "When you feel seen, you are deeply loyal, warm, and genuinely present"
      ],
      growthEdges: [
        "Practising expressing your need for understanding directly rather than escalating until a partner is forced to attend more carefully",
        "Distinguishing between not feeling seen and being genuinely misunderstood — sometimes the gap is smaller than it seems in an activated moment",
        "Allowing imperfect attunement to be enough — no one can fully see another person; the direction of effort matters more than perfection",
        "Examining whether the need to be seen sometimes functions as a requirement for total understanding before you can relax into connection"
      ],
      partnerNeedsToKnow: "What I need most is to feel like you've genuinely understood what I mean — you don't have to agree with me, just let me know you're tracking my experience.",
      dailyPatterns: [
        "When your partner summarises something you said back to you accurately — even imperfectly — you feel a small but real sense of relief, as if you can exhale",
        "Feeling mischaracterised — even by someone who isn't being unkind — stings in a particular way that's hard to shake, and often sends you back in to correct or explain",
        "The moments in the relationship that feel most nourishing tend to be conversations where you felt genuinely followed — where you could feel that the other person was tracking what you were actually trying to say"
      ]
    },

    safe: {
      label: "To Feel Safe",
      emoji: "🛖",
      subtitle: "You need to know the relationship is stable beneath your feet",
      about: [
        "The need to feel safe in a relationship is not about comfort-seeking or timidity — it is about one of the most fundamental conditions for human flourishing. Without a basic sense of security in a close relationship, the nervous system cannot fully relax, curiosity and playfulness cannot emerge, and vulnerability becomes too risky. Safety, in relational terms, is the knowledge that you are not in danger: that disagreement won't destroy the connection, that your partner won't leave or retaliate, that the ground beneath the relationship is solid enough to stand on.",
        "For people whose core need is safety, uncertainty in the relationship can feel acutely threatening. Ambiguous situations — a partner who is unusually quiet, an unresolved argument, a period of emotional distance — may be interpreted through a threat lens even when no threat is actually present. This is the nervous system doing its job: scanning for information about relational safety and, when the information is incomplete, defaulting to alarm. Understanding this pattern helps because it allows you to reality-test: is there an actual threat, or is my system filling in the gaps with the worst version?",
        "The experience of genuine relational safety — with a partner who is consistent, honest, and follows through on what they say — is genuinely transformative for people with this core need. Over time and with enough evidence, the nervous system learns that it can relax. But that learning is gradual, and it needs repetition. A partner who understands this will know that consistency matters more than grand gestures, and that the small daily evidence of reliability builds the foundation that makes everything else possible."
      ],
      inConflict: "Conflict activates your threat system acutely — not just as a disagreement to be resolved, but as a potential signal about the fundamental stability of the relationship. Arguments can quickly start to feel like they might be the end of things, even when they aren't. This can lead to either intense anxiety and pursuit, or to complete shutdown — anything to manage the unbearable uncertainty about whether things are okay. What helps most is a partner who can say clearly, in the middle of conflict: 'we're okay, we're just disagreeing' — that simple reassurance about the relationship's survival can interrupt the threat cascade and make actual problem-solving possible.",
      strengths: [
        "Deeply committed to creating and maintaining genuine safety for others in return",
        "Highly attuned to the emotional temperature of a relationship — you notice shifts early",
        "When you feel safe, you are deeply loyal, trusting, and open — the relationship gets your best self",
        "Strong value for honesty and consistency, which makes you a reliably truthful partner"
      ],
      growthEdges: [
        "Practising distinguishing between 'I feel unsafe right now' and 'we are actually in danger' — the first is a feeling; the second is a fact",
        "Building internal safety — sources of groundedness that don't depend entirely on a partner's behaviour — so that ordinary relational friction doesn't feel catastrophic",
        "Communicating your need for safety proactively rather than waiting until you're already in alarm",
        "Working toward trusting that a relationship can survive conflict and difficulty — that ruptures are not the end of the story"
      ],
      partnerNeedsToKnow: "Consistency and follow-through matter enormously to me — the small reliable things build a foundation that lets me show up fully in the relationship.",
      dailyPatterns: [
        "You notice and are genuinely soothed by your partner's consistency — the same morning routine, following through on small promises, being where they said they'd be",
        "Periods of unresolved tension are particularly uncomfortable for you — you would almost always rather have the difficult conversation than sit in the uncertainty of something unaddressed",
        "You tend to feel most relaxed in the relationship after a period of closeness, clear communication, and the sense that things are settled — and most anxious when any of those things have been disrupted"
      ]
    },

    respected: {
      label: "To Feel Respected",
      emoji: "🏅",
      subtitle: "You need to know your autonomy and worth are honoured",
      about: [
        "The need to feel respected in a relationship is the need to be related to as a person with full standing — not as someone to be managed, corrected, talked down to, or overridden. It's the need to have your perspective taken seriously, your boundaries honoured, your autonomy acknowledged, and your contributions recognised. Respect is not the same as agreement; you don't need a partner to think you're always right. What you need is to be treated as someone whose views matter, whose experience is valid, and whose choices deserve to be engaged with rather than dismissed.",
        "For people whose core need is to feel respected, disrespect — even subtle disrespect, even the kind that wasn't intentional — can land with disproportionate impact. A dismissive tone, an eye-roll, a partner who talks over you or decides something without consulting you — these can activate a deep sense of injury that may look like anger but is, at root, a response to feeling small or erased. NVC's framework is useful here: under the anger at disrespect, there is almost always a need — to be taken seriously, to count, to be an equal partner in the relationship.",
        "Respect as a core need often comes with a high degree of integrity and a strong sense of fairness. People who most need to feel respected tend to be strongly principled, highly attuned to power dynamics, and genuinely invested in equity in their relationships. The shadow side can be a hair-trigger for perceived slights, and a tendency to escalate when something feels dismissive even in situations where no real disrespect was intended."
      ],
      inConflict: "In conflict, your sensitivity to tone, posture, and the way things are said can be acute. Being spoken to in a condescending way, being interrupted, having your perspective dismissed or minimised — these can shift the conflict from being about the topic to being about the manner, and it can be hard to re-engage with the original issue once you've felt disrespected. You may need to name this explicitly: 'It's not what you said, it's the way you said it, and I need us to talk differently before I can engage with the substance.' That's a legitimate and important thing to ask for.",
      strengths: [
        "Strong sense of fairness and equity — you attend to power dynamics and advocate for balance",
        "Clear boundaries and willingness to maintain them, which creates clarity in relationships",
        "High integrity — you give respect freely and expect it in return, which tends to elevate the quality of your relationships",
        "Not easily steamrolled — you stand your ground when it matters, which models something valuable"
      ],
      growthEdges: [
        "Developing the capacity to distinguish between disrespect that was intentional versus tone or manner that was thoughtless but not malicious",
        "Practising expressing the need for respect as a request rather than a demand — 'I need to feel heard' lands differently than 'you're being dismissive'",
        "Noticing when the acute sensitivity to disrespect is tracking something real versus something historical that the present moment is triggering",
        "Finding ways to communicate your boundaries without immediately moving to withdrawal or shutdown when they're crossed"
      ],
      partnerNeedsToKnow: "Tone matters to me as much as content — when I feel spoken to with genuine respect and care, I can hear almost anything. When I feel dismissed, I can't hear much at all.",
      dailyPatterns: [
        "You notice and internally register when a partner includes you in decisions, asks your opinion, or acknowledges your perspective — even in small everyday things — as a form of respect",
        "Being spoken to in a dismissive or condescending way, even briefly, can take you out of a conversation entirely and make it difficult to reconnect with the original topic",
        "You are attentive to whether contributions are acknowledged — in conversations, in shared decisions, in the running of a home or life together — and feel the absence of acknowledgement keenly"
      ]
    },

    space: {
      label: "Space to Process",
      emoji: "🌌",
      subtitle: "You need time and quiet to find out what you actually think and feel",
      about: [
        "Some people process experiences in real time — talking through feelings as they have them, thinking out loud, finding clarity through conversation. Others process internally and asynchronously — they need time alone with their thoughts, away from input and expectation, in order to understand what they actually feel and what they actually want to say. If your core need is space to process, you are probably in the second group, and the expectation of immediate emotional response can feel genuinely disorienting rather than just inconvenient.",
        "This need is not about avoidance, even if it can look that way from the outside. It's about the way your particular mind and nervous system work: you can't access the full complexity of your inner experience under pressure or in the immediate aftermath of something difficult. You need to let it settle, to sit with it, to find the right words — and that process happens inside, often over hours or days, before you're ready to bring it outward. Trying to shortcut that process typically results in either saying something incomplete and misleading, or shutting down entirely.",
        "The relational challenge is that partners who process differently — especially those who need quick resolution, or those whose love language is verbal connection — may experience your need for space as withdrawal, punishment, or not caring. Being able to communicate clearly what you need ('I need some time to understand how I feel, but I'm coming back to this conversation') is one of the most important relationship skills you can develop. The space you need is legitimate; the clarity of communication around it is what makes it workable for the people who love you."
      ],
      inConflict: "In conflict, the most distressing thing for you is often the pressure to respond before you've had time to think. Being pushed for an immediate answer, being accused of stonewalling when you're genuinely still processing, or having a partner escalate because your silence seems like indifference — these can push you either deeper into withdrawal or into saying something hasty that doesn't reflect what you actually feel. What helps most is agreeing in advance that pauses are allowed: that saying 'I need to sit with this and come back to it' is a legitimate and caring response, not an avoidance, as long as you do actually come back to it.",
      strengths: [
        "Thoughtful and deliberate in your responses — when you do speak, it tends to be considered and genuine",
        "Less likely to say things in conflict that you'll regret — you process before you respond",
        "Often arrive at real insight and understanding after a period of reflection that others don't access",
        "Self-aware about your inner life, even if that awareness is slow and internal"
      ],
      growthEdges: [
        "Communicating your need for space explicitly and promptly rather than just going quiet — the difference between signalled withdrawal and unexplained absence is enormous for a partner",
        "Making a genuine commitment to return: naming when you'll come back to a conversation and following through",
        "Practising giving partners a small amount of real-time update even when you're not fully processed — 'I'm still thinking about this' is a form of connection, not a final answer",
        "Examining whether the need for space is ever a way to avoid the discomfort of a difficult conversation rather than a genuine processing requirement"
      ],
      partnerNeedsToKnow: "I'm not shutting you out when I go quiet after something difficult — I'm finding out what I actually think. Give me space to do that and I'll come back with something real.",
      dailyPatterns: [
        "After a difficult conversation, an emotionally complex day, or a decision that needs to be made, you notice yourself wanting to be alone — not to avoid, but to think",
        "Your best insights about what you feel or what you want to say come to you in the shower, on a walk, or in the quiet before sleep — rarely in the middle of the conversation itself",
        "When pushed to respond before you're ready, the words that come out often feel wrong to you — not quite accurate — and you find yourself wishing you'd had more time to find the right ones"
      ]
    }

  }

};
