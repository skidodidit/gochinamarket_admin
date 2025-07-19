import axios from '../axios';
import { Product, CreateOrderPayload, Order, UpdateOrderStatusPayload, VerifyDeliveryCodePayload } from '../../types';


export const createOrder = async (payload: CreateOrderPayload) => {
  const res = await axios.post<Order>('/order', payload);
  return res.data;
};

// Get a specific order by ID
export const getOrderById = async (orderId: string) => {
  const res = await axios.get<Order>(`/order/${orderId}`);
  return res.data;
};

// Get paginated orders for a user
export const getUserOrders = async (
  userId: string,
  params?: { status?: string; page?: number; limit?: number }
) => {
  const res = await axios.get<{
    orders: Order[];
    total: number;
    page: number;
    pages: number;
  }>(`/order/user/${userId}`, { params });
  return res.data;
};

// Get all orders (Admin)
export const getAllOrders = async (
  params?: { status?: string; page?: number; limit?: number }
) => {
  const res = await axios.get<{
    orders: Order[];
    total: number;
    page: number;
    pages: number;
  }>('/order/all', { params });
  return res.data;
};

// Delete an order
export const deleteOrder = async (orderId: string) => {
  await axios.delete(`/order/${orderId}`);
};

// Admin or system: Update order status and/or payment status
export const updateOrderStatus = async (
  orderId: string,
  payload: UpdateOrderStatusPayload
) => {
  const res = await axios.put<Order>(`/order/${orderId}/status`, payload);
  return res.data;
};

// Verify delivery code (user gives delivery agent code)
export const verifyDeliveryCode = async (
  orderId: string,
  payload: VerifyDeliveryCodePayload
) => {
  const res = await axios.post<Order>(`/order/${orderId}/verify`, payload);
  return res.data;
};
