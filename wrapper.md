1. Key Highlights of the Integration:
High Adherence Scores (4.6-4.9/5)

Historical Case Precedent Analysis (4.8/5): Enhances your existing outcome prediction with real historical data
Judge Behavioral Pattern Analysis (4.9/5): Directly builds on your current judge-specific analysis feature
Legal Evolution Trend Validation (4.7/5): Adds credibility to your trend forecasting
Jurisdictional Outcome Comparison (4.6/5): Provides statistical backing for jurisdiction optimization
Precedent Impact Simulation Enhancement (4.8/5): Adds depth to your existing precedent simulation

Required APIs
The implementation includes:

Core Caselaw Wrapper API with semantic search capabilities
Enhanced prediction endpoints that combine your existing logic with historical precedent analysis
Streaming capabilities for handling the large dataset efficiently
Database extensions for caching and performance optimization

Technical Architecture

FastAPI backend with async capabilities for handling large datasets
FAISS integration for semantic similarity search
PostgreSQL extensions for caching frequently accessed cases
React components for frontend integration
Local storage caching for performance optimization

Performance Considerations

Streaming mode for memory-efficient dataset processing
Semantic search using sentence transformers for finding similar cases
Database caching for frequently accessed cases
Progressive loading for better user experience

The implementation maintains your existing Gemini 2.5 Flash LLM integration while adding powerful historical analysis capabilities that will significantly enhance your platform's predictive accuracy and user value proposition.

# LEGAL ORACLE - Caselaw Integration User Stories & Implementation

## Top 5 User Stories for Hugging Face U.S. Caselaw Repository Integration

### 1. Historical Case Precedent Analysis for Outcome Prediction
**User Story**: As a lawyer using the outcome prediction feature, I want to analyze historical cases similar to my current case so that I can strengthen my outcome probability predictions with real precedent data.

**Adherence Scale**: 4.8/5
- **Integration**: Enhances existing `/api/v1/outcome/predict` endpoint
- **Value**: Provides concrete historical evidence for predictions
- **User Experience**: Seamless integration with existing prediction workflow

**LLM System Prompt**:
```
You are an AI assistant for the LEGAL ORACLE platform, specializing in historical precedent analysis for outcome prediction. Your goal is to:

1. **Extract Case Parameters**: Identify case_type, jurisdiction, key_facts, and legal_issues from user input
2. **Historical Analysis**: Query similar cases from the caselaw repository using semantic similarity
3. **Precedent Mapping**: Map historical outcomes to current case parameters
4. **Confidence Scoring**: Provide confidence scores based on precedent strength and relevance
5. **Validation**: Ensure historical cases are from relevant jurisdictions and time periods

When users request outcome predictions, automatically suggest relevant historical precedents and explain how they influence the probability distribution.
```

### 2. Judge Behavioral Pattern Analysis
**User Story**: As a legal professional, I want to analyze specific judges' historical decisions and patterns so that I can better predict outcomes based on judge-specific behavioral analysis.

**Adherence Scale**: 4.9/5
- **Integration**: Directly enhances the "judge-specific behavioral analysis" feature
- **Value**: Provides data-driven insights into judge preferences and patterns
- **User Experience**: Builds on existing judge analysis functionality

**LLM System Prompt**:
```
You are an AI assistant for the LEGAL ORACLE platform, specializing in judge behavioral analysis using historical caselaw data. Your goal is to:

1. **Judge Identification**: Extract judge names and court information from user queries
2. **Pattern Analysis**: Analyze historical decisions by specific judges for trends and preferences
3. **Behavioral Insights**: Identify sentencing patterns, case type preferences, and decision reasoning
4. **Predictive Modeling**: Generate judge-specific outcome probabilities based on historical data
5. **Validation**: Ensure judge identification is accurate and data is sufficient for analysis

Provide detailed behavioral profiles including decision patterns, common reasoning, and statistical outcomes.
```

### 3. Legal Evolution Trend Validation
**User Story**: As a legal researcher using the legal evolution modeling feature, I want to validate predicted trends against historical case progression so that I can ensure my trend forecasts are grounded in actual legal evolution patterns.

**Adherence Scale**: 4.7/5
- **Integration**: Enhances existing `/api/v1/trends/model` endpoint
- **Value**: Provides historical validation for trend predictions
- **User Experience**: Adds credibility to trend forecasting with real data

**LLM System Prompt**:
```
You are an AI assistant for the LEGAL ORACLE platform, specializing in legal evolution validation using historical caselaw. Your goal is to:

1. **Trend Identification**: Extract legal domains and predicted trends from user input
2. **Historical Validation**: Query historical cases to validate trend predictions
3. **Evolution Mapping**: Map legal interpretation changes over time using case progression
4. **Confidence Assessment**: Provide confidence scores for trend predictions based on historical evidence
5. **Timeline Analysis**: Identify key milestone cases that influenced legal evolution

Validate predictions by showing how similar trends evolved historically and identify potential inflection points.
```

### 4. Jurisdictional Outcome Comparison
**User Story**: As a lawyer using jurisdictional optimization, I want to compare actual historical outcomes across different jurisdictions for similar cases so that I can make data-driven decisions about where to file my case.

**Adherence Scale**: 4.6/5
- **Integration**: Enhances existing `/api/v1/jurisdiction/optimize` endpoint
- **Value**: Provides concrete comparative data for jurisdictional decisions
- **User Experience**: Adds statistical backing to jurisdictional recommendations

