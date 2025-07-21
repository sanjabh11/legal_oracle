import * as React from 'react';
import { CaseLawOpinionCard } from './CaseLawOpinionCard';
import { HuggingFaceOpinionCard } from './HuggingFaceOpinionCard';
import { API_BASE_URL } from '../config';

/**
 * Reusable component that lets the user select one of the streaming Hugging Face
 * legal datasets and perform a keyword search. It renders dataset-specific extra
 * fields (e.g. subset for pile_of_law) and displays results as opinion cards.
 */
export function LegalDatasetSearch() {
  const [datasets, setDatasets] = React.useState<string[]>([]);
  const [selectedDataset, setSelectedDataset] = React.useState<string>('');
  const [query, setQuery] = React.useState('');
  const [extraParams, setExtraParams] = React.useState<Record<string, string>>({});
  const [results, setResults] = React.useState<unknown[] | null>(null);
  const [pileOfLawSubsets, setPileOfLawSubsets] = React.useState<string[]>([]);
  const [rawJson, setRawJson] = React.useState<unknown>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch dataset list once on mount
  React.useEffect(() => {
    async function fetchDatasets() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/dataset/list`);
        if (!res.ok) throw new Error('Failed to fetch datasets');
        const data = await res.json();
        setDatasets(data);
        setSelectedDataset(data[0] || '');
      } catch (e: any) {
        setError(e.message || 'Unknown error fetching datasets');
      } finally {
        setLoading(false);
      }
    }
    fetchDatasets();
  }, []);

  // Fetch pile_of_law subsets when needed
  React.useEffect(() => {
    if (selectedDataset === 'pile_of_law' && pileOfLawSubsets.length === 0) {
      fetch(`${API_BASE_URL}/dataset/pile_of_law/subsets`).then(async res => {
        if (res.ok) {
          setPileOfLawSubsets(await res.json());
        }
      });
    }
  }, [selectedDataset, pileOfLawSubsets.length]);

  // Dataset-specific extra search fields
  function renderExtraFields() {
    if (selectedDataset === 'pile_of_law') {
      return (
        <select
          className="border rounded px-2 py-1 min-w-[200px]"
          value={extraParams.subset || ''}
          onChange={e => setExtraParams(p => ({ ...p, subset: e.target.value }))}
        >
          <option value="">Select subset...</option>
          {pileOfLawSubsets.map(subset => (
            <option key={subset} value={subset}>{subset}</option>
          ))}
        </select>
      );
    }
    if (selectedDataset === 'patent_data') {
      return (
        <input
          className="border rounded px-2 py-1 min-w-[120px]"
          value={extraParams.field || ''}
          onChange={(e) => setExtraParams((p) => ({ ...p, field: e.target.value }))}
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
      let url = `${API_BASE_URL}/dataset/search/${selectedDataset}?keyword=${encodeURIComponent(query)}`;
      if (selectedDataset === 'pile_of_law' && extraParams.subset) {
        url += `&subset=${encodeURIComponent(extraParams.subset)}`;
      }
      if (selectedDataset === 'patent_data' && extraParams.field) {
        url += `&field=${encodeURIComponent(extraParams.field)}`;
      }
      url += '&limit=20';

      const res = await fetch(url);
      if (!res.ok) throw new Error(`Search failed: ${res.status}`);

      let data: any;
      try {
        data = await res.json();
      } catch {
        // Non-JSON (likely HTML) response
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
      <h2 className="text-lg font-bold mb-4">Legal Dataset Streaming Search</h2>
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <select
          className="border rounded px-2 py-1 min-w-[180px]"
          value={selectedDataset}
          onChange={(e) => setSelectedDataset(e.target.value)}
        >
          {datasets.filter(ds => ds !== "inlegalbert").map((ds) => (
            <option key={ds} value={ds}>
              {ds}
            </option>
          ))}
        </select>
        <input
          className="border rounded px-2 py-1 flex-1 min-w-[180px]"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter search term (e.g. contract, patent)"
        />
        {renderExtraFields()}
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={runSearch}
          disabled={loading || (selectedDataset === 'pile_of_law' && !extraParams.subset)}
        >
          Search
        </button>
        {selectedDataset === 'pile_of_law' && !extraParams.subset && (
          <div className="text-sm text-red-500 mt-1">Subset is required for Pile of Law (e.g. courtListener_opinions)</div>
        )}
      </div>
      {error && <div className="text-red-600 mb-2">Error: {error}</div>}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Results ({selectedDataset})</h3>
        <div>
          {loading && <div className="text-blue-600">Loading…</div>}
          {Array.isArray(results) && results.length > 0 && (
            <>
              {results.map((op: any, i: number) =>
                selectedDataset === 'court_cases' ||
                selectedDataset === 'pile_of_law' ||
                selectedDataset === 'indian_legal_dataset' ? (
                  <HuggingFaceOpinionCard key={i} opinion={op} highlight={query} />
                ) : (
                  <CaseLawOpinionCard key={i} opinion={op} />
                )
              )}
            </>
          )}
          {results && Array.isArray(results) && results.length === 0 && (
            <div className="text-gray-500 italic mb-2">No results found.</div>
          )}
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto max-h-40">{rawJson ? JSON.stringify(rawJson, null, 2) : 'No results yet.'}</pre>
        </div>
      </div>
    </div>
  );
}
