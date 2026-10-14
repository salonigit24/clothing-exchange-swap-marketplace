import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClothing } from '../services/clothingService';
import { calculateEstimatedSwapValue } from '../utils/calculator';
import { useAuth } from '../context/AuthContext';
import { Upload, Calculator, Image as ImageIcon, X, ArrowLeft, CheckCircle2 } from 'lucide-react';
import ErrorMessage from '../components/common/ErrorMessage';

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

const TYPES = ['Casual', 'Formal', 'Streetwear', 'Traditional', 'Activewear', 'Partywear'];
const CONDITIONS = ['Like New', 'Excellent', 'Good', 'Fair'];
const GENDERS = ['Men', 'Women', 'Unisex', 'Kids'];

const AddClothingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

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
    city: user?.city || '',
    state: user?.state || ''
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Handle field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // Auto update estimated swap value when price, condition, or brand changes
      if (['originalPrice', 'condition', 'brand'].includes(name) && updated.originalPrice) {
        const est = calculateEstimatedSwapValue(
          updated.originalPrice,
          updated.condition,
          updated.brand
        );
        updated.estimatedSwapValue = est;
      }
      return updated;
    });
  };

  // Handle manual recalculate button click
  const handleRecalculate = () => {
    if (!formData.originalPrice) {
      alert('Please enter estimated original retail price first.');
      return;
    }
    const est = calculateEstimatedSwapValue(
      formData.originalPrice,
      formData.condition,
      formData.brand
    );
    setFormData((prev) => ({ ...prev, estimatedSwapValue: est }));
  };

  // Handle image files selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (files.length + selectedFiles.length > 5) {
      alert('You can upload a maximum of 5 images per clothing item.');
      return;
    }

    const newFiles = [...selectedFiles, ...files];
    setSelectedFiles(newFiles);

    // Generate object URLs for immediate preview
    const newPreviews = files.map((f) => URL.createObjectURL(f));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    const updatedPreviews = previewUrls.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    setPreviewUrls(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      setError('Please upload at least one photo of your clothing item.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      selectedFiles.forEach((file) => {
        data.append('images', file);
      });

      const res = await createClothing(data);
      navigate(`/clothing/${res.clothing._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to list clothing item. Please check all fields.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-earth-600 hover:text-earth-900 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="bg-white rounded-3xl border border-earth-200 shadow-sm p-6 sm:p-8">
        <div className="border-b border-earth-100 pb-5 mb-6">
          <span className="text-xs font-bold text-forest-600 uppercase tracking-wider">
            Circular Wardrobe
          </span>
          <h1 className="text-2xl font-extrabold text-earth-900 mt-1">
            List Clothes for Exchange
          </h1>
          <p className="text-xs sm:text-sm text-earth-500 mt-1">
            Add accurate photos and details so nearby members can trade seamlessly.
          </p>
        </div>

        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photos Upload & Preview */}
          <div>
            <label className="block text-sm font-semibold text-earth-800 mb-2">
              Clothing Photos (up to 5) *
            </label>

            {/* Dropzone container */}
            <div className="border-2 border-dashed border-earth-300 hover:border-forest-500 rounded-2xl p-6 text-center bg-earth-50/50 hover:bg-forest-50/30 transition cursor-pointer relative">
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-xs text-forest-600 flex items-center justify-center mb-3 border border-earth-200">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-earth-800">
                  Click to upload or drag & drop photos
                </p>
                <p className="text-xs text-earth-400 mt-1">
                  Supports JPEG, PNG, WEBP up to 5MB each
                </p>
              </div>
            </div>

            {/* Image Preview Thumbnails */}
            {previewUrls.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4">
                {previewUrls.map((url, i) => (
                  <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-earth-200 shadow-xs group">
                    <img src={url} alt="preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 p-1 bg-earth-900/80 text-white rounded-full hover:bg-rose-600 transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Title & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-earth-700 uppercase tracking-wider mb-1.5">
                Listing Title *
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Levi's Classic Blue Denim Jacket"
                className="w-full px-3.5 py-2.5 rounded-xl border border-earth-300 text-sm focus:ring-2 focus:ring-forest-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-earth-700 uppercase tracking-wider mb-1.5">
                Brand *
              </label>
              <input
                type="text"
                name="brand"
                required
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g. Levi's, Zara, H&M, FabIndia"
                className="w-full px-3.5 py-2.5 rounded-xl border border-earth-300 text-sm focus:ring-2 focus:ring-forest-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Category & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-earth-700 uppercase tracking-wider mb-1.5">
                Category *
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
              <label className="block text-xs font-semibold text-earth-700 uppercase tracking-wider mb-1.5">
                Clothing Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-earth-300 text-sm focus:ring-2 focus:ring-forest-500 focus:outline-none bg-white"
              >
                {TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Size, Gender, Color */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-earth-700 uppercase tracking-wider mb-1.5">
                Size *
              </label>
              <input
                type="text"
                name="size"
                required
                value={formData.size}
                onChange={handleChange}
                placeholder="e.g. M, L, XL, 32, Free Size"
                className="w-full px-3.5 py-2.5 rounded-xl border border-earth-300 text-sm focus:ring-2 focus:ring-forest-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-earth-700 uppercase tracking-wider mb-1.5">
                Gender *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-earth-300 text-sm focus:ring-2 focus:ring-forest-500 focus:outline-none bg-white"
              >
                {GENDERS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-earth-700 uppercase tracking-wider mb-1.5">
                Color *
              </label>
              <input
                type="text"
                name="color"
                required
                value={formData.color}
                onChange={handleChange}
                placeholder="e.g. Navy Blue, Sage Green"
                className="w-full px-3.5 py-2.5 rounded-xl border border-earth-300 text-sm focus:ring-2 focus:ring-forest-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Condition */}
          <div>
            <label className="block text-xs font-semibold text-earth-700 uppercase tracking-wider mb-1.5">
              Item Condition *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CONDITIONS.map((cond) => (
                <button
                  type="button"
                  key={cond}
                  onClick={() =>
                    handleChange({ target: { name: 'condition', value: cond } })
                  }
                  className={`p-3 rounded-xl border text-center text-xs font-semibold transition ${
                    formData.condition === cond
                      ? 'border-forest-600 bg-forest-50 text-forest-800 shadow-xs'
                      : 'border-earth-200 bg-white text-earth-600 hover:border-earth-300'
                  }`}
                >
                  {cond}
                </button>
              ))}
            </div>
          </div>

          {/* Valuation Section */}
          <div className="bg-earth-50/70 p-5 rounded-2xl border border-earth-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-forest-800 uppercase tracking-wider">
                Fair Swap Value Valuation
              </span>
              <button
                type="button"
                onClick={handleRecalculate}
                className="text-xs font-semibold text-forest-600 hover:text-forest-700 flex items-center gap-1"
              >
                <Calculator className="w-3.5 h-3.5" />
                Calculate Estimated Value
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-earth-700 uppercase tracking-wider mb-1">
                  Original Retail Price (₹) *
                </label>
                <input
                  type="number"
                  name="originalPrice"
                  required
                  min="0"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  placeholder="e.g. 2999"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-earth-300 text-sm focus:ring-2 focus:ring-forest-500 focus:outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-earth-700 uppercase tracking-wider mb-1">
                  Estimated Swap Value (₹) *
                </label>
                <input
                  type="number"
                  name="estimatedSwapValue"
                  required
                  min="0"
                  value={formData.estimatedSwapValue}
                  onChange={handleChange}
                  placeholder="Auto-calculated"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-forest-300 text-sm font-bold text-forest-800 focus:ring-2 focus:ring-forest-500 focus:outline-none bg-white"
                />
              </div>
            </div>
            <p className="text-[11px] text-earth-500 italic">
              Estimated swap values provide a fair baseline for barter comparison. Members can freely negotiate.
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-earth-700 uppercase tracking-wider mb-1.5">
              Detailed Description *
            </label>
            <textarea
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe fabric material, fit, how many times worn, care instructions, any defects or unique details..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-earth-300 text-sm focus:ring-2 focus:ring-forest-500 focus:outline-none"
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-earth-700 uppercase tracking-wider mb-1.5">
                City *
              </label>
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Nagpur, Mumbai, Pune"
                className="w-full px-3.5 py-2.5 rounded-xl border border-earth-300 text-sm focus:ring-2 focus:ring-forest-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-earth-700 uppercase tracking-wider mb-1.5">
                State *
              </label>
              <input
                type="text"
                name="state"
                required
                value={formData.state}
                onChange={handleChange}
                placeholder="e.g. Maharashtra, Karnataka"
                className="w-full px-3.5 py-2.5 rounded-xl border border-earth-300 text-sm focus:ring-2 focus:ring-forest-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Submit buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-earth-100">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 text-sm font-semibold text-earth-600 hover:text-earth-900 rounded-xl hover:bg-earth-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-7 py-2.5 bg-forest-600 hover:bg-forest-700 text-white text-sm font-bold rounded-xl transition shadow-sm disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              {submitting ? 'Publishing Listing...' : 'Publish Clothing Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClothingPage;
