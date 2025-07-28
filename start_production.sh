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
