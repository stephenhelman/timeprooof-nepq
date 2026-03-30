export type CoreObjection = "price" | "urgency" | "trust";
export type TrainingMode = "timeproof" | "nepq";
export type DrillType = "objection" | "walkthrough";
export type Intensity = "mild" | "firm" | "hostile";
export type DamageSeverity = "none" | "minor" | "moderate" | "severe";

export interface HomeownerProfile {
  name: string;
  ageRange: "35-45" | "45-55" | "55-65";
  yearsInHome: number;
  familySituation: string;
  personality:
    | "trusting"
    | "skeptical"
    | "price-sensitive"
    | "prior-bad-experience"
    | "no-strong-bias";
  contractorHistory: "good" | "bad" | "none";
  howHeardAboutUs: string;
  spousePresent: boolean;
}

export interface RoofProfile {
  age: number;
  shingleType: "3-tab" | "architectural" | "designer";
  severity: DamageSeverity;
}

export interface DamageFinding {
  category: string;
  location: string;
  severity: string;
  repNarration: string;
  consequence: string;
}

export interface DrillScenario {
  homeowner: HomeownerProfile;
  roof: RoofProfile;
  findings: DamageFinding[];
  urgencySummary: string;
  predictedObjection: {
    core: CoreObjection;
    variation: string;
    variationId: string;
  };
}

export interface ObjectionVariation {
  id: string;
  obj: string;
  sub: string;
  realFear: string;
}

export interface CoreObjectionData {
  label: string;
  color: string;
  bg: string;
  master: string;
  variations: ObjectionVariation[];
  handlers: Record<string, string[]>;
}

export interface ScoringCriterion {
  id: string;
  label: string;
  note: string;
  score: number;
}

export interface DebriefResult {
  criteria: Record<string, { score: number; note: string }>;
  overallScore: number;
  bestMoment: string;
  fixThis: string;
  oneLiner: string;
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  branch: string | null;
  drillCount: number;
  avgScore: number;
  bestScore: number;
  lastDrillAt: Date;
}

export interface ChatMessage {
  role: "user" | "assistant" | "coach";
  content: string;
  hint?: string;
  phase?: string;
}

export interface CreateSessionParams {
  drillType: DrillType;
  trainingMode: TrainingMode;
  objectionCore?: string;
  objectionVariation?: string;
  intensity?: Intensity;
  scenarioJson?: DrillScenario;
}

export interface LeaderboardParams {
  type?: "objection" | "walkthrough" | "all";
  mode?: "timeproof" | "nepq" | "all";
  period?: "week" | "month" | "all";
}

export type NEPQStep = 1 | 2 | 3 | 4;

export interface NEPQStepDefinition {
  number: NEPQStep;
  label: string;
  shortLabel: string;
  goal: string;
  keyBehavior: string;
  warningIfSkipped: string;
}

export interface StepAdvanceSignal {
  currentStep: NEPQStep;
  stepComplete: boolean;
  reason: string;
}

export interface CoachHintWithSignal {
  hint: string;
  stepSignal: StepAdvanceSignal;
  phaseComplete: boolean;
  phaseCompleteReason: string;
  behaviorsAchieved: string[];
}

export type ExperienceLevel = "rookie" | "rep" | "vet";

export interface ExperienceLevelConfig {
  id: ExperienceLevel;
  label: string;
  description: string;
  coachingApproach: string;
  robertBehavior: string;
}
