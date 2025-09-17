import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import GDPRDataManagementPage from '../src/components/GDPRDataManagementPage';

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  User: () => <div data-testid="user-icon">User</div>,
  Database: () => <div data-testid="database-icon">Database</div>,
  FileText: () => <div data-testid="file-text-icon">FileText</div>,
  Download: () => <div data-testid="download-icon">Download</div>,
  Trash2: () => <div data-testid="trash-icon">Trash2</div>,
  Shield: () => <div data-testid="shield-icon">Shield</div>,
  Eye: () => <div data-testid="eye-icon">Eye</div>,
  Edit: () => <div data-testid="edit-icon">Edit</div>,
  AlertTriangle: () => <div data-testid="alert-icon">AlertTriangle</div>,
  CheckCircle: () => <div data-testid="check-icon">CheckCircle</div>,
  Info: () => <div data-testid="info-icon">Info</div>,
  X: () => <div data-testid="x-icon">X</div>,
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

// Mock URL.createObjectURL and URL.revokeObjectURL
Object.defineProperty(window.URL, 'createObjectURL', {
  writable: true,
  value: vi.fn(() => 'mock-url'),
});

Object.defineProperty(window.URL, 'revokeObjectURL', {
  writable: true,
  value: vi.fn(),
});

// Mock Blob
global.Blob = vi.fn().mockImplementation((content, options) => ({
  content,
  options,
  size: content ? content.length : 0,
  type: options?.type || '',
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('GDPRDataManagementPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the GDPR data management page correctly', () => {
    renderWithRouter(<GDPRDataManagementPage />);

    // Check main heading
    expect(screen.getByText('My Data & Privacy')).toBeInTheDocument();
    expect(screen.getByText('Manage your personal data and privacy settings')).toBeInTheDocument();

    // Check tabs
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('My Data')).toBeInTheDocument();
    expect(screen.getByText('My Issues')).toBeInTheDocument();
    expect(screen.getByText('Export Data')).toBeInTheDocument();
    expect(screen.getByText('Delete Account')).toBeInTheDocument();
  });

  it('renders overview tab by default', () => {
    renderWithRouter(<GDPRDataManagementPage />);

    expect(screen.getByText('Your Privacy Rights')).toBeInTheDocument();
    expect(screen.getByText('Data Processing Summary')).toBeInTheDocument();
    expect(screen.getByText('Zero-PII Architecture')).toBeInTheDocument();
  });

  it('switches tabs correctly', async () => {
    renderWithRouter(<GDPRDataManagementPage />);

    // Click on My Data tab
    const myDataTab = screen.getByText('My Data');
    fireEvent.click(myDataTab);

    await waitFor(() => {
      expect(screen.getByText('Account Information')).toBeInTheDocument();
      expect(screen.getByText('OAuth Provider Links')).toBeInTheDocument();
      expect(screen.getByText('Client-Side Data')).toBeInTheDocument();
    });

    // Click on My Issues tab
    const myIssuesTab = screen.getByText('My Issues');
    fireEvent.click(myIssuesTab);

    await waitFor(() => {
      expect(screen.getByText('Issues You\'ve Reported')).toBeInTheDocument();
      expect(screen.getByText('ISS-2024-001')).toBeInTheDocument();
      expect(screen.getByText('ISS-2024-002')).toBeInTheDocument();
      expect(screen.getByText('ISS-2024-003')).toBeInTheDocument();
    });
  });

  it('renders privacy rights correctly', () => {
    renderWithRouter(<GDPRDataManagementPage />);

    expect(screen.getByText('Access your data')).toBeInTheDocument();
    expect(screen.getByText('Export your data')).toBeInTheDocument();
    expect(screen.getByText('Correct your data')).toBeInTheDocument();
    expect(screen.getByText('Delete your data')).toBeInTheDocument();
  });

  it('renders data processing summary correctly', () => {
    renderWithRouter(<GDPRDataManagementPage />);

    expect(screen.getByText('Account Created')).toBeInTheDocument();
    expect(screen.getByText('Authentication Provider')).toBeInTheDocument();
    expect(screen.getByText('Issues Reported')).toBeInTheDocument();
    expect(screen.getByText('Data Retention')).toBeInTheDocument();
  });

  it('renders account information correctly', async () => {
    renderWithRouter(<GDPRDataManagementPage />);

    const myDataTab = screen.getByText('My Data');
    fireEvent.click(myDataTab);

    await waitFor(() => {
      expect(screen.getByText('User ID')).toBeInTheDocument();
      expect(screen.getByText('usr_3a4b5c6d7e8f9g0h')).toBeInTheDocument();
      expect(screen.getByText('Username')).toBeInTheDocument();
      expect(screen.getByText('google_108234567890123456789')).toBeInTheDocument();
    });
  });

  it('renders OAuth provider links correctly', async () => {
    renderWithRouter(<GDPRDataManagementPage />);

    const myDataTab = screen.getByText('My Data');
    fireEvent.click(myDataTab);

    await waitFor(() => {
      expect(screen.getByText('Provider')).toBeInTheDocument();
      expect(screen.getByText('Google')).toBeInTheDocument();
      expect(screen.getByText('External ID')).toBeInTheDocument();
      expect(screen.getByText('108234567890123456789')).toBeInTheDocument();
    });
  });

  it('renders client-side data correctly', async () => {
    renderWithRouter(<GDPRDataManagementPage />);

    const myDataTab = screen.getByText('My Data');
    fireEvent.click(myDataTab);

    await waitFor(() => {
      expect(screen.getByText('Display Name')).toBeInTheDocument();
      expect(screen.getByText('John Doe (stored locally)')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('john.doe@gmail.com (stored locally)')).toBeInTheDocument();
    });
  });

  it('renders issues table correctly', async () => {
    renderWithRouter(<GDPRDataManagementPage />);

    const myIssuesTab = screen.getByText('My Issues');
    fireEvent.click(myIssuesTab);

    await waitFor(() => {
      expect(screen.getByText('Issue ID')).toBeInTheDocument();
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Reported')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();
    });
  });

  it('renders status badges correctly', async () => {
    renderWithRouter(<GDPRDataManagementPage />);

    const myIssuesTab = screen.getByText('My Issues');
    fireEvent.click(myIssuesTab);

    await waitFor(() => {
      expect(screen.getByText('Municipal Review')).toBeInTheDocument();
      expect(screen.getByText('In Progress')).toBeInTheDocument();
      expect(screen.getByText('Open')).toBeInTheDocument();
    });
  });

  it('renders export functionality correctly', async () => {
    renderWithRouter(<GDPRDataManagementPage />);

    const exportTab = screen.getByText('Export Data');
    fireEvent.click(exportTab);

    await waitFor(() => {
      expect(screen.getByText('Export Format')).toBeInTheDocument();
      expect(screen.getByText('JSON (machine-readable)')).toBeInTheDocument();
      expect(screen.getByText('Download My Data')).toBeInTheDocument();
      expect(screen.getByText('📱 Export Client-Side Data')).toBeInTheDocument();
    });
  });

  it('exports data correctly when download button is clicked', async () => {
    // Mock document.createElement to return a proper anchor element but with mocked click
    const originalCreateElement = document.createElement.bind(document);
    const mockClick = vi.fn();
    
    vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'a') {
        const element = originalCreateElement('a');
        element.click = mockClick;
        return element;
      }
      return originalCreateElement(tagName);
    });

    renderWithRouter(<GDPRDataManagementPage />);

    const exportTab = screen.getByText('Export Data');
    fireEvent.click(exportTab);

    await waitFor(() => {
      const downloadButton = screen.getByText('Download My Data');
      fireEvent.click(downloadButton);
    });

    // Verify Blob was created
    expect(global.Blob).toHaveBeenCalled();
    expect(window.URL.createObjectURL).toHaveBeenCalled();
    expect(mockClick).toHaveBeenCalled();
  });

  it('renders delete account section correctly', async () => {
    renderWithRouter(<GDPRDataManagementPage />);

    const deleteTab = screen.getByText('Delete Account');
    fireEvent.click(deleteTab);

    await waitFor(() => {
      expect(screen.getAllByText('Delete My Account')).toHaveLength(2); // Heading and button
      expect(screen.getByText('What happens when you delete your account:')).toBeInTheDocument();
      expect(screen.getByText('Anonymize My Data Only')).toBeInTheDocument();
    });
  });

  it('opens delete confirmation modal', async () => {
    renderWithRouter(<GDPRDataManagementPage />);

    const deleteTab = screen.getByText('Delete Account');
    fireEvent.click(deleteTab);

    // Wait for tab content to load
    await waitFor(() => {
      expect(screen.getByText(/Permanently remove your account/)).toBeInTheDocument();
    });

    // Find the delete button with danger class (more specific selector)
    const deleteButton = screen.getByRole('button', { name: /Delete My Account/i });
    expect(deleteButton).toHaveClass('btn-danger');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText('Confirm Account Deletion')).toBeInTheDocument();
    });
  });

  it('opens anonymize confirmation modal', async () => {
    renderWithRouter(<GDPRDataManagementPage />);

    const deleteTab = screen.getByText('Delete Account');
    fireEvent.click(deleteTab);

    await waitFor(() => {
      const anonymizeButton = screen.getByText('Anonymize My Data Only');
      fireEvent.click(anonymizeButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Anonymize My Data')).toBeInTheDocument();
      expect(screen.getByText('What happens:')).toBeInTheDocument();
    });
  });

  it('handles delete confirmation correctly', async () => {
    const mockAlert = vi.spyOn(window, 'alert').mockImplementation(() => {});

    renderWithRouter(<GDPRDataManagementPage />);

    // Navigate to delete tab
    const deleteTab = screen.getByText('Delete Account');
    fireEvent.click(deleteTab);

    await waitFor(() => {
      // Find the delete button with danger class (more specific selector)
      const deleteButton = screen.getByRole('button', { name: /Delete My Account/i });
      expect(deleteButton).toHaveClass('btn-danger');
      fireEvent.click(deleteButton);
    });

    // Enter confirmation text
    await waitFor(() => {
      const input = screen.getByPlaceholderText('Type DELETE here');
      fireEvent.change(input, { target: { value: 'DELETE' } });
    });

    // Click confirm
    await waitFor(() => {
      const confirmButton = screen.getByTestId('delete-account-button');
      expect(confirmButton).not.toBeDisabled();
      fireEvent.click(confirmButton);
    });

    expect(mockAlert).toHaveBeenCalledWith('Account deletion request submitted. You will receive a confirmation email.');
    mockAlert.mockRestore();
  });

  it('handles anonymize confirmation correctly', async () => {
    const mockAlert = vi.spyOn(window, 'alert').mockImplementation(() => {});

    renderWithRouter(<GDPRDataManagementPage />);

    // Navigate to delete tab
    const deleteTab = screen.getByText('Delete Account');
    fireEvent.click(deleteTab);

    await waitFor(() => {
      const anonymizeButton = screen.getByText('Anonymize My Data Only');
      fireEvent.click(anonymizeButton);
    });

    // Click confirm
    await waitFor(() => {
      const confirmButton = screen.getByText('Anonymize Data');
      fireEvent.click(confirmButton);
    });

    expect(mockAlert).toHaveBeenCalledWith('Data anonymization request submitted. Your personal connection to issues will be removed.');
    mockAlert.mockRestore();
  });

  it('renders warning messages correctly', async () => {
    renderWithRouter(<GDPRDataManagementPage />);

    const myIssuesTab = screen.getByText('My Issues');
    fireEvent.click(myIssuesTab);

    await waitFor(() => {
      expect(screen.getByText('Data Deletion Policy')).toBeInTheDocument();
    });
  });

  it('renders info boxes correctly', () => {
    renderWithRouter(<GDPRDataManagementPage />);

    expect(screen.getByText('Privacy Protection')).toBeInTheDocument();
    expect(screen.getByText('What\'s Included')).toBeInTheDocument();
    expect(screen.getByText('Legal Exceptions')).toBeInTheDocument();
  });

  it('renders all required icons', () => {
    renderWithRouter(<GDPRDataManagementPage />);

    expect(screen.getByTestId('shield-icon')).toBeInTheDocument();
    expect(screen.getByTestId('database-icon')).toBeInTheDocument();
    expect(screen.getByTestId('file-text-icon')).toBeInTheDocument();
    expect(screen.getAllByTestId('download-icon')).toHaveLength(2); // Tab icon and content icon
    expect(screen.getByTestId('trash-icon')).toBeInTheDocument();
  });

  it('renders logo and navigation correctly', () => {
    renderWithRouter(<GDPRDataManagementPage />);

    expect(screen.getByTestId('logo')).toBeInTheDocument();
    expect(screen.getByText('UrbanAI')).toBeInTheDocument();
    expect(screen.getByText('Anonymous User')).toBeInTheDocument();
  });

  it('closes modals when clicking outside or close button', async () => {
    renderWithRouter(<GDPRDataManagementPage />);

    // Open delete modal
    const deleteTab = screen.getByText('Delete Account');
    fireEvent.click(deleteTab);

    await waitFor(() => {
      const deleteButton = screen.getByRole('button', { name: /Delete My Account/i });
      expect(deleteButton).toHaveClass('btn-danger');
      fireEvent.click(deleteButton);
    });

    // Verify modal is open
    await waitFor(() => {
      expect(screen.getByText('Confirm Account Deletion')).toBeInTheDocument();
    });

    // Click close button
    const closeButton = screen.getByTestId('x-icon');
    fireEvent.click(closeButton);

    // Modal should be closed
    await waitFor(() => {
      expect(screen.queryByText('Confirm Account Deletion')).not.toBeInTheDocument();
    });
  });
});
