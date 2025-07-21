## Plug-and-Play Wrappers: Ready-to-Integrate for 7 Major Legal Datasets

Below you’ll find **concise, production-grade wrapper components and API endpoint examples** for each requested dataset, modeled directly after your Caselaw Access Project integration. Directories are suggested based on best conventions for clarity and extensibility. Each code example is readily adaptable for use with FastAPI/Python backend frameworks and will allow your code LLM to generate unambiguous integrations.

### 1. **Pile of Law**  
- **Main Hugging Face Directory:** `pile-of-law/pile-of-law`  
- **Usage:** Research/non-commercial only (CC BY-NC-SA 4.0); each subset may have custom rules—**verify** for each[1].

**Directory:**  
`src/pile_of_law_wrapper/`

**Python Loader:**
```python
from datasets import load_dataset

# Example: Load 'courtListener_opinions' subset for US court opinions
dataset = load_dataset("pile-of-law/pile-of-law", data_dir="courtListener_opinions", split="train", streaming=True)

for doc in dataset:
    print(doc["text"])  # Main opinion text
```

**API Endpoint Example:**
```python
@app.post("/api/v1/pileoflaw/search")
async def search_pile_of_law(subset: str, keyword: str, limit: int = 10):
    dataset = load_dataset("pile-of-law/pile-of-law", data_dir=subset, split="train", streaming=True)
    result = []
    for doc in dataset:
        if keyword.lower() in doc["text"].lower():
            result.append(doc)
            if len(result) >= limit:
                break
    return {"results": result}
```
- Set `data_dir` to subset, e.g., `"courtListener_opinions"`, `"atticus_contracts"`.

### 2. **InLegalBERT**  
- **Main Hugging Face Directory:** `law-ai/InLegalBERT`  
- **MIT License: Commercial use allowed**[2][3].

**Directory:**  
`src/inlegalbert_wrapper/`

**Python Loader (for embeddings or finetuning):**
```python
from transformers import AutoTokenizer, AutoModel

tokenizer = AutoTokenizer.from_pretrained("law-ai/InLegalBERT")
model = AutoModel.from_pretrained("law-ai/InLegalBERT")
inputs = tokenizer("Example Indian legal text", return_tensors="pt")
outputs = model(**inputs)
embeddings = outputs.last_hidden_state
```

**API Endpoint Example for Embedding:**
```python
@app.post("/api/v1/inlegalbert/embedding")
async def get_embedding(text: str):
    inputs = tokenizer(text, return_tensors="pt")
    outputs = model(**inputs)
    return {"embedding": outputs.last_hidden_state[:, 0, :].detach().tolist()}
```
- Swap embedding/model for downstream tasks as needed.

### 3. **Legal Summarization**  
- **Recommended Directory:** `lighteval/legal_summarization` (well-structured, clear fields)[4], or `SaiCharanChetpelly/legal-summarization` for test data.

**Directory:**  
`src/legal_summarization_wrapper/`

**Python Loader:**
```python
from datasets import load_dataset

dataset = load_dataset("lighteval/legal_summarization", split="train", streaming=True)
for example in dataset:
    src_doc = example["article"]
    summary = example["summary"]
```

**API Endpoint Example:**
```python
@app.post("/api/v1/legal_summarization")
async def summarize_legal(text: str):
    # Example with a Hugging Face summarizer model
    from transformers import pipeline
    summarizer = pipeline("summarization", model="nsi319/legal-led-base-16384")
    summary = summarizer(text)
    return {"summary": summary[0]['summary_text']}
```

### 4. **Indian Legal Dataset**  
- **Suggested Directory:** `viber1/indian-law-dataset` or `ninadn/indian-legal` (most established, broad scope)[5][6].

**Directory:**  
`src/indian_legal_dataset_wrapper/`

**Python Loader:**
```python
from datasets import load_dataset

dataset = load_dataset("viber1/indian-law-dataset", split="train", streaming=True)
for doc in dataset:
    print(doc.keys())  # inspect available fields; typically ['text', 'label', ...]
```

**API Endpoint Example:**
```python
@app.post("/api/v1/indian_legal/search")
async def search_indian_legal(keyword: str, limit: int = 10):
    dataset = load_dataset("viber1/indian-law-dataset", split="train", streaming=True)
    result = []
    for doc in dataset:
        if keyword.lower() in doc["text"].lower():
            result.append(doc)
            if len(result) >= limit:
                break
    return {"results": result}
```
- For specific fields/labels, adjust `doc["field"]` as needed.

