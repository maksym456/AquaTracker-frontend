import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Dashboard from '../../../app/components/Dashboard';

process.env.NEXT_PUBLIC_COGNITO_DOMAIN = 'test-domain';
process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID = 'test-client';
process.env.NEXT_PUBLIC_COGNITO_LOGOUT_REDIRECT = 'test-redirect';

jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: { user: { id: 'test-sub', email: 'test@example.com', name: 'Test' } },
    status: 'authenticated'
  }),
  signOut: jest.fn().mockResolvedValue({})
}));

jest.mock('../../../app/lib/api', () => ({
  syncUser: jest.fn().mockResolvedValue({
    id: 'test-id',
    username: 'TestUser',
    settingsLanguage: 'en',
    settingsTheme: 'light'
  })
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { changeLanguage: jest.fn(), language: 'en' }
  })
}));

jest.mock('../../../app/contexts/ThemeContext', () => ({
  useTheme: () => ({ darkMode: false, toggleDarkMode: jest.fn() })
}));

describe('Dashboard Integration Tests', () => {
  it('opens settings panel when clicking the Settings button', async () => {
    render(<Dashboard />);

    const settingsTrigger = screen.getByText('⚙️');
    fireEvent.click(settingsTrigger);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'settings' })).toBeInTheDocument();
      expect(screen.getByText(/darkMode/i)).toBeInTheDocument();
      expect(screen.getByText(/sessionDuration/i)).toBeInTheDocument();
      expect(screen.getByText(/dataSource/i)).toBeInTheDocument();
      expect(screen.getByText(/version/i)).toBeInTheDocument();
      expect(screen.getByText('0.19.0')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /auth.logout/i })
      ).toBeInTheDocument();
    });
  });

  it('calls signOut when clicking Logout button in settings panel', async () => {
    const { signOut } = require('next-auth/react');

    render(<Dashboard />);

    const settingsTrigger = screen.getByText('⚙️');
    fireEvent.click(settingsTrigger);

    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: /auth.logout/i })
        ).toBeInTheDocument()
    );

    fireEvent.click(
      screen.getByRole('button', { name: /auth.logout/i })
    );

    await waitFor(() => {
      expect(signOut).toHaveBeenCalled();
    });
  });
});
