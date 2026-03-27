import type { CoreObjectionData } from "./types";

export const OBJECTION_CORES: Record<string, CoreObjectionData> = {
  price: {
    label: "Price",
    color: "#A32D2D",
    bg: "#FCEBEB",
    master:
      "Can I ask — is it the total investment that concerns you, or is it more about what the monthly payment looks like?",
    variations: [
      {
        id: "p1",
        obj: "That's more than I expected",
        sub: "Anchored to a lower number",
        realFear:
          "They have a number in their head and don't yet believe the premium is justified.",
      },
      {
        id: "p2",
        obj: "It doesn't fit our budget",
        sub: "Fixed income or tight finances",
        realFear:
          "Money is genuinely tight. They don't see the monthly payment as manageable yet.",
      },
      {
        id: "p3",
        obj: "The other guy was cheaper",
        sub: "Competitor comparison",
        realFear:
          "Comparing total price without comparing scope, warranty, or installer quality.",
      },
      {
        id: "p4",
        obj: "Can you do better on the price?",
        sub: "Negotiating directly",
        realFear:
          "They want to feel like they won something before saying yes.",
      },
    ],
    handlers: {
      p1: [
        "Acknowledge the anchor: 'I hear you — what number were you expecting?'",
        "Bridge to value: 'Let me show you exactly what's included that most companies skip.'",
        "Reframe monthly: 'When you break it down over 12 months, it's less than...'",
        "Pre-close: 'If the payment worked for you, is this the solution you want for your home?'",
      ],
      p2: [
        "Separate the decision from the payment: 'The decision and the payment don't have to happen at the same time.'",
        "Introduce financing: 'Most of our customers use our 12-month same-as-cash — it keeps your cash where it is.'",
        "Monthly breakdown: 'We're talking about [amount]/month. What would make that feel manageable?'",
        "Close on value: 'If we could get the monthly to a number that works — is this the solution you want?'",
      ],
      p3: [
        "Redirect to scope: 'Fair question. What did their proposal include — same materials, same warranty, same installers?'",
        "Surface the gap: 'Were they a preferred Owens Corning contractor? Did they include the 50-year warranty?'",
        "Value anchor: 'The cheapest option and the best option are rarely the same roof. Which matters more to you?'",
        "Close: 'If we were apples to apples, would you feel good choosing TimeProof?'",
      ],
      p4: [
        "Don't react — pause and ask: 'Help me understand — what would you need to see to feel like the price was right?'",
        "Earn the discount: 'There may be something I can do, but I want to make sure I'm doing it for the right reason.'",
        "National Promotion: 'I can apply our national promotion — let me show you what that does to the number.'",
        "Local Promotion + FSP sequence if needed.",
      ],
    },
  },
  urgency: {
    label: "Urgency",
    color: "#854F0B",
    bg: "#FAEEDA",
    master:
      "That makes sense — what would need to happen for this to feel like the right time?",
    variations: [
      {
        id: "u1",
        obj: "I need to think about it",
        sub: "Classic vague stall",
        realFear:
          "Hidden objection not yet named — price, trust, or missing decision-maker.",
      },
      {
        id: "u2",
        obj: "It's not leaking inside yet",
        sub: "No perceived immediate pain",
        realFear:
          "Can't see the damage so it doesn't feel urgent. Reveal photos haven't landed emotionally.",
      },
      {
        id: "u3",
        obj: "We want to wait until after the holidays",
        sub: "Timeline deferral",
        realFear:
          "Wants to make the financial decision later. Decision and install can be on different timelines.",
      },
      {
        id: "u4",
        obj: "Let me do more research",
        sub: "Information delay",
        realFear:
          "Soft trust objection. Doesn't know what they'd research. Doesn't feel informed enough to decide.",
      },
    ],
    handlers: {
      u1: [
        "Diagnose first: 'Absolutely — what specifically do you want to think through? Is it the price, the timing, or something about us?'",
        "If price: route to price handlers.",
        "If trust: route to trust handlers.",
        "If vague: 'Other than [the thing they name], is there anything else that would keep you from moving forward today?'",
      ],
      u2: [
        "Reframe the photos: 'You're right that it's not leaking inside — yet. Let me show you what the inside of your attic already looks like.'",
        "Consequence forward: 'The soft spot I found near the valley — the next storm is what turns that into a ceiling stain.'",
        "Cost of waiting: 'A proactive replacement today costs X. Water damage to your drywall, insulation, and flooring costs Y.'",
        "Close on timing: 'The good news is we can schedule the install for [date]. You lock in today's pricing and we handle it before monsoon season.'",
      ],
      u3: [
        "Separate decision from install: 'We can schedule the install after the holidays — what I'm asking is for us to get the paperwork done today so you lock in today's pricing.'",
        "Urgency of pricing: 'Material costs have gone up twice this year. What you'd pay today is less than what you'd pay in January.'",
        "Simple ask: 'The deposit holds your slot and your price. The work doesn't start until you're ready.'",
        "Close: 'Does that make sense? Can we get you locked in today?'",
      ],
      u4: [
        "Name the research gap: 'What specifically would you look into? Because everything I know about roofing I can answer right now.'",
        "Offer information: 'Is there something about our company, the materials, or the warranty that you want to verify? Let's look it up together.'",
        "Surface the real concern: 'Most people who want to research have a specific concern. What's the one thing you'd want to know that would give you confidence?'",
        "Close: 'If that question had a good answer — would you feel ready to move forward?'",
      ],
    },
  },
  trust: {
    label: "Trust",
    color: "#185FA5",
    bg: "#E6F1FB",
    master:
      "Of course — what specifically would you want to feel confident about before moving forward?",
    variations: [
      {
        id: "t1",
        obj: "I want to get other quotes",
        sub: "Comparison shopping",
        realFear:
          "Hasn't fully bought into why TimeProof is worth not shopping.",
      },
      {
        id: "t2",
        obj: "I need to talk to my spouse",
        sub: "Missing decision maker",
        realFear:
          "Either a genuine missing DM (Phase 1 failure) or a soft exit.",
      },
      {
        id: "t3",
        obj: "I've had bad experiences with contractors",
        sub: "Prior trauma",
        realFear:
          "Been burned. Generic reassurance makes it worse. Needs their specific pain mirrored to a specific protection.",
      },
      {
        id: "t4",
        obj: "How long have you been in El Paso?",
        sub: "Local credibility",
        realFear:
          "Worried about fly-by-night operation. Needs a credibility anchor that isn't local tenure.",
      },
    ],
    handlers: {
      t1: [
        "Don't argue — ask: 'Absolutely. What would the other company need to show you to feel good choosing them over us?'",
        "Surface the real criterion: 'Is it price, warranty, installer quality, or something else? Because I want to make sure we've addressed whatever that is.'",
        "Preferred Contractor payoff: 'You can't get our warranty or installer certification from a company you find on Google. That's the difference.'",
        "Close: 'If you felt good about us on those things — would you move forward today?'",
      ],
      t2: [
        "If DM was never confirmed: acknowledge the Phase 1 miss and offer to come back. Don't push.",
        "If soft exit: 'Of course — what do you think their biggest concern will be? I want to make sure I address it.'",
        "Offer to return: 'I can come back when they're available. What would be a good time this week?'",
        "Leave the door open: 'I'll leave the estimate with you — but I'd love to present it together so I can answer any questions in real time.'",
      ],
      t3: [
        "Mirror, don't minimize: 'I'm sorry that happened. What went wrong — was it the quality of the work, how they communicated, or something about the price?'",
        "Connect their pain to our protection: 'What you described — [specific issue] — is exactly why we have [specific safeguard].'",
        "Proof: Preferred Contractor status, licensed/insured crew, post-installation walkthrough.",
        "Close: 'Based on what you told me, does it feel like we've addressed the thing that went wrong last time?'",
      ],
      t4: [
        "Lead with scale: 'TimeProof operates in 64 markets across the country. We're not going anywhere.'",
        "Local anchor: 'Our El Paso branch has done over [X] roofs in this market. I can show you addresses if you'd like.'",
        "BBB + Owens Corning preferred: 'We're BBB-accredited and an Owens Corning Preferred Contractor — those aren't credentials you keep if you disappear.'",
        "Close: 'Does that give you the confidence you were looking for?'",
      ],
    },
  },
};

