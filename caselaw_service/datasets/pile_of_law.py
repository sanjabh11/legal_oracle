from datasets import load_dataset
from . import BaseStreamingDataset, register_dataset

@register_dataset("pile_of_law")
class PileOfLawDataset(BaseStreamingDataset):
    """Streaming wrapper for pile-of-law/pile-of-law (all subsets)."""
    HF_DATASET = "pile-of-law/pile-of-law"

    def _get_dataset(self, subset: str = None):
        if not subset:
            raise ValueError("You must specify a valid subset (data_dir) for pile-of-law. Example: 'courtListener_opinions'.")
        return load_dataset(self.HF_DATASET, config_name=subset, split="train", streaming=True, trust_remote_code=True)

    def search(self, keyword: str, limit: int = 10, subset: str = None):
        """Stream and search for keyword in the given subset (data_dir)."""
        ds = self._get_dataset(subset)
        results = []
        for doc in ds:
            if keyword.lower() in doc.get("text", "").lower():
                results.append(doc)
                if len(results) >= limit:
                    break
        return results

    def semantic_search(self, query: str, limit: int = 10, subset: str = None):
        """Semantic search using embeddings."""
        from .semantic_search import semantic_search_docs
        ds = self._get_dataset(subset)
        docs = list(ds.take(limit * 10))  # Get more docs for semantic ranking
        return semantic_search_docs(docs, query, limit=limit)
