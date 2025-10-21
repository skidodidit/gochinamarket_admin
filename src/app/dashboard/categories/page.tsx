"use client"

import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, X, Search } from 'lucide-react';
import { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from '@/lib/api/category';
import { Category } from '@/types';
import { useApi } from '@/hooks/useApi';

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    description: '',
    isActive: true,
  });

  const { loading: fetchLoading, run: runFetch } = useApi(getCategories);
  const { loading: createLoading, success: createSuccess, run: runCreate } = useApi(createCategory);
  const { loading: updateLoading, success: updateSuccess, run: runUpdate } = useApi(updateCategory);
  const { loading: deleteLoading, run: runDelete } = useApi(deleteCategory);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (createSuccess || updateSuccess) {
      fetchCategories();
      closeModal();
    }
  }, [createSuccess, updateSuccess]);

  const fetchCategories = async () => {
    const data = await runFetch();
    if (data) setCategories(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory?._id) {
      await runUpdate(editingCategory._id, formData);
    } else {
      await runCreate(formData as Category);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      isActive: category.isActive,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      await runDelete(id);
      fetchCategories();
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '', isActive: true });
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl overflow-hidden">

          {/* Actions Bar */}
          <div className="p-6 border-b border-slate-200 bg-slate-50">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-primary-100 hover:bg-primary-100 text-black px-6 py-2 rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Add Category
              </button>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="p-6">
            {fetchLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-slate-400 text-lg">No categories found</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-6 gap-6">
                {filteredCategories?.map((category) => (
                  <div
                    key={category._id}
                    className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-800">{category.name}</h3>
                        <span
                          className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                            category.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {category.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                      {category.description || 'No description available'}
                    </p>
                    <div className="flex gap-2 pt-4 border-t border-slate-100">
                      <button
                        onClick={() => handleEdit(category)}
                        className="flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-4 py-2 rounded-lg transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(category._id!)}
                        className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800">
                {editingCategory ? 'Edit Category' : 'New Category'}
              </h2>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="Enter category name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                  placeholder="Enter category description"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-slate-700">
                  Active Category
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={createLoading || updateLoading}
                  className="flex-1 px-4 py-2 bg-primary-100 text-black rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createLoading || updateLoading ? 'Saving...' : editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}