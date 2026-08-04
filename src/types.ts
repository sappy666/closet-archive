export type Category = 'Tops' | 'Bottoms' | 'Jackets' | 'Shoes' | 'Accessories';

export interface CategoryInfo {
  id: Category;
  label: string;
  code: string;
  description: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { id: 'Tops', label: 'Tops', code: 'TOP', description: 'Camisetas, camisas, tops, corsets' },
  { id: 'Bottoms', label: 'Bottoms', code: 'BOT', description: 'Pantalones, shorts, faldas, cargo' },
  { id: 'Jackets', label: 'Jackets', code: 'JKT', description: 'Chaquetones, abrigos, sweaters, puffers' },
  { id: 'Shoes', label: 'Shoes', code: 'SHOE', description: 'Zapatillas, botas, zapatos, plataformas' },
  { id: 'Accessories', label: 'Accessories', code: 'ACC', description: 'Bolsos, gorros, lentes, joyería' },
];

export interface ClothingItem {
  id: string;
  title: string;
  category: Category;
  imageUrl: string; // Base64 or URL
  color?: string;
  brand?: string;
  tags?: string[];
  isFavorite?: boolean;
  createdAt: number;
  notes?: string;
}

export interface Outfit {
  id: string;
  name: string;
  createdAt: number;
  items: {
    top?: ClothingItem;
    bottom?: ClothingItem;
    jacket?: ClothingItem;
    shoes?: ClothingItem;
    accessory?: ClothingItem;
  };
  occasion?: string;
  notes?: string;
  isFavorite?: boolean;
  aiVibeRating?: {
    score: string;
    title: string;
    comment: string;
    suggestions: string;
  };
}

export type ActiveTab = 'closet' | 'studio' | 'upload' | 'lookbook' | 'ai-stylist';

export interface AIAnalysisResult {
  category: Category;
  title: string;
  color: string;
  brand?: string;
  tags: string[];
  notes?: string;
}

export interface AIStyleAdviceResult {
  score: string;
  title: string;
  comment: string;
  suggestions: string;
  recommendedOccasion: string;
}
