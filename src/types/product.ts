export type ProductAvailability = "available" | "custom" | "unavailable";

export interface ProductImage {
  src: string;
  alt: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  description: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  images: ProductImage[];
  materials: string[];
  dimensions: string;
  colors: string[];
  availability: ProductAvailability;
  customizable: boolean;
  featured: boolean;
  createdAt: string;
  keywords?: string[];
  popularity?: number;
  estimatedTime?: string;
  notes?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
}
