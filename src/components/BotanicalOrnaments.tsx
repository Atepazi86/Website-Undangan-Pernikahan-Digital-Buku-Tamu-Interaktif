import React from 'react';

interface CornerOrnamentProps {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}

export const CornerOrnament: React.FC<CornerOrnamentProps> = ({
  position,
  className = 'w-14 h-14 text-[#C5A059]/75',
}) => {
  const rotationMap: Record<CornerOrnamentProps['position'], string> = {
    'top-left': 'rotate-0',
    'top-right': 'scale-x-[-1]',
    'bottom-left': 'scale-y-[-1]',
    'bottom-right': 'scale-[-1]',
  };

  const posClassMap: Record<CornerOrnamentProps['position'], string> = {
    'top-left': 'top-3 left-3',
    'top-right': 'top-3 right-3',
    'bottom-left': 'bottom-3 left-3',
    'bottom-right': 'bottom-3 right-3',
  };

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 80 80"
      fill="none"
      className={`pointer-events-none absolute ${posClassMap[position]} ${rotationMap[position]} ${className}`}
    >
      {/* Fine hairline frame corner */}
      <path d="M4 68V12C4 7.58172 7.58172 4 12 4H68" stroke="currentColor" strokeWidth="1" />
      <path d="M12 52V16C12 13.7909 13.7909 12 16 12H52" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.55" />
      {/* Botanical leaf flourish */}
      <path
        d="M12 12C20 12 27 16 31 23C24 23 17 20 12 12Z"
        stroke="currentColor"
        strokeWidth="0.9"
        fill="currentColor"
        fillOpacity="0.1"
      />
      <path
        d="M12 12C12 20 16 27 23 31C23 24 20 17 12 12Z"
        stroke="currentColor"
        strokeWidth="0.9"
        fill="currentColor"
        fillOpacity="0.1"
      />
      <circle cx="10" cy="10" r="1.8" fill="currentColor" />
    </svg>
  );
};

export const BotanicalDivider: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center justify-center gap-4 ${className}`} aria-hidden="true">
    <span className="h-px w-14 sm:w-24 bg-[#C5A059]/45" />
    <svg viewBox="0 0 64 24" fill="none" className="w-12 h-5 text-[#C5A059]">
      <path
        d="M32 12C26 6 19 4 12 7C17 12 24 14 32 12Z"
        stroke="currentColor"
        strokeWidth="1"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <path
        d="M32 12C38 6 45 4 52 7C47 12 40 14 32 12Z"
        stroke="currentColor"
        strokeWidth="1"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <path
        d="M32 12C29 17 24 20 18 19C22 15 27 13 32 12Z"
        stroke="currentColor"
        strokeWidth="0.9"
      />
      <path
        d="M32 12C35 17 40 20 46 19C42 15 37 13 32 12Z"
        stroke="currentColor"
        strokeWidth="0.9"
      />
      <circle cx="32" cy="11.5" r="2.2" fill="currentColor" />
    </svg>
    <span className="h-px w-14 sm:w-24 bg-[#C5A059]/45" />
  </div>
);
