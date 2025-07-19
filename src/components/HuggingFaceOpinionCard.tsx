import * as React from 'react';

export interface HuggingFaceOpinionCardProps {
  opinion: any;
  highlight?: string;
}

export function HuggingFaceOpinionCard({ opinion, highlight }: HuggingFaceOpinionCardProps) {
  if (!opinion) return null;

  // Extract fields with fallback
  const title = opinion.case_name || opinion.title || 'Untitled Case';
  const court = opinion.court || '';
  const date = opinion.date_filed || opinion.date || '';
  const summary = opinion.text || opinion.summary || '';
  // Highlight keyword if present
  let summaryDisplay = summary;
  if (highlight && summary) {
    const regex = new RegExp(`(${highlight})`, 'gi');
    summaryDisplay = summary.replace(regex, '<mark>$1</mark>');
  }

  return (
    <div className="border rounded p-3 mb-3 bg-gray-50 shadow-sm">
      <div className="font-bold text-lg mb-1">{title}</div>
      <div className="text-sm text-gray-500 mb-1">{court}{date && `, ${date}`}</div>
      {summary && (
        <div className="mb-2 text-gray-700">
          <span className="font-semibold">Excerpt:</span>{' '}
          <span dangerouslySetInnerHTML={{ __html: summaryDisplay.length > 400 ? summaryDisplay.slice(0, 400) + '...' : summaryDisplay }} />
        </div>
      )}
      {/* Actions: Save/Bookmark, etc. */}
    </div>
  );
}
