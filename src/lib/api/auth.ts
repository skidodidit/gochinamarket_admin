import axios from '../axios';
import { User } from '../../types';

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
}

interface LoginPayload {
  email: string;
  password: string;
}

interface VerifyOtpPayload {
  email: string;
  otp: string;
}

interface AuthResponse {
  token: string;
}

export const registerUser = async (payload: RegisterPayload) => {
  const res = await axios.post<{ message: string }>('/auth/register', payload);
  return res.data;
};

export const verifyOtp = async (payload: VerifyOtpPayload) => {
  const res = await axios.post<{ message: string }>('/auth/verify-otp', payload);
  return res.data;
};

export const loginUser = async (payload: LoginPayload) => {
  const res = await axios.post<AuthResponse>('/auth/login', payload);
  return res.data;
};

export const getUserProfile = async () => {
  const res = await axios.get<User>('/auth/profile');
  return res.data;
};

export const getAllUsers = async (params?: { page?: number; limit?: number; search?: string }) => {
  const res = await axios.get<{
    users: User[];
    total: number;
    page: number;
    pages: number;
  }>('/auth', { params });
  return res.data;
};

