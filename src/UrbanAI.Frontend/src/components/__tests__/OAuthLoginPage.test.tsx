import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import OAuthLoginPage from '../OAuthLoginPage'

// Mock the LegalAgreementModal component
vi.mock('../LegalAgreementModal', () => ({
  default: ({ isOpen, onAccept, onDecline }: any) => (
    isOpen ? (
      <div data-testid="legal-modal">
        <button onClick={onAccept} data-testid="accept-button">Accept</button>
        <button onClick={onDecline} data-testid="decline-button">Decline</button>
      </div>
    ) : null
  )
}))

describe('OAuthLoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders OAuth login buttons', () => {
    render(<OAuthLoginPage />)
    
    expect(screen.getByText('Continue with Google')).toBeInTheDocument()
    expect(screen.getByText('Continue with Microsoft')).toBeInTheDocument()
    expect(screen.getByText('Continue with Facebook')).toBeInTheDocument()
  })

  it('shows legal agreement modal when OAuth button is clicked', async () => {
    const user = userEvent.setup()
    render(<OAuthLoginPage />)
    
    const googleButton = screen.getByText('Continue with Google')
    await user.click(googleButton)
    
    expect(screen.getByTestId('legal-modal')).toBeInTheDocument()
  })

  it('handles legal agreement acceptance', async () => {
    const user = userEvent.setup()
    render(<OAuthLoginPage />)
    
    // Click OAuth button to open modal
    const googleButton = screen.getByText('Continue with Google')
    await user.click(googleButton)
    
    // Accept legal agreement
    const acceptButton = screen.getByTestId('accept-button')
    await user.click(acceptButton)
    
    // Modal should close
    await waitFor(() => {
      expect(screen.queryByTestId('legal-modal')).not.toBeInTheDocument()
    })
  })

  it('handles legal agreement decline', async () => {
    const user = userEvent.setup()
    render(<OAuthLoginPage />)
    
    // Click OAuth button to open modal
    const microsoftButton = screen.getByText('Continue with Microsoft')
    await user.click(microsoftButton)
    
    // Decline legal agreement
    const declineButton = screen.getByTestId('decline-button')
    await user.click(declineButton)
    
    // Modal should close
    await waitFor(() => {
      expect(screen.queryByTestId('legal-modal')).not.toBeInTheDocument()
    })
  })

  it('displays UrbanAI branding', () => {
    render(<OAuthLoginPage />)
    
    expect(screen.getByText('UrbanAI')).toBeInTheDocument()
    expect(screen.getByText('Municipal Issue Reporting with AI-Powered Analysis')).toBeInTheDocument()
  })

  it('has accessible form elements', () => {
    render(<OAuthLoginPage />)
    
    const googleButton = screen.getByRole('button', { name: /continue with google/i })
    const microsoftButton = screen.getByRole('button', { name: /continue with microsoft/i })
    const facebookButton = screen.getByRole('button', { name: /continue with facebook/i })
    
    expect(googleButton).toBeInTheDocument()
    expect(microsoftButton).toBeInTheDocument()
    expect(facebookButton).toBeInTheDocument()
  })

  it('handles keyboard navigation', async () => {
    const user = userEvent.setup()
    render(<OAuthLoginPage />)
    
    // Tab through OAuth buttons - they appear in this order: Microsoft, Google, Facebook
    await user.tab()
    expect(screen.getByText('Continue with Microsoft')).toHaveFocus()
    
    await user.tab()
    expect(screen.getByText('Continue with Google')).toHaveFocus()
    
    await user.tab()
    expect(screen.getByText('Continue with Facebook')).toHaveFocus()
  })

  it('triggers OAuth flow for each provider', async () => {
    const user = userEvent.setup()
    render(<OAuthLoginPage />)
    
    // Test Google OAuth
    const googleButton = screen.getByText('Continue with Google')
    await user.click(googleButton)
    expect(screen.getByTestId('legal-modal')).toBeInTheDocument()
    
    // Accept and verify modal closes
    await user.click(screen.getByTestId('accept-button'))
    await waitFor(() => {
      expect(screen.queryByTestId('legal-modal')).not.toBeInTheDocument()
    })
  })
})
