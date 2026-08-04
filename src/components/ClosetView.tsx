import React, { useState, useMemo } from 'react';
import { ClothingItem, Category, CATEGORIES } from '../types';
import { Search, Heart, Trash2, Plus, SlidersHorizontal, Tag, Eye } from 'lucide-react';

interface ClosetViewProps {
  items: ClothingItem[];
  isDarkMode: boolean;
  onDeleteItem: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onNavigateToUpload: () => void;
  onSelectItemDetail: (item: ClothingItem) => void;
  onSendToStudioSlot?: (item: ClothingItem) => void;
}

export const ClosetView: React.FC<ClosetViewProps> = ({
  items,
  isDarkMode,
  onDeleteItem,
  onToggleFavorite,
  onNavigateToUpload,
  onSelectItemDetail,
  onSendToStudioSlot
}) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        searchQuery === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.color && item.color.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.brand && item.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.tags && item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
      const matchesFavorite = !onlyFavorites || item.isFavorite;

      return matchesCategory && matchesSearch && matchesFavorite;
    });
  }, [items, selectedCategory, searchQuery, onlyFavorites]);

  // Counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: items.length };
    CATEGORIES.forEach((cat) => {
      counts[cat.id] = items.filter((i) => i.category === cat.id).length;
    });
    return counts;
  }, [items]);

  return (
    <div className="space-y-6 pb-24">
      {/* Top Banner / Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b pb-4 border-white/10">
        <div>
          <h2 className="text-2xl sm:text-3xl font-light tracking-tight font-sans">
            Closet <span className="text-white/30 font-serif italic">Archive</span>
          </h2>
          <p className="text-[10px] mono text-white/40 mt-1">
            DIGITAL_COLLECTION // [{filteredItems.length} ITEMS ARCHIVED]
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToUpload}
            className="px-4 py-2 bg-white text-black text-[10px] mono font-bold hover:bg-neutral-200 transition-colors"
          >
            + ADD ITEM
          </button>
        </div>
      </div>

      {/* Main Closet Layout with Vertical Category Bar on Desktop */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Vertical/Horizontal Categories */}
        <div className="md:w-36 flex-shrink-0 flex flex-row md:flex-col overflow-x-auto md:overflow-visible border-b md:border-b-0 md:border-r border-white/10">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-3 text-left mono text-[10px] font-semibold border-b border-white/10 transition-colors whitespace-nowrap ${
              selectedCategory === 'All'
                ? 'bg-white text-black font-bold'
                : 'text-white/60 hover:bg-white/5'
            }`}
          >
            ALL_ITEMS ({categoryCounts['All'] || 0})
          </button>

          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-3 text-left mono text-[10px] font-semibold border-b border-white/10 transition-colors whitespace-nowrap flex items-center justify-between ${
                  isSelected
                    ? 'bg-white text-black font-bold'
                    : 'text-white/60 hover:bg-white/5'
                }`}
              >
                <span>{cat.label}</span>
                <span className="opacity-40 text-[9px]">[{categoryCounts[cat.id] || 0}]</span>
              </button>
            );
          })}
        </div>

        {/* Right Section: Search & Item Grid */}
        <div className="flex-1 space-y-4">
          {/* Search & Favorites Toggle */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search archive by title, color, tag..."
                className={`w-full pl-9 pr-4 py-2 text-[11px] mono border focus:outline-none transition-colors ${
                  isDarkMode
                    ? 'bg-[#0D0D0D] border-white/10 text-white placeholder-white/30 focus:border-white/40'
                    : 'bg-white border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:border-neutral-900'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] mono text-white/40 hover:text-white"
                >
                  CLEAR
                </button>
              )}
            </div>

            <button
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`flex items-center justify-center space-x-2 px-3 py-2 text-[10px] mono border transition-colors ${
                onlyFavorites
                  ? 'bg-rose-500 text-white border-rose-500 font-bold'
                  : isDarkMode
                  ? 'bg-[#0D0D0D] border-white/10 text-white/70 hover:border-white/30'
                  : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-400'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-current' : ''}`} />
              <span>SAVED ({items.filter((i) => i.isFavorite).length})</span>
            </button>
          </div>

          {/* Items Grid */}
          {filteredItems.length === 0 ? (
            <div className={`p-12 text-center border-tech ${
              isDarkMode ? 'bg-[#0D0D0D]' : 'bg-neutral-50'
            }`}>
              <span className="mono text-xs text-white/40 block mb-2">[ARCHIVE_EMPTY]</span>
              <p className="text-xs mono text-neutral-400 max-w-sm mx-auto">
                No items match the current archive query.
              </p>
              <button
                onClick={onNavigateToUpload}
                className="mt-4 px-4 py-2 bg-white text-black text-[10px] mono font-bold"
              >
                + ADD ITEM TO ARCHIVE
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredItems.map((item) => {
                const catInfo = CATEGORIES.find((c) => c.id === item.category);

                return (
                  <div
                    key={item.id}
                    className={`closet-item group border-tech hover:active-glow transition-all flex flex-col justify-between p-2 ${
                      isDarkMode ? 'bg-[#151515]' : 'bg-white'
                    }`}
                  >
                    {/* Tag Badge */}
                    <span className="tag mono">
                      {catInfo?.code || item.category}
                    </span>

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(item.id);
                      }}
                      className={`absolute top-2 left-2 z-10 p-1 text-[10px] transition-colors ${
                        item.isFavorite ? 'text-rose-500' : 'text-white/30 hover:text-white'
                      }`}
                      title={item.isFavorite ? 'Remove favorite' : 'Save favorite'}
                    >
                      <Heart className={`w-3.5 h-3.5 ${item.isFavorite ? 'fill-current' : ''}`} />
                    </button>

                    {/* Image Box */}
                    <div
                      onClick={() => onSelectItemDetail(item)}
                      className="relative w-full aspect-[3/4] overflow-hidden bg-white/5 cursor-pointer mt-5 mb-2 flex items-center justify-center"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-2 py-1 bg-white text-black text-[9px] mono font-bold flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>VIEW</span>
                        </span>
                      </div>
                    </div>

                    {/* Meta Footer */}
                    <div className="space-y-1">
                      <span
                        onClick={() => onSelectItemDetail(item)}
                        className="mono text-[9px] text-white/80 truncate block cursor-pointer hover:underline"
                        title={item.title}
                      >
                        {item.title}
                      </span>

                      <div className="flex items-center justify-between text-[9px] mono text-white/40 pt-1 border-t border-white/5">
                        {onSendToStudioSlot && (
                          <button
                            onClick={() => onSendToStudioSlot(item)}
                            className="text-white/60 hover:text-white hover:underline"
                          >
                            + STUDIO
                          </button>
                        )}
                        <button
                          onClick={() => onDeleteItem(item.id)}
                          className="hover:text-rose-500 transition-colors ml-auto"
                          title="Delete item"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
