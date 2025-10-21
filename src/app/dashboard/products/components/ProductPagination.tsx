interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  handlePageChange: (page: number) => void;
  handleItemsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  totalItems: number;
  itemsPerPageOptions: number[];
  position?: 'top' | 'bottom';
}

export default function ProductPagination({
  currentPage,
  totalPages,
  itemsPerPage,
  handlePageChange,
  handleItemsPerPageChange,
  totalItems,
  itemsPerPageOptions,
  position = 'top'
}: ProductPaginationProps) {
  if (position === 'top') {
    return (
      <div className="mb-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Items per page:</span>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary-100"
          >
            {itemsPerPageOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    className={`w-8 h-8 rounded-lg text-sm transition-colors ${currentPage === pageNum ? 'bg-primary-100 text-black' : 'bg-white border border-gray-300 hover:bg-gray-50'}`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <span className="mx-1">...</span>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className={`w-8 h-8 rounded-lg text-sm ${currentPage === totalPages ? 'bg-primary-100 text-black' : 'bg-white border border-gray-300 hover:bg-gray-50'}`}
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    );
  }

  // Bottom pagination
  return (
    <div className="mt-6 flex justify-center">
      <div className="flex items-center gap-2 bg-white p-4 rounded-lg shadow-sm">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                className={`w-10 h-10 rounded-lg text-sm transition-colors ${currentPage === pageNum ? 'bg-primary-100 text-black' : 'bg-white border border-gray-300 hover:bg-gray-50'}`}
              >
                {pageNum}
              </button>
            );
          })}

          {totalPages > 5 && currentPage < totalPages - 2 && (
            <>
              <span className="mx-1">...</span>
              <button
                onClick={() => handlePageChange(totalPages)}
                className={`w-10 h-10 rounded-lg text-sm ${currentPage === totalPages ? 'bg-primary-100 text-black' : 'bg-white border border-gray-300 hover:bg-gray-50'}`}
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}