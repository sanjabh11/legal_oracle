import React from 'react';

export interface CaseLawOpinionCardProps {
  opinion: any;
}

export function CaseLawOpinionCard({ opinion }: CaseLawOpinionCardProps) {
  if (!opinion) return null;

  // Extract key fields with fallbacks
  const title = opinion.case_name || opinion.title || opinion.cluster?.case_name || 'Untitled Case';
  const court = opinion.court || opinion.court_name || (opinion.cluster && opinion.cluster.court) || '';
  const date = opinion.date_filed || opinion.date || opinion.decision_date || '';
  const summary = opinion.plain_text?.slice(0, 300) || opinion.summary || opinion.headnote || '';
  const pdfUrl = opinion.download_url || opinion.html || opinion.local_path || '';
  const cited = Array.isArray(opinion.opinions_cited) ? opinion.opinions_cited : [];

  return (
    <div className="border rounded p-3 mb-3 bg-gray-50 shadow-sm">
      <div className="font-bold text-lg mb-1">{title}</div>
      <div className="text-sm text-gray-500 mb-1">{court}{date && `, ${date}`}</div>
      {summary && <div className="mb-2 text-gray-700"><span className="font-semibold">Summary:</span> {summary}{opinion.plain_text?.length > 300 && '...'}</div>}
      {pdfUrl && (
        <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline mr-4">
          Read Full Opinion
        </a>
      )}
      {cited.length > 0 && (
        <div className="mt-2">
          <span className="font-semibold">Cited Cases:</span>
          <ul className="list-disc list-inside">
            {cited.map((url: string, i: number) => (
              <li key={url + i}>
                <a href={url.replace('?format=json', '')} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  {url.replace('https://www.courtlistener.com/api/rest/v4/opinions/', '').replace('/?format=json', '')}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Actions: Download, Save, Bookmark, etc. */}
      {pdfUrl && (
        <a href={pdfUrl} download className="ml-4 text-green-700 underline">
          Download PDF
        </a>
      )}
    </div>
  );
}
