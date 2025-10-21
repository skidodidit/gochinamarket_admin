import instance from '../axios';
import { Cart } from '../../types';

interface CartItemPayload {
  product: string; 
  quantity: number;
}

interface CreateOrUpdateCartPayload {
  items: CartItemPayload[];
  guestId?: string;
}

export const getCart = async (guestId?: string) => {
  const res = await instance.get<Cart>(`/cart`, {
    params: guestId ? { guestId } : {},
  });
  return res.data;
};

export const addOrUpdateCart = async (payload: CreateOrUpdateCartPayload) => {
  const res = await instance.post<Cart>(`/cart`, payload);
  return res.data;
};

export const removeCartItem = async (productId: string, guestId?: string) => {
  const res = await instance.delete(`/cart/${productId}`, {
    params: guestId ? { guestId } : {},
  });
  return res.data;
};

export const clearCart = async (guestId?: string) => {
  const res = await instance.delete(`/cart`, {
    params: guestId ? { guestId } : {},
  });
  return res.data;
};
