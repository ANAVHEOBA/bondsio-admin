import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // 👈 CORRECT IMPORT
import { getActivityById } from '../../api/activity/api';
import type { AdminActivity } from '../../api/activity/types';
import './ActivityDetail.css';

export default function ActivityDetail() {
  const [activity, setActivity] = useState<AdminActivity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate(); // 👈 Now correctly imported
  const { id } = useParams<{ id: string }>();
  const activityId = id ? parseInt(id, 10) : 0;

  // ✅ Helper to render avatar: image or colored letter
  const renderAvatar = (name: string | null | undefined, imageUrl: string | null | undefined) => {
    if (imageUrl && imageUrl.trim() !== '') {
      return (
        <img
          src={imageUrl.trim()}
          alt={`${name || 'User'}'s avatar`}
          className="creator-avatar"
        />
      );
    }

    // ✅ Fallback: colored circle with first letter
    const firstLetter = (name || 'U').charAt(0).toUpperCase();
    const color = getAvatarColor(name || 'U');

    return (
      <div
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '1.1rem',
          border: '2px solid #ddd',
        }}
      >
        {firstLetter}
      </div>
    );
  };

  // 🎨 Generate a consistent color based on name
  const getAvatarColor = (name: string): string => {
    const colors = [
      '#FF6B6B', // red
      '#4ECDC4', // teal
      '#45B7D1', // blue
      '#96CEB4', // mint
      '#FFEAA7', // yellow
      '#DDA0DD', // plum
      '#74B9FF', // light blue
      '#0984E3', // dark blue
      '#00B894', // green
      '#D63031', // crimson
      '#FDCB6E', // gold
      '#6C5CE7', // purple
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  };

  useEffect(() => {
    const fetchActivity = async () => {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        setError('No authentication token found. Please log in.');
        setLoading(false);
        return;
      }

      if (!id || isNaN(activityId)) {
        setError('Invalid or missing activity ID.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await getActivityById(activityId, token);
        setActivity(res.data);
      } catch (err) {
        console.error('❌ Failed to fetch activity:', err);
        setError('Failed to load activity details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [id, activityId]);

  if (loading) return <div className="activity-detail-loading">Loading activity details…</div>;
  if (error) return <div className="activity-detail-error">{error}</div>;
  if (!activity) return <div className="activity-detail-empty">No activity data.</div>;

  const formatDate = (isoDate: string) => {
    return new Date(isoDate).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getParticipantCount = () => {
    return `${activity.participants.length}/${activity.max_participants}`;
  };

  return (
    <div className="activity-detail-container">
      {/* ✅ BACK BUTTON — Always visible at top */}
      <div style={{ marginBottom: '1.5rem' }}>
        <button
          onClick={() => navigate('/activity')}
          style={{
            padding: '0.6rem 1.2rem',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: '500',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            transition: 'background-color 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5a6268')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#6c757d')}
        >
          ← Back to Activities
        </button>
      </div>

      {/* Header */}
      <header className="activity-detail-header">
        <h1>{activity.title}</h1>
        <div className="activity-meta">
          <span className={`visibility-badge ${activity.is_public ? 'public' : 'private'}`}>
            {activity.is_public ? 'Public' : 'Private'}
          </span>
          <span>•</span>
          <span>{getParticipantCount()}</span>
          <span>•</span>
          <span>{formatDate(activity.start_date)} - {formatDate(activity.end_date)}</span>
        </div>
      </header>

      {/* Main Content */}
      <div className="activity-detail-content">
        {/* Location */}
        <section className="activity-section">
          <h2>📍 Location</h2>
          <p>{activity.location}</p>
          <p className="geo-coords">
            Lat: {activity.latitude} • Lng: {activity.longitude}
          </p>
        </section>

        {/* Description */}
        <section className="activity-section">
          <h2>Description</h2>
          <p>{activity.description}</p>
        </section>

        {/* Organizer */}
        <section className="activity-section">
          <h2>👨‍💻 Organizer</h2>
          <div className="creator-card">
            {renderAvatar(activity.creator.full_name, activity.creator.profile_image)}
            <div className="creator-info">
              <h3>{activity.creator.full_name || activity.creator.user_name || 'Unknown'}</h3>
              <p>{activity.creator.email}</p>
              <p className="role">Role: {activity.creator.role}</p>
              <p className="bio">{activity.creator.bio || 'No bio available.'}</p>
            </div>
          </div>
        </section>

        {/* Co-Organizers */}
        {activity.co_organizers && activity.co_organizers.length > 0 && (
          <section className="activity-section">
            <h2>👥 Co-Organizers</h2>
            <div className="co-organizers-grid">
              {activity.co_organizers.map((co) => (
                <div key={co.id} className="co-organizer-card">
                  {renderAvatar(co.full_name, co.profile_image)}
                  <div className="co-organizer-info">
                    <h4>{co.full_name || co.user_name || 'Unknown'}</h4>
                    <p>{co.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Participants */}
        <section className="activity-section">
          <h2>👥 Participants ({activity.total_participants_count})</h2>
          <div className="participants-grid">
            {activity.participants.map((p) => (
              <div key={p.id} className="participant-card">
                {renderAvatar(p.full_name, p.profile_image)}
                <div className="participant-info">
                  <h4>{p.full_name || p.user_name || 'Anonymous'}</h4>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Additional Info */}
        <section className="activity-section">
          <h2>📋 Details</h2>
          <ul className="detail-list">
            <li><strong>ID:</strong> {activity.id}</li>
            <li><strong>Max Participants:</strong> {activity.max_participants}</li>
            <li><strong>Request to Join:</strong> {activity.request_to_join ? '✅ Yes' : '❌ No'}</li>
            <li><strong>Post to Story:</strong> {activity.post_to_story ? '✅ Yes' : '❌ No'}</li>
            <li><strong>Visibility:</strong> {activity.visibility}</li>
            <li><strong>Likes:</strong> {activity.likes_count}</li>
            <li><strong>Created At:</strong> {formatDate(activity.creator.created_at)}</li>
          </ul>
        </section>

        {/* Cover Image */}
        {activity.cover_image && (
          <section className="activity-section">
            <h2>🖼️ Cover Image</h2>
            <img
              src={activity.cover_image.trim()}
              alt="Activity cover"
              className="cover-image"
            />
          </section>
        )}
      </div>
    </div>
  );
}