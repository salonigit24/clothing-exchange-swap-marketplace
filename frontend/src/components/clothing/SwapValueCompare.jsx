import React from 'react';
import { ArrowDownUp, Info } from 'lucide-react';
import { formatINR } from '../../utils/calculator';

const SwapValueCompare = ({ offeredItem, requestedItem }) => {
  if (!offeredItem || !requestedItem) return null;

  const offeredVal = offeredItem.estimatedSwapValue || 0;
  const requestedVal = requestedItem.estimatedSwapValue || 0;
  const diff = Math.abs(offeredVal - requestedVal);

  const getComparisonNote = () => {
    if (offeredVal === requestedVal) {
      return 'Values are balanced! Ideal 1:1 barter trade.';
    } else if (offeredVal > requestedVal) {
      return `Your item has ~${formatINR(diff)} higher estimated value.`;
    } else {
      return `Requested item has ~${formatINR(diff)} higher estimated value.`;
    }
  };

  return (
    <div className="bg-earth-50/70 rounded-2xl border border-earth-200 p-5 my-4">
      <div className="text-center font-bold text-xs uppercase tracking-wider text-earth-500 mb-4">
        Swap Value Comparison
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center relative">
        {/* Your Item */}
        <div className="bg-white p-4 rounded-xl border border-earth-200/90 shadow-sm flex items-center gap-3">
          {offeredItem.images?.[0] && (
            <img
              src={
                offeredItem.images[0].startsWith('http')
                  ? offeredItem.images[0]
                  : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${offeredItem.images[0]}`
              }
              alt={offeredItem.title}
              className="w-14 h-14 rounded-lg object-cover bg-earth-100 shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <span className="text-[11px] font-bold text-forest-700 uppercase tracking-wide block">
              Your Offered Item
            </span>
            <h4 className="font-semibold text-sm text-earth-800 truncate">
              {offeredItem.title}
            </h4>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-xs text-earth-400">Estimated Value:</span>
              <span className="text-sm font-bold text-earth-900">
                {formatINR(offeredVal)}
              </span>
            </div>
          </div>
        </div>

        {/* Center comparison arrow indicator */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-forest-600 text-white items-center justify-center shadow">
          <ArrowDownUp className="w-4 h-4" />
        </div>

        {/* Requested Item */}
        <div className="bg-white p-4 rounded-xl border border-earth-200/90 shadow-sm flex items-center gap-3">
          {requestedItem.images?.[0] && (
            <img
              src={
                requestedItem.images[0].startsWith('http')
                  ? requestedItem.images[0]
                  : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${requestedItem.images[0]}`
              }
              alt={requestedItem.title}
              className="w-14 h-14 rounded-lg object-cover bg-earth-100 shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wide block">
              Requested Item
            </span>
            <h4 className="font-semibold text-sm text-earth-800 truncate">
              {requestedItem.title}
            </h4>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-xs text-earth-400">Estimated Value:</span>
              <span className="text-sm font-bold text-earth-900">
                {formatINR(requestedVal)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Difference summary banner */}
      <div className="mt-4 pt-3 border-t border-earth-200/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-earth-700">Value Difference:</span>
          <span className="font-bold text-forest-700 bg-forest-50 px-2.5 py-1 rounded-lg border border-forest-200">
            {formatINR(diff)}
          </span>
          <span className="inline-flex items-center text-[11px] font-medium bg-earth-100 text-earth-700 px-2 py-0.5 rounded-full">
            Negotiable
          </span>
        </div>
        <p className="text-earth-500 text-[11px]">{getComparisonNote()}</p>
      </div>

      {/* Mandatory legal/guideline disclaimer */}
      <div className="mt-3 flex items-start gap-1.5 text-[11px] text-earth-400 bg-white/60 p-2.5 rounded-lg border border-earth-100">
        <Info className="w-3.5 h-3.5 text-forest-600 shrink-0 mt-0.5" />
        <span>
          Swap values are estimates and are intended only to help users compare items. Values are estimates and users can freely negotiate terms.
        </span>
      </div>
    </div>
  );
};

export default SwapValueCompare;
