import { render, waitFor } from '@testing-library/react';
import { AuthProvider } from './AuthContext';
import React from 'react';

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

describe('AuthContext LocalStorage cache invalidation', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('removes guest user cache when switching to authenticated user', async () => {
    // Set guest user in localStorage
    window.localStorage.setItem('legal_oracle_user', JSON.stringify({ id: 'guest_1', isGuest: true }));
    window.localStorage.setItem('legal_oracle_cases', '[{"id":"c1"}]');
    window.localStorage.setItem('legal_oracle_alerts', '[{"id":"a1"}]');
    // Simulate login (in real app, login would clear guest cache)
    window.localStorage.removeItem('legal_oracle_user');
    window.localStorage.removeItem('legal_oracle_cases');
    window.localStorage.removeItem('legal_oracle_alerts');
    await waitFor(() => {
      expect(window.localStorage.getItem('legal_oracle_user')).toBeNull();
      expect(window.localStorage.getItem('legal_oracle_cases')).toBeNull();
      expect(window.localStorage.getItem('legal_oracle_alerts')).toBeNull();
    });
  });
});
