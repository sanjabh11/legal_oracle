-- Create strategies table
CREATE TABLE IF NOT EXISTS strategies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    case_type TEXT NOT NULL,
    jurisdiction TEXT NOT NULL,
    key_facts TEXT NOT NULL,
    current_strategy TEXT,
    optimal_strategy TEXT,
    rationale TEXT,
    expected_outcome TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create regulatory_forecasts table
CREATE TABLE IF NOT EXISTS regulatory_forecasts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    legal_area TEXT NOT NULL,
    jurisdiction TEXT NOT NULL,
    time_horizon TEXT NOT NULL,
    predicted_trends JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create compliance_requests table
CREATE TABLE IF NOT EXISTS compliance_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    industry TEXT NOT NULL,
    jurisdiction TEXT NOT NULL,
    current_policies TEXT,
    recommendations JSONB NOT NULL DEFAULT '[]',
    risk_score NUMERIC(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cases table (if not exists)
CREATE TABLE IF NOT EXISTS cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    case_type TEXT NOT NULL,
    jurisdiction TEXT NOT NULL,
    key_facts TEXT NOT NULL,
    judge_name TEXT,
    predicted_outcome TEXT,
    probabilities JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE regulatory_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;

-- RLS policies for user access
CREATE POLICY users_can_read_strategies ON strategies FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY users_can_insert_strategies ON strategies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY users_can_update_strategies ON strategies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY users_can_delete_strategies ON strategies FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY users_can_read_forecasts ON regulatory_forecasts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY users_can_insert_forecasts ON regulatory_forecasts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY users_can_update_forecasts ON regulatory_forecasts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY users_can_delete_forecasts ON regulatory_forecasts FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY users_can_read_compliance ON compliance_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY users_can_insert_compliance ON compliance_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY users_can_update_compliance ON compliance_requests FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY users_can_delete_compliance ON compliance_requests FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY users_can_read_cases ON cases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY users_can_insert_cases ON cases FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY users_can_update_cases ON cases FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY users_can_delete_cases ON cases FOR DELETE USING (auth.uid() = user_id);
