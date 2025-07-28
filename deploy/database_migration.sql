-- Legal Oracle Production Database Setup
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Cases table
CREATE TABLE IF NOT EXISTS cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    case_type VARCHAR(100) NOT NULL,
    jurisdiction VARCHAR(100) NOT NULL,
    key_facts TEXT NOT NULL,
    predicted_outcome JSONB NOT NULL,
    confidence_score FLOAT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Strategies table
CREATE TABLE IF NOT EXISTS strategies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    case_id UUID REFERENCES cases(id),
    strategy_details JSONB NOT NULL,
    success_probability FLOAT,
    estimated_cost DECIMAL(10,2),
    timeline_weeks INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Regulatory forecasts
CREATE TABLE IF NOT EXISTS regulatory_forecasts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    industry VARCHAR(100) NOT NULL,
    jurisdiction VARCHAR(100) NOT NULL,
    forecast_details JSONB NOT NULL,
    confidence_score FLOAT NOT NULL,
    timeline_months INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Compliance optimizations
CREATE TABLE IF NOT EXISTS compliance_optimizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    industry VARCHAR(100) NOT NULL,
    jurisdiction VARCHAR(100) NOT NULL,
    current_practices JSONB NOT NULL,
    recommendations JSONB NOT NULL,
    risk_reduction_percentage FLOAT,
    cost_savings_estimate DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User feedback
CREATE TABLE IF NOT EXISTS user_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    dataset_name VARCHAR(100) NOT NULL,
    item_id VARCHAR(255) NOT NULL,
    feedback_type VARCHAR(50) NOT NULL,
    comment TEXT,
    user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API usage analytics
CREATE TABLE IF NOT EXISTS api_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    status_code INTEGER,
    response_time_ms INTEGER,
    request_size_bytes INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_cases_user_id ON cases(user_id);
CREATE INDEX IF NOT EXISTS idx_cases_created_at ON cases(created_at);
CREATE INDEX IF NOT EXISTS idx_cases_case_type ON cases(case_type);
CREATE INDEX IF NOT EXISTS idx_cases_jurisdiction ON cases(jurisdiction);

CREATE INDEX IF NOT EXISTS idx_strategies_user_id ON strategies(user_id);
CREATE INDEX IF NOT EXISTS idx_strategies_case_id ON strategies(case_id);
CREATE INDEX IF NOT EXISTS idx_strategies_created_at ON strategies(created_at);

CREATE INDEX IF NOT EXISTS idx_regulatory_forecasts_user_id ON regulatory_forecasts(user_id);
CREATE INDEX IF NOT EXISTS idx_regulatory_forecasts_industry ON regulatory_forecasts(industry);
CREATE INDEX IF NOT EXISTS idx_regulatory_forecasts_jurisdiction ON regulatory_forecasts(jurisdiction);

CREATE INDEX IF NOT EXISTS idx_compliance_optimizations_user_id ON compliance_optimizations(user_id);
CREATE INDEX IF NOT EXISTS idx_compliance_optimizations_industry ON compliance_optimizations(industry);
CREATE INDEX IF NOT EXISTS idx_compliance_optimizations_jurisdiction ON compliance_optimizations(jurisdiction);

CREATE INDEX IF NOT EXISTS idx_user_feedback_user_id ON user_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_user_feedback_dataset_name ON user_feedback(dataset_name);
CREATE INDEX IF NOT EXISTS idx_user_feedback_created_at ON user_feedback(created_at);

CREATE INDEX IF NOT EXISTS idx_api_usage_user_id ON api_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_endpoint ON api_usage(endpoint);
CREATE INDEX IF NOT EXISTS idx_api_usage_created_at ON api_usage(created_at);

-- Row Level Security (RLS) policies
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE regulatory_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_optimizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;

-- RLS policies for user data isolation
CREATE POLICY user_isolation_policy_cases ON cases
    FOR ALL TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY user_isolation_policy_strategies ON strategies
    FOR ALL TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY user_isolation_policy_regulatory_forecasts ON regulatory_forecasts
    FOR ALL TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY user_isolation_policy_compliance_optimizations ON compliance_optimizations
    FOR ALL TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY user_isolation_policy_user_feedback ON user_feedback
    FOR ALL TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY user_isolation_policy_api_usage ON api_usage
    FOR ALL TO authenticated
    USING (auth.uid() = user_id);
