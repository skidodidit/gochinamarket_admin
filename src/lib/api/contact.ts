import instance from '../axios';
import { Contact } from '../../types';

export const getContacts = async () => {
  const res = await instance.get<Contact[]>('/contact');
  return res.data;
};

export const getContact = async (id: string) => {
  const res = await instance.get<Contact>(`/contact/${id}`);
  return res.data;
};

export const createContact = async (payload: Contact) => {
  const res = await instance.post<Contact>('/contact', payload);
  return res.data;
};

export const updateContact = async (id: string, payload: Partial<Contact>) => {
  const res = await instance.put<Contact>(`/contact/${id}`, payload);
  return res.data;
};

export const deleteContact = async (id: string) => {
  const res = await instance.delete(`/contact/${id}`);
  return res.data;
};
