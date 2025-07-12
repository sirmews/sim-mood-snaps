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
  Laptop,
  TrendingUp,
  X,
  Calendar
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

  // Function to get URL parameters
  const getUrlParams = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      hunger: parseInt(params.get('hunger') || '60'),
      social: parseInt(params.get('social') || '70'),
      bladder: parseInt(params.get('bladder') || '50'),
      hygiene: parseInt(params.get('hygiene') || '65'),
      energy: parseInt(params.get('energy') || '45'),
      fun: parseInt(params.get('fun') || '95')
    };
  };

  // Function to save stats to localStorage
  const saveStatsToHistory = (newStats: StatData[]) => {
    const timestamp = new Date().toISOString();
    const snapshot = {
      timestamp,
      stats: newStats.map(stat => ({ label: stat.label, value: Math.round(stat.value) }))
    };
    
    const history = getStatsHistory();
    history.push(snapshot);
    
    // Keep only last 20 snapshots
    const trimmedHistory = history.slice(-20);
    localStorage.setItem('simsStatsHistory', JSON.stringify(trimmedHistory));
  };

  // Function to get stats history from localStorage
  const getStatsHistory = () => {
    try {
      const stored = localStorage.getItem('simsStatsHistory');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  // Function to update URL with current stats
  const updateUrl = (newStats: StatData[]) => {
    const params = new URLSearchParams();
    newStats.forEach(stat => {
      params.set(stat.label.toLowerCase(), Math.round(stat.value).toString());
    });
    
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  };

  // Initialize stats from URL parameters
  const initializeStats = (): StatData[] => {
    const urlParams = getUrlParams();
    return [
      { label: 'Hunger', value: urlParams.hunger, showLeftArrow: true },
      { label: 'Social', value: urlParams.social, showLeftArrow: true },
      { label: 'Bladder', value: urlParams.bladder },
      { label: 'Hygiene', value: urlParams.hygiene, showLeftArrow: true },
      { label: 'Energy', value: urlParams.energy, showRightArrow: true },
      { label: 'Fun', value: urlParams.fun, showLeftArrow: true, showSmiley: true },
    ];
  };
  const [stats, setStats] = useState<StatData[]>(initializeStats);

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
  const [showHistory, setShowHistory] = useState(false);

  // Listen for browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setStats(initializeStats());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
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

  // Function to get stat changes from last snapshot
  const getStatChanges = () => {
    const history = getStatsHistory();
    if (history.length < 2) return null;
    
    const current = stats.map(stat => ({ label: stat.label, value: Math.round(stat.value) }));
    const previous = history[history.length - 1].stats;
    
    return current.map(stat => {
      const prevStat = previous.find(p => p.label === stat.label);
      const change = prevStat ? stat.value - prevStat.value : 0;
      return { ...stat, change };
    });
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
    { 
      icon: TrendingUp, 
      bg: "bg-sims-panel-light", 
      onClick: () => setShowHistory(!showHistory),
      tooltip: "View Stats History" 
    },
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
    const newStats = stats.map((stat, i) => 
      i === index ? { ...stat, value: newValue } : stat
    );
    setStats(newStats);
    updateUrl(newStats);
    saveStatsToHistory(newStats);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-sims-bg p-4 sm:p-6 md:p-8 flex-col">
      <div className="relative">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-sims-text mb-2">{currentTitle}</h1>
          <p className="text-sims-text/80 px-4 sm:px-0">Drag the bars to reflect your current mood!</p>
        </div>

        <div id="sims-stats-container" className="relative">
          {/* Main panel with 3D effect */}
          <div className="bg-gradient-to-b from-sims-panel-light to-sims-panel rounded-2xl p-4 sm:p-6 shadow-2xl border-4 border-sims-chrome-dark relative max-w-md sm:max-w-lg mx-auto">
            {/* Top icon bar */}
            <div className="flex justify-center mb-4 sm:mb-6 gap-1 flex-wrap">
              {topIcons.map((item, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <div 
                      className={`${item.bg} rounded-lg p-1.5 sm:p-2 border-2 border-sims-chrome-dark shadow-md cursor-pointer hover:brightness-110 transition-all ${item.onClick && isCapturing ? 'opacity-50' : ''}`}
                      onClick={item.onClick}
                    >
                      <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-sims-text" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{item.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>

            {/* Needs grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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

        {/* Stats History Overlay */}
        {showHistory && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-b from-sims-panel-light to-sims-panel rounded-2xl p-6 border-4 border-sims-chrome-dark max-w-md w-full max-h-96 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-sims-text">Stats History</h3>
                <button 
                  onClick={() => setShowHistory(false)}
                  className="bg-sims-panel-light rounded-lg p-1 border-2 border-sims-chrome-dark hover:brightness-110"
                >
                  <X className="w-4 h-4 text-sims-text" />
                </button>
              </div>

              {/* Current vs Last Changes */}
              {(() => {
                const changes = getStatChanges();
                if (!changes) {
                  return (
                    <div className="text-center text-sims-text/70 py-4">
                      <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No previous data to compare</p>
                      <p className="text-sm">Adjust your stats to start tracking!</p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-sims-text/80 mb-2">Changes Since Last Update:</h4>
                    {changes.map((stat) => (
                      <div key={stat.label} className="bg-sims-panel rounded-lg p-3 border border-sims-chrome-dark">
                        <div className="flex justify-between items-center">
                          <span className="text-sims-text font-medium">{stat.label}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sims-text">{stat.value}</span>
                            {stat.change !== 0 && (
                              <span className={`text-sm font-bold ${
                                stat.change > 0 ? 'text-green-400' : 'text-red-400'
                              }`}>
                                {stat.change > 0 ? '+' : ''}{stat.change}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* Recent History */}
              {(() => {
                const history = getStatsHistory();
                if (history.length > 0) {
                  return (
                    <div className="mt-6 pt-4 border-t border-sims-chrome-dark">
                      <h4 className="text-sm font-semibold text-sims-text/80 mb-2">Recent Activity:</h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {history.slice(-5).reverse().map((snapshot, index) => (
                          <div key={index} className="text-xs text-sims-text/60 bg-sims-panel/30 rounded p-2">
                            <div className="mb-1">
                              {new Date(snapshot.timestamp).toLocaleString()}
                            </div>
                            <div className="grid grid-cols-2 gap-1 text-xs">
                              {snapshot.stats.map((stat) => (
                                <span key={stat.label}>{stat.label}: {stat.value}</span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          </div>
        )}

      </div>
      <p className="p-4 sm:p-6 text-center text-sims-text/70 text-sm">
        vibe coded 🌸 by <a href="https://www.perfectlycromulent.dev/" className="text-sims-green hover:text-sims-green-light transition-colors">Nav</a>
      </p>
    </div>
  );
};

export default SimsStats;
