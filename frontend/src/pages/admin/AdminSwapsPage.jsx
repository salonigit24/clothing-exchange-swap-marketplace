import React, { useState, useEffect } from 'react';
import { getAdminSwaps } from '../../services/adminService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import StatusBadge from '../../components/common/StatusBadge';
import { formatINR } from '../../utils/calculator';
import { ArrowLeftRight, Eye, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminSwapsPage = () => {
  const [swaps, setSwaps] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSwaps();
  }, [statusFilter]);

  const fetchSwaps = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter;
      const res = await getAdminSwaps(params);
      setSwaps(res.swaps || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load swap transactions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-earth-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-earth-900 tracking-tight">
            Platform Swap Monitoring
          </h1>
          <p className="text-xs sm:text-sm text-earth-500 mt-0.5">
            Audit exchange barter agreements, values, and progression across participants
          </p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl border border-earth-200 bg-white text-earth-800 focus:outline-none"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Accepted">Accepted</option>
          <option value="Negotiating">Negotiating</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Completed">Completed</option>
          <option value="Rejected">Rejected</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchSwaps} />}

      {loading ? (
        <LoadingSpinner message="Auditing swap agreements..." />
      ) : swaps.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-earth-200 text-earth-400 text-xs">
          No swap agreements found matching this filter.
        </div>
      ) : (
        <div className="space-y-4">
          {swaps.map((s) => (
            <div
              key={s._id}
              className="bg-white p-5 rounded-2xl border border-earth-200/90 shadow-xs hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left: Requester & Owner */}
              <div className="space-y-1 min-w-[200px]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-earth-900">{s.requester?.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-earth-400" />
                  <span className="text-xs font-bold text-earth-900">{s.owner?.name}</span>
                </div>
                <div className="text-[11px] text-earth-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Proposed on {new Date(s.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* Middle: Items Barter Overview */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-earth-50/70 p-3 rounded-xl border border-earth-100 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-earth-400 block">Offered Item</span>
                  <span className="font-semibold text-earth-800 truncate block">{s.offeredItem?.title}</span>
                  <span className="font-bold text-forest-700">{formatINR(s.offeredItem?.estimatedSwapValue)}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-earth-400 block">Requested Item</span>
                  <span className="font-semibold text-earth-800 truncate block">{s.requestedItem?.title}</span>
                  <span className="font-bold text-forest-700">{formatINR(s.requestedItem?.estimatedSwapValue)}</span>
                </div>
              </div>

              {/* Right: Status & Action */}
              <div className="flex items-center justify-between md:justify-end gap-3 min-w-[160px]">
                <StatusBadge status={s.status} />
                <Link
                  to={`/swaps/${s._id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-forest-50 hover:bg-forest-600 text-forest-700 hover:text-white transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Inspect
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminSwapsPage;
