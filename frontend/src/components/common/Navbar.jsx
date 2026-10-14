import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Shirt,
  Menu,
  X,
  PlusCircle,
  Heart,
  Repeat,
  LayoutDashboard,
  User as UserIcon,
  LogOut,
  ShieldAlert,
  Users,
  Layers,
  Flag
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setProfileDropdown(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition py-1.5 px-3 rounded-lg ${
      isActive
        ? 'text-forest-700 bg-forest-50 font-semibold'
        : 'text-earth-600 hover:text-forest-700 hover:bg-earth-100/60'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-earth-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-forest-600 text-white flex items-center justify-center shadow-sm group-hover:bg-forest-700 transition">
              <Shirt className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-earth-900 group-hover:text-forest-800 transition">
                Cloth<span className="text-forest-600">Swap</span>
              </span>
              <span className="hidden sm:block text-[10px] text-earth-400 font-semibold uppercase tracking-wider -mt-1">
                Sustainable Fashion
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {!isAdmin ? (
              <>
                <NavLink to="/" className={navLinkClass}>
                  Home
                </NavLink>
                <NavLink to="/browse" className={navLinkClass}>
                  Browse Clothes
                </NavLink>

                {user && (
                  <>
                    <NavLink to="/clothing/my-listings" className={navLinkClass}>
                      My Listings
                    </NavLink>
                    <NavLink to="/swaps" className={navLinkClass}>
                      My Swaps
                    </NavLink>
                    <NavLink to="/saved" className={navLinkClass}>
                      Saved
                    </NavLink>
                    <NavLink to="/dashboard" className={navLinkClass}>
                      Dashboard
                    </NavLink>
                  </>
                )}
              </>
            ) : (
              /* Admin Specific Navigation */
              <>
                <NavLink to="/admin/dashboard" className={navLinkClass}>
                  <LayoutDashboard className="w-4 h-4 mr-1 inline" />
                  Dashboard
                </NavLink>
                <NavLink to="/admin/users" className={navLinkClass}>
                  <Users className="w-4 h-4 mr-1 inline" />
                  Users
                </NavLink>
                <NavLink to="/admin/clothing" className={navLinkClass}>
                  <Layers className="w-4 h-4 mr-1 inline" />
                  Listings
                </NavLink>
                <NavLink to="/admin/swaps" className={navLinkClass}>
                  <Repeat className="w-4 h-4 mr-1 inline" />
                  Swaps
                </NavLink>
                <NavLink to="/admin/reports" className={navLinkClass}>
                  <Flag className="w-4 h-4 mr-1 inline" />
                  Reports
                </NavLink>
              </>
            )}
          </nav>

          {/* Action buttons (Right) */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                {!isAdmin && (
                  <Link
                    to="/clothing/add"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-forest-600 hover:bg-forest-700 text-white text-xs font-semibold shadow-sm transition"
                  >
                    <PlusCircle className="w-4 h-4" />
                    List Clothes
                  </Link>
                )}

                {/* Profile dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdown(!profileDropdown)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-earth-100 transition"
                  >
                    <div className="w-8 h-8 rounded-full bg-forest-100 text-forest-800 font-bold flex items-center justify-center text-xs overflow-hidden border border-forest-200">
                      {user.profileImage ? (
                        <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        user.name?.charAt(0) || 'U'
                      )}
                    </div>
                    <span className="text-xs font-semibold text-earth-800 max-w-[100px] truncate">
                      {user.name.split(' ')[0]}
                    </span>
                  </button>

                  {profileDropdown && (
                    <div
                      className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-lg border border-earth-200 py-2 z-50 animate-fadeIn"
                      onMouseLeave={() => setProfileDropdown(false)}
                    >
                      <div className="px-4 py-2 border-b border-earth-100">
                        <p className="text-xs font-bold text-earth-800 truncate">{user.name}</p>
                        <p className="text-[11px] text-earth-400 truncate">{user.email}</p>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setProfileDropdown(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-earth-700 hover:bg-earth-50 hover:text-forest-700"
                      >
                        <UserIcon className="w-3.5 h-3.5" />
                        My Profile
                      </Link>

                      <Link
                        to="/dashboard"
                        onClick={() => setProfileDropdown(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-earth-700 hover:bg-earth-50 hover:text-forest-700"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        Dashboard
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setProfileDropdown(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-50"
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                          Admin Console
                        </Link>
                      )}

                      <div className="border-t border-earth-100 my-1" />

                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-semibold text-earth-700 hover:text-forest-700 rounded-xl hover:bg-earth-100 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-semibold text-white bg-forest-600 hover:bg-forest-700 rounded-xl transition shadow-sm"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-earth-600 hover:text-earth-900 hover:bg-earth-100 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-earth-200 px-4 pt-2 pb-6 space-y-2 animate-fadeIn">
          {!isAdmin ? (
            <>
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-earth-700 hover:bg-earth-100"
              >
                Home
              </Link>
              <Link
                to="/browse"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-earth-700 hover:bg-earth-100"
              >
                Browse Clothes
              </Link>

              {user && (
                <>
                  <Link
                    to="/clothing/my-listings"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-medium text-earth-700 hover:bg-earth-100"
                  >
                    My Listings
                  </Link>
                  <Link
                    to="/swaps"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-medium text-earth-700 hover:bg-earth-100"
                  >
                    My Swaps
                  </Link>
                  <Link
                    to="/saved"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-medium text-earth-700 hover:bg-earth-100"
                  >
                    Saved Items
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-medium text-earth-700 hover:bg-earth-100"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-medium text-earth-700 hover:bg-earth-100"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/clothing/add"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-semibold bg-forest-600 text-white text-center"
                  >
                    + Add Clothing
                  </Link>
                </>
              )}
            </>
          ) : (
            <>
              <Link
                to="/admin/dashboard"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-earth-700 hover:bg-earth-100"
              >
                Admin Dashboard
              </Link>
              <Link
                to="/admin/users"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-earth-700 hover:bg-earth-100"
              >
                Manage Users
              </Link>
              <Link
                to="/admin/clothing"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-earth-700 hover:bg-earth-100"
              >
                Manage Listings
              </Link>
              <Link
                to="/admin/swaps"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-earth-700 hover:bg-earth-100"
              >
                Monitor Swaps
              </Link>
              <Link
                to="/admin/reports"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-earth-700 hover:bg-earth-100"
              >
                Safety Reports
              </Link>
            </>
          )}

          <div className="border-t border-earth-100 pt-3">
            {user ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="w-full text-center px-4 py-2 text-sm font-semibold text-rose-600 bg-rose-50 rounded-xl"
              >
                Logout
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-center px-3 py-2 text-sm font-semibold text-earth-700 bg-earth-100 rounded-xl"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="text-center px-3 py-2 text-sm font-semibold text-white bg-forest-600 rounded-xl"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
