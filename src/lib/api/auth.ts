import axios from '../axios';
import { User } from '@/types';

export const registerUser = async (payload: { email: string; password: string }) => {
  const res = await axios.post<User>('/auth/register', payload);
  return res.data;
};

export const loginUser = async (payload: { email: string; password: string }) => {
  const res = await axios.post<{ token: string; message: string }>('/auth/login', payload);
  return res.data;
};

export const requestOtp = async (email: string) => {
  const res = await axios.post('/auth/request-otp', { email });
  return res.data;
};

export const verifyOtp = async (email: string, otp: string) => {
  const res = await axios.post('/auth/verify-otp', { email, otp });
  return res.data;
};

export const getUsers = async ({
  page = 1,
  limit = 10,
  search = '',
}: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const res = await axios.get<{
    users: User[];
    total: number;
    page: number;
    pages: number;
  }>('/auth', {
    params: { page, limit, search },
  });
  return res.data;
};

export const toggleVerification = async (userId: string) => {
  const res = await axios.patch<{ message: string; user: User }>(
    `/auth/${userId}/toggle-verification`
  );
  return res.data;
};