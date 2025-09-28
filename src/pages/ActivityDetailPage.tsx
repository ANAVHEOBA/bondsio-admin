import AdminLayout from '../layouts/AdminLayout';
import ActivityDetail from '../components/activity/ActivityDetail';
import './ActivityDetailPage.css';

export default function ActivityDetailPage() {
  return (
    <AdminLayout>
      <div className="activity-detail-page">
        <ActivityDetail />
      </div>
    </AdminLayout>
  );
}