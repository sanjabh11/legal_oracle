#!/usr/bin/env python3
"""
Comprehensive QA Testing Suite for Legal Oracle Platform
Tests all user stories, API endpoints, dataset wrappers, and security features
"""

import pytest
import asyncio
import httpx
import json
import time
from typing import Dict, Any, List
import os
from pathlib import Path

# Test configuration
TEST_BASE_URL = "http://localhost:8000"
ADMIN_TOKEN = "test_admin_token"
USER_TOKEN = "test_user_token"

class TestSuite:
    """Comprehensive test suite for Legal Oracle"""
    
    def __init__(self):
        self.client = httpx.AsyncClient(base_url=TEST_BASE_URL)
        self.test_results = []
        
    async def run_all_tests(self):
        """Execute all test suites"""
        print("🧪 Starting Comprehensive Legal Oracle QA Testing...")
        
        # User Story Tests
        await self.test_user_stories()
        
        # API Endpoint Tests
        await self.test_api_endpoints()
        
        # Dataset Wrapper Tests
        await self.test_dataset_wrappers()
        
        # Security Tests
        await self.test_security()
        
        # Performance Tests
        await self.test_performance()
        
        # Generate Report
        await self.generate_report()
    
    async def test_user_stories(self):
        """Test all user stories from PRD"""
        print("\n📋 Testing User Stories...")
        
        user_stories = [
            {
                "story": "Predict Case Outcomes",
                "endpoint": "/api/v1/outcome/predict",
                "test_cases": [
                    {
                        "case_type": "contract_dispute",
                        "jurisdiction": "California",
                        "key_facts": "Breach of software development contract, $50k damages",
                        "expected": "probability_distribution"
                    },
                    {
                        "case_type": "personal_injury",
                        "jurisdiction": "New York",
                        "key_facts": "Car accident, whiplash injury, medical bills $15k",
                        "expected": "probability_distribution"
                    }
                ]
            },
            {
                "story": "Optimize Legal Strategies",
                "endpoint": "/api/v1/strategy/optimize",
                "test_cases": [
                    {
                        "case_details": "Employment discrimination case in NY",
                        "current_strategy": "Direct litigation approach",
                        "constraints": "Budget $25k, timeline 6 months",
                        "expected": "strategy_recommendations"
                    }
                ]
            },
            {
                "story": "Forecast Regulatory Changes",
                "endpoint": "/api/v1/trends/forecast",
                "test_cases": [
                    {
                        "industry": "fintech",
                        "jurisdiction": "California",
                        "current_regulations": ["GDPR", "PCI_DSS"],
                        "expected": "regulatory_forecast"
                    }
                ]
            },
            {
                "story": "Optimize Compliance",
                "endpoint": "/api/v1/compliance/optimize",
                "test_cases": [
                    {
                        "industry": "healthcare",
                        "jurisdiction": "US",
                        "current_practices": ["HIPAA", "SOC2"],
                        "expected": "compliance_recommendations"
                    }
                ]
            }
        ]
        
        for story in user_stories:
            print(f"  Testing: {story['story']}")
            for test_case in story['test_cases']:
                try:
                    response = await self.client.post(
                        story['endpoint'],
                        json=test_case,
                        headers={"Authorization": f"Bearer {USER_TOKEN}"}
                    )
                    
                    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
                    data = response.json()
                    assert 'result' in data or 'predictions' in data, "Missing expected response structure"
                    
                    self.test_results.append({
                        "type": "user_story",
                        "story": story['story'],
                        "status": "PASS",
                        "response_time": response.elapsed.total_seconds()
                    })
                    
                except Exception as e:
                    self.test_results.append({
                        "type": "user_story",
                        "story": story['story'],
                        "status": "FAIL",
                        "error": str(e)
                    })
    
    async def test_api_endpoints(self):
        """Test all API endpoints"""
        print("\n🔗 Testing API Endpoints...")
        
        endpoints = [
            # Dataset endpoints
            {"method": "GET", "endpoint": "/api/v1/datasets", "auth": True},
            {"method": "POST", "endpoint": "/api/v1/datasets/indian_legal_dataset/search", "data": {"query": "contract"}, "auth": True},
            {"method": "POST", "endpoint": "/api/v1/datasets/indian_legal_dataset/semantic_search", "data": {"query": "breach of contract"}, "auth": True},
            
            # Admin endpoints
            {"method": "GET", "endpoint": "/api/v1/admin/health", "auth": True, "admin": True},
            {"method": "GET", "endpoint": "/api/v1/admin/metrics", "auth": True, "admin": True},
            {"method": "GET", "endpoint": "/api/v1/admin/datasets", "auth": True, "admin": True},
            
            # Export endpoints
            {"method": "GET", "endpoint": "/api/v1/export/datasets/indian_legal_dataset/csv?limit=10", "auth": True},
            {"method": "GET", "endpoint": "/api/v1/export/datasets/indian_legal_dataset/json?limit=10", "auth": True},
            
            # Feedback endpoints
            {"method": "POST", "endpoint": "/api/v1/feedback/submit", "data": {"dataset_name": "indian_legal_dataset", "item_id": "test_123", "feedback_type": "helpful"}, "auth": True},
            {"method": "GET", "endpoint": "/api/v1/feedback/stats", "auth": True}
        ]
        
        for endpoint in endpoints:
            try:
                headers = {"Authorization": f"Bearer {ADMIN_TOKEN if endpoint.get('admin') else USER_TOKEN}"}
                
                if endpoint["method"] == "GET":
                    response = await self.client.get(endpoint["endpoint"], headers=headers)
                else:
                    response = await self.client.post(endpoint["endpoint"], json=endpoint.get("data", {}), headers=headers)
                
                assert response.status_code in [200, 201], f"Expected success, got {response.status_code}"
                
                self.test_results.append({
                    "type": "api_endpoint",
                    "endpoint": endpoint["endpoint"],
                    "status": "PASS",
                    "response_time": response.elapsed.total_seconds()
                })
                
            except Exception as e:
                self.test_results.append({
                    "type": "api_endpoint",
                    "endpoint": endpoint["endpoint"],
                    "status": "FAIL",
                    "error": str(e)
                })
    
    async def test_dataset_wrappers(self):
        """Test all dataset wrappers"""
        print("\n📊 Testing Dataset Wrappers...")
        
        datasets = [
            "indian_legal_dataset",
            "pile_of_law",
            "inlegalbert",
            "legal_summarization",
            "legal_contracts",
            "patent_data",
            "court_cases"
        ]
        
        for dataset_name in datasets:
            try:
                # Test basic search
                search_payload = {"query": "test", "limit": 5}
                response = await self.client.post(
                    f"/api/v1/datasets/{dataset_name}/search",
                    json=search_payload,
                    headers={"Authorization": f"Bearer {USER_TOKEN}"}
                )
                
                assert response.status_code == 200
                data = response.json()
                assert "results" in data
                
                # Test semantic search
                semantic_payload = {"query": "legal case analysis", "limit": 5}
                response = await self.client.post(
                    f"/api/v1/datasets/{dataset_name}/semantic_search",
                    json=semantic_payload,
                    headers={"Authorization": f"Bearer {USER_TOKEN}"}
                )
                
                assert response.status_code == 200
                
                self.test_results.append({
                    "type": "dataset_wrapper",
                    "dataset": dataset_name,
                    "status": "PASS"
                })
                
            except Exception as e:
                self.test_results.append({
                    "type": "dataset_wrapper",
                    "dataset": dataset_name,
                    "status": "FAIL",
                    "error": str(e)
                })
    
    async def test_security(self):
        """Test security features"""
        print("\n🔒 Testing Security Features...")
        
        # Test authentication
        try:
            response = await self.client.get("/api/v1/admin/health")
            assert response.status_code == 401, "Should require authentication"
            
            self.test_results.append({
                "type": "security",
                "test": "authentication",
                "status": "PASS"
            })
        except Exception as e:
            self.test_results.append({
                "type": "security",
                "test": "authentication",
                "status": "FAIL",
                "error": str(e)
            })
        
        # Test rate limiting
        try:
            # Make multiple rapid requests
            tasks = []
            for i in range(10):
                task = self.client.get(
                    "/api/v1/datasets",
                    headers={"Authorization": f"Bearer {USER_TOKEN}"}
                )
                tasks.append(task)
            
            responses = await asyncio.gather(*tasks)
            
            # Check for rate limit headers
            if responses:
                headers = responses[0].headers
                assert "X-RateLimit-Limit" in headers
                
                self.test_results.append({
                    "type": "security",
                    "test": "rate_limiting",
                    "status": "PASS"
                })
        except Exception as e:
            self.test_results.append({
                "type": "security",
                "test": "rate_limiting",
                "status": "FAIL",
                "error": str(e)
            })
    
    async def test_performance(self):
        """Test performance benchmarks"""
        print("\n⚡ Testing Performance...")
        
        performance_tests = [
            {
                "test": "outcome_prediction",
                "endpoint": "/api/v1/outcome/predict",
                "max_time": 0.2,  # 200ms
                "iterations": 5
            },
            {
                "test": "dataset_search",
                "endpoint": "/api/v1/datasets/indian_legal_dataset/search",
                "max_time": 0.15,  # 150ms
                "iterations": 5
            }
        ]
        
        for test in performance_tests:
            try:
                times = []
                for i in range(test["iterations"]):
                    start_time = time.time()
                    
                    response = await self.client.post(
                        test["endpoint"],
                        json={"query": "test", "limit": 10},
                        headers={"Authorization": f"Bearer {USER_TOKEN}"}
                    )
                    
                    elapsed = time.time() - start_time
                    times.append(elapsed)
                
                avg_time = sum(times) / len(times)
                
                self.test_results.append({
                    "type": "performance",
                    "test": test["test"],
                    "status": "PASS" if avg_time <= test["max_time"] else "FAIL",
                    "avg_time": avg_time,
                    "target_time": test["max_time"]
                })
                
            except Exception as e:
                self.test_results.append({
                    "type": "performance",
                    "test": test["test"],
                    "status": "FAIL",
                    "error": str(e)
                })
    
    async def generate_report(self):
        """Generate comprehensive test report"""
        print("\n📊 Generating Test Report...")
        
        # Calculate statistics
        total_tests = len(self.test_results)
        passed_tests = len([r for r in self.test_results if r["status"] == "PASS"])
        failed_tests = len([r for r in self.test_results if r["status"] == "FAIL"])
        
        # Group by type
        test_summary = {}
        for result in self.test_results:
            test_type = result["type"]
            if test_type not in test_summary:
                test_summary[test_type] = {"pass": 0, "fail": 0, "total": 0}
            
            if result["status"] == "PASS":
                test_summary[test_type]["pass"] += 1
            else:
                test_summary[test_type]["fail"] += 1
            test_summary[test_type]["total"] += 1
        
        # Performance metrics
        performance_results = [r for r in self.test_results if r["type"] == "performance"]
        
        report = {
            "summary": {
                "total_tests": total_tests,
                "passed": passed_tests,
                "failed": failed_tests,
                "success_rate": (passed_tests / total_tests * 100) if total_tests > 0 else 0
            },
            "test_breakdown": test_summary,
            "detailed_results": self.test_results,
            "performance_metrics": performance_results,
            "recommendations": self.generate_recommendations()
        }
        
        # Save report
        with open("test_report.json", "w") as f:
            json.dump(report, f, indent=2)
        
        print(f"\n🎯 Test Summary:")
        print(f"   Total Tests: {total_tests}")
        print(f"   Passed: {passed_tests}")
        print(f"   Failed: {failed_tests}")
        print(f"   Success Rate: {report['summary']['success_rate']:.1f}%")
        
        return report
    
    def generate_recommendations(self):
        """Generate recommendations based on test results"""
        recommendations = []
        
        failed_tests = [r for r in self.test_results if r["status"] == "FAIL"]
        
        if failed_tests:
            recommendations.append({
                "priority": "HIGH",
                "issue": "Failed tests detected",
                "action": "Review and fix failed test cases",
                "count": len(failed_tests)
            })
        
        # Performance recommendations
        performance_failures = [r for r in failed_tests if r.get("type") == "performance"]
        if performance_failures:
            recommendations.append({
                "priority": "MEDIUM",
                "issue": "Performance benchmarks not met",
                "action": "Optimize API response times and caching",
                "affected_tests": performance_failures
            })
        
        return recommendations

# Test runner
async def main():
    """Main test runner"""
    test_suite = TestSuite()
    await test_suite.run_all_tests()

if __name__ == "__main__":
    asyncio.run(main())
