export const insuranceProviders = [
  "AOK",
  "TK (Techniker Krankenkasse)",
  "Barmer",
  "DAK-Gesundheit",
  "KKH",
  "IKK classic",
  "",
];
export type Step = (typeof steps)[number];

export const steps = ["name", "birthday", "insurance", "fitness", "activities", "location", "time", "review"] as const;

export const skippableSteps: Step[] = ["fitness", "activities", "location", "time", "insurance"];
