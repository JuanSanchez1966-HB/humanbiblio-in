import React, { useRef, useEffect, useState } from 'react';

interface ScrollableSectionProps {
  children: React.ReactNode;
  className?: string;
  showScrollIndicators?: boolean;
}

export default function ScrollableSection({ 
  children, 
  className = '', 
  showScrollIndicators = true 
}: ScrollableSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  const checkScrollability = React.useCallback(() => {
    if (!scrollRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const newCanScrollUp = scrollTop > 20;
    const newCanScrollDown = scrollTop < scrollHeight - clientHeight - 20;

    setCanScrollUp(prev => prev !== newCanScrollUp ? newCanScrollUp : prev);
    setCanScrollDown(prev => prev !== newCanScrollDown ? newCanScrollDown : prev);
  }, []);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    let ticking = false;
    const throttledCheck = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          checkScrollability();
          ticking = false;
        });
        ticking = true;
      }
    };

    const resizeObserver = new ResizeObserver(throttledCheck);
    resizeObserver.observe(scrollElement);

    setTimeout(checkScrollability, 100);

    scrollElement.addEventListener('scroll', throttledCheck, { passive: true });

    return () => {
      scrollElement.removeEventListener('scroll', throttledCheck);
      resizeObserver.disconnect();
    };
  }, [checkScrollability]);

  const scrollTo = React.useCallback((direction: 'up' | 'down') => {
    if (!scrollRef.current) return;

    const scrollAmount = window.innerHeight * 0.7;
    const currentScroll = scrollRef.current.scrollTop;
    const targetScroll = direction === 'up'
      ? Math.max(0, currentScroll - scrollAmount)
      : currentScroll + scrollAmount;

    scrollRef.current.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });
  }, []);

  return (
    <div className="relative">
      {/* Scroll Up Indicator */}
      {showScrollIndicators && canScrollUp && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10">
          <button
            onClick={() => scrollTo('up')}
            className="bg-white/90 backdrop-blur-sm shadow-lg rounded-full p-3 hover:bg-white transition-colors border border-gray-200/50"
          >
            <div className="flex flex-col items-center">
              <span className="text-blue-600 text-lg">↑</span>
              <span className="text-xs text-gray-600">Subir</span>
            </div>
          </button>
        </div>
      )}

      {/* Scrollable Content */}
<<<<<<< HEAD
      <div
        ref={scrollRef}
        className={`overflow-y-auto custom-scrollbar ${className}`}
        style={{
=======
      <div 
        ref={scrollRef}
        className={`overflow-y-auto ${className}`}
        style={{ 
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
          scrollbarWidth: 'thin',
          scrollbarColor: '#cbd5e1 #f1f5f9'
        }}
      >
        {children}
      </div>

      {/* Scroll Down Indicator */}
      {showScrollIndicators && canScrollDown && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-10">
          <button
            onClick={() => scrollTo('down')}
            className="bg-white/90 backdrop-blur-sm shadow-lg rounded-full p-3 hover:bg-white transition-colors border border-gray-200/50"
          >
            <div className="flex flex-col items-center">
              <span className="text-blue-600 text-lg">↓</span>
              <span className="text-xs text-gray-600">Bajar</span>
            </div>
          </button>
        </div>
      )}
<<<<<<< HEAD
=======

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        div::-webkit-scrollbar {
          width: 8px;
        }
        div::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        div::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
    </div>
  );
}