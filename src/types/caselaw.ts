// Shared types for caselaw opinions and search results

export interface CaseLawOpinion {
  id: string;
  case_name: string;
  court?: string;
  jurisdiction?: string;
  date?: string;
  citation?: string;
  summary?: string;
  text?: string;
  url?: string;
}

export interface CaseLawSearchResult extends CaseLawOpinion {
  score?: number;
}
