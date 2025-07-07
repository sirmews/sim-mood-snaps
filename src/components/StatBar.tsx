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

  // Calculate color based on value (red for low, yellow for medium, green for high)
  const getBarColor = (value: number) => {
    if (value <= 25) {
      // Red to orange (0-25%)
      const intensity = value / 25;
      return {
        from: `hsl(${Math.round(intensity * 15)}, 85%, 50%)`, // 0° (red) to 15° (red-orange)
        to: `hsl(${Math.round(intensity * 20)}, 85%, 45%)`,
        border: `hsl(${Math.round(intensity * 20)}, 85%, 35%)`
      };
    } else if (value <= 50) {
      // Orange to yellow (25-50%)
      const intensity = (value - 25) / 25;
      return {
        from: `hsl(${Math.round(15 + intensity * 30)}, 85%, 50%)`, // 15° to 45° (orange to yellow)
        to: `hsl(${Math.round(20 + intensity * 35)}, 85%, 45%)`,
        border: `hsl(${Math.round(20 + intensity * 35)}, 85%, 35%)`
      };
    } else if (value <= 75) {
      // Yellow to yellow-green (50-75%)
      const intensity = (value - 50) / 25;
      return {
        from: `hsl(${Math.round(45 + intensity * 35)}, 75%, 50%)`, // 45° to 80° (yellow to yellow-green)
        to: `hsl(${Math.round(55 + intensity * 35)}, 75%, 45%)`,
        border: `hsl(${Math.round(55 + intensity * 35)}, 75%, 35%)`
      };
    } else {
      // Yellow-green to green (75-100%)
      const intensity = (value - 75) / 25;
      return {
        from: `hsl(${Math.round(80 + intensity * 30)}, 70%, 50%)`, // 80° to 110° (yellow-green to green)
        to: `hsl(${Math.round(90 + intensity * 20)}, 70%, 45%)`,
        border: `hsl(${Math.round(90 + intensity * 20)}, 70%, 35%)`
      };
    }
  };

  const barColors = getBarColor(value);
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
              width: `${value}%`,
              background: `linear-gradient(to right, ${barColors.from}, ${barColors.to})`,
              borderColor: barColors.border,
              borderWidth: '1px',
              borderStyle: 'solid'
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