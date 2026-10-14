import React from 'react';
import { Link } from 'react-router-dom';
import { Shirt, Leaf, Heart, ShieldCheck, RefreshCw } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-earth-900 text-earth-300 border-t border-earth-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-forest-600 text-white flex items-center justify-center">
                <Shirt className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Cloth<span className="text-forest-400">Swap</span>
              </span>
            </div>
            <p className="text-xs text-earth-400 leading-relaxed">
              "Give Your Clothes a Second Life."
              <br />
              A sustainable barter marketplace to exchange pre-loved clothes, combat textile waste, and refresh your style money-free.
            </p>
            <div className="flex items-center gap-2 text-xs text-forest-400 font-medium">
              <Leaf className="w-4 h-4 text-forest-400" />
              <span>100% Circular Sustainable Fashion</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/browse" className="hover:text-forest-400 transition">
                  Browse All Clothes
                </Link>
              </li>
              <li>
                <Link to="/clothing/add" className="hover:text-forest-400 transition">
                  List Your Clothes
                </Link>
              </li>
              <li>
                <Link to="/browse?category=Jackets" className="hover:text-forest-400 transition">
                  Jackets & Coats
                </Link>
              </li>
              <li>
                <Link to="/browse?category=Dresses" className="hover:text-forest-400 transition">
                  Dresses & Sarees
                </Link>
              </li>
            </ul>
          </div>

          {/* Sustainability Mission */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Impact & Trust
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2 text-earth-400">
                <RefreshCw className="w-3.5 h-3.5 text-forest-400 shrink-0" />
                Zero-money barter exchanges
              </li>
              <li className="flex items-center gap-2 text-earth-400">
                <ShieldCheck className="w-3.5 h-3.5 text-forest-400 shrink-0" />
                Verified member profiles
              </li>
              <li className="flex items-center gap-2 text-earth-400">
                <Heart className="w-3.5 h-3.5 text-forest-400 shrink-0" />
                Reduces landfill textile pollution
              </li>
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Active Hubs
            </h4>
            <p className="text-xs text-earth-400 leading-relaxed">
              Nagpur • Mumbai • Pune • Bengaluru • Delhi • Hyderabad • Nashik
            </p>
            <div className="mt-4 p-3 bg-earth-800/80 rounded-xl border border-earth-700/60 text-[11px] text-earth-300">
              <span className="font-semibold text-white block">Local Swap Tip:</span>
              Filter by "Near Me" in browse to meet exchange partners nearby with zero shipping cost!
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-earth-800 flex flex-col sm:flex-row items-center justify-between text-xs text-earth-500 gap-4">
          <p>© {new Date().getFullYear()} ClothSwap (SwapWear) Marketplace. All rights reserved.</p>
          <p className="text-[11px] text-earth-500">
            Committed to United Nations SDG 12: Responsible Consumption and Production.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
