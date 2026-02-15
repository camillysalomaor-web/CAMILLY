
import { Phone } from './types';

export const INITIAL_CATALOG: Phone[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    brand: 'Apple',
    price: 8499,
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=800&auto=format&fit=crop',
    specs: {
      display: '6.7" OLED 120Hz',
      processor: 'A17 Pro (3nm)',
      ram: '8GB LPDDR5X',
      storage: '256GB NVMe',
      battery: '4.422 mAh',
      camera: '48MP Periscópio 5x'
    },
    description: 'Titânio Aeroespacial e o chip mais rápido do planeta.',
    rating: 5,
    releaseDate: '2023-09'
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    price: 7999,
    image: 'https://images.unsplash.com/photo-1706530638590-0708f3680255?q=80&w=800&auto=format&fit=crop',
    specs: {
      display: '6.8" Dynamic AMOLED',
      processor: 'Snapdragon 8 Gen 3',
      ram: '12GB',
      storage: '512GB',
      battery: '5.000 mAh',
      camera: '200MP Quad-Camera'
    },
    description: 'O auge da inteligência artificial e fotografia mobile.',
    rating: 4.9,
    releaseDate: '2024-01'
  },
  {
    id: '3',
    name: 'iPhone 14 Pro',
    brand: 'Apple',
    price: 6299,
    image: 'https://images.unsplash.com/photo-1678652197831-2d180705cd2c?q=80&w=800&auto=format&fit=crop',
    specs: {
      display: '6.1" ProMotion',
      processor: 'A16 Bionic',
      ram: '6GB',
      storage: '128GB',
      battery: '3.200 mAh',
      camera: '48MP Main'
    },
    description: 'Compacto, potente e com a revolucionária Dynamic Island.',
    rating: 4.8,
    releaseDate: '2022-09'
  },
  {
    id: '4',
    name: 'Xiaomi 14 Ultra',
    brand: 'Xiaomi',
    price: 6899,
    image: 'https://images.unsplash.com/photo-1711200388126-70e281519d18?q=80&w=800&auto=format&fit=crop',
    specs: {
      display: '6.73" LTPO AMOLED',
      processor: 'Snapdragon 8 Gen 3',
      ram: '16GB',
      storage: '512GB',
      battery: '5.300 mAh',
      camera: '50MP Leica Quad'
    },
    description: 'A câmera profissional que por acaso é um celular.',
    rating: 4.7,
    releaseDate: '2024-02'
  }
];
