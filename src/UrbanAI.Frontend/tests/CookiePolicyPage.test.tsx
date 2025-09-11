import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import CookiePolicyPage from '../src/components/CookiePolicyPage';

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Cookie: () => <div data-testid="cookie-icon">Cookie</div>,
  Shield: () => <div data-testid="shield-icon">Shield</div>,
  Settings: () => <div data-testid="settings-icon">Settings</div>,
  AlertTriangle: () => <div data-testid="alert-icon">Alert</div>,
  CheckCircle: () => <div data-testid="check-icon">Check</div>,
}));

// Mock UrbanAILogoPlaceholder
vi.mock('../src/components/UrbanAILogo', () => ({
  UrbanAILogoPlaceholder: ({ variant, size }: { variant: string; size: number }) =>
    <div data-testid="logo" data-variant={variant} data-size={size}>UrbanAI Logo</div>
}));

// Mock Card and Typography components
vi.mock('../src/components/atoms', () => ({
  Card: ({ children, className, variant, padding }: any) =>
    <div data-testid="card" className={className} data-variant={variant} data-padding={padding}>{children}</div>,
  Typography: ({ children, variant, color }: any) =>
    <div data-testid="typography" data-variant={variant} data-color={color}>{children}</div>
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('CookiePolicyPage', () => {
  it('renders the cookie policy page correctly', () => {
    renderWithRouter(<CookiePolicyPage />);

    // Check main heading
    expect(screen.getByText('Cookie Policy')).toBeInTheDocument();

    // Check last updated date
    expect(screen.getByText(/Last updated:/)).toBeInTheDocument();

    // Check summary section
    expect(screen.getByText('Cookie Usage at a Glance')).toBeInTheDocument();
    expect(screen.getByText('Essential Cookies Only:')).toBeInTheDocument();
    expect(screen.getByText('Your Control:')).toBeInTheDocument();
    expect(screen.getByText('Privacy-First:')).toBeInTheDocument();

    // Check table of contents
    expect(screen.getByText('Contents')).toBeInTheDocument();
    expect(screen.getByText('1. What Are Cookies')).toBeInTheDocument();
    expect(screen.getByText('2. Cookies We Use')).toBeInTheDocument();
    expect(screen.getByText('3. Third-Party Cookies')).toBeInTheDocument();
    expect(screen.getByText('4. Managing Your Cookie Preferences')).toBeInTheDocument();
    expect(screen.getByText('5. Legal Basis for Cookie Usage')).toBeInTheDocument();
    expect(screen.getByText('6. Cookie Data Retention')).toBeInTheDocument();
    expect(screen.getByText('7. International Data Transfers')).toBeInTheDocument();
    expect(screen.getByText('8. Updates to This Policy')).toBeInTheDocument();
    expect(screen.getByText('9. Contact Us')).toBeInTheDocument();
  });

  it('renders cookie categories correctly', () => {
    renderWithRouter(<CookiePolicyPage />);

    // Check essential cookies section
    expect(screen.getByText('Essential Cookies (Always Active)')).toBeInTheDocument();
    expect(screen.getByText('urbanai_session')).toBeInTheDocument();
    expect(screen.getByText('urbanai_csrf')).toBeInTheDocument();

    // Check functional cookies section
    expect(screen.getByText('Functional Cookies (Optional)')).toBeInTheDocument();
    expect(screen.getByText('urbanai_theme')).toBeInTheDocument();
    expect(screen.getByText('urbanai_lang')).toBeInTheDocument();

    // Check cookies we don't use section
    expect(screen.getByText('Cookies We DON\'T Use')).toBeInTheDocument();
  });

  it('renders third-party services correctly', () => {
    renderWithRouter(<CookiePolicyPage />);

    expect(screen.getByText('OAuth Providers')).toBeInTheDocument();
    expect(screen.getByText('Microsoft, Google, Facebook')).toBeInTheDocument();
    expect(screen.getByText('Azure Cloud Services')).toBeInTheDocument();
  });

  it('renders management options correctly', () => {
    renderWithRouter(<CookiePolicyPage />);

    expect(screen.getByText('Cookie Settings Banner')).toBeInTheDocument();
    expect(screen.getByText('Browser Settings')).toBeInTheDocument();
    expect(screen.getByText('Opt-Out Links')).toBeInTheDocument();
  });

  it('renders legal basis grid correctly', () => {
    renderWithRouter(<CookiePolicyPage />);

    expect(screen.getByText('Contract Performance')).toBeInTheDocument();
    expect(screen.getByText('Legitimate Interest')).toBeInTheDocument();
    expect(screen.getByText('Consent')).toBeInTheDocument();
  });

  it('renders retention information correctly', () => {
    renderWithRouter(<CookiePolicyPage />);

    expect(screen.getByText('Session Cookies:')).toBeInTheDocument();
    expect(screen.getByText('Authentication Cookies:')).toBeInTheDocument();
    expect(screen.getByText('Preference Cookies:')).toBeInTheDocument();
  });

  it('renders contact information correctly', () => {
    renderWithRouter(<CookiePolicyPage />);

    expect(screen.getByText('privacy@urbanai.site')).toBeInTheDocument();
    expect(screen.getByText('cookies@urbanai.site')).toBeInTheDocument();
    expect(screen.getByText('dpo@urbanai.site')).toBeInTheDocument();
  });

  it('renders cookie settings button', () => {
    renderWithRouter(<CookiePolicyPage />);

    const settingsButton = screen.getByText('Cookie Settings');
    expect(settingsButton).toBeInTheDocument();
    expect(settingsButton).toHaveAttribute('type', 'button');
  });

  it('renders navigation links correctly', () => {
    renderWithRouter(<CookiePolicyPage />);

    expect(screen.getByText('← Back to Home')).toBeInTheDocument();
    expect(screen.getByText('Privacy Policy →')).toBeInTheDocument();
  });

  it('renders all required icons', () => {
    renderWithRouter(<CookiePolicyPage />);

    expect(screen.getByTestId('cookie-icon')).toBeInTheDocument();
    expect(screen.getAllByTestId('check-icon')).toHaveLength(3); // Three checkmarks in summary
    expect(screen.getByTestId('settings-icon')).toBeInTheDocument();
  });

  it('renders GDPR compliance information', () => {
    renderWithRouter(<CookiePolicyPage />);

    expect(screen.getByText(/GDPR/)).toBeInTheDocument();
    expect(screen.getByText(/CCPA/)).toBeInTheDocument();
    expect(screen.getByText('European Union countries (GDPR compliant)')).toBeInTheDocument();
    expect(screen.getByText('United States (adequacy decision under GDPR)')).toBeInTheDocument();
  });

  it('renders anchor links for table of contents', () => {
    renderWithRouter(<CookiePolicyPage />);

    const links = screen.getAllByRole('link');
    expect(links.some(link => link.getAttribute('href') === '#what-are-cookies')).toBe(true);
    expect(links.some(link => link.getAttribute('href') === '#cookies-we-use')).toBe(true);
    expect(links.some(link => link.getAttribute('href') === '#third-party-cookies')).toBe(true);
    expect(links.some(link => link.getAttribute('href') === '#managing-cookies')).toBe(true);
    expect(links.some(link => link.getAttribute('href') === '#legal-basis')).toBe(true);
    expect(links.some(link => link.getAttribute('href') === '#data-retention')).toBe(true);
    expect(links.some(link => link.getAttribute('href') === '#international')).toBe(true);
    expect(links.some(link => link.getAttribute('href') === '#updates')).toBe(true);
    expect(links.some(link => link.getAttribute('href') === '#contact')).toBe(true);
  });

  it('renders sections with correct IDs for anchor navigation', () => {
    renderWithRouter(<CookiePolicyPage />);

    expect(document.getElementById('what-are-cookies')).toBeInTheDocument();
    expect(document.getElementById('cookies-we-use')).toBeInTheDocument();
    expect(document.getElementById('third-party-cookies')).toBeInTheDocument();
    expect(document.getElementById('managing-cookies')).toBeInTheDocument();
    expect(document.getElementById('legal-basis')).toBeInTheDocument();
    expect(document.getElementById('data-retention')).toBeInTheDocument();
    expect(document.getElementById('international')).toBeInTheDocument();
    expect(document.getElementById('updates')).toBeInTheDocument();
    expect(document.getElementById('contact')).toBeInTheDocument();
  });
});
