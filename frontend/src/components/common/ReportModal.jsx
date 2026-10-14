import React, { useState } from 'react';
import Modal from './Modal';
import { createReport } from '../../services/reportService';
import { Flag, CheckCircle } from 'lucide-react';

const ReportModal = ({ isOpen, onClose, clothingId, reportedUserId, itemName = 'this item' }) => {
  const [reason, setReason] = useState('Fake listing');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const reasons = [
    'Fake listing',
    'Inappropriate content',
    'Wrong information',
    'Damaged item',
    'Spam',
    'Other'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Please provide a brief explanation for your report.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await createReport({
        clothingId,
        reportedUserId,
        reason,
        description: description.trim()
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setDescription('');
        onClose();
      }, 1800);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Report ${itemName}`}>
      {success ? (
        <div className="text-center py-6">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h4 className="text-base font-semibold text-earth-800">Report Submitted</h4>
          <p className="text-sm text-earth-500 mt-1">
            Thank you for helping keep our sustainable fashion community safe. Our team will review this shortly.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 text-rose-700 text-sm rounded-xl border border-rose-200">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1">
              Reason for reporting
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-earth-300 bg-white text-earth-800 focus:outline-none focus:ring-2 focus:ring-forest-500"
            >
              {reasons.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1">
              Details & explanation
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide details describing what is wrong with this listing or user behavior..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-earth-300 bg-white text-earth-800 focus:outline-none focus:ring-2 focus:ring-forest-500 text-sm"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-earth-600 hover:text-earth-800 rounded-xl hover:bg-earth-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium rounded-xl transition shadow-sm disabled:opacity-50"
            >
              <Flag className="w-4 h-4" />
              {submitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default ReportModal;
