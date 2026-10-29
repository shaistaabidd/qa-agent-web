export type Coverage = {
  approvedScopeFeatures: number;
  coveragePercentage: number;
  testedScopeFeatures: number;
  totalScopeFeatures: number;
};

export type FindingsSummary = {
  bySeverity: { count: number; severity: 'CRITICAL' | 'HIGH' | 'LOW' | 'MEDIUM' }[];
  pendingClickUp: number;
  postedToClickUp: number;
  resolved: number;
  total: number;
  totalFindings: number;
};
