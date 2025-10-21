interface ProductSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  setShowCreateForm: (show: boolean) => void;
}

export default function ProductSearch({ 
  searchQuery, 
  setSearchQuery, 
  handleSearch, 
  setShowCreateForm 
}: ProductSearchProps) {
  return (
    <div className="mb-6 flex flex-col sm:flex-row gap-4">
      <button
        onClick={() => setShowCreateForm(true)}
        className="bg-primary-100 text-black px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 w-full sm:w-auto"
      >
        + Add New Product
      </button>
    </div>
  );
}