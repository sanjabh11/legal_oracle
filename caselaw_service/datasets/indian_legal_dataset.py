from datasets import load_dataset
from dataclasses import dataclass
from typing import List, Dict, Optional
from . import BaseStreamingDataset, register_dataset

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


@register_dataset("indian_legal_dataset")
class IndianLegalDataset(BaseStreamingDataset):
    """Streaming wrapper for viber1/indian-law-dataset with advanced helpers."""
    HF_DATASET = "viber1/indian-law-dataset"

    def _get_dataset(self):
        """Load dataset lazily and cache instance."""
        if not hasattr(self, "_ds"):
            self._ds = load_dataset(self.HF_DATASET, split="train", streaming=True)
        return self._ds

    def search(self, keyword: str, limit: int = 10):
        """Keyword search over text field."""
        ds = self._get_dataset()
        results = []
        for doc in ds:
            if keyword.lower() in doc.get("text", "").lower():
                results.append(doc)
                if len(results) >= limit:
                    break
        return results

    def semantic_search(self, query: str, limit: int = 10):
        """Semantic search using sentence-transformers embeddings."""
        try:
            from sentence_transformers import SentenceTransformer
            import numpy as np
            from sklearn.metrics.pairwise import cosine_similarity

            model = SentenceTransformer('all-MiniLM-L6-v2')
            query_embedding = model.encode([query])

            ds = self._get_dataset()
            results = []
            texts = []
            docs = []

            # Collect texts and docs
            for doc in ds:
                texts.append(doc.get("text", ""))
                docs.append(doc)
                if len(texts) >= 1000:  # Limit for streaming performance
                    break

            if not texts:
                return []

            doc_embeddings = model.encode(texts)
            similarities = cosine_similarity(query_embedding, doc_embeddings)[0]

            # Get top results
            top_indices = np.argsort(similarities)[-limit:][::-1]
            for idx in top_indices:
                if similarities[idx] > 0.1:  # Threshold
                    results.append(docs[idx])

            return results

        except ImportError:
            # Fallback to keyword search if sentence-transformers not available
            return self.search(query, limit)
        except Exception as e:
            print(f"Semantic search error: {e}")
            return self.search(query, limit)

    # ---------------- Advanced helpers -----------------
    def search_by_legal_area_and_state(self, legal_area: str, state: str | None = None, limit: int = 100):
        """Filter by legal area and optionally state (streaming)."""
        ds = self._get_dataset()
        results: list[dict] = []
        processed = 0
        for doc in ds:
            processed += 1
            if legal_area in doc.get("legal_areas", []):
                if state and state != doc.get("state", ""):
                    continue
                results.append(doc)
                if len(results) >= limit:
                    break
            if processed >= limit * 10:
                # Stop early if we have processed many without matches
                break
        return results

    def analyze_legal_trends(self, legal_area: str):
        """Return simple distribution stats over court/state/year for a legal area."""
        ds = self._get_dataset()
        stats = {
            "legal_area": legal_area,
            "court_distribution": {},
            "state_distribution": {},
            "temporal_trends": {},
            "total_cases": 0,
        }
        for doc in ds:
            if legal_area not in doc.get("legal_areas", []):
                continue
            stats["total_cases"] += 1
            court = doc.get("court", "unknown")
            stats["court_distribution"][court] = stats["court_distribution"].get(court, 0) + 1
            state_val = doc.get("state", "unknown")
            stats["state_distribution"][state_val] = stats["state_distribution"].get(state_val, 0) + 1
            date = doc.get("date", "")
            if date:
                year = date[:4]
                stats["temporal_trends"][year] = stats["temporal_trends"].get(year, 0) + 1
            # limit processing to reasonable amount for streaming
            if stats["total_cases"] >= 2000:
                break
        return stats

class AsyncIndianLegalWrapper:
    """Async wrapper delegating to IndianLegalDataset using thread executor."""
    def __init__(self, **kwargs):
        self.sync_wrapper = IndianLegalDataset(**kwargs)

    async def search_by_legal_area_and_state(self, **kwargs):
        import asyncio
        from concurrent.futures import ThreadPoolExecutor
        loop = asyncio.get_event_loop()
        executor = ThreadPoolExecutor(max_workers=2)
        return await loop.run_in_executor(executor, self.sync_wrapper.search_by_legal_area_and_state, **kwargs)

    async def analyze_legal_trends(self, **kwargs):
        import asyncio
        from concurrent.futures import ThreadPoolExecutor
        loop = asyncio.get_event_loop()
        executor = ThreadPoolExecutor(max_workers=2)
        return await loop.run_in_executor(executor, self.sync_wrapper.analyze_legal_trends, **kwargs)
