import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LanguageSwitcher from '../../app/components/LanguageSwitcher'; 
import { useTranslation as useTranslationType } from 'react-i18next';
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(), 
}));

describe('LanguageSwitcher Component', () => {
  let mockChangeLanguage: jest.Mock; 

  beforeEach(() => {
    mockChangeLanguage = jest.fn(); 
    (jest.requireMock('react-i18next').useTranslation as jest.Mock).mockReturnValue({
      t: (key: string) => {
        const translations: Record<string, string> = {
          switch_to_english: 'Switch to English',
          switch_to_polish: 'Przełącz na polski',
          english: 'English',
          polski: 'Polski',
        };
        return translations[key] || key; 
      },
      i18n: {
        changeLanguage: mockChangeLanguage, 
        language: 'en', 
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks(); 
  });

  it('renders the language options correctly', () => {
    render(<LanguageSwitcher />); 
    expect(screen.getByRole('button', { name: 'Switch to English' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Przełącz na polski' })).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Polski')).toBeInTheDocument();
  
    const englishButton = screen.getByRole('button', { name: 'Switch to English' });
    expect(englishButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('changes language when a different option is clicked', async () => {
    render(<LanguageSwitcher />);

    const polishButton = screen.getByRole('button', { name: 'Przełącz na polski' });
    await userEvent.click(polishButton);

    expect(mockChangeLanguage).toHaveBeenCalledWith('pl');
    expect(mockChangeLanguage).toHaveBeenCalledTimes(1); 
  });

  it('calls changeLanguage with current language when already selected is clicked', async () => {
    render(<LanguageSwitcher />);

    const englishButton = screen.getByRole('button', { name: 'Switch to English' });
    await userEvent.click(englishButton);
    expect(mockChangeLanguage).toHaveBeenCalledWith('en');
    expect(mockChangeLanguage).toHaveBeenCalledTimes(1);
  });

  it('changes to English when current is Polish and English is clicked', async () => {
    (jest.requireMock('react-i18next').useTranslation as jest.Mock).mockReturnValue({
      t: (key: string) => {
        const translations: Record<string, string> = {
          switch_to_english: 'Switch to English', 
          switch_to_polish: 'Przełącz na polski',
          english: 'English',
          polski: 'Polski',
        };
        return translations[key] || key;
      },
      i18n: {
        changeLanguage: mockChangeLanguage,
        language: 'pl', 
      },
    });

    render(<LanguageSwitcher />);
    const englishButton = screen.getByRole('button', { name: 'Switch to English' }); 
    await userEvent.click(englishButton);
    expect(mockChangeLanguage).toHaveBeenCalledWith('en');
  });
});