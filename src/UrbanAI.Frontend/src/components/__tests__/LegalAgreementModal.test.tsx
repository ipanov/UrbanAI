import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LegalAgreementModal from '../LegalAgreementModal'

describe('LegalAgreementModal', () => {
  const mockOnAccept = vi.fn()
  const mockOnDecline = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders when open is true', () => {
    render(
      <LegalAgreementModal
        open={true}
        provider="google"
        onAccept={mockOnAccept}
        onDecline={mockOnDecline}
      />
    )
    
    expect(screen.getByText('Before creating your account')).toBeInTheDocument()
    expect(screen.getByText('I accept — Create my anonymous account')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  it('does not render when open is false', () => {
    render(
      <LegalAgreementModal
        open={false}
        provider="google"
        onAccept={mockOnAccept}
        onDecline={mockOnDecline}
      />
    )
    
    expect(screen.queryByText('Before creating your account')).not.toBeInTheDocument()
  })

  it('calls onAccept when Accept button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <LegalAgreementModal
        open={true}
        provider="google"
        onAccept={mockOnAccept}
        onDecline={mockOnDecline}
      />
    )
    
    const acceptButton = screen.getByText('I accept — Create my anonymous account')
    await user.click(acceptButton)
    
    expect(mockOnAccept).toHaveBeenCalledTimes(1)
  })

  it('calls onDecline when Cancel button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <LegalAgreementModal
        open={true}
        provider="microsoft"
        onAccept={mockOnAccept}
        onDecline={mockOnDecline}
      />
    )
    
    const declineButton = screen.getByText('Cancel')
    await user.click(declineButton)
    
    expect(mockOnDecline).toHaveBeenCalledTimes(1)
  })

  it('displays privacy policy content', () => {
    render(
      <LegalAgreementModal
        open={true}
        provider="facebook"
        onAccept={mockOnAccept}
        onDecline={mockOnDecline}
      />
    )
    
    expect(screen.getByText(/Generate an internal anonymous identifier/)).toBeInTheDocument()
    expect(screen.getByText(/Never store or send your name, email/)).toBeInTheDocument()
    expect(screen.getByText(/GDPR & Deletion/)).toBeInTheDocument()
  })

  it('has proper ARIA attributes for accessibility', () => {
    render(
      <LegalAgreementModal
        open={true}
        provider="google"
        onAccept={mockOnAccept}
        onDecline={mockOnDecline}
      />
    )
    
    const modal = screen.getByRole('dialog')
    expect(modal).toHaveAttribute('aria-labelledby', 'legal-modal-title')
    expect(modal).toHaveAttribute('aria-modal', 'true')
  })

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup()
    render(
      <LegalAgreementModal
        open={true}
        provider="google"
        onAccept={mockOnAccept}
        onDecline={mockOnDecline}
      />
    )
    
    // Tab to first button (Cancel)
    await user.tab()
    expect(screen.getByText('Cancel')).toHaveFocus()
    
    // Tab to second button (Accept)
    await user.tab()
    expect(screen.getByText('I accept — Create my anonymous account')).toHaveFocus()
    
    // Enter key should trigger accept
    await user.keyboard('{Enter}')
    expect(mockOnAccept).toHaveBeenCalledTimes(1)
  })

  it('displays provider-specific content', () => {
    render(
      <LegalAgreementModal
        open={true}
        provider="microsoft"
        displayName="John Doe"
        onAccept={mockOnAccept}
        onDecline={mockOnDecline}
      />
    )
    
    expect(screen.getByText(/You are signing in with Microsoft/)).toBeInTheDocument()
    expect(screen.getByText(/John Doe/)).toBeInTheDocument()
  })
})
