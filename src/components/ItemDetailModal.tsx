import React from 'react';
import { ClothingItem } from '../types';
import { X, Heart, Trash2, Calendar, Tag, ArrowRight, ShieldCheck } from 'lucide-react';

interface ItemDetailModalProps {
  item: ClothingItem | null;
  isDarkMode: boolean;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onSendToStudio: (item: ClothingItem) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  isDarkMode,
  onClose,
  onToggleFavorite,
  onDeleteItem,
  onSendToStudio
}) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className={`w-full max-w-2xl border-tech shadow-2xl overflow-hidden max-h-[90vh] flex flex-col sm:flex-row ${
          isDarkMode ? 'bg-[#0A0A0A] text-[#E5E5E5]' : 'bg-white border-neutral-200 text-neutral-900'
        }`}
      >
        {/* Left Side: Garment Image */}
        <div className="sm:w-1/2 aspect-[3/4] sm:aspect-auto relative overflow-hidden bg-[#151515] flex items-center justify-center">
          <img
            src={item.imageUrl}
            alt={item.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3">
            <span className="tag mono">
              [{item.category.toUpperCase()}]
            </span>
          </div>
        </div>

        {/* Right Side: Metadata & Actions */}
        <div className="sm:w-1/2 p-6 flex flex-col justify-between space-y-4 overflow-y-auto">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block">
                  {item.brand || '@sappy.error'}
                </span>
                <h3 className="font-extrabold text-lg tracking-tight uppercase font-sans">
                  {item.title}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Color & Date */}
            <div className="flex items-center space-x-3 text-xs font-mono text-neutral-500 pt-1 border-t border-neutral-200 dark:border-neutral-800">
              {item.color && <span>COLOR: <strong className="text-neutral-900 dark:text-white">{item.color}</strong></span>}
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{new Date(item.createdAt).toLocaleDateString('es-ES')}</span>
              </span>
            </div>
          </div>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-neutral-500 uppercase">
                ESTILO / TAGS:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className={`text-[10px] font-mono px-2 py-0.5 border ${
                      isDarkMode
                        ? 'border-neutral-800 bg-neutral-950 text-neutral-300'
                        : 'border-neutral-200 bg-neutral-100 text-neutral-700'
                    }`}
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {item.notes && (
            <div className="p-3 border bg-neutral-50 dark:bg-neutral-950/60 border-neutral-200 dark:border-neutral-800 font-mono text-xs text-neutral-600 dark:text-neutral-400">
              <span className="text-[10px] font-bold block text-neutral-500 uppercase mb-1">
                NOTAS DE PRENDA:
              </span>
              <p className="font-sans leading-relaxed">{item.notes}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <button
              onClick={() => {
                onSendToStudio(item);
                onClose();
              }}
              className="w-full py-2.5 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 hover:opacity-90"
            >
              <span>COMBINAR EN CREADOR DE OUTFITS</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onToggleFavorite(item.id)}
                className={`flex-1 py-2 text-xs font-mono font-bold border flex items-center justify-center space-x-1.5 ${
                  item.isFavorite
                    ? 'bg-rose-500 text-white border-rose-500'
                    : isDarkMode
                    ? 'border-neutral-800 text-neutral-300 hover:border-neutral-700'
                    : 'border-neutral-200 text-neutral-700 hover:border-neutral-300'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${item.isFavorite ? 'fill-current' : ''}`} />
                <span>{item.isFavorite ? 'FAVORITO' : 'MARCAR FAVORITO'}</span>
              </button>

              <button
                onClick={() => {
                  if (confirm('¿Seguro que deseas eliminar esta prenda?')) {
                    onDeleteItem(item.id);
                    onClose();
                  }
                }}
                className="p-2 border border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:text-rose-500 hover:border-rose-500 transition-colors"
                title="Eliminar prenda"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
