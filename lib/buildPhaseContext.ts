import type { DrillScenario, PresentationContext, ExperienceLevel } from "./types";
import { TIMEPROOF_PHASES, NEPQ_SEQUENCE } from "./constants";

// Build a full PresentationContext for a phase drill.
// Combines pre-written phase baseline with the selected scenario's specifics.
export function buildPhaseContext(params: {
  phaseId: string;
  trainingMode: "timeproof" | "nepq";
  scenario: DrillScenario;
  experienceLevel: ExperienceLevel;
}): PresentationContext {
  const { phaseId, trainingMode, scenario } = params;

  const phases = trainingMode === "timeproof" ? TIMEPROOF_PHASES : NEPQ_SEQUENCE;
  const currentPhaseIndex = phases.findIndex((p) => p.id === phaseId);
  const priorPhases = currentPhaseIndex > 0 ? phases.slice(0, currentPhaseIndex) : [];

  const phasesCompleted = priorPhases.map((p) => `${p.label} — completed`);
  const keyMoments = buildKeyMomentsForPhase(phaseId, trainingMode, scenario);
  const robertCurrentMood = buildRobertMoodForPhase(phaseId, trainingMode, scenario);
  const robertExpectation = buildRobertExpectationForPhase(phaseId, trainingMode);

  return {
    homeownerName: scenario.homeowner.name,
    homeownerPersonality: scenario.homeowner.personality,
    roofAge: scenario.roof.age,
    roofSeverity: scenario.roof.severity,
    damageFindings: scenario.findings.map((f) => f.repNarration),
    urgencySummary: scenario.urgencySummary,
    phasesCompleted,
    keyMomentsFromPriorPhases: keyMoments,
    robertCurrentMood,
    robertExpectation,
  };
}

// Key moments by phase — what Robert has agreed to or heard entering each phase
function buildKeyMomentsForPhase(
  phaseId: string,
  mode: string,
  scenario: DrillScenario,
): string[] {
  const name = scenario.homeowner.name;
  const severity = scenario.roof.severity;
  const finding = scenario.findings[0]?.category || "roof damage";
  const finding2 = scenario.findings[1]?.category || "additional issues";

  const timeproofMoments: Record<string, string[]> = {
    initiate_investigate: [],

    educate: [
      `${name} confirmed they are the homeowner and all decision makers are present`,
      `${name} shared how they heard about TimeProof and what caught their attention`,
      `${name} acknowledged they do not know much about the roofing industry`,
      `The rep walked the roof and found: ${scenario.findings.map((f) => f.category).join(", ")}`,
      `The reveal was completed — ${name} saw the inspection photos and acknowledged the damage looks significant`,
      `${name} expressed specific concern about the ${finding}`,
      `${name} agreed the damage is more extensive than they realized`,
    ],

    differentiate: [
      `${name} confirmed they are the homeowner and all decision makers are present`,
      `Full inspection completed — ${severity} damage found including ${finding} and ${finding2}`,
      `${name} saw all inspection photos and said the damage looks serious`,
      `${name} agreed their home is one of their most valuable investments (Slide 1)`,
      `${name} agreed that educated consumers do not get three estimates anymore (PNS)`,
      `${name} confirmed they feel they can trust TimeProof (Slide 12 tie-down)`,
      `Rep has not yet shown the product or discussed price`,
      `${name} is engaged and ready to hear about the roofing system`,
    ],

    motivate: [
      `Full inspection completed — ${name} saw photos and acknowledged ${severity} damage`,
      `Full company story delivered through Slide 12 — ${name} said "I feel like I can trust you guys"`,
      `Full product presentation completed — all 8 components shown and handled`,
      `TIME LOCK system explained — ${name} engaged with the Defend/Seal/Breathe/Comfort framework`,
      `Preferred Contractor status explained — ${name} understood this is not available off the shelf`,
      `Platinum warranty presented — ${name} said the 10-year installation warranty is important to them`,
      `What to Expect and Respect for Property explained`,
      `Bridge to pre-close delivered`,
      `Pre-close completed — ${name} said only affordability remains as a concern`,
      `Value confirmation completed — ${name} said "yes, this feels like the right solution"`,
      `${name} said quality matters more than the cheapest option`,
      `${name} is bracing to see a number — has no idea what a roof costs`,
    ],

    saturate: [],
  };

  const nepqMoments: Record<string, string[]> = {
    connection: [],

    situation: [
      `${name} invited the rep inside after the permission frame was delivered`,
      `${name} confirmed spouse is present (or not present — per scenario)`,
      `Rep has not yet asked about the roof specifically`,
    ],

    problem_awareness: [
      `${name} shared they heard about TimeProof from ${scenario.homeowner.howHeardAboutUs}`,
      `${name} mentioned they noticed ${finding} but downplayed it`,
      `${name} has been in this home ${scenario.homeowner.yearsInHome} years`,
      `${name} said they have not had anyone look at the roof recently`,
      `Rep has opened up the situation questions successfully`,
    ],

    inspection_reveal: [
      `${name} opened up about the ${finding} when asked — admitted it has been on their mind`,
      `${name} said "I guess I've been putting it off" when asked how long they've known`,
      `${name} described what it would mean for their family if a leak developed`,
      `${name}'s emotional ownership of the problem is established`,
      `Rep is transitioning to the inspection walk`,
    ],

    company_story: [
      `Full inspection completed — ${severity} damage found including ${finding}`,
      `${name} came back inside and saw the reveal photos`,
      `${name} said "okay that looks pretty bad" when shown the photos`,
      `${name} asked "what does this mean for us?" — ready to move forward`,
      `NEPQ problem awareness is fully established`,
    ],

    product_presentation: [
      `All prior phases completed including inspection, reveal, and company story`,
      `${name} agreed their home is their most valuable investment`,
      `${name} confirmed they feel they can trust TimeProof`,
      `${name} is engaged and curious about the product`,
      `${name} mentioned their specific concerns: ${finding} and El Paso heat`,
    ],

    solution_awareness: [
      `Full product presentation completed`,
      `${name} held the samples and engaged with the materials`,
      `${name} said the 10-year installation warranty is important to them`,
      `${name} confirmed the products address their specific concerns`,
      `Rep asked about peace of mind — ${name} said "that does give me some peace of mind"`,
    ],

    price_financing: [
      `${name} confirmed this is the right solution when asked directly`,
      `${name} said quality matters more than cheapest option`,
      `Pre-close completed — ${name} said only affordability remains`,
      `${name} is ready to hear the estimate — bracing slightly for the number`,
      `Financing has been introduced as a smart financial tool`,
    ],

    nepq_discounts: [
      `Estimate shown — ${name} paused and said it is more than they expected`,
      `Financing transition landed well — ${name} asked about monthly payment`,
      `${name} engaged with the Platinum package monthly payment`,
      `${name} is ready for discount discussion`,
    ],

    close: [
      `Full discount sequence completed`,
      `All three discounts applied — National, Local, and FSP`,
      `${name} said "I think we're ready to move forward" or similar`,
      `${name} may want to involve spouse before signing`,
    ],
  };

  const momentMap = mode === "timeproof" ? timeproofMoments : nepqMoments;
  return momentMap[phaseId] ?? [];
}

