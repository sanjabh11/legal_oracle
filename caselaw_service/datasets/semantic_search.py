"""Shared semantic search utilities for all dataset wrappers."""
import numpy as np
from typing import List, Dict, Any

try:
    from sentence_transformers import SentenceTransformer
    model = SentenceTransformer('all-MiniLM-L6-v2')
    SEMANTIC_SEARCH_AVAILABLE = True
except ImportError:
    SEMANTIC_SEARCH_AVAILABLE = False


def semantic_search_docs(
    docs: List[Dict[str, Any]],
    query: str,
    text_field: str = "text",
    limit: int = 10,
    threshold: float = 0.1
) -> List[Dict[str, Any]]:
    """Perform semantic search over documents."""
    if not SEMANTIC_SEARCH_AVAILABLE:
        # Fallback to keyword search
        return [doc for doc in docs if query.lower() in doc.get(text_field, "").lower()][:limit]

    try:
        query_embedding = model.encode([query])
        texts = [doc.get(text_field, "") for doc in docs]
        
        if not texts:
            return []

        doc_embeddings = model.encode(texts)
        
        # Compute cosine similarities
        from sklearn.metrics.pairwise import cosine_similarity
        similarities = cosine_similarity(query_embedding, doc_embeddings)[0]
        
        # Get top results
        top_indices = np.argsort(similarities)[-limit:][::-1]
        results = []
        for idx in top_indices:
            if similarities[idx] > threshold:
                doc = docs[idx]
                doc["similarity_score"] = float(similarities[idx])
                results.append(doc)
        
        return results
    except Exception as e:
        print(f"Semantic search error: {e}")
        return [doc for doc in docs if query.lower() in doc.get(text_field, "").lower()][:limit]
