// src/pages/DashboardPage.tsx

import AdminLayout from '../layouts/AdminLayout';
import VerificationStatsCard from '../components/analytics/VerificationStatsCard';
import DemographyStatsCard from '../components/analytics/DemographyStatsCard';
import AnalyticsOverviewCard from '../components/analytics/AnalyticsOverviewCard';
import './DashboardPage.css';

export default function DashboardPage() {
  const token = localStorage.getItem('admin_token');

  if (!token) {
    return (
      <AdminLayout>
        <div className="dashboard-page">
          <h1>Access Denied</h1>
          <p>Please log in to view the dashboard.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="dashboard-page">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p className="subtitle">Welcome back! Here's what's happening today.</p>
        </div>

        <div className="analytics-grid">
          <VerificationStatsCard token={token} />
          <DemographyStatsCard token={token} />
          <AnalyticsOverviewCard token={token} />
        </div>

        <div className="dashboard-content">
          {/* Tables, charts, recent activity, etc. */}
        </div>
      </div>
    </AdminLayout>
  );
}