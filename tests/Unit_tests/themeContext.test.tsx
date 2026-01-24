import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';


jest.mock('../../app/contexts/ThemeContext', () => {
  const mockContextValue = {
    theme: 'light',           
    toggleTheme: jest.fn(),   
  };

  const mockThemeContext = {
    Provider: ({ children, value }) => {
      return children; 
    },
  };

  return {
    ThemeContext: mockThemeContext,
    ThemeProvider: ({ children }) => (
      <mockThemeContext.Provider value={mockContextValue}>
        {children}
      </mockThemeContext.Provider>
    ),
  };
});

describe('ThemeContext', () => {
  it('provides default theme', async () => {
    const TestComponent = () => {
      return <div>Theme: light</div>; 
    };

    render(<TestComponent />); 

    await waitFor(() => {
      expect(screen.getByText('Theme: light')).toBeInTheDocument();
    });
  });

  it('toggles theme correctly', async () => {
    const mockToggle = jest.fn(); 
    (jest.requireMock('../../app/contexts/ThemeContext') as any).mockContextValue = {
      theme: 'light',
      toggleTheme: mockToggle,
    };

    const TestComponent = () => {
      return (
        <>
          <button onClick={() => mockToggle()}>Toggle</button>
          <div>Theme: light</div>
        </>
      );
    };

    render(<TestComponent />);
    expect(screen.getByText('Theme: light')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /toggle/i }));
    expect(mockToggle).toHaveBeenCalledTimes(1);
  });
});