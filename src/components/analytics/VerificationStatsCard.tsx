// src/components/analytics/VerificationStatsCard.tsx

import { useEffect, useState } from 'react';
import { getUserVerificationStats } from '../../api/analytics/api';
import './VerificationStatsCard.css';
import { FiMail, FiPhone, FiCheckCircle, FiUsers } from 'react-icons/fi';

interface VerificationStatsCardProps {
  token: string;
}

export default function VerificationStatsCard({ token }: VerificationStatsCardProps) {
  const [stats, setStats] = useState<{
    total: number;
    email_verified: { count: number; percentage: number };
    phone_verified: { count: number; percentage: number };
    both_verified: { count: number; percentage: number };
  } | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getUserVerificationStats(token);
        setStats(response.data);
      } catch (err) {
        setError('Failed to load verification stats');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  if (loading) {
    return (
      <div className="verification-stats-card skeleton">
        <div className="card-header">
          <div className="icon-placeholder"></div>
          <div className="title-placeholder"></div>
        </div>
        <div className="stats-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="stat-item">
              <div className="label-placeholder"></div>
              <div className="value-placeholder"></div>
              <div className="percentage-placeholder"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="verification-stats-card error">
        <div className="error-content">
          <FiUsers size={24} />
          <h3>User Verification</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="verification-stats-card">
      <div className="card-header">
        <FiUsers size={20} />
        <h3>User Verification</h3>
      </div>
      
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-label">
            <FiUsers size={16} />
            <span>Total Users</span>
          </div>
          <div className="stat-value">{stats.total.toLocaleString()}</div>
        </div>

        <div className="stat-item">
          <div className="stat-label">
            <FiMail size={16} />
            <span>Email Verified</span>
          </div>
          <div className="stat-value">{stats.email_verified.count.toLocaleString()}</div>
          <div className="stat-percentage positive">
            {stats.email_verified.percentage}%
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-label">
            <FiPhone size={16} />
            <span>Phone Verified</span>
          </div>
          <div className="stat-value">{stats.phone_verified.count.toLocaleString()}</div>
          <div className="stat-percentage">
            {stats.phone_verified.percentage}%
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-label">
            <FiCheckCircle size={16} />
            <span>Both Verified</span>
          </div>
          <div className="stat-value">{stats.both_verified.count.toLocaleString()}</div>
          <div className="stat-percentage">
            {stats.both_verified.percentage}%
          </div>
        </div>
      </div>

      <div className="card-footer">
        Verification status breakdown
      </div>
    </div>
  );
}