import React from 'react';
import { Shirt, Download, Upload as UploadIcon, Moon, Sun, SlidersHorizontal, Sparkles } from 'lucide-react';

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
    <header className={`sticky top-0 z-40 border-b transition-colors duration-200 ios-glass ${
      isDarkMode 
        ? 'bg-black/85 border-white/10 text-white' 
        : 'bg-white/85 border-neutral-200/80 text-neutral-900'
    }`}>
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* iOS Title & Subtitle */}
        <div className="flex items-center space-x-3">
          <div className="flex flex-col">
            <h1 className="text-base sm:text-lg font-semibold tracking-tight leading-none">
              Mi Closet <span className="font-normal text-neutral-400 text-xs">@sappy.error</span>
            </h1>
            <span className="text-[10px] text-neutral-500 font-medium mt-0.5">
              {itemCount} prendas · {outfitCount} looks
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {/* Add Item Quick Button */}
          <button
            onClick={onNavigateToUpload}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-opacity shadow-sm"
            title="Subir prenda"
          >
            <Shirt className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">+ Agregar</span>
          </button>

          {/* Backup / Restore Controls */}
          <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 rounded-full p-0.5">
            <button
              onClick={onExportData}
              className={`p-1.5 rounded-full transition-colors ${
                isDarkMode ? 'text-neutral-300 hover:bg-neutral-700' : 'text-neutral-600 hover:bg-neutral-200'
              }`}
              title="Exportar copia de seguridad (JSON)"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`p-1.5 rounded-full transition-colors ${
                isDarkMode ? 'text-neutral-300 hover:bg-neutral-700' : 'text-neutral-600 hover:bg-neutral-200'
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
            className={`p-2 rounded-full transition-colors ${
              isDarkMode
                ? 'bg-neutral-800 text-amber-300 hover:bg-neutral-700'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
            title="Cambiar modo de color"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};

