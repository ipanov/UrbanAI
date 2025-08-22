import React from 'react';

interface LegalAgreementModalProps {
  open?: boolean;
  isOpen?: boolean;
  provider: 'microsoft' | 'google' | 'facebook' | null;
  displayName?: string | null;
  onAccept: () => void;
  onDecline: () => void;
}

/**
 * LegalAgreementModal
 *
 * Minimal, accessible modal that asks user to accept the legal terms before registration.
 * This modal is intentionally presentation-focused — styling kept inline to avoid needing new css files.
 *
 * Important privacy note (displayed): We DO NOT store PII. Accepting creates an anonymous GUID
 * linked to your provider-sub only and nothing else is persisted.
 */
const backdropStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(2,6,23,0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 2000,
  padding: 20,
};

const panelStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: 720,
  background: '#fff',
  borderRadius: 12,
  boxShadow: '0 10px 40px rgba(2,6,23,0.4)',
  padding: 24,
  color: '#0f172a',
  lineHeight: 1.5,
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  marginBottom: 12,
};

const titleStyle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 700,
  margin: 0,
};

const bodyStyle: React.CSSProperties = {
  marginTop: 12,
  marginBottom: 16,
  fontSize: 14,
  color: '#334155',
};

const footerStyle: React.CSSProperties = {
  display: 'flex',
  gap: 12,
  justifyContent: 'flex-end',
  marginTop: 16,
};

const primaryButtonStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg,#2563EB 0%,#1E40AF 100%)',
  color: '#fff',
  border: 'none',
  padding: '10px 16px',
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: 600,
};

const secondaryButtonStyle: React.CSSProperties = {
  background: '#fff',
  color: '#0f172a',
  border: '1px solid rgba(226,232,240,1)',
  padding: '10px 14px',
  borderRadius: 8,
  cursor: 'pointer',
};

export default function LegalAgreementModal(props: LegalAgreementModalProps) {
  const { open, isOpen, provider, displayName, onAccept, onDecline } = props;

  // Accept either prop for compatibility with tests and callers.
  const visible = typeof open === 'boolean' ? open : !!isOpen;

  if (!visible) return null;

  const providerLabel = provider ? provider.charAt(0).toUpperCase() + provider.slice(1) : 'OAuth Provider';

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="legal-modal-title" style={backdropStyle} data-testid="legal-modal">
      <div style={panelStyle}>
        <div style={headerStyle}>
          <div style={{ width: 44, height: 44, borderRadius: 8, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#2563EB' }}>
            {providerLabel.charAt(0)}
          </div>
          <div>
            <h2 id="legal-modal-title" style={titleStyle}>Before creating your account</h2>
            <div style={{ fontSize: 13, color: '#64748b' }}>
              Please review and accept the legal terms to create an anonymous UrbanAI account
            </div>
          </div>
        </div>

        <div style={bodyStyle}>
          <p>{`You are signing in with ${providerLabel}. If you proceed with registration we will:`}</p>
          <ul>
            <li>Generate an internal anonymous identifier (GUID) linked only to your <em>provider identifier</em> (no name, email or PII is stored).</li>
            <li>Use that identifier to associate reports created by you with your account so you can manage them.</li>
            <li>Never store or send your name, email, or other personal information to our servers — those values remain with your OAuth provider.</li>
          </ul>

          <p style={{ marginTop: 8 }}>
            Display name shown in the UI ({displayName ?? 'from your provider'}) is read from your provider token locally by the browser and is <strong>not</strong> stored by UrbanAI.
          </p>

          <div style={{ marginTop: 12, background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid rgba(226,232,240,1)' }}>
            <strong>GDPR & Deletion</strong> — You can view and request deletion of all data linked to your anonymous identifier at any time. Deletion removes all data stored by UrbanAI related to your account.
          </div>
        </div>

        <div style={footerStyle}>
          <button
            style={secondaryButtonStyle}
            onClick={onDecline}
            aria-label="Decline and return"
            data-testid="decline-button"
          >
            Cancel
          </button>
          <button
            style={primaryButtonStyle}
            onClick={onAccept}
            aria-label="Accept terms and create account"
            data-testid="accept-button"
          >
            I accept — Create my anonymous account
          </button>
        </div>
      </div>
    </div>
  );
}
