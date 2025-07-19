import axios from '../axios';
import { Cart } from '../../types';

interface CartItemPayload {
  product: string; 
  quantity: number;
}

interface CreateOrUpdateCartPayload {
  user: string;
  items: CartItemPayload[];
}

export const getCart = async (userId: string) => {
  const res = await axios.get<Cart>(`/cart/${userId}`);
  return res.data;
};

export const createOrUpdateCart = async (payload: CreateOrUpdateCartPayload) => {
  const res = await axios.post<Cart>('/cart', payload);
  return res.data;
};

export const clearCart = async (userId: string) => {
  await axios.delete(`/cart/${userId}`);
};
