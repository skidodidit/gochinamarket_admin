import { Product, ProductOption, ProductVariant } from '@/types';
import OptionsVariantsEditor from './OptionsVariantsEditor';

interface ProductModalProps {
  isEditing: boolean;
  selectedProduct: Product | null;
  formData: any;
  categories: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleVideoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImagePreview: (index: number) => void;
  removeVideoPreview: (index: number) => void;
  removeExistingMedia: (mediaId: string, type: 'images' | 'videos') => void;
  onOptionsVariantsChange: (options: ProductOption[], variants: ProductVariant[]) => void;
  imagePreviews: string[];
  videoPreviews: string[];
  handleCancel: () => void;
  handleCreate: () => void;
  handleUpdate: () => void;
  createLoading: boolean;
  updateLoading: boolean;
  uploadingMedia: boolean;
}

export default function ProductModal({
  isEditing,
  selectedProduct,
  formData,
  categories,
  handleInputChange,
  handleImageChange,
  handleVideoChange,
  removeImagePreview,
  removeVideoPreview,
  removeExistingMedia,
  onOptionsVariantsChange,
  imagePreviews,
  videoPreviews,
  handleCancel,
  handleCreate,
  handleUpdate,
  createLoading,
  updateLoading,
  uploadingMedia
}: ProductModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 touch-none"
      onClick={handleCancel}
    >
      <div
        className="bg-white touch-none rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">
              {isEditing ? 'Edit Product' : 'Create New Product'}
            </h2>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-100 hover:bg-gray-200 rounded-lg p-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">

          {/* ── Core Fields ──────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary transition-all"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Brand *</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary transition-all"
                placeholder="Enter brand name"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary transition-all"
              >
                <option value="">Select category</option>
                {categories?.map((cat: any) => (
                  <option key={cat._id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Base Price (¥) *
                {formData.variants?.length > 0 && (
                  <span className="ml-2 text-xs font-normal text-gray-400">
                    — used as default for new variants
                  </span>
                )}
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary transition-all"
                placeholder="Enter price"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Discount (%)</label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleInputChange}
                min="0"
                max="100"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary transition-all"
                placeholder="Enter discount percentage"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Rating</label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                min="0"
                max="5"
                step="0.1"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary transition-all"
                placeholder="0–5"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Rating Count</label>
              <input
                type="number"
                name="ratingCount"
                value={formData.ratingCount}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary transition-all"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Reviews Count</label>
              <input
                type="number"
                name="reviews"
                value={formData.reviews || 0}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary transition-all"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-semibold mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary transition-all resize-none"
                placeholder="Enter product description"
              />
            </div>
          </div>

          {/* ── Options & Variants ───────────────────────────────────────── */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-base font-semibold text-gray-800 mb-1">Options & Variants</h3>
            <p className="text-xs text-gray-500 mb-5">
              Add selectable options (Color, Size, etc.), then generate variants to set individual pricing and stock per combination.
            </p>
            <OptionsVariantsEditor
              basePrice={formData.price || 0}
              options={formData.options || []}
              variants={formData.variants || []}
              onChange={onOptionsVariantsChange}
            />
          </div>

          {/* ── Images ───────────────────────────────────────────────────── */}
          <div className="border-t border-gray-200 pt-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Product Images {!isEditing && '*'}
            </label>
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              multiple
              required={!isEditing}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary/40 file:text-black hover:file:bg-primary"
            />

            {isEditing && selectedProduct && selectedProduct.images.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2 font-medium">Current Images:</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {selectedProduct.images.map((img, index) => (
                    <div key={img._id} className="relative group">
                      <img
                        src={img.url}
                        alt={`Product ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingMedia(img._id, 'images')}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {imagePreviews.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2 font-medium">New Images to Upload:</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border-2 border-primary"
                      />
                      <button
                        type="button"
                        onClick={() => removeImagePreview(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Videos ───────────────────────────────────────────────────── */}
          <div className="border-t border-gray-200 pt-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">Product Videos (Optional)</label>
            <input
              type="file"
              onChange={handleVideoChange}
              accept="video/*"
              multiple
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            />

            {isEditing && selectedProduct?.videos && selectedProduct.videos.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2 font-medium">Current Videos:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {selectedProduct.videos.map((vid, index) => (
                    <div key={vid._id} className="relative group">
                      <video src={vid.url} className="w-full h-24 object-cover rounded-lg border-2 border-gray-200" controls />
                      <button
                        type="button"
                        onClick={() => removeExistingMedia(vid._id, 'videos')}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {videoPreviews.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2 font-medium">New Videos to Upload:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {videoPreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <video src={preview} className="w-full h-24 object-cover rounded-lg border-2 border-purple-300" controls />
                      <button
                        type="button"
                        onClick={() => removeVideoPreview(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Status Toggles ───────────────────────────────────────────── */}
          <div className="border-t border-gray-200 pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'inStock', label: 'In Stock' },
                { name: 'secondHand', label: 'Second Hand' },
              ].map(({ name, label }) => (
                <label key={name} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name={name}
                    checked={formData[name]}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-black focus:ring-primary border-gray-300 rounded"
                  />
                  <span className="text-gray-700 text-sm font-semibold">{label}</span>
                </label>
              ))}
            </div>

            {/* Banner */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer mb-3">
                <input
                  type="checkbox"
                  name="isBanner"
                  checked={formData.isBanner}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-black focus:ring-primary border-gray-300 rounded"
                />
                <span className="text-gray-700 text-sm font-semibold">Display as Banner Product</span>
              </label>
              {formData.isBanner && (
                <input
                  type="text"
                  name="bannerText"
                  value={formData.bannerText}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary transition-all"
                  placeholder="Enter banner promotional text"
                />
              )}
            </div>

            {/* Ad */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer mb-3">
                <input
                  type="checkbox"
                  name="isAd"
                  checked={formData.isAd}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-black focus:ring-primary border-gray-300 rounded"
                />
                <span className="text-gray-700 text-sm font-semibold">Display as Advertisement</span>
              </label>
              {formData.isAd && (
                <input
                  type="text"
                  name="adText"
                  value={formData.adText}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary transition-all"
                  placeholder="Enter advertisement text"
                />
              )}
            </div>

            {/* Popup */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer mb-3">
                <input
                  type="checkbox"
                  name="isPopup"
                  checked={formData.isPopup}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-black focus:ring-primary border-gray-300 rounded"
                />
                <span className="text-gray-700 text-sm font-semibold">Display as Popup Product</span>
              </label>
              {formData.isPopup && (
                <input
                  type="text"
                  name="popupText"
                  value={formData.popupText}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary transition-all"
                  placeholder="Enter popup promotional text"
                />
              )}
            </div>
          </div>

          {/* ── Footer ───────────────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-200 order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={isEditing ? handleUpdate : handleCreate}
              disabled={createLoading || updateLoading || uploadingMedia}
              className="flex-1 bg-primary hover:bg-primary/60 disabled:opacity-60 text-black px-6 py-3 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed order-1 sm:order-2"
            >
              {(createLoading || updateLoading || uploadingMedia) ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-black" />
                  {uploadingMedia ? 'Uploading Media…' : isEditing ? 'Updating…' : 'Creating…'}
                </span>
              ) : (
                isEditing ? 'Update Product' : 'Create Product'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}