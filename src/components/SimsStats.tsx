import React, { useState, useEffect } from 'react';
import StatBar from './StatBar';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Diamond, 
  Users, 
  Briefcase, 
  Zap, 
  Heart, 
  Star, 
  Package, 
  User,
  Camera,
  Moon,
  Sun
} from 'lucide-react';
import html2canvas from 'html2canvas';

interface StatData {
  label: string;
  value: number;
  showLeftArrow?: boolean;
  showRightArrow?: boolean;
  showSmiley?: boolean;
}

const SimsStats: React.FC = () => {
  const simsAcronyms = [
    "Stuck In My Saga",
    "Status Is Mentally Slippery", 
    "Socially Induced Meltdown Simulator",
    "Sometimes It's Me Sulking",
    "Stressed Individual Managing Struggles",
    "Sadly I'm Making Scenes"
  ];

  const [stats, setStats] = useState<StatData[]>([
    { label: 'Hunger', value: 60, showLeftArrow: true },
    { label: 'Social', value: 70, showLeftArrow: true },
    { label: 'Bladder', value: 50 },
    { label: 'Hygiene', value: 65, showLeftArrow: true },
    { label: 'Energy', value: 45, showRightArrow: true },
    { label: 'Fun', value: 95, showLeftArrow: true, showSmiley: true },
  ]);

  const [currentTitle, setCurrentTitle] = useState(simsAcronyms[0]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const topIcons = [
    { icon: Diamond, bg: "bg-sims-panel" },
    { icon: Users, bg: "bg-sims-panel" },
    { icon: Briefcase, bg: "bg-sims-panel" },
    { icon: Zap, bg: "bg-sims-panel" },
    { icon: Heart, bg: "bg-sims-panel" },
    { icon: Star, bg: "bg-sims-panel" },
    { icon: Package, bg: "bg-sims-panel" },
    { icon: User, bg: "bg-sims-panel-light" },
  ];

  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * simsAcronyms.length);
    setCurrentTitle(simsAcronyms[randomIndex]);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

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
          backgroundColor: isDarkMode ? '#0f172a' : '#f1f5f9',
          scale: 2,
          useCORS: true,
          x: -20,
          y: -20,
          width: element.offsetWidth + 40,
          height: element.offsetHeight + 40,
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
    <div className="flex items-center justify-center min-h-screen bg-sims-bg p-4">
      <div className="relative">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              {/* <Sun className="w-4 h-4 text-sims-text" />
              <Switch 
                checked={isDarkMode}
                onCheckedChange={setIsDarkMode}
              />
              <Moon className="w-4 h-4 text-sims-text" /> */}
            </div>
          </div>
          <h1 className="text-3xl font-bold text-sims-text mb-2">{currentTitle}</h1>
          <p className="text-sims-text/80">Drag the bars to reflect your current mood!</p>
        </div>

        <div id="sims-stats-container" className="relative">
          {/* Main panel with 3D effect */}
          <div className="bg-gradient-to-b from-sims-panel-light to-sims-panel rounded-2xl p-6 shadow-2xl border-4 border-sims-chrome-dark relative">
            {/* Top icon bar */}
            <div className="flex justify-center mb-6 gap-1">
              {topIcons.map((item, index) => (
                <div key={index} className={`${item.bg} rounded-lg p-2 border-2 border-sims-chrome-dark shadow-md cursor-pointer hover:brightness-110 transition-all`}>
                  <item.icon className="w-5 h-5 text-sims-text" />
                </div>
              ))}
            </div>

            {/* Needs grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <StatBar
                  key={stat.label}
                  label={stat.label}
                  value={stat.value}
                  onChange={(value) => handleStatChange(index, value)}
                  icon={Diamond} // We'll keep using a placeholder icon since we removed icon from the interface
                  showLeftArrow={stat.showLeftArrow}
                  showRightArrow={stat.showRightArrow}
                  showSmiley={stat.showSmiley}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <Button 
            onClick={captureScreenshot}
            disabled={isCapturing}
            className="bg-gradient-to-r from-sims-panel-light to-sims-panel hover:from-sims-panel hover:to-sims-chrome-dark text-sims-text px-6 py-2 rounded-lg flex items-center gap-2 shadow-lg border-2 border-sims-chrome-dark"
          >
            <Camera size={18} />
            {isCapturing ? 'Capturing...' : 'Screenshot My Stats'}
          </Button>
        </div>
      </div>
      <p>Made by <a href="https://www.perfectlycromulent.dev/">Nav</a></p>
    </div>
  );
};

export default SimsStats;