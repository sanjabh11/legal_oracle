// Central configuration for frontend
// Change VITE_API_BASE_URL in your env (e.g. .env.local) to point to a different backend
// Default falls back to localhost FastAPI dev port

export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
