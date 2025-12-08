import React, { useEffect, useState, useRef } from 'react';
import { X, Info } from 'lucide-react';
import { useTooltips } from '../hooks/useTooltips';

interface TooltipWrapperProps {
  tooltipId: string;
  userId: string | undefined;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  maxShowCount?: number;
  children: React.ReactNode;
}

const TooltipWrapper: React.FC<TooltipWrapperProps> = ({
  tooltipId,
  userId,
  content,
  position = 'top',
  maxShowCount = 3,
  children
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShownOnMount, setHasShownOnMount] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const { shouldShowTooltip, markTooltipSeen, dismissTooltip } = useTooltips(userId);

  useEffect(() => {
    if (!hasShownOnMount && shouldShowTooltip(tooltipId, maxShowCount)) {
      timeoutRef.current = setTimeout(() => {
        setIsVisible(true);
        markTooltipSeen(tooltipId);
        setHasShownOnMount(true);
      }, 500);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [tooltipId, userId, hasShownOnMount, shouldShowTooltip, markTooltipSeen, maxShowCount]);

  const handleDismiss = () => {
    setIsVisible(false);
    dismissTooltip(tooltipId);
  };

  if (!isVisible) {
    return <>{children}</>;
  }

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-blue-600',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-blue-600',
    left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-blue-600',
    right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-blue-600'
  };

  return (
    <div className="relative inline-block">
      {children}

      <div
        className={`absolute ${positionClasses[position]} z-50 animate-fade-in`}
      >
        <div className="bg-blue-600 text-white rounded-lg shadow-xl p-4 max-w-xs relative">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm leading-relaxed flex-1">{content}</p>
            <button
              onClick={handleDismiss}
              className="text-white hover:text-gray-200 transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div
            className={`absolute w-0 h-0 border-8 ${arrowClasses[position]}`}
          />
        </div>
      </div>
    </div>
  );
};

export default TooltipWrapper;
