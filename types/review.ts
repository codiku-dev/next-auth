type ReviewSummary = {
  summary: string;
  pros: Array<{
    description: string;
    frequency: string;
  }>;
  cons: Array<{
    description: string;
    frequency: string;
  }>;
};
