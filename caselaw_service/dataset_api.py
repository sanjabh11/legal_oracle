from fastapi import APIRouter, HTTPException, Query
from caselaw_service.datasets import get_dataset, list_datasets

router = APIRouter(prefix="/api/v1/dataset", tags=["datasets"])

@router.get("/list")
def list_all_datasets():
    """List all available dataset wrappers."""
    return list_datasets()

from fastapi import Request

@router.get("/search/{dataset}")
def search_dataset(dataset: str, keyword: str = Query(...), limit: int = Query(10, ge=1, le=50), request: Request = None):
    """Search a dataset for keyword (streaming)."""
    try:
        ds = get_dataset(dataset)
        extra = {}
        if request is not None:
            # Get all query params except known ones
            for k, v in request.query_params.items():
                if k not in {"dataset", "keyword", "limit"}:
                    extra[k] = v
        results = ds.search(keyword, limit=limit, **extra)
        return {"results": results}
    except KeyError:
        raise HTTPException(status_code=404, detail=f"Dataset '{dataset}' not found")
    except (ValueError, NotImplementedError) as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/embed/inlegalbert")
def embed_inlegalbert(text: str = Query(...)):
    """Get embedding for text using InLegalBERT."""
    try:
        ds = get_dataset("inlegalbert")
        emb = ds.embed(text)
        return {"embedding": emb}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/summarize/legal")
def summarize_legal(text: str = Query(...)):
    """Summarize a legal text using LegalSummarizationDataset wrapper."""
    try:
        ds = get_dataset("legal_summarization")
        summary = ds.summarize(text)
        return {"summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# -------- Pile of Law Subset List Endpoint --------
@router.get("/pile_of_law/subsets")
def pile_of_law_subsets():
    try:
        from caselaw_service.datasets.pile_of_law_subsets import get_pile_of_law_subsets
        return get_pile_of_law_subsets()
    except Exception as e:
        return []

# -------- Indian Legal Dataset advanced endpoints --------
@router.get("/indian_legal/search_by_area")
def search_indian_by_area(legal_area: str = Query(...), state: str | None = Query(None), limit: int = Query(100, ge=1, le=200)):
    """Search Indian Legal Dataset by legal area and optionally state."""
    try:
        ds = get_dataset("indian_legal_dataset")
        results = ds.search_by_legal_area_and_state(legal_area, state, limit)
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/indian_legal/trends")
def analyze_indian_trends(legal_area: str = Query(...)):
    """Analyze legal trends in Indian legal dataset for a given area."""
    try:
        ds = get_dataset("indian_legal_dataset")
        analysis = ds.analyze_legal_trends(legal_area)
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
