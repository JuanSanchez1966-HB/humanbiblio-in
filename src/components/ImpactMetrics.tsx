import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function ImpactMetrics() {
  const { t } = useLanguage();
  const [animatedValues, setAnimatedValues] = useState({
    connections: 0,
    messages: 0,
    businesses: 0,
    satisfaction: 0
  });
  const [hasAnimated, setHasAnimated] = useState(false);

  const targetValues = {
    connections: 50,
    messages: 320,
    businesses: 18,
    satisfaction: 96
  };

  useEffect(() => {
    if (hasAnimated) return;
    
    const duration = 2000; // 2 segundos
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setAnimatedValues({
        connections: Math.floor(targetValues.connections * progress),
        messages: Math.floor(targetValues.messages * progress),
        businesses: Math.floor(targetValues.businesses * progress),
        satisfaction: Math.floor(targetValues.satisfaction * progress)
      });

      if (currentStep >= steps) {
        clearInterval(interval);
        setAnimatedValues(targetValues);
        setHasAnimated(true);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [hasAnimated, targetValues]);

  const metrics = [
    {
      icon: '👥',
      value: animatedValues.connections.toLocaleString(),
      label: t('impact.connections.label'),
      description: t('impact.connections.desc'),
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: '💬',
      value: animatedValues.messages.toLocaleString(),
      label: t('impact.messages.label'),
      description: t('impact.messages.desc'),
      color: 'from-purple-500 to-violet-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: '🏢',
      value: animatedValues.businesses.toLocaleString(),
      label: t('impact.businesses.label'),
      description: t('impact.businesses.desc'),
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50'
    },
    {
      icon: '⭐',
      value: `${animatedValues.satisfaction}%`,
      label: t('impact.satisfaction.label'),
      description: t('impact.satisfaction.desc'),
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('impact.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('impact.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className={`${metric.bgColor} rounded-3xl p-8 text-center transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
            >
              <div className="text-6xl mb-4 animate-bounce" style={{ animationDelay: `${index * 0.2}s` }}>
                {metric.icon}
              </div>

              <div className={`text-4xl font-bold bg-gradient-to-r ${metric.color} bg-clip-text text-transparent mb-2`}>
                {metric.value}
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {metric.label}
              </h3>

              <p className="text-sm text-gray-600">
                {metric.description}
              </p>

              <div className={`mt-4 h-1 bg-gradient-to-r ${metric.color} rounded-full`}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}