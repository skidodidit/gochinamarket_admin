import axios from '../axios';
import { BankAccountDTO } from '@/types'; 

export const createAccount = async (payload: BankAccountDTO) => {
  const res = await axios.post<BankAccountDTO>('/account', payload);
  return res.data;
};

export const fetchAccount = async () => {
  const res = await axios.get<BankAccountDTO[]>('/account');
  return res.data;
};

export const fetchAccountById = async (id: string) => {
  const res = await axios.get<BankAccountDTO>(`/account/${id}`);
  return res.data;
};

export const updateAccount = async (id: string, payload: Partial<BankAccountDTO>) => {
  const res = await axios.put<BankAccountDTO>(`/account/${id}`, payload);
  return res.data;
};

export const deleteAccount = async (id: string) => {
  const res = await axios.delete(`/account/${id}`);
  return res.data;
};