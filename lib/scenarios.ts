import type {
  DrillScenario,
  HomeownerProfile,
  RoofProfile,
  DamageFinding,
  DamageSeverity,
  CoreObjection,
} from "./types";

const NAMES = [
  "Robert Martinez", "Linda Johnson", "Carlos Reyes", "Patricia Hernandez",
  "James Flores", "Sandra Torres", "Michael Chavez", "Barbara Gonzalez",
  "David Morales", "Jennifer Castillo", "Richard Ramirez", "Maria Garcia",
  "Thomas Jimenez", "Susan Lopez", "Daniel Rodriguez",
];

const HEARD_ABOUT_US = [
  "A neighbor down the street",
  "Door-to-door visit",
  "Yard sign in the neighborhood",
  "Google search",
  "Referral from a friend",
  "Facebook ad",
  "NextDoor recommendation",
];

const FAMILY_SITUATIONS = [
  "Lives with spouse",
  "Empty nesters",
  "Has young children at home",
  "Lives alone",
  "Multigenerational household",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

const FINDINGS_BY_SEVERITY: Record<DamageSeverity, Array<Omit<DamageFinding, "location">>> = {
  none: [
    {
      category: "Granule Accumulation",
      severity: "none",
      repNarration:
        "I found normal granule accumulation in the gutters — consistent with a roof at this age. No acute damage, but this roof is past its midpoint lifespan and approaching the replacement window.",
      consequence: "If left unaddressed, granule loss accelerates and leaves shingles vulnerable to UV damage.",
    },
    {
      category: "Algae Streaking",
      severity: "none",
      repNarration:
        "I noticed minor algae streaking across the north-facing slope. No structural concern yet, but algae accelerates shingle deterioration over time.",
      consequence: "Algae retention traps moisture and shortens shingle lifespan.",
    },
    {
      category: "UV Weathering",
      severity: "none",
      repNarration:
        "The shingles are showing standard UV weathering and minor curling at the edges — typical for a roof this age in the El Paso climate.",
      consequence: "Curling edges create wind lift points and eventual water infiltration.",
    },
  ],
  minor: [
    {
      category: "Granule Loss",
      severity: "minor",
      repNarration:
        "I found moderate granule loss across the south-facing slope. The shingles are losing their protective coating, which accelerates UV and heat damage.",
      consequence: "Accelerated UV exposure degrades the asphalt base, shortening roof life by 3-5 years.",
    },
    {
      category: "Missing Shingles",
      severity: "minor",
      repNarration:
        "There are 1-2 missing shingles near the ridge line, likely from recent wind. The exposed decking is vulnerable to the next storm.",
      consequence: "Each rain event on exposed decking risks water infiltration and wood rot.",
    },
    {
      category: "Exposed Nail Heads",
      severity: "minor",
      repNarration:
        "I spotted exposed nail heads along the rake edge — a common entry point for water infiltration.",
      consequence: "Water wicks along exposed nails directly into the decking.",
    },
    {
      category: "Algae Coverage",
      severity: "minor",
      repNarration:
        "Minor algae coverage across approximately 20% of the surface — early stage but will progress without treatment.",
      consequence: "Untreated algae spreads and traps moisture against the shingles.",
    },
  ],
  moderate: [
    {
      category: "Severe Granule Loss",
      severity: "moderate",
      repNarration:
        "I found severe granule loss on the south-facing slope. The shingles are essentially bare in places — no UV protection remaining.",
      consequence: "Bare shingles in El Paso's climate have a remaining lifespan of 1-2 seasons.",
    },
    {
      category: "Missing Shingles",
      severity: "moderate",
      repNarration:
        "Several missing shingles on the west face, concentrated near the hip. The underlayment underneath is exposed and degrading.",
      consequence: "Degraded underlayment is the last barrier before water enters the structure.",
    },
    {
      category: "Soft Spot — OSB Decking",
      severity: "moderate",
      repNarration:
        "I identified a soft spot near the north valley — approximately 2 square feet of compromised OSB decking. The homeowner was not aware of this.",
      consequence: "Compromised decking cannot support the weight of a new roof installation without repair.",
    },
    {
      category: "Chimney Flashing Failure",
      severity: "moderate",
      repNarration:
        "The flashing at the chimney base has separated and is no longer creating a watertight seal. This is a direct water entry point.",
      consequence: "Every rainfall sends water directly into the chimney-wall junction.",
    },
    {
      category: "Valley Deterioration",
      severity: "moderate",
      repNarration:
        "Valley deterioration along the main drainage channel — the metal is corroding and the seal is failing.",
      consequence: "Valley failure redirects roof drainage into the structure rather than off the edge.",
    },
    {
      category: "Moisture Staining",
      severity: "moderate",
      repNarration:
        "I found moisture staining on the decking in the attic near the north eave — early sign of water infiltration that hasn't broken through the ceiling yet.",
      consequence: "The homeowner doesn't know yet, but water has already entered the structure.",
    },
  ],
  severe: [
    {
      category: "Wind Damage — Multiple Faces",
      severity: "severe",
      repNarration:
        "Many missing shingles across multiple faces — this roof has sustained significant wind damage.",
      consequence: "Multiple open faces mean water entry at every rain event.",
    },
    {
      category: "Large Soft Spot — Valley",
      severity: "severe",
      repNarration:
        "I found a large soft spot spanning approximately 6 square feet near the center valley — the decking has been compromised by prolonged moisture exposure.",
      consequence: "This area will require full decking replacement before any new shingles can be installed.",
    },
    {
      category: "Active Mold — Attic",
      severity: "severe",
      repNarration:
        "There is active mold growth on the attic decking near the north eave. This is a health and structural concern that needs to be addressed immediately.",
      consequence: "Active mold requires remediation before roof installation and poses a health risk to occupants.",
    },
    {
      category: "Dry Rot — Decking",
      severity: "severe",
      repNarration:
        "I found dry rot on two sections of decking — the wood has lost structural integrity and will need to be replaced before new shingles can be installed.",
      consequence: "Dry rot spreads. Delaying replacement increases the scope and cost of the repair.",
    },
    {
      category: "Hail Damage",
      severity: "severe",
      repNarration:
        "Significant storm damage is visible — hail bruising across most of the south face, with impact marks indicating the protective granules have been knocked loose.",
      consequence: "Hail damage is an insurance claim event. This roof qualifies for full replacement.",
    },
    {
      category: "Ridge Cap Failure",
      severity: "severe",
      repNarration:
        "The ridge cap is cracked and lifting in multiple places — the highest point of the roof has no effective protection.",
      consequence: "Open ridge means wind-driven rain enters the attic at the peak of every storm.",
    },
    {
      category: "Multiple Flashing Failures",
      severity: "severe",
      repNarration:
        "Multiple flashing failures at the chimney, two pipe vents, and the valley — there are at least four active water entry points.",
      consequence: "Four simultaneous entry points guarantee interior damage in the next significant storm.",
    },
    {
      category: "Ventilation Failure",
      severity: "severe",
      repNarration:
        "Ventilation is critically compromised — the soffits are blocked and the ridge vent is clogged. The attic is running at extreme temperatures, which is cooking the shingles from below.",
      consequence: "Extreme attic heat cuts shingle lifespan by 30-40% and drives up cooling costs.",
    },
  ],
};

const URGENCY_SUMMARY: Record<DamageSeverity, string> = {
  none: "This roof has no acute damage but is approaching the end of its effective lifespan. The opportunity here is a proactive replacement before a problem develops — and locking in today's pricing before material costs increase.",
  minor:
    "This roof has early-stage issues that are manageable now but will compound without attention. Left untreated, minor findings become moderate damage within 12-18 months.",
  moderate:
    "This roof has multiple active concerns that present real risk in the next storm season. The soft spot and missing shingles are the most urgent — these are not cosmetic issues.",
  severe:
    "This roof is at critical failure. The combination of structural damage, active moisture intrusion, and ventilation failure means the next significant storm could result in interior damage. This is not a deferred maintenance situation.",
};

const PERSONALITY_TO_OBJECTION: Record<
  HomeownerProfile["personality"],
  { core: CoreObjection; variations: string[] }
> = {
  "price-sensitive": { core: "price", variations: ["p1", "p2"] },
  "prior-bad-experience": { core: "trust", variations: ["t3"] },
  skeptical: { core: "trust", variations: ["t1", "t4"] },
  trusting: { core: "urgency", variations: ["u1", "u2"] },
  "no-strong-bias": {
    core: pick(["price", "urgency", "trust"]) as CoreObjection,
    variations: ["p1", "p2", "p3", "p4", "u1", "u2", "u3", "u4", "t1", "t2", "t3", "t4"],
  },
};

const LOCATIONS = [
  "south-facing slope", "north-facing slope", "east face", "west face",
  "main valley", "secondary valley", "ridge line", "hip section",
  "chimney base", "pipe vent area", "rake edge", "soffit line", "attic",
];

// Personality types unlocked by mastering specific preset scenarios.
// Default (no unlocks): only trusting + no-strong-bias, minor/moderate severity only.
const PERSONALITY_UNLOCK_MAP: Record<string, HomeownerProfile["personality"]> = {
  "the-open-door": "trusting",
  "the-price-shopper": "price-sensitive",
  "the-researcher": "skeptical",
  "the-procrastinator": "no-strong-bias",
  "the-burned-homeowner": "prior-bad-experience",
};

const SEVERITY_UNLOCK_SLUGS = new Set(["the-storm-victim"]);

export function generateScenario(options?: { unlockedSlugs?: string[] }): DrillScenario {
  const unlockedSlugs = options?.unlockedSlugs ?? [];

  // Determine which personalities are available
  let availablePersonalities: HomeownerProfile["personality"][] = ["trusting", "no-strong-bias"];
  for (const [slug, personality] of Object.entries(PERSONALITY_UNLOCK_MAP)) {
    if (unlockedSlugs.includes(slug) && !availablePersonalities.includes(personality)) {
      availablePersonalities.push(personality);
    }
  }

  // Determine available severities
  const severeUnlocked = unlockedSlugs.some((s) => SEVERITY_UNLOCK_SLUGS.has(s));
  const availableSeverities: DamageSeverity[] = severeUnlocked
    ? ["none", "minor", "moderate", "severe"]
    : ["none", "minor", "moderate"];

  const personality = pick(availablePersonalities);
  const severity = pick(availableSeverities);

  const homeowner: HomeownerProfile = {
    name: pick(NAMES),
    ageRange: pick(["35-45", "45-55", "55-65"]),
    yearsInHome: Math.floor(Math.random() * 25) + 3,
    familySituation: pick(FAMILY_SITUATIONS),
    personality,
    contractorHistory: pick(["good", "bad", "none"]),
    howHeardAboutUs: pick(HEARD_ABOUT_US),
    spousePresent: Math.random() > 0.4,
  };

  const roof: RoofProfile = {
    age: severity === "none" ? Math.floor(Math.random() * 8) + 10
       : severity === "minor" ? Math.floor(Math.random() * 5) + 12
       : severity === "moderate" ? Math.floor(Math.random() * 5) + 15
       : Math.floor(Math.random() * 5) + 18,
    shingleType: pick(["3-tab", "architectural", "designer"]),
    severity,
  };

  const findingPool = FINDINGS_BY_SEVERITY[severity];
  const count = severity === "none" ? pick([1, 2])
              : severity === "minor" ? pick([2, 3])
              : severity === "moderate" ? pick([3, 4, 5])
              : pick([5, 6, 7]);

  const rawFindings = pickN(findingPool, Math.min(count, findingPool.length));
  const findings: DamageFinding[] = rawFindings.map((f) => ({
    ...f,
    location: pick(LOCATIONS),
  }));

  const objectionMap = PERSONALITY_TO_OBJECTION[personality];
  const core = objectionMap.core;
  const variationId = pick(objectionMap.variations);

  // Map variation id to variation text
  const variationLabels: Record<string, string> = {
    p1: "That's more than I expected",
    p2: "It doesn't fit our budget",
    p3: "The other guy was cheaper",
    p4: "Can you do better on the price?",
    u1: "I need to think about it",
    u2: "It's not leaking inside yet",
    u3: "We want to wait until after the holidays",
    u4: "Let me do more research",
    t1: "I want to get other quotes",
    t2: "I need to talk to my spouse",
    t3: "I've had bad experiences with contractors",
    t4: "How long have you been in El Paso?",
  };

  return {
    homeowner,
    roof,
    findings,
    urgencySummary: URGENCY_SUMMARY[severity],
    predictedObjection: {
      core,
      variation: variationLabels[variationId] ?? variationId,
      variationId,
    },
  };
}

// ── Scenario hash ─────────────────────────────────────────────────────────────

/** Stable identifier for grouping related phase drills on the same scenario */
export function computeScenarioHash(scenario: DrillScenario): string {
  const name = scenario.homeowner.name.replace(/\s+/g, "_").toLowerCase();
  const roofAge = scenario.roof.age;
  return `${name}_${roofAge}`;
}

// ── localStorage scenario persistence ────────────────────────────────────────

const SCENARIO_KEY = "tp_active_scenario";
const SCENARIO_TTL_MS = 24 * 60 * 60 * 1000;

interface StoredScenario {
  scenario: DrillScenario;
  savedAt: number;
}

export function saveScenario(scenario: DrillScenario): void {
  if (typeof window === "undefined") return;
  const payload: StoredScenario = { scenario, savedAt: Date.now() };
  localStorage.setItem(SCENARIO_KEY, JSON.stringify(payload));
}

export function loadScenario(): DrillScenario | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SCENARIO_KEY);
    if (!raw) return null;
    const stored: StoredScenario = JSON.parse(raw);
    if (Date.now() - stored.savedAt > SCENARIO_TTL_MS) {
      localStorage.removeItem(SCENARIO_KEY);
      return null;
    }
    return stored.scenario;
  } catch {
    return null;
  }
}

export function clearScenario(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SCENARIO_KEY);
}
