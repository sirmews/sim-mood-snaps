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
  Camera,
  Diamond,
  UsersRound,
  Utensils,
  Palette,
  Heart,
  Star,
  Trophy
} from 'lucide-react';
import html2canvas from 'html2canvas';

interface StatData {
  label: string;
  value: number;
  icon: any;
}

const SimsStats: React.FC = () => {
  const [stats, setStats] = useState<StatData[]>([
    { label: 'Hunger', value: 85, icon: UtensilsCrossed },
    { label: 'Social', value: 75, icon: Users },
    { label: 'Bladder', value: 65, icon: Droplets },
    { label: 'Hygiene', value: 90, icon: Sparkles },
    { label: 'Energy', value: 45, icon: Zap },
    { label: 'Fun', value: 80, icon: Gamepad2 },
  ]);

  const topIcons = [Diamond, UsersRound, Utensils, Palette, Heart, Star, Trophy];

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
          backgroundColor: '#a3b5c7',
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
          <h1 className="text-3xl font-bold text-sims-chrome-dark mb-2">My Sims Stats</h1>
          <p className="text-sims-chrome-dark/80">Drag the sliders to reflect your current mood!</p>
        </div>

        <div id="sims-stats-container" className="relative">
          {/* Main chrome container */}
          <div className="bg-gradient-to-br from-sims-chrome to-sims-chrome-dark rounded-3xl p-6 shadow-2xl border-4 border-sims-chrome-dark/50 relative overflow-hidden">
            {/* Chrome effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10 pointer-events-none" />
            
            {/* Top icon bar */}
            <div className="flex justify-center mb-6 relative z-10">
              <div className="flex gap-3 bg-sims-chrome-dark/30 rounded-2xl p-3 border-2 border-sims-chrome-dark/40">
                {topIcons.map((Icon, index) => (
                  <div 
                    key={index}
                    className="w-10 h-10 bg-sims-chrome/60 rounded-lg flex items-center justify-center border border-sims-chrome-dark/30 shadow-sm hover:bg-sims-chrome/80 transition-colors cursor-pointer"
                  >
                    <Icon size={18} className="text-sims-chrome-dark" />
                  </div>
                ))}
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
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
        </div>

        <div className="flex justify-center mt-8">
          <Button 
            onClick={captureScreenshot}
            disabled={isCapturing}
            className="bg-gradient-to-r from-sims-chrome to-sims-chrome-dark hover:from-sims-chrome-dark hover:to-sims-chrome text-white px-6 py-2 rounded-lg flex items-center gap-2 shadow-lg border border-sims-chrome-dark/50"
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