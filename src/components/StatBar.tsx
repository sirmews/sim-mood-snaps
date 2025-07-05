import React, { useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface StatBarProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  icon: LucideIcon;
  showLeftArrow?: boolean;
  showRightArrow?: boolean;
  showSmiley?: boolean;
}

const StatBar: React.FC<StatBarProps> = ({ 
  label, 
  value, 
  onChange, 
  icon: Icon,
  showLeftArrow = false,
  showRightArrow = false,
  showSmiley = false
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateValue(e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      updateValue(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateValue = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    onChange(percentage);
  };

  React.useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const statBar = document.querySelector(`[data-stat="${label}"]`);
        if (statBar) {
          const rect = statBar.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
          onChange(percentage);
        }
      }
    };

    if (isDragging) {
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.addEventListener('mousemove', handleGlobalMouseMove);
    }

    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [isDragging, onChange, label]);

  return (
    <div className="bg-gradient-to-b from-sims-stat-light to-sims-stat-bg rounded-lg p-4 border-2 border-sims-panel shadow-inner relative">
      <div className="text-sims-text font-bold text-lg mb-2">{label}</div>
      <div className="relative">
        <div 
          className="bg-sims-bar-bg rounded-full h-4 border border-sims-bar-border cursor-pointer"
          data-stat={label}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <div
            className={`bg-gradient-to-r from-sims-green-light to-sims-green h-full rounded-full border border-sims-green-dark transition-all duration-150 ${isDragging ? 'from-sims-green to-sims-green-dark' : ''}`}
            style={{ width: `${value}%` }}
          />
        </div>
        
        {/* Left pink arrow */}
        {showLeftArrow && (
          <div className="absolute -left-2 top-1/2 transform -translate-y-1/2">
            <div className="w-0 h-0 border-l-4 border-l-sims-arrow border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
          </div>
        )}
        
        {/* Right green arrow */}
        {showRightArrow && (
          <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
            <div className="w-0 h-0 border-r-4 border-r-sims-green border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
          </div>
        )}
      </div>
      
      {/* Smiley face icon for Fun */}
      {showSmiley && value > 90 && (
        <div className="absolute -right-2 -top-2 bg-sims-green-light rounded border-2 border-sims-green-dark p-1">
          <div className="text-sims-green-dark text-xs font-bold">:)</div>
        </div>
      )}
    </div>
  );
};

export default StatBar;