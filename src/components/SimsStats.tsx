import React, { useState, useEffect } from 'react';
import StatBar from './StatBar';
import { Button } from '@/components/ui/button';
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
  Sun,
  Laptop
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { useTheme } from 'next-themes';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface StatData {
  label: string;
  value: number;
  showLeftArrow?: boolean;
  showRightArrow?: boolean;
  showSmiley?: boolean;
}

const SimsStats: React.FC = () => {
  // Mood-based SIMS acronyms
  const simsAcronyms = {
    critical: [
      "Seriously In Major Shambles",
      "Struggling In My Sadness",
      "Stuck In Miserable State",
      "Severely Impacted Mental State",
      "Sinking In My Sorrows"
    ],
    low: [
      "Stuck In My Saga",
      "Status Is Mentally Slippery", 
      "Socially Induced Meltdown Simulator",
      "Sometimes It's Me Sulking",
      "Stressed Individual Managing Struggles",
      "Sadly I'm Making Scenes"
    ],
    medium: [
      "Slowly Improving My Situation",
      "Steadily In Moderate State",
      "Somewhat In Middle Space",
      "Still In Mixed Spirits",
      "Surviving In My Story"
    ],
    good: [
      "Succeeding In My Story",
      "Smiling In My Success",
      "Shining In My Spotlight",
      "Strong In My Spirit",
      "Soaring In My Satisfaction"
    ],
    excellent: [
      "Spectacular In My Success",
      "Supremely In My Stride",
      "Superb In My Situation",
      "Stellar In My State",
      "Sensational In My Story"
    ]
  };

  const [stats, setStats] = useState<StatData[]>([
    { label: 'Hunger', value: 60, showLeftArrow: true },
    { label: 'Social', value: 70, showLeftArrow: true },
    { label: 'Bladder', value: 50 },
    { label: 'Hygiene', value: 65, showLeftArrow: true },
    { label: 'Energy', value: 45, showRightArrow: true },
    { label: 'Fun', value: 95, showLeftArrow: true, showSmiley: true },
  ]);

  // Calculate overall mood based on average of all stats
  const calculateOverallMood = () => {
    const average = stats.reduce((sum, stat) => sum + stat.value, 0) / stats.length;
    
    if (average <= 20) return 'critical';
    if (average <= 40) return 'low';
    if (average <= 60) return 'medium';
    if (average <= 80) return 'good';
    return 'excellent';
  };

  const [currentMood, setCurrentMood] = useState<string>('medium');
  const [currentTitle, setCurrentTitle] = useState('');
  const { theme, setTheme } = useTheme();
  const [isCapturing, setIsCapturing] = useState(false);

  const captureScreenshot = async () => {
    setIsCapturing(true);
    try {
      const element = document.getElementById('sims-stats-container');
      if (element) {
        const canvas = await html2canvas(element, {
          backgroundColor: theme === 'dark' ? '#0f172a' : '#f1f5f9',
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

  const topIcons = [
    { icon: Diamond, bg: "bg-sims-panel", tooltip: "Aspirations & Goals" },
    { icon: Users, bg: "bg-sims-panel", tooltip: "Social Relationships" },
    { icon: Briefcase, bg: "bg-sims-panel", tooltip: "Career & Work" },
    { icon: Zap, bg: "bg-sims-panel", tooltip: "Skills & Abilities" },
    { 
      icon: theme === 'dark' ? Sun : Moon, 
      bg: "bg-sims-panel",
      onClick: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
      tooltip: theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'
    },
    { 
      icon: Camera, 
      bg: "bg-sims-panel",
      onClick: captureScreenshot,
      tooltip: 'Take Screenshot'
    },
    { 
      icon: Laptop, 
      bg: "bg-sims-panel",
      onClick: () => window.open('https://github.com/sirmews/sim-mood-snaps', '_blank'),
      tooltip: 'View on GitHub'
    },
    { icon: User, bg: "bg-sims-panel-light", tooltip: "Sim Profile" },
  ];

  // Update title when stats change
  React.useEffect(() => {
    const newMood = calculateOverallMood();
    if (newMood !== currentMood) {
      setCurrentMood(newMood);
      const moodTitles = simsAcronyms[newMood as keyof typeof simsAcronyms];
      const randomIndex = Math.floor(Math.random() * moodTitles.length);
      setCurrentTitle(moodTitles[randomIndex]);
    }
  }, [stats, currentMood]);

  // Initialize title on component mount
  useEffect(() => {
    const initialMood = calculateOverallMood();
    setCurrentMood(initialMood);
    const moodTitles = simsAcronyms[initialMood as keyof typeof simsAcronyms];
    const randomIndex = Math.floor(Math.random() * moodTitles.length);
    setCurrentTitle(moodTitles[randomIndex]);
  }, []);


  const handleStatChange = (index: number, newValue: number) => {
    setStats(prev => prev.map((stat, i) => 
      i === index ? { ...stat, value: newValue } : stat
    ));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-sims-bg p-4 flex-col">
      <div className="relative">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-sims-text mb-2">{currentTitle}</h1>
          <p className="text-sims-text/80">Drag the bars to reflect your current mood!</p>
        </div>

        <div id="sims-stats-container" className="relative">
          {/* Main panel with 3D effect */}
          <div className="bg-gradient-to-b from-sims-panel-light to-sims-panel rounded-2xl p-6 shadow-2xl border-4 border-sims-chrome-dark relative">
            {/* Top icon bar */}
            <div className="flex justify-center mb-6 gap-1">
              {topIcons.map((item, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <div 
                      className={`${item.bg} rounded-lg p-2 border-2 border-sims-chrome-dark shadow-md cursor-pointer hover:brightness-110 transition-all ${item.onClick && isCapturing ? 'opacity-50' : ''}`}
                      onClick={item.onClick}
                    >
                      <item.icon className="w-5 h-5 text-sims-text" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{item.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
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

      </div>
      <p className="p-6 text-center text-sims-text/70 text-sm">
        vibe coded 🌸 by <a href="https://www.perfectlycromulent.dev/" className="text-sims-green hover:text-sims-green-light transition-colors">Nav</a>
      </p>
    </div>
  );
};

export default SimsStats;
