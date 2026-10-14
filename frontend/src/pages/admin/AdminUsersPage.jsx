import React, { useState, useEffect } from 'react';
import { getAdminUsers, toggleUserStatus, deleteUser } from '../../services/adminService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { Search, Shield, UserX, UserCheck, Trash2, MapPin, Phone, Mail } from 'lucide-react';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (roleFilter !== 'All') params.role = roleFilter;
      if (statusFilter !== 'All') params.status = statusFilter;

      const res = await getAdminUsers(params);
      setUsers(res.users || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load user directory.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleToggleStatus = async (id) => {
    try {
      setActionLoading(id);
      const res = await toggleUserStatus(id);
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, isActive: res.user.isActive } : u))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Could not change user status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? Their listings will also be removed.')) {
      return;
    }
    try {
      setActionLoading(id);
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-earth-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-earth-900 tracking-tight">
            User Moderation
          </h1>
          <p className="text-xs sm:text-sm text-earth-500 mt-0.5">
            View registered members, manage active status, and audit user permissions
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-earth-200 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearch} className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-earth-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, city..."
            className="w-full pl-10 pr-20 py-2 rounded-xl border border-earth-200 text-xs text-earth-800 focus:outline-none focus:ring-2 focus:ring-forest-500"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1 px-3 py-1 bg-forest-600 hover:bg-forest-700 text-white text-xs font-semibold rounded-lg"
          >
            Find
          </button>
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-earth-200 bg-earth-50 text-earth-800 focus:outline-none"
          >
            <option value="All">All Roles</option>
            <option value="User">Standard Users</option>
            <option value="Admin">Administrators</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-earth-200 bg-earth-50 text-earth-800 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="active">Active Members</option>
            <option value="disabled">Disabled Accounts</option>
          </select>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchUsers} />}

      {loading ? (
        <LoadingSpinner message="Loading user directory..." />
      ) : (
        <div className="bg-white rounded-3xl border border-earth-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-earth-700">
              <thead className="bg-earth-50 text-[11px] font-bold text-earth-500 uppercase tracking-wider border-b border-earth-200">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Contact & Location</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-earth-100 font-medium">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-earth-50/60 transition">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-forest-100 text-forest-800 font-bold flex items-center justify-center shrink-0 overflow-hidden text-xs">
                        {u.profileImage ? (
                          <img src={u.profileImage} alt="" className="w-full h-full object-cover" />
                        ) : (
                          u.name?.charAt(0) || 'U'
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-earth-900 block text-xs">{u.name}</span>
                        <span className="text-[11px] text-earth-400">{u.email}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-0.5 text-[11px]">
                        <span className="flex items-center gap-1 text-earth-600">
                          <MapPin className="w-3 h-3 text-forest-600" />
                          {u.city}, {u.state}
                        </span>
                        <span className="flex items-center gap-1 text-earth-400">
                          <Phone className="w-3 h-3" />
                          {u.phone}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          u.role === 'Admin'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-earth-100 text-earth-700'
                        }`}
                      >
                        {u.role === 'Admin' && <Shield className="w-3 h-3" />}
                        {u.role}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          u.isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {u.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-earth-400 text-[11px]">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 text-right">
                      {u.role !== 'Admin' && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleStatus(u._id)}
                            disabled={actionLoading === u._id}
                            className={`p-1.5 rounded-lg border text-xs font-semibold transition ${
                              u.isActive
                                ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
                                : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                            }`}
                            title={u.isActive ? 'Disable User' : 'Activate User'}
                          >
                            {u.isActive ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={() => handleDelete(u._id)}
                            disabled={actionLoading === u._id}
                            className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition"
                            title="Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
