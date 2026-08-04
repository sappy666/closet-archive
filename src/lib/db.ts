import { ClothingItem, Outfit } from '../types';

const DB_NAME = 'sappy_error_wardrobe_db';
const DB_VERSION = 1;
const STORE_ITEMS = 'clothing_items';
const STORE_OUTFITS = 'outfits';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_ITEMS)) {
        db.createObjectStore(STORE_ITEMS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_OUTFITS)) {
        db.createObjectStore(STORE_OUTFITS, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Clothing Items DB operations
export async function getAllItemsDB(): Promise<ClothingItem[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_ITEMS, 'readonly');
      const store = transaction.objectStore(STORE_ITEMS);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result as ClothingItem[]);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('IndexedDB failed, falling back to localStorage for items:', err);
    const local = localStorage.getItem('sappy_items');
    return local ? JSON.parse(local) : [];
  }
}

export async function saveItemDB(item: ClothingItem): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_ITEMS, 'readwrite');
      const store = transaction.objectStore(STORE_ITEMS);
      const request = store.put(item);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('IndexedDB save failed, using localStorage:', err);
    const existing = await getAllItemsDB();
    const idx = existing.findIndex((i) => i.id === item.id);
    if (idx >= 0) existing[idx] = item;
    else existing.unshift(item);
    localStorage.setItem('sappy_items', JSON.stringify(existing));
  }
}

export async function deleteItemDB(id: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_ITEMS, 'readwrite');
      const store = transaction.objectStore(STORE_ITEMS);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('IndexedDB delete failed, using localStorage:', err);
    const existing = await getAllItemsDB();
    const filtered = existing.filter((i) => i.id !== id);
    localStorage.setItem('sappy_items', JSON.stringify(filtered));
  }
}

// Outfits DB operations
export async function getAllOutfitsDB(): Promise<Outfit[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_OUTFITS, 'readonly');
      const store = transaction.objectStore(STORE_OUTFITS);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result as Outfit[]);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('IndexedDB failed, falling back to localStorage for outfits:', err);
    const local = localStorage.getItem('sappy_outfits');
    return local ? JSON.parse(local) : [];
  }
}

export async function saveOutfitDB(outfit: Outfit): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_OUTFITS, 'readwrite');
      const store = transaction.objectStore(STORE_OUTFITS);
      const request = store.put(outfit);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('IndexedDB save outfit failed:', err);
    const existing = await getAllOutfitsDB();
    const idx = existing.findIndex((o) => o.id === outfit.id);
    if (idx >= 0) existing[idx] = outfit;
    else existing.unshift(outfit);
    localStorage.setItem('sappy_outfits', JSON.stringify(existing));
  }
}

export async function deleteOutfitDB(id: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_OUTFITS, 'readwrite');
      const store = transaction.objectStore(STORE_OUTFITS);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('IndexedDB delete outfit failed:', err);
    const existing = await getAllOutfitsDB();
    const filtered = existing.filter((o) => o.id !== id);
    localStorage.setItem('sappy_outfits', JSON.stringify(filtered));
  }
}
