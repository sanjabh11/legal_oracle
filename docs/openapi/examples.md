# OpenAPI Examples & Usage

## Dataset Endpoints

### Semantic Search Example
```bash
curl -X GET "http://localhost:8000/api/v1/indian_legal/semantic_search?query=property+dispute&limit=5" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Response:
```json
{
  "results": [
    {
      "case_title": "ABC vs XYZ",
      "summary": "Property dispute between neighbors...",
      "similarity_score": 0.89
    }
  ]
}
```

### Outcome Prediction Example
```bash
curl -X POST "http://localhost:8000/api/v1/outcome/predict" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "case_type": "property_dispute",
    "jurisdiction": "delhi",
    "key_facts": "boundary_dispute,encroachment,20_year_possession",
    "judge_name": "Justice Sharma"
  }'
```

## Dataset Health Check
```bash
curl -X GET "http://localhost:8000/api/v1/admin/health" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## Bulk Export
```bash
curl -X GET "http://localhost:8000/api/v1/datasets/indian_legal/export?format=csv" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  --output indian_legal_export.csv
```
