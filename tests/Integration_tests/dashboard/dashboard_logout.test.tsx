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
  syncUser: jest.fn().mockResolvedValue({})
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

describe('Dashboard Logout Test', () => {
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

    const logoutButton = screen.getByRole('button', { name: /auth.logout/i });
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(signOut).toHaveBeenCalled();
    });
  });
});
