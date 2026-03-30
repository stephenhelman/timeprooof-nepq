import type { CoreObjectionData, NEPQStepDefinition, ExperienceLevelConfig } from "./types";

// ── Experience Levels ─────────────────────────────────────────────────────────

export const EXPERIENCE_LEVELS: ExperienceLevelConfig[] = [
  {
    id: "rookie",
    label: "Rookie",
    description: "New to the presentation — building script muscle memory.",
    coachingApproach:
      "Strict script adherence. Coach flags every missed required phrase, skipped checkpoint, and out-of-order step. Exact wording matters.",
    robertBehavior:
      "Slightly more forgiving. Gives clearer signals about what he needs to hear. Responds positively to correct scripted language. Will not volunteer objections unprompted.",
  },
  {
    id: "rep",
    label: "Rep",
    description: "Knows the structure — developing personal delivery style.",
    coachingApproach:
      "Intent and structure over exact wording. Did the rep hit the key beats of each checkpoint? Wording is flexible as long as the goal of the checkpoint is achieved.",
    robertBehavior:
      "Standard resistance. Responds to the intent of what the rep says, not just scripted phrases. Will surface one natural objection during the session.",
  },
  {
    id: "vet",
    label: "Vet",
    description: "Experienced rep with tailored delivery — testing outcomes.",
    coachingApproach:
      "Outcomes only. Did the homeowner respond positively? Did the rep hit the emotional beats? Zero coaching on specific language or exact script. Feedback focuses entirely on what landed with the homeowner and what did not.",
    robertBehavior:
      "Full natural resistance. Has his own opinions, pushes back on weak moments, surfaces objections organically. Only moves toward yes when the rep genuinely earns it.",
  },
];

// ── TimeProof Phase Groupings ─────────────────────────────────────────────────

export interface TimeProofPhase {
  id: string;
  number: 1 | 2 | 3 | 4 | 5;
  label: string;
  subtitle: string;
  checkpointIds: string[];
  robertStartingContext: string;
  available: boolean;
}

export const TIMEPROOF_PHASES: TimeProofPhase[] = [
  {
    id: "initiate_investigate",
    number: 1,
    label: "Initiate & Investigate",
    subtitle: "Entry through the Reveal",
    checkpointIds: [
      "entry",
      "warmup",
      "gatekeeper",
      "needs",
      "layering",
      "inspection",
      "attic",
      "reveal",
    ],
    robertStartingContext: `You are a homeowner who just opened the door to a TimeProof rep.
You are cautious but polite. You have not yet invited them in.
The rep is about to introduce themselves and begin the process of getting seated.
Respond as a homeowner at the very beginning of an unexpected but expected sales visit.`,
    available: true,
  },
  {
    id: "educate",
    number: 2,
    label: "Educate",
    subtitle: "Company story — Slides 1 through 12",
    checkpointIds: [
      "slide1",
      "did_you_know",
      "pns",
      "slide3",
      "slide4",
      "slide5",
      "slide6",
      "slide7",
      "slide8",
      "slide9",
      "slide10",
      "slide11",
      "slide12",
    ],
    robertStartingContext: `You are a homeowner seated at your kitchen table with a TimeProof rep.
The rep has already completed the warm-up, confirmed you are the homeowner and your spouse is present,
ran the needs assessment, and just finished showing you inspection photos of your roof.
You saw some concerning damage in the photos and are now engaged but still guarded.
The rep is about to begin presenting the company. You are ready to hear them out.`,
    available: true,
  },
  {
    id: "differentiate",
    number: 3,
    label: "Differentiate",
    subtitle: "Product presentation through Respect for Your Property",
    checkpointIds: [
      "roofbag",
      "timelock",
      "surenail",
      "algae",
      "three_ps",
      "installers",
      "preferred",
      "warranties",
      "expect",
      "respect",
    ],
    robertStartingContext: `You are a homeowner seated at your kitchen table with a TimeProof rep.
The rep has completed the warm-up, needs assessment, roof inspection and reveal, and the full
company story through the tie-down. You agreed that TimeProof feels like a company you can trust.
The rep is now about to show you the actual roofing system — the products, components, and
installation process. You are open but want to understand what you're actually getting.`,
    available: true,
  },
  {
    id: "motivate",
    number: 4,
    label: "Motivate",
    subtitle: "Pre-close through the Close",
    checkpointIds: [
      "bridge",
      "preclose",
      "value_confirm",
      "financing",
      "packages",
      "discount1",
      "discount2",
      "fsp",
      "close",
    ],
    robertStartingContext: `You are a homeowner seated at your kitchen table with a TimeProof rep.
The rep has completed the full presentation — warm-up, inspection, company story, and the full
product walkthrough including the TIME LOCK system and warranties. You are impressed with the
product quality but have not yet heard the price. You have some concerns about cost.
The rep is about to bridge to price. You are engaged but price-sensitive.`,
    available: true,
  },
  {
    id: "saturate",
    number: 5,
    label: "Saturate",
    subtitle: "Coming soon",
    checkpointIds: [],
    robertStartingContext: "",
    available: false,
  },
];

