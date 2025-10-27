import instance from '../axios';
import { Product } from '../../types';

export interface ProductPayload {
  name: string;
  brand: string;
  description: string;
  price: number;
  discount?: number;
  category?: string;
  images?: string[];
  videos?: string[];
  inStock?: boolean;
  secondHand?: boolean;

  isBanner?: boolean;
  isAd?: boolean;
  isPopup?: boolean;
  popupText?: string;
  adText?: string;
  bannerText?: string;

  rating?: number;
  reviews?: number;
  ratingCount?: number;
}

export interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isBanner?: boolean;
  isAd?: boolean;
  isPopup?: boolean;
  secondHand?: boolean;
  minRating?: number;
  discounted?: boolean;
}

export const createProduct = async (data: ProductPayload) => {
  const res = await instance.post<Product>('/products', data);
  return res.data;
};

export const getAllProducts = async (params?: GetProductsParams) => {
  const res = await instance.get<{ data: Product[]; total: number; page: number; pages: number }>(
    '/products',
    { params }
  );
  return res.data;
};

export const getProductById = async (id: string) => {
  const res = await instance.get<Product>(`/products/${id}`);
  return res.data;
};

export const updateProduct = async (
  id: string,
  data: Partial<ProductPayload> & {
    action?: 'add' | 'remove';
    mediaType?: 'images' | 'videos';
    mediaIds?: string[];
  }
) => {
  const res = await instance.put<Product>(`/products/${id}`, data);
  return res.data;
};

export const deleteProduct = async (id: string) => {
  const res = await instance.delete<{ message: string }>(`/products/${id}`);
  return res.data;
};

export const getTopRatedProducts = async () => {
  const res = await instance.get<Product[]>('/products/top-rated');
  return res.data;
};
