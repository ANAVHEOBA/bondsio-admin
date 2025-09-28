import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 👈 NEW: For navigation
import { getTrendingActivities } from '../../api/activity/api';
import type { Activity } from '../../api/activity/types';
import './TrendingActivityList.css';

export default function TrendingActivityList() {
  /* ---------- state ---------- */
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(5);

  /* ---------- navigation ---------- */
  const navigate = useNavigate(); // 👈 NEW: Use navigate hook

  /* ---------- data fetch ---------- */
  useEffect(() => {
    const fetchTrendingActivities = async () => {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        setError('No authentication token found. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await getTrendingActivities(currentPage, limit, token);
        setActivities(res.data.activities);
        setTotal(res.data.total);
      } catch (err) {
        console.error('❌ Failed to fetch trending activities:', err);
        setError('Failed to load trending activities. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingActivities();
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
  if (loading) return <div className="trending-loading">Loading trending activities…</div>;
  if (error) return <div className="trending-error">{error}</div>;

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="trending-activity-list">
      <div className="trending-header">
        <h2>Trending Activities ({total})</h2>
      </div>

      <div className="table-wrapper">
        <table className="trending-table">
          <thead>
            <tr>
              <th className="col-title">Title</th>
              <th className="col-location">Location</th>
              <th className="col-start">Start</th>
              <th className="col-likes">Likes</th>
              <th className="col-participants">Participants</th>
              <th className="col-visibility">Visibility</th>
              <th className="col-interests">Interests</th>
              <th className="col-creator">Creator</th>
            </tr>
          </thead>

          <tbody>
            {activities.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                  No trending activities found.
                </td>
              </tr>
            ) : (
              activities.map((a) => (
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
                  <td className="col-title">
                    <strong>{a.title}</strong>
                    <br />
                    <small style={{ color: '#777' }}>
                      {a.description.length > 80
                        ? `${a.description.slice(0, 80)}...`
                        : a.description}
                    </small>
                  </td>

                  <td className="col-location">{a.location}</td>

                  <td className="col-start">
                    {new Date(a.start_date).toLocaleString()}
                  </td>

                  <td className="col-likes">
                    <span style={{ fontWeight: 'bold', color: '#ff6b6b' }}>
                      {a.likes_count}
                    </span>
                  </td>

                  <td className="col-participants">
                    {a.total_participants_count}/{a.max_participants}
                  </td>

                  <td className="col-visibility">
                    <span className={`visibility-badge ${a.is_public ? 'public' : 'private'}`}>
                      {a.visibility === 'public' ? 'Public' : a.visibility === 'bond_only' ? 'Bond Only' : 'Private'}
                    </span>
                  </td>

                  <td className="col-interests">
                    {a.interests.length > 0 ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                        {a.interests.slice(0, 3).map((i) => (
                          <span
                            key={i.id}
                            style={{
                              backgroundColor: '#e3f2fd',
                              padding: '0.2rem 0.5rem',
                              borderRadius: '12px',
                              fontSize: '0.75rem',
                              color: '#1976d2',
                            }}
                          >
                            {i.interest}
                          </span>
                        ))}
                        {a.interests.length > 3 && (
                          <span style={{ color: '#999', fontSize: '0.75rem' }}>
                            +{a.interests.length - 3}
                          </span>
                        )}
                      </div>
                    ) : (
                      <em>None</em>
                    )}
                  </td>

                  <td className="col-creator">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {a.creator.profile_image ? (
                        <img
                          src={a.creator.profile_image}
                          alt={`${a.creator.full_name || a.creator.user_name}'s avatar`}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            backgroundColor: '#eee',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#999',
                            fontSize: '0.7rem',
                          }}
                        >
                          {a.creator.full_name?.charAt(0) || a.creator.user_name?.charAt(0) || '?'}
                        </div>
                      )}
                      <span>
                        {a.creator.full_name || a.creator.user_name || 'Anonymous'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {total > 0 && (
        <div className="pagination-controls">
          <div className="pagination-info">
            Showing {((currentPage - 1) * limit) + 1} to{' '}
            {Math.min(currentPage * limit, total)} of {total} trending activities
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