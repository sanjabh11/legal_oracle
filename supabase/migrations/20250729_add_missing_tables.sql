-- Add missing tables for landmark predictions, arbitrage alerts, and legal evolution models
-- This migration completes the database schema as described in PRD.md

-- Table: landmark_predictions
CREATE TABLE IF NOT EXISTS landmark_predictions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    case_details TEXT NOT NULL,
    likelihood FLOAT NOT NULL,
    justification TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: arbitrage_alerts
CREATE TABLE IF NOT EXISTS arbitrage_alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user_role VARCHAR(50) NOT NULL,
    jurisdiction VARCHAR(100) NOT NULL,
    legal_interests TEXT[] NOT NULL,
    opportunities JSONB NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: legal_evolution_models
CREATE TABLE IF NOT EXISTS legal_evolution_models (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    legal_domain VARCHAR(100) NOT NULL,
    time_horizon VARCHAR(50) NOT NULL,
    trend_analysis JSONB NOT NULL,
    confidence_score FLOAT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_landmark_predictions_user_id ON landmark_predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_arbitrage_alerts_user_id ON arbitrage_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_arbitrage_alerts_expires_at ON arbitrage_alerts(expires_at);
CREATE INDEX IF NOT EXISTS idx_legal_evolution_models_user_id ON legal_evolution_models(user_id);
CREATE INDEX IF NOT EXISTS idx_legal_evolution_models_domain ON legal_evolution_models(legal_domain);
