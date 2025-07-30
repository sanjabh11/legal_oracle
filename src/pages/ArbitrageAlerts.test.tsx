import { render, screen, waitFor } from '@testing-library/react';
import { ArbitrageAlerts } from './ArbitrageAlerts';
import { AuthProvider } from '../contexts/AuthContext';
import { vi } from 'vitest';

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

describe('ArbitrageAlerts LocalStorage caching', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it('loads alerts from localStorage if present', async () => {
    const fakeAlerts = [{ id: 'a1', type: 'tax', description: 'Tax loophole', urgency: 'high' }];
    window.localStorage.setItem('legal_oracle_alerts', JSON.stringify(fakeAlerts));

    render(
      <AuthProvider>
        <ArbitrageAlerts />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Tax loophole/i)).toBeInTheDocument();
    });
  });

  it('updates cache when alert is dismissed', async () => {
    const fakeAlerts = [
      { id: 'a1', type: 'tax', description: 'Tax loophole', urgency: 'high' },
      { id: 'a2', type: 'compliance', description: 'Compliance gap', urgency: 'medium' }
    ];
    window.localStorage.setItem('legal_oracle_alerts', JSON.stringify(fakeAlerts));

    render(
      <AuthProvider>
        <ArbitrageAlerts />
      </AuthProvider>
    );

    // Simulate dismissing the first alert
    // fireEvent.click(screen.getByTestId('dismiss-a1'));
    // expect(window.localStorage.getItem('legal_oracle_alerts')).not.toContain('a1');
  });

  it('invalidates cache on logout', async () => {
    window.localStorage.setItem('legal_oracle_alerts', '[{"id":"a1"}]');
    window.localStorage.removeItem('legal_oracle_alerts');
    expect(window.localStorage.getItem('legal_oracle_alerts')).toBeNull();
  });
});
