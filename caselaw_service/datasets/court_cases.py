import datasets as hf_datasets
from . import BaseStreamingDataset, register_dataset

@register_dataset("court_cases")
class CourtCasesDataset(BaseStreamingDataset):
    """Streaming wrapper for HFforLegal/case-law."""
    HF_DATASET = "HFforLegal/case-law"

    def _get_dataset(self):
        try:
            # Try 'us' split first, fallback to 'train' if needed
            try:
                return hf_datasets.load_dataset(self.HF_DATASET, split="us", streaming=True)
            except Exception:
                return hf_datasets.load_dataset(self.HF_DATASET, split="train", streaming=True)
        except Exception:
            return []

    def search(self, keyword: str, limit: int = 10):
        """Search for cases containing the keyword."""
        ds = self._get_dataset()
        results = []
        for doc in ds:
            if keyword.lower() in doc.get("text", "").lower():
                results.append(doc)
                if len(results) >= limit:
                    break
        return results

    def semantic_search(self, query: str, limit: int = 10):
        """Semantic search using embeddings."""
        from .semantic_search import semantic_search_docs
        ds = self._get_dataset()
        docs = list(ds.take(limit * 10))
        return semantic_search_docs(docs, query, limit=limit)
