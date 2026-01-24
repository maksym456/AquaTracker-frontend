import { render, screen, waitFor } from '@testing-library/react';
import Home from '../../../app/page';
import { useSession, signIn } from 'next-auth/react';
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signIn: jest.fn(),
}));

jest.mock('../../../app/contexts/ThemeContext', () => ({
  useTheme: jest.fn(() => ({
    darkMode: false,
    toggleDarkMode: jest.fn(),
  })),
  ThemeProvider: ({ children }) => children, 
}));

describe('Strona główna (Home / app/page.js) – testy integracyjne', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('przy niezalogowanym użytkowniku wywołuje signIn("cognito") i nic nie renderuje', async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    render(<Home />);

    expect(screen.queryByText('AquaTracker')).not.toBeInTheDocument();

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('cognito');
    }, { timeout: 2000 });
  });

  it('przy statusie loading nie renderuje nic (AuthGate zwraca null)', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'loading',
    });

    render(<Home />);
    expect(screen.queryByText('AquaTracker')).not.toBeInTheDocument();
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(); 
  });

  it('przy zalogowanym użytkowniku renderuje Dashboard', async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { id: 'test-uuid', email: 'test@example.com' } },
      status: 'authenticated',
    });

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('AquaTracker')).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('przy zalogowanym użytkowniku nie wywołuje signIn', async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { id: 'test-uuid' } },
      status: 'authenticated',
    });

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('AquaTracker')).toBeInTheDocument();
    }, { timeout: 5000 });

    expect(signIn).not.toHaveBeenCalled();
  });
});