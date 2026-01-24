import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

// Poprawione ścieżki względne (sprawdzone – od tests/Integration_tests/dashboard/)
import { useTheme } from '../../../app/contexts/ThemeContext';
import Dashboard from '../../../app/components/Dashboard';

// Mocki
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signOut: jest.fn().mockResolvedValue({}),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

jest.mock('../../../app/contexts/ThemeContext', () => ({
  useTheme: jest.fn(() => ({
    darkMode: false,
    toggleDarkMode: jest.fn(),
  })),
}));

describe('Dashboard Component – testy integracyjne', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });
    jest.clearAllMocks();
  });

  it('renderuje się bez crasha i pokazuje logo AquaTracker', () => {
    render(<Dashboard />);
    expect(screen.getByText('AquaTracker')).toBeInTheDocument();
  });

  it('pokazuje LanguageSwitcher i przycisk Settings (⚙️)', () => {
    render(<Dashboard />);
    const langButtons = screen.getAllByRole('button', { name: /Switch to English|Przełącz na polski/i });
    expect(langButtons).toHaveLength(2);
    expect(screen.getByText('⚙️')).toBeInTheDocument();
  });

  it('pokazuje 4 karty nawigacyjne (tytuły)', () => {
    render(<Dashboard />);
    const titles = screen.getAllByRole('heading', { level: 6 });
    const titleTexts = titles.map(t => t.textContent || '');
    expect(titleTexts).toContain('myAquariums');
    expect(titleTexts).toContain('fishDatabase');
    expect(titleTexts).toContain('contacts');
    expect(titleTexts).toContain('plantsDatabase');
  });

  it('otwiera modal ustawień po kliknięciu ⚙️ i widzi tytuł modalu', async () => {
    render(<Dashboard />);
    const settingsButton = screen.getByText('⚙️');
    await userEvent.click(settingsButton);
    await waitFor(() => {
      const modalTitles = screen.getAllByRole('heading', { level: 5 });
      const settingsTitle = modalTitles.find(h => h.textContent?.toLowerCase().includes('settings'));
      expect(settingsTitle).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('przełącza dark mode po kliknięciu switcha w modalu', async () => {
    const mockToggle = jest.fn();
    (useTheme as jest.Mock).mockReturnValue({
      darkMode: false,
      toggleDarkMode: mockToggle,
    });

    render(<Dashboard />);
    await userEvent.click(screen.getByText('⚙️'));
    await waitFor(() => {
      expect(screen.getByText(/dark mode|tryb ciemny/i)).toBeInTheDocument();
    }, { timeout: 5000 });

    const switches = screen.getAllByRole('switch');
    expect(switches.length).toBeGreaterThanOrEqual(1);
    await userEvent.click(switches[0]);
    expect(mockToggle).toHaveBeenCalledTimes(1);
  });

  it('można otworzyć modal i zobaczyć przycisk wylogowania', async () => {
    render(<Dashboard />);
    await userEvent.click(screen.getByText('⚙️'));
    await waitFor(() => {
      const logoutButton = screen.getByRole('button', { name: /auth.logout|wyloguj|logout/i });
      expect(logoutButton).toBeInTheDocument();
    }, { timeout: 5000 });
  });
});