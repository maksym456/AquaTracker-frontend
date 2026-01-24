import { render, screen, waitFor } from '@testing-library/react'; 
import userEvent from '@testing-library/user-event'; 
import { AuthProvider, useAuth } from '../../app/contexts/AuthContext'; 
import { loginUser } from '../../app/lib/api'; 
import { renderHook } from '@testing-library/react';  


jest.mock('../../app/lib/api', () => ({
  loginUser: jest.fn(), 
}));

const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};
beforeEach(() => {
  Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });
  mockLocalStorage.getItem.mockReturnValue(null); 
});
afterEach(() => {
  jest.clearAllMocks(); 
});

describe('AuthContext', () => {
  it('provides default auth state to children', async () => { 
    const TestComponent = () => {
      const { user, loading } = useAuth(); 
      if (loading) return <div>Loading...</div>; 
      return <div>{user ? 'Logged In' : 'Logged Out'}</div>; 
    };

    render(<AuthProvider><TestComponent /></AuthProvider>);

    await waitFor(() => {
      expect(screen.getByText('Logged Out')).toBeInTheDocument(); 
    });
  });

  it('updates state on login', async () => {
    (loginUser as jest.Mock).mockResolvedValue({
      user: { id: '123', email: 'test@example.com', name: 'Test User', role: 'user' },
      token: 'fake-token',
    });

    const TestComponent = () => {
      const { login, user, loading } = useAuth();
      if (loading) return <div>Loading...</div>;
      return (
        <>
          <button onClick={() => login('test@example.com', 'password')}>Login</button>
          <div>{user ? 'Logged In' : 'Logged Out'}</div>
        </>
      );
    };

    render(<AuthProvider><TestComponent /></AuthProvider>);

    await waitFor(() => expect(screen.getByText('Logged Out')).toBeInTheDocument());
    await userEvent.click(screen.getByRole('button', { name: /login/i }));
    await waitFor(() => {
      expect(screen.getByText('Logged In')).toBeInTheDocument(); 
    });

    expect(loginUser).toHaveBeenCalledWith('test@example.com', 'password');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('user', expect.any(String));
  });

  it('updates state on logout', async () => {
    mockLocalStorage.getItem.mockReturnValue(
      JSON.stringify({
        id: '123',
        email: 'test@example.com',
        name: 'Test',
        token: 'fake',
        loginTime: new Date().toISOString(),
      })
    );

    const TestComponent = () => {
      const { logout, user, loading } = useAuth();
      if (loading) return <div>Loading...</div>;
      return (
        <>
          <button onClick={logout}>Logout</button>
          <div>{user ? 'Logged In' : 'Logged Out'}</div>
        </>
      );
    };

    render(<AuthProvider><TestComponent /></AuthProvider>);

    await waitFor(() => {
      expect(screen.getByText('Logged In')).toBeInTheDocument(); 
    });

    await userEvent.click(screen.getByRole('button', { name: /logout/i }));
    await waitFor(() => {
      expect(screen.getByText('Logged Out')).toBeInTheDocument(); 
    });
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('user');
  });

  
    it('handles login errors', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        (loginUser as jest.Mock).mockRejectedValue(new Error('Invalid credentials'));
        const { result } = renderHook(() => useAuth(), {
          wrapper: AuthProvider,
        });
    
        expect(result.current.user).toBeNull();
        expect(result.current.loading).toBe(false); 
    
        await expect(
          result.current.login('bad@email.com', 'wrong')
        ).rejects.toThrow('Invalid credentials');
    
        expect(result.current.user).toBeNull();
        expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Login error:',
          expect.objectContaining({ message: 'Invalid credentials' })
        );
    
        consoleErrorSpy.mockRestore();
      });
});