"""Usage analytics and metrics collection."""
import time
import json
from typing import Dict, Any, List
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from ..auth import get_current_admin_user

router = APIRouter(prefix="/analytics", tags=["analytics"])

class AnalyticsStore:
    """Simple in-memory analytics store."""
    def __init__(self):
        self.events = []
        
    def record_event(self, event_type: str, data: Dict[str, Any]):
        """Record an analytics event."""
        event = {
            "timestamp": datetime.utcnow().isoformat(),
            "event_type": event_type,
            "data": data
        }
        self.events.append(event)
        
        # Keep only last 1000 events
        if len(self.events) > 1000:
            self.events = self.events[-1000:]
    
    def get_usage_stats(self, days: int = 7) -> Dict[str, Any]:
        """Get usage statistics for last N days."""
        cutoff = datetime.utcnow() - timedelta(days=days)
        recent_events = [e for e in self.events 
                        if datetime.fromisoformat(e["timestamp"]) > cutoff]
        
        # Count by endpoint
        endpoint_usage = {}
        for event in recent_events:
            if event["event_type"] == "api_call":
                endpoint = event["data"].get("endpoint", "unknown")
                endpoint_usage[endpoint] = endpoint_usage.get(endpoint, 0) + 1
        
        # Count by dataset
        dataset_usage = {}
        for event in recent_events:
            if event["event_type"] == "dataset_access":
                dataset = event["data"].get("dataset", "unknown")
                dataset_usage[dataset] = dataset_usage.get(dataset, 0) + 1
        
        return {
            "total_events": len(recent_events),
            "endpoint_usage": endpoint_usage,
            "dataset_usage": dataset_usage,
            "time_range": f"{days} days"
        }

# Global analytics store
_analytics = AnalyticsStore()

@router.get("/usage")
async def get_usage_stats(
    days: int = 7,
    user=Depends(get_current_admin_user)
) -> Dict[str, Any]:
    """Get usage analytics for the specified time period."""
    return _analytics.get_usage_stats(days)

@router.get("/dashboard")
async def get_analytics_dashboard(
    user=Depends(get_current_admin_user)
) -> Dict[str, Any]:
    """Get comprehensive analytics dashboard."""
    stats = _analytics.get_usage_stats(days=30)
    
    # Calculate trends
    endpoint_trends = []
    for endpoint, count in stats["endpoint_usage"].items():
        endpoint_trends.append({
            "endpoint": endpoint,
            "usage_count": count,
            "trend": "increasing" if count > 10 else "stable"
        })
    
    return {
        "overview": {
            "total_api_calls": sum(stats["endpoint_usage"].values()),
            "total_dataset_accesses": sum(stats["dataset_usage"].values()),
            "unique_users": len(set([e["data"].get("user_id") 
                                   for e in _analytics.events 
                                   if e["event_type"] == "api_call"])),
            "time_period": "30 days"
        },
        "endpoint_usage": endpoint_trends,
        "dataset_usage": [
            {"dataset": k, "usage_count": v} 
            for k, v in stats["dataset_usage"].items()
        ],
        "top_queries": [
            {"query": e["data"].get("query", ""), "count": 1}
            for e in _analytics.events[-10:]
            if e["event_type"] == "search"
        ]
    }

@router.get("/realtime")
async def get_realtime_metrics(
    user=Depends(get_current_admin_user)
) -> Dict[str, Any]:
    """Get real-time system metrics."""
    current_time = datetime.utcnow().isoformat()
    
    # Last 5 minutes
    recent_cutoff = datetime.utcnow() - timedelta(minutes=5)
    recent_events = [e for e in _analytics.events 
                    if datetime.fromisoformat(e["timestamp"]) > recent_cutoff]
    
    return {
        "current_time": current_time,
        "active_requests": len(recent_events),
        "recent_activity": recent_events[-10:],  # Last 10 events
        "system_health": "healthy" if len(recent_events) < 100 else "high_load"
    }
