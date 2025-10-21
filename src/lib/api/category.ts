import instance from '../axios';
import { Category } from '../../types';

// ✅ Get all categories
export const getCategories = async () => {
  const res = await instance.get<Category[]>('/categories');
  return res.data;
};

// ✅ Get category by ID
export const getCategoryById = async (id: string) => {
  const res = await instance.get<Category>(`/categories/${id}`);
  return res.data;
};

// ✅ Create new category (Admin only)
export const createCategory = async (payload: Category) => {
  const res = await instance.post<Category>('/categories', payload);
  return res.data;
};

// ✅ Update category (Admin only)
export const updateCategory = async (id: string, payload: Partial<Category>) => {
  const res = await instance.put<Category>(`/categories/${id}`, payload);
  return res.data;
};

// ✅ Delete category (Admin only)
export const deleteCategory = async (id: string) => {
  const res = await instance.delete(`/categories/${id}`);
  return res.data;
};
