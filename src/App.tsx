import React, { useState, useEffect } from 'react';
import { ClothingItem, Outfit, ActiveTab } from './types';
import { SEED_ITEMS, SEED_OUTFITS } from './data/seedData';
import {
  getAllItemsDB,
  saveItemDB,
  deleteItemDB,
  getAllOutfitsDB,
  saveOutfitDB,
  deleteOutfitDB
} from './lib/db';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { ClosetView } from './components/ClosetView';
import { UploadView } from './components/UploadView';
import { StudioView } from './components/StudioView';
import { LookbookView } from './components/LookbookView';
import { AiStylistView } from './components/AiStylistView';
import { ItemDetailModal } from './components/ItemDetailModal';
import { Check, AlertCircle } from 'lucide-react';

export default function App() {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('closet');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Modals & Triggers
  const [selectedItemForModal, setSelectedItemForModal] = useState<ClothingItem | null>(null);
  const [preselectedStudioItem, setPreselectedStudioItem] = useState<ClothingItem | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Load Data on Initial Render
  useEffect(() => {
    async function loadData() {
      try {
        let loadedItems = await getAllItemsDB();
        let loadedOutfits = await getAllOutfitsDB();

        // If database is empty, seed with initial @sappy.error items & outfits!
        if (loadedItems.length === 0) {
          for (const item of SEED_ITEMS) {
            await saveItemDB(item);
          }
          loadedItems = SEED_ITEMS;
        }

        if (loadedOutfits.length === 0) {
          for (const outfit of SEED_OUTFITS) {
            await saveOutfitDB(outfit);
          }
          loadedOutfits = SEED_OUTFITS;
        }

        setItems(loadedItems);
        setOutfits(loadedOutfits);
      } catch (err) {
        console.warn('Failed loading data from DB, using fallback seed data:', err);
        setItems(SEED_ITEMS);
        setOutfits(SEED_OUTFITS);
      }
    }

    loadData();
  }, []);

  // Set html element class for dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handlers for Items
  const handleSaveItem = async (newItem: ClothingItem) => {
    await saveItemDB(newItem);
    setItems((prev) => [newItem, ...prev]);
    showToast(`Prenda "${newItem.title}" guardada en el armario.`);
    setActiveTab('closet');
  };

  const handleDeleteItem = async (id: string) => {
    await deleteItemDB(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    showToast('Prenda eliminada correctamente.');
  };

  const handleToggleFavoriteItem = async (id: string) => {
    const target = items.find((i) => i.id === id);
    if (!target) return;

    const updated: ClothingItem = { ...target, isFavorite: !target.isFavorite };
    await saveItemDB(updated);
    setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
  };

  // Handlers for Outfits
  const handleSaveOutfit = async (newOutfit: Outfit) => {
    await saveOutfitDB(newOutfit);
    setOutfits((prev) => [newOutfit, ...prev]);
    showToast(`Outfit "${newOutfit.name}" guardado en el lookbook.`);
    setActiveTab('lookbook');
  };

  const handleDeleteOutfit = async (id: string) => {
    await deleteOutfitDB(id);
    setOutfits((prev) => prev.filter((o) => o.id !== id));
    showToast('Outfit eliminado del lookbook.');
  };

  const handleToggleFavoriteOutfit = async (id: string) => {
    const target = outfits.find((o) => o.id === id);
    if (!target) return;

    const updated: Outfit = { ...target, isFavorite: !target.isFavorite };
    await saveOutfitDB(updated);
    setOutfits((prev) => prev.map((o) => (o.id === id ? updated : o)));
  };

  // Send Item to Studio Slot
  const handleSendToStudio = (item: ClothingItem) => {
    setPreselectedStudioItem(item);
    setActiveTab('studio');
    showToast(`Cargando "${item.title}" en el Creador de Outfits.`);
  };

  // Export / Import Backup Data
  const handleExportData = () => {
    const data = {
      brand: '@sappy.error',
      version: '2.0',
      exportedAt: new Date().toISOString(),
      items,
      outfits
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sappy_error_wardrobe_backup_${Date.now()}.json`;
    a.click();
    showToast('Copia de seguridad descargada exitosamente.');
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed.items)) {
          for (const item of parsed.items) {
            await saveItemDB(item);
          }
          setItems(parsed.items);
        }
        if (Array.isArray(parsed.outfits)) {
          for (const outfit of parsed.outfits) {
            await saveOutfitDB(outfit);
          }
          setOutfits(parsed.outfits);
        }
        showToast('Datos e imágenes importados correctamente.');
      } catch (err) {
        alert('Archivo de copia de seguridad no válido.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        isDarkMode
          ? 'bg-neutral-950 text-neutral-100 selection:bg-white selection:text-neutral-950'
          : 'bg-neutral-50 text-neutral-900 selection:bg-neutral-900 selection:text-white'
      }`}
    >
      {/* Top Brand Header */}
      <Header
        itemCount={items.length}
        outfitCount={outfits.length}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onExportData={handleExportData}
        onImportData={handleImportData}
        onNavigateToUpload={() => setActiveTab('upload')}
      />

      {/* Toast Banner Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-4 py-3 font-mono text-xs font-bold border border-neutral-700 dark:border-neutral-200 shadow-2xl flex items-center space-x-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        {activeTab === 'closet' && (
          <ClosetView
            items={items}
            isDarkMode={isDarkMode}
            onDeleteItem={handleDeleteItem}
            onToggleFavorite={handleToggleFavoriteItem}
            onNavigateToUpload={() => setActiveTab('upload')}
            onSelectItemDetail={(item) => setSelectedItemForModal(item)}
            onSendToStudioSlot={handleSendToStudio}
          />
        )}

        {activeTab === 'upload' && (
          <UploadView
            isDarkMode={isDarkMode}
            onSaveItem={handleSaveItem}
            onCancel={() => setActiveTab('closet')}
          />
        )}

        {activeTab === 'studio' && (
          <StudioView
            items={items}
            isDarkMode={isDarkMode}
            onSaveOutfit={handleSaveOutfit}
            onNavigateToUpload={() => setActiveTab('upload')}
            preselectedItem={preselectedStudioItem}
          />
        )}

        {activeTab === 'lookbook' && (
          <LookbookView
            outfits={outfits}
            isDarkMode={isDarkMode}
            onDeleteOutfit={handleDeleteOutfit}
            onToggleFavorite={handleToggleFavoriteOutfit}
            onNavigateToStudio={() => setActiveTab('studio')}
            onSelectOutfitToStudio={(outfit) => {
              if (outfit.items.top) setPreselectedStudioItem(outfit.items.top);
              setActiveTab('studio');
            }}
          />
        )}

        {activeTab === 'ai-stylist' && (
          <AiStylistView items={items} isDarkMode={isDarkMode} />
        )}
      </main>

      {/* Item Detail Modal */}
      <ItemDetailModal
        item={selectedItemForModal}
        isDarkMode={isDarkMode}
        onClose={() => setSelectedItemForModal(null)}
        onToggleFavorite={handleToggleFavoriteItem}
        onDeleteItem={handleDeleteItem}
        onSendToStudio={handleSendToStudio}
      />

      {/* Mobile-First Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
