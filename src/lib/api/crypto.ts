import axios from '../axios';
import { CryptoDTO } from '@/types'; 

export const createCrypto = async (payload: CryptoDTO) => {
  const res = await axios.post<CryptoDTO>('/crypto', payload);
  return res.data;
};

export const fetchCrypto = async () => {
  const res = await axios.get<CryptoDTO[]>('/crypto');
  return res.data;
};

export const fetchCryptoById = async (id: string) => {
  const res = await axios.get<CryptoDTO>(`/crypto/${id}`);
  return res.data;
};

export const updateCrypto = async (id: string, payload: Partial<CryptoDTO>) => {
  const res = await axios.put<CryptoDTO>(`/crypto/${id}`, payload);
  return res.data;
};

export const deleteCrypto = async (id: string) => {
  const res = await axios.delete(`/crypto/${id}`);
  return res.data;
};