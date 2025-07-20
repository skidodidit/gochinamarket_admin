"use client";

import { useState, useEffect } from 'react';
import { useApi } from '@/hooks/useApi';
import { createProduct, getAllProducts, updateProduct, deleteProduct } from '@/lib/api/product';
import { Product } from '@/types';
import { notifyError, notifySuccess } from '@/lib/toast';

interface CreateProductPayload {
  name: string;
  brand: string;
  description: string;
  price: number;
  category: string;
  image: any;
  imagePreview?: any;
  inStock?: boolean;
  rating: number; 
  ratingCount: number; 
}

export default function AdminProductPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<CreateProductPayload>({
    name: '',
    brand: '',
    description: '',
    price: 0,
    category: '',
    image: '',
    imagePreview: '',
    inStock: true,
    rating: 0,
    ratingCount: 0
  });

  // Pagination and search state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalPages, setTotalPages] = useState(1);

  const { loading: createLoading, error: createError, success: createSuccess, run: runCreate } = useApi(createProduct);
  const { loading: allLoading, error: allError, success: allSuccess, run: runAll, data: allData } = useApi(getAllProducts);
  const { loading: updateLoading, error: updateError, success: updateSuccess, run: runUpdate } = useApi(updateProduct);
  const { loading: deleteLoading, error: deleteError, success: deleteSuccess, run: runDelete } = useApi(deleteProduct);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, itemsPerPage, searchQuery]);

  useEffect(() => {
    if (allData) {
      setTotalPages(allData.pages || 1);
    }
  }, [allData]);

  const fetchProducts = () => {
    runAll({
      page: currentPage,
      limit: itemsPerPage,
      search: searchQuery
    });
  };

  useEffect(() => {
    if (createSuccess || updateSuccess || deleteSuccess) {
      fetchProducts();
      setIsEditing(false);
      setShowCreateForm(false);
      setSelectedProduct(null);
      resetForm();
    }
  }, [createSuccess, updateSuccess, deleteSuccess]);

  const resetForm = () => {
    setFormData({
      name: '',
      brand: '',
      description: '',
      price: 0,
      category: '',
      image: '',
      inStock: true,
      rating: 0,
      ratingCount: 0
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'price' || name === 'rating') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else if (name === 'ratingCount') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file) 
      }));
    }
  };

  // Error Messages
  useEffect(() => {
    if (allError || createError || updateError || deleteError) {
      notifyError(allError || createError || updateError || deleteError);
    }
  }, [allError, createError, updateError, deleteError]);

  const handleCreate = async () => {
    await runCreate(formData);
    if (createSuccess) {
      notifySuccess("Product created successfully!");
      setCurrentPage(1);
    }
  };

  const handleUpdate = async () => {
    if (selectedProduct) {
      await runUpdate(selectedProduct._id, formData);
    }
    if (updateSuccess) {
      notifySuccess("Product updated successfully!");
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      brand: product.brand,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      inStock: product.inStock,
      rating: product.rating,
      ratingCount: product.ratingCount
    });
    setIsEditing(true);
    setShowCreateForm(false);
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await runDelete(productId);
    }
    if (deleteSuccess) {
      notifySuccess("Product deleted successfully!");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setShowCreateForm(false);
    setSelectedProduct(null);
    resetForm();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); 
    fetchProducts();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); 
  };

  const hasProducts = allData?.products && allData.products.length > 0;
  const showModal = showCreateForm || isEditing;

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-2">Product Management</h1>
          <p className="text-amber-700">Manage your perfume products inventory</p>
        </div>

        {/* Search and Action Buttons */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-10 bg-white border border-amber-200 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
              />
              <div className="absolute left-3 top-3.5 text-amber-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </form>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-amber-800 to-amber-700 hover:from-amber-700 hover:to-amber-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 w-full sm:w-auto"
          >
            Add New Product
          </button>
        </div>

        {/* Pagination Controls - Top */}
        <div className="mb-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-amber-800">Items per page:</span>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="px-3 py-1.5 bg-white border border-amber-200 rounded-lg text-sm focus:outline-none focus:border-amber-400"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
          
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 bg-white border border-amber-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-8 h-8 rounded-lg text-sm ${currentPage === pageNum ? 'bg-amber-700 text-white' : 'bg-white border border-amber-200'}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <span className="mx-1">...</span>
                )}
                
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className={`w-8 h-8 rounded-lg text-sm ${currentPage === totalPages ? 'bg-amber-700 text-white' : 'bg-white border border-amber-200'}`}
                  >
                    {totalPages}
                  </button>
                )}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 bg-white border border-amber-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Loading State */}
        {allLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700"></div>
          </div>
        )}

        {/* Products Grid */}
        {hasProducts && (
          <div className="mb-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-amber-800 mb-2">Your Products</h2>
              <p className="text-amber-700">
                Showing {(currentPage - 1) * itemsPerPage + 1}-
                {Math.min(currentPage * itemsPerPage, allData?.total || 0)} of {allData?.total || 0} products
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allData?.products?.map((product) => (
                <div key={product._id} className="bg-white rounded-xl shadow-lg border border-amber-200 hover:border-amber-300 transition-all duration-200 hover:shadow-xl overflow-hidden">
                  {/* Product Image */}
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/300x225?text=No+Image';
                      }}
                    />
                    {/* Stock Status Badge */}
                    <div className="absolute top-2 right-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        product.inStock 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Product Details */}
                  <div className="p-4">
                    <div className="mb-2">
                      <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">{product.name}</h3>
                      <p className="text-amber-700 text-sm font-medium">{product.category}</p>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex items-center justify-between">
                        <p className="text-xl font-bold text-amber-800">N{product.price.toFixed(2)}</p>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">★</span>
                          <span className="text-gray-700 text-sm">{product.rating.toFixed(1)}</span>
                          <span className="text-gray-500 text-sm">({product.ratingCount})</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        disabled={isEditing}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:from-gray-400 disabled:to-gray-300 text-white px-3 py-2 rounded-lg font-semibold shadow transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        disabled={deleteLoading || isEditing}
                        className="flex-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 disabled:from-gray-400 disabled:to-gray-300 text-white px-3 py-2 rounded-lg font-semibold shadow transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed text-sm"
                      >
                        {deleteLoading ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                            <span className="hidden sm:inline">Deleting...</span>
                          </div>
                        ) : (
                          'Delete'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!hasProducts && !allLoading && (
          <div className="text-center py-12">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-amber-200 max-w-md mx-auto">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-amber-800 mb-2">No Products Found</h3>
              <p className="text-amber-700 mb-6">
                {searchQuery 
                  ? 'No products match your search criteria. Try a different search term.'
                  : "You haven't added any products yet. Create your first product to get started with your inventory."}
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-gradient-to-r from-amber-800 to-amber-700 hover:from-amber-700 hover:to-amber-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                Create Your First Product
              </button>
            </div>
          </div>
        )}

        {/* Pagination Controls - Bottom */}
        {hasProducts && totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-amber-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 rounded-lg text-sm ${currentPage === pageNum ? 'bg-amber-700 text-white' : 'bg-white border border-amber-200'}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <span className="mx-1">...</span>
                )}
                
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className={`w-10 h-10 rounded-lg text-sm ${currentPage === totalPages ? 'bg-amber-700 text-white' : 'bg-white border border-amber-200'}`}
                  >
                    {totalPages}
                  </button>
                )}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border border-amber-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Modal Overlay */}
        {showModal && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl border border-amber-200 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-amber-50 to-amber-100 px-6 py-4 border-b border-amber-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-amber-800">
                    {isEditing ? 'Edit Product' : 'Create New Product'}
                  </h2>
                  <button
                    onClick={handleCancel}
                    className="text-amber-600 hover:text-amber-800 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-amber-800 text-sm font-semibold mb-2">Product Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                      placeholder="Enter product name"
                    />
                  </div>

                  <div>
                    <label className="block text-amber-800 text-sm font-semibold mb-2">Product Brand</label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                      placeholder="Enter product brand"
                    />
                  </div>

                  <div>
                    <label className="block text-amber-800 text-sm font-semibold mb-2">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-gray-800 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                    >
                      <option value="">Select category</option>
                      <option value="Men's Fragrance">Men's Fragrance</option>
                      <option value="Women's Fragrance">Women's Fragrance</option>
                      <option value="Unisex Fragrance">Unisex Fragrance</option>
                      <option value="Luxury Collection">Luxury Collection</option>
                      <option value="Travel Size">Travel Size</option>
                      <option value="Gift Sets">Gift Sets</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-amber-800 text-sm font-semibold mb-2">Price (N)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      required
                      className="w-full px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                      placeholder="Enter price"
                    />
                  </div>

                  <div>
                    <label className="block text-amber-800 text-sm font-semibold mb-2">Rating</label>
                    <input
                      type="number"
                      name="rating"
                      value={formData.rating}
                      onChange={handleInputChange}
                      min="0"
                      max="5"
                      step="0.1"
                      required
                      className="w-full px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                      placeholder="Enter rating (0-5)"
                    />
                  </div>

                  <div>
                    <label className="block text-amber-800 text-sm font-semibold mb-2">Rating Count</label>
                    <input
                      type="number"
                      name="ratingCount"
                      value={formData.ratingCount}
                      onChange={handleInputChange}
                      min="0"
                      required
                      className="w-full px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                      placeholder="Enter rating count"
                    />
                  </div>

                  <div>
  <label className="block text-amber-800 text-sm font-semibold mb-2">Image</label>
  <input
    type="file"
    name="image"
    onChange={handleFileChange}
    accept="image/*"
    required={!isEditing}
    className="w-full px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
  />
  {/* Image preview */}
  {formData.imagePreview && (
    <div className="mt-2">
      <img 
        src={formData.imagePreview} 
        alt="Preview" 
        className="h-32 object-cover rounded-lg"
      />
    </div>
  )}
</div>

                  <div className="md:col-span-2">
                    <label className="block text-amber-800 text-sm font-semibold mb-2">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      required
                      className="w-full px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all resize-none"
                      placeholder="Enter product description"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="inStock"
                        checked={formData.inStock}
                        onChange={handleInputChange}
                        className="mr-2 h-4 w-4 text-amber-700 focus:ring-amber-500 border-amber-300 rounded"
                      />
                      <span className="text-amber-800 text-sm font-semibold">In Stock</span>
                    </label>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-amber-200">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 bg-gradient-to-r from-gray-600 to-gray-500 hover:from-gray-500 hover:to-gray-400 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-200 order-2 sm:order-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={isEditing ? handleUpdate : handleCreate}
                    disabled={createLoading || updateLoading}
                    className="flex-1 bg-gradient-to-r from-amber-800 to-amber-700 hover:from-amber-700 hover:to-amber-600 disabled:from-gray-400 disabled:to-gray-300 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed order-1 sm:order-2"
                  >
                    {(createLoading || updateLoading) ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        {isEditing ? 'Updating...' : 'Creating...'}
                      </div>
                    ) : (
                      isEditing ? 'Update Product' : 'Create Product'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}