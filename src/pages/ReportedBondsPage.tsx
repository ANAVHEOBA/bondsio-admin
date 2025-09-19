import AdminLayout from '../layouts/AdminLayout';
import ReportedBondList from '../components/reportedBonds/ReportedBondList';
import './ReportedBondsPage.css';

export default function ReportedBondsPage() {
  const token = localStorage.getItem('admin_token') ?? '';

  if (!token) {
    return (
      <AdminLayout>
        <div className="reported-bonds-page">
          <div className="bond-reports-error" role="alert">
            <h3>Authentication Required</h3>
            <p>You must be logged in to view reported bonds.</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="reported-bonds-page">
        <h2 className="page-title">Reported Bonds</h2>
        <ReportedBondList token={token} />
      </div>
    </AdminLayout>
  );
}