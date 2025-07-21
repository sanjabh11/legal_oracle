import * as React from 'react';
import { LegalDatasetSearch } from '../components/LegalDatasetSearch';
import { HuggingFaceOpinionCard } from '../components/HuggingFaceOpinionCard';
import { CaseLawOpinionCard } from '../components/CaseLawOpinionCard';

export function CaseLawDemo() {
  // All hooks and logic must be above return
  // Example state for demonstration (replace with real state/hooks as needed)
  const [selectedDataset, setSelectedDataset] = React.useState('pile_of_law');
  const [extraParams, setExtraParams] = React.useState<any>({});
  const [query, setQuery] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState<any[]|null>(null);
  const [rawJson, setRawJson] = React.useState<any|null>(null);
  const [error, setError] = React.useState<string|null>(null);
  const datasets = [
    'pile_of_law', 'inlegalbert', 'legal_summarization',
    'indian_legal_dataset', 'court_cases', 'legal_contracts', 'patent_data'
  ];

  // UI: Dynamic search fields based on dataset
  function renderExtraFields() {
    if (selectedDataset === 'pile_of_law') {
      return (
        <input
          className="border rounded px-2 py-1 min-w-[120px]"
          value={extraParams.subset || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setExtraParams((p: any) => ({ ...p, subset: e.target.value }))}
          placeholder="Subset (e.g. courtListener_opinions, atticus_contracts)"
        />
      );
    }
    if (selectedDataset === 'patent_data') {
      return (
        <input
          className="border rounded px-2 py-1 min-w-[120px]"
          value={extraParams.field || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setExtraParams((p: any) => ({ ...p, field: e.target.value }))}
          placeholder="Field (e.g. abstract)"
        />
      );
    }
    return null;
  }

  async function runSearch() {
    if (!selectedDataset) return;
    setLoading(true);
    setError(null);
    setResults(null);
    setRawJson(null);
    try {
      let url = `/api/v1/dataset/search/${selectedDataset}?keyword=${encodeURIComponent(query)}`;
      // Add extra params
      if (selectedDataset === 'pile_of_law' && extraParams.subset) url += `&subset=${encodeURIComponent(extraParams.subset)}`;
      if (selectedDataset === 'patent_data' && extraParams.field) url += `&field=${encodeURIComponent(extraParams.field)}`;
      // Add limit param for all
      url += '&limit=20';
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Search failed: ${res.status}`);
      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        // If response is HTML or invalid JSON, show a clear error
        const text = await res.text();
        throw new Error('Backend returned invalid response (HTML or non-JSON). Check server status or endpoint.');
      }
      setResults(Array.isArray(data) ? data : data.results || []);
      setRawJson(data);
    } catch (e: any) {
      setError(e.message || 'Unknown error during search');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded mt-8">
        <LegalDatasetSearch />
        <select
          className="border rounded px-2 py-1 min-w-[180px]"
          value={selectedDataset}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedDataset(e.target.value)}
        >
          {datasets.map(ds => (
            <option key={ds} value={ds}>{ds}</option>
          ))}
        </select>
        <input
          className="border rounded px-2 py-1 flex-1 min-w-[180px]"
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
          placeholder="Enter search term (e.g. contract, patent)"
        />
        {renderExtraFields()}
        <button
          className="bg-blue-600 text-white px-4 py-1 rounded disabled:opacity-50"
          onClick={runSearch}
          disabled={loading || !selectedDataset}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
      {error && <div className="text-red-600 mb-2">Error: {error}</div>}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Results ({selectedDataset})</h3>
        {loading && <div className="text-blue-600">Loading...</div>}
        {Array.isArray(results) && results && results.length > 0 ? (
          // TODO: Replace 'any' with dataset-specific types for stricter type safety
          results.map((op: unknown, i: number) => (
            selectedDataset === 'court_cases' || selectedDataset === 'pile_of_law' || selectedDataset === 'indian_legal_dataset'
              ? <HuggingFaceOpinionCard key={i} opinion={op as any} highlight={query} />
              : <CaseLawOpinionCard key={i} opinion={op as any} />
          ))
        ) : !loading ? (
          <div className="text-gray-500">No results yet.</div>
        ) : null}
        {/* Show raw JSON for devs */}
        <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto mt-2" style={{maxHeight: 200}}>
          {rawJson ? JSON.stringify(rawJson, null, 2) : 'No results yet.'}
        </pre>
      </div>
    </div>
  );
}
