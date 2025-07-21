# LEGAL ORACLE - AI Legal Intelligence Platform

LEGAL ORACLE is a transformative AI-powered legal intelligence platform designed to predict legal outcomes, forecast emerging legal trends, simulate precedent impacts, optimize jurisdictional strategies, and identify legal arbitrage opportunities.

## Features

- **Outcome Prediction**: Predict case outcomes with AI-powered analysis and judge behavioral patterns
- **Strategy Optimization**: Optimize legal strategies for maximum success
- **Strategy Simulation**: Test strategies against AI opponents
- **Regulatory Forecasting**: Forecast upcoming regulatory changes
- **Jurisdiction Optimization**: Find the best jurisdiction for your case
- **Precedent Simulation**: Simulate the impact of legal precedents
- **Legal Evolution**: Model long-term legal trends
- **Compliance Optimization**: Optimize compliance strategies
- **Landmark Prediction**: Predict future landmark cases
- **Arbitrage Alerts**: Receive legal arbitrage opportunities

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account
- Google AI Studio account (for Gemini API key)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/legal-oracle.git
   cd legal-oracle
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up environment variables
   Create a `.env` file in the root directory with the following variables:
   ```
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_GEMINI_API_KEY=your-gemini-api-key
   ```

4. Set up Supabase
   - Create a new Supabase project
   - Run the migration script in `supabase/migrations/create_legal_oracle_schema.sql`
   - Enable email authentication in Supabase Auth settings

5. Start the development server
   ```
   npm run dev
   ```

## Usage

### User Roles

The platform supports different user roles, each with tailored features:

- **Individual**: Personal legal guidance
- **Lawyer**: Case strategy optimization
- **Business**: Compliance & risk management
- **Judge**: Judicial decision support
- **Researcher**: Legal trend analysis
- **Scholar**: Scholarly analysis

### Guest Mode

You can try the platform without creating an account by using the guest mode. Simply select your role and continue as a guest.

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS, Lucide React
- **Backend**: Supabase (PostgreSQL, Auth), FastAPI (Caselaw Service)
- **AI**: Google Gemini 2.5 Flash
- **Deployment**: Vite, Netlify

---

## Caselaw API & Historical Precedent Integration

LEGAL ORACLE now integrates a powerful historical caselaw API, enabling:
- Semantic search for similar cases using FAISS and sentence-transformers
- Historical precedent analysis for outcome prediction
- Judge behavioral pattern analysis
- Legal evolution trend validation
- Jurisdictional outcome comparison
- Precedent impact simulation

**API Endpoints:**
- `/api/v1/caselaw/search` – Find cases by semantic similarity or filters
- `/api/v1/caselaw/similar` – Find cases similar to a given text
- `/api/v1/caselaw/judge-analysis` – Analyze judge decision patterns
- `/api/v1/caselaw/health` – Health check

See `wrapper.md` for technical details and user stories.

---

## Backend Setup (Caselaw Service)

**Python Version:** 3.10.x recommended (see `.python-version`)

**Quickstart:**
1. Create and activate a virtual environment:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```
2. Install dependencies:
   ```bash
   pip install -r caselaw_service/requirements.txt
   pip install -r caselaw_service/requirements-faiss.txt --break-system-packages
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env` and fill in Supabase and JWT settings
4. (Optional) Create Supabase tables for logging:
   ```sql
   \i caselaw_service/scripts/create_tables.sql
   ```
5. Run the service:
   ```bash
   uvicorn caselaw_service.main:app --reload --port 8000
   ```
6. Run tests:
   ```bash
   pytest caselaw_service/tests --maxfail=3 --disable-warnings -q
   ```

For details, see `caselaw_service/README.md`.

### Database Tables
- `cases`: Case details and predictions
- `strategies`: Legal strategies
- `simulations`: Strategy simulation results
- `regulatory_forecasts`: Regulatory change forecasts
- `jurisdiction_recommendations`: Jurisdiction optimization
- `precedent_simulations`: Precedent impact simulations
- `legal_evolution_models`: Legal evolution trend models
- `compliance_optimizations`: Compliance optimization
- `landmark_predictions`: Landmark case predictions
- `arbitrage_alerts`: Legal arbitrage alerts
- `caselaw_searches`, `judge_analysis_cache`: For logging/caching (see scripts)

---

## Developer Notes & Future Improvements
- The Caselaw API is modular and supports streaming for large datasets
- Semantic search is powered by FAISS and sentence-transformers
- Logging and caching use Supabase tables (see scripts)
- For local testing, set `SKIP_JWT_VERIFY=true` in `.env`
- See `wrapper.md` for advanced user stories, API usage, and integration patterns
- See `caselaw_service/README.md` for troubleshooting and dev workflow

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.