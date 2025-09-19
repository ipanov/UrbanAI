import React, { useState } from 'react';
import { Users, TrendingUp, Building, Check, Info } from 'lucide-react';
import { Card, Typography } from './atoms';
import { USER_TYPES, COLORS } from '../constants';


interface UserType {
  id: string;
  title: string;
  description: string;
  detailedDescription: string;
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  color: string;
  features: string[];
  permissions: string[];
}

interface UserTypeSelectorProps {
  selectedUserType: string | null;
  onUserTypeSelect: (_userType: string) => void;
  variant?: 'registration' | 'compact';
  className?: string;
}

const userTypes: UserType[] = [
  {
    id: USER_TYPES.CITIZEN,
    title: 'Citizen',
    description: 'Report and track community issues',
    detailedDescription: 'Citizens can report issues in their community, track progress, and receive updates on resolution status.',
    icon: Users,
    color: COLORS.PRIMARY[500],
    features: [
      'Report community issues',
      'Track issue status',
      'Receive notifications',
      'Access public data'
    ],
    permissions: [
      'Create issue reports',
      'View own submissions',
      'Receive status updates',
      'Access community statistics'
    ]
  },
  {
    id: USER_TYPES.INVESTOR,
    title: 'Investor',
    description: 'Monitor project compliance and ROI',
    detailedDescription: 'Investors can monitor project compliance, access detailed analytics, and track return on investment.',
    icon: TrendingUp,
    color: COLORS.SUCCESS[500],
    features: [
      'Monitor compliance metrics',
      'Access analytics dashboard',
      'Track project ROI',
      'Generate compliance reports'
    ],
    permissions: [
      'View project analytics',
      'Access compliance data',
      'Generate reports',
      'Monitor financial metrics'
    ]
  },
  {
    id: USER_TYPES.AUTHORITY,
    title: 'Municipal Authority',
    description: 'Manage and resolve urban issues',
    detailedDescription: 'Municipal authorities can review, assign, and resolve issues while managing compliance and generating reports.',
    icon: Building,
    color: COLORS.WARNING[500],
    features: [
      'Review and assign issues',
      'Manage resolution workflows',
      'Access administrative tools',
      'Generate compliance reports'
    ],
    permissions: [
      'View all issues',
      'Assign and manage cases',
      'Access admin dashboard',
      'Generate official reports'
    ]
  }
];

/**
 * UserTypeSelector Component
 *
 * Professional user type selection interface for UrbanAI registration flow.
 * Supports both full registration view and compact dashboard display.
 *
 * Features:
 * - Glass morphism design matching UrbanAI aesthetic
 * - Detailed user type descriptions with features and permissions
 * - Responsive design for web and mobile platforms
 * - WCAG 2.1 AA accessibility compliance
 * - Municipal software professional standards
 */
