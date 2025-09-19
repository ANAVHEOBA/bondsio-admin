import { useParams } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import BondReportsTable from '../components/reportedBonds/BondReportsTable';
import { Link } from 'react-router-dom';
import './BondReportsPage.css';

export default function BondReportsPage() {
  const { bondId } = useParams<{ bondId: string }>();
  const token = localStorage.getItem('admin_token') ?? '';

  // If no bondId, show error — this should NOT happen if routed correctly
  if (!bondId) {
    return (
      <AdminLayout>
        <div className="bond-reports-page">
          <div className="bond-reports-error" role="alert">
            <h3>Invalid Request</h3>
            <p>Bond ID not provided. Please navigate from the reported bonds list.</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="bond-reports-page">
        <h2 className="page-title">Reports for Bond #{bondId}</h2>

        <Link to="/reports/bonds" className="back-link">
          ← Back to Reported Bonds
        </Link>

        <BondReportsTable bondId={bondId} token={token} />
      </div>
    </AdminLayout>
  );
}