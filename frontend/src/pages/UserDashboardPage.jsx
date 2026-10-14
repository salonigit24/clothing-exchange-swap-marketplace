import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StatusBadge from '../components/common/StatusBadge';
import { formatINR } from '../utils/calculator';
import {
  Layers,
  Clock,
  CheckCircle,
  Repeat,
  Heart,
  PlusCircle,
  Search,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  MapPin,
  Leaf
} from 'lucide-react';

const UserDashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentSwaps, setRecentSwaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await api.get('/users/profile');
        setStats(res.data.stats);
        setRecentSwaps(res.data.recentSwaps || []);
      } catch (err) {
        console.error('Failed to load user dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <LoadingSpinner message="Loading your dashboard summary..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-forest-800 to-forest-950 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-700/70 text-forest-200 text-xs font-semibold">
              <Leaf className="w-3.5 h-3.5" /> Sustainable Fashion Member
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-xs sm:text-sm text-forest-200 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-forest-400" />
              Location: {user?.city}, {user?.state} • Ready for local swaps
            </p>
          </div>

          {/* Quick Actions in Banner */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/clothing/add"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-forest-900 hover:bg-forest-50 text-xs font-bold rounded-xl shadow-sm transition"
            >
              <PlusCircle className="w-4 h-4 text-forest-700" />
              Add Clothing
            </Link>
            <Link
              to="/browse"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-forest-700/80 hover:bg-forest-700 text-white text-xs font-bold rounded-xl border border-forest-600 transition"
            >
              <Search className="w-4 h-4" />
              Browse Clothes
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Listed Clothes */}
        <Link
          to="/clothing/my-listings"
          className="bg-white p-5 rounded-2xl border border-earth-200/80 shadow-xs hover:shadow-md hover:border-forest-300 transition group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-forest-50 text-forest-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-earth-300 group-hover:text-forest-600 transition" />
          </div>
          <span className="text-2xl font-extrabold text-earth-900 block">
            {stats?.listedCount || 0}
          </span>
          <span className="text-xs text-earth-500 font-medium">My Listed Clothes</span>
        </Link>

        {/* Pending Requests */}
        <Link
          to="/swaps?tab=incoming"
          className="bg-white p-5 rounded-2xl border border-earth-200/80 shadow-xs hover:shadow-md hover:border-amber-300 transition group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-earth-300 group-hover:text-amber-600 transition" />
          </div>
          <span className="text-2xl font-extrabold text-earth-900 block">
            {stats?.pendingRequestsCount || 0}
          </span>
          <span className="text-xs text-earth-500 font-medium">Pending Requests</span>
        </Link>

        {/* Accepted Swaps */}
        <Link
          to="/swaps?tab=incoming"
          className="bg-white p-5 rounded-2xl border border-earth-200/80 shadow-xs hover:shadow-md hover:border-blue-300 transition group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Repeat className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-earth-300 group-hover:text-blue-600 transition" />
          </div>
          <span className="text-2xl font-extrabold text-earth-900 block">
            {stats?.acceptedSwapsCount || 0}
          </span>
          <span className="text-xs text-earth-500 font-medium">Active Swaps</span>
        </Link>

        {/* Completed Swaps */}
        <Link
          to="/swaps/history?status=completed"
          className="bg-white p-5 rounded-2xl border border-earth-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CheckCircle className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-earth-300 group-hover:text-emerald-600 transition" />
          </div>
          <span className="text-2xl font-extrabold text-earth-900 block">
            {stats?.completedSwapsCount || 0}
          </span>
          <span className="text-xs text-earth-500 font-medium">Completed Swaps</span>
        </Link>

        {/* Saved Items */}
        <Link
          to="/saved"
          className="bg-white p-5 rounded-2xl border border-earth-200/80 shadow-xs hover:shadow-md hover:border-rose-300 transition group col-span-2 lg:col-span-1"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-earth-300 group-hover:text-rose-600 transition" />
          </div>
          <span className="text-2xl font-extrabold text-earth-900 block">
            {stats?.savedItemsCount || 0}
          </span>
          <span className="text-xs text-earth-500 font-medium">Saved Items</span>
        </Link>
      </div>

      {/* Recent Swap Activities */}
      <div className="bg-white rounded-3xl border border-earth-200 shadow-sm p-6 sm:p-8">
        <div className="flex items-center justify-between pb-4 border-b border-earth-100 mb-5">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-forest-600" />
            <h2 className="text-lg font-bold text-earth-900">Recent Swap Activities</h2>
          </div>
          <Link
            to="/swaps"
            className="text-xs font-semibold text-forest-600 hover:text-forest-700 hover:underline"
          >
            View All Swaps
          </Link>
        </div>

        {recentSwaps.length === 0 ? (
          <div className="text-center py-8 text-earth-400 text-xs">
            No swap activities yet. Browse available clothing and send your first swap request!
          </div>
        ) : (
          <div className="divide-y divide-earth-100">
            {recentSwaps.map((s) => (
              <div
                key={s._id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-earth-100 overflow-hidden shrink-0">
                    <img
                      src={
                        s.offeredItem?.images?.[0]?.startsWith('http')
                          ? s.offeredItem.images[0]
                          : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${s.offeredItem?.images?.[0]}`
                      }
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-earth-800">
                      {s.offeredItem?.title} ⇄ {s.requestedItem?.title}
                    </div>
                    <div className="text-[11px] text-earth-400 mt-0.5">
                      Updated {new Date(s.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status={s.status} />
                  <Link
                    to={`/swaps/${s._id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-forest-50 hover:bg-forest-600 text-forest-700 hover:text-white transition"
                  >
                    Open
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboardPage;
