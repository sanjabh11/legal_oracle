"""
Simple semantic autocomplete/embedding backend for legal case search.
Sprint implementation: in-memory FAISS or fallback to naive string match.
"""
import os
import json
from typing import List
import numpy as np

try:
    import faiss
    FAISS_AVAILABLE = True
except ImportError:
    FAISS_AVAILABLE = False

EMBEDDINGS_PATH = os.getenv("CASELAW_EMBEDDINGS_PATH", "caselaw_embeddings.json")

class EmbeddingIndex:
    def __init__(self, path=EMBEDDINGS_PATH):
        self.ready = False
        self.titles = []
        self.ids = []
        self.embeddings = None
        if os.path.exists(path):
            with open(path, "r") as f:
                data = json.load(f)
            self.titles = [d["case_name"] for d in data]
            self.ids = [d["id"] for d in data]
            arr = np.array([d["embedding"] for d in data], dtype=np.float32)
            if FAISS_AVAILABLE:
                self.index = faiss.IndexFlatL2(arr.shape[1])
                self.index.add(arr)
                self.embeddings = arr
            else:
                self.embeddings = arr
            self.ready = True

    def search(self, query_emb, top_k=5):
        if not self.ready:
            return []
        if FAISS_AVAILABLE:
            D, I = self.index.search(np.array([query_emb], dtype=np.float32), top_k)
            return [(int(i), float(d)) for i, d in zip(I[0], D[0])]
        else:
            # Fallback: brute-force L2
            dists = np.linalg.norm(self.embeddings - np.array(query_emb), axis=1)
            idxs = np.argsort(dists)[:top_k]
            return [(int(i), float(dists[i])) for i in idxs]

# For demo: random embedding for a query (replace with real model)
def embed_query(query: str):
    np.random.seed(abs(hash(query)) % (2**32))
    return np.random.rand(384).astype(np.float32)

index = None

def get_index():
    global index
    if index is None:
        index = EmbeddingIndex()
    return index

def autocomplete(query: str, top_k=5) -> List[str]:
    idx = get_index()
    if not idx.ready or not query.strip():
        return []
    emb = embed_query(query)
    matches = idx.search(emb, top_k)
    return [idx.titles[i] for i, _ in matches]
