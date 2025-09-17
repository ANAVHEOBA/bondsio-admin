import { useEffect, useState } from 'react';
import { getUsers } from '../../api/getuser/api';
import type { GetUserResponse, User, Pagination } from '../../api/getuser/types';
import './UserList.css';

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(20);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        setError('No authentication token found. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data: GetUserResponse = await getUsers(currentPage, limit, token);
        setUsers(data.data.users);
        setPagination(data.data.pagination);
      } catch (err) {
        console.error('❌ Failed to fetch users:', err);
        setError('Failed to load users. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, limit]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && pagination && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) return <div className="user-list-loading">Loading users…</div>;
  if (error) return <div className="user-list-error">{error}</div>;

  return (
    <div className="user-list">
      <div className="user-list-header">
        <h2>Users ({pagination?.total || users.length})</h2>
      </div>

      <div className="table-wrapper">
        <table className="user-table">
          <thead>
            <tr>
              <th className="col-avatar">Avatar</th>
              <th className="col-name">Name</th>
              <th className="col-username">Username</th>
              <th className="col-email">Email</th>
              <th className="col-phone">Phone</th>
              <th className="col-country">Country</th>
              <th className="col-dob">DOB</th>
              <th className="col-joined">Joined</th>
              <th className="col-status">Status</th>
              <th className="col-notifications">Notifications</th>
              <th className="col-device">Device</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="col-avatar">
                  <div className="user-avatar">
                    {u.profile_image ? (
                      <img src={u.profile_image} alt={u.full_name || 'User'} />
                    ) : (
                      <div className="user-avatar-placeholder">
                        {u.full_name?.charAt(0) || u.email?.charAt(0) || 'U'}
                      </div>
                    )}
                  </div>
                </td>
                <td className="col-name">{u.full_name || 'Unnamed User'}</td>
                <td className="col-username">{u.user_name || '—'}</td>
                <td className="col-email">{u.email}</td>
                <td className="col-phone">{u.phone || '—'}</td>
                <td className="col-country">{u.country?.name || '—'}</td>
                <td className="col-dob">{u.dob || '—'}</td>
                <td className="col-joined">{new Date(u.created_at).toLocaleDateString()}</td>
                <td className="col-status">
                  <span
                    className={`status-badge ${
                      u.email_verified ? 'status-verified' : 'status-unverified'
                    }`}
                  >
                    {u.email_verified ? 'Verified' : 'Unverified'}
                  </span>
                </td>
                <td className="col-notifications">
                  <span className={u.notification ? 'notification-enabled' : 'notification-disabled'}>
                    {u.notification ? '✓' : '✗'}
                  </span>
                </td>
                <td className="col-device">{u.device_type || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {pagination && (
        <div className="pagination-controls">
          <div className="pagination-info">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} users
          </div>
          <div className="pagination-buttons">
            <button 
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={!pagination.hasPreviousPage}
              className="pagination-btn"
            >
              Previous
            </button>
            
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(pageNum => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`pagination-btn ${pageNum === pagination.page ? 'active' : ''}`}
              >
                {pageNum}
              </button>
            ))}
            
            <button 
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={!pagination.hasNextPage}
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