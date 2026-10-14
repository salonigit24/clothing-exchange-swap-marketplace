import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminDashboard } from '../../services/adminService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import StatusBadge from '../../components/common/StatusBadge';
import { formatINR } from '../../utils/calculator';
import {
  Users,
  Layers,
  Repeat,
  CheckCircle,
  Flag,
  ShieldCheck,
  TrendingUp,
  ArrowRight
} from 'lucide-react';

const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getAdminDashboard();
      setData(res);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load administrator dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Gathering platform metrics..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchDashboard} />;
  if (!data) return null;

  const { stats, categoryStats, recentUsers, recentSwaps } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-earth-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-amber-100 text-amber-800">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-earth-900 tracking-tight">
              ClothSwap Admin Panel
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-earth-500 mt-1">
            Real-time platform metrics, user moderation, circular inventory and swap tracking
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/reports"
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition ${
              stats.pendingReports > 0
                ? 'bg-rose-100 text-rose-800 hover:bg-rose-200 animate-pulse'
                : 'bg-earth-100 text-earth-700 hover:bg-earth-200'
            }`}
          >
            <Flag className="w-4 h-4" />
            {stats.pendingReports} Pending Reports
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Users */}
        <Link
          to="/admin/users"
          className="bg-white p-5 rounded-2xl border border-earth-200/90 shadow-xs hover:shadow-md transition"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-forest-50 text-forest-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-forest-700 bg-forest-50 px-2 py-0.5 rounded-full">
              {stats.activeUsers} Active
            </span>
          </div>
          <span className="text-3xl font-extrabold text-earth-900 block">{stats.totalUsers}</span>
          <span className="text-xs text-earth-500 font-medium">Registered Users</span>
        </Link>

        {/* Listings */}
        <Link
          to="/admin/clothing"
          className="bg-white p-5 rounded-2xl border border-earth-200/90 shadow-xs hover:shadow-md transition"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              {stats.activeListings} Available
            </span>
          </div>
          <span className="text-3xl font-extrabold text-earth-900 block">{stats.totalListings}</span>
          <span className="text-xs text-earth-500 font-medium">Total Listings ({stats.swappedListings} Swapped)</span>
        </Link>

        {/* Swaps */}
        <Link
          to="/admin/swaps"
          className="bg-white p-5 rounded-2xl border border-earth-200/90 shadow-xs hover:shadow-md transition"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Repeat className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
              {stats.successfulSwaps} Completed
            </span>
          </div>
          <span className="text-3xl font-extrabold text-earth-900 block">{stats.totalSwaps}</span>
          <span className="text-xs text-earth-500 font-medium">Total Swap Proposals</span>
        </Link>

        {/* Successful Swaps Rate */}
        <div className="bg-white p-5 rounded-2xl border border-earth-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-forest-50 text-forest-700 flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-forest-700 bg-forest-50 px-2 py-0.5 rounded-full">
              Barter Impact
            </span>
          </div>
          <span className="text-3xl font-extrabold text-earth-900 block">
            {stats.totalSwaps > 0 ? Math.round((stats.successfulSwaps / stats.totalSwaps) * 100) : 0}%
          </span>
          <span className="text-xs text-earth-500 font-medium">Successful Swaps Conversion</span>
        </div>
      </div>

      {/* Two columns: Category Breakdown & Recent Swaps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Categories Bar Distribution */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-earth-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-earth-900 uppercase tracking-wider">
            Inventory By Category
          </h3>
          <div className="space-y-3">
            {categoryStats?.map((cat) => (
              <div key={cat._id} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-earth-700">
                  <span>{cat._id}</span>
                  <span>{cat.count} items</span>
                </div>
                <div className="w-full h-2 rounded-full bg-earth-100 overflow-hidden">
                  <div
                    className="h-full bg-forest-600 rounded-full"
                    style={{
                      width: `${Math.min(100, (cat.count / (stats.totalListings || 1)) * 100)}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Swaps Monitor */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-earth-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-earth-900 uppercase tracking-wider">
              Recent Platform Swaps
            </h3>
            <Link
              to="/admin/swaps"
              className="text-xs font-semibold text-forest-600 hover:text-forest-700 flex items-center gap-1"
            >
              All Swaps <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-earth-100">
            {recentSwaps?.map((s) => (
              <div key={s._id} className="py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-earth-900 truncate">
                    {s.requester?.name} ⇄ {s.owner?.name}
                  </p>
                  <p className="text-[11px] text-earth-400 truncate">
                    {s.offeredItem?.title} ({formatINR(s.offeredItem?.estimatedSwapValue)}) for{' '}
                    {s.requestedItem?.title} ({formatINR(s.requestedItem?.estimatedSwapValue)})
                  </p>
                </div>
                <StatusBadge status={s.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
