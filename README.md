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
- **Backend**: Supabase (PostgreSQL, Auth)
- **AI**: Google Gemini 2.5 Flash
- **Deployment**: Vite, Netlify

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.