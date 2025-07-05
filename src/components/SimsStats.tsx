import React, { useState } from 'react';
import StatBar from './StatBar';
import { Button } from '@/components/ui/button';
import { 
  Droplets, 
  Gamepad2, 
  UtensilsCrossed, 
  Users, 
  Zap, 
  Sparkles,
  Camera
} from 'lucide-react';
import html2canvas from 'html2canvas';

interface StatData {
  label: string;
  value: number;
  icon: any;
}

const SimsStats: React.FC = () => {
  const [stats, setStats] = useState<StatData[]>([
    { label: 'Bladder', value: 85, icon: Droplets },
    { label: 'Fun', value: 75, icon: Gamepad2 },
    { label: 'Hunger', value: 65, icon: UtensilsCrossed },
    { label: 'Social', value: 90, icon: Users },
    { label: 'Energy', value: 45, icon: Zap },
    { label: 'Hygiene', value: 80, icon: Sparkles },
  ]);

  const [isCapturing, setIsCapturing] = useState(false);

  const handleStatChange = (index: number, newValue: number) => {
    setStats(prev => prev.map((stat, i) => 
      i === index ? { ...stat, value: newValue } : stat
    ));
  };

  const captureScreenshot = async () => {
    setIsCapturing(true);
    try {
      const element = document.getElementById('sims-stats-container');
      if (element) {
        const canvas = await html2canvas(element, {
          backgroundColor: '#f8fafc',
          scale: 2,
          useCORS: true,
        });
        
        // Create download link
        const link = document.createElement('a');
        link.download = `sims-stats-${new Date().toISOString().split('T')[0]}.png`;
        link.href = canvas.toDataURL();
        link.click();
      }
    } catch (error) {
      console.error('Failed to capture screenshot:', error);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="min-h-screen bg-sims-bg p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Sims Stats</h1>
          <p className="text-muted-foreground">Drag the sliders to reflect your current mood!</p>
        </div>

        <div id="sims-stats-container" className="bg-sims-panel rounded-2xl p-8 shadow-xl border border-sims-shadow/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <StatBar
                key={stat.label}
                label={stat.label}
                value={stat.value}
                onChange={(value) => handleStatChange(index, value)}
                icon={stat.icon}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <Button 
            onClick={captureScreenshot}
            disabled={isCapturing}
            className="bg-sims-green hover:bg-sims-green-dark text-white px-6 py-2 rounded-lg flex items-center gap-2 shadow-lg"
          >
            <Camera size={18} />
            {isCapturing ? 'Capturing...' : 'Screenshot My Stats'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SimsStats;