export const TIMEPROOF_SEQUENCE = [
  { id: "entry", label: "Entry & Booties", required: ["booties", "thank you for inviting"] },
  { id: "warmup", label: "Warm-Up", required: ["never discuss", "two ears one mouth"] },
  { id: "gatekeeper", label: "3 Critical Questions", required: ["homeowner", "decision makers", "most important"] },
  { id: "needs", label: "Needs Assessment", required: ["how did you hear", "research", "roofing industry"] },
  { id: "layering", label: "Layering Questions", required: ["tell me more", "why is that important", "how long"] },
  { id: "inspection", label: "Inspection Reference", required: ["eagleview", "eaves rakes hips ridges valleys"] },
  { id: "attic", label: "Attic Reference", required: ["decking", "ventilation", "mold"] },
  { id: "reveal", label: "The Reveal", required: ["photos", "consequences"] },
  { id: "slide1", label: "Slide 1 — Your Home", required: ["most valuable investment", "fair to say"] },
  { id: "did_you_know", label: "Slide 2 — Did You Know", required: ["BBB", "10.7 million", "96%"] },
  { id: "pns", label: "PNS", required: ["wouldn't you agree", "three estimates", "educated consumer"] },
  { id: "slide3", label: "Slide 3 — How to Choose", required: ["who you choose", "product they use"] },
  { id: "slide4", label: "Slide 4 — Who Is On Roof", required: ["licensed", "insured", "safety"] },
  { id: "slide5", label: "Slide 5 — Your Options", required: ["do nothing", "temporary repairs", "replacement"] },
  { id: "slide6", label: "Slide 6 — Cost vs Value", required: ["kelly blue book", "average companies"] },
  { id: "slide7", label: "Slide 7 — 20 Years", required: ["MRS", "master roofing solutions", "trusted"] },
  { id: "slide8", label: "Slide 8 — CEO & Ty", required: ["vince nardo", "ty pennington"] },
  { id: "slide9", label: "Slide 9 — Business Revolves", required: ["referral", "concierge", "certified installers"] },
  { id: "slide10", label: "Slide 10 — Licensed", required: ["licensed", "insured", "liable"] },
  { id: "slide11", label: "Slide 11 — Fair Pricing", required: ["same price", "same materials", "same day"] },
  { id: "slide12", label: "Slide 12 — Tie Down", required: ["40000 families", "64 locations", "trust timeproof"] },
  { id: "roofbag", label: "Roof in a Bag", required: ["OSB", "ice and water", "underlayment", "starter", "shingles", "ventilation", "hip and ridge"] },
  { id: "timelock", label: "TIME LOCK System", required: ["defend", "seal", "breathe", "comfort"] },
  { id: "surenail", label: "SureNail Technology", required: ["130 mph", "triple layer", "nailing zone"] },
  { id: "algae", label: "Algae Resistance", required: ["streakguard", "copper ions", "mineral"] },
  { id: "three_ps", label: "3 P's", required: ["perimeter", "penetration points", "problem areas"] },
  { id: "installers", label: "Our Installers", required: ["insured", "factory trained", "owens corning"] },
  { id: "preferred", label: "Preferred Contractor", required: ["secret shop", "preferred contractor", "off the shelf"] },
  { id: "warranties", label: "Warranties", required: ["platinum", "50 year", "10 year installation"] },
  { id: "expect", label: "What to Expect", required: ["trailer", "walkthrough", "final payment"] },
  { id: "respect", label: "Respect for Property", required: ["safe", "clean", "magnetic rake", "tarps"] },
  { id: "bridge", label: "Bridge to Pre-Close", required: ["before we look at numbers"] },
  { id: "preclose", label: "Pre-Close Question", required: ["other than affordability"] },
  { id: "value_confirm", label: "Value Confirmation", required: ["right solution", "does this feel"] },
  { id: "financing", label: "Financing Transition", required: ["not because they can't pay cash", "financing options"] },
  { id: "packages", label: "Package Presentation", required: ["platinum", "elite", "essential", "retail"] },
  { id: "discount1", label: "National Promotion (5%)", required: ["national promotion", "heard about us"] },
  { id: "discount2", label: "Local Promotion (10%)", required: ["local promotion", "upgrade"] },
  { id: "fsp", label: "FSP (10%)", required: ["financing savings promotion", "best buy", "home depot"] },
  { id: "close", label: "Close", required: ["ready to move forward", "move forward"] },
];

