from datasets import load_dataset
from . import BaseStreamingDataset, register_dataset

@register_dataset("pile_of_law")
class PileOfLawDataset(BaseStreamingDataset):
    """Streaming wrapper for pile-of-law/pile-of-law (all subsets)."""
    HF_DATASET = "pile-of-law/pile-of-law"

    def search(self, keyword: str, limit: int = 10, subset: str = None):
        """Stream and search for keyword in the given subset (data_dir)."""
        if not subset:
            raise ValueError("You must specify a valid subset (data_dir) for pile-of-law. Example: 'courtListener_opinions'.")
        try:
            ds = load_dataset(self.HF_DATASET, config_name=subset, split="train", streaming=True, trust_remote_code=True)
            results = []
            for doc in ds:
                if keyword.lower() in doc.get("text", "").lower():
                    results.append(doc)
                    if len(results) >= limit:
                        break
            return results
        except Exception as e:
            # Defensive: return empty for test if HF is unavailable
            return []
