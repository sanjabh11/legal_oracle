import datasets as hf_datasets
from . import BaseStreamingDataset, register_dataset

@register_dataset("patent_data")
class PatentDataDataset(BaseStreamingDataset):
    """Streaming wrapper for HUPD/hupd."""
    HF_DATASET = "HUPD/hupd"

    def search(self, keyword: str, limit: int = 10, field: str = "abstract", fields: list[str] = None, filters: dict = None):
        """
        Search patents by keyword in one or more fields, with optional metadata filters (e.g., year, inventor).
        Args:
            keyword: Search term
            limit: Max results
            field: (legacy) single field name
            fields: List of field names to search (e.g., ["abstract", "claims", "title"])
            filters: Dict of metadata filters, e.g. {"year": "2022", "inventor": "Smith"}
        """
        ds = hf_datasets.load_dataset(self.HF_DATASET, split="train", streaming=True)
        results = []
        if fields is None:
            fields = [field] if field else ["abstract"]
        for doc in ds:
            # Field search: match keyword in any specified field
            match = any(keyword.lower() in (doc.get(f, "") or "").lower() for f in fields)
            # Metadata filter
            if match and filters:
                for k, v in filters.items():
                    if v and v.lower() not in str(doc.get(k, "")).lower():
                        match = False
                        break
            if match:
                results.append(doc)
                if len(results) >= limit:
                    break
        return results

    def semantic_search(self, query: str, limit: int = 10):
        """Semantic search using embeddings."""
        from .semantic_search import semantic_search_docs
        ds = self._get_dataset()
        docs = list(ds.take(limit * 10))
        return semantic_search_docs(docs, query, text_field="abstract", limit=limit)