export const NEPQ_SEQUENCE = [
  {
    id: "connection",
    label: "Phase 1 — Connect & Disarm",
    nepqGoal: "Build trust before saying anything about the company or product.",
    keyBehaviors: [
      'Permission frame: "I just want to ask you a few questions to see if we can genuinely help. Sound fair?"',
      "Confirm all decision-makers are present — if not, reschedule before going further",
      "Two ears one mouth — listen more than talk",
      "Never discuss: company, product, yourself, religion, politics, sex",
    ],
    coachCriteria: [
      "Did the rep ask permission before diving in?",
      "Did the rep confirm all decision-makers?",
      "Did the rep avoid mentioning company or product?",
    ],
  },
  {
    id: "situation",
    label: "Phase 2 — Situation Questions",
    nepqGoal: "Understand the homeowner's current state without leading them anywhere yet.",
    keyBehaviors: [
      "How did you hear about us? What caught your attention?",
      "What research have you done?",
      "How long have you been in this home?",
      "Has the roof given you any concerns?",
      "When's the last time someone actually looked at it?",
    ],
    coachCriteria: [
      "Did the rep ask situation questions before presenting anything?",
      "Did the rep listen to answers without pivoting to pitch?",
      "Did the rep use layering questions (tell me more, why is that important, how long)?",
    ],
  },
  {
    id: "problem_awareness",
    label: "Phase 3 — Problem Awareness",
    nepqGoal: "The homeowner names and emotionally owns their problem. Rep never tells them — rep asks.",
    keyBehaviors: [
      "When you noticed that issue — what was your first thought?",
      "Has that been something in the back of your mind or a day-to-day concern?",
      "What happens if this gets worse going into monsoon season?",
      "If a leak did develop — what does that affect inside the house?",
      "How long have you been putting this off, if you're honest?",
      "Silence is a tool — do not fill it after a heavy answer",
    ],
    coachCriteria: [
      "Did the rep ask questions that made the homeowner articulate consequences in their own words?",
      "Did the rep resist the urge to provide the answer or fill silence?",
      "Did the homeowner verbalize the pain without being told?",
    ],
  },
  {
    id: "inspection_reveal",
    label: "Phase 4 — Inspect & Reveal",
    nepqGoal: "Let evidence do the selling. Involve the homeowner during the walk. Let photos land with silence.",
    keyBehaviors: [
      "Point me to the areas you've been most concerned about",
      "Come look at this with me — what does that tell you?",
      "Show photos — then go silent. Do not narrate immediately.",
      'After photos: "What\'s your reaction to seeing that?"',
    ],
    coachCriteria: [
      "Did the rep involve the homeowner during the inspection walk?",
      "Did the rep let photos breathe with silence?",
      "Did the rep ask the homeowner to narrate what they see rather than explaining it for them?",
    ],
  },
  {
    id: "company_story",
    label: "Phase 5 — Company Story (After Emotional Investment)",
    nepqGoal: "Company story lands AFTER the homeowner has emotionally connected to the problem. Not before.",
    keyBehaviors: [
      'NEPQ bridge: "Before I show you what we put together — I want to show you a little about who we are, because at this point it matters."',
      'Lead with personal conviction: "The reason I joined TimeProof — out of every company I could have gone with..."',
      'Slide 1 confirmation question: "Is it fair to say your home is one of your most valuable investments?"',
      "PNS — memorize word for word",
      'Company tie-down (Slide 12): "Do you feel you can TRUST TimeProof?" — do not move to product without a yes',
    ],
    coachCriteria: [
      "Did the rep wait until after emotional investment to present company story?",
      "Did the rep frame the company story with personal conviction rather than biography recitation?",
      "Did the rep get a trust tie-down before moving to product?",
    ],
  },
  {
    id: "product_presentation",
    label: "Phase 6 — Product Presentation (Anchored to Their Words)",
    nepqGoal: "Every component connects back to something the homeowner said. Not a generic walkthrough.",
    keyBehaviors: [
      'NEPQ anchor before opening bag: "You mentioned [their specific concern] — let me show you exactly what we use and why it addresses that."',
      "Hand each sample — let them feel it",
      'Anchor each component: "You mentioned heat — this is why the underlayment matters for heat transfer in El Paso"',
      'Check-in every 2-3 components: "Does that make sense so far?"',
      "TIME LOCK system: Defend, Seal, Breathe, Comfort",
      'Preferred Contractor payoff: "You cannot get this level of protection off the shelf"',
      'Warranty NEPQ frame: "What would peace of mind look like for you on a project this size?" — then present Platinum as the answer',
    ],
    coachCriteria: [
      "Did the rep anchor product components back to specific things the homeowner said?",
      "Did the rep use check-in questions during the walkthrough?",
      "Did the rep ask about peace of mind before presenting the warranty?",
    ],
  },
  {
    id: "solution_awareness",
    label: "Phase 7 — Solution Awareness",
    nepqGoal: "Homeowner confirms the solution is right in their own words before price is discussed.",
    keyBehaviors: [
      '"Based on everything we looked at today — do you feel this is the right solution for your roof?"',
      '"If we could get this handled the right way — quality materials, solid warranty, done correctly — is that something that matters to you, or are you mainly looking for the cheapest option?"',
      "Let them commit to quality before showing price",
      'Bridge to pre-close: "I want to ask you something before we look at numbers..."',
      'Pre-close: "Other than affordability, are there any other questions or concerns that would keep you from choosing TimeProof?"',
      "Handle any surfaced objections NOW before the estimate",
    ],
    coachCriteria: [
      "Did the rep get the homeowner to verbally confirm the solution was right before showing price?",
      "Did the rep get the homeowner to commit to quality over cheapest option?",
      "Did the rep ask the pre-close question and handle everything that came up before showing numbers?",
    ],
  },
  {
    id: "price_financing",
    label: "Phase 8 — Price & Financing Transition",
    nepqGoal: "Financing is introduced as a smart financial tool, not a fallback. Price lands after commitment.",
    keyBehaviors: [
      "NEPQ price frame: \"We're not the cheapest, not the most expensive. We're the company that does it right the first time. Based on what you told me about [their concern], that matters more than saving a few hundred dollars.\"",
      "Show estimate — then go silent. Do not fill the silence.",
      'Financing transition: "Almost all our customers use financing. Not because they can\'t pay cash — because it makes financial sense. It keeps your cash where it is."',
      'After showing packages: "Does that monthly number work for your budget — or do you want me to look at what we can do?"',
    ],
    coachCriteria: [
      "Did the rep frame price relative to what the homeowner said was important?",
      "Did the rep let the estimate sit in silence?",
      "Did the rep introduce financing as a smart choice rather than a solution to affordability?",
    ],
  },
  {
    id: "nepq_discounts",
    label: "Phase 9 — NEPQ Discount Sequence",
    nepqGoal: "Every discount is earned through the homeowner's response — not dropped automatically.",
    keyBehaviors: [
      'Discount 1 (National 5%): Reference how they heard about us → "Let me honor that. Let me show you what that does to your number." → "Does that feel any closer to where you need to be?"',
      'Discount 2 (Local 10%): "If I could get you into Platinum for close to what you\'d pay for Elite — would that be worth doing for your home?" Wait for yes → then reveal the promotion',
      'FSP (Final 10%): "There\'s one more thing I can do if you decide to use our financing today." Pause. Let them lean in. → "It\'s called our Financing Savings Promotion — same idea as Best Buy or Home Depot."',
      "After FSP: \"Given everything we've talked about today — does this feel like something you're ready to move forward with?\"",
    ],
    coachCriteria: [
      "Did the rep ask a question before dropping each discount?",
      "Did the rep wait for the homeowner to respond before revealing the new number?",
      "Did the FSP feel like the final unlock rather than the next item on a list?",
    ],
  },
  {
    id: "close_objections",
    label: "Phase 10 — Close & NEPQ Objection Handling",
    nepqGoal: "Surface the real objection through questions. Never counter before asking.",
    keyBehaviors: [
      '"I need to think about it" → "What specifically do you want to think through — price, timing, or something about us?"',
      '"More than expected" → "What were you expecting, ballpark?" → "If the price were there — would you move forward today?"',
      '"Other quotes" → "What would the other company need to show you to feel good choosing them over us?"',
      '"Talk to spouse" → "What do you think their biggest concern will be?" → offer to come back with both present',
      "Every objection: ask first, diagnose second, handle third",
      "Credit card exception: \"I'm not supposed to do that — but if you're moving forward right now, I'll make the exception. In return I need two things from you.\"",
    ],
    coachCriteria: [
      "Did the rep lead with a question for every objection?",
      "Did the rep identify the real fear beneath the surface objection?",
      "Did the rep avoid countering or defending before asking?",
    ],
  },
];
