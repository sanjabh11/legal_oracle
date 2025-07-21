// Shared types for caselaw opinions and search results

export interface CaseLawOpinion {
  id: string;
  case_name?: string;
  title?: string;
  court?: string;
  court_name?: string;
  jurisdiction?: string;
  date?: string;
  date_filed?: string;
  decision_date?: string;
  citation?: string;
  summary?: string;
  headnote?: string;
  text?: string;
  plain_text?: string;
  url?: string;
  download_url?: string;
  html?: string;
  local_path?: string;
  opinions_cited?: string[];
  cluster?: {
    case_name?: string;
    court?: string;
  };
}

export interface CaseLawSearchResult extends CaseLawOpinion {
  score?: number;
}
