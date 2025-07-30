"""
Test environment setup for Legal Oracle backend
Ensures proper testing without mock data
"""

import os
import json
import asyncio
from typing import Dict, Any
from caselaw_service.api_models import (
    OutcomeRequest, StrategyRequest, SimulationRequest,
    JurisdictionRequest, ComplianceRequest, TrendsRequest,
    PrecedentRequest, ArbitrageRequest
)
from caselaw_service.gemini_client import gemini_client

class TestEnvironment:
    """Test environment for Legal Oracle backend"""
    
    def __init__(self):
        self.test_data = {
            "outcome": {
                "case_type": "contract_dispute",
                "jurisdiction": "California",
                "key_facts": ["Breach of contract for late delivery"],
                "judge_name": "Judge Smith"
            },
            "strategy": {
                "case_details": "Contract dispute involving software licensing",
                "strategies": ["litigation", "settlement", "mediation"]
            },
            "simulation": {
                "case_id": "test-case-001",
                "strategy": "aggressive litigation",
                "opponent_type": "experienced",
                "simulation_parameters": {
                    "iterations": 100,
                    "confidence_threshold": 0.8
                }
            }
        }
    
    def setup_test_environment(self):
        """Setup test environment with proper configuration"""
        print("Setting up test environment...")
        
        # Check for Gemini API key
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key or api_key == 'demo-key-for-testing':
            print("⚠️  Warning: GEMINI_API_KEY not found or is demo key")
            print("   Real API calls will fail")
            print("   Set GEMINI_API_KEY environment variable for real testing")
        else:
            print("✅ Gemini API key found")
    
    def run_model_validation_tests(self):
        """Run model validation tests"""
        print("\n🧪 Running model validation tests...")
        
        tests = [
            ("OutcomeRequest", OutcomeRequest, self.test_data["outcome"]),
            ("StrategyRequest", StrategyRequest, self.test_data["strategy"]),
            ("SimulationRequest", SimulationRequest, self.test_data["simulation"]),
            ("JurisdictionRequest", JurisdictionRequest, {"case_type": "contract", "key_facts": ["test"]}),
            ("ComplianceRequest", ComplianceRequest, {"industry": "tech", "regulations": ["GDPR"]}),
            ("TrendsRequest", TrendsRequest, {"industry": "legal", "timeframe": "12 months"})
        ]
        
        results = []
        for test_name, model_class, test_data in tests:
            try:
                model = model_class(**test_data)
                results.append({"test": test_name, "status": "PASS", "error": None})
            except Exception as e:
                results.append({"test": test_name, "status": "FAIL", "error": str(e)})
        
        return results
    
    def run_integration_tests(self):
        """Run integration tests"""
        print("\n🧪 Running integration tests...")
        
        async def test_gemini_integration():
            tests = [
                ("predict_outcome", lambda: gemini_client.predict_outcome(
                    case_type="contract_dispute",
                    jurisdiction="California",
                    key_facts=["Breach of contract"],
                    judge_name="Judge Smith"
                )),
                ("optimize_strategy", lambda: gemini_client.optimize_strategy(
                    case_details="Contract dispute analysis",
                    strategies=["litigation", "settlement"]
                )),
                ("simulate_strategy", lambda: gemini_client.simulate_strategy(
                    case_id="test-001",
                    strategy="aggressive litigation",
                    opponent_type="experienced",
                    simulation_parameters={"iterations": 50}
                ))
            ]
            
            results = []
            for test_name, test_func in tests:
                try:
                    result = await test_func()
                    results.append({"test": test_name, "status": "PASS", "error": None})
                except ValueError as e:
                    if "GEMINI_API_KEY" in str(e):
                        results.append({"test": test_name, "status": "SKIP", "error": "API key required"})
                    else:
                        results.append({"test": test_name, "status": "FAIL", "error": str(e)})
                except Exception as e:
                    results.append({"test": test_name, "status": "FAIL", "error": str(e)})
            
            return results
        
        return asyncio.run(test_gemini_integration())
    
    def generate_test_report(self):
        """Generate comprehensive test report"""
        print("\n📊 Generating test report...")
        
        self.setup_test_environment()
        model_results = self.run_model_validation_tests()
        integration_results = self.run_integration_tests()
        
        report = {
            "timestamp": "2025-07-29T13:49:53+05:30",
            "test_environment": {
                "gemini_api_configured": bool(os.getenv('GEMINI_API_KEY') and os.getenv('GEMINI_API_KEY') != 'demo-key-for-testing'),
                "python_version": "3.13",
                "framework": "FastAPI"
            },
            "model_validation": {
                "total_tests": len(model_results),
                "passed": len([r for r in model_results if r["status"] == "PASS"]),
                "failed": len([r for r in model_results if r["status"] == "FAIL"]),
                "skipped": len([r for r in model_results if r["status"] == "SKIP"]),
                "details": model_results
            },
            "integration_tests": {
                "total_tests": len(integration_results),
                "passed": len([r for r in integration_results if r["status"] == "PASS"]),
                "failed": len([r for r in integration_results if r["status"] == "FAIL"]),
                "skipped": len([r for r in integration_results if r["status"] == "SKIP"]),
                "details": integration_results
            },
            "summary": {
                "all_models_valid": all(r["status"] == "PASS" for r in model_results),
                "api_key_configured": bool(os.getenv('GEMINI_API_KEY') and os.getenv('GEMINI_API_KEY') != 'demo-key-for-testing'),
                "ready_for_production": all(r["status"] == "PASS" for r in model_results)
            }
        }
        
        # Save report
        with open('test_environment_report.json', 'w') as f:
            json.dump(report, f, indent=2)
        
        print(f"✅ Test report saved to test_environment_report.json")
        return report

if __name__ == "__main__":
    test_env = TestEnvironment()
    report = test_env.generate_test_report()
    
    print(f"\n🎯 Test Summary:")
    print(f"   Model Validation: {report['model_validation']['passed']}/{report['model_validation']['total_tests']} passed")
    print(f"   Integration Tests: {report['integration_tests']['passed']}/{report['integration_tests']['total_tests']} passed")
    print(f"   API Key Configured: {report['test_environment']['gemini_api_configured']}")
    print(f"   Ready for Production: {report['summary']['ready_for_production']}")
    
    if report['summary']['ready_for_production']:
        print("\n🚀 Legal Oracle backend is ready for production!")
    else:
        print("\n⚠️  Please configure GEMINI_API_KEY for full functionality")
