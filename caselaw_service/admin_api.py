"""Admin endpoints for dataset health monitoring."""
from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any, List
import time
import psutil
import os
from datetime import datetime
from ..auth import get_current_admin_user
from .datasets.dal import get_dataset_dal

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/health")
async def health_check(user=Depends(get_current_admin_user)) -> Dict[str, Any]:
    """Comprehensive health check for all datasets and services."""
    start_time = time.time()
    
    # Dataset health
    dal = get_dataset_dal()
    cache_stats = dal.get_cache_stats()
    
    # System metrics
    memory_usage = psutil.virtual_memory().percent
    cpu_usage = psutil.cpu_percent(interval=1)
    disk_usage = psutil.disk_usage('/').percent
    
    # Dataset availability
    datasets = [
        "indian_legal_dataset",
        "pile_of_law", 
        "inlegalbert",
        "legal_summarization",
        "legal_contracts",
        "patent_data",
        "court_cases"
    ]
    
    dataset_status = {}
    for dataset_name in datasets:
        try:
            from .datasets import get_dataset
            ds = get_dataset(dataset_name)
            # Quick test - get first item
            list(ds.take(1))
            dataset_status[dataset_name] = {
                "status": "healthy",
                "last_check": datetime.utcnow().isoformat()
            }
        except Exception as e:
            dataset_status[dataset_name] = {
                "status": "unhealthy",
                "error": str(e),
                "last_check": datetime.utcnow().isoformat()
            }
    
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "uptime": time.time() - start_time,
        "system": {
            "memory_usage_percent": memory_usage,
            "cpu_usage_percent": cpu_usage,
            "disk_usage_percent": disk_usage
        },
        "cache": cache_stats,
        "datasets": dataset_status
    }

@router.get("/datasets")
async def list_datasets(user=Depends(get_current_admin_user)) -> Dict[str, Any]:
    """List all available datasets with metadata."""
    datasets = [
        {
            "name": "indian_legal_dataset",
            "description": "Indian Legal Dataset with case law",
            "size": "streaming",
            "features": ["search", "semantic_search", "filter_by_state"]
        },
        {
            "name": "pile_of_law",
            "description": "Pile of Law dataset with US legal documents",
            "size": "streaming",
            "features": ["search", "semantic_search", "subset_filtering"]
        },
        {
            "name": "inlegalbert",
            "description": "InLegalBERT embeddings for legal text",
            "size": "streaming",
            "features": ["search", "semantic_search", "embeddings"]
        },
        {
            "name": "legal_summarization",
            "description": "Legal document summarization dataset",
            "size": "streaming",
            "features": ["search", "semantic_search", "summarization"]
        },
        {
            "name": "legal_contracts",
            "description": "Legal contracts dataset",
            "size": "streaming",
            "features": ["search", "semantic_search", "contract_analysis"]
        },
        {
            "name": "patent_data",
            "description": "Patent documents and abstracts",
            "size": "streaming",
            "features": ["search", "semantic_search", "patent_analysis"]
        },
        {
            "name": "court_cases",
            "description": "US court cases dataset",
            "size": "streaming",
            "features": ["search", "semantic_search", "case_analysis"]
        }
    ]
    
    return {
        "datasets": datasets,
        "total": len(datasets),
        "timestamp": datetime.utcnow().isoformat()
    }

@router.get("/metrics")
async def get_metrics(user=Depends(get_current_admin_user)) -> Dict[str, Any]:
    """Get system metrics and usage statistics."""
    dal = get_dataset_dal()
    cache_stats = dal.get_cache_stats()
    
    # API usage metrics (from cache keys)
    api_usage = {}
    for key in dal.cache.keys():
        if 'search' in key:
            api_usage['search'] = api_usage.get('search', 0) + 1
        elif 'semantic' in key:
            api_usage['semantic_search'] = api_usage.get('semantic_search', 0) + 1
    
    return {
        "cache": cache_stats,
        "api_usage": api_usage,
        "system": {
            "memory_usage_percent": psutil.virtual_memory().percent,
            "cpu_usage_percent": psutil.cpu_percent(),
            "disk_usage_percent": psutil.disk_usage('/').percent
        },
        "timestamp": datetime.utcnow().isoformat()
    }
