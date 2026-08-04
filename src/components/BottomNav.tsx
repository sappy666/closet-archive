import React from 'react';
import { ActiveTab } from '../types';
import { Home, Grid, Plus, Layers, Sparkles, Bookmark } from 'lucide-react';

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
  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-50 border-t transition-colors duration-200 ios-glass ${
        isDarkMode
          ? 'bg-black/90 border-white/10 text-neutral-400'
          : 'bg-white/90 border-neutral-200/80 text-neutral-500'
      }`}
    >
      <div className="max-w-md mx-auto px-6 h-16 flex items-center justify-between relative">
        {/* Tab 1: Armario / Closet */}
        <button
          onClick={() => onTabChange('closet')}
          className={`flex flex-col items-center justify-center flex-1 transition-colors ${
            activeTab === 'closet'
              ? isDarkMode ? 'text-white' : 'text-black'
              : 'hover:text-black dark:hover:text-white'
          }`}
        >
          <Home className="w-5 h-5 stroke-[1.75]" />
          <span className="text-[10px] font-medium mt-1">Armario</span>
        </button>

        {/* Tab 2: Studio / Outfits */}
        <button
          onClick={() => onTabChange('studio')}
          className={`flex flex-col items-center justify-center flex-1 transition-colors ${
            activeTab === 'studio'
              ? isDarkMode ? 'text-white' : 'text-black'
              : 'hover:text-black dark:hover:text-white'
          }`}
        >
          <Layers className="w-5 h-5 stroke-[1.75]" />
          <span className="text-[10px] font-medium mt-1">Studio</span>
        </button>

        {/* Tab 3: Central Elevated (+) Upload Button */}
        <div className="flex-1 flex justify-center -mt-5">
          <button
            onClick={() => onTabChange('upload')}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 ${
              isDarkMode
                ? 'bg-white text-black hover:bg-neutral-200'
                : 'bg-black text-white hover:bg-neutral-800'
            }`}
            title="Subir prenda"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Tab 4: Lookbook / Guardados */}
        <button
          onClick={() => onTabChange('lookbook')}
          className={`flex flex-col items-center justify-center flex-1 transition-colors ${
            activeTab === 'lookbook'
              ? isDarkMode ? 'text-white' : 'text-black'
              : 'hover:text-black dark:hover:text-white'
          }`}
        >
          <Bookmark className="w-5 h-5 stroke-[1.75]" />
          <span className="text-[10px] font-medium mt-1">Looks</span>
        </button>

        {/* Tab 5: AI Stylist */}
        <button
          onClick={() => onTabChange('ai-stylist')}
          className={`flex flex-col items-center justify-center flex-1 transition-colors relative ${
            activeTab === 'ai-stylist'
              ? isDarkMode ? 'text-white' : 'text-black'
              : 'hover:text-black dark:hover:text-white'
          }`}
        >
          <Sparkles className="w-5 h-5 stroke-[1.75]" />
          <span className="text-[10px] font-medium mt-1">Estilista</span>
        </button>
      </div>
    </nav>
  );
};

