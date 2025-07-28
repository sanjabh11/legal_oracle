from datasets import load_dataset
from . import BaseStreamingDataset, register_dataset

@register_dataset("legal_contracts")
class LegalContractsDataset(BaseStreamingDataset):
    """Streaming wrapper for albertvillanova/legal_contracts."""
    HF_DATASET = "albertvillanova/legal_contracts"

    def search(self, keyword: str, limit: int = 10, field: str = "text", fields: list[str] = None, filters: dict = None):
        """
        Search contracts by keyword in one or more fields, with optional metadata filters (e.g., contract_type, party, date).
        Args:
            keyword: Search term
            limit: Max results
            field: (legacy) single field name
            fields: List of field names to search (e.g., ["text", "title", "contract_type"])
            filters: Dict of metadata filters, e.g. {"contract_type": "NDA", "party": "Acme Corp"}
        """
        try:
            ds = load_dataset(self.HF_DATASET, split="train", streaming=True)
            results = []
            if fields is None:
                fields = [field] if field else ["text"]
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
        except Exception:
            return []

    def semantic_search(self, query: str, limit: int = 10):
        """Semantic search using embeddings."""
        from .semantic_search import semantic_search_docs
        ds = self._get_dataset()
        docs = list(ds.take(limit * 10))
        return semantic_search_docs(docs, query, limit=limit)
