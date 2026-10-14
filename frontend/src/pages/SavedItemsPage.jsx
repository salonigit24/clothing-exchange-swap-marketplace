import React, { useState, useEffect } from 'react';
import { getSavedItems, removeSavedItem } from '../services/savedService';
import ClothingCard from '../components/clothing/ClothingCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import ErrorMessage from '../components/common/ErrorMessage';
import { Heart } from 'lucide-react';

const SavedItemsPage = () => {
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSaved();
  }, []);

  const fetchSaved = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getSavedItems();
      setSavedItems(res.saved || []);
    } catch (err) {
      setError('Could not load your saved clothing items.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToggle = async (clothingId, isNowSaved) => {
    if (!isNowSaved) {
      // Remove from list
      setSavedItems((prev) => prev.filter((item) => item.clothing?._id !== clothingId));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-earth-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-earth-900 tracking-tight">
            My Saved Items
          </h1>
          <p className="text-xs sm:text-sm text-earth-500 mt-0.5">
            Your wishlist of favorite clothing items bookmarked for future swaps
          </p>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchSaved} />}

      {loading ? (
        <LoadingSpinner message="Loading your favorited items..." />
      ) : savedItems.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No saved items yet"
          description="Browse available clothes and click the heart icon on any item you love to bookmark it here!"
          actionLabel="Browse Available Clothes"
          actionLink="/browse"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {savedItems.map((item) => (
            <ClothingCard
              key={item._id}
              clothing={{ ...item.clothing, isSaved: true }}
              onSaveToggle={handleSaveToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedItemsPage;
