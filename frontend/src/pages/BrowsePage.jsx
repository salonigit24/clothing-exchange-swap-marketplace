import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getClothes } from '../services/clothingService';
import ClothingCard from '../components/clothing/ClothingCard';
import SearchBar from '../components/clothing/SearchBar';
import FilterPanel from '../components/clothing/FilterPanel';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import ErrorMessage from '../components/common/ErrorMessage';
import { Filter, Shirt } from 'lucide-react';

const BrowsePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [clothes, setClothes] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state with URL search params
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'All',
    gender: searchParams.get('gender') || 'All',
    size: searchParams.get('size') || 'All',
    condition: searchParams.get('condition') || 'All',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    nearMe: searchParams.get('nearMe') || 'false',
    sort: searchParams.get('sort') || 'newest'
  });

  useEffect(() => {
    fetchClothingItems();
  }, [filters]);

  const fetchClothingItems = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};

      if (filters.search) params.search = filters.search;
      if (filters.category && filters.category !== 'All') params.category = filters.category;
      if (filters.gender && filters.gender !== 'All') params.gender = filters.gender;
      if (filters.size && filters.size !== 'All') params.size = filters.size;
      if (filters.condition && filters.condition !== 'All') params.condition = filters.condition;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.nearMe === 'true') params.nearMe = 'true';
      if (filters.sort) params.sort = filters.sort;

      const res = await getClothes(params);
      setClothes(res.clothes || []);
      setTotalCount(res.total || res.count || 0);
    } catch (err) {
      setError('Could not retrieve clothing listings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => {
      const updated = { ...prev, ...newFilters };
      // Update URL query params
      const p = new URLSearchParams();
      Object.keys(updated).forEach((k) => {
        if (updated[k] && updated[k] !== 'All' && updated[k] !== 'false') {
          p.set(k, updated[k]);
        }
      });
      setSearchParams(p);
      return updated;
    });
  };

  const handleSearch = (searchTerm) => {
    handleFilterChange({ search: searchTerm });
  };

  const handleResetFilters = () => {
    const defaultFilters = {
      search: '',
      category: 'All',
      gender: 'All',
      size: 'All',
      condition: 'All',
      minPrice: '',
      maxPrice: '',
      nearMe: 'false',
      sort: 'newest'
    };
    setFilters(defaultFilters);
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-earth-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-earth-900 tracking-tight">
            Browse Clothes
          </h1>
          <p className="text-xs sm:text-sm text-earth-500 mt-0.5">
            Discover {totalCount} pre-loved clothing listings available for instant swap
          </p>
        </div>

        {/* Search bar */}
        <div className="w-full md:w-96">
          <SearchBar
            initialValue={filters.search}
            onSearch={handleSearch}
            placeholder="Search jacket, kurti, denim, Levi's..."
          />
        </div>
      </div>

      {/* Mobile filter toggle */}
      <div className="lg:hidden flex items-center justify-between bg-white p-3.5 rounded-xl border border-earth-200 shadow-xs">
        <span className="text-xs font-semibold text-earth-700">
          Showing {clothes.length} of {totalCount} items
        </span>
        <button
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-forest-50 text-forest-700 text-xs font-bold rounded-lg border border-forest-200"
        >
          <Filter className="w-3.5 h-3.5" />
          {mobileFilterOpen ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {/* Main Grid: Sidebar + Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar / Mobile toggled */}
        <aside
          className={`${
            mobileFilterOpen ? 'block' : 'hidden'
          } lg:block lg:col-span-1 sticky top-20`}
        >
          <FilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </aside>

        {/* Content Area */}
        <main className="lg:col-span-3">
          {error && <ErrorMessage message={error} onRetry={fetchClothingItems} />}

          {loading ? (
            <LoadingSpinner message="Searching sustainable wardrobe..." />
          ) : clothes.length === 0 ? (
            <EmptyState
              icon={Shirt}
              title="No clothing items found"
              description="No clothing match your chosen filters. Try clearing your filters or search term to see more results."
              actionLabel="Reset All Filters"
              onAction={handleResetFilters}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {clothes.map((clothing) => (
                <ClothingCard key={clothing._id} clothing={clothing} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default BrowsePage;
