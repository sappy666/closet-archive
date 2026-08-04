import React, { useState, useRef } from 'react';
import { Category, CATEGORIES, ClothingItem } from '../types';
import { Camera, Upload, Sparkles, Check, RefreshCw, X, Image as ImageIcon, Wand2, Layers } from 'lucide-react';
import { removeBackgroundToWhite } from '../lib/imageProcessor';

interface UploadViewProps {
  isDarkMode: boolean;
  onSaveItem: (item: ClothingItem) => void;
  onCancel: () => void;
}

export const UploadView: React.FC<UploadViewProps> = ({
  isDarkMode,
  onSaveItem,
  onCancel,
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [category, setCategory] = useState<Category>('Tops');
  const [title, setTitle] = useState('');
  const [color, setColor] = useState('');
  const [brand, setBrand] = useState('@sappy.error');
  const [tagsInput, setTagsInput] = useState('Y2K, Streetwear, Minimal');
  const [notes, setNotes] = useState('');

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [hasRemovedBg, setHasRemovedBg] = useState(false);
  const [autoRemoveBg, setAutoRemoveBg] = useState(true);
  const [aiSuccessMsg, setAiSuccessMsg] = useState<string | null>(null);
  const [useCameraMode, setUseCameraMode] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Process image for background removal and AI analysis
  const processNewImage = async (base64Img: string) => {
    let finalImg = base64Img;

    if (autoRemoveBg) {
      setIsRemovingBg(true);
      try {
        finalImg = await removeBackgroundToWhite(base64Img);
        setHasRemovedBg(true);
      } catch (e) {
        console.warn('Error removing background automatically:', e);
      } finally {
        setIsRemovingBg(false);
      }
    }

    setImageSrc(finalImg);
    analyzeImageWithAI(finalImg);
  };

  // Manual Background Removal trigger
  const handleRemoveBgManual = async () => {
    if (!imageSrc || isRemovingBg) return;
    setIsRemovingBg(true);
    try {
      const whiteBgImg = await removeBackgroundToWhite(imageSrc);
      setImageSrc(whiteBgImg);
      setHasRemovedBg(true);
      setAiSuccessMsg('¡Fondo eliminado! Prenda colocada sobre fondo blanco de estudio.');
    } catch (e) {
      console.warn('Error removing background manually:', e);
    } finally {
      setIsRemovingBg(false);
    }
  };

  // Handle image file selection or camera capture
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        processNewImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  // Live Camera API stream handler
  const startCameraStream = async () => {
    try {
      setUseCameraMode(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.warn('Live camera stream not accessible, using file input fallback:', err);
      setUseCameraMode(false);
      cameraInputRef.current?.click();
    }
  };

  const capturePhotoFromStream = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        stopCameraStream();
        processNewImage(dataUrl);
      }
    }
  };

  const stopCameraStream = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setUseCameraMode(false);
  };

  // Gemini AI Analysis Call
  const analyzeImageWithAI = async (base64Img: string) => {
    setIsAnalyzing(true);
    setAiSuccessMsg(null);
    try {
      const response = await fetch('/api/analyze-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Img,
          hintCategory: category
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.category && CATEGORIES.some((c) => c.id === data.category)) {
          setCategory(data.category);
        }
        if (data.title) setTitle(data.title);
        if (data.color) setColor(data.color);
        if (data.brand) setBrand(data.brand);
        if (data.tags && Array.isArray(data.tags)) {
          setTagsInput(data.tags.join(', '));
        }
        if (data.notes) setNotes(data.notes);

        setAiSuccessMsg('IA detectó la prenda y completó los datos automáticamente.');
      }
    } catch (err) {
      console.warn('Failed AI analysis call:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageSrc) {
      alert('Por favor toma o selecciona una foto de la prenda.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const newItem: ClothingItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: title || `Prenda ${category} @sappy.error`,
      category,
      imageUrl: imageSrc,
      color: color || 'Indefinido',
      brand: brand || '@sappy.error',
      tags: tags.length > 0 ? tags : ['Streetwear', 'Y2K'],
      notes: notes || '',
      isFavorite: false,
      createdAt: Date.now()
    };

    onSaveItem(newItem);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24">
      {/* Title */}
      <div className="border-b pb-4 border-white/10">
        <h2 className="text-2xl sm:text-3xl font-light tracking-tight font-sans">
          Register <span className="text-white/30 font-serif italic">Item</span>
        </h2>
        <p className="text-[10px] mono text-white/40 mt-1">
          IMAGE_CAPTURE // AUTOMATIC GEMINI AI RECOGNITION
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photo Upload Area */}
        <div className="space-y-3">
          <label className="block text-xs font-mono font-bold uppercase tracking-wider">
            1. FOTO DE LA PRENDA
          </label>

          {/* Live Camera Stream */}
          {useCameraMode ? (
            <div className="relative aspect-[3/4] max-w-sm mx-auto bg-black overflow-hidden border border-neutral-800 flex flex-col justify-between">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center space-x-4">
                <button
                  type="button"
                  onClick={capturePhotoFromStream}
                  className="px-5 py-2.5 bg-white text-black font-mono font-bold text-xs flex items-center space-x-2 shadow-lg"
                >
                  <Camera className="w-4 h-4" />
                  <span>CAPTURAR FOTO</span>
                </button>
                <button
                  type="button"
                  onClick={stopCameraStream}
                  className="p-2.5 bg-neutral-900 text-white font-mono text-xs border border-neutral-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : imageSrc ? (
            /* Selected Image Preview */
            <div className="relative aspect-[3/4] max-w-xs mx-auto border overflow-hidden group bg-white dark:bg-[#151515] border-white/20">
              <img
                src={imageSrc}
                alt="Preview"
                className="w-full h-full object-contain p-2"
              />

              {/* White Background Studio Badge */}
              <div className="absolute top-2 left-2 z-10">
                <span className="px-2 py-0.5 text-[9px] mono font-bold bg-white text-black border border-black uppercase">
                  {hasRemovedBg ? 'STUDIO_WHITE_BG' : 'RAW_PHOTO'}
                </span>
              </div>

              {/* Removing BG Overlay Loader */}
              {isRemovingBg && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-white p-4 text-center z-20">
                  <Wand2 className="w-6 h-6 animate-pulse mb-2 text-white" />
                  <p className="mono text-xs font-bold uppercase tracking-wider">
                    REMOVIENDO FONDO...
                  </p>
                  <p className="text-[10px] mono text-white/50 mt-1">
                    Aislando prenda e insertando fondo blanco studio
                  </p>
                </div>
              )}

              {/* AI Overlay Loader */}
              {isAnalyzing && !isRemovingBg && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center text-white p-4 text-center z-20">
                  <RefreshCw className="w-6 h-6 animate-spin mb-2 text-white" />
                  <p className="mono text-xs font-bold uppercase">
                    GEMINI AI ANALIZANDO FOTO...
                  </p>
                  <p className="text-[10px] mono text-white/50 mt-1">
                    Detectando categoría, color y estilo
                  </p>
                </div>
              )}

              {/* Retake and Remove BG buttons */}
              <div className="absolute bottom-2 right-2 left-2 flex flex-wrap gap-1.5 justify-end z-10">
                <button
                  type="button"
                  onClick={handleRemoveBgManual}
                  disabled={isRemovingBg}
                  className="px-2.5 py-1.5 bg-white text-black mono text-[9px] font-bold flex items-center space-x-1 hover:bg-neutral-200 transition-colors shadow-sm"
                  title="Quitar fondo y colocar sobre blanco studio"
                >
                  <Wand2 className="w-3 h-3" />
                  <span>QUITAR FONDO BLANCO</span>
                </button>
                <button
                  type="button"
                  onClick={() => setImageSrc(null)}
                  className="px-2.5 py-1.5 bg-black/80 text-white border border-white/20 mono text-[9px] font-bold hover:bg-black"
                >
                  CAMBIAR
                </button>
              </div>
            </div>
          ) : (
            /* Upload Placeholders */
            <div className={`border-2 border-dashed p-8 text-center transition-colors ${
              isDarkMode
                ? 'border-neutral-800 bg-neutral-900/40 hover:border-neutral-700'
                : 'border-neutral-300 bg-neutral-50 hover:border-neutral-400'
            }`}>
              <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center border border-neutral-300 dark:border-neutral-700 text-neutral-500">
                <Camera className="w-6 h-6" />
              </div>
              <p className="font-mono text-xs font-bold uppercase tracking-wide">
                SUBE O TOMA UNA FOTO DE LA PRENDA
              </p>
              <p className="text-[11px] font-mono text-neutral-500 mt-1 max-w-xs mx-auto">
                Soporta archivos JPG, PNG y WebP. La cámara del dispositivo está integrada.
              </p>

              <div className="mt-5 flex flex-wrap justify-center gap-3">
                {/* Take Photo Button */}
                <button
                  type="button"
                  onClick={startCameraStream}
                  className="px-4 py-2.5 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-mono font-bold text-xs flex items-center space-x-2 hover:opacity-90 transition-opacity"
                >
                  <Camera className="w-4 h-4" />
                  <span>USAR CÁMARA</span>
                </button>

                {/* Upload File Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`px-4 py-2.5 border font-mono font-bold text-xs flex items-center space-x-2 transition-colors ${
                    isDarkMode
                      ? 'border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-white'
                      : 'border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-800'
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>SELECCIONAR GALERÍA</span>
                </button>
              </div>

              {/* Auto Background Removal Setting */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-left max-w-sm mx-auto">
                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoRemoveBg}
                    onChange={(e) => setAutoRemoveBg(e.target.checked)}
                    className="w-4 h-4 accent-white bg-black border-white/20 rounded-none cursor-pointer"
                  />
                  <span className="mono text-[10px] text-white/80">
                    Aislar y poner fondo blanco studio automáticamente
                  </span>
                </label>
              </div>

              {/* Hidden file inputs */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          )}

          {/* AI Banner Message */}
          {aiSuccessMsg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-mono text-xs flex items-center space-x-2">
              <Check className="w-4 h-4 flex-shrink-0" />
              <span>{aiSuccessMsg}</span>
            </div>
          )}
        </div>

        {/* Category Selection */}
        <div className="space-y-3">
          <label className="block text-xs font-mono font-bold uppercase tracking-wider">
            2. SELECCIONA CATEGORÍA DE PRENDA
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {CATEGORIES.map((cat) => {
              const isSelected = category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`p-3 border text-left font-mono transition-all ${
                    isSelected
                      ? isDarkMode
                        ? 'bg-white text-neutral-900 border-white font-bold'
                        : 'bg-neutral-900 text-white border-neutral-900 font-bold'
                      : isDarkMode
                      ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                      : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  <div className="text-[10px] opacity-70">[{cat.code}]</div>
                  <div className="text-xs font-bold mt-0.5">{cat.label}</div>
                  <div className="text-[9px] text-neutral-400 truncate mt-1">
                    {cat.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Details Form Fields */}
        <div className="space-y-4 pt-2">
          <label className="block text-xs font-mono font-bold uppercase tracking-wider">
            3. DETALLES DE LA PRENDA
          </label>

          {/* Title */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400">
                Nombre de la Prenda
              </label>
              {imageSrc && (
                <button
                  type="button"
                  onClick={() => analyzeImageWithAI(imageSrc)}
                  disabled={isAnalyzing}
                  className="text-xs text-neutral-800 dark:text-neutral-200 hover:opacity-80 flex items-center gap-1 font-medium disabled:opacity-50"
                  title="Pedir a Gemini que vuelva a analizar y sugiera un nombre descriptivo en español"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Sugerir Nombre IA (Español)</span>
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. Polera Boxy Fit Negra con Estampado"
                required
                className={`w-full px-4 py-2.5 text-xs rounded-xl border focus:outline-none transition-all ${
                  isDarkMode
                    ? 'bg-neutral-900 border-neutral-800 text-white placeholder-neutral-500 focus:border-white/30'
                    : 'bg-neutral-100 border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-black/30'
                }`}
              />
            </div>
          </div>

          {/* Grid for Color & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-neutral-500 mb-1">
                Color Principal
              </label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="Ej. Negro Mate / Plata"
                className={`w-full px-3 py-2 text-xs font-mono border focus:outline-none focus:ring-1 ${
                  isDarkMode
                    ? 'bg-neutral-900 border-neutral-800 text-white focus:border-white'
                    : 'bg-white border-neutral-200 text-neutral-900 focus:border-neutral-900'
                }`}
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-neutral-500 mb-1">
                Marca / Diseñador
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Ej. @sappy.error"
                className={`w-full px-3 py-2 text-xs font-mono border focus:outline-none focus:ring-1 ${
                  isDarkMode
                    ? 'bg-neutral-900 border-neutral-800 text-white focus:border-white'
                    : 'bg-white border-neutral-200 text-neutral-900 focus:border-neutral-900'
                }`}
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-[11px] font-mono text-neutral-500 mb-1">
              Etiquetas / Tags de Estilo (separadas por coma)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Y2K, Techwear, Oversized, Noche"
              className={`w-full px-3 py-2 text-xs font-mono border focus:outline-none focus:ring-1 ${
                isDarkMode
                  ? 'bg-neutral-900 border-neutral-800 text-white focus:border-white'
                  : 'bg-white border-neutral-200 text-neutral-900 focus:border-neutral-900'
              }`}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[11px] font-mono text-neutral-500 mb-1">
              Notas adicionales (material, fit, cuidados)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Algodón 280gsm con lavado ácido..."
              className={`w-full px-3 py-2 text-xs font-mono border focus:outline-none focus:ring-1 ${
                isDarkMode
                  ? 'bg-neutral-900 border-neutral-800 text-white focus:border-white'
                  : 'bg-white border-neutral-200 text-neutral-900 focus:border-neutral-900'
              }`}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className={`px-4 py-2.5 text-xs font-medium rounded-full border transition-colors ${
              isDarkMode
                ? 'border-neutral-800 text-neutral-400 hover:text-white'
                : 'border-neutral-200 text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!imageSrc}
            className="px-6 py-2.5 bg-black text-white dark:bg-white dark:text-black rounded-full font-semibold text-xs tracking-wide hover:opacity-90 disabled:opacity-40 transition-opacity shadow-sm"
          >
            Guardar Prenda
          </button>
        </div>
      </form>
    </div>
  );
};
