import type { DrillScenario } from "./types";

export interface PresetScenarioDefinition {
  slug: string;
  tier: 1 | 2 | 3;
  orderInTier: number;
  title: string;
  subtitle: string;
  description: string;
  challenge: string;
  primaryObjectionCore: "price" | "urgency" | "trust" | "mixed";
  masteryThreshold: number;
  scenario: DrillScenario;
}

// Mastery mapping for random generator unlock logic
export const MASTERY_UNLOCK_MAP: Record<string, string[]> = {
  "the-open-door": ["trusting"],
  "the-price-shopper": ["price-sensitive"],
  "the-researcher": ["skeptical"],
  "the-procrastinator": ["no-strong-bias"],
  "the-burned-homeowner": ["prior-bad-experience"],
  "the-skeptical-spouse": [], // enables spouse conflict scenarios
  "the-storm-victim": [], // enables severe damage
  "the-informed-skeptic": [], // enables mixed-core
  "the-almost-close": [], // enables late-stage objection
};

export const PRESET_SCENARIOS: PresetScenarioDefinition[] = [
  // ── TIER 1 — FOUNDATION ──────────────────────────────────────────────────

  {
    slug: "the-open-door",
    tier: 1,
    orderInTier: 1,
    title: "The Open Door",
    subtitle: "Trusting homeowner · Minor damage · No strong objections",
    description:
      "Maria is friendly, engaged, and genuinely interested in protecting her home. She has noticed some minor issues but hasn't acted on them. This scenario is designed to build baseline fluency and confidence — the homeowner is receptive but still needs to be led through the full process correctly.",
    challenge:
      "Baseline fluency. Running the full presentation cleanly with a cooperative homeowner. Building the habit of hitting every phase.",
    primaryObjectionCore: "urgency",
    masteryThreshold: 80,
    scenario: {
      homeowner: {
        name: "Maria Flores",
        ageRange: "45-55",
        yearsInHome: 8,
        familySituation: "Husband Carlos is present and seated at the table",
        personality: "trusting",
        contractorHistory: "good",
        howHeardAboutUs: "neighbor referral",
        spousePresent: true,
      },
      roof: {
        age: 12,
        shingleType: "architectural",
        severity: "minor",
      },
      findings: [
        {
          category: "Granule loss",
          location: "South-facing slope",
          severity: "Moderate",
          repNarration:
            "I found moderate granule loss across the south-facing slope. The shingles are losing their protective coating which accelerates UV and heat damage in the El Paso climate.",
          consequence:
            "Without the granule layer, UV radiation degrades the asphalt underneath. This roof is approaching accelerated aging.",
        },
        {
          category: "Algae streaking",
          location: "North face",
          severity: "Minor",
          repNarration:
            "I noticed minor algae streaking across about 20% of the north-facing slope. Early stage but will progress without treatment.",
          consequence:
            "Algae holds moisture against the shingle surface, accelerating deterioration over time.",
        },
        {
          category: "Exposed nail heads",
          location: "Rake edge",
          severity: "Minor",
          repNarration:
            "I spotted a few exposed nail heads along the rake edge — a common but overlooked entry point for water infiltration.",
          consequence:
            "Each exposed nail head is a potential water entry point, especially during wind-driven rain.",
        },
      ],
      urgencySummary:
        "This roof has early-stage issues that are manageable now but will compound without attention. The granule loss is the primary concern — left untreated, this accelerates into moderate damage within 12-18 months.",
      predictedObjection: {
        core: "urgency",
        variation: "I need to think about it",
        variationId: "u1",
      },
    },
  },

  {
    slug: "the-price-shopper",
    tier: 1,
    orderInTier: 2,
    title: "The Price Shopper",
    subtitle: "Price-sensitive homeowner · Moderate damage · Expects the cheapest option",
    description:
      "David has been getting quotes and knows roughly what he wants to pay. He's not hostile — he just has a number in his head and needs to understand why quality matters more than that number. This scenario trains the price objection handling framework from the ground up.",
    challenge:
      "Price objection. Shifting the conversation from total cost to value, monthly payment, and the cost of choosing wrong.",
    primaryObjectionCore: "price",
    masteryThreshold: 80,
    scenario: {
      homeowner: {
        name: "David Johnson",
        ageRange: "45-55",
        yearsInHome: 6,
        familySituation:
          "Wife is at work — David is the decision maker today but will want to talk to her",
        personality: "price-sensitive",
        contractorHistory: "none",
        howHeardAboutUs: "online ad",
        spousePresent: false,
      },
      roof: {
        age: 14,
        shingleType: "3-tab",
        severity: "moderate",
      },
      findings: [
        {
          category: "Granule loss",
          location: "South and west slopes",
          severity: "Severe",
          repNarration:
            "I found severe granule loss across the south and west slopes. The shingles are essentially bare in places — no UV protection remaining on those faces.",
          consequence:
            "The asphalt is directly exposed to El Paso sun. These shingles are beyond their effective protection window.",
        },
        {
          category: "Missing shingles",
          location: "West face near hip",
          severity: "Moderate",
          repNarration:
            "Several missing shingles on the west face concentrated near the hip. The underlayment underneath is exposed and degrading.",
          consequence:
            "The next wind event could lift additional shingles. The exposed underlayment is not designed for long-term exposure.",
        },
        {
          category: "Soft spot",
          location: "North valley",
          severity: "Moderate",
          repNarration:
            "I identified a soft spot near the north valley — approximately 2 square feet of compromised OSB decking. The homeowner was not aware of this.",
          consequence:
            "Compromised decking cannot properly support new shingles. This area needs to be replaced before installation.",
        },
        {
          category: "Valley deterioration",
          location: "Main drainage channel",
          severity: "Moderate",
          repNarration:
            "Valley deterioration along the main drainage channel — the metal is corroding and the seal is failing.",
          consequence:
            "The valley is the primary water drainage path. A failing valley seal is a direct water entry point.",
        },
      ],
      urgencySummary:
        "This roof has multiple active concerns that present real risk in the next storm season. The soft spot and missing shingles are the most urgent — these are not cosmetic issues. A moderate storm event could result in interior water damage.",
      predictedObjection: {
        core: "price",
        variation: "That's more than I expected",
        variationId: "p1",
      },
    },
  },

  {
    slug: "the-researcher",
    tier: 1,
    orderInTier: 3,
    title: "The Researcher",
    subtitle: "Informed homeowner · Moderate damage · Has done homework",
    description:
      "Sandra has spent time on Google, watched YouTube videos about roofing, and has specific questions. She's not skeptical of the company — she's skeptical of the industry. She wants to understand what she's buying before she buys it. This scenario trains handling an informed homeowner who knows enough to ask hard questions.",
    challenge:
      "Handling knowledge. The rep must be more knowledgeable than the homeowner on product, process, and warranty — and must engage questions with confidence rather than deflecting.",
    primaryObjectionCore: "urgency",
    masteryThreshold: 80,
    scenario: {
      homeowner: {
        name: "Sandra Torres",
        ageRange: "35-45",
        yearsInHome: 4,
        familySituation: "Single homeowner — Sandra makes decisions independently",
        personality: "skeptical",
        contractorHistory: "none",
        howHeardAboutUs: "mailer",
        spousePresent: false,
      },
      roof: {
        age: 9,
        shingleType: "architectural",
        severity: "moderate",
      },
      findings: [
        {
          category: "Improper flashing",
          location: "Chimney base and two pipe vents",
          severity: "Moderate",
          repNarration:
            "The flashing at the chimney base has separated and is no longer creating a watertight seal. I also found improper flashing at two pipe vents — the seals have dried and cracked.",
          consequence:
            "These are direct water entry points. Flashing failures are the number one cause of leak-related interior damage.",
        },
        {
          category: "Moisture staining",
          location: "Attic — north eave",
          severity: "Moderate",
          repNarration:
            "I found moisture staining on the decking in the attic near the north eave — early sign of water infiltration that hasn't broken through the ceiling yet.",
          consequence:
            "The moisture is already past the shingles. Without intervention this will result in mold growth and decking deterioration.",
        },
        {
          category: "Ventilation issue",
          location: "Soffits",
          severity: "Minor",
          repNarration:
            "The soffits show partial blockage — intake ventilation is reduced. The attic is running hotter than it should for a roof this age.",
          consequence:
            "Poor ventilation accelerates shingle aging from below and increases energy costs for cooling.",
        },
      ],
      urgencySummary:
        "This roof has active water infiltration in progress. The attic moisture staining confirms water is past the first line of defense. The flashing failures are the source and need to be addressed before the next rain event.",
      predictedObjection: {
        core: "urgency",
        variation: "Let me do more research",
        variationId: "u4",
      },
    },
  },

  {
    slug: "the-procrastinator",
    tier: 1,
    orderInTier: 4,
    title: "The Procrastinator",
    subtitle: "Urgency objection · Aging roof · No apparent leak yet",
    description:
      "Richard knows his roof is getting old but it hasn't caused any visible problems inside. He's been meaning to deal with it for two years. He's not hostile — he just doesn't feel the urgency yet. This scenario trains the hardest urgency objection: making damage feel real when it's not visible.",
    challenge:
      "Creating urgency without manufactured fear. The rep must use the inspection findings and consequence questions to make invisible damage feel real.",
    primaryObjectionCore: "urgency",
    masteryThreshold: 80,
    scenario: {
      homeowner: {
        name: "Richard Ramirez",
        ageRange: "55-65",
        yearsInHome: 18,
        familySituation: "Wife Barbara is home and joins partway through",
        personality: "no-strong-bias",
        contractorHistory: "good",
        howHeardAboutUs: "door knock",
        spousePresent: true,
      },
      roof: {
        age: 19,
        shingleType: "3-tab",
        severity: "moderate",
      },
      findings: [
        {
          category: "Advanced aging",
          location: "All slopes",
          severity: "Moderate",
          repNarration:
            "This roof is 19 years old with 3-tab shingles rated for 20-25 years under ideal conditions. El Paso's UV intensity and heat significantly reduce that lifespan. The shingles are at the end of their effective life.",
          consequence:
            "A roof at this age does not fail gradually — it fails suddenly. One significant storm event can result in multiple simultaneous failures.",
        },
        {
          category: "Cracked and curling shingles",
          location: "South and west slopes",
          severity: "Moderate",
          repNarration:
            "I found significant cracking and edge curling on the south and west slopes. The shingles have lost their flexibility from years of UV exposure.",
          consequence:
            "Curled shingles catch wind. In a storm, these are the first to lift — and lifting one shingle exposes the ones around it.",
        },
        {
          category: "Granule accumulation",
          location: "Gutters",
          severity: "Severe",
          repNarration:
            "The gutters have significant granule accumulation — this is the protective coating washing off the shingles. I can show you what the gutters look like.",
          consequence:
            "This level of granule loss means the shingles are near the end of their protective life. They cannot be restored — only replaced.",
        },
      ],
      urgencySummary:
        "This roof has no acute single-point failure but is in systemic decline. At 19 years with this level of deterioration, the question is not whether it will fail — it's whether it fails before or after the next monsoon season.",
      predictedObjection: {
        core: "urgency",
        variation: "It's not leaking inside yet",
        variationId: "u2",
      },
    },
  },

  // ── TIER 2 — CHALLENGE ────────────────────────────────────────────────────

  {
    slug: "the-burned-homeowner",
    tier: 2,
    orderInTier: 1,
    title: "The Burned Homeowner",
    subtitle: "Prior contractor disaster · Trust is the core challenge",
    description:
      "Patricia had a roofing company destroy her gutters, leave debris in the yard, and disappear before fixing a leak they caused. She called three times and never got a callback. She agreed to this appointment reluctantly and is ready to walk at the first sign of a sales pitch. This is the hardest trust scenario — generic reassurance makes it worse.",
    challenge:
      "Trust recovery. The rep must surface the specific bad experience and mirror it back to a specific protection. Every generic company claim will be met with skepticism.",
    primaryObjectionCore: "trust",
    masteryThreshold: 80,
    scenario: {
      homeowner: {
        name: "Patricia Hernandez",
        ageRange: "55-65",
        yearsInHome: 22,
        familySituation:
          "Husband is traveling for work — Patricia is making this decision alone",
        personality: "prior-bad-experience",
        contractorHistory: "bad",
        howHeardAboutUs: "neighbor referral",
        spousePresent: false,
      },
      roof: {
        age: 16,
        shingleType: "architectural",
        severity: "moderate",
      },
      findings: [
        {
          category: "Previous repair failure",
          location: "North valley",
          severity: "Severe",
          repNarration:
            "I found evidence of a previous repair attempt in the north valley — the flashing was improperly installed and has already begun to separate. The prior contractor's work is failing.",
          consequence:
            "The valley is the primary drainage point. The failed repair is actively funneling water toward the eave.",
        },
        {
          category: "Missing shingles",
          location: "West slope",
          severity: "Moderate",
          repNarration:
            "Several missing shingles on the west slope — these appear to be from a previous storm that the prior repair did not fully address.",
          consequence:
            "Each missing shingle is an unprotected section of underlayment exposed to the elements.",
        },
        {
          category: "Attic moisture",
          location: "North eave",
          severity: "Moderate",
          repNarration:
            "Moisture staining on the attic decking near the north eave. This is consistent with the valley flashing failure — water is tracking down the interior slope.",
          consequence:
            "Without intervention this moisture will result in mold growth. The prior repair did not stop the water — it redirected it.",
        },
      ],
      urgencySummary:
        "This roof has an active water intrusion path created by a failed prior repair. The damage is compounding. The previous contractor's work has made the situation worse, not better.",
      predictedObjection: {
        core: "trust",
        variation: "I've had bad experiences with contractors",
        variationId: "t3",
      },
    },
  },

  {
    slug: "the-skeptical-spouse",
    tier: 2,
    orderInTier: 2,
    title: "The Skeptical Spouse",
    subtitle: "Split household · One engaged, one resistant",
    description:
      "James is interested and engaged throughout the presentation. His wife Linda joins halfway through and immediately pumps the brakes. She wasn't part of the earlier conversation, doesn't have the context, and views this as a rushed decision. The rep has to bring her up to speed while keeping James engaged — without making either feel ignored.",
    challenge:
      "Managing a split room. The rep must earn both people simultaneously, bring the late-arriving spouse into the conversation without starting over, and close a two-person decision.",
    primaryObjectionCore: "trust",
    masteryThreshold: 80,
    scenario: {
      homeowner: {
        name: "James Castillo",
        ageRange: "45-55",
        yearsInHome: 11,
        familySituation:
          "Wife Linda joins the table during the product presentation — she was not present for the warm-up or company story",
        personality: "trusting",
        contractorHistory: "none",
        howHeardAboutUs: "mailer",
        spousePresent: true,
      },
      roof: {
        age: 13,
        shingleType: "architectural",
        severity: "moderate",
      },
      findings: [
        {
          category: "Storm damage",
          location: "South slope",
          severity: "Moderate",
          repNarration:
            "I found hail bruising across the south face — impact marks where the protective granules have been knocked loose by hail strikes.",
          consequence:
            "Hail bruising accelerates shingle deterioration at the impact points. These areas age significantly faster than undamaged sections.",
        },
        {
          category: "Ridge cap damage",
          location: "Main ridge",
          severity: "Moderate",
          repNarration:
            "The ridge cap is cracked and lifting in two places. The ridge is the highest point of the roof and the most vulnerable to wind.",
          consequence:
            "A damaged ridge cap allows wind-driven rain to penetrate at the peak of the structure — water that enters here runs down both slopes internally.",
        },
        {
          category: "Soft spot",
          location: "East valley",
          severity: "Minor",
          repNarration:
            "A small soft spot near the east valley — approximately 1 square foot. Early-stage decking compromise.",
          consequence:
            "Small now, but decking deterioration is progressive. This area will need to be addressed at installation.",
        },
      ],
      urgencySummary:
        "This roof has storm damage that warrants replacement. The ridge cap and hail bruising are the primary concerns — both are accelerating deterioration that will compound through the next storm season.",
      predictedObjection: {
        core: "trust",
        variation: "I need to talk to my spouse",
        variationId: "t2",
      },
    },
  },

  {
    slug: "the-storm-victim",
    tier: 2,
    orderInTier: 3,
    title: "The Storm Victim",
    subtitle: "Severe damage · Insurance denied · Emotional and frustrated",
    description:
      "Michael has severe storm damage and filed an insurance claim that State Farm denied. He's frustrated, feels like he has no options, and is skeptical that anyone can actually help him. The rep must navigate real emotional distress, severe damage findings, and a homeowner who has already been let down once.",
    challenge:
      "Severe damage plus a denied claim. The rep must address the emotional component first, establish credibility around the insurance process, and build urgency around damage that is already critical.",
    primaryObjectionCore: "price",
    masteryThreshold: 80,
    scenario: {
      homeowner: {
        name: "Michael Chavez",
        ageRange: "35-45",
        yearsInHome: 7,
        familySituation:
          "Wife and two kids at home — financial decision is shared but Michael leads it",
        personality: "skeptical",
        contractorHistory: "none",
        howHeardAboutUs: "door knock after storm",
        spousePresent: false,
      },
      roof: {
        age: 11,
        shingleType: "architectural",
        severity: "severe",
      },
      findings: [
        {
          category: "Hail damage",
          location: "All slopes",
          severity: "Severe",
          repNarration:
            "Significant hail bruising across every face of the roof. The granule loss from impact is extensive — I can show you the pattern of strikes.",
          consequence:
            "This level of impact damage compromises the waterproofing capability of the entire roof, not just the impact points.",
        },
        {
          category: "Missing shingles",
          location: "West and south slopes",
          severity: "Severe",
          repNarration:
            "Many missing shingles on the west and south slopes from wind damage during the storm. The underlayment in these areas has been exposed for several weeks.",
          consequence:
            "Exposed underlayment is not designed for prolonged exposure. Continued weather events will accelerate deterioration significantly.",
        },
        {
          category: "Active leak",
          location: "Northeast corner",
          severity: "Severe",
          repNarration:
            "I found evidence of active water intrusion in the northeast corner of the attic — fresh moisture staining and early mold growth on the decking.",
          consequence:
            "This is not potential damage — this is ongoing damage. Every rain event worsens the interior condition.",
        },
        {
          category: "Structural decking",
          location: "Northeast and northwest areas",
          severity: "Severe",
          repNarration:
            "Two areas of compromised decking — northeast and northwest. Both are soft and will need to be replaced before new shingles can be installed.",
          consequence:
            "Structural decking compromise means the roof cannot support a new installation without remediation. This must be addressed.",
        },
      ],
      urgencySummary:
        "This roof is at critical failure. Active water intrusion is ongoing and mold has begun. Every week without intervention adds remediation cost and risk to the interior structure. This is not a deferred maintenance situation.",
      predictedObjection: {
        core: "price",
        variation: "It doesn't fit our budget",
        variationId: "p2",
      },
    },
  },

  {
    slug: "the-informed-skeptic",
    tier: 2,
    orderInTier: 4,
    title: "The Informed Skeptic",
    subtitle: "All three objection cores · Done research · Price-sensitive · Had a bad experience",
    description:
      "Barbara has done extensive research, had a bad experience with a different roofer two years ago, and has a firm number in her head based on online estimates. All three objection cores are present. This scenario requires mastery of price, urgency, and trust handling simultaneously — the rep cannot rely on one strong suit.",
    challenge:
      "Multi-core objection handling. Price sensitivity, prior bad experience, and deep skepticism all in one homeowner. The rep must diagnose which core is dominant in each moment and respond accordingly.",
    primaryObjectionCore: "mixed",
    masteryThreshold: 80,
    scenario: {
      homeowner: {
        name: "Barbara Gonzalez",
        ageRange: "55-65",
        yearsInHome: 20,
        familySituation:
          "Widowed — Barbara makes all decisions independently and is proud of her self-sufficiency",
        personality: "prior-bad-experience",
        contractorHistory: "bad",
        howHeardAboutUs: "online ad",
        spousePresent: false,
      },
      roof: {
        age: 17,
        shingleType: "3-tab",
        severity: "moderate",
      },
      findings: [
        {
          category: "Advanced granule loss",
          location: "All slopes",
          severity: "Severe",
          repNarration:
            "Severe granule loss across all slopes — the shingles are at the end of their protective life. For a 17-year-old 3-tab roof in El Paso, this is expected but critical.",
          consequence:
            "The protective coating is gone. UV radiation is now directly degrading the asphalt layer beneath.",
        },
        {
          category: "Failed prior repair",
          location: "West valley",
          severity: "Moderate",
          repNarration:
            "A prior repair attempt in the west valley is failing — the patch material is separating and the original damage is re-emerging.",
          consequence:
            "The failed repair is masking the true extent of the valley damage. A proper assessment requires removing the patch.",
        },
        {
          category: "Ventilation blockage",
          location: "Ridge vent",
          severity: "Minor",
          repNarration:
            "The ridge vent is partially blocked with debris — exhaust ventilation is significantly reduced.",
          consequence:
            "Reduced ventilation means the attic is running at higher temperatures, accelerating shingle aging from below.",
        },
      ],
      urgencySummary:
        "This roof is past its effective lifespan and has an active drainage failure from a prior repair. The combination of age, granule loss, and failed repair creates compounding risk that will accelerate rapidly.",
      predictedObjection: {
        core: "trust",
        variation: "I've had bad experiences with contractors",
        variationId: "t3",
      },
    },
  },

  {
    slug: "the-almost-close",
    tier: 2,
    orderInTier: 5,
    title: "The Almost Close",
    subtitle: "Full buy-in · Spouse objects at the end",
    description:
      "Thomas is completely sold. He loves the product, trusts the company, and is ready to sign. Then his wife Jennifer — who has been quietly present — speaks up with concerns about the financing terms and whether they should wait. The rep has spent an hour building trust with Thomas and now has to quickly earn Jennifer without starting over.",
    challenge:
      "The late-stage surprise objection. Everything goes well until the close — then the rep must pivot to a new audience without losing the first. Tests close discipline and spousal objection handling under pressure.",
    primaryObjectionCore: "trust",
    masteryThreshold: 80,
    scenario: {
      homeowner: {
        name: "Thomas Jimenez",
        ageRange: "45-55",
        yearsInHome: 14,
        familySituation:
          "Wife Jennifer has been present but quiet throughout — she speaks up directly before the close",
        personality: "trusting",
        contractorHistory: "good",
        howHeardAboutUs: "neighbor referral",
        spousePresent: true,
      },
      roof: {
        age: 15,
        shingleType: "architectural",
        severity: "moderate",
      },
      findings: [
        {
          category: "Wind damage",
          location: "South hip",
          severity: "Moderate",
          repNarration:
            "Wind damage along the south hip — several shingles have lifted and the seal strips have failed. These are vulnerable to the next wind event.",
          consequence:
            "Lifted shingles on a hip allow water to travel laterally under the shingle course — a failure mode that can affect a wide area quickly.",
        },
        {
          category: "Valley deterioration",
          location: "Both main valleys",
          severity: "Moderate",
          repNarration:
            "Both main valleys show metal corrosion and failing seals. The valleys handle the majority of roof drainage — both are compromised.",
          consequence:
            "Failed valleys mean water is not being properly channeled. Interior water intrusion risk is elevated at every rain event.",
        },
        {
          category: "Attic moisture",
          location: "South eave",
          severity: "Minor",
          repNarration:
            "Early moisture staining on the attic decking near the south eave — consistent with the valley drainage issue.",
          consequence:
            "The moisture confirms water is already past the first line of defense. Early stage, but progressing.",
        },
      ],
      urgencySummary:
        "This roof has active drainage failures at both valleys with confirmed interior moisture. The damage is moderate but the failure path is established — the next significant rain will worsen the interior condition.",
      predictedObjection: {
        core: "trust",
        variation: "I need to talk to my spouse",
        variationId: "t2",
      },
    },
  },
];