### 5. **Court Cases**  
- **Recommended Directory:** `HFforLegal/case-law` (broad, court case diversity)[7].

**Directory:**  
`src/court_cases_wrapper/`

**Python Loader:**
```python
from datasets import load_dataset

dataset = load_dataset("HFforLegal/case-law", split="train", streaming=True)
for case in dataset:
    case_text = case["text"]  # or other field names
```

**API Endpoint Example:**
```python
@app.post("/api/v1/courtcases/search")
async def search_court_cases(keyword: str, limit: int = 10):
    dataset = load_dataset("HFforLegal/case-law", split="train", streaming=True)
    results = []
    for case in dataset:
        if keyword.lower() in case["text"].lower():
            results.append(case)
            if len(results) >= limit:
                break
    return {"results": results}
```

### 6. **Legal Contracts**  
- **Recommended Directory:** `albertvillanova/legal_contracts` (public contracts, open task); alternatively, `hugsid/legal-contracts` for other formats[8][9].

**Directory:**  
`src/legal_contracts_wrapper/`

**Python Loader:**
```python
from datasets import load_dataset

dataset = load_dataset("albertvillanova/legal_contracts", split="train", streaming=True)
for contract in dataset:
    contract_text = contract["text"]  # Adapt key as per dataset structure
```

**API Endpoint Example:**
```python
@app.post("/api/v1/legalcontracts/search")
async def search_legal_contracts(keyword: str, limit: int = 10):
    dataset = load_dataset("albertvillanova/legal_contracts", split="train", streaming=True)
    results = []
    for contract in dataset:
        if keyword.lower() in contract["text"].lower():
            results.append(contract)
            if len(results) >= limit:
                break
    return {"results": results}
```

### 7. **Patent Data (USPTO, HUPD)**  
- **Best Directory:** `HUPD/hupd` (Harvard USPTO Patent Dataset)[10].

**Directory:**  
`src/patent_data_wrapper/`

**Python Loader:**
```python
from datasets import load_dataset

dataset = load_dataset("HUPD/hupd", split="train", streaming=True)
for patent in dataset:
    print(patent.keys())  # ['application_number', 'title', 'abstract', 'claims', ...]
```

**API Endpoint Example:**
```python
@app.post("/api/v1/patent/search")
async def search_patents(keyword: str, field: str = "abstract", limit: int = 10):
    dataset = load_dataset("HUPD/hupd", split="train", streaming=True)
    results = []
    for patent in dataset:
        if keyword.lower() in patent[field].lower():
            results.append(patent)
            if len(results) >= limit:
                break
    return {"results": results}
```

## Summary Table: Recommended Directories

| Dataset           | Hugging Face Directory                | Directory to Use           | Main Field(s)                  |
|-------------------|--------------------------------------|----------------------------|--------------------------------|
| Pile of Law       | pile-of-law/pile-of-law               | courtListener_opinions etc.| text, url                      |
| InLegalBERT       | law-ai/InLegalBERT                    | N/A (model, not dataset)   | N/A                            |
| Legal Summarization| lighteval/legal_summarization        | article, summary           | article, summary               |
| Indian Legal      | viber1/indian-law-dataset             | text                       | text, label                    |
| Court Cases       | HFforLegal/case-law                   | text                       | text                           |
| Legal Contracts   | albertvillanova/legal_contracts       | text                       | text                           |
| Patent Data       | HUPD/hupd                             | abstract, title, claims    | abstract, title, claims        |

## Best Practices

- **Always set the proper Hugging Face directory per dataset.**
- Adjust result fields per dataset; use `.keys()` on examples to inspect available fields.
- Respect licensing and usage restrictions for each integration.
- Extend wrapper logic to add vector search, embedding, or extra filters as needed for advanced production usage.

With these templates, you can rapidly extend your app with robust support for leading legal datasets and models in the Hugging Face ecosystem=======

import os
import json
from typing import List, Dict, Optional
from datasets import load_dataset
from sentence_transformers import SentenceTransformer
from dataclasses import dataclass
from pathlib import Path
import logging

@dataclass
class IndianCourtDocument:
    id: str
    case_title: str
    text: str
    court: str
    state: str
    judges: List[str]
    date: str
    legal_areas: List[str]
    procedural_stage: str
    metadata: Dict

