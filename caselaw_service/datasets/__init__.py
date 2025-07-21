"""Dataset wrappers package.

Each dataset module should define a class inheriting from `BaseStreamingDataset`
exposing at minimum `search(keyword: str, limit: int)`.

All dataset classes must register themselves via `register_dataset()` so that
API routers and CLI utilities can discover them dynamically.
"""

from typing import Dict, Type

_DATASET_REGISTRY: Dict[str, "BaseStreamingDataset"] = {}


def register_dataset(name: str):
    """Decorator to register dataset classes."""
    def decorator(cls):
        _DATASET_REGISTRY[name] = cls  # type: ignore
        cls.__dataset_name__ = name  # type: ignore
        return cls
    return decorator


def get_dataset(name: str):
    cls = _DATASET_REGISTRY.get(name)
    if not cls:
        raise KeyError(f"Dataset '{name}' is not registered")
    return cls()


def list_datasets():
    return list(_DATASET_REGISTRY.keys())


class BaseStreamingDataset:
    """Base class providing common streaming helpers.
    Subclasses should implement:
        - `HF_DATASET` (str): huggingface repo id
        - `search(keyword: str, limit: int)` method
    """
    HF_DATASET = None
    def search(self, keyword: str, limit: int = 10):
        raise NotImplementedError

# --- Force registration of all datasets on import ---
from . import pile_of_law, inlegalbert, legal_summarization, indian_legal_dataset, court_cases, legal_contracts, patent_data
