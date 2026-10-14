import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyListings, deleteClothing, toggleAvailability } from '../services/clothingService';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import ErrorMessage from '../components/common/ErrorMessage';
import { formatINR } from '../utils/calculator';
import { PlusCircle, Eye, Edit, Trash2, Power, Shirt } from 'lucide-react';

const MyListingsPage = () => {
  const [clothes, setClothes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getMyListings();
      setClothes(res.clothes || []);
    } catch (err) {
      setError('Could not load your listings.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      setActionLoading(id);
      const res = await toggleAvailability(id);
      setClothes((prev) =>
        prev.map((item) => (item._id === id ? { ...item, status: res.clothing.status } : item))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Could not change status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      setActionLoading(id);
      await deleteClothing(id);
      setClothes((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete listing.');
    } finally {
      setActionLoading(null);
    }
  };

  const getImage = (item) => {
    if (!item?.images?.[0]) return 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=400&q=80';
    return item.images[0].startsWith('http')
      ? item.images[0]
      : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${item.images[0]}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-earth-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-earth-900 tracking-tight">
            My Clothing Listings
          </h1>
          <p className="text-xs sm:text-sm text-earth-500 mt-0.5">
            Manage your items available for exchange, toggle availability, or edit details
          </p>
        </div>

        <Link
          to="/clothing/add"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-forest-600 hover:bg-forest-700 text-white text-xs font-bold rounded-xl transition shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          Add New Clothing
        </Link>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchListings} />}

      {loading ? (
        <LoadingSpinner message="Loading your wardrobe listings..." />
      ) : clothes.length === 0 ? (
        <EmptyState
          icon={Shirt}
          title="No clothing items listed yet"
          description="Your wardrobe is currently empty. List clothes you no longer wear to start swapping with others!"
          actionLabel="+ Add Your First Item"
          actionLink="/clothing/add"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clothes.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl border border-earth-200/90 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
            >
              <div className="relative aspect-[16/10] bg-earth-100 overflow-hidden">
                <img
                  src={getImage(item)}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <StatusBadge status={item.status} />
                </div>
                <div className="absolute top-3 right-3">
                  <StatusBadge status={item.condition} />
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <span className="text-[11px] font-bold text-forest-700 uppercase tracking-wide">
                  {item.brand} • {item.category}
                </span>
                <h3 className="font-semibold text-earth-900 text-sm mt-0.5 truncate">
                  {item.title}
                </h3>

                <div className="mt-2 flex items-center justify-between text-xs pt-2 border-t border-earth-100">
                  <div>
                    <span className="text-earth-400 block text-[10px]">Estimated Value</span>
                    <span className="font-bold text-forest-700 text-sm">
                      {formatINR(item.estimatedSwapValue)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-earth-400 block text-[10px]">Size</span>
                    <span className="font-semibold text-earth-800">{item.size}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-3 border-t border-earth-100 flex items-center justify-between gap-1">
                  <Link
                    to={`/clothing/${item._id}`}
                    className="p-2 text-earth-600 hover:text-forest-700 hover:bg-forest-50 rounded-xl transition"
                    title="View Listing"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>

                  {item.status !== 'Swapped' && (
                    <>
                      <Link
                        to={`/clothing/${item._id}/edit`}
                        className="p-2 text-earth-600 hover:text-earth-900 hover:bg-earth-100 rounded-xl transition"
                        title="Edit Listing"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => handleToggle(item._id)}
                        disabled={actionLoading === item._id || item.status === 'Swap Pending'}
                        className={`p-2 rounded-xl transition ${
                          item.status === 'Available'
                            ? 'text-amber-600 hover:bg-amber-50'
                            : 'text-forest-600 hover:bg-forest-50'
                        }`}
                        title={item.status === 'Available' ? 'Mark Unavailable' : 'Mark Available'}
                      >
                        <Power className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(item._id)}
                        disabled={actionLoading === item._id}
                        className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition"
                        title="Delete Listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListingsPage;
