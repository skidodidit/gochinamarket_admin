import { Product } from '@/types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  handleEdit: (product: Product) => void;
  handleDelete: (productId: string) => void;
  deleteLoading: boolean;
  isEditing: boolean;
}

export default function ProductGrid({
  products,
  currentPage,
  itemsPerPage,
  totalItems,
  handleEdit,
  handleDelete,
  deleteLoading,
  isEditing
}: ProductGridProps) {
  return (
    <div className="mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Products</h2>
        <p className="text-gray-600">
          Showing {(currentPage - 1) * itemsPerPage + 1}-
          {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} products
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            deleteLoading={deleteLoading}
            isEditing={isEditing}
          />
        ))}
      </div>
    </div>
  );
}