export function getPhaseForCheckpoint(checkpointId: string): TimeProofPhase | undefined {
  return TIMEPROOF_PHASES.find((p) => p.checkpointIds.includes(checkpointId));
}

export function getCheckpointsForPhase(phaseId: string): typeof TIMEPROOF_SEQUENCE {
  const phase = TIMEPROOF_PHASES.find((p) => p.id === phaseId);
  if (!phase) return [];
  return TIMEPROOF_SEQUENCE.filter((c) => phase.checkpointIds.includes(c.id));
}

// ── NEPQ Phase Definitions ────────────────────────────────────────────────────

export interface NEPQPhaseDefinition {
  id: string;
  number: number;
  label: string;
  shortLabel: string;
  nepqGoal: string;
  keyBehaviors: string[];
  coachCriteria: string[];
  robertStartingContext: string;
  phaseCompletionSignal: string;
  rookieFocus: string;
  repFocus: string;
  vetFocus: string;
}

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

export const NEPQ_SEQUENCE: NEPQPhaseDefinition[] = [
  {
    id: "connection",
    number: 1,
    label: "Phase 1 — Connect & Disarm",
    shortLabel: "Connect",
    nepqGoal: "Build trust before saying anything about the company or product. Get permission to ask questions.",
    keyBehaviors: [
      'Permission frame: "I just want to ask you a few questions to see if we can genuinely help. Sound fair?"',
      "Confirm all decision-makers are present — if not, surface it now",
      "Two ears one mouth — listen more than talk",
      "Never mention: company, product, yourself, religion, politics, sex",
      '"Sound fair?" micro-commitment before anything else',
    ],
    coachCriteria: [
      "Did the rep ask permission before asking questions?",
      "Did the rep confirm all decision-makers are present?",
      "Did the rep avoid mentioning company or product?",
      "Did the rep get a micro-commitment before the conversation began?",
    ],
    robertStartingContext: `You are a homeowner in El Paso TX who just opened your front door to a TimeProof rep. You were not expecting this visit but you did respond to a mailer. Your spouse is inside but not at the door. You are cautious and slightly guarded — you have had pushy salespeople at your door before. You are polite but you have your guard up. You will not invite the rep in unless they make you feel like this is not going to be a hard sell. If the rep immediately pitches, goes into company info, or tries to show you anything, you get more guarded. If they seem genuinely curious and ask permission before doing anything, you warm up and invite them in. Do not offer information about your roof unprompted.`,
    phaseCompletionSignal: `You signal phase completion by inviting the rep in and saying something like "sure, come on in" or "okay, I've got a few minutes." This signals the connection phase is complete and the conversation can move inside to the next phase.`,
    rookieFocus: 'Did the rep say the permission frame? Did they get a "sound fair?" response? Did they avoid all 6 forbidden topics?',
    repFocus: "Did the rep create a low-pressure atmosphere? Did the homeowner seem willing to engage? Was the micro-commitment genuine?",
    vetFocus: "Did the homeowner want to let the rep in? Was there real rapport established or just procedural compliance?",
  },
  {
    id: "situation",
    number: 2,
    label: "Phase 2 — Situation Questions",
    shortLabel: "Situation",
    nepqGoal: "Understand the homeowner's current state without leading them. Get them talking about their home and roof in their own words.",
    keyBehaviors: [
      "How did you hear about us? What caught your attention?",
      "What research have you done on roofing?",
      "How long have you been in this home?",
      "Has the roof given you any concerns you've noticed?",
      "When's the last time someone actually looked at it?",
      "Listen to answers fully before asking the next question",
      'Use layering questions after every answer: "Can you tell me more about that?" / "How long has that been the case?"',
    ],
    coachCriteria: [
      "Did the rep ask situation questions before presenting anything?",
      "Did the rep listen to full answers without pivoting to pitch?",
      "Did the rep use layering questions to go deeper?",
      "Did the rep avoid volunteering information about the product or company?",
    ],
    robertStartingContext: `You are a homeowner seated at your kitchen table. The TimeProof rep just came in after you invited them. Your spouse is in the other room but not yet at the table. You are warmer now that you let them in but still cautious. You heard about TimeProof from a mailer. You have not done much research on roofing. You have lived in this home for 11 years. You have noticed some dark streaking on the shingles but you are not sure if it is serious. You have not had anyone look at the roof since you moved in. You will share these details naturally if the rep asks the right questions — but you will not volunteer them. If the rep asks good layering questions you will open up more. If the rep skips to pitching or company info, you get suspicious.`,
    phaseCompletionSignal: `You signal phase completion when you have answered several questions and feel like the rep actually understands your situation. Say something like "yeah, I mean I haven't really thought much about the roof until recently" or "I guess I don't know that much about what to look for" — natural conversation winding down on the situation questions, opening space for something deeper.`,
    rookieFocus: "Did the rep ask all three needs assessment questions (how heard, research, roofing knowledge)? Did they use at least one layering question?",
    repFocus: "Did the rep build a genuine picture of the homeowner's situation? Did the homeowner feel heard rather than interrogated?",
    vetFocus: "Did the homeowner voluntarily share more than they were asked? Did the rep create space for that to happen?",
  },
  {
    id: "problem_awareness",
    number: 3,
    label: "Phase 3 — Problem Awareness",
    shortLabel: "Problem Awareness",
    nepqGoal: "The homeowner names and emotionally owns their problem. The rep never tells them — the rep asks until they articulate it themselves.",
    keyBehaviors: [
      '"When you noticed that issue — what was your first thought?"',
      '"Has that been something in the back of your mind, or more of a day-to-day concern?"',
      '"What happens if that gets worse going into monsoon season?"',
      '"If a leak did develop — what does that affect inside the house?"',
      "\"How long have you been putting this off, if you're honest?\"",
      "Silence after heavy answers — do NOT fill it",
      '"How would it feel to not have that problem anymore?"',
    ],
    coachCriteria: [
      "Did the rep ask questions that made the homeowner articulate consequences in their own words?",
      "Did the rep resist filling silence after heavy answers?",
      "Did the homeowner verbalize the pain without being told what it was?",
      "Did the rep avoid stating the problem for the homeowner?",
      "Did the rep ask about emotional stakes, not just physical damage?",
    ],
    robertStartingContext: `You are a homeowner seated at your kitchen table. The rep has completed the warm-up and situation questions. You shared that you noticed dark streaking on the north face of the roof and a water stain appeared on the guest bedroom ceiling after a storm two months ago. You mentioned it but kind of downplayed it — you said "it's probably fine." You are now in a slightly vulnerable position because the rep seems to be taking it more seriously than you let on. The truth is the water stain has been worrying you and you have not told your spouse yet. You will not volunteer this — but if the rep asks the right questions about what it felt like to notice the stain, what could happen if it gets worse, and how long you have been thinking about it, you will gradually open up. The anxiety is real. If the rep tries to tell you how serious the problem is rather than asking you, you brush it off. If the rep sits in silence after you say something heavy, you keep talking and reveal more.`,
    phaseCompletionSignal: `You signal phase completion by saying something that reveals genuine emotional ownership of the problem — something like "honestly I've been a little worried about it since I saw that stain" or "I guess I've been putting it off longer than I should have." This is the moment the rep has surfaced real concern. The phase is done when you have said something in your own words that shows you understand the stakes.`,
    rookieFocus: "Did the rep ask at least 3 problem awareness questions? Did they avoid stating the problem for the homeowner?",
    repFocus: "Did the rep get the homeowner to articulate consequences in their own words? Did they use silence effectively at least once?",
    vetFocus: "Did the homeowner emotionally arrive at the problem on their own? Was there a genuine moment of vulnerability that the rep created space for?",
  },
  {
    id: "inspection_reveal",
    number: 4,
    label: "Phase 4 — Inspect & Reveal",
    shortLabel: "Inspect & Reveal",
    nepqGoal: "Let the evidence do the selling. Involve the homeowner during the walk. Let photos land in silence.",
    keyBehaviors: [
      "\"Point me to the areas you've been most concerned about\"",
      '"Come look at this with me — what does that tell you?"',
      "Show photos — then go silent. Do not narrate immediately.",
      "\"What's your reaction to seeing that?\"",
      '"What does that tell you?"',
      "Reference the specific concerns they named in Phase 3",
      "Never explain what the homeowner should feel — ask them what they feel",
    ],
    coachCriteria: [
      "Did the rep involve the homeowner during the inspection walk?",
      "Did the rep let photos breathe with silence before speaking?",
      "Did the rep ask the homeowner to narrate what they see rather than explaining it for them?",
      "Did the rep reference concerns the homeowner named in earlier phases?",
    ],
    robertStartingContext: `You are a homeowner who just came back inside after walking the roof with the rep. You are now seated at the table and the rep has their phone or tablet showing you photos taken during the inspection. You went up with them and saw some things that concerned you — the rep pointed out the dark streaking, what looked like some soft spots near the valley, and some granule loss on the south face. You are not an expert but what you saw looked worse than you expected. You feel a bit unsettled but you are trying to stay composed. You are ready to look at the photos. If the rep shows you a photo and immediately explains everything, you passively receive the information. If the rep shows you a photo and asks "what does that tell you?" you engage more deeply and the concern becomes more real to you.`,
    phaseCompletionSignal: `You signal phase completion by saying something that shows the photos have landed emotionally — something like "okay that looks pretty bad" or "I didn't realize it was that far gone" or "so what does this mean for us?" The last response is the clearest signal — asking "what does this mean" means you are ready to move to the next phase.`,
    rookieFocus: "Did the rep transition outside correctly? Did they show photos and reference what was found? Did they ask at least one question about the photos instead of only narrating?",
    repFocus: "Did the rep create a moment of silence after showing a significant photo? Did the homeowner engage with the damage rather than just receiving information?",
    vetFocus: "Did the homeowner arrive at concern on their own through the reveal? Was there a genuine emotional shift visible in the homeowner's responses?",
  },
  {
    id: "company_story",
    number: 5,
    label: "Phase 5 — Company Story",
    shortLabel: "Company Story",
    nepqGoal: "Company story lands AFTER the homeowner has emotionally connected to the problem. Lead with personal conviction, not company biography.",
    keyBehaviors: [
      'NEPQ bridge: "Before I show you what we put together — I want to show you a little about who we are, because at this point it matters."',
      'Lead with personal conviction: "The reason I joined TimeProof specifically..."',
      'Slide 1 confirmation question: "Is it fair to say your home is one of your most valuable investments?"',
      "PNS — word for word",
      'Slide 12 tie-down: "Do you feel you can TRUST TimeProof?" — do not move to product without a yes',
      "Frame stats as context, not a pitch: the BBB complaint stat exists to validate their skepticism, not to scare them",
    ],
    coachCriteria: [
      "Did the rep bridge into company story after emotional investment was established?",
      "Did the rep lead with personal conviction rather than reciting company biography?",
      'Did the rep get a confirmation on "your home is your most valuable investment"?',
      "Did the rep deliver PNS and get a \"wouldn't you agree\"?",
      "Did the rep get a trust tie-down before moving to product?",
    ],
    robertStartingContext: `You are a homeowner at your kitchen table. The rep has completed the warm-up, needs assessment, inspection walk, and photo reveal. You have seen the photos and acknowledged the damage is more significant than you realized. You are now emotionally engaged — this is no longer abstract. The rep is about to tell you about their company. At this point you actually care who is going to fix this because you just saw how bad it is. You are ready to hear about them but you are still skeptical of home improvement companies in general — you have heard stories. You will respond well to personal conviction and authenticity. You will tune out if it sounds like a rehearsed pitch. The Slide 1 question about your home being a valuable investment will land well — it is true. The BBB complaint stat will resonate because it validates your skepticism. The PNS will make sense to you if delivered naturally.`,
    phaseCompletionSignal: `You signal phase completion when the rep delivers the Slide 12 tie-down and you respond affirmatively to "do you feel you can trust TimeProof?" Say something like "yeah, you guys seem more legit than most" or "I think so" or "so far so good." This signals trust has been established and the company story phase is complete.`,
    rookieFocus: "Did the rep use the NEPQ bridge before company story? Did they hit Slide 1, PNS, and the Slide 12 tie-down? Did they get a yes on trust?",
    repFocus: "Did the company story feel like a natural continuation of the conversation rather than a gear shift into a pitch? Did the homeowner engage with the content rather than just listening?",
    vetFocus: "Did the homeowner genuinely trust the company by the end of this phase, or did they give a polite yes? Was there a real moment of credibility established?",
  },
  {
    id: "product_presentation",
    number: 6,
    label: "Phase 6 — Product Presentation",
    shortLabel: "Product",
    nepqGoal: "Every component connects back to something the homeowner said. This is not a generic walkthrough — it is a direct answer to their specific concerns.",
    keyBehaviors: [
      'NEPQ anchor before opening bag: "You mentioned [their specific concern] — let me show you exactly what we use and why it addresses that."',
      "Hand each sample — let them feel it",
      'Anchor every component: "You mentioned heat — this is why the underlayment matters for heat transfer in El Paso"',
      'Check-in every 2-3 components: "Does that make sense so far?" / "Is this the kind of quality you were hoping to see?"',
      "TIME LOCK: Defend, Seal, Breathe, Comfort — connect each to a concern they named",
      'Preferred Contractor payoff: "You cannot get this level of protection off the shelf"',
      '"What would peace of mind look like for you on a project this size?" before presenting warranty',
    ],
    coachCriteria: [
      "Did the rep anchor the product opening to something the homeowner said earlier?",
      "Did the rep connect each component back to a specific concern from earlier phases?",
      "Did the rep use check-in questions during the walkthrough?",
      "Did the rep ask about peace of mind before presenting the warranty?",
      "Did the rep let the homeowner feel samples rather than just showing them?",
    ],
    robertStartingContext: `You are a homeowner at your kitchen table. The rep has completed the full company story and you told them you feel like you can trust TimeProof. The rep now has the roof in a bag samples on the table and is about to walk you through the products. You remember mentioning earlier that you were worried about the water stain in the guest bedroom and about El Paso heat affecting the roof. You are genuinely curious about what goes into a roof because you have never thought about it before. If the rep hands you samples you engage with them — you actually look at and feel the materials. If the rep connects a product to something you said earlier ("you mentioned the heat") you pay closer attention because it feels relevant to your situation. If the rep just recites product specs without connecting them to you, you zone out a little. You will ask "what does that do?" about at least one component.`,
    phaseCompletionSignal: `You signal phase completion after the warranties are presented and the rep asks about peace of mind. Respond with something like "yeah, the 10-year installation warranty is actually really important to me" or "okay, that does give me some peace of mind." This signals the product phase is complete and you understand what you are getting.`,
    rookieFocus: "Did the rep cover all 8 roof in a bag components, TIME LOCK, SureNail, 3 P's, installers, preferred contractor, and warranties? Did they ask about peace of mind before the warranty?",
    repFocus: "Did the rep anchor at least 3 product components to specific things the homeowner said earlier? Did the homeowner engage with the materials?",
    vetFocus: "Did the product presentation feel like a direct answer to this homeowner's situation or like a standard walkthrough delivered to this homeowner? Did the homeowner feel like the system was designed for their specific problems?",
  },
  {
    id: "solution_awareness",
    number: 7,
    label: "Phase 7 — Solution Awareness",
    shortLabel: "Solution Awareness",
    nepqGoal: "Homeowner confirms the solution is right in their own words before price is discussed. Rep earns the right to show numbers.",
    keyBehaviors: [
      '"Based on everything we looked at today — do you feel like this is the right solution for your roof?"',
      '"If we could get this handled the right way — quality materials, solid warranty, done correctly — is that something that matters to you, or are you mainly looking for the cheapest option?"',
      "Let them commit to quality before showing price",
      'Bridge to pre-close: "I want to ask you something before we look at numbers..."',
      'Pre-close: "Other than affordability, are there any other questions or concerns that would keep you from choosing TimeProof?"',
      "Handle ANYTHING that surfaces from the pre-close before touching price",
    ],
    coachCriteria: [
      "Did the rep get the homeowner to verbally confirm the solution was right before showing price?",
      "Did the rep get the homeowner to commit to quality over cheapest option?",
      "Did the rep ask the pre-close question?",
      "Did the rep handle everything that came up in the pre-close before touching numbers?",
    ],
    robertStartingContext: `You are a homeowner at your kitchen table. The rep has completed the full product walkthrough and you feel like you understand what TimeProof puts on a roof. You are impressed with the quality — especially the 10-year installation warranty. You are now approaching the moment where price will come up. You have been vaguely thinking about cost throughout the conversation. You are not going to bring it up first but it is on your mind. If the rep asks "is this the right solution for your roof?" you will say yes — you genuinely believe it is based on what you saw and heard. If the rep asks whether quality matters to you or whether you are just looking for the cheapest option, you will say quality matters — you have a family in this house. If the pre-close question surfaces the spouse's need to be involved, surface it now.`,
    phaseCompletionSignal: `You signal phase completion by answering the pre-close question cleanly — either saying "no, I think I'm good" (meaning only affordability remains) or surfacing a specific concern. Either way, the moment the pre-close question is asked and answered, the phase is complete. Say something like "no I think you guys have answered everything" or "the only thing I'm not sure about is the price" to signal readiness to move to pricing.`,
    rookieFocus: "Did the rep ask the solution confirmation question? Did they ask about quality vs cheapest? Did they deliver the pre-close question word for word?",
    repFocus: "Did the homeowner genuinely commit to quality or just nod along? Did the rep handle the pre-close response before moving to price?",
    vetFocus: "Did the homeowner arrive at the solution confirmation on their own terms? Was there genuine conviction in their answer or polite agreement?",
  },
  {
    id: "price_financing",
    number: 8,
    label: "Phase 8 — Price & Financing",
    shortLabel: "Price & Financing",
    nepqGoal: "Financing is a smart financial tool, not a fallback. Price lands after commitment. Silence after the estimate is a tool.",
    keyBehaviors: [
      "NEPQ price frame: \"We're not the cheapest, not the most expensive. Based on what you told me about [their concern], that matters more than saving a few hundred dollars.\"",
      "Show estimate — then go completely silent. Do not fill the silence.",
      "Financing transition: \"Almost all our customers use financing — not because they can't pay cash, because it makes financial sense.\"",
      '"Does that monthly number work for your budget — or do you want me to look at what we can do?"',
      "Do not lead with discounts — show retail first, read their response",
    ],
    coachCriteria: [
      "Did the rep frame price relative to something the homeowner said was important?",
      "Did the rep let the estimate sit in silence after showing it?",
      "Did the rep introduce financing as a smart financial choice rather than a solution to affordability?",
      "Did the rep show packages at retail before touching discounts?",
      "Did the rep ask an open question about the monthly number rather than assuming?",
    ],
    robertStartingContext: `You are a homeowner at your kitchen table. The rep has confirmed you feel this is the right solution and the only remaining question is affordability. The rep is about to show you the estimate. You are bracing slightly for the number — you have no idea what a roof costs. When you see the number you will pause and think. It is more than you expected. You will not immediately object — you will sit with it for a moment. If the rep fills the silence immediately after showing the estimate, you feel rushed. If the rep lets it sit, you process it and respond more authentically. When the rep introduces financing you are interested — you were thinking cash but monthly payments actually make it feel more manageable. You will ask "what does the monthly payment look like?"`,
    phaseCompletionSignal: `You signal phase completion when the rep has shown you the retail packages and the financing transition has landed. Say something like "okay so what's the monthly payment on the Platinum?" or "so if I financed this what would that look like?" This signals you are engaged with the financing path and ready for the discount sequence.`,
    rookieFocus: "Did the rep use the NEPQ price frame? Did they show the estimate and wait for a response before speaking? Did they deliver the financing transition correctly?",
    repFocus: "Did the homeowner feel like financing was a smart option rather than a concession? Did the silence after the estimate create space for an authentic response?",
    vetFocus: "Did the price conversation feel natural or did it feel like a transition into a new script? Did the homeowner move toward financing on their own or did they need to be pushed?",
  },
  {
    id: "nepq_discounts",
    number: 9,
    label: "Phase 9 — NEPQ Discount Sequence",
    shortLabel: "Discounts",
    nepqGoal: "Every discount is earned through the homeowner's response. No discount drops automatically — each one is unlocked by a question and answered by the homeowner.",
    keyBehaviors: [
      'Discount 1 (5%): Reference how they heard about us → "Let me honor that. Let me show you what that does to your number." → "Does that feel any closer to where you need to be?"',
      "Discount 2 (10%): \"If I could get you into Platinum for close to what you'd pay for Elite — would that be worth doing for your home?\" Wait for yes → then reveal the promotion",
      "FSP (10%): \"There's one more thing I can do if you decide to use our financing today.\" Pause. Let them lean in. → Reveal FSP → \"Just like Best Buy or Home Depot.\"",
      "After FSP: \"Given everything we've talked about today — does this feel like something you're ready to move forward with?\"",
      "Each discount requires a question first and an answer before the number drops",
    ],
    coachCriteria: [
      "Did the rep ask a question before dropping each discount?",
      "Did the rep wait for the homeowner to respond before revealing the new number?",
      "Did Discount 2 start with a question about whether upgrading would be worth it before revealing the promotion?",
      "Did the FSP feel like a final unlock with a pause rather than the next item on a list?",
      "Did the rep close the discount sequence with the readiness question?",
    ],
    robertStartingContext: `You are a homeowner at your kitchen table. The rep has shown you the retail packages and you have asked about the monthly payment on Platinum. The number is higher than you want but you are still engaged. You are genuinely interested in the Platinum package because of the 10-year installation warranty. You heard about TimeProof from a mailer. You will respond well when the rep references the mailer as a reason for a discount — it makes it feel earned. When the rep asks if upgrading to Platinum for close to the Elite payment would be worth it, you think about it genuinely and say yes. The FSP reveal will excite you — the Best Buy comparison makes sense to you. When the rep asks if you are ready to move forward you will pause and think — this is where any final hesitation surfaces.`,
    phaseCompletionSignal: `You signal phase completion when all three discounts have been applied and the rep asks the readiness question. Respond with your genuine reaction — either "yeah I think we're ready to move forward" or surface a final hesitation like "I want to talk to my wife before we sign anything." Either response signals the discount sequence phase is complete.`,
    rookieFocus: "Did the rep apply all three discounts in order? Did they ask a question before each drop? Did they deliver the FSP frame correctly?",
    repFocus: "Did each discount feel earned by the homeowner's response rather than automatic? Did the rep pause before the FSP reveal?",
    vetFocus: "Did the discount sequence feel like a natural conversation where the homeowner was unlocking savings through their own engagement, or did it feel like a scripted countdown?",
  },
  {
    id: "close",
    number: 10,
    label: "Phase 10 — Close",
    shortLabel: "Close",
    nepqGoal: "The close comes from the homeowner's own confirmation that the solution is right — not from the rep asking for the business after a countdown.",
    keyBehaviors: [
      'If they say yes: move to paperwork naturally — "Let me get the agreement pulled up"',
      "If they hesitate: ask what specifically is holding them back",
      "Credit card/check exception: \"I'm not supposed to do that — but if you're moving forward right now, I'll make the exception. In return I need two things from you.\"",
      "Ask 1: 5-star review while you're there",
      "Ask 2: referral — $500 if TimeProof sells that job",
      '"If they want to think: \"What specifically do you want to think through?\""',
      "If spouse not involved: offer to come back — do not try to close one leg",
    ],
    coachCriteria: [
      "Did the rep respond to hesitation with a question rather than pressure?",
      "Did the rep identify what specifically was holding the homeowner back?",
      "Did the rep handle the credit card exception correctly if it came up?",
      "Did the rep ask for the review and referral?",
      "Did the rep avoid pressuring a one-legged close if the spouse was not involved?",
    ],
    robertStartingContext: `You are a homeowner at your kitchen table. The rep has completed the full discount sequence and asked if you are ready to move forward. You are genuinely considering it. Your main hesitation is that you want your spouse to be part of this decision — they are home but has been in the other room this whole time. You did not bring this up earlier because you were not sure you would get this far. If the rep pushes you to sign without your spouse, you resist. If the rep acknowledges this and offers to bring your spouse in or come back, you are relieved and more likely to commit. If your spouse joins, they will have one question about the warranty. Answer that question and you are ready to move forward.`,
    phaseCompletionSignal: `You signal phase completion when a decision is reached — either you agree to move forward (and call your spouse in), or you agree to schedule a follow-up with your spouse present. Either outcome is a complete close phase. Say something like "let me go grab my wife" or "yeah let's do it" or "can you come back Thursday when we're both available?" to signal the phase is done.`,
    rookieFocus: "Did the rep ask for the business? Did they handle the spouse situation rather than ignoring it? Did they ask for the review and referral?",
    repFocus: "Did the rep respond to hesitation with curiosity rather than pressure? Did the close feel like a natural conclusion or a push?",
    vetFocus: "Did the homeowner feel like they made the decision themselves? Was the close earned by the full conversation or forced at the end?",
  },
];



