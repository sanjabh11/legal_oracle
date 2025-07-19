from pydantic import BaseModel, Field
from typing import List, Optional, Dict

class CaseQuery(BaseModel):
    query: str = Field(..., description="Keyword or phrase to search for")
    limit: int = Field(10, ge=1, le=50)

class SimilarityQuery(BaseModel):
    text: str = Field(..., description="Full case description or excerpt for semantic similarity")
    limit: int = Field(5, ge=1, le=20)

class CaseResult(BaseModel):
    id: str
    case_name: str
    court: Optional[str]
    jurisdiction: Optional[str]
    date: Optional[str]
    citation: Optional[str]
    summary: Optional[str]
    url: Optional[str]

class SearchLog(BaseModel):
    user_id: str
    query: str
    search_type: str
    timestamp: str
    results_count: int
    execution_time_ms: float
