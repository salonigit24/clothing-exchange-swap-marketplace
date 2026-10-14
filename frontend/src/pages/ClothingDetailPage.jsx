import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getClothingById, deleteClothing } from '../services/clothingService';
import { saveItem, removeSavedItem } from '../services/savedService';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/common/StatusBadge';
import SwapRequestModal from '../components/swaps/SwapRequestModal';
import ReportModal from '../components/common/ReportModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { formatINR } from '../utils/calculator';
import {
  MapPin,
  Calendar,
  Heart,
  Repeat,
  Flag,
  Edit,
  Trash2,
  Info,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';

const ClothingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [clothing, setClothing] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [swapModalOpen, setSwapModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchItemDetails();
  }, [id]);

  const fetchItemDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getClothingById(id);
      setClothing(res.clothing);
      setIsSaved(res.clothing?.isSaved || false);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load item details.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSave = async () => {
    if (!user) {
      alert('Please log in to save items to your favorites.');
      return;
    }
    try {
      if (isSaved) {
        await removeSavedItem(clothing._id);
        setIsSaved(false);
      } else {
        await saveItem(clothing._id);
        setIsSaved(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      return;
    }
    try {
      setDeleting(true);
      await deleteClothing(clothing._id);
      navigate('/clothing/my-listings');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete listing.');
      setDeleting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading clothing details..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchItemDetails} />;
  if (!clothing) return null;

  const isOwner = user && clothing.owner && user._id === clothing.owner._id;

  const images = clothing.images && clothing.images.length > 0 ? clothing.images : ['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80'];

  const getFullImageUrl = (img) => {
    if (img.startsWith('http')) return img;
    return `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${img}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-earth-600 hover:text-earth-900 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to browse
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-earth-100 border border-earth-200 shadow-sm">
            <img
              src={getFullImageUrl(images[activeImageIndex])}
              alt={clothing.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
              <StatusBadge status={clothing.status} />
              {clothing.isNearby && <StatusBadge status="Nearby" />}
            </div>
            <div className="absolute bottom-4 left-4">
              <StatusBadge status={clothing.condition} />
            </div>
          </div>

          {/* Thumbnails if multiple images */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition ${
                    activeImageIndex === idx
                      ? 'border-forest-600 shadow-sm'
                      : 'border-earth-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={getFullImageUrl(img)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details & Swap Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-forest-700 uppercase tracking-wider mb-1">
              <span>{clothing.brand}</span>
              <span className="text-earth-400 font-normal">Listed in {clothing.category}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-earth-900 tracking-tight">
              {clothing.title}
            </h1>
            <div className="flex items-center gap-2 text-xs text-earth-500 mt-2">
              <MapPin className="w-4 h-4 text-forest-600 shrink-0" />
              <span>
                {clothing.city}, {clothing.state}
              </span>
              <span className="text-earth-300">•</span>
              <Calendar className="w-4 h-4 text-earth-400 shrink-0" />
              <span>Listed on {new Date(clothing.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Estimated Swap Value Banner */}
          <div className="bg-forest-50/80 border border-forest-200 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-forest-800 uppercase tracking-wider block">
                Estimated Swap Value
              </span>
              <span className="text-3xl font-extrabold text-forest-700">
                {formatINR(clothing.estimatedSwapValue)}
              </span>
              <span className="text-[11px] text-earth-500 block mt-0.5">
                Original Retail: {formatINR(clothing.originalPrice)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-earth-700 bg-white px-3 py-1 rounded-full border border-forest-200 shadow-xs inline-block">
                Barter Match
              </span>
              <span className="text-[11px] text-earth-400 block mt-1">Rule-based Estimate</span>
            </div>
          </div>

          {/* Specs grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-earth-200 text-xs">
            <div>
              <span className="text-earth-400 block font-medium">Size</span>
              <span className="font-bold text-earth-800 text-sm">{clothing.size}</span>
            </div>
            <div>
              <span className="text-earth-400 block font-medium">Gender</span>
              <span className="font-bold text-earth-800 text-sm">{clothing.gender}</span>
            </div>
            <div>
              <span className="text-earth-400 block font-medium">Color</span>
              <span className="font-bold text-earth-800 text-sm">{clothing.color}</span>
            </div>
            <div>
              <span className="text-earth-400 block font-medium">Condition</span>
              <span className="font-bold text-earth-800 text-sm">{clothing.condition}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-earth-800 mb-2">Item Description</h3>
            <p className="text-sm text-earth-600 leading-relaxed bg-white p-4 rounded-2xl border border-earth-200">
              {clothing.description}
            </p>
          </div>

          {/* Owner Info Box */}
          <div className="bg-earth-50/80 p-4 rounded-2xl border border-earth-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-forest-100 text-forest-800 font-bold flex items-center justify-center text-sm overflow-hidden border border-forest-200">
                {clothing.owner?.profileImage ? (
                  <img src={clothing.owner.profileImage} alt="" className="w-full h-full object-cover" />
                ) : (
                  clothing.owner?.name?.charAt(0) || 'U'
                )}
              </div>
              <div>
                <span className="text-xs text-earth-400 block font-medium">Item Owner</span>
                <span className="text-sm font-bold text-earth-900">{clothing.owner?.name}</span>
                <span className="text-xs text-earth-500 block">
                  {clothing.owner?.city}, {clothing.owner?.state}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Verified Swapper
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-2">
            {!isOwner ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    if (!user) {
                      navigate('/login');
                      return;
                    }
                    if (clothing.status !== 'Available') {
                      alert('This item is currently not available for new swaps.');
                      return;
                    }
                    setSwapModalOpen(true);
                  }}
                  disabled={clothing.status !== 'Available'}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-semibold text-sm shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Repeat className="w-4 h-4" />
                  {clothing.status === 'Available' ? 'Request Swap' : 'Currently Unavailable'}
                </button>

                <button
                  onClick={handleToggleSave}
                  className={`inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl border text-sm font-semibold transition ${
                    isSaved
                      ? 'border-rose-300 bg-rose-50 text-rose-700'
                      : 'border-earth-300 bg-white text-earth-700 hover:bg-earth-50'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-600 text-rose-600' : ''}`} />
                  {isSaved ? 'Saved' : 'Save'}
                </button>

                <button
                  onClick={() => {
                    if (!user) {
                      navigate('/login');
                      return;
                    }
                    setReportModalOpen(true);
                  }}
                  className="p-3.5 rounded-xl border border-earth-300 bg-white text-earth-500 hover:text-rose-600 hover:bg-rose-50 transition"
                  title="Report Listing"
                >
                  <Flag className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Owner Actions */
              <div className="flex gap-3">
                <Link
                  to={`/clothing/${clothing._id}/edit`}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-semibold text-sm transition"
                >
                  <Edit className="w-4 h-4" />
                  Edit Listing
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-sm transition disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <SwapRequestModal
        isOpen={swapModalOpen}
        onClose={() => setSwapModalOpen(false)}
        targetClothing={clothing}
      />

      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        clothingId={clothing._id}
        reportedUserId={clothing.owner?._id}
        itemName={clothing.title}
      />
    </div>
  );
};

export default ClothingDetailPage;
