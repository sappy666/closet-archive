import React, { useState, useMemo } from 'react';
import { ClothingItem, Category, CATEGORIES } from '../types';
import { Search, Heart, Trash2, Plus, SlidersHorizontal, Tag, Eye, Sparkles } from 'lucide-react';

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
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(null);

  // Extract all unique smart tags across items
  const allSmartTags = useMemo(() => {
    const tagSet = new Set<string>();
    items.forEach((item) => {
      if (item.tags) {
        item.tags.forEach((t) => tagSet.add(t));
      }
      if (item.color) tagSet.add(item.color);
    });
    return Array.from(tagSet).slice(0, 8); // Top 8 tags
  }, [items]);

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
      const matchesTagFilter =
        !selectedTagFilter ||
        (item.tags && item.tags.includes(selectedTagFilter)) ||
        item.color?.toLowerCase() === selectedTagFilter.toLowerCase();

      return matchesCategory && matchesSearch && matchesFavorite && matchesTagFilter;
    });
  }, [items, selectedCategory, searchQuery, onlyFavorites, selectedTagFilter]);

  // Counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: items.length };
    CATEGORIES.forEach((cat) => {
      counts[cat.id] = items.filter((i) => i.category === cat.id).length;
    });
    return counts;
  }, [items]);

  return (
    <div className="pb-24 space-y-4">
      {/* iOS Horizontal Tab Categories Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 -mx-2 sm:-mx-4 px-2 sm:px-4">
        <div className="flex items-center space-x-6 overflow-x-auto no-scrollbar py-2">
          {[
            { id: 'All', label: 'All' },
            { id: 'Tops', label: 'Tops' },
            { id: 'Bottoms', label: 'Pants' },
            { id: 'Jackets', label: 'Outerwear' },
            { id: 'Shoes', label: 'Shoes' },
            { id: 'Accessories', label: 'Bags & Acc' },
          ].map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`relative pb-2.5 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? isDarkMode
                      ? 'text-white font-semibold'
                      : 'text-black font-semibold'
                    : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
                }`}
              >
                <span>{cat.label}</span>
                {isSelected && (
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-[2px] ${
                      isDarkMode ? 'bg-white' : 'bg-black'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Favorites Filter Bar */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por prenda, color, marca..."
            className={`w-full pl-8 pr-4 py-1.5 text-xs rounded-full border transition-all focus:outline-none ${
              isDarkMode
                ? 'bg-neutral-900 border-neutral-800 text-white placeholder-neutral-500 focus:border-white/30'
                : 'bg-neutral-100 border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-black/30'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-neutral-400 hover:text-black dark:hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        <button
          onClick={() => setOnlyFavorites(!onlyFavorites)}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border cursor-pointer ${
            onlyFavorites
              ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300 font-semibold'
              : isDarkMode
              ? 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:border-neutral-700'
              : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-100'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-current text-rose-500' : ''}`} />
          <span className="text-[11px]">Favoritos ({items.filter((i) => i.isFavorite).length})</span>
        </button>
      </div>

      {/* Smart Tags Filter Pills Bar */}
      {allSmartTags.length > 0 && (
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
          <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1 flex-shrink-0 mr-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Etiquetas IA:</span>
          </span>
          {selectedTagFilter && (
            <button
              onClick={() => setSelectedTagFilter(null)}
              className="px-2 py-0.5 rounded-full text-[10px] bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 font-medium hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors flex-shrink-0"
            >
              Todos
            </button>
          )}
          {allSmartTags.map((tag) => {
            const isSelected = selectedTagFilter === tag;
            return (
              <button
                key={tag}
                onClick={() => setSelectedTagFilter(isSelected ? null : tag)}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium transition-all duration-200 flex-shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                    : isDarkMode
                    ? 'bg-neutral-900/80 text-neutral-400 border border-neutral-800 hover:text-white hover:border-neutral-700'
                    : 'bg-neutral-100 text-neutral-600 border border-neutral-200 hover:text-black hover:border-neutral-300'
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>
      )}

      {/* Main iOS Grid (3 Columns) */}
      {filteredItems.length === 0 ? (
        <div className="py-20 text-center bg-neutral-50 dark:bg-neutral-900/40 rounded-2xl border border-neutral-200 dark:border-neutral-800 my-4">
          <p className="text-xs font-medium text-neutral-500 mb-3">
            No se encontraron prendas en esta categoría.
          </p>
          <button
            onClick={onNavigateToUpload}
            className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-full text-xs font-semibold shadow-sm hover:opacity-90 transition-opacity"
          >
            + Agregar Prenda
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-x-3 gap-y-6 pt-2">
          {filteredItems.map((item) => {
            // Get combined smart tags for card display
            const smartTags = (item.tags && item.tags.length > 0)
              ? item.tags
              : [item.color, item.category].filter(Boolean) as string[];

            return (
              <div
                key={item.id}
                onClick={() => onSelectItemDetail(item)}
                className="group cursor-pointer flex flex-col items-center text-center relative transition-all duration-200"
              >
                {/* Image Container on Pristine White Canvas with smooth hover shadow */}
                <div className="relative w-full aspect-[3/4] bg-white rounded-2xl overflow-hidden p-3 border border-neutral-200/80 dark:border-white/10 flex items-center justify-center shadow-xs transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-0.5">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Favorite Heart Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(item.id);
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 dark:bg-black/70 backdrop-blur-md text-neutral-400 hover:text-rose-500 hover:scale-110 active:scale-95 transition-all shadow-xs"
                    title={item.isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                  >
                    <Heart className={`w-3.5 h-3.5 ${item.isFavorite ? 'fill-current text-rose-500' : ''}`} />
                  </button>
                </div>

                {/* Brand & Title Label */}
                <div className="mt-2 px-1 max-w-full space-y-0.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 truncate group-hover:text-black dark:group-hover:text-white transition-colors">
                    {item.brand || item.title}
                  </p>
                  <p className="text-[10px] text-neutral-400 capitalize truncate">
                    {item.title}
                  </p>

                  {/* Smart Tags Badges (Etiquetas Inteligentes AI) */}
                  {smartTags.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-1 pt-1 max-w-full overflow-hidden">
                      {smartTags.slice(0, 2).map((tag, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-medium bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 border border-neutral-200/60 dark:border-neutral-700/60 truncate max-w-[80px]"
                        >
                          <Sparkles className="w-2 h-2 text-amber-500 flex-shrink-0" />
                          <span className="truncate">{tag}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

