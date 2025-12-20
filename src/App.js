import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ServicesPage from './pages/ServicesPage';
import AboutPage from './pages/AboutPage';
import CarsPage from './pages/CarsPage';
import CarDetailsPage from './pages/CarDetailsPage';
import UserDashboard from './pages/UserDashboard';
import AgentDashboard from './pages/AgentDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import AgentRequestPage from './pages/AgentRequestPage';
import ProfilePage from './pages/ProfilePage';
import ReservedCarsPage from './pages/ReservedCarsPage';
import authService from './services/authService';
import tokenService from './services/tokenService';

// Protected Route Component
const ProtectedRoute = ({ user, isLoading, allowedRoles, children }) => {
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div></div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  const [user, setUser] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // Load user from tokenService on mount
  React.useEffect(() => {
    console.log('🔄 [App] Initializing auth state from tokenService');
    const storedUser = tokenService.getUser();
    if (storedUser && tokenService.isAuthenticated()) {
      console.log('✅ [App] User found in tokenService, restoring session:', storedUser.id);
      setUser(storedUser);
    } else {
      console.log('⚠️ [App] No authenticated user found');
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (userData) => {
    console.log('🔐 [App] handleLogin called with user:', userData.id);
    setUser(userData);
    // Token is already saved by authService, but ensure user state is synced
    tokenService.setUser(userData);
  };

  const handleLogout = () => {
    console.log('🔓 [App] handleLogout called');
    setUser(null);
    tokenService.clearAuth();
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white flex flex-col">
        <Navigation user={user} onLogout={handleLogout} />
        <main className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/agent-request" element={<AgentRequestPage />} />
            <Route path="/cars" element={<CarsPage user={user} />} />
            <Route path="/cars/:carId" element={<CarDetailsPage user={user} />} />
            
            {/* Protected Routes */}
            <Route path="/profile" element={
              <ProtectedRoute user={user} isLoading={isLoading}>
                <ProfilePage user={user} setUser={setUser} />
              </ProtectedRoute>
            } />
            
            <Route path="/reserved-cars" element={
              <ProtectedRoute user={user} isLoading={isLoading} allowedRoles={['user']}>
                <ReservedCarsPage user={user} />
              </ProtectedRoute>
            } />
            
            <Route path="/user-dashboard" element={
              <ProtectedRoute user={user} isLoading={isLoading} allowedRoles={['user']}>
                <UserDashboard user={user} />
              </ProtectedRoute>
            } />
            
            <Route path="/agent-dashboard" element={
              <ProtectedRoute user={user} isLoading={isLoading} allowedRoles={['agent']}>
                <AgentDashboard user={user} />
              </ProtectedRoute>
            } />
            
            <Route path="/superadmin-dashboard" element={
              <ProtectedRoute user={user} isLoading={isLoading} allowedRoles={['superadmin']}>
                <SuperAdminDashboard user={user} />
              </ProtectedRoute>
            } />
            
            {/* Redirect /dashboard based on role */}
            <Route path="/dashboard" element={
              user ? (
                user.role === 'user' ? <Navigate to="/user-dashboard" /> :
                user.role === 'agent' ? <Navigate to="/agent-dashboard" /> :
                user.role === 'superadmin' ? <Navigate to="/superadmin-dashboard" /> :
                <Navigate to="/" />
              ) : <Navigate to="/login" />
            } />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;