"""Unified DatasetLoader with caching layer."""
import os
from typing import Dict, Any, List, Optional
from dataclasses import dataclass
import diskcache as dc
import hashlib
import json
from datetime import datetime, timedelta

@dataclass
class CacheConfig:
    """Configuration for caching layer."""
    cache_dir: str = ".cache/datasets"
    ttl_hours: int = 24
    max_size_gb: float = 1.0


class DatasetDAL:
    """Data Access Layer with caching for dataset operations."""
    
    def __init__(self, config: CacheConfig = None):
        self.config = config or CacheConfig()
        os.makedirs(self.config.cache_dir, exist_ok=True)
        
        # Initialize diskcache with size limit
        self.cache = dc.Cache(
            self.config.cache_dir,
            size_limit=int(self.config.max_size_gb * 1024 * 1024 * 1024)
        )
        
    def _get_cache_key(self, dataset_name: str, operation: str, **kwargs) -> str:
        """Generate cache key for dataset operation."""
        key_data = {
            "dataset": dataset_name,
            "operation": operation,
            "params": kwargs
        }
        key_str = json.dumps(key_data, sort_keys=True)
        return hashlib.md5(key_str.encode()).hexdigest()
    
    def search_with_cache(
        self,
        dataset_name: str,
        query: str,
        limit: int = 10,
        use_semantic: bool = False
    ) -> List[Dict[str, Any]]:
        """Search dataset with caching."""
        cache_key = self._get_cache_key(
            dataset_name, 
            "semantic_search" if use_semantic else "keyword_search",
            query=query,
            limit=limit
        )
        
        # Check cache
        cached_result = self.cache.get(cache_key)
        if cached_result:
            return cached_result
        
        # Import dataset dynamically
        from . import get_dataset
        dataset = get_dataset(dataset_name)
        
        # Perform search
        if use_semantic and hasattr(dataset, 'semantic_search'):
            results = dataset.semantic_search(query, limit)
        else:
            results = dataset.search(query, limit)
        
        # Cache results
        self.cache.set(
            cache_key, 
            results, 
            expire=int(timedelta(hours=self.config.ttl_hours).total_seconds())
        )
        
        return results
    
    def invalidate_cache(self, dataset_name: str = None):
        """Invalidate cache for dataset or all datasets."""
        if dataset_name:
            pattern = f"*{dataset_name}*"
            for key in self.cache.iterkeys():
                if pattern in key:
                    del self.cache[key]
        else:
            self.cache.clear()
    
    def get_cache_stats(self) -> Dict[str, Any]:
        """Get cache statistics."""
        return {
            "size": len(self.cache),
            "size_bytes": self.cache.volume(),
            "hit_rate": self.cache.stats(),
            "datasets": list(set(k.split(':')[1] for k in self.cache.keys() if ':' in k))
        }


# Global singleton
_dataset_dal = None

def get_dataset_dal() -> DatasetDAL:
    """Get singleton DatasetDAL instance."""
    global _dataset_dal
    if _dataset_dal is None:
        _dataset_dal = DatasetDAL()
    return _dataset_dal
