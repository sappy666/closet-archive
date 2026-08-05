import React, { useState } from 'react';
import { ClothingItem, Category } from '../types';
import { Plus, X, Sparkles, User, Layers, RefreshCw, Shirt } from 'lucide-react';

interface MannequinCanvasProps {
  selectedTop?: ClothingItem;
  selectedBottom?: ClothingItem;
  selectedJacket?: ClothingItem;
  selectedShoes?: ClothingItem;
  selectedAccessory?: ClothingItem;
  onSelectCategory: (category: Category) => void;
  onRemoveCategory: (category: Category) => void;
  isDarkMode: boolean;
}

export const MannequinCanvas: React.FC<MannequinCanvasProps> = ({
  selectedTop,
  selectedBottom,
  selectedJacket,
  selectedShoes,
  selectedAccessory,
  onSelectCategory,
  onRemoveCategory,
  isDarkMode,
}) => {
  const [silhouetteType, setSilhouetteType] = useState<'minimal' | 'female' | 'male'>('minimal');

  // Count equipped items
  const equippedCount = [selectedTop, selectedBottom, selectedJacket, selectedShoes, selectedAccessory].filter(Boolean).length;

  return (
    <div className={`p-4 sm:p-6 rounded-3xl border transition-all ${
      isDarkMode ? 'bg-neutral-900/90 border-neutral-800' : 'bg-white border-neutral-200/80 shadow-sm'
    }`}>
      {/* Header controls for Mannequin */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
          <h3 className="font-semibold text-xs sm:text-sm tracking-wide flex items-center gap-1.5">
            <span>Maniquí Virtual Studio</span>
            <span className="px-2 py-0.5 text-[10px] font-mono rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
              {equippedCount}/5 Prendas
            </span>
          </h3>
        </div>

        {/* Silhouette type selector */}
        <div className="flex items-center space-x-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-full text-[11px] font-medium">
          <button
            type="button"
            onClick={() => setSilhouetteType('minimal')}
            className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
              silhouetteType === 'minimal'
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs font-semibold'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Minimal
          </button>
          <button
            type="button"
            onClick={() => setSilhouetteType('female')}
            className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
              silhouetteType === 'female'
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs font-semibold'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Femenina
          </button>
          <button
            type="button"
            onClick={() => setSilhouetteType('male')}
            className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
              silhouetteType === 'male'
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs font-semibold'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Masculina
          </button>
        </div>
      </div>

      {/* Main Interactive Mannequin Stage */}
      <div className="relative w-full max-w-sm mx-auto min-h-[520px] rounded-2xl bg-gradient-to-b from-neutral-50 via-neutral-100/50 to-neutral-200/40 dark:from-neutral-950 dark:via-neutral-900/60 dark:to-neutral-950 border border-neutral-200 dark:border-neutral-800 p-4 flex flex-col items-center justify-between overflow-hidden shadow-inner">
        
        {/* Background Vector Body Silhouette SVG */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-15 dark:opacity-20 p-6">
          <svg
            viewBox="0 0 100 240"
            className="h-full w-auto stroke-current text-neutral-900 dark:text-white fill-none stroke-[1.2]"
          >
            {/* Head */}
            <circle cx="50" cy="22" r="12" />
            {/* Neck */}
            <path d="M47 34 L47 40 M53 34 L53 40" />
            
            {silhouetteType === 'female' ? (
              <>
                {/* Shoulders & Bust */}
                <path d="M50 40 C35 42, 28 48, 28 65 C28 85, 38 95, 42 110 C46 125, 42 140, 38 185 L44 220 M50 40 C65 42, 72 48, 72 65 C72 85, 62 95, 58 110 C54 125, 58 140, 62 185 L56 220" />
                <path d="M44 220 L40 235 M56 220 L60 235" />
              </>
            ) : silhouetteType === 'male' ? (
              <>
                {/* Broad Shoulders & Straight Torso */}
                <path d="M50 40 C30 42, 22 46, 22 70 L26 120 L32 185 L38 220 M50 40 C70 42, 78 46, 78 70 L74 120 L68 185 L62 220" />
                <path d="M38 220 L35 235 M62 220 L65 235" />
              </>
            ) : (
              <>
                {/* Minimalist Fashion Dummy */}
                <path d="M50 40 L28 50 L32 115 L40 180 L42 220 M50 40 L72 50 L68 115 L60 180 L58 220" />
                {/* Stand Pole */}
                <line x1="50" y1="220" x2="50" y2="238" strokeDasharray="2 2" />
                <line x1="35" y1="238" x2="65" y2="238" strokeWidth="2" />
              </>
            )}
          </svg>
        </div>

        {/* Mannequin Layers Stack */}
        <div className="relative z-10 w-full space-y-3 my-auto flex flex-col items-center">
          
          {/* Layer 1: Accessories (Head / Neck level) */}
          <div className="w-full flex justify-center">
            {selectedAccessory ? (
              <div className="relative group bg-white rounded-xl p-2 border border-neutral-200 dark:border-white/10 shadow-md transition-all hover:scale-105 max-w-[150px] flex items-center space-x-2">
                <img
                  src={selectedAccessory.imageUrl}
                  alt={selectedAccessory.title}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 object-contain rounded-md bg-neutral-50"
                />
                <div className="flex-1 min-w-0 text-left">
                  <span className="text-[9px] font-bold uppercase text-indigo-600 dark:text-indigo-400 block">Acceso.</span>
                  <p className="text-[10px] font-medium truncate text-neutral-800 dark:text-neutral-200">
                    {selectedAccessory.brand || selectedAccessory.title}
                  </p>
                </div>
                <button
                  onClick={() => onRemoveCategory('Accessories')}
                  className="p-1 text-neutral-400 hover:text-rose-500 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  title="Quitar accesorio"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onSelectCategory('Accessories')}
                className="px-3 py-1.5 rounded-full border border-dashed border-neutral-300 dark:border-neutral-700 bg-white/60 dark:bg-neutral-900/60 hover:bg-white dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-[10px] font-medium flex items-center space-x-1.5 transition-all hover:scale-105 cursor-pointer shadow-2xs"
              >
                <Plus className="w-3 h-3 text-indigo-500" />
                <span>+ Accesorio / Cabeza</span>
              </button>
            )}
          </div>

          {/* Layer 2: Jacket / Outerwear & Top (Chest / Torso level) */}
          <div className="w-full grid grid-cols-2 gap-2 max-w-[280px]">
            {/* Jacket Slot */}
            {selectedJacket ? (
              <div className="relative group bg-white rounded-xl p-2 border border-neutral-200 dark:border-white/10 shadow-md transition-all hover:scale-105 flex flex-col items-center text-center">
                <span className="text-[8px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
                  Abrigo / Chaqueta
                </span>
                <img
                  src={selectedJacket.imageUrl}
                  alt={selectedJacket.title}
                  referrerPolicy="no-referrer"
                  className="w-16 h-20 object-contain rounded-md"
                />
                <p className="text-[10px] font-semibold truncate w-full mt-1 text-neutral-800 dark:text-neutral-200">
                  {selectedJacket.brand || selectedJacket.title}
                </p>
                <button
                  onClick={() => onRemoveCategory('Jackets')}
                  className="absolute top-1 right-1 p-1 text-neutral-400 hover:text-rose-500 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  title="Quitar chaqueta"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onSelectCategory('Jackets')}
                className="h-28 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 bg-white/60 dark:bg-neutral-900/60 hover:bg-white dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-[10px] font-medium flex flex-col items-center justify-center space-y-1 transition-all hover:scale-105 cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5 text-amber-500" />
                <span>+ Abrigo</span>
              </button>
            )}

            {/* Top Slot */}
            {selectedTop ? (
              <div className="relative group bg-white rounded-xl p-2 border border-neutral-200 dark:border-white/10 shadow-md transition-all hover:scale-105 flex flex-col items-center text-center">
                <span className="text-[8px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                  Top / Camiseta
                </span>
                <img
                  src={selectedTop.imageUrl}
                  alt={selectedTop.title}
                  referrerPolicy="no-referrer"
                  className="w-16 h-20 object-contain rounded-md"
                />
                <p className="text-[10px] font-semibold truncate w-full mt-1 text-neutral-800 dark:text-neutral-200">
                  {selectedTop.brand || selectedTop.title}
                </p>
                <button
                  onClick={() => onRemoveCategory('Tops')}
                  className="absolute top-1 right-1 p-1 text-neutral-400 hover:text-rose-500 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  title="Quitar top"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onSelectCategory('Tops')}
                className="h-28 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 bg-white/60 dark:bg-neutral-900/60 hover:bg-white dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-[10px] font-medium flex flex-col items-center justify-center space-y-1 transition-all hover:scale-105 cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-500" />
                <span>+ Top / Polera</span>
              </button>
            )}
          </div>

          {/* Layer 3: Bottom (Waist / Pants level) */}
          <div className="w-full flex justify-center max-w-[280px]">
            {selectedBottom ? (
              <div className="relative group w-full bg-white rounded-xl p-2.5 border border-neutral-200 dark:border-white/10 shadow-md transition-all hover:scale-105 flex items-center space-x-3">
                <img
                  src={selectedBottom.imageUrl}
                  alt={selectedBottom.title}
                  referrerPolicy="no-referrer"
                  className="w-16 h-20 object-contain rounded-md bg-neutral-50 flex-shrink-0"
                />
                <div className="flex-1 min-w-0 text-left">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 block">
                    Pantalón / Bottom
                  </span>
                  <p className="text-xs font-semibold truncate text-neutral-800 dark:text-neutral-200 mt-0.5">
                    {selectedBottom.brand || selectedBottom.title}
                  </p>
                  {selectedBottom.color && (
                    <span className="text-[10px] text-neutral-400 block mt-0.5 capitalize">
                      {selectedBottom.color}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => onRemoveCategory('Bottoms')}
                  className="p-1.5 text-neutral-400 hover:text-rose-500 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  title="Quitar pantalón"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onSelectCategory('Bottoms')}
                className="w-full py-5 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 bg-white/60 dark:bg-neutral-900/60 hover:bg-white dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-[10px] font-medium flex items-center justify-center space-x-2 transition-all hover:scale-105 cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5 text-purple-500" />
                <span>+ Pantalón / Falda / Bottom</span>
              </button>
            )}
          </div>

          {/* Layer 4: Shoes (Feet level) */}
          <div className="w-full flex justify-center max-w-[280px]">
            {selectedShoes ? (
              <div className="relative group w-full bg-white rounded-xl p-2 border border-neutral-200 dark:border-white/10 shadow-md transition-all hover:scale-105 flex items-center space-x-3">
                <img
                  src={selectedShoes.imageUrl}
                  alt={selectedShoes.title}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 object-contain rounded-md bg-neutral-50 flex-shrink-0"
                />
                <div className="flex-1 min-w-0 text-left">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 block">
                    Calzado / Zapatos
                  </span>
                  <p className="text-xs font-semibold truncate text-neutral-800 dark:text-neutral-200">
                    {selectedShoes.brand || selectedShoes.title}
                  </p>
                </div>
                <button
                  onClick={() => onRemoveCategory('Shoes')}
                  className="p-1.5 text-neutral-400 hover:text-rose-500 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  title="Quitar zapatos"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onSelectCategory('Shoes')}
                className="w-full py-3 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 bg-white/60 dark:bg-neutral-900/60 hover:bg-white dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-[10px] font-medium flex items-center justify-center space-x-2 transition-all hover:scale-105 cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5 text-rose-500" />
                <span>+ Calzado / Zapatillas</span>
              </button>
            )}
          </div>

        </div>

        {/* Mannequin Footer Status Indicator */}
        <div className="relative z-10 w-full pt-3 mt-2 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-[10px] text-neutral-500">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Vista Previa de Silueta</span>
          </span>
          <span className="font-medium text-neutral-700 dark:text-neutral-300">
            Toca cualquier zona para cambiar prenda
          </span>
        </div>

      </div>
    </div>
  );
};
