import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getSwapHistory } from '../services/swapService';
import SwapCard from '../components/swaps/SwapCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import ErrorMessage from '../components/common/ErrorMessage';
import { History, CheckCircle, Clock, XCircle } from 'lucide-react';

const SwapHistoryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentFilter = searchParams.get('status') || 'all'; // 'all' | 'active' | 'completed' | 'rejected'

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
  }, [currentFilter]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError('');
      const statusParam = currentFilter === 'all' ? '' : currentFilter;
      const res = await getSwapHistory(statusParam);
      setHistory(res.history || []);
    } catch (err) {
      setError('Could not retrieve swap history.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (status) => {
    setSearchParams({ status });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-earth-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-earth-900 tracking-tight">
            My Swap History
          </h1>
          <p className="text-xs sm:text-sm text-earth-500 mt-0.5">
            Archived log of all your historical clothing swaps and negotiations
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-earth-100 rounded-2xl">
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
              currentFilter === 'all' ? 'bg-white text-forest-700 shadow-sm' : 'text-earth-600'
            }`}
          >
            All Swaps
          </button>
          <button
            onClick={() => handleFilterChange('active')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
              currentFilter === 'active' ? 'bg-white text-forest-700 shadow-sm' : 'text-earth-600'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => handleFilterChange('completed')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
              currentFilter === 'completed' ? 'bg-white text-forest-700 shadow-sm' : 'text-earth-600'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => handleFilterChange('rejected')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
              currentFilter === 'rejected' ? 'bg-white text-forest-700 shadow-sm' : 'text-earth-600'
            }`}
          >
            Cancelled / Rejected
          </button>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchHistory} />}

      {loading ? (
        <LoadingSpinner message="Retrieving your swap archives..." />
      ) : history.length === 0 ? (
        <EmptyState
          icon={History}
          title="No swap history records"
          description="You do not have any swaps matching this filter category."
          actionLabel="Browse Available Clothes"
          actionLink="/browse"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {history.map((swap) => (
            <SwapCard key={swap._id} swap={swap} type="history" />
          ))}
        </div>
      )}
    </div>
  );
};

export default SwapHistoryPage;
