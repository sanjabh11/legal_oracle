import * as React from 'react';
const { useState } = React;
import { CaseLawOpinionCard } from '../components/CaseLawOpinionCard';
import { HuggingFaceOpinionCard } from '../components/HuggingFaceOpinionCard';

export function CaseLawDemo() {
  const [query, setQuery] = useState('Miranda');
  const [court, setCourt] = useState('');
  const [date, setDate] = useState('');
  const [hfResults, setHfResults] = useState<any>(null);
  const [clResults, setClResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runSearch() {
    setLoading(true);
    setError(null);
    setHfResults(null);
    setClResults(null);
    try {
      // Hugging Face (local/streaming)
      const res1 = await fetch(`http://localhost:8000/api/v1/caselaw/search?query=${encodeURIComponent(query)}`);
      const data1 = await res1.json();
      setHfResults(data1);

      // CourtListener (live)
      let url = `http://localhost:8000/api/v1/courtlistener/opinions?query=${encodeURIComponent(query)}`;
      if (court) url += `&court=${encodeURIComponent(court)}`;
      if (date) url += `&date_filed=${encodeURIComponent(date)}`;
      const res2 = await fetch(url);
      const data2 = await res2.json();
      setClResults(data2);
    } catch (e: any) {
      setError(e.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  // Extract opinions from CourtListener response
  const clOpinions = clResults?.results || clResults?.opinions || [];

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded mt-8">
      <h2 className="text-lg font-bold mb-4">CaseLaw API Demo</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          className="border rounded px-2 py-1 flex-1 min-w-[180px]"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Enter search term (e.g. Miranda)"
        />
        <input
          className="border rounded px-2 py-1 min-w-[120px]"
          value={court}
          onChange={e => setCourt(e.target.value)}
          placeholder="Court (optional)"
        />
        <input
          className="border rounded px-2 py-1 min-w-[120px]"
          value={date}
          onChange={e => setDate(e.target.value)}
          placeholder="Date (YYYY-MM-DD)"
        />
        <button
          className="bg-blue-600 text-white px-4 py-1 rounded disabled:opacity-50"
          onClick={runSearch}
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
      {error && <div className="text-red-600 mb-2">Error: {error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <h3 className="font-semibold mb-2">Hugging Face (local)</h3>
          {/* Show Hugging Face results as cards */}
          {Array.isArray(hfResults) && hfResults.length > 0 ? (
            hfResults.map((op: any, i: number) => (
              <HuggingFaceOpinionCard key={i} opinion={op} highlight={query} />
            ))
          ) : (
            <div className="text-gray-500">No results yet.</div>
          )}
          {/* Show raw JSON for devs */}
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto mt-2" style={{maxHeight: 200}}>
            {hfResults ? JSON.stringify(hfResults, null, 2) : 'No results yet.'}
          </pre>
        </div>
        <div>
          <h3 className="font-semibold mb-2">CourtListener (live)</h3>
          {/* Show extracted opinions as cards */}
          {clOpinions.length > 0 ? (
            clOpinions.map((op: any, i: number) => <CaseLawOpinionCard key={i} opinion={op} />)
          ) : (
            <div className="text-gray-500">No opinions found.</div>
          )}
          {/* Show raw JSON for devs */}
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto mt-2" style={{maxHeight: 200}}>
            {clResults ? JSON.stringify(clResults, null, 2) : 'No results yet.'}
          </pre>
        </div>
      </div>
    </div>
  );
}
