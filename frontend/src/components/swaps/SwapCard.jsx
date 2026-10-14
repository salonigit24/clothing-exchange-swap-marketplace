import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';
import { formatINR } from '../../utils/calculator';
import { MessageSquare, ArrowRight, Check, X, Ban } from 'lucide-react';

const SwapCard = ({
  swap,
  type = 'incoming', // 'incoming' | 'sent' | 'history'
  onAccept,
  onReject,
  onCancel,
  actionLoading = false
}) => {
  const isIncoming = type === 'incoming';
  const partnerUser = isIncoming ? swap.requester : swap.owner;

  const getImage = (item) => {
    if (!item?.images?.[0]) return 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=400&q=80';
    return item.images[0].startsWith('http')
      ? item.images[0]
      : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${item.images[0]}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-earth-200/90 p-5 shadow-sm hover:shadow-md transition flex flex-col gap-4">
      {/* Top Header: Partner info and status badge */}
      <div className="flex items-center justify-between pb-3 border-b border-earth-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-forest-100 text-forest-800 font-bold flex items-center justify-center text-xs overflow-hidden">
            {partnerUser?.profileImage ? (
              <img src={partnerUser.profileImage} alt={partnerUser.name} className="w-full h-full object-cover" />
            ) : (
              partnerUser?.name?.charAt(0) || 'U'
            )}
          </div>
          <div>
            <span className="text-xs text-earth-400 block font-medium">
              {isIncoming ? 'Requested by' : 'Sent to'}
            </span>
            <span className="text-sm font-bold text-earth-800">{partnerUser?.name}</span>
            <span className="text-xs text-earth-500 ml-1">
              ({partnerUser?.city}, {partnerUser?.state})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={swap.status} />
        </div>
      </div>

      {/* Middle: Both items visual preview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-earth-50/60 p-3 rounded-xl border border-earth-100">
        {/* Offered Item */}
        <div className="flex items-center gap-2.5">
          <img
            src={getImage(swap.offeredItem)}
            alt={swap.offeredItem?.title}
            className="w-12 h-12 rounded-lg object-cover bg-earth-200 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <span className="text-[10px] uppercase font-bold text-earth-400 block">Offered</span>
            <p className="text-xs font-semibold text-earth-800 truncate">{swap.offeredItem?.title}</p>
            <span className="text-xs text-forest-700 font-bold">{formatINR(swap.offeredValue)}</span>
          </div>
        </div>

        {/* Requested Item */}
        <div className="flex items-center gap-2.5 border-t sm:border-t-0 sm:border-l border-earth-200/60 pt-2 sm:pt-0 sm:pl-3">
          <img
            src={getImage(swap.requestedItem)}
            alt={swap.requestedItem?.title}
            className="w-12 h-12 rounded-lg object-cover bg-earth-200 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <span className="text-[10px] uppercase font-bold text-earth-400 block">Requested</span>
            <p className="text-xs font-semibold text-earth-800 truncate">{swap.requestedItem?.title}</p>
            <span className="text-xs text-forest-700 font-bold">{formatINR(swap.requestedValue)}</span>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
        <span className="text-xs text-earth-400">
          Created: {new Date(swap.createdAt).toLocaleDateString()}
        </span>

        <div className="flex items-center gap-2">
          {/* Incoming Actions when Pending */}
          {isIncoming && swap.status === 'Pending' && (
            <>
              <button
                onClick={() => onAccept(swap._id)}
                disabled={actionLoading}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-forest-600 hover:bg-forest-700 text-white text-xs font-semibold rounded-xl transition shadow-sm disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5" />
                Accept
              </button>
              <button
                onClick={() => onReject(swap._id)}
                disabled={actionLoading}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl transition disabled:opacity-50"
              >
                <X className="w-3.5 h-3.5" />
                Reject
              </button>
            </>
          )}

          {/* Sent Actions when Pending */}
          {!isIncoming && swap.status === 'Pending' && onCancel && (
            <button
              onClick={() => onCancel(swap._id)}
              disabled={actionLoading}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-earth-100 hover:bg-earth-200 text-earth-700 text-xs font-semibold rounded-xl transition disabled:opacity-50"
            >
              <Ban className="w-3.5 h-3.5" />
              Cancel Request
            </button>
          )}

          {/* Open Chat / Negotiation Detail */}
          <Link
            to={`/swaps/${swap._id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-forest-50 hover:bg-forest-600 text-forest-700 hover:text-white text-xs font-semibold rounded-xl transition"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Chat & Details
            <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SwapCard;
