import React from 'react';

interface SenegalFlagProps {
  className?: string;
  width?: number;
  height?: number;
  showStar?: boolean;
}

export default function SenegalFlag({
  className = '',
  width = 100,
  height = 66,
  showStar = true
}: SenegalFlagProps) {
  return (
    <svg
      viewBox="0 0 900 600"
      width={width}
      height={height}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Bande verte */}
      <rect width="300" height="600" fill="#00853F" />

      {/* Bande jaune */}
      <rect x="300" width="300" height="600" fill="#FDEF42" />

      {/* Bande rouge */}
      <rect x="600" width="300" height="600" fill="#E31B23" />

      {/* Étoile verte au centre */}
      {showStar && (
        <path
          d="M 450,200 L 475,275 L 555,275 L 490,320 L 515,395 L 450,350 L 385,395 L 410,320 L 345,275 L 425,275 Z"
          fill="#00853F"
          stroke="#00853F"
          strokeWidth="2"
        />
      )}
    </svg>
  );
}

// Version miniature pour utilisation comme icône
export function SenegalFlagMini({ className = '' }: { className?: string }) {
  return (
    <SenegalFlag
      className={className}
      width={24}
      height={16}
      showStar={true}
    />
  );
}
