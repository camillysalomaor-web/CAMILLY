
export interface Phone {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  specs: {
    display: string;
    processor: string;
    ram: string;
    storage: string;
    battery: string;
    camera: string;
  };
  description: string;
  rating: number;
  releaseDate: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface CompareState {
  phone1: Phone | null;
  phone2: Phone | null;
}

export interface SiteSettings {
  whatsapp: string;
  instagram: string;
  siteName: string;
  logo: string | null;
}
