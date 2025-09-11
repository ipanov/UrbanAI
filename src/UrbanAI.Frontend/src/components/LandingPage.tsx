import React from 'react';
import { Link } from 'react-router-dom';
import { UrbanAILogoPlaceholder } from './UrbanAILogo';
import { Card, Typography } from './atoms';
import { Users, TrendingUp, Building, ArrowRight, Shield, Zap, Globe, CheckCircle } from 'lucide-react';
import './LandingPage.css';

/**
 * Landing Page Component
 * 
 * Main public landing page showcasing UrbanAI's value proposition
 * and directing users to appropriate experiences based on their role
 */
const LandingPage: React.FC = () => {
  const userTypes = [
    {
      id: 'citizen',
      title: 'Citizen',
      description: 'Report issues in your community and track their resolution',
      icon: Users,
      color: '#667eea',
      features: [
        'Quick issue reporting with photos',
        'Real-time status updates',
        'Community engagement tools',
        'Anonymous reporting options'
      ],
      cta: 'Start Reporting Issues'
    },
    {
      id: 'investor',
      title: 'Investor',
      description: 'Monitor project compliance and urban development progress',
      icon: TrendingUp,
      color: '#10b981',
      features: [
        'Project compliance monitoring',
        'Investment risk assessment',
        'Progress tracking dashboards',
        'Regulatory compliance reports'
      ],
      cta: 'Monitor Investments'
    },
    {
      id: 'authority',
      title: 'Municipal Authority',
      description: 'Review, prioritize, and resolve urban issues efficiently',
      icon: Building,
      color: '#f59e0b',
      features: [
        'Issue triage and prioritization',
        'AI-powered categorization',
        'Resource allocation tools',
        'Performance analytics'
      ],
      cta: 'Manage Issues'
    }
  ];

  const platformFeatures = [
    {
      icon: Shield,
      title: 'Privacy-First Design',
      description: 'Your personal data stays with trusted OAuth providers. We only store anonymous identifiers.'
    },
    {
      icon: Zap,
      title: 'AI-Powered Intelligence',
      description: 'Smart categorization, priority assessment, and automated routing of urban issues.'
    },
    {
      icon: Globe,
      title: 'Stakeholder Coordination',
      description: 'Seamless communication between citizens, authorities, and investors.'
    }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <header className="hero-header">
            <UrbanAILogoPlaceholder variant="primary" size={48} />
            <div className="hero-content">
              <Typography variant="h1" className="hero-title">
                Welcome to <span className="brand-highlight">UrbanAI</span>
              </Typography>
              <Typography variant="h2" className="hero-subtitle">
                Municipal Issue Reporting with AI-Powered Analysis
              </Typography>
              <Typography variant="body1" className="hero-description">
                Connect citizens, authorities, and investors in a transparent platform 
                for reporting, tracking, and resolving urban infrastructure issues.
              </Typography>
            </div>
          </header>

          <div className="cta-buttons">
            <Link to="/login" className="cta-button primary">
              Get Started
              <ArrowRight size={20} />
            </Link>
            <a href="#learn-more" className="cta-button secondary">
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section id="learn-more" className="features-section">
        <div className="section-container">
          <Typography variant="h2" align="center" className="section-title">
            Why Choose UrbanAI?
          </Typography>
          
          <div className="features-grid">
            {platformFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="feature-card" variant="elevated" padding="lg">
                  <div className="feature-icon">
                    <Icon size={32} />
                  </div>
                  <Typography variant="h3">{feature.title}</Typography>
                  <Typography variant="body1" color="secondary">
                    {feature.description}
                  </Typography>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="user-types-section">
        <div className="section-container">
          <Typography variant="h2" align="center" className="section-title">
            Choose Your Experience
          </Typography>
          
          <div className="user-types-grid">
            {userTypes.map((userType) => {
              const Icon = userType.icon;
              return (
                <Card 
                  key={userType.id} 
                  className="user-type-card" 
                  variant="elevated" 
                  padding="lg"
                >
                  <div className="user-type-header">
                    <div 
                      className="user-type-icon" 
                      style={{ backgroundColor: userType.color }}
                    >
                      <Icon size={32} color="white" />
                    </div>
                    <div>
                      <Typography variant="h3">{userType.title}</Typography>
                      <Typography variant="body1" color="secondary">
                        {userType.description}
                      </Typography>
                    </div>
                  </div>
                  
                  <div className="user-type-features">
                    {userType.features.map((feature, index) => (
                      <div key={index} className="feature-item">
                        <CheckCircle size={16} />
                        <Typography variant="body2">{feature}</Typography>
                      </div>
                    ))}
                  </div>
                  
                  <Link 
                    to={`/${userType.id}`} 
                    className="user-type-cta"
                    style={{ backgroundColor: userType.color }}
                  >
                    {userType.cta}
                    <ArrowRight size={18} />
                  </Link>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works-section">
        <div className="section-container">
          <Typography variant="h2" align="center" className="section-title">
            How It Works
          </Typography>
          
          <div className="steps-grid">
            <div className="step">
              <div className="step-number">1</div>
              <Typography variant="h4">Report or Monitor</Typography>
              <Typography variant="body1" color="secondary">
                Citizens report issues, investors monitor projects, authorities review cases
              </Typography>
            </div>
            
            <div className="step">
              <div className="step-number">2</div>
              <Typography variant="h4">AI Analysis</Typography>
              <Typography variant="body1" color="secondary">
                Our AI categorizes, prioritizes, and routes issues to the right authorities
              </Typography>
            </div>
            
            <div className="step">
              <div className="step-number">3</div>
              <Typography variant="h4">Collaborative Resolution</Typography>
              <Typography variant="body1" color="secondary">
                Stakeholders work together to resolve issues with full transparency
              </Typography>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-main">
            <div className="footer-brand">
              <UrbanAILogoPlaceholder variant="primary" size={32} />
              <Typography variant="h3">UrbanAI</Typography>
              <Typography variant="body2" color="secondary">
                Transforming urban governance through AI-powered collaboration
              </Typography>
            </div>
            
            <div className="footer-links">
              <div className="link-group">
                <Typography variant="h4">Product</Typography>
                <Link to="/citizen">For Citizens</Link>
                <Link to="/investor">For Investors</Link>
                <Link to="/authority">For Authorities</Link>
              </div>
              
              <div className="link-group">
                <Typography variant="h4">Legal</Typography>
                <Link to="/privacy">Privacy Policy</Link>
                <Link to="/terms">Terms of Service</Link>
              </div>
              
              <div className="link-group">
                <Typography variant="h4">Support</Typography>
                <a href="mailto:support@urbanai.site">Contact Support</a>
                <Link to="/login">Sign In</Link>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <Typography variant="body2" color="secondary">
              © 2024 UrbanAI. All rights reserved.
            </Typography>
            <Typography variant="body2" color="secondary">
              Built with privacy and transparency in mind.
            </Typography>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;