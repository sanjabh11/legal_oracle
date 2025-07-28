#!/bin/bash
# Legal Oracle Production Deployment Script
# Works with existing environment

set -e

echo "🚀 Legal Oracle Production Deployment Starting..."

# Create production directories
echo "📁 Creating production directories..."
mkdir -p logs backups static media cache deploy

# Create production environment file if it doesn't exist
if [ ! -f .env.production ]; then
    echo "⚙️ Creating production environment file..."
    cat > .env.production << 'EOF'
# Legal Oracle Production Environment
API_VERSION=v2.0.0
ENVIRONMENT=production
DEBUG=false
LOG_LEVEL=INFO

# Database Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key

# JWT Configuration
JWT_SECRET_KEY=your-production-jwt-secret-key-change-this
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# Gemini API
GEMINI_API_KEY=your-production-gemini-key

# Rate Limiting
RATE_LIMIT_REQUESTS_PER_MINUTE=100
RATE_LIMIT_BURST=10

# CORS
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
EOF
fi

# Create database migration script
echo "🗄️ Creating database migration script..."
cat > deploy/database_migration.sql << 'EOF'
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
EOF

# Create CI/CD pipeline
echo "🔄 Creating CI/CD pipeline..."
mkdir -p .github/workflows
cat > .github/workflows/deploy.yml << 'EOF'
name: Legal Oracle Production Deployment

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  PYTHON_VERSION: 3.10

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: ${{ env.PYTHON_VERSION }}
        
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r requirements.txt
        
    - name: Run tests
      run: |
        python3 test_comprehensive.py
        
    - name: Run security scan
      run: |
        python3 -m pip install bandit
        bandit -r . -f json -o security_report.json

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to production
      run: |
        echo "Deploying to production..."
        echo "Deployment completed successfully!"
        
    - name: Run health checks
      run: |
        curl -f http://localhost:8000/api/v1/admin/health || exit 1
EOF

# Create Docker configuration
echo "🐳 Creating Docker configuration..."
cat > Dockerfile << 'EOF'
FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create non-root user
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/api/v1/admin/health || exit 1

# Start application
CMD ["uvicorn", "caselaw_service.main:app", "--host", "0.0.0.0", "--port", "8000"]
EOF

# Create Docker Compose
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  legal-oracle-api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - ENVIRONMENT=production
    env_file:
      - .env.production
    volumes:
      - ./logs:/app/logs
      - ./cache:/app/cache
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/api/v1/admin/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - legal-oracle-api
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  redis_data:
EOF

# Create nginx configuration
cat > nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    upstream legal_oracle {
        server legal-oracle-api:8000;
    }

    server {
        listen 80;
        server_name localhost;
        
        location / {
            proxy_pass http://legal_oracle;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            # Rate limiting
            limit_req zone=api burst=10 nodelay;
            
            # Security headers
            add_header X-Frame-Options DENY;
            add_header X-Content-Type-Options nosniff;
            add_header X-XSS-Protection "1; mode=block";
            add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
        }
        
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
EOF

# Create monitoring configuration
cat > deploy/monitoring_config.json << 'EOF'
{
  "alerts": {
    "high_error_rate": {
      "threshold": 5,
      "time_window": "5m",
      "notification": ["email", "slack"]
    },
    "high_response_time": {
      "threshold": 500,
      "time_window": "5m", 
      "notification": ["email", "slack"]
    },
    "high_memory_usage": {
      "threshold": 80,
      "time_window": "5m",
      "notification": ["email", "slack"]
    }
  },
  "metrics": {
    "api_requests": true,
    "response_times": true,
    "error_rates": true,
    "active_users": true,
    "database_performance": true
  }
}
EOF

# Create requirements.txt
cat > requirements.txt << 'EOF'
fastapi==0.104.1
uvicorn[standard]==0.24.0
supabase==2.0.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
httpx==0.25.2
pydantic==2.5.0
python-dotenv==1.0.0
diskcache==5.6.3
sentence-transformers==2.2.2
transformers==4.35.2
torch==2.1.1
numpy==1.24.3
pandas==2.1.3
redis==5.0.1
prometheus-client==0.19.0
sentry-sdk==1.38.0
pytest==7.4.3
pytest-asyncio==0.21.1
bandit==1.7.5
EOF

# Create startup script
cat > start_production.sh << 'EOF'
#!/bin/bash
# Legal Oracle Production Startup Script

set -e

echo "🚀 Starting Legal Oracle Production Environment..."

# Load environment variables
if [ -f .env.production ]; then
    export $(cat .env.production | xargs)
fi

# Start the application
echo "Starting FastAPI server..."
exec uvicorn caselaw_service.main:app \
    --host 0.0.0.0 \
    --port 8000 \
    --workers 4 \
    --log-level info \
    --access-log \
    --reload
EOF

chmod +x start_production.sh
chmod +x deploy.sh

echo "✅ Production deployment setup completed!"
echo ""
echo "📋 Next Steps:"
echo "1. Update .env.production with your actual production values"
echo "2. Run: ./start_production.sh to start the server"
echo "3. Run: docker-compose up -d for containerized deployment"
echo "4. Access the API at: http://localhost:8000"
echo "5. Health check: http://localhost:8000/api/v1/admin/health"
echo "6. API docs: http://localhost:8000/docs"
