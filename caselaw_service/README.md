# LEGAL ORACLE Caselaw Service – Sprint 1+ Setup Guide

## Python Version
- Recommended: **Python 3.10.x** (see `.python-version` for pyenv users)
- Other versions may work, but `faiss-cpu` is best supported ≤3.10

## Quickstart (Mac ARM/M1/M2)

1. **Clone repo and enter project directory**

2. **Create and activate a virtual environment**
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```

3. **Install main dependencies (excluding faiss-cpu)**
   ```bash
   pip install -r caselaw_service/requirements.txt
   ```

4. **Install faiss-cpu (required for semantic search only)**
   ```bash
   pip install -r caselaw_service/requirements-faiss.txt --break-system-packages
   # Or, if that fails:
   pip install faiss-cpu --break-system-packages
   ```

5. **Set up environment variables**
   - Copy `.env.example` to `.env` and fill in values for:
     - `SUPABASE_PROJECT_ID` or `SUPABASE_JWKS_URL` (for JWT auth)
     - `SUPABASE_URL`, `SUPABASE_KEY` (for logging, optional)
     - `SKIP_JWT_VERIFY=true` (for local dev/testing)

6. **Create Supabase table (optional, for logging):**
   ```sql
   -- Run this in your Supabase SQL editor
   \i caselaw_service/scripts/create_tables.sql
   ```

7. **Run tests**
   ```bash
   pytest caselaw_service/tests --maxfail=3 --disable-warnings -q
   ```

8. **Run the service**
   ```bash
   uvicorn caselaw_service.main:app --reload --port 8000
   ```

9. **Test endpoints**
   ```bash
   curl -s 'http://localhost:8000/api/v1/caselaw/search?query=Miranda&limit=2'
   ```

---

## Troubleshooting
- **faiss-cpu build errors:**
  - Use the pre-built wheel: `pip install faiss-cpu --break-system-packages`
  - If you see SWIG errors, make sure you have `brew install swig`
  - If using Python >3.10, consider downgrading to 3.10 for best compatibility

- **Pyenv:**
  - If you use `pyenv`, run `pyenv install 3.10.14` and `pyenv local 3.10.14`

- **Supabase JWT:**
  - For local dev, set `SKIP_JWT_VERIFY=true` in your `.env` to bypass JWT checks

---

## Dev Workflow
- All Sprint-1 code is in `caselaw_service/`
- Tests are in `caselaw_service/tests/`
- Auth, validation, streaming search, and logging are implemented
- For semantic search, ensure `faiss-cpu` is installed

---

For any issues, see the comments in the code or open an issue in your repo.
