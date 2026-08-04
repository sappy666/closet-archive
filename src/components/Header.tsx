import React from 'react';
import { Shirt, Sparkles, Download, Upload as UploadIcon, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  itemCount: number;
  outfitCount: number;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onExportData: () => void;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNavigateToUpload: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  itemCount,
  outfitCount,
  isDarkMode,
  onToggleDarkMode,
  onExportData,
  onImportData,
  onNavigateToUpload
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <header className={`sticky top-0 z-40 border-b transition-colors duration-200 ${
      isDarkMode 
        ? 'bg-[#0A0A0A]/95 border-white/10 text-[#E5E5E5] backdrop-blur-md' 
        : 'bg-white/95 border-neutral-200 text-neutral-900 backdrop-blur-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
        {/* Brand Logo & Identifier */}
        <div className="flex items-center space-x-4">
          <span className="text-xl font-bold tracking-tighter italic">@sappy.error</span>
          <span className="mono text-[10px] text-white/40 pt-1 hidden sm:inline-block">
            digital.archival_v1.0
          </span>
        </div>

        {/* Status Badges & Action Controls */}
        <div className="flex items-center space-x-3 sm:space-x-6">
          <div className="hidden lg:flex items-center space-x-6 mono text-[10px]">
            <span className={isDarkMode ? 'text-white/40' : 'text-neutral-500'}>
              STORAGE: <strong className={isDarkMode ? 'text-white' : 'text-black'}>{itemCount}/100</strong>
            </span>
            <span className={isDarkMode ? 'text-white/40' : 'text-neutral-500'}>
              LOOKS: <strong className={isDarkMode ? 'text-white' : 'text-black'}>{outfitCount}</strong>
            </span>
            <span className={isDarkMode ? 'text-white/40' : 'text-neutral-500'}>
              LOC: TOKYO_DIST_01
            </span>
          </div>

          {/* Quick Upload Button */}
          <button
            onClick={onNavigateToUpload}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-[10px] mono font-bold bg-white text-black hover:bg-neutral-200 transition-colors"
            title="Subir prenda"
          >
            <Shirt className="w-3.5 h-3.5" />
            <span>+ ADD ITEM</span>
          </button>

          {/* Data Backup & Restore */}
          <div className="flex items-center border border-white/20 dark:border-white/10 divide-x divide-white/20 dark:divide-white/10">
            <button
              onClick={onExportData}
              className={`p-1.5 transition-colors hover:bg-white/10 ${
                isDarkMode ? 'text-neutral-300' : 'text-neutral-700'
              }`}
              title="Exportar copia de seguridad (JSON)"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`p-1.5 transition-colors hover:bg-white/10 ${
                isDarkMode ? 'text-neutral-300' : 'text-neutral-700'
              }`}
              title="Importar copia de seguridad"
            >
              <UploadIcon className="w-3.5 h-3.5" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={onImportData}
              accept=".json"
              className="hidden"
            />
          </div>

          {/* Dark / Light Toggle */}
          <button
            onClick={onToggleDarkMode}
            className={`p-1.5 border transition-colors ${
              isDarkMode
                ? 'bg-black border-white/20 text-white hover:bg-neutral-900'
                : 'bg-neutral-100 border-neutral-300 text-neutral-800 hover:bg-neutral-200'
            }`}
            title="Cambiar modo de color"
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </header>
  );
};

