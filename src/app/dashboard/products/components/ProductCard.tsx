import { Product } from '@/types';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  handleEdit: (product: Product) => void;
  handleDelete: (productId: string) => void;
  deleteLoading: boolean;
  isEditing: boolean;
}

export default function ProductCard({
  product,
  handleEdit,
  handleDelete,
  deleteLoading,
  isEditing
}: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoadError, setImageLoadError] = useState<boolean[]>([]);

  const hasImages = product.images && product.images.length > 0;
  const totalImages = product.images?.length || 0;

  const handleImageError = (index: number) => {
    setImageLoadError(prev => {
      const newErrors = [...prev];
      newErrors[index] = true;
      return newErrors;
    });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % totalImages);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="group bg-white hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200">
      {/* Product Image Carousel */}
      <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        {hasImages ? (
          <>
            {/* Main Image */}
            <div className="relative w-full h-full">
              {product.images.map((image, index) => (
                <img
                  key={image._id}
                  src={imageLoadError[index] ? 'https://via.placeholder.com/400x300?text=No+Image' : image.url}
                  alt={`${product.name} - Image ${index + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                    index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                  onError={() => handleImageError(index)}
                />
              ))}
            </div>

            {/* Navigation Arrows */}
            {totalImages > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full w-8 h-8 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full w-8 h-8 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Image Indicators */}
            {totalImages > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      goToImage(index);
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentImageIndex 
                        ? 'bg-white scale-125' 
                        : 'bg-white/60 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Image Counter */}
            {totalImages > 1 && (
              <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                {currentImageIndex + 1} / {totalImages}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
            <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium">No Images</span>
          </div>
        )}
        
        {/* Stock Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm border ${
            product.inStock
              ? 'bg-green-500/10 text-green-700 border-green-500/20'
              : 'bg-red-500/10 text-red-700 border-red-500/20'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
              product.inStock ? 'bg-green-500' : 'bg-red-500'
            }`}></span>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        {/* Banner Badge */}
        {product.isBanner && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
              <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"/>
              </svg>
              Featured
            </span>
          </div>
        )}

        {/* Media Type Indicators */}
        <div className="absolute bottom-3 left-3 flex gap-2">
          {product.videos && product.videos.length > 0 && (
            <span className="bg-black/70 text-white px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm12.553 1.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
              </svg>
              {product.videos.length}
            </span>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="px-5 py-3">
        {/* Category */}
        <div className="mb-2">
          <span className="inline-block bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-semibold border border-blue-200">
            {product.category}
          </span>
        </div>

        {/* Name and Brand */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-900 mb-1.5 line-clamp-2 leading-tight group-hover:text-gray-700 transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm font-medium flex items-center">
            <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {product.brand}
          </p>
        </div>

        {/* Description */}
        <div className="mb-4">
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{product.description}</p>
        </div>

        {/* Price and Rating */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-gray-900">${product.price.toLocaleString()}</p>
              {product.discount && product.discount > 0 && (
                <div className="flex flex-col">
                  <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-full">
                    {product.discount}% OFF
                  </span>
                  <p className="text-sm text-gray-500 line-through">
                    ${(product.price / (1 - product.discount / 100)).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1.5 bg-yellow-50 px-2.5 py-1 rounded-full border border-yellow-200">
              <span className="text-yellow-500 text-sm">★</span>
              <span className="text-gray-800 text-sm font-semibold">{product.rating.toFixed(1)}</span>
              <span className="text-gray-500 text-xs">({product.ratingCount})</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => handleEdit(product)}
            disabled={isEditing}
            className="flex-1 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white px-4 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2 group/btn"
          >
            <svg className="w-4 h-4 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          <button
            onClick={() => handleDelete(product._id)}
            disabled={deleteLoading || isEditing}
            className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 disabled:from-gray-400 disabled:to-gray-300 text-white px-4 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2 group/btn"
          >
            {deleteLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span className="hidden sm:inline">Deleting...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}