class IndianLegalWrapper:
    """Wrapper for Indian Legal Dataset (CC BY-SA 4.0)"""
    
    def __init__(self, cache_dir: str = "/tmp/indian_legal_cache"):
        self.cache_dir = Path(cache_dir)
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        
        self.dataset = None
        self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        self.logger = self._setup_logging()
        
        # Indian legal system structure
        self.indian_states = [
            'Andhra Pradesh', 'Delhi', 'Karnataka', 'Maharashtra', 
            'Tamil Nadu', 'Gujarat', 'West Bengal', 'Rajasthan'
        ]
        self.legal_areas = [
            'Constitutional Law', 'Criminal Law', 'Civil Law', 
            'Corporate Law', 'Family Law', 'Property Law'
        ]
        
        self._initialize_dataset()
    
    def _setup_logging(self):
        logging.basicConfig(level=logging.INFO)
        return logging.getLogger(__name__)
    
    def _initialize_dataset(self):
        try:
            self.logger.info("Loading Indian Legal dataset...")
            self.dataset = load_dataset(
                "law-ai/indian-legal-dataset",
                split="train",
                streaming=True
            )
            self.logger.info("Indian Legal dataset loaded")
        except Exception as e:
            self.logger.error(f"Failed to load dataset: {str(e)}")
            raise
    
    def search_by_legal_area_and_state(self, 
                                     legal_area: str,
                                     state: Optional[str] = None,
                                     limit: int = 100) -> List[IndianCourtDocument]:
        """Search by legal area and state"""
        try:
            results = []
            processed_count = 0
            
            for doc in self.dataset:
                if len(results) >= limit or processed_count >= limit * 10:
                    break
                
                doc_legal_areas = doc.get('legal_areas', [])
                if legal_area in doc_legal_areas:
                    if state and state != doc.get('state', ''):
                        continue
                    result = IndianCourtDocument(
                        id=doc.get('id', f"indian_legal_{processed_count}"),
                        case_title=doc.get('case_title', ''),
                        text=doc.get('text', ''),
                        court=doc.get('court', ''),
                        state=doc.get('state', ''),
                        judges=doc.get('judges', []),
                        date=doc.get('date', ''),
                        legal_areas=doc.get('legal_areas', []),
                        procedural_stage=doc.get('procedural_stage', ''),
                        metadata=doc
                    )
                    results.append(result)
                processed_count += 1
            return results
        except Exception as e:
            self.logger.error(f"Search failed: {str(e)}")
            return []
    
    def analyze_legal_trends(self, 
                           legal_area: str,
                           time_period: Optional[Dict[str, str]] = None) -> Dict:
        """Analyze trends in Indian legal system for a specific legal area"""
        try:
            analysis = {
                'legal_area': legal_area,
                'court_distribution': {},
                'state_distribution': {},
                'temporal_trends': {},
                'total_cases': 0
            }
            
            for doc in self.dataset:
                if legal_area in doc.get('legal_areas', []):
                    court = doc.get('court', 'unknown')
                    state = doc.get('state', 'unknown')
                    date = doc.get('date', '')
                    if date:
                        year = date[:4]
                        analysis['temporal_trends'][year] = analysis['temporal_trends'].get(year, 0) + 1
                    analysis['court_distribution'][court] = analysis['court_distribution'].get(court, 0) + 1
                    analysis['state_distribution'][state] = analysis['state_distribution'].get(state, 0) + 1
                    analysis['total_cases'] += 1
            return analysis
        except Exception as e:
            self.logger.error(f"Trend analysis failed: {str(e)}")
            return {}

class AsyncIndianLegalWrapper:
    def __init__(self, **kwargs):
        self.sync_wrapper = IndianLegalWrapper(**kwargs)
    
    async def search_by_legal_area_and_state(self, **kwargs):
        import asyncio
        from concurrent.futures import ThreadPoolExecutor
        executor = ThreadPoolExecutor(max_workers=2)
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(executor, self.sync_wrapper.search_by_legal_area_and_state, **kwargs)
    
    async def analyze_legal_trends(self, **kwargs):
        import asyncio
        from concurrent.futures import ThreadPoolExecutor
        executor = ThreadPoolExecutor(max_workers=2)
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(executor, self.sync_wrapper.analyze_legal_trends, **kwargs)