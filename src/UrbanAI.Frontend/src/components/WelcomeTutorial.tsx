import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, MapPin, FileText, TrendingUp, CheckCircle } from 'lucide-react';

interface TutorialStep {
  id: number;
  title: string;
  content: string;
  icon: React.ReactNode;
  highlight?: string;
}

interface WelcomeTutorialProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const WelcomeTutorial: React.FC<WelcomeTutorialProps> = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps: TutorialStep[] = [
    {
      id: 1,
      title: "Welcome to UrbanAI! 👋",
      content: "We're excited to have you join our community! UrbanAI helps you report municipal issues and track their resolution with AI-powered analysis. Let's take a quick tour of your new dashboard.",
      icon: <CheckCircle size={24} />,
    },
    {
      id: 2,
      title: "Your Dashboard Overview 📊",
      content: "This dashboard shows your issue statistics at a glance. You can see your total reports, issues in progress, resolved issues, and your resolution rate percentage.",
      icon: <TrendingUp size={24} />,
      highlight: "stats-section"
    },
    {
      id: 3,
      title: "Report New Issues 📝",
      content: "Click the 'Report New Issue' button to submit municipal problems you've noticed. You can add photos, descriptions, and precise locations to help authorities understand and resolve issues quickly.",
      icon: <FileText size={24} />,
      highlight: "get-started-btn"
    },
    {
      id: 4,
      title: "Track Recent Activity 📋",
      content: "The recent issues section shows your latest reports and their current status. Each issue displays its location, date, and resolution progress.",
      icon: <MapPin size={24} />,
      highlight: "recent-issues-section"
    },
    {
      id: 5,
      title: "You're All Set! 🎉",
      content: "We've created a sample issue for you to explore the interface. Feel free to delete it once you're comfortable. Start by reporting your first real issue to help improve your community!",
      icon: <CheckCircle size={24} />,
    }
  ];

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    onComplete();
    onClose();
  };

  const skipTutorial = () => {
    onClose();
  };

  if (!isOpen) return null;

  const currentStepData = tutorialSteps[currentStep];

  return (
    <>
      <div className="tutorial-overlay" onClick={skipTutorial} />
      <div className="tutorial-modal">
        <div className="tutorial-header">
          <div className="tutorial-progress">
            <span>Step {currentStep + 1} of {tutorialSteps.length}</span>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
              />
            </div>
          </div>
          <button className="tutorial-close" onClick={skipTutorial}>
            <X size={20} />
          </button>
        </div>

        <div className="tutorial-content">
          <div className="tutorial-icon">
            {currentStepData.icon}
          </div>
          <h3>{currentStepData.title}</h3>
          <p>{currentStepData.content}</p>
        </div>

        <div className="tutorial-footer">
          <button 
            className="tutorial-btn secondary" 
            onClick={skipTutorial}
          >
            Skip Tour
          </button>
          <div className="tutorial-navigation">
            {currentStep > 0 && (
              <button 
                className="tutorial-btn secondary" 
                onClick={prevStep}
              >
                <ChevronLeft size={16} />
                Back
              </button>
            )}
            <button 
              className="tutorial-btn primary" 
              onClick={nextStep}
            >
              {currentStep === tutorialSteps.length - 1 ? "Get Started!" : "Next"}
              {currentStep < tutorialSteps.length - 1 && <ChevronRight size={16} />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default WelcomeTutorial;