**LLM System Prompt**:
```
You are an AI assistant for the LEGAL ORACLE platform, specializing in jurisdictional outcome comparison using historical caselaw. Your goal is to:

1. **Case Parameterization**: Extract case_type, key_facts, and legal_issues
2. **Jurisdictional Analysis**: Compare historical outcomes across different jurisdictions
3. **Statistical Insights**: Provide win/loss ratios, average settlements, and outcome patterns
4. **Venue Advantages**: Identify specific advantages of different jurisdictions
5. **Validation**: Ensure jurisdictional comparisons are statistically significant

Present clear comparative analysis with statistical confidence intervals and practical recommendations.
```

### 5. Precedent Impact Simulation Enhancement
**User Story**: As a judge using precedent impact simulation, I want to analyze how similar historical decisions affected subsequent cases so that I can better understand the long-term implications of my potential ruling.

**Adherence Scale**: 4.8/5
- **Integration**: Enhances existing `/api/v1/precedent/simulate` endpoint
- **Value**: Provides historical evidence of precedent impacts
- **User Experience**: Adds depth to precedent simulation with real case chains

**LLM System Prompt**:
```
You are an AI assistant for the LEGAL ORACLE platform, specializing in precedent impact analysis using historical caselaw chains. Your goal is to:

1. **Decision Analysis**: Extract case details and proposed ruling from user input
2. **Historical Precedent Chains**: Identify similar historical decisions and their subsequent impacts
3. **Citation Analysis**: Track how decisions were cited and applied in later cases
4. **Impact Quantification**: Measure the scope and influence of precedent decisions
5. **Validation**: Ensure precedent chains are legally sound and relevant

Provide detailed impact analysis showing how similar decisions influenced legal development over time.
```

## Required API Architecture

### Core Caselaw Wrapper API

