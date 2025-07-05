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
    <div className="bg-sims-panel rounded-lg p-4 shadow-md border border-sims-shadow/20">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 bg-sims-green/20 rounded-full flex items-center justify-center">
          <Icon size={18} className="text-sims-green-dark" />
        </div>
        <span className="font-medium text-foreground text-sm">{label}</span>
      </div>
      
      <div 
        className="w-full h-6 bg-muted rounded-full relative cursor-pointer select-none"
        data-stat={label}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div 
          className={`h-full bg-${color} rounded-full transition-all duration-150 ${isDragging ? 'bg-sims-green-light' : ''}`}
          style={{ width: `${value}%` }}
        />
        <div 
          className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white border-2 border-sims-green rounded-full shadow-sm cursor-grab active:cursor-grabbing"
          style={{ left: `calc(${value}% - 8px)` }}
        />
      </div>
      
      <div className="text-xs text-muted-foreground mt-2 text-center">
        {Math.round(value)}%
      </div>
    </div>
  );
};

export default StatBar;