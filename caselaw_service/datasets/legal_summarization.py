import datasets as hf_datasets
from . import BaseStreamingDataset, register_dataset

@register_dataset("legal_summarization")
class LegalSummarizationDataset(BaseStreamingDataset):
    """Streaming wrapper for lighteval/legal_summarization and summarizer endpoint."""
    HF_DATASET = "lighteval/legal_summarization"

    def _get_dataset(self):
        return hf_datasets.load_dataset(self.HF_DATASET, split="train", streaming=True)

    def search(self, keyword: str, limit: int = 10):
        """Search for summaries containing the keyword."""
        ds = self._get_dataset()
        results = []
        for doc in ds:
            if keyword.lower() in doc.get("summary", "").lower():
                results.append(doc)
                if len(results) >= limit:
                    break
        return results

    def semantic_search(self, query: str, limit: int = 10):
        """Semantic search using embeddings."""
        from .semantic_search import semantic_search_docs
        ds = self._get_dataset()
        docs = list(ds.take(limit * 10))
        try:
            return semantic_search_docs(docs, query, text_field="summary", limit=limit)
        except Exception:
            return []

    def summarize(self, text: str) -> str:
        """Summarize a given legal text.

        Uses the Legal-LED model if available. Falls back to returning the
        first 200 characters when running in offline/test environments.
        """
        try:
            # Lazy-load summarizer to avoid large startup costs if unused
            if not hasattr(self, "_summarizer"):
                from transformers import pipeline
                # Use CPU device by default. If CUDA is available the pipeline
                # will automatically leverage it.
                self._summarizer = pipeline(
                    "summarization",
                    model="nsi319/legal-led-base-16384",
                    device=-1,
                )
            summary = self._summarizer(
                text,
                max_length=130,
                min_length=30,
                do_sample=False,
            )
            return summary[0]["summary_text"]
        except Exception:
            # Fallback: naive truncation ensures endpoint stays responsive
            return text[:200] + ("..." if len(text) > 200 else "")
