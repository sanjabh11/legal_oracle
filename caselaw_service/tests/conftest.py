import os
import pytest

@pytest.fixture(autouse=True, scope="session")
def set_skip_jwt_verify():
    os.environ["SKIP_JWT_VERIFY"] = "true"

    # Mock datasets.load_dataset to avoid network call in CI/tests
    import datasets

    original_load_dataset = datasets.load_dataset

    def _mock_load_dataset(*args, **kwargs):
        # minimal iterable of case dicts
        sample = {
            "id": "1",
            "case_name": "Miranda v. Arizona",
            "court": "US Supreme Court",
            "jurisdiction": "federal",
            "date": "1966-06-13",
            "citation": "384 U.S. 436",
            "summary": "Landmark decision on police interrogations",
            "text": "Miranda rights...",
            "url": "https://example.com/miranda"
        }
        return [sample]

    datasets.load_dataset = _mock_load_dataset

    yield

    # teardown: restore original
    datasets.load_dataset = original_load_dataset
