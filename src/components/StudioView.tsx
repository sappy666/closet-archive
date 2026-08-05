import React, { useState } from 'react';
import { ClothingItem, Outfit, CATEGORIES, Category } from '../types';
import { Sparkles, Shuffle, Save, X, Plus, ChevronRight, Check, Heart, HelpCircle, User } from 'lucide-react';
import { MannequinCanvas } from './MannequinCanvas';

interface StudioViewProps {
  items: ClothingItem[];
  isDarkMode: boolean;
  onSaveOutfit: (outfit: Outfit) => void;
  onNavigateToUpload: () => void;
  preselectedItem?: ClothingItem | null;
}

export const StudioView: React.FC<StudioViewProps> = ({
  items,
  isDarkMode,
  onSaveOutfit,
  onNavigateToUpload,
  preselectedItem
}) => {
  // Selected items per slot
  const [selectedTop, setSelectedTop] = useState<ClothingItem | undefined>(
    preselectedItem?.category === 'Tops' ? preselectedItem : items.find((i) => i.category === 'Tops')
  );
  const [selectedBottom, setSelectedBottom] = useState<ClothingItem | undefined>(
    preselectedItem?.category === 'Bottoms' ? preselectedItem : items.find((i) => i.category === 'Bottoms')
  );
  const [selectedJacket, setSelectedJacket] = useState<ClothingItem | undefined>(
    preselectedItem?.category === 'Jackets' ? preselectedItem : items.find((i) => i.category === 'Jackets')
  );
  const [selectedShoes, setSelectedShoes] = useState<ClothingItem | undefined>(
    preselectedItem?.category === 'Shoes' ? preselectedItem : items.find((i) => i.category === 'Shoes')
  );
  const [selectedAccessory, setSelectedAccessory] = useState<ClothingItem | undefined>(
    preselectedItem?.category === 'Accessories' ? preselectedItem : items.find((i) => i.category === 'Accessories')
  );

  // Active slot picker state
  const [activePickerCategory, setActivePickerCategory] = useState<Category | null>(null);

  // Outfit metadata form
  const [outfitName, setOutfitName] = useState(`Look ${Math.floor(Math.random() * 90 + 10)} @sappy.error`);
  const [occasion, setOccasion] = useState('Rave / Night Out');
  const [notes, setNotes] = useState('');

  // AI Vibe Check state
  const [isVibeChecking, setIsVibeChecking] = useState(false);
  const [vibeResult, setVibeResult] = useState<{
    score: string;
    title: string;
    comment: string;
    suggestions: string;
    recommendedOccasion: string;
  } | null>(null);

  // Layout mode (mannequin vs vertical vs horizontal)
  const [layoutMode, setLayoutMode] = useState<'mannequin' | 'vertical' | 'horizontal'>('mannequin');

  const handleRemoveCategory = (cat: Category) => {
    if (cat === 'Tops') setSelectedTop(undefined);
    if (cat === 'Bottoms') setSelectedBottom(undefined);
    if (cat === 'Jackets') setSelectedJacket(undefined);
    if (cat === 'Shoes') setSelectedShoes(undefined);
    if (cat === 'Accessories') setSelectedAccessory(undefined);
  };

  // Helper to randomize combination
  const handleRandomize = () => {
    const getRandom = (cat: Category) => {
      const catItems = items.filter((i) => i.category === cat);
      if (catItems.length === 0) return undefined;
      return catItems[Math.floor(Math.random() * catItems.length)];
    };

    setSelectedTop(getRandom('Tops'));
    setSelectedBottom(getRandom('Bottoms'));
    setSelectedJacket(getRandom('Jackets'));
    setSelectedShoes(getRandom('Shoes'));
    setSelectedAccessory(getRandom('Accessories'));
    setVibeResult(null);
  };

  // Helper to clear slots
  const handleClearSlots = () => {
    setSelectedTop(undefined);
    setSelectedBottom(undefined);
    setSelectedJacket(undefined);
    setSelectedShoes(undefined);
    setSelectedAccessory(undefined);
    setVibeResult(null);
  };

  // Run Gemini AI Vibe Check
  const handleRunVibeCheck = async () => {
    const activeItems = {
      top: selectedTop,
      bottom: selectedBottom,
      jacket: selectedJacket,
      shoes: selectedShoes,
      accessory: selectedAccessory
    };

    if (!Object.values(activeItems).some(Boolean)) {
      alert('Por favor selecciona al menos una prenda para el Vibe Check.');
      return;
    }

    setIsVibeChecking(true);
    try {
      const response = await fetch('/api/style-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: activeItems })
      });

      if (response.ok) {
        const data = await response.json();
        setVibeResult(data);
        if (data.recommendedOccasion) {
          setOccasion(data.recommendedOccasion);
        }
      }
    } catch (err) {
      console.warn('Error running AI vibe check:', err);
    } finally {
      setIsVibeChecking(false);
    }
  };

  // Save outfit handler
  const handleSaveOutfit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTop && !selectedBottom && !selectedJacket && !selectedShoes && !selectedAccessory) {
      alert('Selecciona al menos una prenda para guardar el outfit.');
      return;
    }

    const newOutfit: Outfit = {
      id: `outfit-${Date.now()}`,
      name: outfitName || 'Look @sappy.error',
      createdAt: Date.now(),
      items: {
        top: selectedTop,
        bottom: selectedBottom,
        jacket: selectedJacket,
        shoes: selectedShoes,
        accessory: selectedAccessory
      },
      occasion,
      notes,
      isFavorite: true,
      aiVibeRating: vibeResult ? {
        score: vibeResult.score,
        title: vibeResult.title,
        comment: vibeResult.comment,
        suggestions: vibeResult.suggestions
      } : undefined
    };

    onSaveOutfit(newOutfit);
  };

  // Get items for active slot picker
  const pickerItems = activePickerCategory
    ? items.filter((i) => i.category === activePickerCategory)
    : [];

  const slots: { id: Category; label: string; item?: ClothingItem; setter: (item?: ClothingItem) => void }[] = [
    { id: 'Jackets', label: 'JACKET / ABRIGO', item: selectedJacket, setter: setSelectedJacket },
    { id: 'Tops', label: 'TOP / CAMISETA', item: selectedTop, setter: setSelectedTop },
    { id: 'Bottoms', label: 'BOTTOM / PANTALÓN', item: selectedBottom, setter: setSelectedBottom },
    { id: 'Shoes', label: 'SHOES / ZAPATOS', item: selectedShoes, setter: setSelectedShoes },
    { id: 'Accessories', label: 'ACCESORIO', item: selectedAccessory, setter: setSelectedAccessory },
  ];

  return (
    <div className="space-y-6 pb-28">
      {/* Title & Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b pb-4 border-white/10">
        <div>
          <h2 className="text-2xl sm:text-3xl font-light tracking-tight font-sans">
            Outfit <span className="text-white/30 font-serif italic">Studio</span>
          </h2>
          <p className="text-[10px] mono text-white/40 mt-1">
            ACTIVE_SELECTION // LAYERING & SILHOUETTE BUILDER
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRandomize}
            className={`px-3 py-1.5 text-[10px] mono font-bold border flex items-center space-x-1.5 transition-colors ${
              isDarkMode
                ? 'bg-[#151515] border-white/10 text-white hover:border-white/30'
                : 'bg-white border-neutral-300 text-neutral-900 hover:bg-neutral-100'
            }`}
            title="Generar combinación aleatoria"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>RANDOMIZE</span>
          </button>

          <button
            onClick={handleRunVibeCheck}
            disabled={isVibeChecking}
            className="px-3 py-1.5 bg-white text-black font-mono font-bold text-[10px] flex items-center space-x-1.5 hover:bg-neutral-200 transition-colors disabled:opacity-50"
            title="Evaluar combinación con IA"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isVibeChecking ? 'animate-spin' : ''}`} />
            <span>AI VIBE CHECK</span>
          </button>

          <button
            onClick={handleClearSlots}
            className={`p-1.5 border text-white/40 hover:text-white ${
              isDarkMode ? 'border-white/10 bg-[#151515]' : 'border-neutral-200 bg-white'
            }`}
            title="Limpiar combinación"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* AI Vibe Check Result Card */}
      {vibeResult && (
        <div className="p-4 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-500/40 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="font-mono text-xs font-bold text-indigo-300 uppercase">
                VEREDICTO @sappy.error STYLIST
              </span>
            </div>
            <span className="px-2 py-0.5 bg-indigo-500 text-white font-mono text-xs font-extrabold">
              {vibeResult.score}
            </span>
          </div>

          <h4 className="font-bold text-sm tracking-tight">{vibeResult.title}</h4>
          <p className="text-xs text-neutral-300 leading-relaxed font-sans">{vibeResult.comment}</p>

          {vibeResult.suggestions && (
            <p className="text-[11px] font-mono text-indigo-300 pt-1 border-t border-indigo-500/20">
              💡 PRO TIP: {vibeResult.suggestions}
            </p>
          )}
        </div>
      )}

      {/* Outfit Combination Canvas & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Outfit Canvas */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="font-semibold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-500" />
              <span>PROYECTOR DE VISTA Y SILUETA</span>
            </span>
            <div className="flex space-x-1 bg-neutral-100 dark:bg-neutral-800/80 p-0.5 rounded-full text-[10px]">
              <button
                type="button"
                onClick={() => setLayoutMode('mannequin')}
                className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer ${
                  layoutMode === 'mannequin'
                    ? 'bg-black text-white dark:bg-white dark:text-black font-semibold shadow-xs'
                    : 'text-neutral-500 hover:text-black dark:hover:text-white'
                }`}
              >
                👤 Maniquí
              </button>
              <button
                type="button"
                onClick={() => setLayoutMode('vertical')}
                className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer ${
                  layoutMode === 'vertical'
                    ? 'bg-black text-white dark:bg-white dark:text-black font-semibold shadow-xs'
                    : 'text-neutral-500 hover:text-black dark:hover:text-white'
                }`}
              >
                Vertical
              </button>
              <button
                type="button"
                onClick={() => setLayoutMode('horizontal')}
                className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer ${
                  layoutMode === 'horizontal'
                    ? 'bg-black text-white dark:bg-white dark:text-black font-semibold shadow-xs'
                    : 'text-neutral-500 hover:text-black dark:hover:text-white'
                }`}
              >
                Mosaico
              </button>
            </div>
          </div>

          {/* Canvas Display Mode */}
          {layoutMode === 'mannequin' ? (
            <MannequinCanvas
              selectedTop={selectedTop}
              selectedBottom={selectedBottom}
              selectedJacket={selectedJacket}
              selectedShoes={selectedShoes}
              selectedAccessory={selectedAccessory}
              onSelectCategory={(cat) => setActivePickerCategory(cat)}
              onRemoveCategory={handleRemoveCategory}
              isDarkMode={isDarkMode}
            />
          ) : (
            <div className={`p-4 rounded-2xl border transition-colors ${
              isDarkMode ? 'bg-neutral-900/60 border-neutral-800' : 'bg-neutral-100/70 border-neutral-200'
            }`}>
              <div className={layoutMode === 'vertical' ? 'space-y-3 max-w-sm mx-auto' : 'grid grid-cols-2 gap-3'}>
                {slots.map((slot) => {
                  const item = slot.item;
                  return (
                    <div
                      key={slot.id}
                      onClick={() => setActivePickerCategory(slot.id)}
                      className={`relative rounded-2xl border group cursor-pointer transition-all overflow-hidden flex items-center justify-between ${
                        item
                          ? isDarkMode
                            ? 'bg-neutral-900 border-neutral-700 hover:border-white'
                            : 'bg-white border-neutral-200 hover:border-black/30 shadow-xs'
                          : isDarkMode
                          ? 'bg-neutral-900/40 border-dashed border-neutral-800 hover:border-neutral-700'
                          : 'bg-white/60 border-dashed border-neutral-300 hover:border-neutral-400'
                      }`}
                    >
                      {/* Item Thumbnail & Details */}
                      {item ? (
                        <div className="flex items-center space-x-3 w-full p-2.5">
                          <div className="w-16 h-20 bg-white rounded-xl flex-shrink-0 overflow-hidden border border-neutral-200 dark:border-white/10 p-1 flex items-center justify-center">
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="flex-1 min-w-0 pr-2">
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 uppercase tracking-wide">
                              {slot.id}
                            </span>
                            <h4 className="font-semibold text-xs truncate mt-1.5">{item.brand || item.title}</h4>
                            {item.color && (
                              <p className="text-[10px] text-neutral-400 truncate">
                                {item.color}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              slot.setter(undefined);
                            }}
                            className="p-1.5 rounded-full text-neutral-400 hover:text-rose-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                            title="Remover slot"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        /* Empty Slot State */
                        <div className="w-full p-4 flex items-center justify-between text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200">
                          <div className="flex items-center space-x-2">
                            <Plus className="w-4 h-4" />
                            <span className="text-xs font-medium uppercase tracking-wider">
                              Seleccionar {slot.label}
                            </span>
                          </div>
                          <ChevronRight className="w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Save Outfit Form */}
        <div className="lg:col-span-5 space-y-4">
          <form
            onSubmit={handleSaveOutfit}
            className={`p-5 border-tech space-y-4 ${
              isDarkMode ? 'bg-[#0D0D0D]' : 'bg-white border-neutral-200'
            }`}
          >
            <h3 className="mono text-[10px] text-white/40 mb-4 border-b border-white/10 pb-2 flex items-center justify-between">
              <span>Outfit_Studio / active_selection</span>
              <Save className="w-3.5 h-3.5" />
            </h3>

            {/* Name Input */}
            <div>
              <label className="block text-[9px] mono text-white/40 mb-1">
                LOOK_IDENTIFIER / NAME
              </label>
              <input
                type="text"
                value={outfitName}
                onChange={(e) => setOutfitName(e.target.value)}
                placeholder='e.g. "Look_01.blk"'
                required
                className={`w-full px-3 py-2 text-[11px] mono border focus:outline-none ${
                  isDarkMode
                    ? 'bg-[#151515] border-white/10 text-white focus:border-white/40'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-neutral-900'
                }`}
              />
            </div>

            {/* Occasion */}
            <div>
              <label className="block text-[9px] mono text-white/40 mb-1">
                OCCASION_TAG
              </label>
              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className={`w-full px-3 py-2 text-[11px] mono border focus:outline-none ${
                  isDarkMode
                    ? 'bg-[#151515] border-white/10 text-white focus:border-white/40'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-neutral-900'
                }`}
              >
                <option value="Rave / Night Out">Rave / Night Out</option>
                <option value="Diario / Streetwear">Diario / Streetwear</option>
                <option value="Evento Editorial / Galería">Evento Editorial / Galería</option>
                <option value="Casual Cyber Minimal">Casual Cyber Minimal</option>
                <option value="Winter Layering">Winter Layering</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-[9px] mono text-white/40 mb-1">
                ARCHIVAL_NOTES
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Layering specs, chain accessories..."
                className={`w-full px-3 py-2 text-[11px] mono border focus:outline-none ${
                  isDarkMode
                    ? 'bg-[#151515] border-white/10 text-white focus:border-white/40'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-neutral-900'
                }`}
              />
            </div>

            {/* Save Button */}
            <button
              type="submit"
              className="w-full py-4 bg-white text-black mono text-xs font-bold tracking-widest hover:bg-neutral-200 transition-colors flex items-center justify-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>SAVE OUTFIT</span>
            </button>
          </form>
        </div>
      </div>

      {/* Category Item Picker Drawer/Modal */}
      {activePickerCategory && (
        <div
          onClick={() => setActivePickerCategory(null)}
          className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-xl max-h-[85vh] flex flex-col border shadow-2xl overflow-hidden rounded-t-3xl sm:rounded-3xl transition-all ${
              isDarkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-900'
            }`}
          >
            {/* Modal Header */}
            <div className="p-4 border-b flex items-center justify-between border-neutral-200 dark:border-neutral-800">
              <div>
                <span className="text-[10px] font-mono uppercase text-neutral-400">
                  SELECCIONAR PRENDA
                </span>
                <h3 className="font-bold text-sm uppercase font-sans">
                  {activePickerCategory} ({pickerItems.length})
                </h3>
              </div>
              <button
                onClick={() => setActivePickerCategory(null)}
                className="w-9 h-9 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:text-black dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Picker Content List */}
            <div className="p-4 overflow-y-auto space-y-3 flex-1">
              {pickerItems.length === 0 ? (
                <div className="py-8 text-center space-y-3">
                  <p className="text-xs text-neutral-500">
                    No tienes prendas registradas en la categoría {activePickerCategory}.
                  </p>
                  <button
                    onClick={() => {
                      setActivePickerCategory(null);
                      onNavigateToUpload();
                    }}
                    className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-full text-xs font-semibold shadow-sm hover:opacity-90"
                  >
                    + SUBIR PRENDA AHORA
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {pickerItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        const targetSlot = slots.find((s) => s.id === activePickerCategory);
                        if (targetSlot) targetSlot.setter(item);
                        setActivePickerCategory(null);
                        setVibeResult(null);
                      }}
                      className={`group border cursor-pointer rounded-2xl overflow-hidden transition-all ${
                        isDarkMode
                          ? 'bg-neutral-950 border-neutral-800 hover:border-white'
                          : 'bg-neutral-50 border-neutral-200 hover:border-black/30'
                      }`}
                    >
                      <div className="aspect-[3/4] overflow-hidden bg-white p-2 flex items-center justify-center">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="p-2.5">
                        <h4 className="font-semibold text-xs truncate">{item.brand || item.title}</h4>
                        {item.color && (
                          <p className="text-[10px] text-neutral-400 truncate">
                            {item.color}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Close Button for Mobile */}
            <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/90">
              <button
                onClick={() => setActivePickerCategory(null)}
                className={`w-full py-2.5 rounded-full text-xs font-semibold border transition-colors ${
                  isDarkMode
                    ? 'border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                    : 'border-neutral-200 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                Volver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
