import axios from '../axios';
import { CurrencyDTO } from '@/types'; 

export const createCurrency = async (payload: CurrencyDTO) => {
  const res = await axios.post<CurrencyDTO>('/currency', payload);
  return res.data;
};

export const fetchCurrency = async () => {
  const res = await axios.get<CurrencyDTO[]>('/currency');
  return res.data;
};

export const fetchCurrencyById = async (id: string) => {
  const res = await axios.get<CurrencyDTO>(`/currency/${id}`);
  return res.data;
};

export const updateCurrency = async (id: string, payload: Partial<CurrencyDTO>) => {
  const res = await axios.put<CurrencyDTO>(`/currency/${id}`, payload);
  return res.data;
};

export const deleteCurrency = async (id: string) => {
  const res = await axios.delete(`/currency/${id}`);
  return res.data;
};
