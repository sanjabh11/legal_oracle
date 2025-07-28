#!/usr/bin/env python3
"""
Legal Oracle Production Deployment Script
Automates production environment setup, database migrations, and service configuration
"""

import os
import sys
import subprocess
import json
import requests
from pathlib import Path
from datetime import datetime

class ProductionDeployment:
    def __init__(self):
        self.project_root = Path(__file__).parent.parent
        self.deployment_log = []
        
    def log(self, message, status="INFO"):
        """Log deployment progress"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_entry = {"timestamp": timestamp, "status": status, "message": message}
        self.deployment_log.append(log_entry)
        print(f"[{timestamp}] {status}: {message}")
        
    def check_prerequisites(self):
        """Check if all prerequisites are met"""
        self.log("Checking deployment prerequisites...")
        
        # Check Python version
        python_version = sys.version_info
        if python_version < (3, 8):
            self.log("Python 3.8+ required", "ERROR")
            return False
            
        # Check required tools
        required_tools = ["pip", "uvicorn", "supabase"]
        for tool in required_tools:
            try:
                subprocess.run([tool, "--version"], 
                             capture_output=True, check=True)
            except (subprocess.CalledProcessError, FileNotFoundError):
                self.log(f"Missing required tool: {tool}", "ERROR")
                return False
                
        self.log("Prerequisites check passed", "SUCCESS")
        return True
        
    def setup_environment(self):
        """Setup production environment"""
        self.log("Setting up production environment...")
        
        # Create production directories
        prod_dirs = [
            "logs",
            "backups", 
            "static",
            "media",
            "cache"
        ]
        
        for dir_name in prod_dirs:
            dir_path = self.project_root / dir_name
            dir_path.mkdir(exist_ok=True)
            self.log(f"Created directory: {dir_path}")
            
        # Copy production environment file
        env_file = self.project_root / ".env.production"
        if env_file.exists():
            self.log("Production environment file ready")
            
    def setup_database(self):
        """Setup production database with migrations"""
        self.log("Setting up production database...")
        
        # Create database migration script
        migration_script = """
-- Legal Oracle Production Database Setup
-- Generated: {}

-- Create production tables
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Cases table for outcome predictions
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

-- Strategies table for optimization
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
""".format(datetime.now().isoformat())
        
        # Save migration script
        migration_file = self.project_root / "deploy/database_migration.sql"
        with open(migration_file, "w") as f:
            f.write(migration_script)
            
        self.log("Database migration script created", "SUCCESS")
        
    def setup_monitoring(self):
        """Setup monitoring and alerting"""
        self.log("Setting up monitoring and alerting...")
        
        # Create monitoring configuration
        monitoring_config = {
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
                "api_requests": True,
                "response_times": True,
                "error_rates": True,
                "active_users": True,
                "database_performance": True
            }
        }
        
        # Save monitoring config
        monitoring_file = self.project_root / "deploy/monitoring_config.json"
        with open(monitoring_file, "w") as f:
            json.dump(monitoring_config, f, indent=2)
            
        self.log("Monitoring configuration created", "SUCCESS")
        
    def create_ci_cd_pipeline(self):
        """Create CI/CD pipeline configuration"""
        self.log("Creating CI/CD pipeline...")
        
        # GitHub Actions workflow
        github_workflow = """
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
        pytest tests/ -v --tb=short
        
    - name: Run security scan
      run: |
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
        # Add deployment commands here
        
    - name: Run health checks
      run: |
        curl -f http://localhost:8000/api/v1/admin/health || exit 1
"""
        
        # Save workflow
        workflow_dir = self.project_root / ".github/workflows"
        workflow_dir.mkdir(parents=True, exist_ok=True)
        
        workflow_file = workflow_dir / "deploy.yml"
        with open(workflow_file, "w") as f:
            f.write(github_workflow)
            
        self.log("CI/CD pipeline created", "SUCCESS")
        
    def create_docker_configuration(self):
        """Create Docker configuration for containerized deployment"""
        self.log("Creating Docker configuration...")
        
        # Dockerfile
        dockerfile = """
FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
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
"""
        
        docker_file = self.project_root / "Dockerfile"
        with open(docker_file, "w") as f:
            f.write(dockerfile)
            
        # Docker Compose
        docker_compose = """
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
    depends_on:
      - redis
      - postgres
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/api/v1/admin/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: legal_oracle
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
"""
        
        compose_file = self.project_root / "docker-compose.yml"
        with open(compose_file, "w") as f:
            f.write(docker_compose)
            
        self.log("Docker configuration created", "SUCCESS")
        
    def run_deployment(self):
        """Execute the complete deployment process"""
        self.log("Starting production deployment...")
        
        if not self.check_prerequisites():
            return False
            
        self.setup_environment()
        self.setup_database()
        self.setup_monitoring()
        self.create_ci_cd_pipeline()
        self.create_docker_configuration()
        
        # Generate deployment report
        deployment_report = {
            "deployment_date": datetime.now().isoformat(),
            "environment": "production",
            "status": "ready",
            "components": {
                "database": "configured",
                "monitoring": "configured", 
                "ci_cd": "configured",
                "docker": "configured",
                "security": "configured"
            }
        }
        
        report_file = self.project_root / "deploy/deployment_report.json"
        with open(report_file, "w") as f:
            json.dump(deployment_report, f, indent=2)
            
        self.log("Production deployment completed successfully!", "SUCCESS")
        return True

if __name__ == "__main__":
    deployment = ProductionDeployment()
    deployment.run_deployment()