// Robert's mood entering each phase
function buildRobertMoodForPhase(
  phaseId: string,
  mode: string,
  scenario: DrillScenario,
): string {
  const personality = scenario.homeowner.personality;
  const severity = scenario.roof.severity;

  const moods: Record<string, string> = {
    // TimeProof
    initiate_investigate: `Cautious and slightly guarded. ${personality === "prior-bad-experience" ? "Has been burned by contractors before and is defensive." : "Polite but has guard up."}`,
    educate: `Unsettled from the reveal photos. Saw damage that was worse than expected. Emotionally engaged but not yet trusting the company. Ready to hear who TimeProof is.`,
    differentiate: `Trusts TimeProof after the company story. Agreed to the tie-down. Now curious about what actually goes on the roof. ${severity === "severe" ? "Still processing how serious the damage is." : "Focused on understanding what he is getting for the money."}`,
    motivate: `Impressed with the product quality and trusts the company. Has held the samples. Agreed that quality matters. Bracing for the price — has no idea what a roof costs. The only remaining question in his mind is whether it is affordable.`,
    saturate: `Engaged and ready to move forward.`,
    // NEPQ
    connection: `Guarded. Doesn't want another pushy sales visit.`,
    situation: `Warmer after being invited in. Cautiously open to conversation.`,
    problem_awareness: `Has shared the situation. Beginning to open up. The rep has been asking good questions.`,
    inspection_reveal: `Carrying quiet anxiety about the damage. Said he has been putting it off. Emotionally connected to the problem but not dramatic about it.`,
    company_story: `The photos landed. He said the damage looks bad. He is ready to hear what can be done and who is going to do it.`,
    product_presentation: `Trusts the company. Curious about the products. Expects the rep to connect the products to his specific concerns.`,
    solution_awareness: `Engaged with the product quality. The 10-year warranty matters to him. Getting closer to a decision but the price question is looming.`,
    price_financing: `Has confirmed this is the right solution. Is bracing slightly for the number. Open to financing if it makes the monthly payment manageable.`,
    nepq_discounts: `Saw the estimate and it was more than he hoped. Not hostile — just hasn't seen a number that works yet. Still wants to move forward if the price can get there.`,
    close: `The discounts have been applied. He is at a decision point. May want to involve his spouse before signing.`,
  };

  return moods[phaseId] ?? "Engaged and ready for this phase of the conversation.";
}

// What Robert expects is about to happen entering each phase
function buildRobertExpectationForPhase(phaseId: string, mode: string): string {
  void mode;
  const expectations: Record<string, string> = {
    initiate_investigate: "Another salesperson is at his door.",
    educate:
      "The rep is about to tell him about their company. He hopes it is not a boring sales pitch.",
    differentiate:
      "The rep is about to show him what actually goes on a roof. He is curious.",
    motivate:
      "He is about to see a number. He is hoping it is not too far out of range.",
    saturate: "The rep is about to follow up on the project.",
    connection: "Another sales pitch he will have to manage.",
    situation:
      "The rep is going to start asking questions. He is okay with this.",
    problem_awareness: "The rep is going to ask more questions about the roof.",
    inspection_reveal:
      "The rep is going to take him outside to look at the roof.",
    company_story: "The rep is going to tell him about their company.",
    product_presentation: "The rep is going to show him what goes on a roof.",
    solution_awareness: "The rep is going to start moving toward price.",
    price_financing: "The rep is about to show him the estimate.",
    nepq_discounts: "The rep is going to try to bring the price down.",
    close: "The rep is going to ask him to sign something.",
  };

  return expectations[phaseId] ?? "The next phase of the conversation is about to begin.";
}