export const NEPQ_STEPS: NEPQStepDefinition[] = [
  {
    number: 1,
    label: "Acknowledge Without Agreeing",
    shortLabel: "Acknowledge",
    goal: "Land with the homeowner. One sentence. Do not counter.",
    keyBehavior:
      '"I completely understand." / "That makes total sense." / "Of course."',
    warningIfSkipped:
      "Skipping acknowledgment signals defensiveness — the homeowner digs in harder.",
  },
  {
    number: 2,
    label: "Diagnose with a Question",
    shortLabel: "Diagnose",
    goal: "Ask before you answer. Find out what you're actually handling.",
    keyBehavior:
      'PRICE: "Is it the total investment, or the monthly payment?" · URGENCY: "What would need to happen for this to feel like the right time?" · TRUST: "What specifically would you want to feel confident about?"',
    warningIfSkipped:
      "Going straight to handle without diagnosing means you're answering a question they didn't ask.",
  },
  {
    number: 3,
    label: "Isolate",
    shortLabel: "Isolate",
    goal: "Confirm this is the only thing between you and a yes.",
    keyBehavior:
      '"So if we could [solve that] — is there anything else that would keep you from moving forward today?"',
    warningIfSkipped:
      "Without isolation, a second objection appears after you've solved the first one.",
  },
  {
    number: 4,
    label: "Handle the Real Objection",
    shortLabel: "Handle",
    goal: "Respond to what they told you in step 2 — not the surface objection.",
    keyBehavior:
      "The handle is almost always another question. Mirror their exact pain point back to a specific solution.",
    warningIfSkipped:
      "If you handle the surface objection without diagnosing first, you're guessing.",
  },
];
