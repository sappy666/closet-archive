import React, { useState, useMemo } from 'react';
import { Outfit } from '../types';
import { Heart, Trash2, Sparkles, Calendar, Tag, ArrowUpRight, Layers } from 'lucide-react';

interface LookbookViewProps {
  outfits: Outfit[];
  isDarkMode: boolean;
  onDeleteOutfit: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onNavigateToStudio: () => void;
  onSelectOutfitToStudio?: (outfit: Outfit) => void;
}

export const LookbookView: React.FC<LookbookViewProps> = ({
  outfits,
  isDarkMode,
  onDeleteOutfit,
  onToggleFavorite,
  onNavigateToStudio,
  onSelectOutfitToStudio
}) => {
  const [filterOccasion, setFilterOccasion] = useState<string>('All');

  const occasions = useMemo(() => {
    const list = new Set<string>();
    outfits.forEach((o) => {
      if (o.occasion) list.add(o.occasion);
    });
    return Array.from(list);
  }, [outfits]);

  const filteredOutfits = useMemo(() => {
    return outfits.filter((o) => {
      return filterOccasion === 'All' || o.occasion === filterOccasion;
    });
  }, [outfits, filterOccasion]);

  return (
    <div className="space-y-6 pb-24">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b pb-4 border-white/10">
        <div>
          <h2 className="text-2xl sm:text-3xl font-light tracking-tight font-sans">
            Saved <span className="text-white/30 font-serif italic">Lookbook</span>
          </h2>
          <p className="text-[10px] mono text-white/40 mt-1">
            SAVED_OUTFITS // [{filteredOutfits.length} SILHOUETTES COMBINED]
          </p>
        </div>

        <button
          onClick={onNavigateToStudio}
          className="px-4 py-2 bg-white text-black text-[10px] mono font-bold hover:bg-neutral-200 transition-colors flex items-center justify-center space-x-1.5"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>+ CREATE LOOK</span>
        </button>
      </div>

      {/* Occasion Filter Pills */}
      {occasions.length > 0 && (
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setFilterOccasion('All')}
            className={`px-3 py-1.5 text-xs font-mono whitespace-nowrap border transition-all ${
              filterOccasion === 'All'
                ? isDarkMode
                  ? 'bg-white text-neutral-900 border-white font-bold'
                  : 'bg-neutral-900 text-white border-neutral-900 font-bold'
                : isDarkMode
                ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                : 'bg-neutral-100 border-neutral-200 text-neutral-600 hover:text-neutral-900'
            }`}
          >
            TODAS LAS OCASIONES ({outfits.length})
          </button>
          {occasions.map((occ) => (
            <button
              key={occ}
              onClick={() => setFilterOccasion(occ)}
              className={`px-3 py-1.5 text-xs font-mono whitespace-nowrap border transition-all ${
                filterOccasion === occ
                  ? isDarkMode
                    ? 'bg-white text-neutral-900 border-white font-bold'
                    : 'bg-neutral-900 text-white border-neutral-900 font-bold'
                  : isDarkMode
                  ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                  : 'bg-neutral-100 border-neutral-200 text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {occ.toUpperCase()} ({outfits.filter((o) => o.occasion === occ).length})
            </button>
          ))}
        </div>
      )}

      {/* Outfits Grid */}
      {filteredOutfits.length === 0 ? (
        <div className={`p-12 text-center rounded-2xl border border-dashed ${
          isDarkMode ? 'border-neutral-800 bg-neutral-900/30' : 'border-neutral-300 bg-neutral-50/50'
        }`}>
          <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 font-mono text-sm">
            SE
          </div>
          <h3 className="font-semibold text-sm tracking-wide">No hay outfits guardados</h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            Combina tus prendas registradas en el Creador de Outfits y guárdalas aquí.
          </p>
          <button
            onClick={onNavigateToStudio}
            className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-full text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            <Layers className="w-4 h-4" />
            <span>Ir al Creador</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredOutfits.map((outfit) => {
            const itemEntries = Object.entries(outfit.items).filter(([_, item]) => Boolean(item));

            return (
              <div
                key={outfit.id}
                className={`rounded-2xl border p-4 transition-all space-y-4 flex flex-col justify-between shadow-xs ${
                  isDarkMode
                    ? 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
                    : 'bg-white border-neutral-200/80 hover:border-black/30'
                }`}
              >
                {/* Outfit Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-sm tracking-tight">
                        {outfit.name}
                      </h3>
                      {outfit.aiVibeRating?.score && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-indigo-600 text-white uppercase">
                          {outfit.aiVibeRating.score}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-[10px] text-neutral-400 mt-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(outfit.createdAt).toLocaleDateString('es-ES')}</span>
                      {outfit.occasion && (
                        <>
                          <span>•</span>
                          <span className="uppercase font-medium text-neutral-500">{outfit.occasion}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleFavorite(outfit.id)}
                    className={`p-1.5 rounded-full transition-colors ${
                      outfit.isFavorite ? 'text-rose-500' : 'text-neutral-400 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${outfit.isFavorite ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Grid of Garment Thumbnails in Outfit */}
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  {['jacket', 'top', 'bottom', 'shoes', 'accessory'].map((slotKey) => {
                    const item = (outfit.items as any)[slotKey];
                    return (
                      <div
                        key={slotKey}
                        className={`aspect-[3/4] rounded-xl border overflow-hidden relative flex flex-col items-center justify-center p-1 ${
                          item
                            ? 'bg-white border-neutral-200 dark:border-white/20'
                            : 'bg-neutral-50 dark:bg-neutral-950/40 border-dashed border-neutral-200 dark:border-neutral-800'
                        }`}
                      >
                        {item ? (
                          <>
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-contain"
                            />
                            <span className="absolute bottom-0 inset-x-0 bg-black/80 text-white text-[7px] text-center py-0.5 truncate px-1 font-medium">
                              {slotKey.toUpperCase()}
                            </span>
                          </>
                        ) : (
                          <span className="text-[8px] text-neutral-400 uppercase font-medium">
                            {slotKey}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* AI Commentary or Notes */}
                {outfit.aiVibeRating?.comment && (
                  <div className="p-3 bg-neutral-950/40 border border-neutral-800 font-mono text-[11px] text-neutral-300 space-y-1">
                    <div className="flex items-center space-x-1 text-indigo-400 font-bold text-[10px]">
                      <Sparkles className="w-3 h-3" />
                      <span>{outfit.aiVibeRating.title || 'EVALUACIÓN DE ESTILO'}</span>
                    </div>
                    <p className="text-neutral-400 font-sans text-xs">{outfit.aiVibeRating.comment}</p>
                  </div>
                )}

                {/* Card Footer Actions */}
                <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                  {onSelectOutfitToStudio && (
                    <button
                      onClick={() => onSelectOutfitToStudio(outfit)}
                      className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
                    >
                      <span>CARGAR EN STUDIO</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  )}
                  <button
                    onClick={() => onDeleteOutfit(outfit.id)}
                    className="p-1 text-neutral-400 hover:text-rose-500 transition-colors ml-auto"
                    title="Eliminar outfit"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
