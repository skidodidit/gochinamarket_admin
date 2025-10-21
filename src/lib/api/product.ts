import instance from '../axios';
import { Product } from '../../types';

interface ProductPayload {
  name: string;
  description: string;
  price: number;
  category?: string;
  images?: string[];
  videos?: string[];
  stock?: number;
}

interface GetProductsParams {
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
  minRating?: number;
  discounted?: boolean;
}

export const createProduct = async (data: ProductPayload) => {
  const res = await instance.post<Product>('/products', data);
  return res.data;
};

export const getAllProducts = async (params?: GetProductsParams) => {
  const res = await instance.get<{ data: Product[]; total: number }>('/products', { params });
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
