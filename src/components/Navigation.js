import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogIn, UserPlus, User, LogOut } from 'lucide-react';
import NotificationIcon from './NotificationIcon';

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
    return '/cars';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Side - Logo + Menu Items */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-1 group">
              <img src="/karhubty-logo-blue.png" alt="Karhubty logo" className="w-20 h-20 md:w-24 md:h-24 object-cover rounded" />
            </Link>

            {/* Desktop Menu - Left Items */}
            <div className="hidden md:flex items-center space-x-6">
              {!user ? (
                <>
                  <Link to="/" className="text-gray-700 hover:text-sky-500 font-medium transition-colors">
                    Accueil
                  </Link>
                  <Link to="/services" className="text-gray-700 hover:text-sky-500 font-medium transition-colors">
                    Services
                  </Link>
                  <Link to="/about" className="text-gray-700 hover:text-sky-500 font-medium transition-colors">
                    À Propos de nous
                  </Link>
                </>
              ) : (
                <>
                  <Link to={getDashboardLink()} className="text-gray-700 hover:text-sky-500 font-medium transition-colors">
                    Dashboard
                  </Link>
                  <Link to="/cars" className="text-gray-700 hover:text-sky-500 font-medium transition-colors">
                    Cars
                  </Link>
                  {user.role === 'user' && (
                    <Link to="/reserved-cars" className="text-gray-700 hover:text-sky-500 font-medium transition-colors">
                      Reserved Cars
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Right Side - Auth/User Items */}
          <div className="hidden md:flex items-center space-x-4">
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
                <div className="flex items-center">
                  <NotificationIcon user={user} />
                </div>
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
            {!user ? (
              <>
                {/* Not logged in mobile menu */}
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700 hover:text-sky-500 font-medium py-2">
                  Accueil
                </Link>
                <Link to="/services" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700 hover:text-sky-500 font-medium py-2">
                  Services
                </Link>
                <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700 hover:text-sky-500 font-medium py-2">
                  À Propos de nous
                </Link>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700 hover:text-sky-500 font-medium py-2">
                  Login
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 text-center font-medium">
                  Register
                </Link>
              </>
            ) : (
              <>
                {/* Logged in mobile menu */}
                <Link to={getDashboardLink()} onClick={() => setMobileMenuOpen(false)} className="block text-gray-700 hover:text-sky-500 font-medium py-2">
                  Dashboard
                </Link>
                <Link to="/cars" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700 hover:text-sky-500 font-medium py-2">
                  Cars
                </Link>
                {user.role === 'user' && (
                  <Link to="/reserved-cars" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700 hover:text-sky-500 font-medium py-2">
                    Reserved Cars
                  </Link>
                )}
                <div className="py-2">
                  <NotificationIcon user={user} />
                </div>
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