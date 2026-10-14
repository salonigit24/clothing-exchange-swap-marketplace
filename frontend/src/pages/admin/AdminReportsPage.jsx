import React, { useState, useEffect } from 'react';
import { getAdminReports, updateAdminReport } from '../../services/adminService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import Modal from '../../components/common/Modal';
import { Flag, CheckCircle, Clock, XCircle, AlertTriangle, UserX, EyeOff, ShieldCheck } from 'lucide-react';

const AdminReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Selected report for modal review
  const [selectedReport, setSelectedReport] = useState(null);
  const [adminResponse, setAdminResponse] = useState('');
  const [newStatus, setNewStatus] = useState('Reviewing');
  const [actionOnItem, setActionOnItem] = useState('');
  const [actionOnUser, setActionOnUser] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchReports();
  }, [statusFilter]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter;

      const res = await getAdminReports(params);
      setReports(res.reports || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to retrieve reports.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReview = (report) => {
    setSelectedReport(report);
    setNewStatus(report.status);
    setAdminResponse(report.adminResponse || '');
    setActionOnItem('');
    setActionOnUser('');
  };

  const handleSaveResolution = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateAdminReport(selectedReport._id, {
        status: newStatus,
        adminResponse,
        actionOnItem: actionOnItem || undefined,
        actionOnUser: actionOnUser || undefined
      });
      setSelectedReport(null);
      fetchReports();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update report resolution');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-earth-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-earth-900 tracking-tight">
            Safety & Moderation Reports
          </h1>
          <p className="text-xs sm:text-sm text-earth-500 mt-0.5">
            Audit reported items and users to safeguard the integrity of the clothing exchange
          </p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl border border-earth-200 bg-white text-earth-800 focus:outline-none"
        >
          <option value="All">All Reports</option>
          <option value="Pending">Pending Review</option>
          <option value="Reviewing">In Review</option>
          <option value="Resolved">Resolved</option>
          <option value="Rejected">Rejected / Dismissed</option>
        </select>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchReports} />}

      {loading ? (
        <LoadingSpinner message="Loading safety reports..." />
      ) : reports.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-earth-200">
          <ShieldCheck className="w-12 h-12 text-forest-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-earth-900">Zero Pending Safety Reports</h3>
          <p className="text-xs text-earth-500 mt-1">
            Community moderation queue is clean and healthy!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((r) => (
            <div
              key={r._id}
              className="bg-white p-5 rounded-2xl border border-earth-200/90 shadow-xs hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                    {r.reason}
                  </span>
                  <span className="text-xs text-earth-400">
                    Reported by {r.reporter?.name} on {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-xs text-earth-700 font-medium line-clamp-2 mt-1">
                  "{r.description}"
                </p>

                <div className="text-[11px] text-earth-500 pt-1">
                  Target:{' '}
                  {r.clothing ? (
                    <strong className="text-earth-800 font-semibold">Clothing Item: {r.clothing?.title}</strong>
                  ) : (
                    <strong className="text-earth-800 font-semibold">User: {r.reportedUser?.name}</strong>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    r.status === 'Pending'
                      ? 'bg-amber-100 text-amber-800'
                      : r.status === 'Reviewing'
                      ? 'bg-blue-100 text-blue-800'
                      : r.status === 'Resolved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-earth-100 text-earth-600'
                  }`}
                >
                  {r.status}
                </span>

                <button
                  onClick={() => handleOpenReview(r)}
                  className="px-4 py-2 bg-forest-600 hover:bg-forest-700 text-white text-xs font-bold rounded-xl transition shadow-xs"
                >
                  Review & Resolve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {selectedReport && (
        <Modal
          isOpen={!!selectedReport}
          onClose={() => setSelectedReport(null)}
          title="Review Safety Report"
          maxWidth="max-w-xl"
        >
          <form onSubmit={handleSaveResolution} className="space-y-4">
            <div className="bg-earth-50 p-4 rounded-xl text-xs space-y-2 border border-earth-200">
              <p>
                <strong className="text-earth-800">Reporter:</strong> {selectedReport.reporter?.name} ({selectedReport.reporter?.email})
              </p>
              <p>
                <strong className="text-earth-800">Violation Reason:</strong> {selectedReport.reason}
              </p>
              <p>
                <strong className="text-earth-800">User Report Statement:</strong> {selectedReport.description}
              </p>
              {selectedReport.clothing && (
                <p>
                  <strong className="text-earth-800">Reported Clothing:</strong> {selectedReport.clothing?.title} (Owner: {selectedReport.clothing?.owner?.name})
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-earth-700 uppercase tracking-wider mb-1.5">
                Update Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-earth-300 bg-white focus:outline-none"
              >
                <option value="Pending">Pending</option>
                <option value="Reviewing">Reviewing</option>
                <option value="Resolved">Resolved</option>
                <option value="Rejected">Rejected / Dismissed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-earth-700 uppercase tracking-wider mb-1.5">
                Admin Response / Audit Notes
              </label>
              <textarea
                rows={3}
                value={adminResponse}
                onChange={(e) => setAdminResponse(e.target.value)}
                placeholder="Explain the resolution or notes taken for safety compliance..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-earth-300 focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
            </div>

            {/* Optional Enforcement Actions */}
            <div className="bg-rose-50/70 p-4 rounded-xl border border-rose-200 space-y-2">
              <span className="text-xs font-bold text-rose-900 block">
                Administrative Enforcement Actions (Optional)
              </span>

              {selectedReport.clothing && (
                <label className="flex items-center gap-2 text-xs text-rose-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={actionOnItem === 'hide'}
                    onChange={(e) => setActionOnItem(e.target.checked ? 'hide' : '')}
                    className="text-rose-600 focus:ring-rose-500 rounded"
                  />
                  <span>Take down clothing listing (set status to Unavailable)</span>
                </label>
              )}

              {selectedReport.reportedUser && (
                <label className="flex items-center gap-2 text-xs text-rose-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={actionOnUser === 'deactivate'}
                    onChange={(e) => setActionOnUser(e.target.checked ? 'deactivate' : '')}
                    className="text-rose-600 focus:ring-rose-500 rounded"
                  />
                  <span>Deactivate reported user account</span>
                </label>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-earth-100">
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 text-xs font-medium text-earth-600 hover:text-earth-900 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 bg-forest-600 hover:bg-forest-700 text-white text-xs font-bold rounded-xl transition shadow-xs disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Resolution'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AdminReportsPage;
