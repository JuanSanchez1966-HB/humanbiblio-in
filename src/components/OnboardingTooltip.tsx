import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

interface TooltipStep {
  id: string;
  target: string;
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface OnboardingTooltipProps {
  steps: TooltipStep[];
  onComplete: () => void;
  onSkip: () => void;
  startDelay?: number;
}

export default function OnboardingTooltip({
  steps,
  onComplete,
  onSkip,
  startDelay = 1000
}: OnboardingTooltipProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, startDelay);

    return () => clearTimeout(timer);
  }, [startDelay]);

  useEffect(() => {
    if (!isVisible || !step) return;

    const updatePosition = () => {
      const target = document.querySelector(step.target);
      if (!target) return;

      const rect = target.getBoundingClientRect();
      const tooltipWidth = 320;
      const tooltipHeight = 200;
      const margin = 16;

      let top = 0;
      let left = 0;

      switch (step.position) {
        case 'top':
          top = rect.top - tooltipHeight - margin;
          left = rect.left + rect.width / 2 - tooltipWidth / 2;
          break;
        case 'bottom':
          top = rect.bottom + margin;
          left = rect.left + rect.width / 2 - tooltipWidth / 2;
          break;
        case 'left':
          top = rect.top + rect.height / 2 - tooltipHeight / 2;
          left = rect.left - tooltipWidth - margin;
          break;
        case 'right':
        default:
          top = rect.top + rect.height / 2 - tooltipHeight / 2;
          left = rect.right + margin;
          break;
      }

      // Ajustar si se sale de la pantalla
      if (left < margin) left = margin;
      if (left + tooltipWidth > window.innerWidth - margin) {
        left = window.innerWidth - tooltipWidth - margin;
      }
      if (top < margin) top = margin;
      if (top + tooltipHeight > window.innerHeight - margin) {
        top = window.innerHeight - tooltipHeight - margin;
      }

      setPosition({ top, left });

      // Highlight del elemento
      target.classList.add('onboarding-highlight');
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
      const target = document.querySelector(step.target);
      if (target) {
        target.classList.remove('onboarding-highlight');
      }
    };
  }, [currentStep, isVisible, step]);

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    setIsVisible(false);
    onSkip();
  };

  const handleComplete = () => {
    setIsVisible(false);
    onComplete();
  };

  if (!isVisible || !step) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40 z-[9998] pointer-events-none" />

      {/* Tooltip */}
      <div
        className="fixed z-[9999] bg-white rounded-2xl shadow-2xl border-2 border-blue-500 animate-fade-in"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          width: '320px',
          maxHeight: '400px'
        }}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-sm font-semibold text-gray-700">
              Paso {currentStep + 1} de {steps.length}
            </span>
          </div>
          <button
            onClick={handleSkip}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Saltar tutorial"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            {step.title}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            {step.description}
          </p>

          {step.action && (
            <button
              onClick={step.action.onClick}
              className="w-full py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium mb-4"
            >
              {step.action.label}
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </button>

          <div className="flex gap-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="flex items-center gap-1 px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
          >
            {isLastStep ? 'Finalizar' : 'Siguiente'}
            {!isLastStep && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </>
  );
}
