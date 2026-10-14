import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { User, Phone, MapPin, Mail, Image, Save, CheckCircle2 } from 'lucide-react';
import ErrorMessage from '../components/common/ErrorMessage';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    city: user?.city || '',
    state: user?.state || '',
    profileImage: user?.profileImage || ''
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError('');
      setSuccess(false);
      const res = await api.put('/users/profile', formData);
      updateUser(res.data.user);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="pb-4 border-b border-earth-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-earth-900 tracking-tight">
          My Profile & Settings
        </h1>
        <p className="text-xs sm:text-sm text-earth-500 mt-0.5">
          Update your location and contact details for seamless local barter matching
        </p>
      </div>

      {error && <ErrorMessage message={error} />}

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-4 flex items-center gap-3 text-sm font-semibold animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-earth-200 shadow-sm p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar preview */}
          <div className="flex items-center gap-4 pb-6 border-b border-earth-100">
            <div className="w-16 h-16 rounded-2xl bg-forest-100 text-forest-800 font-extrabold text-xl flex items-center justify-center overflow-hidden border border-forest-200 shrink-0 shadow-sm">
              {formData.profileImage ? (
                <img
                  src={formData.profileImage}
                  alt={formData.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                formData.name?.charAt(0) || 'U'
              )}
            </div>
            <div>
              <h3 className="font-bold text-earth-900 text-base">{user?.name}</h3>
              <p className="text-xs text-earth-400">{user?.email}</p>
              <span className="inline-block mt-1 text-[11px] font-semibold text-forest-700 bg-forest-50 px-2 py-0.5 rounded-full border border-forest-200">
                {user?.role} Account
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-earth-700 uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-earth-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-earth-300 text-sm focus:ring-2 focus:ring-forest-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-earth-700 uppercase tracking-wider mb-1.5">
                Email Address (Cannot change)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-earth-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-earth-200 bg-earth-50 text-earth-500 text-sm cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-earth-700 uppercase tracking-wider mb-1.5">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-earth-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="text"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-earth-300 text-sm focus:ring-2 focus:ring-forest-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-earth-700 uppercase tracking-wider mb-1.5">
                Profile Photo URL
              </label>
              <div className="relative">
                <Image className="w-4 h-4 text-earth-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="url"
                  name="profileImage"
                  value={formData.profileImage}
                  onChange={handleChange}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-earth-300 text-sm focus:ring-2 focus:ring-forest-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-earth-700 uppercase tracking-wider mb-1.5">
                City * (Used for "Near Me" matching)
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-earth-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Nagpur"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-earth-300 text-sm focus:ring-2 focus:ring-forest-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-earth-700 uppercase tracking-wider mb-1.5">
                State *
              </label>
              <input
                type="text"
                name="state"
                required
                value={formData.state}
                onChange={handleChange}
                placeholder="e.g. Maharashtra"
                className="w-full px-3.5 py-2.5 rounded-xl border border-earth-300 text-sm focus:ring-2 focus:ring-forest-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-earth-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-forest-600 hover:bg-forest-700 text-white text-sm font-bold rounded-xl transition shadow-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Updating...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