const UserTypeSelector: React.FC<UserTypeSelectorProps> = ({
  selectedUserType,
  onUserTypeSelect,
  variant = 'registration',
  className = ''
}) => {
  const [expandedType, setExpandedType] = useState<string | null>(null);

  const handleCardClick = (userTypeId: string) => {
    if (variant === 'registration') {
      onUserTypeSelect(userTypeId);
      setExpandedType(expandedType === userTypeId ? null : userTypeId);
    }
  };

  const handleSelectClick = (userTypeId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    onUserTypeSelect(userTypeId);
  };

  if (variant === 'compact') {
    const currentUserType = userTypes.find(type => type.id === selectedUserType);
    if (!currentUserType) return null;

    return (
      <div className={`user-type-display ${className}`}>
        <div className="user-type-badge">
          <currentUserType.icon size={16} className="user-type-icon" />
          <span className="user-type-title">{currentUserType.title}</span>
        </div>
        <style>{`
          .user-type-display {
            display: inline-flex;
            align-items: center;
          }

          .user-type-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 6px 12px;
            background: rgba(37, 99, 235, 0.1);
            border: 1px solid rgba(37, 99, 235, 0.2);
            border-radius: 8px;
            color: ${COLORS.PRIMARY[700]};
            font-size: 14px;
            font-weight: 500;
            font-family: 'Inter', sans-serif;
          }

          .user-type-icon {
            color: ${COLORS.PRIMARY[600]};
          }

          .user-type-title {
            white-space: nowrap;
          }

          @media (max-width: 768px) {
            .user-type-badge {
              padding: 4px 8px;
              font-size: 12px;
              gap: 6px;
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className={`user-type-selector ${className}`}>
      <div className="selector-header">
        <Typography variant="h2" className="selector-title">
          Choose Your Account Type
        </Typography>
        <Typography variant="body1" className="selector-description">
          Select the account type that best describes your role in the community.
        </Typography>
      </div>

      <div className="user-type-grid">
        {userTypes.map((type) => {
          const isSelected = selectedUserType === type.id;
          const isExpanded = expandedType === type.id;
          const IconComponent = type.icon;

          return (
            <Card
              key={type.id}
              className={`user-type-card ${isSelected ? 'selected' : ''} ${isExpanded ? 'expanded' : ''}`}
              onClick={() => handleCardClick(type.id)}
            >
              <div className="card-header">
                <div className="icon-container">
                  <IconComponent size={32} className="user-type-icon" />
                </div>
                <div className="card-content">
                  <Typography variant="h3" className="card-title">
                    {type.title}
                  </Typography>
                  <Typography variant="body1" className="card-description">
                    {type.description}
                  </Typography>
                </div>
                <div className="selection-indicator">
                  {isSelected && <Check size={20} className="check-icon" />}
                </div>
              </div>

              {isExpanded && (
                <div className="expanded-content">
                  <Typography variant="body1" className="detailed-description">
                    {type.detailedDescription}
                  </Typography>

                  <div className="features-section">
                    <Typography variant="h4" className="section-title">
                      Key Features
                    </Typography>
                    <ul className="features-list">
                      {type.features.map((feature, index) => (
                        <li key={index} className="feature-item">
                          <Check size={16} className="feature-check" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="permissions-section">
                    <Typography variant="h4" className="section-title">
                      Permissions
                    </Typography>
                    <ul className="permissions-list">
                      {type.permissions.map((permission, index) => (
                        <li key={index} className="permission-item">
                          <Info size={16} className="permission-icon" />
                          <span>{permission}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    className="select-button"
                    onClick={(e) => handleSelectClick(type.id, e)}
                    aria-label={`Confirm selection of ${type.title} account type`}
                  >
                    Select {type.title}
                  </button>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <style>{`
        .user-type-selector {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }

        .selector-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .selector-title {
          color: ${COLORS.NEUTRAL[900]};
          margin-bottom: 12px;
          font-size: 28px;
          font-weight: 600;
          line-height: 1.2;
        }

        .selector-description {
          color: ${COLORS.NEUTRAL[600]};
          font-size: 16px;
          line-height: 1.5;
        }

        .user-type-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .user-type-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(226, 232, 240, 0.5);
          border-radius: 16px;
          padding: 24px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .user-type-card:hover {
          border-color: rgba(37, 99, 235, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .user-type-card:focus {
          outline: none;
          border-color: ${COLORS.PRIMARY[500]};
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .user-type-card.selected {
          border-color: ${COLORS.PRIMARY[500]};
          background: rgba(37, 99, 235, 0.02);
        }

        .user-type-card.expanded {
          border-color: ${COLORS.PRIMARY[500]};
        }

        .card-header {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }

        .icon-container {
          flex-shrink: 0;
          width: 56px;
          height: 56px;
          border-radius: 12px;
          background: rgba(37, 99, 235, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-type-icon {
          color: ${COLORS.PRIMARY[600]};
        }

        .card-content {
          flex: 1;
        }

        .card-title {
          color: ${COLORS.NEUTRAL[900]};
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .card-description {
          color: ${COLORS.NEUTRAL[600]};
          font-size: 14px;
          line-height: 1.5;
        }

        .selection-indicator {
          flex-shrink: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .check-icon {
          color: ${COLORS.SUCCESS[600]};
        }

        .expanded-content {
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid rgba(226, 232, 240, 0.8);
        }

        .detailed-description {
          color: ${COLORS.NEUTRAL[700]};
          margin-bottom: 24px;
          line-height: 1.6;
        }

        .features-section,
        .permissions-section {
          margin-bottom: 24px;
        }

        .section-title {
          color: ${COLORS.NEUTRAL[900]};
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .features-list,
        .permissions-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .feature-item,
        .permission-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 0;
          color: ${COLORS.NEUTRAL[700]};
          font-size: 14px;
        }

        .feature-check {
          color: ${COLORS.SUCCESS[600]};
          flex-shrink: 0;
        }

        .permission-icon {
          color: ${COLORS.PRIMARY[600]};
          flex-shrink: 0;
        }

        .select-button {
          background: ${COLORS.PRIMARY[500]};
          color: white;
          border: none;
          border-radius: 8px;
          padding: 12px 24px;
          font-size: 14px;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 100%;
        }

        .select-button:hover {
          background: ${COLORS.PRIMARY[600]};
          transform: translateY(-1px);
        }

        .select-button:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .select-button:active {
          transform: translateY(0);
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .user-type-selector {
            padding: 16px;
          }

          .selector-title {
            font-size: 24px;
          }

          .selector-description {
            font-size: 14px;
          }

          .user-type-card {
            padding: 20px;
          }

          .card-header {
            gap: 12px;
          }

          .icon-container {
            width: 48px;
            height: 48px;
          }

          .user-type-icon {
            width: 24px;
            height: 24px;
          }

          .card-title {
            font-size: 18px;
          }

          .card-description {
            font-size: 13px;
          }

          .expanded-content {
            margin-top: 20px;
            padding-top: 20px;
          }
        }

        /* Tablet responsiveness */
        @media (min-width: 769px) and (max-width: 1024px) {
          .user-type-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }

        /* Desktop enhanced layout */
        @media (min-width: 1025px) {
          .user-type-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 24px;
          }

          .user-type-card.expanded {
            grid-column: 1 / -1;
          }
        }
      `}</style>
    </div>
  );
};

export default UserTypeSelector;