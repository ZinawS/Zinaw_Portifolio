import React from 'react';
import './HorizontalLine.css'; // Create this CSS file

const HorizontalLine = ({ variant = 'gradient', color = '#4f46e5', height = '2px' }) => {
  const getLineStyle = () => {
    switch(variant) {
      case 'gradient':
        return {
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          height,
          border: 'none',
        };
      case 'dotted':
        return {
          borderTop: `${height} dotted ${color}`,
          background: 'transparent',
        };
      case 'double':
        return {
          borderTop: `${height} double ${color}`,
          borderBottom: `${height} double ${color}`,
          height: '6px',
          background: 'transparent',
        };
      case 'zigzag':
        return {
          background: `linear-gradient(135deg, ${color} 25%, transparent 25%) -20px 0,
                      linear-gradient(-135deg, ${color} 25%, transparent 25%) -20px 0,
                      linear-gradient(45deg, ${color} 25%, transparent 25%),
                      linear-gradient(-45deg, ${color} 25%, transparent 25%)`,
          backgroundSize: `${height} ${height}`,
          height,
          border: 'none',
        };
      case 'animated':
        return {
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          height,
          border: 'none',
          position: 'relative',
          overflow: 'hidden',
        };
      default:
        return {
          borderTop: `${height} solid ${color}`,
          background: 'transparent',
        };
    }
  };

  return (
    <>
      <hr 
        className={`hr-line hr-${variant}`} 
        style={getLineStyle()}
      />
      {variant === 'animated' && (
        <style>{`
          .hr-animated::after {
            content: '';
            position: absolute;
            left: -100%;
            top: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, #fff, transparent);
            animation: shine 2s infinite;
          }
          @keyframes shine {
            100% { left: 100%; }
          }
        `}</style>
      )}
    </>
  );
};

export default HorizontalLine;