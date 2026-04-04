export type Screen = 'pic-selection' | 'merging' | 'loading' | 'quiz' | 'exploration' | 'reveal' | 'profile';

export interface QuizOption {
  id: string;
  label: string;
  sublabel?: string;
  hasImage: boolean;
  image?: string;
  imagePosition?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
  layout: 'two-text' | 'four-image' | 'four-image-grid' | 'four-text' | 'four-image-only';
}

export interface StyleProfile {
  name: string;
  description: string;
  brands: string[];
  image?: string;
}

export interface ProductItem {
  id: string;
  brand: string;
  name: string;
  price: string;
  type: 'outfit' | 'product';
  image?: string;
  images?: string[];
  pieces?: ProductItem[];
}

export interface QueueItem {
  id: string;
  brand: string;
  name: string;
  image?: string;
}

export interface BrandSection {
  brand: string;
  clusters: {
    outfit: ProductItem;
    products: ProductItem[];
  }[];
}