```python
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional, Dict
from datasets import load_dataset
import json
from datetime import datetime
import asyncio
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

app = FastAPI(title="Legal Oracle Caselaw API", version="1.0.0")

# Load the dataset (singleton pattern)
class CaselawDataset:
    _instance = None
    _dataset = None
    _embeddings = None
    _index = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._load_dataset()
        return cls._instance
    
    @classmethod
    def _load_dataset(cls):
        cls._dataset = load_dataset("TeraflopAI/Caselaw-Access-Project", streaming=True)
        cls._embeddings = SentenceTransformer('all-MiniLM-L6-v2')
        # Initialize FAISS index for similarity search
        cls._index = faiss.IndexFlatIP(384)  # MiniLM embedding dimension

# Pydantic models
class CaseQuery(BaseModel):
    case_type: str
    jurisdiction: Optional[str] = None
    keywords: Optional[List[str]] = None
    date_range: Optional[Dict[str, str]] = None
    limit: int = 10

class JudgeQuery(BaseModel):
    judge_name: str
    court: Optional[str] = None
    case_type: Optional[str] = None
    date_range: Optional[Dict[str, str]] = None

class PrecedentQuery(BaseModel):
    case_id: str
    legal_issue: str
    jurisdiction: str
    depth: int = 3

class Case(BaseModel):
    id: str
    case_name: str
    text: str
    date: str
    court: str
    jurisdiction: str
    citation: str
    judges: Optional[List[str]] = None

# Dependency injection
def get_caselaw_dataset():
    return CaselawDataset()

# API Endpoints
@app.get("/api/v1/caselaw/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/api/v1/caselaw/search", response_model=List[Case])
async def search_cases(
    query: CaseQuery,
    dataset: CaselawDataset = Depends(get_caselaw_dataset)
):
    """Search for cases based on criteria"""
    try:
        results = []
        processed_count = 0
        
        for case in dataset._dataset:
            if processed_count >= query.limit * 10:  # Process more to find matches
                break
                
            # Apply filters
            if query.jurisdiction and case.get("jurisdiction") != query.jurisdiction:
                continue
                
            if query.keywords:
                text_lower = case.get("text", "").lower()
                if not any(keyword.lower() in text_lower for keyword in query.keywords):
                    continue
            
            if query.date_range:
                case_date = case.get("date")
                if case_date:
                    if ("start" in query.date_range and 
                        case_date < query.date_range["start"]):
                        continue
                    if ("end" in query.date_range and 
                        case_date > query.date_range["end"]):
                        continue
            
            results.append(Case(**case))
            processed_count += 1
            
            if len(results) >= query.limit:
                break
                
        return results
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/caselaw/similar")
async def find_similar_cases(
    case_text: str,
    limit: int = 5,
    dataset: CaselawDataset = Depends(get_caselaw_dataset)
):
    """Find cases similar to given text using semantic similarity"""
    try:
        # Generate embedding for query
        query_embedding = dataset._embeddings.encode([case_text])
        
        # Search for similar cases (simplified implementation)
        similar_cases = []
        processed_count = 0
        
        for case in dataset._dataset:
            if processed_count >= 1000:  # Limit search scope
                break
                
            case_text_sample = case.get("text", "")[:1000]  # First 1000 chars
            case_embedding = dataset._embeddings.encode([case_text_sample])
            
            # Calculate similarity
            similarity = np.dot(query_embedding[0], case_embedding[0])
            
            if similarity > 0.7:  # Threshold for similarity
                similar_cases.append({
                    "case": Case(**case),
                    "similarity": float(similarity)
                })
                
            processed_count += 1
            
            if len(similar_cases) >= limit:
                break
        
        # Sort by similarity
        similar_cases.sort(key=lambda x: x["similarity"], reverse=True)
        return similar_cases
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/caselaw/judge-analysis")
async def analyze_judge_patterns(
    query: JudgeQuery,
    dataset: CaselawDataset = Depends(get_caselaw_dataset)
):
    """Analyze judge behavioral patterns"""
    try:
        judge_cases = []
        processed_count = 0
        
        for case in dataset._dataset:
            if processed_count >= 5000:  # Limit search scope
                break
                
            judges = case.get("judges", [])
            if isinstance(judges, str):
                judges = [judges]
                
            if query.judge_name.lower() in [j.lower() for j in judges]:
                if query.court and case.get("court") != query.court:
                    continue
                    
                judge_cases.append(case)
                
            processed_count += 1
            
            if len(judge_cases) >= 100:  # Sufficient for analysis
                break
        
        # Analyze patterns
        analysis = {
            "total_cases": len(judge_cases),
            "case_types": {},
            "courts": {},
            "time_period": {
                "earliest": None,
                "latest": None
            },
            "common_keywords": []
        }
        
        for case in judge_cases:
            # Case type analysis
            case_type = case.get("case_type", "unknown")
            analysis["case_types"][case_type] = analysis["case_types"].get(case_type, 0) + 1
            
            # Court analysis
            court = case.get("court", "unknown")
            analysis["courts"][court] = analysis["courts"].get(court, 0) + 1
            
            # Time period
            case_date = case.get("date")
            if case_date:
                if not analysis["time_period"]["earliest"] or case_date < analysis["time_period"]["earliest"]:
                    analysis["time_period"]["earliest"] = case_date
                if not analysis["time_period"]["latest"] or case_date > analysis["time_period"]["latest"]:
                    analysis["time_period"]["latest"] = case_date
        
        return analysis
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/caselaw/precedent-chain")
async def trace_precedent_chain(
    query: PrecedentQuery,
    dataset: CaselawDataset = Depends(get_caselaw_dataset)
):
    """Trace precedent impact chain"""
    try:
        # Find the original case
        original_case = None
        citing_cases = []
        processed_count = 0
        
        for case in dataset._dataset:
            if processed_count >= 10000:  # Limit search scope
                break
                
            if case.get("id") == query.case_id:
                original_case = case
                continue
                
            # Check if this case cites the original
            case_text = case.get("text", "").lower()
            if query.case_id.lower() in case_text or query.legal_issue.lower() in case_text:
                citing_cases.append(case)
                
            processed_count += 1
            
            if len(citing_cases) >= 50:  # Sufficient for chain analysis
                break
        
        if not original_case:
            raise HTTPException(status_code=404, detail="Original case not found")
        
        # Build precedent chain
        precedent_chain = {
            "original_case": Case(**original_case),
            "citing_cases": [Case(**case) for case in citing_cases],
            "impact_metrics": {
                "total_citations": len(citing_cases),
                "jurisdictions_affected": len(set(case.get("jurisdiction") for case in citing_cases)),
                "time_span": None
            }
        }
        
        # Calculate time span
        if citing_cases:
            dates = [case.get("date") for case in citing_cases if case.get("date")]
            if dates:
                precedent_chain["impact_metrics"]["time_span"] = {
                    "first_citation": min(dates),
                    "latest_citation": max(dates)
                }
        
        return precedent_chain
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/caselaw/jurisdiction-comparison")
async def compare_jurisdictions(
    case_type: str,
    legal_issue: str,
    jurisdictions: List[str],
    dataset: CaselawDataset = Depends(get_caselaw_dataset)
):
    """Compare outcomes across jurisdictions"""
    try:
        jurisdiction_data = {jurisdiction: [] for jurisdiction in jurisdictions}
        processed_count = 0
        
        for case in dataset._dataset:
            if processed_count >= 15000:  # Limit search scope
                break
                
            case_jurisdiction = case.get("jurisdiction")
            if case_jurisdiction not in jurisdictions:
                continue
                
            case_text = case.get("text", "").lower()
            if legal_issue.lower() in case_text:
                jurisdiction_data[case_jurisdiction].append(case)
                
            processed_count += 1
        
        # Analyze outcomes per jurisdiction
        comparison = {}
        for jurisdiction, cases in jurisdiction_data.items():
            if cases:
                comparison[jurisdiction] = {
                    "total_cases": len(cases),
                    "case_distribution": {},
                    "common_outcomes": [],
                    "average_case_length": sum(len(case.get("text", "")) for case in cases) / len(cases) if cases else 0
                }
                
                # Analyze case types
                for case in cases:
                    case_type_found = case.get("case_type", "unknown")
                    comparison[jurisdiction]["case_distribution"][case_type_found] = \
                        comparison[jurisdiction]["case_distribution"].get(case_type_found, 0) + 1
            else:
                comparison[jurisdiction] = {
                    "total_cases": 0,
                    "case_distribution": {},
                    "common_outcomes": [],
                    "average_case_length": 0
                }
        
        return comparison
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

## Integration with Existing LEGAL ORACLE Endpoints

### Enhanced Outcome Prediction Endpoint

```python
@app.post("/api/v1/outcome/predict/enhanced")
async def predict_outcome_with_precedents(
    case_details: dict,
    include_precedents: bool = True,
    dataset: CaselawDataset = Depends(get_caselaw_dataset)
):
    """Enhanced outcome prediction with historical precedent analysis"""
    try:
        # Original prediction logic
        base_prediction = await predict_outcome_base(case_details)
        
        if include_precedents:
            # Find similar historical cases
            similar_cases = await find_similar_cases(
                case_text=case_details.get("case_description", ""),
                limit=10,
                dataset=dataset
            )
            
            # Analyze historical outcomes
            precedent_analysis = analyze_precedent_outcomes(similar_cases)
            
            # Adjust prediction based on precedents
            enhanced_prediction = combine_predictions(base_prediction, precedent_analysis)
            
            return {
                "base_prediction": base_prediction,
                "precedent_analysis": precedent_analysis,
                "enhanced_prediction": enhanced_prediction,
                "supporting_cases": similar_cases[:5]
            }
        
        return {"prediction": base_prediction}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def analyze_precedent_outcomes(similar_cases):
    """Analyze outcomes from similar historical cases"""
    outcomes = []
    confidence_scores = []
    
    for case_data in similar_cases:
        case = case_data["case"]
        similarity = case_data["similarity"]
        
        # Extract outcome indicators from case text
        outcome = extract_outcome_from_text(case.text)
        outcomes.append(outcome)
        confidence_scores.append(similarity)
    
    return {
        "historical_outcomes": outcomes,
        "confidence_distribution": calculate_confidence_distribution(outcomes, confidence_scores),
        "precedent_strength": calculate_precedent_strength(confidence_scores)
    }

