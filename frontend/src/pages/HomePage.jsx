import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getClothes } from '../services/clothingService';
import ClothingCard from '../components/clothing/ClothingCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Recycle,
  Leaf,
  Users,
  Repeat,
  Scale,
  MapPin,
  CheckCircle2
} from 'lucide-react';

const HomePage = () => {
  const [featuredClothes, setFeaturedClothes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await getClothes({ limit: 6, sort: 'newest' });
        setFeaturedClothes(res.clothes || []);
      } catch (err) {
        console.error('Failed to load featured clothes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest-100/80 border border-forest-200 text-forest-800 text-xs font-semibold">
                <Leaf className="w-3.5 h-3.5 text-forest-600" />
                <span>Sustainable Barter Fashion Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-earth-900 tracking-tight leading-[1.15]">
                Give Your Clothes a{' '}
                <span className="text-forest-600 underline decoration-forest-300 decoration-wavy underline-offset-8">
                  Second Life.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-earth-600 max-w-xl leading-relaxed">
                Swap pre-loved clothes you no longer wear with trusted members across India. Zero mandatory money, fair rule-based barter estimates, and zero textile waste in landfills.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/browse"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5"
                >
                  Browse Clothes
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/clothing/add"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-earth-50 text-earth-800 border border-earth-300 font-semibold text-sm shadow-xs transition"
                >
                  List Your Clothes
                </Link>
              </div>

              {/* Quick trust metrics */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-earth-200/80 max-w-lg">
                <div>
                  <span className="text-2xl font-extrabold text-forest-700 block">100%</span>
                  <span className="text-xs text-earth-500 font-medium">Cashless Barter</span>
                </div>
                <div>
                  <span className="text-2xl font-extrabold text-forest-700 block">10k+ L</span>
                  <span className="text-xs text-earth-500 font-medium">Water Conserved</span>
                </div>
                <div>
                  <span className="text-2xl font-extrabold text-forest-700 block">7+ Cities</span>
                  <span className="text-xs text-earth-500 font-medium">Local Exchanges</span>
                </div>
              </div>
            </div>

            {/* Right Column Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative background glow */}
                <div className="absolute -inset-2 bg-gradient-to-r from-forest-200 to-emerald-100 rounded-3xl blur-xl opacity-60"></div>

                <div className="relative rounded-3xl overflow-hidden border border-earth-200 bg-white shadow-xl p-3">
                  <img
                    src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80"
                    alt="Sustainable Clothing Rack"
                    className="w-full h-80 object-cover rounded-2xl"
                  />
                  {/* Floating Eco Badge */}
                  <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-earth-200/80 shadow-lg flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-forest-600 text-white flex items-center justify-center shrink-0">
                      <Recycle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-earth-900">Equal Barter Value System</p>
                      <p className="text-[11px] text-earth-500">
                        Compare estimated swap values side-by-side and negotiate transparently.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-16 border-y border-earth-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-forest-600 uppercase tracking-wider">
              Simple 3-Step Process
            </span>
            <h2 className="text-3xl font-extrabold text-earth-900 mt-1">
              How ClothSwap Works
            </h2>
            <p className="text-sm text-earth-500 mt-2">
              No price tags or money required. Trade clothing with fellow fashion lovers in just three effortless steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-earth-50/70 p-6 rounded-2xl border border-earth-200/80 relative">
              <div className="w-12 h-12 rounded-2xl bg-forest-100 text-forest-700 font-extrabold text-lg flex items-center justify-center mb-4">
                1
              </div>
              <h3 className="text-lg font-bold text-earth-800 mb-2">List Your Clothes</h3>
              <p className="text-xs text-earth-600 leading-relaxed">
                Upload clear photos, select condition and brand. Our built-in calculator automatically estimates a fair swap value.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-earth-50/70 p-6 rounded-2xl border border-earth-200/80 relative">
              <div className="w-12 h-12 rounded-2xl bg-forest-100 text-forest-700 font-extrabold text-lg flex items-center justify-center mb-4">
                2
              </div>
              <h3 className="text-lg font-bold text-earth-800 mb-2">Offer & Negotiate</h3>
              <p className="text-xs text-earth-600 leading-relaxed">
                Browse nearby listings. Select one of your own clothes to offer in exchange, inspect the value difference, and chat in private.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-earth-50/70 p-6 rounded-2xl border border-earth-200/80 relative">
              <div className="w-12 h-12 rounded-2xl bg-forest-100 text-forest-700 font-extrabold text-lg flex items-center justify-center mb-4">
                3
              </div>
              <h3 className="text-lg font-bold text-earth-800 mb-2">Confirm & Swap</h3>
              <p className="text-xs text-earth-600 leading-relaxed">
                Both members confirm the agreement. Hand off locally in your city or ship via courier. Mark as completed and refresh your wardrobe!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Clothing Items */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-forest-600 uppercase tracking-wider">
              Fresh Discoveries
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-earth-900 mt-1">
              Featured Clothing Listings
            </h2>
            <p className="text-xs sm:text-sm text-earth-500 mt-1">
              Pre-loved jackets, kurtis, denim, dresses and more ready for an exchange.
            </p>
          </div>

          <Link
            to="/browse"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-700 hover:text-forest-800 bg-forest-50 px-4 py-2 rounded-xl border border-forest-200 hover:bg-forest-100 transition"
          >
            View All Clothes
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading latest clothing items..." />
        ) : featuredClothes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-earth-200">
            <p className="text-sm text-earth-500">No clothing items listed yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredClothes.map((clothing) => (
              <ClothingCard key={clothing._id} clothing={clothing} />
            ))}
          </div>
        )}
      </section>

      {/* Sustainability Impact Statistics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-forest-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-forest-300">
              Environmental Stewardship
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-2 mb-4 leading-tight">
              Why Clothing Swap Outperforms Fast Fashion
            </h2>
            <p className="text-xs sm:text-sm text-forest-100 leading-relaxed mb-8">
              Producing a single cotton shirt takes roughly 2,700 liters of water — enough for one person to drink for 2.5 years. By swapping and wearing pre-loved clothing, you keep quality textiles out of landfills and dramatically slash greenhouse carbon emissions.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-forest-800">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-forest-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-base block text-white">82% Less Waste</span>
                  <span className="text-xs text-forest-200">Extends fabric lifespan by 2.2 years</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-forest-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-base block text-white">Zero Rupee Cost</span>
                  <span className="text-xs text-forest-200">Direct peer barter swap system</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-forest-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-base block text-white">Hyper-Local Trade</span>
                  <span className="text-xs text-forest-200">Connect with fashion neighbors</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
