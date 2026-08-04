import React from 'react';
import { ActiveTab } from '../types';
import { Grid, Layers, Camera, Heart, Sparkles } from 'lucide-react';

interface BottomNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isDarkMode: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  isDarkMode,
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'closet',
      label: 'Wardrobe',
      icon: <Grid className="w-4 h-4" />,
    },
    {
      id: 'studio',
      label: 'Studio',
      icon: <Layers className="w-4 h-4" />,
    },
    {
      id: 'upload',
      label: '+ Item',
      icon: <Camera className="w-4 h-4" />,
    },
    {
      id: 'lookbook',
      label: 'Saved',
      icon: <Heart className="w-4 h-4" />,
    },
    {
      id: 'ai-stylist',
      label: 'Stylist',
      icon: <Sparkles className="w-4 h-4" />,
      badge: 'AI',
    },
  ];

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-50 border-t transition-colors duration-200 ${
        isDarkMode
          ? 'bg-black border-white/10 text-white/60 backdrop-blur-lg'
          : 'bg-white border-neutral-200 text-neutral-600 backdrop-blur-lg'
      }`}
    >
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`relative flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all ${
                isActive
                  ? isDarkMode
                    ? 'text-white font-bold'
                    : 'text-black font-bold'
                  : 'hover:text-white/90 opacity-60 hover:opacity-100'
              }`}
            >
              {/* Active / Inactive Line Bar */}
              <div
                className={`w-4 transition-all ${
                  isActive
                    ? 'h-1 bg-white'
                    : isDarkMode
                    ? 'h-[1px] bg-white/20'
                    : 'h-[1px] bg-neutral-300'
                }`}
              />

              <div className="relative flex items-center gap-1">
                {item.icon}
                {item.badge && (
                  <span className="bg-white text-black text-[8px] mono font-bold px-1 py-0">
                    {item.badge}
                  </span>
                )}
              </div>

              <span className="mono text-[9px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

