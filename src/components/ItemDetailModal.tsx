import React, { useState } from 'react';
import { ClothingItem } from '../types';
import { X, Heart, Trash2, Calendar, Tag, ArrowRight, ShieldCheck, Wand2, RefreshCw, Sparkles } from 'lucide-react';
import { removeBackgroundToWhite } from '../lib/imageProcessor';

interface ItemDetailModalProps {
  item: ClothingItem | null;
  isDarkMode: boolean;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onSendToStudio: (item: ClothingItem) => void;
  onUpdateItem?: (item: ClothingItem) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  isDarkMode,
  onClose,
  onToggleFavorite,
  onDeleteItem,
  onSendToStudio,
  onUpdateItem
}) => {
  const [isProcessingBg, setIsProcessingBg] = useState(false);

  if (!item) return null;

  const handleRemoveBg = async () => {
    if (!item || isProcessingBg) return;
    setIsProcessingBg(true);
    try {
      const whiteBgImage = await removeBackgroundToWhite(item.imageUrl);
      const updatedItem = { ...item, imageUrl: whiteBgImage };
      if (onUpdateItem) {
        onUpdateItem(updatedItem);
      }
    } catch (e) {
      console.warn('Error removing background in modal:', e);
    } finally {
      setIsProcessingBg(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col sm:flex-row border transition-all ${
          isDarkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-900'
        }`}
      >
        {/* Always visible floating Close button (Essential for mobile) */}
        <button
          onClick={onClose}
          aria-label="Cerrar modal"
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-50 w-10 h-10 rounded-full bg-black/80 text-white dark:bg-white dark:text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl border border-white/20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Garment Image on Clean Studio Background */}
        <div className="sm:w-1/2 aspect-[3/4] sm:aspect-auto relative overflow-hidden bg-white flex items-center justify-center p-6 border-b sm:border-b-0 sm:border-r border-neutral-200 dark:border-neutral-800">
          <img
            src={item.imageUrl}
            alt={item.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain"
          />

          {/* Remove BG Button overlay */}
          <button
            onClick={handleRemoveBg}
            disabled={isProcessingBg}
            className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-black/90 text-white dark:bg-white dark:text-black text-xs font-medium flex items-center space-x-1.5 hover:opacity-90 transition-opacity shadow-md z-10"
            title="Quitar fondo y poner sobre blanco studio"
          >
            {isProcessingBg ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Wand2 className="w-3.5 h-3.5" />
            )}
            <span>{isProcessingBg ? 'Procesando...' : 'Fondo Blanco'}</span>
          </button>
        </div>

        {/* Right Side: Metadata & Actions */}
        <div className="sm:w-1/2 p-6 flex flex-col justify-between space-y-4 overflow-y-auto">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block">
                  PRENDA SELECCIONADA
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
            <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 pt-1 border-t border-neutral-200 dark:border-neutral-800">
              <span className="px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-[11px] font-medium">
                {item.category}
              </span>
              {item.color && (
                <span className="px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-[11px] font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-current opacity-70" />
                  <span>{item.color}</span>
                </span>
              )}
              <span className="flex items-center space-x-1 text-[11px] text-neutral-400 ml-auto">
                <Calendar className="w-3 h-3" />
                <span>{new Date(item.createdAt).toLocaleDateString('es-ES')}</span>
              </span>
            </div>
          </div>

          {/* Etiquetas Automáticas */}
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Etiquetas Automáticas</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {((item.tags && item.tags.length > 0) ? item.tags : [item.category, item.color, 'Atemporal', 'Estilo'].filter(Boolean) as string[]).map((t, idx) => (
                <span
                  key={idx}
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-full border flex items-center space-x-1 transition-colors ${
                    isDarkMode
                      ? 'border-neutral-800 bg-neutral-900 text-neutral-200'
                      : 'border-neutral-200 bg-neutral-100 text-neutral-800'
                  }`}
                >
                  <Tag className="w-3 h-3 text-neutral-400" />
                  <span>#{t}</span>
                </span>
              ))}
            </div>
          </div>

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
              className="w-full py-3 bg-black text-white dark:bg-white dark:text-black rounded-full font-medium text-xs tracking-wide flex items-center justify-center space-x-2 hover:opacity-90 shadow-sm"
            >
              <span>Combinar en Creador de Outfits</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onToggleFavorite(item.id)}
                className={`flex-1 py-2.5 rounded-full text-xs font-medium border flex items-center justify-center space-x-1.5 transition-colors ${
                  item.isFavorite
                    ? 'bg-rose-500 text-white border-rose-500'
                    : isDarkMode
                    ? 'border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                    : 'border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${item.isFavorite ? 'fill-current' : ''}`} />
                <span>{item.isFavorite ? 'Favorito' : 'Guardar Favorito'}</span>
              </button>

              <button
                onClick={() => {
                  if (confirm('¿Seguro que deseas eliminar esta prenda?')) {
                    onDeleteItem(item.id);
                    onClose();
                  }
                }}
                className="p-2.5 rounded-full border border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:text-rose-500 hover:border-rose-500 transition-colors"
                title="Eliminar prenda"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={onClose}
              className={`w-full py-2.5 rounded-full text-xs font-medium border transition-colors ${
                isDarkMode
                  ? 'border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800'
                  : 'border-neutral-200 text-neutral-600 hover:text-black hover:bg-neutral-100'
              }`}
            >
              Volver al Armario
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
