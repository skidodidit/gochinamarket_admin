import instance from '../axios';
import { Settings } from '../../types';

export const getSettings = async () => {
  const res = await instance.get<Settings>('/settings');
  return res.data;
};

export const updateSettings = async (payload: Partial<Settings>) => {
  const res = await instance.post<Settings>('/settings', payload);
  return res.data;
};

export const createSettings = async (payload: Settings) => {
  const res = await instance.post<Settings>('/settings', payload);
  return res.data;
};

export const deleteSetting = async (id: string) => {
  const res = await instance.delete(`/settings/${id}`);
  return res.data;
};
