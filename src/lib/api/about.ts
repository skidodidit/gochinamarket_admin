import instance from '../axios';
import { About } from '../../types';

export const getAbout = async () => {
  const res = await instance.get<About>('/about');
  return res.data;
};

export const updateAbout = async (payload: Partial<About>) => {
  const res = await instance.put<About>('/about', payload);
  return res.data;
};

export const createAbout = async (payload: About) => {
  const res = await instance.post<About>('/about', payload);
  return res.data;
};

export const deleteAbout = async (id: string) => {
  const res = await instance.delete(`/about/${id}`);
  return res.data;
};
