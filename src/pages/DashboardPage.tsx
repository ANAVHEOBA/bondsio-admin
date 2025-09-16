// src/pages/DashboardPage.tsx

import AdminLayout from '../layouts/AdminLayout';
import './DashboardPage.css';

export default function DashboardPage() {
  return (
    <AdminLayout>
      <div className="dashboard-page">
        <h1>Welcome to the Bondsio Admin Dashboard</h1>
        <p>This is where you’ll manage communities, users, content, and analytics.</p>
      </div>
    </AdminLayout>
  );
}