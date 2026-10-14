import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../common/Modal';
import SwapValueCompare from '../clothing/SwapValueCompare';
import { getMyListings } from '../../services/clothingService';
import { createSwapRequest } from '../../services/swapService';
import { ArrowLeftRight, PlusCircle, CheckCircle } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const SwapRequestModal = ({ isOpen, onClose, targetClothing }) => {
  const navigate = useNavigate();
  const [myClothes, setMyClothes] = useState([]);
  const [selectedOfferId, setSelectedOfferId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUserListings();
      setMessage(
        `Hi! I would love to exchange one of my items for your ${targetClothing?.title}. Let me know if you are interested!`
      );
    }
  }, [isOpen, targetClothing]);

  const fetchUserListings = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getMyListings();
      // Filter only Available items
      const available = (res.clothes || []).filter((item) => item.status === 'Available');
      setMyClothes(available);
      if (available.length > 0) {
        setSelectedOfferId(available[0]._id);
      }
    } catch (err) {
      setError('Could not load your listings. Please make sure you have listed clothes.');
    } finally {
      setLoading(false);
    }
  };

  const selectedOfferItem = myClothes.find((item) => item._id === selectedOfferId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOfferId) {
      setError('Please select an item from your wardrobe to offer.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const res = await createSwapRequest({
        offeredItemId: selectedOfferId,
        requestedItemId: targetClothing._id,
        message: message.trim()
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        navigate(`/swaps/${res.swap._id}`);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit swap request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Propose Clothing Swap" maxWidth="max-w-2xl">
      {success ? (
        <div className="text-center py-8">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-earth-900">Swap Request Sent!</h3>
          <p className="text-sm text-earth-500 mt-1">
            Opening your negotiation workspace and chat...
          </p>
        </div>
      ) : loading ? (
        <LoadingSpinner message="Loading your wardrobe items..." />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 text-rose-700 text-sm rounded-xl border border-rose-200">
              {error}
            </div>
          )}

          {myClothes.length === 0 ? (
            <div className="text-center py-8 px-4 bg-earth-50 rounded-2xl border border-earth-200">
              <p className="text-sm text-earth-600 font-medium mb-4">
                You do not have any available clothing items to offer yet. Please add an item first to start swapping!
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate('/clothing/add');
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-forest-600 text-white text-sm font-semibold rounded-xl hover:bg-forest-700 transition"
              >
                <PlusCircle className="w-4 h-4" />
                Add Clothing Item
              </button>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-semibold text-earth-800 mb-2">
                  Select an item to offer in exchange:
                </label>
                <select
                  value={selectedOfferId}
                  onChange={(e) => setSelectedOfferId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-earth-300 bg-white text-earth-900 focus:outline-none focus:ring-2 focus:ring-forest-500 text-sm font-medium"
                >
                  {myClothes.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.title} — {item.brand} (Est. ₹{item.estimatedSwapValue})
                    </option>
                  ))}
                </select>
              </div>

              {/* Value comparison component */}
              {selectedOfferItem && (
                <SwapValueCompare
                  offeredItem={selectedOfferItem}
                  requestedItem={targetClothing}
                />
              )}

              <div>
                <label className="block text-sm font-semibold text-earth-800 mb-1">
                  Introduction message (optional):
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Introduce yourself and suggest how you would like to swap..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-earth-300 text-earth-800 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-earth-100">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="px-4 py-2.5 text-sm font-medium text-earth-600 hover:text-earth-900 rounded-xl hover:bg-earth-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-forest-600 hover:bg-forest-700 text-white text-sm font-semibold rounded-xl transition shadow-sm disabled:opacity-50"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                  {submitting ? 'Sending Request...' : 'Send Swap Request'}
                </button>
              </div>
            </>
          )}
        </form>
      )}
    </Modal>
  );
};

export default SwapRequestModal;
