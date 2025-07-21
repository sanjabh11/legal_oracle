import pytest
from caselaw_service.datasets import get_dataset, list_datasets

def test_registry():
    ds_names = list_datasets()
    assert "pile_of_law" in ds_names
    assert "inlegalbert" in ds_names
    assert "legal_summarization" in ds_names
    assert "indian_legal_dataset" in ds_names
    assert "court_cases" in ds_names
    assert "legal_contracts" in ds_names
    assert "patent_data" in ds_names

def test_pile_of_law_search():
    ds = get_dataset("pile_of_law")
    # Use a known valid subset for pile-of-law
    results = ds.search("contract", limit=2, subset="courtListener_opinions")
    assert isinstance(results, list)
    assert len(results) <= 2

def test_inlegalbert_embed():
    ds = get_dataset("inlegalbert")
    emb = ds.embed("legal contract dispute")
    assert isinstance(emb, list)
    assert len(emb) > 0

def test_legal_summarization_search():
    ds = get_dataset("legal_summarization")
    results = ds.search("agreement", limit=2)
    assert isinstance(results, list)
    assert len(results) <= 2

def test_indian_legal_dataset_search():
    ds = get_dataset("indian_legal_dataset")
    results = ds.search("appeal", limit=2)
    assert isinstance(results, list)
    assert len(results) <= 2

def test_court_cases_search():
    ds = get_dataset("court_cases")
    results = ds.search("fraud", limit=2)
    assert isinstance(results, list)
    assert len(results) <= 2

def test_legal_contracts_search():
    ds = get_dataset("legal_contracts")
    # Legacy single-field search
    results = ds.search("NDA", limit=2)
    assert isinstance(results, list)
    assert len(results) <= 2
    # Multi-field search
    results2 = ds.search("NDA", limit=2, fields=["text", "title"])
    assert isinstance(results2, list)
    assert len(results2) <= 2
    # Metadata filter
    results3 = ds.search("NDA", limit=2, filters={"contract_type": "NDA"})
    assert isinstance(results3, list)
    assert len(results3) <= 2

def test_patent_data_search():
    ds = get_dataset("patent_data")
    # Legacy single-field search
    results = ds.search("machine", limit=2, field="abstract")
    assert isinstance(results, list)
    assert len(results) <= 2
    # Multi-field search
    results2 = ds.search("machine", limit=2, fields=["abstract", "claims"])
    assert isinstance(results2, list)
    assert len(results2) <= 2
    # Metadata filter
    results3 = ds.search("machine", limit=2, filters={"year": "2020"})
    assert isinstance(results3, list)
    assert len(results3) <= 2
