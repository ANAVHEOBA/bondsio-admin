import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import './App.css';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import UserProfilePage from './pages/UserProfilePage'; // Add this import

export default function App() {
  const location = useLocation();

  useEffect(() => {
    // tag <body> so CSS can scope login-only rules
    document.body.setAttribute(
      'data-page',
      location.pathname === '/' ? 'login' : 'admin'
    );
    
    // Initialize sidebar state for admin pages
    if (location.pathname !== '/') {
      document.body.setAttribute('data-sidebar-open', 'true');
    }
  }, [location]);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/users/:userId" element={<UserProfilePage />} /> {/* Add this route */}
      </Routes>
    </div>
  );
}