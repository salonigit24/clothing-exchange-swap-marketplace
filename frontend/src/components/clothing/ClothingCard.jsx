import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Heart, ArrowRight } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import { formatINR } from '../../utils/calculator';
import { saveItem, removeSavedItem } from '../../services/savedService';
import { useAuth } from '../../context/AuthContext';

const ClothingCard = ({ clothing, onSaveToggle }) => {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(clothing.isSaved || false);
  const [saving, setSaving] = useState(false);

  // Fallback image handling
  const imageUrl =
    clothing.images && clothing.images.length > 0
      ? clothing.images[0].startsWith('http')
        ? clothing.images[0]
        : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${clothing.images[0]}`
      : 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80';

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert('Please log in to save items to your favorites.');
      return;
    }

    try {
      setSaving(true);
      if (isSaved) {
        await removeSavedItem(clothing._id);
        setIsSaved(false);
      } else {
        await saveItem(clothing._id);
        setIsSaved(true);
      }
      if (onSaveToggle) onSaveToggle(clothing._id, !isSaved);
    } catch (err) {
      console.error('Failed to toggle save:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-earth-200/80 overflow-hidden shadow-sm hover:shadow-md hover:border-forest-300 transition-all flex flex-col h-full">
      {/* Image container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-earth-100">
        <img
          src={imageUrl}
          alt={clothing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Top badges: Status & Proximity */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
          <StatusBadge status={clothing.status} />
          {clothing.isNearby && <StatusBadge status="Nearby" />}
        </div>

        {/* Favorite button */}
        <button
          onClick={handleFavoriteClick}
          disabled={saving}
          aria-label="Save item"
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm text-earth-600 hover:text-rose-500 hover:bg-white transition shadow-sm"
        >
          <Heart
            className={`w-4 h-4 transition ${
              isSaved ? 'fill-rose-500 text-rose-500' : ''
            }`}
          />
        </button>

        {/* Condition tag over image */}
        <div className="absolute bottom-3 left-3">
          <StatusBadge status={clothing.condition} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between text-xs font-semibold text-forest-700 uppercase tracking-wider mb-1">
          <span>{clothing.brand}</span>
          <span className="text-earth-400 font-normal capitalize">Size: {clothing.size}</span>
        </div>

        <h3 className="font-semibold text-earth-900 line-clamp-1 text-base group-hover:text-forest-700 transition">
          {clothing.title}
        </h3>

        {/* Location & Category */}
        <div className="flex items-center gap-1.5 text-xs text-earth-500 mt-1.5 mb-3">
          <MapPin className="w-3.5 h-3.5 text-earth-400 shrink-0" />
          <span className="truncate">
            {clothing.city}, {clothing.state}
          </span>
          <span className="text-earth-300">•</span>
          <span className="truncate">{clothing.category}</span>
        </div>

        {/* Pricing / Swap value & Action */}
        <div className="mt-auto pt-3 border-t border-earth-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-earth-400 block font-medium">Estimated Swap Value</span>
            <span className="text-base font-bold text-forest-700">
              {formatINR(clothing.estimatedSwapValue)}
            </span>
          </div>

          <Link
            to={`/clothing/${clothing._id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-xl bg-forest-50 hover:bg-forest-600 text-forest-700 hover:text-white transition duration-150"
          >
            View Details
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ClothingCard;
