// Core data structures for the roadmap

export interface DailyTopic {
  day: number;
  title: string;
  topic: string;
  objectives: string[];
  theory: string;
  practicalTasks: string[];
  commands: string[];
  deliverables: string[];
  expectedOutcome: string;
  commonMistakes: string[];
  debuggingExercises: string[];
  productionMindset: string;
}

export interface WeeklyReview {
  week: number;
  title: string;
  miniProject: string;
  incidentSimulation: string;
  knowledgeReview: string[];
  architectureReview: string;
  documentationAssignment: string;
  days: DailyTopic[];
}

export interface MonthlyMilestone {
  month: number;
  title: string;
  description: string;
  largeProject: string;
  platformReview: string;
  securityReview: string;
  reliabilityReview: string;
  finalAssessment: string;
  weeks: WeeklyReview[];
}

export interface Roadmap {
  title: string;
  description: string;
  months: MonthlyMilestone[];
}
