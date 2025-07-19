import axios from '../axios';
import { Product } from '../../types';

interface CreateProductPayload {
  name: string;
  brand: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  inStock?: boolean;
  rating: number; 
  ratingCount: number; 
}

interface UpdateProductPayload extends Partial<CreateProductPayload> {}

export const createProduct = async (payload: CreateProductPayload & { imageFile?: File }) => {
  const formData = new FormData();

  formData.append('name', payload.name);
  formData.append('brand', payload.brand);
  formData.append('description', payload.description);
  formData.append('price', payload.price.toString());
  formData.append('category', payload.category);
  formData.append('rating', payload.rating.toString());
  formData.append('ratingCount', payload.ratingCount.toString());

  if (payload.inStock !== undefined) {
    formData.append('inStock', String(payload.inStock));
  }

  if (payload.image) {
    formData.append('image', payload.image); 
  }

  const res = await axios.post<Product>('/products', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
};


export const getAllProducts = async (params?: { page?: number; limit?: number; search?: string }) => {
  const res = await axios.get<{
    products: Product[];
    total: number;
    page: number;
    pages: number;
  }>('/products', { params });
  return res.data;
};

export const getProductById = async (id: string) => {
  const res = await axios.get<Product>(`/products/${id}`);
  return res.data;
};

export const updateProduct = async (id: string, payload: UpdateProductPayload) => {
  const res = await axios.put<Product>(`/products/${id}`, payload);
  return res.data;
};

export const deleteProduct = async (id: string) => {
  const res = await axios.delete<{ message: string }>(`/products/${id}`);
  return res.data;
};

export const getTopRatedProducts = async () => {
  const res = await axios.get<Product[]>('/products/top-rated');
  return res.data;
};
