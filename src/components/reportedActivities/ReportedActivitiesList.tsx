// src/components/reportedActivities/ReportedActivitiesList.tsx

import { useEffect, useState } from 'react';
import { getActivityReports } from '../../api/activityReports/api';
import type { ActivityReport } from '../../api/activityReports/types';
import { ActivityReportStatus } from '../../api/activityReports/types';
import ReviewReportModal from './ReviewReportModal';
import './ReportedActivitiesList.css';

export default function ReportedActivitiesList() {
  const [reports, setReports] = useState<ActivityReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);

  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [selectedReportStatus, setSelectedReportStatus] = useState<ActivityReportStatus>(ActivityReportStatus.PENDING);

  useEffect(() => {
    const fetchReports = async () => {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        setError('No authentication token found. Please log in.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await getActivityReports(token);
        setReports(res.data.reports);
        setTotal(res.data.total);
      } catch (err) {
        console.error('❌ Failed to fetch activity reports:', err);
        setError('Failed to load activity reports. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const getStatusBadgeClass = (status: 'pending' | 'reviewed' | 'resolved' | 'dismissed') => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'reviewed':
        return 'status-reviewed';
      case 'resolved':
        return 'status-resolved';
      case 'dismissed':
        return 'status-dismissed';
      default:
        return 'status-pending';
    }
  };

  const formatDateTime = (isoDate: string) => {
    return new Date(isoDate).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) return <div className="reports-loading">Loading activity reports…</div>;
  if (error) return <div className="reports-error">{error}</div>;

  return (
    <div className="reported-activities-list">
      <div className="reports-header">
        <h2>Reported Activities ({total})</h2>
      </div>

      <div className="table-wrapper">
        <table className="reports-table">
          <thead>
            <tr>
              <th className="col-id">ID</th>
              <th className="col-activity">Activity ID</th>
              <th className="col-reporter">Reporter</th>
              <th className="col-reason">Reason</th>
              <th className="col-description">Description</th>
              <th className="col-status">Status</th>
              <th className="col-created">Created At</th>
              <th className="col-actions">Actions</th>
            </tr>
          </thead>

          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                  No activity reports found.
                </td>
              </tr>
            ) : (
              reports.map((report) => (
                <tr key={report.id}>
                  <td className="col-id">{report.id}</td>
                  <td className="col-activity">{report.activity_id}</td>
                  <td className="col-reporter">{report.reporter_id}</td>
                  <td className="col-reason">
                    <span className="reason-badge">
                      {report.reason.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="col-description">
                    {report.description.length > 100
                      ? `${report.description.slice(0, 100)}...`
                      : report.description}
                  </td>
                  <td className="col-status">
                    <span className={`status-badge ${getStatusBadgeClass(report.status)}`}>
                      {report.status.replace('_', ' ').charAt(0).toUpperCase() +
                        report.status.slice(1)}
                    </span>
                  </td>
                  <td className="col-created">{formatDateTime(report.created_at)}</td>
                  <td className="col-actions">
                    <button
                      className="action-btn review-btn"
                      onClick={() => {
                        setSelectedReportId(report.id);
                        setSelectedReportStatus(report.status as ActivityReportStatus); // ✅ Cast to enum
                      }}
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedReportId !== null && (
        <ReviewReportModal
          reportId={selectedReportId}
          currentStatus={selectedReportStatus}
          onClose={() => setSelectedReportId(null)}
          onSuccess={() => {
            setSelectedReportId(null);
            const token = localStorage.getItem('admin_token');
            if (token) {
              getActivityReports(token)
                .then((res) => {
                  setReports(res.data.reports);
                  setTotal(res.data.total);
                })
                .catch((err) => {
                  console.error('Failed to refresh reports:', err);
                  setError('Failed to refresh data after update.');
                });
            }
          }}
        />
      )}
    </div>
  );
}