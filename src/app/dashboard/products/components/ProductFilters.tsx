import type { Category } from "@/types";
import { Search, Filter, X } from "lucide-react";
import { useState } from "react";

interface ProductFiltersProps {
  filters: {
    selectedCategory: any;
    sortBy: string;
    sortOrder: "asc" | "desc";
    minPrice: number | undefined;
    maxPrice: number | undefined;
    inStock: boolean | undefined;
  };
  searchInput: string;
  categories: Category[];
  categoriesLoading: boolean;
  onFilterChange: any;
  onSearchInputChange: (value: string) => void;
  onSearch: any;
  onClearFilters: () => void;
}

export default function ProductFilters({
  filters,
  searchInput,
  categories,
  categoriesLoading,
  onFilterChange,
  onSearchInputChange,
  onSearch,
  onClearFilters,
}: ProductFiltersProps) {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const hasActiveFilters =
    filters.selectedCategory ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.inStock !== undefined;

  const handleSortChange = (value: string) => {
    const [field, order] = value.split("-");
    onFilterChange("sortBy", field);
    onFilterChange("sortOrder", order);
  };

  const handlePriceFilter = () => {
    onFilterChange("minPrice", filters.minPrice);
    onFilterChange("maxPrice", filters.maxPrice);
  };

  const activeFilterCount = [
    filters.selectedCategory,
    filters.minPrice,
    filters.maxPrice,
    filters.inStock !== undefined
  ].filter(Boolean).length;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6 shadow-sm">
      {/* Main Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        {/* Search */}
        <div className="flex-1 w-full md:max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => onSearchInputChange(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && onSearch()}
              className="w-full pl-2 pr-4 py-2.5 bg-gray-50 border-0 rounded-lg outline-none focus:ring-1 focus:ring-primary-100 focus:bg-white transition-all"
            />
            <button onClick={onSearch} className="absolute right-1 top-1/2 transform -translate-y-1/2 text-black bg-primary-100 rounded-lg p-2">
              <Search size={16} />
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          {/* Sort */}
          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => handleSortChange(e.target.value)}
            className="flex-1 lg:flex-none px-3 py-2.5 bg-gray-50 border-0 rounded-lg outline-none focus:ring-1 focus:ring-primary-100 focus:bg-white transition-all"
          >
            <option value="createdAt-desc">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Top Rated</option>
          </select>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="md:hidden flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-primary-100 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Desktop Filter Toggle */}
          <div className="desktop-visibility md:flex items-center gap-3">
            {/* Category */}
            <select
              value={filters.selectedCategory}
              onChange={(e) => onFilterChange("selectedCategory", e.target.value)}
              className="px-3 py-2.5 bg-gray-50 border-0 rounded-lg outline-none focus:ring-1 focus:ring-primary-100 focus:bg-white transition-all min-w-[140px]"
              disabled={categoriesLoading}
            >
              <option value="">All Categories</option>
              {categories?.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Stock Filter */}
            <select
              value={filters.inStock === undefined ? "" : filters.inStock ? "true" : "false"}
              onChange={(e) =>
                onFilterChange("inStock", e.target.value === "" ? undefined : e.target.value === "true")
              }
              className="px-3 py-2.5 bg-gray-50 border-0 rounded-lg outline-none focus:ring-1 focus:ring-primary-100 focus:bg-white transition-all"
            >
              <option value="">All Stock</option>
              <option value="true">In Stock</option>
              <option value="false">Out of Stock</option>
            </select>

            {/* Price Inputs */}
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min $"
                value={filters.minPrice || ""}
                onChange={(e) =>
                  onFilterChange("minPrice", e.target.value ? Number(e.target.value) : undefined)
                }
                onBlur={handlePriceFilter}
                className="w-20 px-3 py-2.5 bg-gray-50 border-0 rounded-lg outline-none focus:ring-1 focus:ring-primary-100 focus:bg-white transition-all text-sm"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="Max $"
                value={filters.maxPrice || ""}
                onChange={(e) =>
                  onFilterChange("maxPrice", e.target.value ? Number(e.target.value) : undefined)
                }
                onBlur={handlePriceFilter}
                className="w-20 px-3 py-2.5 bg-gray-50 border-0 rounded-lg outline-none focus:ring-1 focus:ring-primary-100 focus:bg-white transition-all text-sm"
              />
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="hidden md:flex items-center gap-1 px-3 py-2.5 text-gray-500 hover:text-gray-700 transition-colors text-sm"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Mobile Filter Panel */}
      {showMobileFilters && (
        <div className="md:hidden mt-4 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">
                Category
              </label>
              <select
                value={filters.selectedCategory}
                onChange={(e) => onFilterChange("selectedCategory", e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border-0 rounded-lg outline-none focus:ring-1 focus:ring-primary-100 focus:bg-white transition-all text-sm"
                disabled={categoriesLoading}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Stock Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">
                Stock
              </label>
              <select
                value={filters.inStock === undefined ? "" : filters.inStock ? "true" : "false"}
                onChange={(e) =>
                  onFilterChange("inStock", e.target.value === "" ? undefined : e.target.value === "true")
                }
                className="w-full px-3 py-2 bg-gray-50 border-0 rounded-lg outline-none focus:ring-1 focus:ring-primary-100 focus:bg-white transition-all text-sm"
              >
                <option value="">All</option>
                <option value="true">In Stock</option>
                <option value="false">Out of Stock</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-2">
                Price Range
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min $"
                  value={filters.minPrice || ""}
                  onChange={(e) =>
                    onFilterChange("minPrice", e.target.value ? Number(e.target.value) : undefined)
                  }
                  onBlur={handlePriceFilter}
                  className="flex-1 px-3 py-2 bg-gray-50 border-0 rounded-lg outline-none focus:ring-1 focus:ring-primary-100 focus:bg-white transition-all text-sm"
                />
                <span className="text-gray-400">to</span>
                <input
                  type="number"
                  placeholder="Max $"
                  value={filters.maxPrice || ""}
                  onChange={(e) =>
                    onFilterChange("maxPrice", e.target.value ? Number(e.target.value) : undefined)
                  }
                  onBlur={handlePriceFilter}
                  className="flex-1 px-3 py-2 bg-gray-50 border-0 rounded-lg outline-none focus:ring-1 focus:ring-primary-100 focus:bg-white transition-all text-sm"
                />
              </div>
            </div>
          </div>

          {/* Mobile Clear Filters */}
          {hasActiveFilters && (
            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active
              </span>
              <button
                onClick={onClearFilters}
                className="flex items-center gap-1 px-3 py-2 text-primary-100 hover:text-primary-200 transition-colors text-sm font-medium"
              >
                <X className="w-4 h-4" />
                Clear All
              </button>
            </div>
          )}
        </div>
      )}

      {/* Active Filters Badge - Desktop */}
      {hasActiveFilters && (
        <div className="desktop-visibility flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-500">Active filters:</span>
          {filters.selectedCategory && (
            <span className="bg-primary-50 text-primary-700 px-2 py-1 rounded text-xs">
              {categories.find(c => c.name === filters.selectedCategory)?.name}
            </span>
          )}
          {filters.inStock !== undefined && (
            <span className="bg-primary-50 text-primary-700 px-2 py-1 rounded text-xs">
              {filters.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          )}
          {(filters.minPrice || filters.maxPrice) && (
            <span className="bg-primary-50 text-primary-700 px-2 py-1 rounded text-xs">
              ${filters.minPrice || 0} - ${filters.maxPrice || '∞'}
            </span>
          )}
        </div>
      )}
    </div>
  );
}