from datasets import load_dataset
from . import BaseStreamingDataset, register_dataset

@register_dataset("court_cases")
class CourtCasesDataset(BaseStreamingDataset):
    """Streaming wrapper for HFforLegal/case-law."""
    HF_DATASET = "HFforLegal/case-law"

    def search(self, keyword: str, limit: int = 10):
        try:
            # Try 'us' split first, fallback to 'train' if needed
            try:
                ds = load_dataset(self.HF_DATASET, split="us", streaming=True)
            except Exception:
                ds = load_dataset(self.HF_DATASET, split="train", streaming=True)
            results = []
            for doc in ds:
                if keyword.lower() in doc.get("text", "").lower():
                    results.append(doc)
                    if len(results) >= limit:
                        break
            return results
        except Exception:
            return []
