import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from '../../app/components/Dashboard';


jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: { user: { id: 'test-sub', email: 'test@example.com', name: 'Test' } },
    status: 'authenticated'
  })
}));

jest.mock('../../app/lib/api', () => ({
  syncUser: jest.fn().mockResolvedValue({
    id: 'test-id',
    username: 'TestUser',
    settingsLanguage: 'en',
    settingsTheme: 'light'
  })
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { changeLanguage: jest.fn(), language: 'en' } })
}));

jest.mock('../../app/contexts/ThemeContext', () => ({
  useTheme: () => ({ darkMode: false, toggleDarkMode: jest.fn() })
}));

describe('Dashboard Component', () => {
  it('renders main UI elements and calls syncUser on mount', async () => {
    render(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText('AquaTracker')).toBeInTheDocument(); 
      expect(screen.getByText('⚙️')).toBeInTheDocument();
      expect(screen.getByText('settings')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /myAquariums/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /fishDatabase/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /contacts/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /plantsDatabase/i })).toBeInTheDocument();
      expect(screen.getByText('mainHeader')).toBeInTheDocument();
      expect(screen.getByText('mainSubHeader')).toBeInTheDocument();
    });

    await waitFor(() => {
      const { syncUser } = require('../../app/lib/api');
      expect(syncUser).toHaveBeenCalledWith('test-sub', 'test@example.com', 'Test');
    });
  });
});