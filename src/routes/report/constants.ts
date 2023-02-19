export enum ReportTypeValues {
  Encouragement = 0,
  Bug,
  Cheat,
  Abuse,
  Idea,
  Offensive,
}

export const ReportTypePhrases: Record<ReportTypeValues, string> = {
  [ReportTypeValues.Encouragement]: "Encouragement",
  [ReportTypeValues.Bug]: "Bug",
  [ReportTypeValues.Cheat]: "Cheat",
  [ReportTypeValues.Abuse]: "Abuse",
  [ReportTypeValues.Idea]: "Idea",
  [ReportTypeValues.Offensive]: "Offensive",
};
