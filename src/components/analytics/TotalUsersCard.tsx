// src/components/analytics/TotalUsersCard.tsx

import { useEffect, useState } from 'react';
import { getTotalUsers } from '../../api/analytics/api';
import './TotalUsersCard.css';

interface TotalUsersCardProps {
  token: string;
}

export default function TotalUsersCard({ token }: TotalUsersCardProps) {
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTotal = async () => {
      try {
        const response = await getTotalUsers(token);
        setTotal(response.data.total);
      } catch (err) {
        setError('Failed to load total users');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTotal();
  }, [token]);

  if (loading) {
    return (
      <div className="total-users-card loading">
        <h3>Total Users</h3>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="total-users-card error">
        <h3>Total Users</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="total-users-card">
      <h3>Total Users</h3>
      <p className="total-number">{total?.toLocaleString()}</p>
    </div>
  );
}