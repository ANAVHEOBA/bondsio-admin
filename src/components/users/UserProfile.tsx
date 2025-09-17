import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUserProfile } from '../../api/userprofile/api';
import type { UserProfile } from '../../api/userprofile/types';
import './UserProfile.css';

export default function UserProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) {
        setError('User ID not provided');
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('admin_token');
      if (!token) {
        setError('No authentication token found. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getUserProfile(userId, token);
        setUser(data.data);
      } catch (err) {
        console.error('❌ Failed to fetch user profile:', err);
        setError('Failed to load user profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  if (loading) return <div className="user-profile-loading">Loading user profile…</div>;
  if (error) return <div className="user-profile-error">{error}</div>;
  if (!user) return <div className="user-profile-error">User not found</div>;

  return (
    <div className="user-profile">
      <div className="user-profile-header">
        <Link to="/users" className="back-link">← Back to Users</Link>
        <h2>User Profile</h2>
      </div>

      <div className="user-profile-content">
        <div className="user-profile-card">
          <div className="user-profile-image">
            {user.profile_image ? (
              <img src={user.profile_image} alt={user.full_name || 'User'} />
            ) : (
              <div className="user-avatar-placeholder">
                {user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
              </div>
            )}
          </div>

          <div className="user-profile-info">
            <h3>{user.full_name || 'Unnamed User'}</h3>
            <p className="username">@{user.user_name || 'No username'}</p>
            <p className="email">{user.email}</p>
            
            <div className="user-stats">
              <div className="stat">
                <span className="stat-value">{user.followers_count}</span>
                <span className="stat-label">Followers</span>
              </div>
              <div className="stat">
                <span className="stat-value">{user.following_count}</span>
                <span className="stat-label">Following</span>
              </div>
              <div className="stat">
                <span className="stat-value">{user.bonds_count}</span>
                <span className="stat-label">Bonds</span>
              </div>
              <div className="stat">
                <span className="stat-value">{user.activities_count}</span>
                <span className="stat-label">Activities</span>
              </div>
            </div>
          </div>
        </div>

        <div className="user-profile-details">
          <div className="detail-row">
            <span className="detail-label">Country:</span>
            <span className="detail-value">{user.country?.name || 'Not specified'}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Date of Birth:</span>
            <span className="detail-value">{user.dob || 'Not specified'}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Phone:</span>
            <span className="detail-value">{user.phone || 'Not specified'}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Bio:</span>
            <span className="detail-value">{user.bio || 'No bio provided'}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Joined:</span>
            <span className="detail-value">
              {new Date(user.created_at).toLocaleDateString()}
            </span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Email Verified:</span>
            <span className={`detail-value ${user.email_verified ? 'verified' : 'unverified'}`}>
              {user.email_verified ? 'Yes' : 'No'}
            </span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Notifications:</span>
            <span className={`detail-value ${user.notification ? 'enabled' : 'disabled'}`}>
              {user.notification ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Device Type:</span>
            <span className="detail-value">{user.device_type || 'Not specified'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}