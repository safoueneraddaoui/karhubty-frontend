import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, Menu, X, LogIn, UserPlus, LayoutDashboard, User, LogOut } from 'lucide-react';

const Navigation = ({ user, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'user') return '/user-dashboard';
    if (user.role === 'agent') return '/agent-dashboard';
    if (user.role === 'superadmin') return '/superadmin-dashboard';
    return '/';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-1 group">
            <img src="/karhubty-logo-blue.png" alt="Karhubty logo" className="w-20 h-20 md:w-24 md:h-24 object-cover rounded" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {!user && (
              <Link to="/" className="text-gray-700 hover:text-sky-500 font-medium transition-colors">
                Home
              </Link>
            )}
            <Link to="/cars" className="text-gray-700 hover:text-sky-500 font-medium transition-colors">
              Browse Cars
            </Link>

            {!user ? (
              <>
                <Link to="/login" className="text-gray-700 hover:text-sky-500 font-medium transition-colors flex items-center space-x-1">
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
                <Link to="/register" className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition-colors font-medium flex items-center space-x-1">
                  <UserPlus className="w-4 h-4" />
                  <span>Register</span>
                </Link>
              </>
            ) : (
              <>
                <Link to={getDashboardLink()} className="text-gray-700 hover:text-sky-500 font-medium transition-colors flex items-center space-x-1">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <Link to="/profile" className="text-gray-700 hover:text-sky-500 font-medium transition-colors flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </Link>
                <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium flex items-center space-x-1">
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-gray-700 hover:text-sky-500">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {!user && (
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700 hover:text-sky-500 font-medium py-2">
                Home
              </Link>
            )}
            <Link to="/cars" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700 hover:text-sky-500 font-medium py-2">
              Browse Cars
            </Link>
            
            {!user ? (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700 hover:text-sky-500 font-medium py-2">
                  Login
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 text-center font-medium">
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link to={getDashboardLink()} onClick={() => setMobileMenuOpen(false)} className="block text-gray-700 hover:text-sky-500 font-medium py-2">
                  Dashboard
                </Link>
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700 hover:text-sky-500 font-medium py-2">
                  Profile
                </Link>
                <button onClick={handleLogout} className="w-full text-left bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-medium">
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;