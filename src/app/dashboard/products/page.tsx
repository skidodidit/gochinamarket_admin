"use client";

import { useState, useEffect } from 'react';
import { useApi } from '@/hooks/useApi';
import { createProduct, getAllProducts, updateProduct, deleteProduct } from '@/lib/api/product';
import { uploadMedia } from '@/lib/api/media';
import { Category, Product } from '@/types';
import { notifyError, notifySuccess } from '@/lib/toast';
import ProductGrid from './components/ProductGrid';
import ProductModal from './components/ProductModal';
import EmptyState from './components/EmptyState';
import { getCategories } from '@/lib/api/category';
import ProductFilters from './components/ProductFilters';
import { ProductPayload } from '@/lib/api/product';

export default function AdminProductPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<ProductPayload>({
    name: '',
    brand: '',
    description: '',
    price: 0,
    discount: 0,
    category: '',
    images: [],
    videos: [],
    inStock: true,
    secondHand: false,
    isBanner: false,
    isAd: false,
    isPopup: false,
    bannerText: '',
    adText: '',
    popupText: '',
    rating: 0,
    ratingCount: 0,
    reviews: 0
  });

  // Media upload state
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedVideos, setSelectedVideos] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  // Filter and pagination state
  const [filters, setFilters] = useState({
    page: 1,
    search: "",
    selectedCategory: "" as any,
    sortBy: "createdAt",
    sortOrder: "desc" as "asc" | "desc",
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
    inStock: undefined as boolean | undefined,
    secondHand: undefined as boolean | undefined,
    minRating: undefined as number | undefined,
    discounted: undefined as boolean | undefined,
    isBanner: undefined as boolean | undefined,
    isAd: undefined as boolean | undefined,
    isPopup: undefined as boolean | undefined,
  });

  const [searchInput, setSearchInput] = useState("");
  const limit = 20;

  const { loading: createLoading, error: createError, success: createSuccess, run: runCreate } = useApi(createProduct);
  const { loading: allLoading, error: allError, success: allSuccess, run: runAll, data: allData } = useApi(getAllProducts);
  const { loading: updateLoading, error: updateError, success: updateSuccess, run: runUpdate } = useApi(updateProduct);
  const { loading: deleteLoading, error: deleteError, success: deleteSuccess, run: runDelete } = useApi(deleteProduct);

  const { loading: fetchLoading, run: runFetch } = useApi(getCategories);

  const fetchCategories = async () => {
    const data = await runFetch();
    if (data) setCategories(data);
  };

  // Initialize categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = () => {
    runAll({
      page: filters.page,
      limit,
      search: filters.search,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
      category: filters.selectedCategory,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      inStock: filters.inStock,
      secondHand: filters.secondHand,
      minRating: filters.minRating,
      discounted: filters.discounted,
      isBanner: filters.isBanner,
      isAd: filters.isAd,
      isPopup: filters.isPopup,
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
      discount: 0,
      category: '',
      images: [],
      videos: [],
      inStock: true,
      secondHand: false,
      isBanner: false,
      isAd: false,
      isPopup: false,
      bannerText: '',
      adText: '',
      popupText: '',
      rating: 0,
      ratingCount: 0,
      reviews: 0
    });
    setSelectedImages([]);
    setSelectedVideos([]);
    setImagePreviews([]);
    setVideoPreviews([]);
  };

  const updateFilter = (key: keyof typeof filters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value
    }));
  };

  const handleSearch = () => {
    updateFilter("search", searchInput);
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      search: "",
      selectedCategory: "",
      sortBy: "createdAt",
      sortOrder: "desc",
      minPrice: undefined,
      maxPrice: undefined,
      inStock: undefined,
      secondHand: undefined,
      minRating: undefined,
      discounted: undefined,
      isBanner: undefined,
      isAd: undefined,
      isPopup: undefined,
    });
    setSearchInput("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'price' || name === 'rating' || name === 'discount') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else if (name === 'ratingCount' || name === 'reviews') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setSelectedImages(prev => [...prev, ...files]);

      // Create previews
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setSelectedVideos(prev => [...prev, ...files]);

      // Create previews
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setVideoPreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImagePreview = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeVideoPreview = (index: number) => {
    setSelectedVideos(prev => prev.filter((_, i) => i !== index));
    setVideoPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingMedia = (mediaId: string, type: 'images' | 'videos') => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type]?.filter(id => id !== mediaId) || []
    }));
  };

  // Error Messages
  useEffect(() => {
    if (allError || createError || updateError || deleteError) {
      notifyError(allError || createError || updateError || deleteError);
    }
  }, [allError, createError, updateError, deleteError]);

  const handleCreate = async () => {
    try {
      setUploadingMedia(true);

      // Upload images
      let imageIds: string[] = [];
      if (selectedImages.length > 0) {
        const uploadedImages = await uploadMedia(selectedImages);
        imageIds = uploadedImages.map(img => img._id);
      }

      // Upload videos
      let videoIds: string[] = [];
      if (selectedVideos.length > 0) {
        const uploadedVideos = await uploadMedia(selectedVideos);
        videoIds = uploadedVideos.map(vid => vid._id);
      }

      setUploadingMedia(false);

      // Create product with media IDs
      await runCreate({
        ...formData,
        images: imageIds,
        videos: videoIds
      });

      if (createSuccess) {
        notifySuccess("Product created successfully!");
        setFilters(prev => ({ ...prev, page: 1 }));
      }
    } catch (error) {
      setUploadingMedia(false);
      notifyError("Failed to upload media or create product");
    }
  };

  const handleUpdate = async () => {
    if (!selectedProduct) return;

    try {
      setUploadingMedia(true);

      // Upload new images if any
      let newImageIds: string[] = [];
      if (selectedImages.length > 0) {
        const uploadedImages = await uploadMedia(selectedImages);
        newImageIds = uploadedImages.map(img => img._id);
      }

      // Upload new videos if any
      let newVideoIds: string[] = [];
      if (selectedVideos.length > 0) {
        const uploadedVideos = await uploadMedia(selectedVideos);
        newVideoIds = uploadedVideos.map(vid => vid._id);
      }

      setUploadingMedia(false);

      // Update product with combined media IDs
      await runUpdate(selectedProduct._id, {
        ...formData,
        images: [...formData.images, ...newImageIds],
        videos: [...(formData.videos || []), ...newVideoIds]
      });

      if (updateSuccess) {
        notifySuccess("Product updated successfully!");
      }
    } catch (error) {
      setUploadingMedia(false);
      notifyError("Failed to upload media or update product");
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      brand: product.brand,
      description: product.description,
      price: product.price,
      discount: product.discount,
      category: product.category,
      images: product.images.map(img => img._id),
      videos: product.videos?.map(vid => vid._id) || [],
      inStock: product.inStock,
      secondHand: product.secondHand,
      isBanner: product.isBanner,
      isAd: product.isAd,
      isPopup: product.isPopup,
      bannerText: product.bannerText || '',
      adText: product.adText || '',
      popupText: product.popupText || '',
      rating: product.rating,
      ratingCount: product.ratingCount,
      reviews: product.reviews || 0
    });
    setIsEditing(true);
    setShowCreateForm(false);
    setSelectedImages([]);
    setSelectedVideos([]);
    setImagePreviews([]);
    setVideoPreviews([]);
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await runDelete(productId);
      if (deleteSuccess) {
        notifySuccess("Product deleted successfully!");
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setShowCreateForm(false);
    setSelectedProduct(null);
    resetForm();
  };

  const handlePageChange = (page: number) => {
    updateFilter("page", page);
  };

  const products = allData?.data || [];
  const total = allData?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const hasProducts = products.length > 0;
  const showModal = showCreateForm || isEditing;

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Search and Action Buttons */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-primary-100 text-black px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 w-full sm:w-auto"
          >
            + Add New Product
          </button>
        </div>

        {/* Filters */}
        <ProductFilters
          filters={filters}
          searchInput={searchInput}
          categories={categories || []}
          categoriesLoading={fetchLoading}
          onFilterChange={updateFilter}
          onSearchInputChange={setSearchInput}
          onSearch={handleSearch}
          onClearFilters={clearFilters}
        />

        {/* Results Count */}
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {products.length} of {total} products
            {filters.page > 1 && ` (Page ${filters.page} of ${totalPages})`}
          </div>
        </div>

        {/* Loading State */}
        {allLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Products Grid */}
        {hasProducts && (
          <ProductGrid
            products={products}
            currentPage={filters.page}
            itemsPerPage={limit}
            totalItems={total}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            deleteLoading={deleteLoading}
            isEditing={isEditing}
          />
        )}

        {/* Empty State */}
        {!hasProducts && !allLoading && (
          <EmptyState
            searchQuery={filters.search}
            setShowCreateForm={setShowCreateForm}
          />
        )}

        {/* Pagination Controls - Bottom */}
        {hasProducts && totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <div className="flex items-center gap-2 bg-white p-4 rounded-lg shadow-sm">
              <button
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page === 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (filters.page <= 3) {
                    pageNum = i + 1;
                  } else if (filters.page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = filters.page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 rounded-lg text-sm transition-colors ${filters.page === pageNum ? 'bg-primary-100 text-black' : 'bg-white border border-gray-300 hover:bg-gray-50'}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {totalPages > 5 && filters.page < totalPages - 2 && (
                  <>
                    <span className="mx-1">...</span>
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      className={`w-10 h-10 rounded-lg text-sm ${filters.page === totalPages ? 'bg-primary-100 text-black' : 'bg-white border border-gray-300 hover:bg-gray-50'}`}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>

              <button
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={filters.page === totalPages}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Product Modal */}
        {showModal && (
          <ProductModal
            isEditing={isEditing}
            selectedProduct={selectedProduct}
            formData={formData}
            handleInputChange={handleInputChange}
            handleImageChange={handleImageChange}
            handleVideoChange={handleVideoChange}
            removeImagePreview={removeImagePreview}
            removeVideoPreview={removeVideoPreview}
            removeExistingMedia={removeExistingMedia}
            categories={categories}
            imagePreviews={imagePreviews}
            videoPreviews={videoPreviews}
            handleCancel={handleCancel}
            handleCreate={handleCreate}
            handleUpdate={handleUpdate}
            createLoading={createLoading}
            updateLoading={updateLoading}
            uploadingMedia={uploadingMedia}
          />
        )}
      </div>
    </div>
  );
}