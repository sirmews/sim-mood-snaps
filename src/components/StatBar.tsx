import React, { useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface StatBarProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  icon: LucideIcon;
  color?: string;
}

const StatBar: React.FC<StatBarProps> = ({ 
  label, 
  value, 
  onChange, 
  icon: Icon,
  color = "sims-green"
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
    <div className="bg-sims-stat-bg rounded-lg border-2 border-sims-stat-border shadow-lg relative overflow-hidden">
      {/* Chrome-like border effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-sims-chrome/30 to-sims-chrome-dark/20 pointer-events-none" />
      
      <div className="relative p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-foreground text-sm tracking-wide">{label}</span>
          <div className="w-6 h-6 bg-sims-chrome/40 rounded-full flex items-center justify-center border border-sims-chrome-dark/30">
            <Icon size={14} className="text-sims-chrome-dark" />
          </div>
        </div>
        
        <div 
          className="w-full h-5 bg-sims-chrome-dark/30 rounded-full relative cursor-pointer select-none border border-sims-chrome-dark/40 shadow-inner"
          data-stat={label}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <div 
            className={`h-full bg-gradient-to-r from-sims-green-light to-sims-green rounded-full transition-all duration-150 shadow-sm ${isDragging ? 'from-sims-green to-sims-green-dark' : ''}`}
            style={{ width: `${value}%` }}
          />
          <div 
            className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-gradient-to-br from-white to-gray-200 border border-sims-chrome-dark/50 rounded-full shadow-md cursor-grab active:cursor-grabbing"
            style={{ left: `calc(${value}% - 6px)` }}
          />
        </div>
        
        <div className="text-xs text-sims-chrome-dark font-medium mt-2 text-center">
          {Math.round(value)}%
        </div>
      </div>
    </div>
  );
};

export default StatBar;