import instance from '../axios';
import { Order, PaginatedOrders } from '../../types';

interface OrderItemPayload {
  product: string;
  quantity: number;
  price: number;
}

interface CreateOrderPayload {
  items: OrderItemPayload[];
  address: {
    name: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode?: string;
  };
  paymentMethod: 'card' | 'transfer' | 'cod';
  guestId?: string;
}

export const createOrder = async (payload: CreateOrderPayload) => {
  const res = await instance.post<Order>('/orders', payload);
  return res.data;
};

export const getUserOrders = async (page = 1, limit = 10) => {
  const res = await instance.get<PaginatedOrders>(`/orders/my`, {
    params: { page, limit },
  });
  return res.data;
};

export const getAdminOrders = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) => {
  const res = await instance.get<PaginatedOrders>('/orders', { params });
  return res.data;
};

export const updateOrderStatus = async (id: string, status: string) => {
  const res = await instance.patch(`/orders/${id}/status`, { status });
  return res.data;
};

export const verifyDeliveryCode = async (id: string, code: string) => {
  const res = await instance.post(`/orders/${id}/verify-delivery`, { code });
  return res.data;
};
