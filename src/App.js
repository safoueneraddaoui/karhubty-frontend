import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import CarsPage from './pages/CarsPage';
import CarDetailsPage from './pages/CarDetailsPage';
import UserDashboard from './pages/UserDashboard';
import AgentDashboard from './pages/AgentDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import AgentRequestPage from './pages/AgentRequestPage';
import ProfilePage from './pages/ProfilePage';

// Protected Route Component
const ProtectedRoute = ({ user, allowedRoles, children }) => {
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

  // Load user from localStorage on mount
  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white flex flex-col">
        <Navigation user={user} onLogout={handleLogout} />
        <main className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/agent-request" element={<AgentRequestPage />} />
            <Route path="/cars" element={<CarsPage user={user} />} />
            <Route path="/cars/:carId" element={<CarDetailsPage user={user} />} />
            
            {/* Protected Routes */}
            <Route path="/profile" element={
              <ProtectedRoute user={user}>
                <ProfilePage user={user} setUser={setUser} />
              </ProtectedRoute>
            } />
            
            <Route path="/user-dashboard" element={
              <ProtectedRoute user={user} allowedRoles={['user']}>
                <UserDashboard user={user} />
              </ProtectedRoute>
            } />
            
            <Route path="/agent-dashboard" element={
              <ProtectedRoute user={user} allowedRoles={['agent']}>
                <AgentDashboard user={user} />
              </ProtectedRoute>
            } />
            
            <Route path="/superadmin-dashboard" element={
              <ProtectedRoute user={user} allowedRoles={['superadmin']}>
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