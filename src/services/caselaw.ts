// Simple API client for CourtListener search
export async function searchCourtListenerOpinions(query: string, court?: string, date_filed?: string) {
  let url = `http://localhost:8000/api/v1/courtlistener/opinions?query=${encodeURIComponent(query)}`;
  if (court) url += `&court=${encodeURIComponent(court)}`;
  if (date_filed) url += `&date_filed=${encodeURIComponent(date_filed)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch CourtListener opinions');
  return await res.json();
}
