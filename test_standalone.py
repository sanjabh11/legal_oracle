#!/usr/bin/env python3
"""
Standalone test script for Legal Oracle API endpoints
Tests all endpoints without requiring server startup
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import asyncio
import json
from typing import Dict, Any, List
from caselaw_service.gemini_client import GeminiClient

async def test_gemini_client():
    """Test Gemini client directly"""
    print("🧪 Testing Gemini Client Integration...")
    
    client = GeminiClient()
    
    test_cases = [
        {
            "test": "predict_outcome",
            "params": {
                "case_type": "contract_dispute",
                "jurisdiction": "California",
                "key_facts": ["Breach of software development contract", "$50k in damages"],
                "judge_name": "Judge Smith"
            }
        },
        {
            "test": "optimize_strategy",
            "params": {
                "case_details": "Employment discrimination case in New York",
                "strategies": ["Direct litigation", "Settlement negotiation", "Mediation"]
            }
        },
        {
            "test": "simulate_strategy",
            "params": {
                "case_id": "test-001",
                "strategy": "Aggressive litigation approach",
                "opponent_type": "opposing_counsel",
                "simulation_parameters": {"budget": 50000, "timeline": "6_months"}
            }
        }
    ]
    
    results = []
    
    for test_case in test_cases:
        try:
            print(f"  Testing {test_case['test']}...")
            
            if test_case['test'] == 'predict_outcome':
                result = await client.predict_outcome(**test_case['params'])
            elif test_case['test'] == 'optimize_strategy':
                result = await client.optimize_strategy(**test_case['params'])
            elif test_case['test'] == 'simulate_strategy':
                result = await client.simulate_strategy(**test_case['params'])
            
            results.append({
                "test": test_case['test'],
                "status": "PASS",
                "result": result,
                "error": None
            })
            
            print(f"    ✓ {test_case['test']} completed successfully")
            print(f"    Result: {json.dumps(result, indent=2)}")
            
        except Exception as e:
            results.append({
                "test": test_case['test'],
                "status": "FAIL",
                "result": None,
                "error": str(e)
            })
            print(f"    ✗ {test_case['test']} failed: {e}")
    
    # Generate summary
    passed = sum(1 for r in results if r["status"] == "PASS")
    total = len(results)
    
    print(f"\n📊 Gemini Client Test Results:")
    print(f"   Total: {total}")
    print(f"   Passed: {passed}")
    print(f"   Failed: {total - passed}")
    print(f"   Success Rate: {(passed/total*100):.1f}%")
    
    # Save results
    with open("gemini_test_results.json", "w") as f:
        json.dump(results, f, indent=2)
    
    return results

async def test_api_models():
    """Test API models and validation"""
    print("\n🧪 Testing API Models and Validation...")
    
    try:
        from caselaw_service.models import (
            OutcomeRequest, StrategyRequest, SimulationRequest,
            JurisdictionRequest, ComplianceRequest, TrendsRequest
        )
        
        # Test model instantiation
        models_to_test = [
            OutcomeRequest(
                case_type="contract_dispute",
                jurisdiction="California",
                key_facts="Breach of contract"
            ),
            StrategyRequest(
                case_id="test-001",
                case_details="Test case details"
            ),
            SimulationRequest(
                strategy="Test strategy",
                opponent_type="opposing_counsel"
            ),
            JurisdictionRequest(
                case_type="intellectual_property",
                key_facts="Patent infringement"
            ),
            ComplianceRequest(
                industry="healthcare"
            ),
            TrendsRequest(
                industry="fintech"
            )
        ]
        
        for model in models_to_test:
            print(f"    ✓ {type(model).__name__} validated successfully")
        
        return [{
            "test": "api_models",
            "status": "PASS",
            "models_tested": len(models_to_test)
        }]
        
    except Exception as e:
        return [{
            "test": "api_models",
            "status": "FAIL",
            "error": str(e)
        }]

async def run_standalone_tests():
    """Run all standalone tests"""
    print("🚀 Starting Standalone Legal Oracle Tests...")
    
    # Test Gemini client
    gemini_results = await test_gemini_client()
    
    # Test API models
    model_results = await test_api_models()
    
    # Combine results
    all_results = gemini_results + model_results
    
    # Final summary
    passed = sum(1 for r in all_results if r["status"] == "PASS")
    total = len(all_results)
    
    print(f"\n🎯 Final Test Summary:")
    print(f"   Total Tests: {total}")
    print(f"   Passed: {passed}")
    print(f"   Failed: {total - passed}")
    print(f"   Success Rate: {(passed/total*100):.1f}%")
    
    # Save comprehensive report
    final_report = {
        "summary": {
            "total": total,
            "passed": passed,
            "failed": total - passed,
            "success_rate": passed/total*100
        },
        "results": all_results
    }
    
    with open("standalone_test_report.json", "w") as f:
        json.dump(final_report, f, indent=2)
    
    return final_report

if __name__ == "__main__":
    asyncio.run(run_standalone_tests())
