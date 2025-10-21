interface EmptyStateProps {
  searchQuery: string;
  setShowCreateForm: (show: boolean) => void;
}

export default function EmptyState({ searchQuery, setShowCreateForm }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto">
        <div className="w-16 h-16 bg-primary-100/40 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-primary-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Products Found</h3>
        <p className="text-gray-600 mb-6">
          {searchQuery
            ? 'No products match your search criteria. Try a different search term.'
            : "You haven't added any products yet. Create your first product to get started with your inventory."}
        </p>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-primary-100 hover:bg-primary-100/60 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
        >
          Create Your First Product
        </button>
      </div>
    </div>
  );
}