import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'No items found',
  description = 'There are currently no items matching your criteria.',
  actionLabel,
  actionLink,
  onAction
}) => {
  return (
    <div className="text-center py-16 px-4 bg-white rounded-2xl border border-earth-200/80 my-6 shadow-sm">
      <div className="w-16 h-16 bg-forest-50 text-forest-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-earth-800">{title}</h3>
      <p className="text-sm text-earth-500 max-w-md mx-auto mt-1 mb-6">
        {description}
      </p>
      {actionLink && actionLabel && (
        <Link
          to={actionLink}
          className="inline-flex items-center gap-2 bg-forest-600 hover:bg-forest-700 text-white font-medium px-5 py-2.5 rounded-xl transition shadow-sm hover:shadow"
        >
          {actionLabel}
        </Link>
      )}
      {onAction && actionLabel && !actionLink && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 bg-forest-600 hover:bg-forest-700 text-white font-medium px-5 py-2.5 rounded-xl transition shadow-sm hover:shadow"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
