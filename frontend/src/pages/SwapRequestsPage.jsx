import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  getSentSwaps,
  getReceivedSwaps,
  acceptSwap,
  rejectSwap,
  cancelSwap
} from '../services/swapService';
import SwapCard from '../components/swaps/SwapCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import ErrorMessage from '../components/common/ErrorMessage';
import { Inbox, Send, Repeat } from 'lucide-react';

const SwapRequestsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'incoming'; // 'incoming' | 'sent'

  const [incomingSwaps, setIncomingSwaps] = useState([]);
  const [sentSwaps, setSentSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSwaps();
  }, [currentTab]);

  const fetchSwaps = async () => {
    try {
      setLoading(true);
      setError('');
      if (currentTab === 'incoming') {
        const res = await getReceivedSwaps();
        setIncomingSwaps(res.swaps || []);
      } else {
        const res = await getSentSwaps();
        setSentSwaps(res.swaps || []);
      }
    } catch (err) {
      setError('Could not retrieve swap requests. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };

  const handleAccept = async (id) => {
    try {
      setActionLoading(true);
      const res = await acceptSwap(id);
      setIncomingSwaps((prev) =>
        prev.map((s) => (s._id === id ? { ...s, status: res.swap.status } : s))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Could not accept swap.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id) => {
    try {
      setActionLoading(true);
      const res = await rejectSwap(id);
      setIncomingSwaps((prev) =>
        prev.map((s) => (s._id === id ? { ...s, status: res.swap.status } : s))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Could not reject swap.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      setActionLoading(true);
      const res = await cancelSwap(id);
      setSentSwaps((prev) =>
        prev.map((s) => (s._id === id ? { ...s, status: res.swap.status } : s))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Could not cancel swap.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-earth-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-earth-900 tracking-tight">
            Swap Requests
          </h1>
          <p className="text-xs sm:text-sm text-earth-500 mt-0.5">
            Manage proposals received from other swappers or review requests you sent
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-earth-100 rounded-2xl">
          <button
            onClick={() => handleTabChange('incoming')}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition ${
              currentTab === 'incoming'
                ? 'bg-white text-forest-700 shadow-sm'
                : 'text-earth-600 hover:text-earth-900'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            Incoming ({incomingSwaps.length})
          </button>
          <button
            onClick={() => handleTabChange('sent')}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition ${
              currentTab === 'sent'
                ? 'bg-white text-forest-700 shadow-sm'
                : 'text-earth-600 hover:text-earth-900'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            Sent ({sentSwaps.length})
          </button>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchSwaps} />}

      {loading ? (
        <LoadingSpinner message="Loading your swap requests..." />
      ) : currentTab === 'incoming' ? (
        incomingSwaps.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No incoming swap requests"
            description="You have not received any swap offers yet. List more clothes or share your listings to get swap proposals!"
            actionLabel="View My Listings"
            actionLink="/clothing/my-listings"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {incomingSwaps.map((swap) => (
              <SwapCard
                key={swap._id}
                swap={swap}
                type="incoming"
                onAccept={handleAccept}
                onReject={handleReject}
                actionLoading={actionLoading}
              />
            ))}
          </div>
        )
      ) : sentSwaps.length === 0 ? (
        <EmptyState
          icon={Send}
          title="No sent swap requests"
          description="You haven't proposed any swaps yet. Browse available clothing listings and click 'Request Swap'!"
          actionLabel="Browse Available Clothes"
          actionLink="/browse"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {sentSwaps.map((swap) => (
            <SwapCard
              key={swap._id}
              swap={swap}
              type="sent"
              onCancel={handleCancel}
              actionLoading={actionLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SwapRequestsPage;