def extract_outcome_from_text(case_text):
    """Extract outcome indicators from case text"""
    # Simplified outcome extraction
    text_lower = case_text.lower()
    
    if "affirmed" in text_lower:
        return "affirmed"
    elif "reversed" in text_lower:
        return "reversed"
    elif "dismissed" in text_lower:
        return "dismissed"
    elif "granted" in text_lower:
        return "granted"
    else:
        return "unknown"
```

## Database Schema Extensions

```sql
-- Add new tables for caselaw integration
CREATE TABLE IF NOT EXISTS caselaw_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id VARCHAR(255) UNIQUE NOT NULL,
    case_name TEXT NOT NULL,
    case_text TEXT NOT NULL,
    court VARCHAR(255),
    jurisdiction VARCHAR(255),
    decision_date DATE,
    citation VARCHAR(255),
    judges TEXT[],
    embedding VECTOR(384), -- For similarity search
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS precedent_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    original_case_id VARCHAR(255),
    similar_cases JSONB,
    analysis_results JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS judge_patterns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    judge_name VARCHAR(255) NOT NULL,
    court VARCHAR(255),
    case_count INTEGER,
    behavioral_patterns JSONB,
    outcome_statistics JSONB,
    last_updated TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_caselaw_jurisdiction ON caselaw_cache(jurisdiction);
