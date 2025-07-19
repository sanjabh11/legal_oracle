import * as React from 'react';
import { CaseLawOpinionCard } from './CaseLawOpinionCard';
import { HuggingFaceOpinionCard } from './HuggingFaceOpinionCard';
import { searchCourtListenerOpinions } from '../services/caselaw';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function GlobalLegalSearchModal({ open, onClose }: Props) {
  const [query, setQuery] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState<any[]>([]);
  const [hfResults, setHfResults] = React.useState<any[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      setQuery('');
      setResults([]);
      setHfResults([]);
      setError(null);
    }
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const listener = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [open, onClose]);

  const runSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setResults([]);
    setHfResults([]);
    setError(null);
    try {
      const clData = await searchCourtListenerOpinions(query);
      setResults(clData.results || clData.opinions || []);
    } catch (err: any) {
      setError('CourtListener search failed');
    }
    try {
      const res = await fetch(`/api/v1/caselaw/search?query=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setHfResults(data);
      } else {
        setError('Hugging Face search failed');
      }
    } catch {
      setError('Hugging Face search failed');
    }
    setLoading(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
          aria-label="Close"
        >
          ×
        </button>
        <form onSubmit={runSearch} className="flex gap-2 items-center mb-4">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search legal cases (global hotkey: Ctrl+K)"
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
            autoFocus
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">CourtListener</h4>
            {results.length > 0 ? (
              results.map((op, i) => <CaseLawOpinionCard key={i} opinion={op} />)
            ) : (
              <div className="text-gray-500">No results.</div>
            )}
          </div>
          <div>
            <h4 className="font-semibold mb-2">Hugging Face (local)</h4>
            {hfResults.length > 0 ? (
              hfResults.map((op, i) => <HuggingFaceOpinionCard key={i} opinion={op} highlight={query} />)
            ) : (
              <div className="text-gray-500">No results.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
