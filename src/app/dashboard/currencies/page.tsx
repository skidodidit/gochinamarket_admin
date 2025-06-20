"use client";

import { useState, useEffect } from 'react';
import { useApi } from '@/hooks/useApi';
import { createCurrency, fetchCurrency, fetchCurrencyById, updateCurrency, deleteCurrency } from '@/lib/api/currency';
import { CurrencyDTO } from '@/types';

export default function AdminCurrenciesPage() {
  const [currencies, setCurrencies] = useState<CurrencyDTO[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyDTO | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CurrencyDTO>({
    name: '',
    code: '',
    rate: 0,
    image: '',
    status: 'active'
  });

  const { loading: createLoading, error: createError, success: createSuccess, run: runCreate } = useApi(createCurrency);
  const { loading: allLoading, error: allError, success: allSuccess, run: runAll, data: allData } = useApi(fetchCurrency);
  const { loading: updateLoading, error: updateError, success: updateSuccess, run: runUpdate } = useApi(updateCurrency);
  const { loading: deleteLoading, error: deleteError, success: deleteSuccess, run: runDelete } = useApi(deleteCurrency);

  // Load currencies on component mount
  useEffect(() => {
    loadCurrencies();
  }, []);

  // Update currencies when API data changes
  useEffect(() => {
    if (allData) {
      setCurrencies(allData);
    }
  }, [allData]);

  // Handle success states
  useEffect(() => {
    if (createSuccess || updateSuccess || deleteSuccess) {
      loadCurrencies();
      resetForm();
    }
  }, [createSuccess, updateSuccess, deleteSuccess]);

  const loadCurrencies = () => {
    runAll();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      rate: 0,
      image: '',
      status: 'active'
    });
    setSelectedCurrency(null);
    setIsEditing(false);
    setShowForm(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rate' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = () => {
    if (isEditing && selectedCurrency) {
      runUpdate(selectedCurrency._id, formData);
    } else {
      runCreate(formData);
    }
  };

  const handleEdit = (currency: CurrencyDTO) => {
    setSelectedCurrency(currency);
    setFormData(currency);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this currency?')) {
      runDelete(id);
    }
  };

  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 text-gray-100">
      <div className="container mx-auto px-4 py-8">

        {/* Action Button */}
        <div className="mb-6">
          <button
            onClick={handleAddNew}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-green-500/25"
          >
            Add New Currency
          </button>
        </div>

        {/* Error Messages */}
        {(createError || allError || updateError || deleteError) && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
            <p className="text-red-300">
              {createError || allError || updateError || deleteError}
            </p>
          </div>
        )}

        {/* Success Messages */}
        {(createSuccess || updateSuccess || deleteSuccess) && (
          <div className="mb-6 p-4 bg-green-900/50 border border-green-700 rounded-lg">
            <p className="text-green-300">
              {createSuccess && "Currency created successfully!"}
              {updateSuccess && "Currency updated successfully!"}
              {deleteSuccess && "Currency deleted successfully!"}
            </p>
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4 border border-gray-700">
              <h2 className="text-2xl font-bold text-green-400 mb-4">
                {isEditing ? 'Edit Currency' : 'Add New Currency'}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Currency Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
                    placeholder="e.g., US Dollar"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Currency Code
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
                    placeholder="e.g., USD"
                    maxLength={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Exchange Rate
                  </label>
                  <input
                    type="number"
                    name="rate"
                    value={formData.rate}
                    onChange={handleInputChange}
                    required
                    step="0.000001"
                    min="0"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
                    placeholder="e.g., 1.0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
                    placeholder="https://example.com/currency-image.png"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={createLoading || updateLoading}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {(createLoading || updateLoading) ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Currencies Table */}
        <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
          <div className="px-6 py-4 bg-gradient-to-r from-gray-800 to-gray-700 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-green-400">All Currencies</h2>
          </div>

          {allLoading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              <p className="mt-2 text-gray-400">Loading currencies...</p>
            </div>
          ) : currencies.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <p>No currencies found. Create your first currency to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Currency
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {currencies.map((currency, index) => (
                    <tr key={currency._id || index} className="hover:bg-gray-700/50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {currency.image && (
                            <img
                              src={currency.image}
                              alt={currency.name}
                              className="h-8 w-8 rounded-full mr-3"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-white">{currency.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono text-green-400 bg-green-900/30 px-2 py-1 rounded">
                          {currency.code}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {currency.rate.toFixed(6)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          currency.status === 'active' 
                            ? 'bg-green-900/50 text-green-300 border border-green-700' 
                            : 'bg-red-900/50 text-red-300 border border-red-700'
                        }`}>
                          {currency.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(currency)}
                            className="text-blue-400 hover:text-blue-300 transition-colors duration-150"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(currency._id)}
                            disabled={deleteLoading}
                            className="text-red-400 hover:text-red-300 transition-colors duration-150 disabled:opacity-50"
                          >
                            {deleteLoading ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}