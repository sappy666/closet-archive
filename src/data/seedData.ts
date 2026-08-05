import { ClothingItem, Outfit } from '../types';

export const SEED_ITEMS: ClothingItem[] = [
  // TOPS
  {
    id: 'seed-top-1',
    title: 'Chaleco Sastreado Blanco Rayas',
    category: 'Tops',
    imageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=800&auto=format&fit=crop',
    color: 'Blanco / Negro',
    tags: ['Sastrería', 'Elegante', 'Minimal', 'Atemporal'],
    isFavorite: true,
    createdAt: Date.now() - 1000000,
    notes: 'Chaleco de botones con cuello en V en fondo blanco studio aislado.'
  },
  {
    id: 'seed-top-2',
    title: 'Polera Algodón Minimalista',
    category: 'Tops',
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop',
    color: 'Blanco Marfil',
    tags: ['Básico', 'Casual', 'Minimal'],
    isFavorite: false,
    createdAt: Date.now() - 900000,
    notes: 'Corte recto en algodón orgánico de tacto suave.'
  },
  {
    id: 'seed-top-3',
    title: 'Polera Oversized Carbón',
    category: 'Tops',
    imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop',
    color: 'Negro Carbón',
    tags: ['Oversized', 'Urbano', 'Casual'],
    isFavorite: true,
    createdAt: Date.now() - 850000,
    notes: 'Algodón pesado de caída fluida.'
  },

  // BOTTOMS
  {
    id: 'seed-bot-1',
    title: 'Pantalón Sastre Holgado Gray',
    category: 'Bottoms',
    imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop',
    color: 'Gris Claro',
    tags: ['Formal', 'Sastrería', 'Elegante'],
    isFavorite: true,
    createdAt: Date.now() - 800000,
    notes: 'Caída recta con pinzas frontales.'
  },
  {
    id: 'seed-bot-2',
    title: 'Pantalón Negro Recto',
    category: 'Bottoms',
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop',
    color: 'Negro Mateo',
    tags: ['Denim', 'Básico', 'Atemporal'],
    isFavorite: false,
    createdAt: Date.now() - 750000,
    notes: 'Textura mate de ajuste clásico.'
  },

  // JACKETS
  {
    id: 'seed-jkt-1',
    title: 'Abrigo Sastreado Estructurado',
    category: 'Jackets',
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop',
    color: 'Camel / Beige',
    tags: ['Invierno', 'Elegante', 'Sastrería'],
    isFavorite: true,
    createdAt: Date.now() - 700000,
    notes: 'Lana fina con solapas pronunciadas.'
  },
  {
    id: 'seed-jkt-2',
    title: 'Chaqueta Bomber Minimalista',
    category: 'Jackets',
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop',
    color: 'Negro',
    tags: ['Urbano', 'Casual', 'Atemporal'],
    isFavorite: false,
    createdAt: Date.now() - 650000,
    notes: 'Cierre metálico frontal y puños acanalados.'
  },

  // SHOES
  {
    id: 'seed-shoe-1',
    title: 'Zapatillas Blancas Minimal',
    category: 'Shoes',
    imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop',
    color: 'Blanco Puro',
    tags: ['Zapatillas', 'Básico', 'Urban'],
    isFavorite: true,
    createdAt: Date.now() - 600000,
    notes: 'Cuero liso con suela tonificada.'
  },
  {
    id: 'seed-shoe-2',
    title: 'Botines de Cuero Negro',
    category: 'Shoes',
    imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop',
    color: 'Negro',
    tags: ['Cuero', 'Elegante', 'Noche'],
    isFavorite: false,
    createdAt: Date.now() - 550000,
    notes: 'Acabado pulido con tacón estructurado.'
  },

  // ACCESSORIES
  {
    id: 'seed-acc-1',
    title: 'Lentes de Sol Arquitectónicos',
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop',
    color: 'Negro / Cristal',
    tags: ['Lentes', 'Minimal', 'Verano'],
    isFavorite: true,
    createdAt: Date.now() - 500000,
    notes: 'Montura geométrica negra.'
  },
  {
    id: 'seed-acc-2',
    title: 'Bolso Estructurado de Mano',
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
    color: 'Negro Matizado',
    tags: ['Bolso', 'Cuero', 'Accesorio'],
    isFavorite: false,
    createdAt: Date.now() - 450000,
    notes: 'Diseño minimalista con herrajes plateados.'
  }
];

export const SEED_OUTFITS: Outfit[] = [
  {
    id: 'seed-outfit-1',
    name: 'Look 01: Sastrería Contemporánea',
    createdAt: Date.now() - 300000,
    items: {
      top: SEED_ITEMS[0],
      bottom: SEED_ITEMS[3],
      jacket: SEED_ITEMS[5],
      shoes: SEED_ITEMS[7],
      accessory: SEED_ITEMS[9]
    },
    occasion: 'Evento / Noche',
    notes: 'Combinación fluida de sastrería clara con acentos oscuros.',
    isFavorite: true,
    aiVibeRating: {
      score: '9.8 / 10',
      title: 'Equilibrio de Proporciones Excelente',
      comment: 'Líneas limpias y armonía de tonos neutros. El chaleco de rayas sobre el abrigo camel otorga sofisticación sin esfuerzo.',
      suggestions: 'Puedes prescindir del abrigo para un look de día más fresco.'
    }
  },
  {
    id: 'seed-outfit-2',
    name: 'Look 02: Monocromo Elegante',
    createdAt: Date.now() - 200000,
    items: {
      top: SEED_ITEMS[1],
      bottom: SEED_ITEMS[4],
      jacket: SEED_ITEMS[6],
      shoes: SEED_ITEMS[8],
      accessory: SEED_ITEMS[10]
    },
    occasion: 'Diario / Casual Chic',
    notes: 'Look sobrio en gama oscura para la ciudad.',
    isFavorite: false,
    aiVibeRating: {
      score: '9.3 / 10',
      title: 'Estilo Sobrio e Impactante',
      comment: 'Limpio y atemporal. El contraste de texturas mantiene el interés visual.',
      suggestions: 'Añadir un pañuelo o accesorio de contraste si deseas más luz.'
    }
  }
];
