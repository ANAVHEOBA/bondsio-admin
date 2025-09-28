import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 👈 NEW: For navigation
import { getActivities } from '../../api/activity/api';
import type { Activity } from '../../api/activity/types';
import './ActivityList.css';

export default function ActivityList() {
  /* ---------- state ---------- */
  const [rows, setRows] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(20);

  /* ---------- navigation ---------- */
  const navigate = useNavigate(); // 👈 NEW: Use navigate hook

  /* ---------- data fetch ---------- */
  useEffect(() => {
    const fetchActivities = async () => {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        setError('No authentication token found. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await getActivities(currentPage, limit, token);
        setRows(res.data.activities);
        setTotal(res.data.total);
      } catch (err) {
        console.error('❌ Failed to fetch activities:', err);
        setError('Failed to load activities. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [currentPage, limit]);

  /* ---------- helpers ---------- */
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= Math.ceil(total / limit)) {
      setCurrentPage(newPage);
    }
  };

  const handleRowClick = (id: number) => {
    navigate(`/activity/${id}`); // 👈 Navigate to detail page
  };

  /* ---------- render ---------- */
  if (loading) return <div className="activity-list-loading">Loading activities…</div>;
  if (error) return <div className="activity-list-error">{error}</div>;

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="activity-list">
      <div className="activity-list-header">
        <h2>Activities ({total})</h2>
      </div>

      <div className="table-wrapper">
        <table className="activity-table">
          <thead>
            <tr>
              <th className="col-id">ID</th>
              <th className="col-title">Title</th>
              <th className="col-creator">Creator</th>
              <th className="col-location">Location</th>
              <th className="col-start">Start</th>
              <th className="col-end">End</th>
              <th className="col-participants">Participants</th>
              <th className="col-visibility">Visibility</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                  No activities found.
                </td>
              </tr>
            ) : (
              rows.map((a) => (
                <tr
                  key={a.id}
                  onClick={() => handleRowClick(a.id)}
                  style={{
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    borderBottom: '1px solid #eee',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8f9fa')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
                >
                  <td className="col-id">{a.id}</td>
                  <td className="col-title">{a.title}</td>
                  <td className="col-creator">
                    {a.creator.full_name || a.creator.user_name || '—'}
                  </td>
                  <td className="col-location">{a.location}</td>
                  <td className="col-start">{new Date(a.start_date).toLocaleString()}</td>
                  <td className="col-end">{new Date(a.end_date).toLocaleString()}</td>
                  <td className="col-participants">
                    {a.participants.length}/{a.max_participants}
                  </td>
                  <td className="col-visibility">
                    <span className={`visibility-badge ${a.is_public ? 'public' : 'private'}`}>
                      {a.is_public ? 'Public' : 'Private'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ---------- pagination ---------- */}
      {total > 0 && (
        <div className="pagination-controls">
          <div className="pagination-info">
            Showing {((currentPage - 1) * limit) + 1} to{' '}
            {Math.min(currentPage * limit, total)} of {total} activities
          </div>

          <div className="pagination-buttons">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`pagination-btn ${pageNum === currentPage ? 'active' : ''}`}
              >
                {pageNum}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}