import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClothingById, updateClothing } from '../services/clothingService';
import { calculateEstimatedSwapValue } from '../utils/calculator';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { ArrowLeft, Save } from 'lucide-react';

const CATEGORIES = [
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

const CONDITIONS = ['Like New', 'Excellent', 'Good', 'Fair'];
const GENDERS = ['Men', 'Women', 'Unisex', 'Kids'];

const EditClothingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Shirts',
    type: 'Casual',
    brand: '',
    size: '',
    gender: 'Unisex',
    color: '',
    condition: 'Excellent',
    description: '',
    originalPrice: '',
    estimatedSwapValue: '',
    city: '',
    state: ''
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const res = await getClothingById(id);
        const item = res.clothing;
        setFormData({
          title: item.title,
          category: item.category,
          type: item.type || 'Casual',
          brand: item.brand,
          size: item.size,
          gender: item.gender || 'Unisex',
          color: item.color,
          condition: item.condition,
          description: item.description,
          originalPrice: item.originalPrice,
          estimatedSwapValue: item.estimatedSwapValue,
          city: item.city,
          state: item.state
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load item for editing.');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError('');

      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      await updateClothing(id, data);
      navigate(`/clothing/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update clothing listing.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading listing data..." />;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-earth-600 hover:text-earth-900 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="bg-white rounded-3xl border border-earth-200 shadow-sm p-6 sm:p-8">
        <h1 className="text-2xl font-extrabold text-earth-900 mb-1">
          Edit Clothing Listing
        </h1>
        <p className="text-xs sm:text-sm text-earth-500 mb-6">
          Update the details or value for your listed item.
        </p>

        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-earth-700 uppercase tracking-wider mb-1">
                Title *
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-earth-300 text-sm focus:ring-2 focus:ring-forest-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-earth-700 uppercase tracking-wider mb-1">
                Brand *
              </label>
              <input
                type="text"
                name="brand"
                required
                value={formData.brand}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-earth-300 text-sm focus:ring-2 focus:ring-forest-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-earth-700 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-earth-300 text-sm focus:ring-2 focus:ring-forest-500 focus:outline-none bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-earth-700 uppercase tracking-wider mb-1">
                Size
              </label>
              <input
                type="text"
                name="size"
                required
                value={formData.size}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-earth-300 text-sm focus:ring-2 focus:ring-forest-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-earth-700 uppercase tracking-wider mb-1">
                Condition
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-earth-300 text-sm focus:ring-2 focus:ring-forest-500 focus:outline-none bg-white"
              >
                {CONDITIONS.map((cond) => (
                  <option key={cond} value={cond}>
                    {cond}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-earth-700 uppercase tracking-wider mb-1">
                Estimated Original Price (₹)
              </label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-earth-300 text-sm focus:ring-2 focus:ring-forest-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-earth-700 uppercase tracking-wider mb-1">
                Estimated Swap Value (₹)
              </label>
              <input
                type="number"
                name="estimatedSwapValue"
                value={formData.estimatedSwapValue}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-forest-300 text-sm font-bold text-forest-800 focus:ring-2 focus:ring-forest-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-earth-700 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-earth-300 text-sm focus:ring-2 focus:ring-forest-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-earth-100">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 text-sm font-medium text-earth-600 hover:text-earth-900 rounded-xl hover:bg-earth-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-forest-600 hover:bg-forest-700 text-white text-sm font-bold rounded-xl transition shadow-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditClothingPage;
