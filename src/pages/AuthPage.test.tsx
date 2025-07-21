import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthPage } from './AuthPage';
import { AuthProvider } from '../contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';

describe('AuthPage', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <AuthPage />
        </AuthProvider>
      </BrowserRouter>
    );
  });

  afterEach(() => {
    cleanup();
  });

  it('renders the login form by default', () => {
    expect(screen.getByRole('heading', { name: /sign in to legal oracle/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /sign up for legal oracle/i })).not.toBeInTheDocument();
  });

  it('switches to the signup form when "Sign up" link is clicked', async () => {
    
    // Find and click the "Sign up" button
    const signUpButton = screen.getByRole('button', { name: /Don't have an account\? Sign up/i });
    await userEvent.click(signUpButton);

    // Wait for the signup form to be displayed
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /sign up for legal oracle/i })).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /sign in to legal oracle/i })).not.toBeInTheDocument();
  });

  it('switches back to the login form from the signup form', async () => {

    // Switch to signup form first
    await userEvent.click(screen.getByRole('button', { name: /Don't have an account\? Sign up/i }));

    // Now, find and click the "Sign in" button
    const signInButton = await screen.findByRole('button', { name: /Already have an account\? Sign in/i });
    await userEvent.click(signInButton);

    // Verify the login form is displayed again
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /sign in to legal oracle/i })).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });
});
