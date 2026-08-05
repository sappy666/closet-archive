import React, { useState } from 'react';
import { ClothingItem, Category } from '../types';
import { Plus, X, Sparkles, User } from 'lucide-react';

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
  const [modelPose, setModelPose] = useState<'runway' | 'editorial'>('runway');

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
            <span>Maniquí Blanco Studio</span>
            <span className="px-2 py-0.5 text-[10px] font-mono rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-semibold">
              {equippedCount}/5 Prendas
            </span>
          </h3>
        </div>

        {/* Pose selector */}
        <div className="flex items-center space-x-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-full text-[11px] font-medium">
          <button
            type="button"
            onClick={() => setModelPose('runway')}
            className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
              modelPose === 'runway'
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs font-semibold'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Pasarela
          </button>
          <button
            type="button"
            onClick={() => setModelPose('editorial')}
            className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
              modelPose === 'editorial'
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs font-semibold'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Editorial
          </button>
        </div>
      </div>

      {/* Main Interactive Mannequin Stage */}
      <div className="relative w-full max-w-md mx-auto min-h-[560px] rounded-2xl bg-gradient-to-b from-white via-neutral-50 to-neutral-100/80 dark:from-neutral-950 dark:via-neutral-900/90 dark:to-neutral-950 border border-neutral-200 dark:border-neutral-800 p-4 flex flex-col items-center justify-between overflow-hidden shadow-inner">
        
        {/* Full-length White Glossy Mannequin SVG Render (matching Image 2) */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-2 opacity-80 dark:opacity-60">
          <svg
            viewBox="0 0 200 450"
            className="h-full w-auto filter drop-shadow-xl"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Glossy White Gradient */}
              <linearGradient id="whiteGloss" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="45%" stopColor="#f3f4f6" />
                <stop offset="85%" stopColor="#e5e7eb" />
                <stop offset="100%" stopColor="#d1d5db" />
              </linearGradient>
              <linearGradient id="glossHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
              </linearGradient>
              {/* Studio Ground Shadow */}
              <radialGradient id="groundShadow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#000000" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Floor Oval Shadow */}
            <ellipse cx="100" cy="425" rx="45" ry="8" fill="url(#groundShadow)" />

            {/* Glossy White Full Body Silhouette */}
            <g id="mannequinBody">
              {/* Oval Smooth Head */}
              <path
                d="M100 25 C112 25 120 35 120 52 C120 68 112 78 100 78 C88 78 80 68 80 52 C80 35 88 25 100 25 Z"
                fill="url(#whiteGloss)"
                stroke="#e5e7eb"
                strokeWidth="1"
              />
              {/* Head Gloss Reflection */}
              <path
                d="M96 30 C106 30 112 36 112 48 C108 38 100 34 94 36 Z"
                fill="url(#glossHighlight)"
              />

              {/* Neck */}
              <path d="M94 75 L94 88 C94 90 106 90 106 88 L106 75 Z" fill="url(#whiteGloss)" />

              {/* Shoulders, Bust, Ribcage & Torso */}
              <path
                d="M100 88 
                   C75 92 62 102 62 125 
                   C62 142 70 155 76 172 
                   C82 188 80 205 76 225 
                   L124 225 
                   C120 205 118 188 124 172 
                   C130 155 138 142 138 125 
                   C138 102 125 92 100 88 Z"
                fill="url(#whiteGloss)"
                stroke="#d1d5db"
                strokeWidth="0.8"
              />

              {/* Torso Gloss Highlights */}
              <path
                d="M85 96 C70 105 68 125 72 145 C76 130 80 110 92 102 Z"
                fill="url(#glossHighlight)"
              />

              {/* Hips & Pelvis */}
              <path
                d="M76 220 C72 238 70 255 78 275 L122 275 C130 255 128 238 124 220 Z"
                fill="url(#whiteGloss)"
                stroke="#d1d5db"
                strokeWidth="0.8"
              />

              {/* Left Leg (Walking Pose Forward like Image 2) */}
              <path
                d="M80 270 C76 300 78 335 82 365 C84 385 86 405 88 420 L94 420 C92 400 90 380 88 355 C88 330 90 300 96 270 Z"
                fill="url(#whiteGloss)"
                stroke="#d1d5db"
                strokeWidth="0.8"
              />

              {/* Right Leg (Slightly behind in stride) */}
              <path
                d="M104 270 C110 300 112 330 112 355 C112 375 110 395 108 415 L114 415 C118 395 120 375 118 350 C116 325 118 295 120 270 Z"
                fill="url(#whiteGloss)"
                stroke="#cbd5e1"
                strokeWidth="0.8"
              />

              {/* Left Arm (Elegant relaxed posture) */}
              <path
                d="M62 105 C54 125 50 150 48 175 C47 195 48 215 52 230 L56 228 C53 212 52 195 53 172 C55 150 60 128 66 110 Z"
                fill="url(#whiteGloss)"
              />

              {/* Right Arm */}
              <path
                d="M138 105 C146 125 150 150 152 175 C153 195 152 215 148 230 L144 228 C147 212 148 195 147 172 C145 150 140 128 134 110 Z"
                fill="url(#whiteGloss)"
              />
            </g>
          </svg>
        </div>

        {/* Interactive Clothing Overlay Stack */}
        <div className="relative z-10 w-full space-y-3 my-auto flex flex-col items-center">
          
          {/* Layer 1: Accessories */}
          <div className="w-full flex justify-center">
            {selectedAccessory ? (
              <div className="relative group bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md rounded-xl p-2 border border-neutral-200 dark:border-white/10 shadow-lg transition-all hover:scale-105 max-w-[170px] flex items-center space-x-2">
                <img
                  src={selectedAccessory.imageUrl}
                  alt={selectedAccessory.title}
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 object-contain rounded-md bg-white p-0.5"
                />
                <div className="flex-1 min-w-0 text-left">
                  <span className="text-[9px] font-bold uppercase text-indigo-600 dark:text-indigo-400 block">Accesorio</span>
                  <p className="text-[10px] font-semibold truncate text-neutral-800 dark:text-neutral-200">
                    {selectedAccessory.title}
                  </p>
                </div>
                <button
                  onClick={() => onRemoveCategory('Accessories')}
                  className="p-1 text-neutral-400 hover:text-rose-500 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  title="Quitar"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onSelectCategory('Accessories')}
                className="px-3.5 py-1.5 rounded-full border border-dashed border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xs hover:bg-white dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-[10px] font-medium flex items-center space-x-1.5 transition-all hover:scale-105 cursor-pointer shadow-xs"
              >
                <Plus className="w-3 h-3 text-indigo-500" />
                <span>+ Agregar Accesorio</span>
              </button>
            )}
          </div>

          {/* Layer 2: Outerwear & Top */}
          <div className="w-full grid grid-cols-2 gap-2 max-w-[300px]">
            {/* Jacket Slot */}
            {selectedJacket ? (
              <div className="relative group bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md rounded-xl p-2 border border-neutral-200 dark:border-white/10 shadow-lg transition-all hover:scale-105 flex flex-col items-center text-center">
                <span className="text-[8px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
                  Abrigo / Chaqueta
                </span>
                <img
                  src={selectedJacket.imageUrl}
                  alt={selectedJacket.title}
                  referrerPolicy="no-referrer"
                  className="w-20 h-24 object-contain rounded-md bg-white p-1"
                />
                <p className="text-[10px] font-semibold truncate w-full mt-1 text-neutral-800 dark:text-neutral-200">
                  {selectedJacket.title}
                </p>
                <button
                  onClick={() => onRemoveCategory('Jackets')}
                  className="absolute top-1 right-1 p-1 text-neutral-400 hover:text-rose-500 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  title="Quitar"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onSelectCategory('Jackets')}
                className="h-28 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xs hover:bg-white dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-[10px] font-medium flex flex-col items-center justify-center space-y-1 transition-all hover:scale-105 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-amber-500" />
                <span>+ Chaqueta</span>
              </button>
            )}

            {/* Top Slot */}
            {selectedTop ? (
              <div className="relative group bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md rounded-xl p-2 border border-neutral-200 dark:border-white/10 shadow-lg transition-all hover:scale-105 flex flex-col items-center text-center">
                <span className="text-[8px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                  Top / Camiseta
                </span>
                <img
                  src={selectedTop.imageUrl}
                  alt={selectedTop.title}
                  referrerPolicy="no-referrer"
                  className="w-20 h-24 object-contain rounded-md bg-white p-1"
                />
                <p className="text-[10px] font-semibold truncate w-full mt-1 text-neutral-800 dark:text-neutral-200">
                  {selectedTop.title}
                </p>
                <button
                  onClick={() => onRemoveCategory('Tops')}
                  className="absolute top-1 right-1 p-1 text-neutral-400 hover:text-rose-500 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  title="Quitar"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onSelectCategory('Tops')}
                className="h-28 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xs hover:bg-white dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-[10px] font-medium flex flex-col items-center justify-center space-y-1 transition-all hover:scale-105 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-500" />
                <span>+ Top / Polera</span>
              </button>
            )}
          </div>

          {/* Layer 3: Bottom */}
          <div className="w-full flex justify-center max-w-[300px]">
            {selectedBottom ? (
              <div className="relative group w-full bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md rounded-xl p-2.5 border border-neutral-200 dark:border-white/10 shadow-lg transition-all hover:scale-105 flex items-center space-x-3">
                <img
                  src={selectedBottom.imageUrl}
                  alt={selectedBottom.title}
                  referrerPolicy="no-referrer"
                  className="w-16 h-20 object-contain rounded-md bg-white p-1 flex-shrink-0"
                />
                <div className="flex-1 min-w-0 text-left">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 block">
                    Pantalón / Falda
                  </span>
                  <p className="text-xs font-semibold truncate text-neutral-800 dark:text-neutral-200 mt-0.5">
                    {selectedBottom.title}
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
                  title="Quitar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onSelectCategory('Bottoms')}
                className="w-full py-5 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xs hover:bg-white dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-[10px] font-medium flex items-center justify-center space-x-2 transition-all hover:scale-105 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-purple-500" />
                <span>+ Pantalón / Falda</span>
              </button>
            )}
          </div>

          {/* Layer 4: Shoes */}
          <div className="w-full flex justify-center max-w-[300px]">
            {selectedShoes ? (
              <div className="relative group w-full bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md rounded-xl p-2 border border-neutral-200 dark:border-white/10 shadow-lg transition-all hover:scale-105 flex items-center space-x-3">
                <img
                  src={selectedShoes.imageUrl}
                  alt={selectedShoes.title}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 object-contain rounded-md bg-white p-1 flex-shrink-0"
                />
                <div className="flex-1 min-w-0 text-left">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 block">
                    Calzado
                  </span>
                  <p className="text-xs font-semibold truncate text-neutral-800 dark:text-neutral-200">
                    {selectedShoes.title}
                  </p>
                </div>
                <button
                  onClick={() => onRemoveCategory('Shoes')}
                  className="p-1.5 text-neutral-400 hover:text-rose-500 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  title="Quitar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onSelectCategory('Shoes')}
                className="w-full py-3.5 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xs hover:bg-white dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-[10px] font-medium flex items-center justify-center space-x-2 transition-all hover:scale-105 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-rose-500" />
                <span>+ Calzado</span>
              </button>
            )}
          </div>

        </div>

        {/* Mannequin Footer Status */}
        <div className="relative z-10 w-full pt-3 mt-2 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-[10px] text-neutral-500">
          <span className="flex items-center gap-1 font-medium">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Maniquí Blanco de Prueba</span>
          </span>
          <span className="font-medium text-neutral-700 dark:text-neutral-300">
            Presiona para cambiar prenda
          </span>
        </div>

      </div>
    </div>
  );
};

