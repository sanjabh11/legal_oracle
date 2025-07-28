from transformers import AutoTokenizer, AutoModel
from . import BaseStreamingDataset, register_dataset
import torch

@register_dataset("inlegalbert")
class InLegalBERTDataset(BaseStreamingDataset):
    """Embedding endpoint for law-ai/InLegalBERT."""
    HF_MODEL = "law-ai/InLegalBERT"

    def __init__(self):
        self.tokenizer = AutoTokenizer.from_pretrained(self.HF_MODEL)
        self.model = AutoModel.from_pretrained(self.HF_MODEL)

    def embed(self, text: str):
        inputs = self.tokenizer(text, return_tensors="pt")
        with torch.no_grad():
            outputs = self.model(**inputs)
        # Return [CLS] embedding
        return outputs.last_hidden_state[:, 0, :].squeeze().tolist()

    def search(self, keyword: str, limit: int = 10):
        """Search for documents containing the keyword."""
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
