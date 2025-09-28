import AdminLayout from '../layouts/AdminLayout';
import ReportedActivitiesList from '../components/reportedActivities/ReportedActivitiesList';
import './ReportedActivitiesPage.css';

export default function ReportedActivitiesPage() {
  return (
    <AdminLayout>
      <div className="reported-activities-page">
        <ReportedActivitiesList />
      </div>
    </AdminLayout>
  );
}