#!/usr/bin/env python3
"""
Asynchronous test runner for Legal Oracle Platform
Tests all API endpoints with real Gemini integration
"""

import asyncio
import httpx
import json
import time
from typing import Dict, Any, List
import os

# Test configuration
TEST_BASE_URL = "http://localhost:8003"
ADMIN_TOKEN = "test_admin_token"
USER_TOKEN = "test_user_token"

async def test_api_endpoint(client: httpx.AsyncClient, endpoint: str, payload: Dict[str, Any], expected_status: int = 200) -> Dict[str, Any]:
    """Test a single API endpoint"""
    try:
        response = await client.post(
            f"{TEST_BASE_URL}{endpoint}",
            json=payload,
            headers={"Authorization": f"Bearer {USER_TOKEN}"}
        )
        
        return {
            "endpoint": endpoint,
            "status": "PASS" if response.status_code == expected_status else "FAIL",
            "status_code": response.status_code,
            "response": response.json() if response.status_code == 200 else None,
            "error": None if response.status_code == 200 else response.text
        }
    except Exception as e:
        return {
            "endpoint": endpoint,
            "status": "FAIL",
            "status_code": 0,
            "response": None,
            "error": str(e)
        }

async def run_comprehensive_tests():
    """Run comprehensive async tests"""
    print("🧪 Starting Comprehensive Async Tests...")
    
    async with httpx.AsyncClient() as client:
        test_results = []
        
        # Test 1: Predict case outcomes
        test_results.append(await test_api_endpoint(
            client, 
            "/api/v1/outcome/predict",
            {
                "case_type": "contract_dispute",
                "jurisdiction": "California",
                "key_facts": "Breach of software development contract with $50k damages",
                "judge_name": "Judge Smith"
            }
        ))
        
        # Test 2: Optimize legal strategies
        test_results.append(await test_api_endpoint(
            client,
            "/api/v1/strategy/optimize",
            {
                "case_id": "test-case-001",
                "case_type": "employment_discrimination",
                "jurisdiction": "New York",
                "key_facts": "Employee terminated after reporting harassment",
                "current_strategy": "Direct litigation approach"
            }
        ))
        
        # Test 3: Run simulation
        test_results.append(await test_api_endpoint(
            client,
            "/api/v1/simulation/run",
            {
                "case_id": "test-case-001",
                "strategy": "Aggressive litigation with media pressure",
                "opponent_type": "opposing_counsel",
                "simulation_parameters": {
                    "budget": 50000,
                    "timeline": "6_months"
                }
            }
        ))
        
        # Test 4: Optimize jurisdiction
        test_results.append(await test_api_endpoint(
            client,
            "/api/v1/jurisdiction/optimize",
            {
                "case_type": "intellectual_property",
                "key_facts": "Software patent infringement case",
                "current_jurisdiction": "Texas"
            }
        ))
        
        # Test 5: Optimize compliance
        test_results.append(await test_api_endpoint(
            client,
            "/api/v1/compliance/optimize",
            {
                "industry": "healthcare",
                "jurisdiction": "California",
                "current_practices": ["HIPAA", "SOC2"]
            }
        ))
        
        # Test 6: Forecast trends
        test_results.append(await test_api_endpoint(
            client,
            "/api/v1/trends/forecast",
            {
                "industry": "fintech",
                "jurisdiction": "California",
                "current_regulations": ["GDPR", "PCI_DSS"]
            }
        ))
        
        # Generate report
        passed = sum(1 for r in test_results if r["status"] == "PASS")
        total = len(test_results)
        
        print(f"\n📊 Test Results:")
        print(f"   Total Tests: {total}")
        print(f"   Passed: {passed}")
        print(f"   Failed: {total - passed}")
        print(f"   Success Rate: {(passed/total*100):.1f}%")
        
        # Detailed results
        for result in test_results:
            print(f"   {result['endpoint']}: {result['status']}")
            if result["error"]:
                print(f"     Error: {result['error']}")
        
        # Save detailed report
        with open("async_test_report.json", "w") as f:
            json.dump(test_results, f, indent=2)
        
        return test_results

async def main():
    """Main async test runner"""
    await run_comprehensive_tests()

if __name__ == "__main__":
    asyncio.run(main())
