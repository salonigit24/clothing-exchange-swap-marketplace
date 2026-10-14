import React from 'react';
import { SlidersHorizontal, RotateCcw, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const CATEGORIES = [
  'All',
  'T-Shirts',
  'Shirts',
  'Jeans',
  'Trousers',
  'Dresses',
  'Jackets',
  'Hoodies',
  'Skirts',
  'Sarees',
  'Kurtis',
  'Ethnic Wear',
  'Shoes',
  'Accessories',
  'Other'
];

const SIZES = ['All', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size', '28', '30', '32', '34', '36'];
const GENDERS = ['All', 'Men', 'Women', 'Unisex', 'Kids'];
const CONDITIONS = ['All', 'Like New', 'Excellent', 'Good', 'Fair'];
const SORT_OPTIONS = [
  { label: 'Newest Listed', value: 'newest' },
  { label: 'Oldest Listed', value: 'oldest' },
  { label: 'Lowest Swap Value', value: 'price-low' },
  { label: 'Highest Swap Value', value: 'price-high' }
];

const FilterPanel = ({ filters, onFilterChange, onReset }) => {
  const { user } = useAuth();

  return (
    <div className="bg-white p-5 rounded-2xl border border-earth-200/80 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-earth-100">
        <div className="flex items-center gap-2 font-bold text-earth-800 text-sm uppercase tracking-wider">
          <SlidersHorizontal className="w-4 h-4 text-forest-600" />
          <span>Filters & Sort</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs font-medium text-forest-600 hover:text-forest-700 flex items-center gap-1 hover:underline"
        >
          <RotateCcw className="w-3 h-3" />
          Reset All
        </button>
      </div>

      {/* Near Me Toggle */}
      {user?.city && (
        <div className="bg-forest-50/70 p-3.5 rounded-xl border border-forest-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-forest-600" />
            <div>
              <span className="text-xs font-semibold text-forest-900 block">Swaps Near Me</span>
              <span className="text-[11px] text-forest-700">Near {user.city}</span>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={filters.nearMe === 'true'}
              onChange={(e) =>
                onFilterChange({ nearMe: e.target.checked ? 'true' : 'false' })
              }
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-earth-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-earth-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-forest-600"></div>
          </label>
        </div>
      )}

      {/* Sort By */}
      <div>
        <label className="block text-xs font-semibold text-earth-700 uppercase tracking-wider mb-2">
          Sort By
        </label>
        <select
          value={filters.sort || 'newest'}
          onChange={(e) => onFilterChange({ sort: e.target.value })}
          className="w-full px-3 py-2 text-sm rounded-xl border border-earth-200 bg-earth-50/50 text-earth-800 focus:outline-none focus:ring-2 focus:ring-forest-500"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-semibold text-earth-700 uppercase tracking-wider mb-2">
          Category
        </label>
        <select
          value={filters.category || 'All'}
          onChange={(e) => onFilterChange({ category: e.target.value })}
          className="w-full px-3 py-2 text-sm rounded-xl border border-earth-200 bg-earth-50/50 text-earth-800 focus:outline-none focus:ring-2 focus:ring-forest-500"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Gender */}
      <div>
        <label className="block text-xs font-semibold text-earth-700 uppercase tracking-wider mb-2">
          Gender
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {GENDERS.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => onFilterChange({ gender: g })}
              className={`text-xs py-1.5 px-2 rounded-lg font-medium transition text-center ${
                (filters.gender || 'All') === g
                  ? 'bg-forest-600 text-white shadow-sm'
                  : 'bg-earth-100 text-earth-600 hover:bg-earth-200'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Size */}
      <div>
        <label className="block text-xs font-semibold text-earth-700 uppercase tracking-wider mb-2">
          Size
        </label>
        <select
          value={filters.size || 'All'}
          onChange={(e) => onFilterChange({ size: e.target.value })}
          className="w-full px-3 py-2 text-sm rounded-xl border border-earth-200 bg-earth-50/50 text-earth-800 focus:outline-none focus:ring-2 focus:ring-forest-500"
        >
          {SIZES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Condition */}
      <div>
        <label className="block text-xs font-semibold text-earth-700 uppercase tracking-wider mb-2">
          Condition
        </label>
        <div className="space-y-1.5">
          {CONDITIONS.map((cond) => (
            <label
              key={cond}
              className="flex items-center gap-2 text-xs font-medium text-earth-700 cursor-pointer"
            >
              <input
                type="radio"
                name="condition"
                value={cond}
                checked={(filters.condition || 'All') === cond}
                onChange={() => onFilterChange({ condition: cond })}
                className="text-forest-600 focus:ring-forest-500"
              />
              <span>{cond}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Swap Value Range (INR) */}
      <div>
        <label className="block text-xs font-semibold text-earth-700 uppercase tracking-wider mb-2">
          Estimated Value Range (₹)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) => onFilterChange({ minPrice: e.target.value })}
            className="w-1/2 px-2.5 py-1.5 text-xs rounded-lg border border-earth-200 focus:ring-2 focus:ring-forest-500 focus:outline-none"
          />
          <span className="text-earth-400 text-xs">-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) => onFilterChange({ maxPrice: e.target.value })}
            className="w-1/2 px-2.5 py-1.5 text-xs rounded-lg border border-earth-200 focus:ring-2 focus:ring-forest-500 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
