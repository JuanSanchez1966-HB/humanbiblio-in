import { useState, useEffect } from 'react';

const ONBOARDING_KEY = 'humanbiblio_onboarding_completed';

interface OnboardingState {
  hasCompletedOnboarding: boolean;
  startOnboarding: () => void;
  completeOnboarding: () => void;
  skipOnboarding: () => void;
  resetOnboarding: () => void;
}

export function useOnboarding(): OnboardingState {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(true);

  useEffect(() => {
    const completed = localStorage.getItem(ONBOARDING_KEY);
    setHasCompletedOnboarding(completed === 'true');
  }, []);

  const startOnboarding = () => {
    setHasCompletedOnboarding(false);
  };

  const completeOnboarding = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setHasCompletedOnboarding(true);
  };

  const skipOnboarding = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setHasCompletedOnboarding(true);
  };

  const resetOnboarding = () => {
    localStorage.removeItem(ONBOARDING_KEY);
    setHasCompletedOnboarding(false);
  };

  return {
    hasCompletedOnboarding,
    startOnboarding,
    completeOnboarding,
    skipOnboarding,
    resetOnboarding
  };
}
