import { ClothingItem, Outfit } from '../types';

export const SEED_ITEMS: ClothingItem[] = [
  // TOPS
  {
    id: 'seed-top-1',
    title: 'Boxy Heavyweight Graphic Tee',
    category: 'Tops',
    imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop',
    color: 'Charcoal Black',
    brand: '@sappy.error',
    tags: ['Y2K', 'Streetwear', 'Oversized', 'Casual'],
    isFavorite: true,
    createdAt: Date.now() - 1000000,
    notes: 'Camiseta de algodón 280gsm con corte boxy fit e impresión serigrafiada sobre blanco studio.'
  },
  {
    id: 'seed-top-2',
    title: 'Deconstructed Thermal Top',
    category: 'Tops',
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop',
    color: 'Off-White',
    brand: '@sappy.error',
    tags: ['Techwear', 'Layering', 'Minimal'],
    isFavorite: false,
    createdAt: Date.now() - 900000,
    notes: 'Textura térmica con costuras expuestas estilo Y2K en fondo aislado.'
  },
  {
    id: 'seed-top-3',
    title: 'Acid Wash Raw Edge Longsleeve',
    category: 'Tops',
    imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop',
    color: 'Washed Grey',
    brand: '@sappy.error',
    tags: ['Distressed', 'Grudge', 'Fall'],
    isFavorite: true,
    createdAt: Date.now() - 850000,
    notes: 'Lavado ácido artesanal con bordes deshilachados.'
  },

  // BOTTOMS
  {
    id: 'seed-bot-1',
    title: 'Metallic Parachute Cargo Pants',
    category: 'Bottoms',
    imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop',
    color: 'Silver Gray',
    brand: '@sappy.error',
    tags: ['Cyber', 'Y2K', 'Parachute', 'Utility'],
    isFavorite: true,
    createdAt: Date.now() - 800000,
    notes: 'Ajuste de cordón en tobillos y múltiples bolsillos tácticos.'
  },
  {
    id: 'seed-bot-2',
    title: 'Baggy Raw Black Denim',
    category: 'Bottoms',
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop',
    color: 'Matte Black',
    brand: '@sappy.error',
    tags: ['Denim', 'Loose Fit', 'Streetwear'],
    isFavorite: false,
    createdAt: Date.now() - 750000,
    notes: 'Corte super holgado para caída libre sobre sneakers.'
  },

  // JACKETS
  {
    id: 'seed-jkt-1',
    title: 'Chrome Cyber Puffer Jacket',
    category: 'Jackets',
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop',
    color: 'Metallic Chrome',
    brand: '@sappy.error',
    tags: ['Winter', 'Statement', 'Futuristic'],
    isFavorite: true,
    createdAt: Date.now() - 700000,
    notes: 'Chaqueta acolchada reflejante térmicamente aislada.'
  },
  {
    id: 'seed-jkt-2',
    title: 'Tactical Double-Zip Hoodie',
    category: 'Jackets',
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop',
    color: 'Pitch Black',
    brand: '@sappy.error',
    tags: ['Zip-Up', 'Heavyweight', 'Everyday'],
    isFavorite: false,
    createdAt: Date.now() - 650000,
    notes: 'Cierre bidireccional metálico con capucha estructurada.'
  },

  // SHOES
  {
    id: 'seed-shoe-1',
    title: 'Matrix Platform Chunky Boots',
    category: 'Shoes',
    imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop',
    color: 'Jet Black',
    brand: '@sappy.error',
    tags: ['Leather', 'Chunky', 'Goth Y2K'],
    isFavorite: true,
    createdAt: Date.now() - 600000,
    notes: 'Suela de goma dentada de 6cm de altura.'
  },
  {
    id: 'seed-shoe-2',
    title: 'Retro Techmesh Runner V1',
    category: 'Shoes',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
    color: 'Silver / Neon Red',
    brand: '@sappy.error',
    tags: ['Sneakers', 'Running', 'Tech'],
    isFavorite: false,
    createdAt: Date.now() - 550000,
    notes: 'Estructura transpirable con detalles reflectantes 3M.'
  },

  // ACCESSORIES
  {
    id: 'seed-acc-1',
    title: 'Cyber Shield Futuristic Sunglasses',
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop',
    color: 'Chrome / Mirror',
    brand: '@sappy.error',
    tags: ['Eyewear', 'Cyber', 'UV400'],
    isFavorite: true,
    createdAt: Date.now() - 500000,
    notes: 'Montura monocromática envuelta con lentes de espejo UV.'
  },
  {
    id: 'seed-acc-2',
    title: 'Modular Crossbody Utility Rig',
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=800&auto=format&fit=crop',
    color: 'Matte Black',
    brand: '@sappy.error',
    tags: ['Bag', 'Utility', 'Cordura'],
    isFavorite: false,
    createdAt: Date.now() - 450000,
    notes: 'Bolsillo táctico desmontable con cinchas de seguridad.'
  }
];

export const SEED_OUTFITS: Outfit[] = [
  {
    id: 'seed-outfit-1',
    name: 'Look 01: Cyber Minimal @sappy.error',
    createdAt: Date.now() - 300000,
    items: {
      top: SEED_ITEMS[0],
      bottom: SEED_ITEMS[3],
      jacket: SEED_ITEMS[5],
      shoes: SEED_ITEMS[7],
      accessory: SEED_ITEMS[9]
    },
    occasion: 'Rave / Night Out',
    notes: 'Combinación icónica de tonos neutros con siluetas holgadas e iluminación reflectante.',
    isFavorite: true,
    aiVibeRating: {
      score: '9.8 / 10',
      title: 'High-Tech Streetwear Perfection',
      comment: 'Proporciones sumamente equilibradas entre la polera boxy y los pantalones de paracaídas. El accesorio cibernético eleva el look al instante.',
      suggestions: 'Probar con botas de plataforma para un aspecto aún más brutalista.'
    }
  },
  {
    id: 'seed-outfit-2',
    name: 'Look 02: Industrial Monochromatic',
    createdAt: Date.now() - 200000,
    items: {
      top: SEED_ITEMS[1],
      bottom: SEED_ITEMS[4],
      jacket: SEED_ITEMS[6],
      shoes: SEED_ITEMS[8],
      accessory: SEED_ITEMS[10]
    },
    occasion: 'Diario / Casual Tech',
    notes: 'Look todo negro estructurado para la ciudad.',
    isFavorite: false,
    aiVibeRating: {
      score: '9.3 / 10',
      title: 'Clean Tactical Uniform',
      comment: 'Súper limpio y pulido. El contraste entre telas mate y brillante le da dinamismo sin sobrecargar.',
      suggestions: 'Añadir un gorro beannie o cadena para acentuar el cuello.'
    }
  }
];