CREATE INDEX IF NOT EXISTS idx_caselaw_court ON caselaw_cache(court);
CREATE INDEX IF NOT EXISTS idx_caselaw_date ON caselaw_cache(decision_date);
CREATE INDEX IF NOT EXISTS idx_judge_patterns_name ON judge_patterns(judge_name);
```

## Frontend Integration Components

```javascript
// React component for precedent analysis
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const PrecedentAnalysis = ({ caseDetails }) => {
  const [precedents, setPrecedents] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const analyzePrecedents = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/caselaw/similar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          case_text: caseDetails.description,
          limit: 10
        })
      });
      
      const data = await response.json();
      setPrecedents(data);
      
      // Cache results locally
      localStorage.setItem(`precedents_${caseDetails.id}`, JSON.stringify(data));
    } catch (error) {
      console.error('Error analyzing precedents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check cache first
    const cached = localStorage.getItem(`precedents_${caseDetails.id}`);
    if (cached) {
      setPrecedents(JSON.parse(cached));
    }
  }, [caseDetails.id]);

  return (
    <div className="precedent-analysis">
      <h3>Historical Precedent Analysis</h3>
      
      {!precedents && (
        <button onClick={analyzePrecedents} disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze Precedents'}
        </button>
      )}
      
      {precedents && (
        <div className="precedent-results">
          <h4>Similar Cases Found: {precedents.length}</h4>
          {precedents.map((precedent, index) => (
            <div key={index} className="precedent-case">
              <h5>{precedent.case.case_name}</h5>
              <p><strong>Court:</strong> {precedent.case.court}</p>
              <p><strong>Date:</strong> {precedent.case.date}</p>
              <p><strong>Similarity:</strong> {(precedent.similarity * 100).toFixed(1)}%</p>
              <p><strong>Citation:</strong> {precedent.case.citation}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PrecedentAnalysis;
```

## Performance Optimizations

### Caching Strategy
- **Local Storage**: Cache recent searches and precedent analyses
- **Database Caching**: Store frequently accessed cases in PostgreSQL
- **Redis Integration**: Add Redis for session-based caching

### Streaming Implementation
```python
async def stream_case_search(query: CaseQuery):
    """Stream search results for better performance"""
    dataset = load_dataset("TeraflopAI/Caselaw-Access-Project", streaming=True)
    
    async def generate():
        count = 0
        for case in dataset:
            if matches_query(case, query):
                yield f"data: {json.dumps(case)}\n\n"
                count += 1
                if count >= query.limit:
                    break
    
    return StreamingResponse(generate(), media_type="text/plain")
```

This implementation provides a comprehensive integration of the Hugging Face U.S. caselaw repository with your existing LEGAL ORACLE platform, maintaining high adherence to your current architecture while adding significant value through historical legal data analysis.

Addendum for adding huggingface caselaw repository integration:
 # Hugging Face U.S. Caselaw Repository - Wrapper Integration Guide

## ADDENDUM: Step-by-Step Wrapper Integration

This addendum provides comprehensive steps for integrating the wrapper around the Hugging Face U.S. caselaw repository into your LEGAL ORACLE platform.

## Phase 1: Environment Setup and Dependencies

### 1.1 Install Required Dependencies

```bash
# Core dependencies
pip install datasets
pip install transformers
pip install sentence-transformers
pip install faiss-cpu  # or faiss-gpu for GPU support
pip install pandas
pip install numpy
pip install torch
pip install asyncio
pip install aiofiles

# Optional but recommended for production
pip install redis
pip install elasticsearch
pip install psycopg2-binary
```

### 1.2 Environment Configuration

```bash
# Create .env file additions
echo "HUGGINGFACE_TOKEN=your_hf_token_here" >> .env
echo "CASELAW_CACHE_DIR=/tmp/caselaw_cache" >> .env
echo "MAX_DATASET_MEMORY=8GB" >> .env
echo "EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2" >> .env
echo "FAISS_INDEX_PATH=/tmp/faiss_caselaw_index" >> .env
```

### 1.3 Directory Structure Setup

```bash
mkdir -p src/caselaw_wrapper
mkdir -p src/caselaw_wrapper/models
mkdir -p src/caselaw_wrapper/utils
mkdir -p src/caselaw_wrapper/cache
mkdir -p data/caselaw_cache
mkdir -p logs/caselaw
```

## Phase 2: Core Wrapper Implementation

### 2.1 Base Caselaw Wrapper Class

```python
# src/caselaw_wrapper/core.py
import os
import json
import logging
from typing import List, Dict, Optional, Iterator, Union
from datasets import load_dataset, Dataset
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import pickle
from datetime import datetime
import asyncio
import aiofiles
from dataclasses import dataclass
from pathlib import Path

@dataclass
class CaseDocument:
    """Structured representation of a legal case"""
    id: str
    case_name: str
    text: str
    court: str
    jurisdiction: str
    date: str
    citation: str
    judges: List[str]
    metadata: Dict

class CaselawWrapper:
    """Main wrapper class for Hugging Face U.S. caselaw repository"""
    
    def __init__(self, 
                 cache_dir: str = "/tmp/caselaw_cache",
                 embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2",
                 use_streaming: bool = True):
        
        self.cache_dir = Path(cache_dir)
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        
        self.embedding_model_name = embedding_model
        self.use_streaming = use_streaming
        
        # Initialize components
        self.dataset = None
        self.embedding_model = None
        self.faiss_index = None
        self.case_metadata = {}
        
        # Setup logging
        self.logger = self._setup_logging()
        
        # Load dataset and models
        self._initialize_dataset()
        self._initialize_embedding_model()
        self._initialize_faiss_index()
    
    def _setup_logging(self) -> logging.Logger:
        """Setup logging configuration"""
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('logs/caselaw/wrapper.log'),
                logging.StreamHandler()
            ]
        )
        return logging.getLogger(__name__)
    
    def _initialize_dataset(self):
        """Initialize the Hugging Face dataset"""
        try:
            self.logger.info("Loading Hugging Face U.S. caselaw dataset...")
            
            if self.use_streaming:
                self.dataset = load_dataset(
                    "TeraflopAI/Caselaw-Access-Project", 
                    streaming=True,
                    split="train"  # Adjust based on dataset structure
                )
            else:
                self.dataset = load_dataset(
                    "TeraflopAI/Caselaw-Access-Project",
                    split="train"
                )
            
            self.logger.info("Dataset loaded successfully")
            
        except Exception as e:
            self.logger.error(f"Failed to load dataset: {str(e)}")
            raise
    
    def _initialize_embedding_model(self):
        """Initialize sentence transformer model"""
        try:
            self.logger.info(f"Loading embedding model: {self.embedding_model_name}")
            self.embedding_model = SentenceTransformer(self.embedding_model_name)
            self.logger.info("Embedding model loaded successfully")
            
        except Exception as e:
            self.logger.error(f"Failed to load embedding model: {str(e)}")
            raise
    
    def _initialize_faiss_index(self):
        """Initialize FAISS index for similarity search"""
        try:
            index_path = self.cache_dir / "faiss_index.pkl"
            
            if index_path.exists():
                self.logger.info("Loading existing FAISS index...")
                with open(index_path, 'rb') as f:
                    self.faiss_index = pickle.load(f)
            else:
                self.logger.info("Creating new FAISS index...")
                # Create index with appropriate dimension
                embedding_dim = self.embedding_model.get_sentence_embedding_dimension()
                self.faiss_index = faiss.IndexFlatIP(embedding_dim)
                
                # Build index (this might take time for large datasets)
                self._build_faiss_index()
                
                # Save index
                with open(index_path, 'wb') as f:
                    pickle.dump(self.faiss_index, f)
            
            self.logger.info("FAISS index ready")
            
        except Exception as e:
            self.logger.error(f"Failed to initialize FAISS index: {str(e)}")
            raise
    
    def _build_faiss_index(self, max_cases: int = 10000):
        """Build FAISS index from dataset"""
        self.logger.info("Building FAISS index from dataset...")
        
        embeddings = []
        case_ids = []
        processed_count = 0
        
        for case in self.dataset:
            if processed_count >= max_cases:
                break
                
            # Extract case text (first 512 tokens for efficiency)
            case_text = case.get('text', '')[:2000]  # Limit text length
            
            if case_text:
                # Generate embedding
                embedding = self.embedding_model.encode(case_text)
                embeddings.append(embedding)
                case_ids.append(case.get('id', f"case_{processed_count}"))
                
                # Store case metadata
                self.case_metadata[case.get('id', f"case_{processed_count}")] = {
                    'case_name': case.get('case_name', ''),
                    'court': case.get('court', ''),
                    'jurisdiction': case.get('jurisdiction', ''),
                    'date': case.get('date', ''),
                    'citation': case.get('citation', '')
                }
            
            processed_count += 1
            
            if processed_count % 1000 == 0:
                self.logger.info(f"Processed {processed_count} cases for indexing")
        
        # Add embeddings to FAISS index
        if embeddings:
            embeddings_array = np.array(embeddings).astype('float32')
            self.faiss_index.add(embeddings_array)
            
            # Save case IDs mapping
            with open(self.cache_dir / "case_ids.pkl", 'wb') as f:
                pickle.dump(case_ids, f)
            
            # Save metadata
            with open(self.cache_dir / "case_metadata.pkl", 'wb') as f:
                pickle.dump(self.case_metadata, f)
        
        self.logger.info(f"FAISS index built with {len(embeddings)} cases")
    
    def search_by_similarity(self, query_text: str, k: int = 10) -> List[Dict]:
        """Search for similar cases using semantic similarity"""
        try:
            # Generate query embedding
            query_embedding = self.embedding_model.encode([query_text])
            
            # Search in FAISS index
            scores, indices = self.faiss_index.search(
                query_embedding.astype('float32'), k
            )
            
            # Load case IDs
            with open(self.cache_dir / "case_ids.pkl", 'rb') as f:
                case_ids = pickle.load(f)
            
            # Prepare results
            results = []
            for i, (score, idx) in enumerate(zip(scores[0], indices[0])):
                if idx < len(case_ids):
                    case_id = case_ids[idx]
                    metadata = self.case_metadata.get(case_id, {})
                    
                    results.append({
                        'case_id': case_id,
                        'similarity_score': float(score),
                        'rank': i + 1,
                        'metadata': metadata
                    })
            
            return results
            
        except Exception as e:
            self.logger.error(f"Similarity search failed: {str(e)}")
            return []
    
    def search_by_filters(self, 
                         keywords: Optional[List[str]] = None,
                         jurisdiction: Optional[str] = None,
                         court: Optional[str] = None,
                         date_range: Optional[Dict[str, str]] = None,
                         limit: int = 100) -> List[CaseDocument]:
        """Search cases using various filters"""
        try:
            results = []
            processed_count = 0
            
            for case in self.dataset:
                if len(results) >= limit:
                    break
                
                if processed_count >= limit * 10:  # Avoid infinite processing
                    break
                
                # Apply filters
                if jurisdiction and case.get('jurisdiction') != jurisdiction:
                    continue
                
                if court and case.get('court') != court:
                    continue
                
                if keywords:
                    case_text = case.get('text', '').lower()
                    if not any(keyword.lower() in case_text for keyword in keywords):
                        continue
                
                if date_range:
                    case_date = case.get('date', '')
                    if case_date:
                        if 'start' in date_range and case_date < date_range['start']:
                            continue
                        if 'end' in date_range and case_date > date_range['end']:
                            continue
                
                # Create case document
                case_doc = CaseDocument(
                    id=case.get('id', f"case_{processed_count}"),
                    case_name=case.get('case_name', ''),
                    text=case.get('text', ''),
                    court=case.get('court', ''),
                    jurisdiction=case.get('jurisdiction', ''),
                    date=case.get('date', ''),
                    citation=case.get('citation', ''),
                    judges=case.get('judges', []),
                    metadata=case
                )
                
                results.append(case_doc)
                processed_count += 1
            
            return results
            
        except Exception as e:
            self.logger.error(f"Filter search failed: {str(e)}")
            return []
    
    def get_case_by_id(self, case_id: str) -> Optional[CaseDocument]:
        """Retrieve a specific case by ID"""
        try:
            for case in self.dataset:
                if case.get('id') == case_id:
                    return CaseDocument(
                        id=case.get('id', ''),
                        case_name=case.get('case_name', ''),
                        text=case.get('text', ''),
                        court=case.get('court', ''),
                        jurisdiction=case.get('jurisdiction', ''),
                        date=case.get('date', ''),
                        citation=case.get('citation', ''),
                        judges=case.get('judges', []),
                        metadata=case
                    )
            
            return None
            
        except Exception as e:
            self.logger.error(f"Case retrieval failed: {str(e)}")
            return None
    
    def analyze_judge_patterns(self, judge_name: str, limit: int = 100) -> Dict:
        """Analyze patterns for a specific judge"""
        try:
            judge_cases = []
            processed_count = 0
            
            for case in self.dataset:
                if processed_count >= limit * 10:
                    break
                
                judges = case.get('judges', [])
                if isinstance(judges, str):
                    judges = [judges]
                
                if any(judge_name.lower() in judge.lower() for judge in judges):
                    judge_cases.append(case)
                    
                    if len(judge_cases) >= limit:
                        break
                
                processed_count += 1
            
            # Analyze patterns
            analysis = {
                'total_cases': len(judge_cases),
                'courts': {},
                'jurisdictions': {},
                'case_types': {},
                'time_period': {'earliest': None, 'latest': None},
                'average_case_length': 0
            }
            
            total_length = 0
            for case in judge_cases:
                # Court distribution
                court = case.get('court', 'Unknown')
                analysis['courts'][court] = analysis['courts'].get(court, 0) + 1
                
                # Jurisdiction distribution
                jurisdiction = case.get('jurisdiction', 'Unknown')
                analysis['jurisdictions'][jurisdiction] = analysis['jurisdictions'].get(jurisdiction, 0) + 1
                
                # Case length
                case_length = len(case.get('text', ''))
                total_length += case_length
                
                # Time period
                case_date = case.get('date', '')
                if case_date:
                    if not analysis['time_period']['earliest'] or case_date < analysis['time_period']['earliest']:
                        analysis['time_period']['earliest'] = case_date
                    if not analysis['time_period']['latest'] or case_date > analysis['time_period']['latest']:
                        analysis['time_period']['latest'] = case_date
            
            if judge_cases:
                analysis['average_case_length'] = total_length / len(judge_cases)
            
            return analysis
            
        except Exception as e:
            self.logger.error(f"Judge pattern analysis failed: {str(e)}")
            return {}
    
    def get_dataset_stats(self) -> Dict:
        """Get basic statistics about the dataset"""
        try:
            stats = {
                'total_cases': 0,
                'unique_courts': set(),
                'unique_jurisdictions': set(),
                'date_range': {'earliest': None, 'latest': None},
                'sample_processed': 0
            }
            
            # Process a sample for statistics
            for case in self.dataset:
                stats['total_cases'] += 1
                
                if case.get('court'):
                    stats['unique_courts'].add(case['court'])
                
                if case.get('jurisdiction'):
                    stats['unique_jurisdictions'].add(case['jurisdiction'])
                
                case_date = case.get('date', '')
                if case_date:
                    if not stats['date_range']['earliest'] or case_date < stats['date_range']['earliest']:
                        stats['date_range']['earliest'] = case_date
                    if not stats['date_range']['latest'] or case_date > stats['date_range']['latest']:
                        stats['date_range']['latest'] = case_date
                
                stats['sample_processed'] += 1
                
                # Limit sample size for performance
                if stats['sample_processed'] >= 1000:
                    break
            
            # Convert sets to counts
            stats['unique_courts'] = len(stats['unique_courts'])
            stats['unique_jurisdictions'] = len(stats['unique_jurisdictions'])
            
            return stats
            
        except Exception as e:
            self.logger.error(f"Dataset statistics failed: {str(e)}")
            return {}
```

### 2.2 Async Wrapper for FastAPI Integration

```python
# src/caselaw_wrapper/async_wrapper.py
import asyncio
from concurrent.futures import ThreadPoolExecutor
from typing import List, Dict, Optional
from .core import CaselawWrapper, CaseDocument

class AsyncCaselawWrapper:
    """Async wrapper for the caselaw repository"""
    
    def __init__(self, **kwargs):
        self.sync_wrapper = CaselawWrapper(**kwargs)
        self.executor = ThreadPoolExecutor(max_workers=4)
    
    async def search_by_similarity(self, query_text: str, k: int = 10) -> List[Dict]:
        """Async similarity search"""
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(
            self.executor,
            self.sync_wrapper.search_by_similarity,
            query_text,
            k
        )
    
    async def search_by_filters(self, **kwargs) -> List[CaseDocument]:
        """Async filter search"""
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(
            self.executor,
            self.sync_wrapper.search_by_filters,
            **kwargs
        )
    
    async def get_case_by_id(self, case_id: str) -> Optional[CaseDocument]:
        """Async case retrieval"""
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(
            self.executor,
            self.sync_wrapper.get_case_by_id,
            case_id
        )
    
    async def analyze_judge_patterns(self, judge_name: str, limit: int = 100) -> Dict:
        """Async judge pattern analysis"""
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(
            self.executor,
            self.sync_wrapper.analyze_judge_patterns,
            judge_name,
            limit
        )
    
    async def get_dataset_stats(self) -> Dict:
        """Async dataset statistics"""
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(
            self.executor,
            self.sync_wrapper.get_dataset_stats
        )
```

## Phase 3: Integration with LEGAL ORACLE

### 3.1 Database Schema Integration

```sql
-- Add to your existing Supabase schema
-- Migration: 001_add_caselaw_tables.sql

-- Caselaw cache table
CREATE TABLE IF NOT EXISTS caselaw_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id VARCHAR(255) UNIQUE NOT NULL,
    case_name TEXT NOT NULL,
    case_text TEXT NOT NULL,
    court VARCHAR(255),
    jurisdiction VARCHAR(255),
    decision_date DATE,
    citation VARCHAR(255),
    judges TEXT[],
    metadata JSONB,
    embedding VECTOR(384), -- pgvector extension required
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Search history table
CREATE TABLE IF NOT EXISTS caselaw_searches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    search_query TEXT NOT NULL,
    search_type VARCHAR(50) NOT NULL, -- 'similarity', 'filter', 'judge_analysis'
    search_parameters JSONB,
    results_count INTEGER,
    execution_time_ms INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Judge analysis cache
CREATE TABLE IF NOT EXISTS judge_analysis_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    judge_name VARCHAR(255) NOT NULL,
    analysis_data JSONB NOT NULL,
    cases_analyzed INTEGER,
    last_updated TIMESTAMP DEFAULT NOW(),
    UNIQUE(judge_name)
);

-- Precedent relationships
CREATE TABLE IF NOT EXISTS precedent_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    citing_case_id VARCHAR(255) NOT NULL,
    cited_case_id VARCHAR(255) NOT NULL,
    relationship_type VARCHAR(50), -- 'cites', 'distinguishes', 'follows'
    confidence_score FLOAT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_caselaw_case_id ON caselaw_cache(case_id);
CREATE INDEX IF NOT EXISTS idx_caselaw_jurisdiction ON caselaw_cache(jurisdiction);
CREATE INDEX IF NOT EXISTS idx_caselaw_court ON caselaw_cache(court);
CREATE INDEX IF NOT EXISTS idx_caselaw_date ON caselaw_cache(decision_date);
CREATE INDEX IF NOT EXISTS idx_caselaw_searches_user ON caselaw_searches(user_id);
CREATE INDEX IF NOT EXISTS idx_judge_analysis_name ON judge_analysis_cache(judge_name);
CREATE INDEX IF NOT EXISTS idx_precedent_citing ON precedent_relationships(citing_case_id);
CREATE INDEX IF NOT EXISTS idx_precedent_cited ON precedent_relationships(cited_case_id);
```

### 3.2 FastAPI Integration

```python
# src/api/caselaw_routes.py
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Optional, Dict
import json
from datetime import datetime
from ..caselaw_wrapper.async_wrapper import AsyncCaselawWrapper
from ..auth.dependencies import get_current_user
from ..database.supabase_client import get_supabase_client

router = APIRouter(prefix="/api/v1/caselaw", tags=["caselaw"])

# Initialize wrapper (singleton)
caselaw_wrapper = AsyncCaselawWrapper()

# Pydantic models
class SimilaritySearchRequest(BaseModel):
    query_text: str
    k: int = 10
    include_metadata: bool = True

class FilterSearchRequest(BaseModel):
    keywords: Optional[List[str]] = None
    jurisdiction: Optional[str] = None
    court: Optional[str] = None
    date_range: Optional[Dict[str, str]] = None
    limit: int = 100

class JudgeAnalysisRequest(BaseModel):
    judge_name: str
    limit: int = 100
    include_cases: bool = False

@router.post("/similarity-search")
async def similarity_search(
    request: SimilaritySearchRequest,
    background_tasks: BackgroundTasks,
    current_user = Depends(get_current_user)
):
    """Perform semantic similarity search"""
    try:
        start_time = datetime.now()
        
        # Perform search
        results = await caselaw_wrapper.search_by_similarity(
            request.query_text, 
            request.k
        )
        
        # Calculate execution time
        execution_time = (datetime.now() - start_time).total_seconds() * 1000
        
        # Log search in background
        background_tasks.add_task(
            log_search,
            current_user.id,
            request.query_text,
            "similarity",
            request.dict(),
            len(results),
            execution_time
        )
        
        return {
            "results": results,
            "query": request.query_text,
            "total_results": len(results),
            "execution_time_ms": execution_time
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/filter-search")
async def filter_search(
    request: FilterSearchRequest,
    background_tasks: BackgroundTasks,
    current_user = Depends(get_current_user)
):
    """Perform filtered search"""
    try:
        start_time = datetime.now()
        
        # Perform search
        results = await caselaw_wrapper.search_by_filters(
            keywords=request.keywords,
            jurisdiction=request.jurisdiction,
            court=request.court,
            date_range=request.date_range,
            limit=request.limit
        )
        
        # Calculate execution time
        execution_time = (datetime.now() - start_time).total_seconds() * 1000
        
        # Convert results to dict for JSON serialization
        results_dict = [
            {
                "id": case.id,
                "case_name": case.case_name,
                "court": case.court,
                "jurisdiction": case.jurisdiction,
                "date": case.date,
                "citation": case.citation,
                "judges": case.judges,
                "text_preview": case.text[:500] + "..." if len(case.text) > 500 else case.text
            }
            for case in results
        ]
        
        # Log search in background
        background_tasks.add_task(
            log_search,
            current_user.id,
            json.dumps(request.dict()),
            "filter",
            request.dict(),
            len(results),
            execution_time
        )
        
        return {
            "results": results_dict,
            "filters": request.dict(),
            "total_results": len(results),
            "execution_time_ms": execution_time
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/judge-analysis")
async def judge_analysis(
    request: JudgeAnalysisRequest,
    background_tasks: BackgroundTasks,
    current_user = Depends(get_current_user)
):
    """Analyze judge patterns"""
    try:
        start_time = datetime.now()
        
        # Check cache first
        supabase = get_supabase_client()
        cached_analysis = supabase.table("judge_analysis_cache").select("*").eq("judge_name", request.judge_name).execute()
        
        if cached_analysis.data and len(cached_analysis.data) > 0:
            # Use cached data if recent (within 7 days)
            cache_age = (datetime.now() - datetime.fromisoformat(cached_analysis.data[0]['last_updated'])).days
            if cache_age < 7:
                return {
                    "analysis": cached_analysis.data[0]['analysis_data'],
                    "judge_name": request.judge_name,
                    "cached": True,
                    "cache_age_days": cache_age
                }
        
        # Perform fresh analysis
        analysis = await caselaw_wrapper.analyze_judge_patterns(
            request.judge_name,
            request.limit
        )
        
        # Cache the results
        background_tasks.add_task(
            cache_judge_analysis,
            request.judge_name,
            analysis
        )
        
        execution_time = (datetime.now() - start_time).total_seconds() * 1000
        
        # Log search in background
        background_tasks.add_task(
            log_search,
            current_user.id,
            request.judge_name,
            "judge_analysis",
            request.dict(),
            analysis.get('total_cases', 0),
            execution_time
        )
        
        return {
            "analysis": analysis,
            "judge_name": request.judge_name,
            "cached": False,
            "execution_time_ms": execution_time
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/case/{case_id}")
async def get_case(
    case_id: str,
    current_user = Depends(get_current_user)
):
    """Get a specific case by ID"""
    try:
        case = await caselaw_wrapper.get_case_by_id(case_id)
        
        if not case:
            raise HTTPException(status_code=404, detail="Case not found")
        
        return {
            "case": {
                "id": case.id,
                "case_name": case.case_name,
                "text": case.text,
                "court": case.court,
                "jurisdiction": case.jurisdiction,
                "date": case.date,
                "citation": case.citation,
                "judges": case.judges,
                "metadata": case.metadata
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/stats")
async def get_dataset_stats(
    current_user = Depends(get_current_user)
):
    """Get dataset statistics"""
    try:
        stats = await caselaw_wrapper.get_dataset_stats()
        return {
            "dataset_stats": stats,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Background tasks
async def log_search(user_id: str, query: str, search_type: str, parameters: dict, results_count: int, execution_time: float):
    """Log search to database"""
    try:
        supabase = get_supabase_client()
        supabase.table("caselaw_searches").insert({
            "user_id": user_id,
            "search_query": query,
            "search_type": search_type,
            "search_parameters": parameters,
            "results_count": results_count,
            "execution_time_ms": int(execution_time)
        }).execute()
    except Exception as e:
        print(f"Failed to log search: {e}")

async def cache_judge_analysis(judge_name: str, analysis: dict):
    """Cache judge analysis results"""
    try:
        supabase = get_supabase_client()
        supabase.table("judge_analysis_cache").upsert({
            "judge_name": judge_name,
            "analysis_data": analysis,
            "cases_analyzed": analysis.get('total_cases', 0),
            "last_updated": datetime.now().isoformat()
        }).execute()
    except Exception as e:
        print(f"Failed to cache judge analysis: {e}")
```

## Phase 4: Frontend Integration

### 4.1 React Hook for Caselaw API

```javascript
// src/hooks/useCaselaw.js
import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const useCaselaw = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const apiRequest = useCallback(async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization