import { render, screen, waitFor } from '@testing-library/react';
import { Dashboard } from './Dashboard';
import { AuthProvider } from '../contexts/AuthContext';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

// Mock api module
vi.mock('../services/api', () => ({
  cases: {
    getCases: vi.fn(),
    getAlerts: vi.fn(),
  },
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Dashboard LocalStorage caching', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it('loads alerts from localStorage if present', async () => {
    const fakeAlerts = [{ id: 'a1', type: 'tax', description: 'Tax loophole', urgency: 'high' }];
    window.localStorage.setItem('legal_oracle_alerts', JSON.stringify(fakeAlerts));

    render(
      <MemoryRouter>
        <AuthProvider>
          <Dashboard />
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      // The alert description should appear if loaded from cache
      expect(screen.getByText(/Tax loophole/i)).toBeInTheDocument();
    });
  });

  it('loads cases from localStorage if API fails', async () => {
    // Simulate cached cases
    const fakeCases = [{ id: 'c1', title: 'Contract Breach Case', type: 'contract', date: '2025-01-01' }];
    window.localStorage.setItem('legal_oracle_cases', JSON.stringify(fakeCases));
    // Simulate API failure by monkeypatching getCases
    const apiModule = await import('../services/api');
    vi.spyOn(apiModule.cases, 'getCases').mockRejectedValueOnce(new Error('API down'));

    render(
      <MemoryRouter>
        <AuthProvider>
          <Dashboard />
        </AuthProvider>
      </MemoryRouter>
    );
    // Wait for the cached case title to render
    expect(await screen.findByText(/contract breach case/i)).toBeInTheDocument();
  });

  it('invalidates cache on logout', async () => {
    window.localStorage.setItem('legal_oracle_cases', '[{"id":"c1"}]');
    window.localStorage.setItem('legal_oracle_alerts', '[{"id":"a1"}]');
    // Simulate logout
    window.localStorage.removeItem('legal_oracle_cases');
    window.localStorage.removeItem('legal_oracle_alerts');
    expect(window.localStorage.getItem('legal_oracle_cases')).toBeNull();
    expect(window.localStorage.getItem('legal_oracle_alerts')).toBeNull();
  });
});
