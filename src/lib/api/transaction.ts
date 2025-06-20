import axios from '../axios';
import { TransactionDTO, FetchTransactionsParams, TransactionResponse } from '@/types'; 

export const createTransaction = async (payload: TransactionDTO) => {
  const res = await axios.post<TransactionDTO>('/transactions', payload);
  return res.data;
};

export const fetchTransactions = async (params: FetchTransactionsParams = {}): Promise<TransactionResponse> => {
  const res = await axios.get<TransactionResponse>('/transactions', { params });
  return res.data;
};


export const fetchTransactionById = async (id: string) => {
  const res = await axios.get<TransactionDTO>(`/transactions/${id}`);
  return res.data;
};

export const updateTransaction = async (id: string, payload: Partial<TransactionDTO>) => {
  const res = await axios.put<TransactionDTO>(`/transactions/${id}`, payload);
  return res.data;
};

export const deleteTransaction = async (id: string) => {
  const res = await axios.delete(`/transactions/${id}`);
  return res.data;
};
