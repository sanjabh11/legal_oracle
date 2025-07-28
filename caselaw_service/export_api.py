"""Bulk export endpoints for datasets."""
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
import csv
import json
import io
from datetime import datetime
from typing import Optional
from ..auth import get_current_user
from .datasets import get_dataset

router = APIRouter(prefix="/export", tags=["export"])

@router.get("/datasets/{dataset_name}/csv")
async def export_dataset_csv(
    dataset_name: str,
    limit: int = Query(1000, ge=1, le=10000),
    user=Depends(get_current_user)
):
    """Export dataset as CSV."""
    try:
        ds = get_dataset(dataset_name)
        docs = list(ds.take(limit))
        
        if not docs:
            raise HTTPException(status_code=404, detail="Dataset empty or not found")
        
        # Create CSV in memory
        output = io.StringIO()
        if docs:
            writer = csv.DictWriter(output, fieldnames=docs[0].keys())
            writer.writeheader()
            for doc in docs:
                writer.writerow(doc)
        
        output.seek(0)
        
        return StreamingResponse(
            io.BytesIO(output.getvalue().encode()),
            media_type="text/csv",
            headers={
                "Content-Disposition": f"attachment; filename={dataset_name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
            }
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/datasets/{dataset_name}/json")
async def export_dataset_json(
    dataset_name: str,
    limit: int = Query(1000, ge=1, le=10000),
    user=Depends(get_current_user)
):
    """Export dataset as JSON."""
    try:
        ds = get_dataset(dataset_name)
        docs = list(ds.take(limit))
        
        if not docs:
            raise HTTPException(status_code=404, detail="Dataset empty or not found")
        
        # Create JSON in memory
        output = io.StringIO()
        json.dump(docs, output, indent=2, default=str)
        output.seek(0)
        
        return StreamingResponse(
            io.BytesIO(output.getvalue().encode()),
            media_type="application/json",
            headers={
                "Content-Disposition": f"attachment; filename={dataset_name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            }
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
