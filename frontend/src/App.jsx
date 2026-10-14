import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

// Layout components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Route Guards
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

// Public Pages
import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowsePage';
import ClothingDetailPage from './pages/ClothingDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

// Authenticated User Pages
import UserDashboardPage from './pages/UserDashboardPage';
import ProfilePage from './pages/ProfilePage';
import AddClothingPage from './pages/AddClothingPage';
import EditClothingPage from './pages/EditClothingPage';
import MyListingsPage from './pages/MyListingsPage';
import SwapRequestsPage from './pages/SwapRequestsPage';
import SwapDetailPage from './pages/SwapDetailPage';
import SwapHistoryPage from './pages/SwapHistoryPage';
import SavedItemsPage from './pages/SavedItemsPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminListingsPage from './pages/admin/AdminListingsPage';
import AdminSwapsPage from './pages/admin/AdminSwapsPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <div className="flex flex-col min-h-screen bg-[#fafaf9]">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/browse" element={<BrowsePage />} />
                <Route path="/clothing/:id" element={<ClothingDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* User Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <UserDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/clothing/add"
                  element={
                    <ProtectedRoute>
                      <AddClothingPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/clothing/:id/edit"
                  element={
                    <ProtectedRoute>
                      <EditClothingPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/clothing/my-listings"
                  element={
                    <ProtectedRoute>
                      <MyListingsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/swaps"
                  element={
                    <ProtectedRoute>
                      <SwapRequestsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/swaps/history"
                  element={
                    <ProtectedRoute>
                      <SwapHistoryPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/swaps/:id"
                  element={
                    <ProtectedRoute>
                      <SwapDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/saved"
                  element={
                    <ProtectedRoute>
                      <SavedItemsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Protected Routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <AdminRoute>
                      <AdminDashboardPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <AdminRoute>
                      <AdminUsersPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/clothing"
                  element={
                    <AdminRoute>
                      <AdminListingsPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/swaps"
                  element={
                    <AdminRoute>
                      <AdminSwapsPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/reports"
                  element={
                    <AdminRoute>
                      <AdminReportsPage />
                    </AdminRoute>
                  }
                />

                {/* 404 Route */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
