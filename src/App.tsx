import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import './App.css';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import UserProfilePage from './pages/UserProfilePage';
import ReportedBondsPage from './pages/ReportedBondsPage';
import BondReportsPage from './pages/BondReportsPage';
import ActivityPage from './pages/ActivityPage';
import ActivityDetailPage from './pages/ActivityDetailPage';
import ReportedActivitiesPage from './pages/ReportedActivitiesPage';

export default function App() {
  const location = useLocation();

  useEffect(() => {
    document.body.setAttribute(
      'data-page',
      location.pathname === '/' ? 'login' : 'admin'
    );
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
        <Route path="/users/:userId" element={<UserProfilePage />} />
        {/* ✅ This renders the LIST of reported bonds */}
        <Route path="/reports/bonds" element={<ReportedBondsPage />} />
        {/* ✅ This renders DETAILS for a single bond */}
        <Route path="/reports/bonds/:bondId" element={<BondReportsPage />} />
        <Route path="/reports/activities" element={<ReportedActivitiesPage />} />
        <Route path="/activity" element={<ActivityPage />} /> 
        <Route path="/activity/:id" element={<ActivityDetailPage />} />
      </Routes>
    </div>
  );
}