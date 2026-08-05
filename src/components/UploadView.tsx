import React, { useState, useRef } from 'react';
import { Category, CATEGORIES, ClothingItem } from '../types';
import { Camera, Upload, Sparkles, Check, RefreshCw, X, Image as ImageIcon, Wand2, Layers, ArrowLeft } from 'lucide-react';
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
  const [brand, setBrand] = useState('');
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

        setAiSuccessMsg('Reconocimiento automático completó los datos de la prenda.');
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
      title: title || `Prenda ${category}`,
      category,
      imageUrl: imageSrc,
      color: color || 'Indefinido',
      brand: brand || undefined,
      tags: tags.length > 0 ? tags : ['Atemporal', 'Minimal'],
      notes: notes || '',
      isFavorite: false,
      createdAt: Date.now()
    };

    onSaveItem(newItem);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24">
      {/* Top Mobile Back Navigation Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
        <button
          type="button"
          onClick={onCancel}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
            isDarkMode
              ? 'bg-neutral-900 border-neutral-800 text-neutral-200 hover:text-white hover:bg-neutral-800'
              : 'bg-neutral-100 border-neutral-200 text-neutral-800 hover:text-black hover:bg-neutral-200'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Armario</span>
        </button>
        <span className="text-xs font-medium text-neutral-400">
          Nueva Prenda
        </span>
      </div>

      {/* Title */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Agregar <span className="font-serif italic text-neutral-500 font-normal">Prenda</span>
        </h2>
        <p className="text-xs text-neutral-500 mt-1">
          Sube una foto. El reconocimiento automático detectará categoría, color y etiquetas en segundos.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photo Upload Area */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
            1. Foto de la Prenda
          </label>

          {/* Live Camera Stream */}
          {useCameraMode ? (
            <div className="relative aspect-[3/4] max-w-sm mx-auto bg-black rounded-2xl overflow-hidden border border-neutral-800 flex flex-col justify-between shadow-lg">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center space-x-3">
                <button
                  type="button"
                  onClick={capturePhotoFromStream}
                  className="px-5 py-2.5 bg-white text-black rounded-full font-semibold text-xs flex items-center space-x-2 shadow-lg cursor-pointer hover:bg-neutral-200 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                  <span>Tomar Foto</span>
                </button>
                <button
                  type="button"
                  onClick={stopCameraStream}
                  className="p-2.5 bg-neutral-900/90 text-white rounded-full border border-neutral-700 hover:bg-neutral-800 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : imageSrc ? (
            /* Selected Image Preview */
            <div className="relative aspect-[3/4] max-w-xs mx-auto border rounded-2xl overflow-hidden group bg-white dark:bg-[#151515] border-neutral-200 dark:border-neutral-800 shadow-md">
              <img
                src={imageSrc}
                alt="Vista previa"
                className="w-full h-full object-contain p-3"
              />

              {/* White Background Studio Badge */}
              <div className="absolute top-3 left-3 z-10">
                <span className="px-2.5 py-1 text-[10px] font-semibold bg-white/90 dark:bg-black/80 backdrop-blur-md text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 rounded-full shadow-xs">
                  {hasRemovedBg ? 'Fondo Blanco Studio' : 'Foto Original'}
                </span>
              </div>

              {/* Removing BG Overlay Loader */}
              {isRemovingBg && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4 text-center z-20 space-y-2">
                  <Wand2 className="w-6 h-6 animate-pulse text-amber-400" />
                  <p className="text-xs font-semibold">
                    Aislando prenda...
                  </p>
                  <p className="text-[10px] text-neutral-300">
                    Removiendo fondo para recortar en alta calidad
                  </p>
                </div>
              )}

              {/* AI Overlay Loader */}
              {isAnalyzing && !isRemovingBg && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4 text-center z-20 space-y-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
                  <p className="text-xs font-semibold">
                    Analizando prenda...
                  </p>
                  <p className="text-[10px] text-neutral-300">
                    Detectando automáticamente detalles y categoría
                  </p>
                </div>
              )}

              {/* Retake and Remove BG buttons */}
              <div className="absolute bottom-3 right-3 left-3 flex flex-wrap gap-1.5 justify-end z-10">
                <button
                  type="button"
                  onClick={handleRemoveBgManual}
                  disabled={isRemovingBg}
                  className="px-3 py-1.5 bg-white text-black text-[10px] font-semibold rounded-full flex items-center space-x-1 hover:bg-neutral-200 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                  title="Quitar fondo y colocar sobre blanco studio"
                >
                  <Wand2 className="w-3 h-3 text-amber-500" />
                  <span>Quitar Fondo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setImageSrc(null)}
                  className="px-3 py-1.5 bg-black/80 text-white rounded-full text-[10px] font-semibold hover:bg-black transition-colors cursor-pointer"
                >
                  Cambiar Foto
                </button>
              </div>
            </div>
          ) : (
            /* Upload Placeholders */
            <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
              isDarkMode
                ? 'border-neutral-800 bg-neutral-900/30 hover:border-neutral-700'
                : 'border-neutral-200 bg-neutral-50/80 hover:border-neutral-300'
            }`}>
              <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 shadow-2xs">
                <Camera className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                Arrastra una foto aquí o selecciona tu opción preferida
              </p>
              <p className="text-[11px] text-neutral-500 mt-1 max-w-xs mx-auto">
                Admite JPG, PNG y WebP. También puedes usar la cámara de tu dispositivo.
              </p>

              <div className="mt-5 flex flex-wrap justify-center gap-3">
                {/* Take Photo Button */}
                <button
                  type="button"
                  onClick={startCameraStream}
                  className="px-4 py-2.5 bg-black text-white dark:bg-white dark:text-black rounded-full font-semibold text-xs flex items-center space-x-2 hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
                >
                  <Camera className="w-4 h-4" />
                  <span>Usar Cámara</span>
                </button>

                {/* Upload File Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`px-4 py-2.5 rounded-full border font-semibold text-xs flex items-center space-x-2 transition-colors cursor-pointer ${
                    isDarkMode
                      ? 'border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-white'
                      : 'border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-800'
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Abrir Galería</span>
                </button>
              </div>

              {/* Auto Background Removal Setting */}
              <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-left max-w-sm mx-auto">
                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoRemoveBg}
                    onChange={(e) => setAutoRemoveBg(e.target.checked)}
                    className="w-4 h-4 accent-black dark:accent-white rounded cursor-pointer"
                  />
                  <span className="text-xs text-neutral-600 dark:text-neutral-400">
                    Aislar prenda y colocar fondo blanco automáticamente
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
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
            2. Selecciona la Categoría
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {CATEGORIES.map((cat) => {
              const isSelected = category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? isDarkMode
                        ? 'bg-white text-black border-white font-semibold shadow-xs'
                        : 'bg-black text-white border-black font-semibold shadow-xs'
                      : isDarkMode
                      ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                      : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300 hover:text-black'
                  }`}
                >
                  <div className="text-xs font-semibold">{cat.label}</div>
                  <div className="text-[10px] opacity-70 truncate mt-0.5">
                    {cat.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Details Form Fields */}
        <div className="space-y-4 pt-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
            3. Detalles de la Prenda
          </label>

          {/* Title */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                Nombre de la Prenda
              </label>
              {imageSrc && (
                <button
                  type="button"
                  onClick={() => analyzeImageWithAI(imageSrc)}
                  disabled={isAnalyzing}
                  className="text-xs text-neutral-800 dark:text-neutral-200 hover:opacity-80 flex items-center gap-1 font-medium disabled:opacity-50 cursor-pointer"
                  title="Sugerir nombre automático según categoría y color"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Sugerir Nombre Automático</span>
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
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Color Principal
              </label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="Ej. Negro, Plata, Azul Denim"
                className={`w-full px-3.5 py-2.5 text-xs rounded-xl border transition-all focus:outline-none ${
                  isDarkMode
                    ? 'bg-neutral-900 border-neutral-800 text-white placeholder-neutral-500 focus:border-white/30'
                    : 'bg-neutral-100 border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-black/30'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Marca / Creador (Opcional)
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Ej. Zara, Vintage, Hecho a mano"
                className={`w-full px-3.5 py-2.5 text-xs rounded-xl border transition-all focus:outline-none ${
                  isDarkMode
                    ? 'bg-neutral-900 border-neutral-800 text-white placeholder-neutral-500 focus:border-white/30'
                    : 'bg-neutral-100 border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-black/30'
                }`}
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Etiquetas de Estilo (separadas por coma)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Ej. Minimal, Oversized, Noche, Atemporal"
              className={`w-full px-3.5 py-2.5 text-xs rounded-xl border transition-all focus:outline-none ${
                isDarkMode
                  ? 'bg-neutral-900 border-neutral-800 text-white placeholder-neutral-500 focus:border-white/30'
                  : 'bg-neutral-100 border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-black/30'
              }`}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Notas Adicionales (Opcional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Algodón de alto gramaje, talle holgado..."
              className={`w-full px-3.5 py-2.5 text-xs rounded-xl border transition-all focus:outline-none ${
                isDarkMode
                  ? 'bg-neutral-900 border-neutral-800 text-white placeholder-neutral-500 focus:border-white/30'
                  : 'bg-neutral-100 border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-black/30'
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
