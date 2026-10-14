import React, { useState, useEffect } from 'react';
import { getAdminClothing, updateAdminClothingStatus } from '../../services/adminService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import StatusBadge from '../../components/common/StatusBadge';
import { formatINR } from '../../utils/calculator';
import { Search, Eye, Power, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminListingsPage = () => {
  const [clothes, setClothes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchListings();
  }, [statusFilter]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (statusFilter !== 'All') params.status = statusFilter;

      const res = await getAdminClothing(params);
      setClothes(res.clothes || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load platform listings.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchListings();
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'Available' ? 'Unavailable' : 'Available';
    try {
      setActionLoading(id);
      await updateAdminClothingStatus(id, nextStatus);
      setClothes((prev) =>
        prev.map((item) => (item._id === id ? { ...item, status: nextStatus } : item))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Could not update listing status');
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
            Listing Moderation
          </h1>
          <p className="text-xs sm:text-sm text-earth-500 mt-0.5">
            Audit public listings, remove inappropriate content, or adjust inventory states
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-earth-200 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearch} className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-earth-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, brand, city..."
            className="w-full pl-10 pr-20 py-2 rounded-xl border border-earth-200 text-xs text-earth-800 focus:outline-none focus:ring-2 focus:ring-forest-500"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1 px-3 py-1 bg-forest-600 hover:bg-forest-700 text-white text-xs font-semibold rounded-lg"
          >
            Search
          </button>
        </form>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl border border-earth-200 bg-earth-50 text-earth-800 focus:outline-none w-full md:w-auto"
        >
          <option value="All">All Statuses</option>
          <option value="Available">Available</option>
          <option value="Swap Pending">Swap Pending</option>
          <option value="Swapped">Swapped</option>
          <option value="Unavailable">Unavailable / Taken Down</option>
        </select>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchListings} />}

      {loading ? (
        <LoadingSpinner message="Auditing clothing listings..." />
      ) : (
        <div className="bg-white rounded-3xl border border-earth-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-earth-700">
              <thead className="bg-earth-50 text-[11px] font-bold text-earth-500 uppercase tracking-wider border-b border-earth-200">
                <tr>
                  <th className="px-6 py-4">Item</th>
                  <th className="px-6 py-4">Owner</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Est. Value</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-earth-100 font-medium">
                {clothes.map((item) => (
                  <tr key={item._id} className="hover:bg-earth-50/60 transition">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img
                        src={getImage(item)}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover bg-earth-100 shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-earth-900 block truncate max-w-xs text-xs">
                          {item.title}
                        </span>
                        <span className="text-[11px] text-forest-700">{item.brand} • Size {item.size}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-semibold text-earth-800 block text-xs">{item.owner?.name}</span>
                      <span className="text-[11px] text-earth-400">{item.city}, {item.state}</span>
                    </td>

                    <td className="px-6 py-4 text-earth-600 font-medium">{item.category}</td>

                    <td className="px-6 py-4 font-bold text-forest-800">
                      {formatINR(item.estimatedSwapValue)}
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={item.status} />
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/clothing/${item._id}`}
                          className="p-1.5 rounded-lg border border-earth-200 text-earth-600 hover:text-forest-700 hover:bg-forest-50 transition"
                          title="Inspect Listing"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          onClick={() => handleToggleStatus(item._id, item.status)}
                          disabled={actionLoading === item._id || item.status === 'Swapped'}
                          className={`p-1.5 rounded-lg border text-xs font-semibold transition ${
                            item.status === 'Available'
                              ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
                              : 'border-forest-200 text-forest-700 hover:bg-forest-50'
                          }`}
                          title={item.status === 'Available' ? 'Take Down / Mark Unavailable' : 'Restore Available'}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminListingsPage;
