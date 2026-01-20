import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

import Home from '../../app/page';

import Link from 'next/link';
const MockLink = Link; // Dla mock factory scope

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signOut: jest.fn(),
  signIn: jest.fn()
}));

jest.mock('../../app/components/Dashboard', () => {
  const MockDashboard = () => (
    <div>
      <h1>AquaTracker</h1> {/* Real title z Dashboard */}
      <button>⚙️</button> {/* Settings button */}
      <button>auth.logout</button> {/* Logout */}
      <MockLink href="/my-aquariums">myAquariums</MockLink> {/* Link */}
    </div>
  );
  MockDashboard.displayName = 'MockDashboard';
  return MockDashboard;
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: jest.fn((key) => key), i18n: { changeLanguage: jest.fn(), language: 'en' } })
}));

jest.mock('../../app/lib/api', () => ({
  syncUser: jest.fn().mockResolvedValue({ /* fake */ })
}));

jest.mock('../../app/contexts/ThemeContext', () => ({
  useTheme: () => ({ darkMode: false, toggleDarkMode: jest.fn() })
}));

describe('Home Page Component', () => {
  it('returns null (no visible content) and calls signIn when unauthenticated', async () => {
    const { useSession, signIn } = require('next-auth/react');
    useSession.mockReturnValue({ data: null, status: 'unauthenticated' });

    render(<Home />);

    // Check no visible content (no Dashboard title/elements) – pasuje do real return null
    expect(screen.queryByText(/AquaTracker/i)).toBeNull();
    expect(screen.queryByRole('button', { name: /⚙️/ })).toBeNull();

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('cognito');
    });
  });

  it('renders Dashboard when authenticated', async () => {
    const { useSession } = require('next-auth/react');
    useSession.mockReturnValue({
      data: { user: { id: 'test-sub', email: 'test@example.com', name: 'Test' } },
      status: 'authenticated'
    });

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText(/AquaTracker/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /⚙️/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /myAquariums/i })).toBeInTheDocument();
    });
  });
});