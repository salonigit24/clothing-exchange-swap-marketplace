import React from 'react';
import { MapPin, CheckCircle, Clock, XCircle, ArrowLeftRight, CheckCheck } from 'lucide-react';

const StatusBadge = ({ status, type = 'clothing' }) => {
  const getBadgeStyle = () => {
    switch (status) {
      // Clothing statuses
      case 'Available':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Swap Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Swapped':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Unavailable':
        return 'bg-gray-100 text-gray-600 border-gray-200';

      // Swap request statuses
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Accepted':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Negotiating':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Confirmed':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Completed':
        return 'bg-forest-50 text-forest-700 border-forest-300 font-semibold';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Cancelled':
        return 'bg-slate-100 text-slate-600 border-slate-200';

      // Conditions
      case 'Like New':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'Excellent':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Good':
        return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'Fair':
        return 'bg-amber-50 text-amber-800 border-amber-200';

      // Proximity
      case 'Nearby':
        return 'bg-forest-100 text-forest-800 border-forest-300 font-medium';

      default:
        return 'bg-earth-100 text-earth-700 border-earth-200';
    }
  };

  const getIcon = () => {
    if (status === 'Nearby') return <MapPin className="w-3 h-3 mr-1 inline" />;
    if (status === 'Completed') return <CheckCheck className="w-3 h-3 mr-1 inline" />;
    if (status === 'Confirmed') return <CheckCircle className="w-3 h-3 mr-1 inline" />;
    if (status === 'Pending') return <Clock className="w-3 h-3 mr-1 inline" />;
    if (status === 'Rejected' || status === 'Cancelled') return <XCircle className="w-3 h-3 mr-1 inline" />;
    if (status === 'Negotiating' || status === 'Swap Pending') return <ArrowLeftRight className="w-3 h-3 mr-1 inline" />;
    return null;
  };

  return (
    <span
      className={`inline-flex items-center text-xs px-2.5 py-0.5 rounded-full border ${getBadgeStyle()}`}
    >
      {getIcon()}
      {status === 'Nearby' ? 'Nearby Swap' : status}
    </span>
  );
};

export default StatusBadge;
