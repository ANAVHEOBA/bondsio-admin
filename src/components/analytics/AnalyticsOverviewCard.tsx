// src/components/analytics/AnalyticsOverviewCard.tsx

import { useEffect, useState } from 'react';
import { getAnalyticsOverview } from '../../api/analytics/api';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import './AnalyticsOverviewCard.css';
import { FiActivity, FiUserPlus, FiUserX } from 'react-icons/fi';

interface AnalyticsOverviewCardProps {
  token: string;
}

interface ProcessedDataPoint {
  label: string;
  signUps: number;
  active: number;
  churned: number;
}

export default function AnalyticsOverviewCard({ token }: AnalyticsOverviewCardProps) {
  const [data, setData] = useState<ProcessedDataPoint[]>([]);
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAnalyticsOverview(token, period);
        
        // Combine the three datasets into one for the chart
        const combinedData: ProcessedDataPoint[] = response.data.signUps.map((signUp, index) => ({
          label: signUp.label,
          signUps: signUp.count,
          active: response.data.active[index]?.count || 0,
          churned: response.data.churned[index]?.count || 0
        }));

        setData(combinedData);
      } catch (err) {
        setError('Failed to load analytics overview');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, [token, period]);

  const handlePeriodChange = (newPeriod: 'daily' | 'weekly' | 'monthly') => {
    setPeriod(newPeriod);
  };

  if (loading) {
    return (
      <div className="analytics-overview-card skeleton">
        <div className="card-header">
          <div className="icon-placeholder"></div>
          <div className="title-placeholder"></div>
          <div className="period-selector-placeholder"></div>
        </div>
        <div className="chart-placeholder">
          <div className="chart-content-placeholder"></div>
        </div>
        <div className="stats-grid-placeholder">
          {[1, 2, 3].map(i => (
            <div key={i} className="stat-item-placeholder">
              <div className="stat-icon-placeholder"></div>
              <div className="stat-content-placeholder">
                <div className="stat-label-placeholder"></div>
                <div className="stat-value-placeholder"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-overview-card error">
        <div className="error-content">
          <FiActivity size={24} />
          <h3>Analytics Overview</h3>
          <p>{error}</p>
          <button 
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Calculate totals for the current period
  const totalSignUps = data.reduce((sum, item) => sum + item.signUps, 0);
  const totalActive = data.reduce((sum, item) => sum + item.active, 0);
  const totalChurned = data.reduce((sum, item) => sum + item.churned, 0);

  return (
    <div className="analytics-overview-card">
      <div className="card-header">
        <FiActivity size={20} />
        <h3>Analytics Overview</h3>
        <div className="period-selector">
          <button 
            className={period === 'daily' ? 'active' : ''}
            onClick={() => handlePeriodChange('daily')}
          >
            Daily
          </button>
          <button 
            className={period === 'weekly' ? 'active' : ''}
            onClick={() => handlePeriodChange('weekly')}
          >
            Weekly
          </button>
          <button 
            className={period === 'monthly' ? 'active' : ''}
            onClick={() => handlePeriodChange('monthly')}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="label" 
              tick={{ fontSize: 12 }}
              tickMargin={10}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickMargin={10}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="signUps" 
              name="New Signups" 
              stroke="#8b5cf6" 
              fill="#8b5cf6" 
              fillOpacity={0.1}
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="active" 
              name="Active Users" 
              stroke="#10b981" 
              fill="#10b981" 
              fillOpacity={0.1}
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="churned" 
              name="Churned Users" 
              stroke="#f59e0b" 
              fill="#f59e0b" 
              fillOpacity={0.1}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-icon signups">
            <FiUserPlus size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Signups</div>
            <div className="stat-value">{totalSignUps.toLocaleString()}</div>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon active">
            <FiActivity size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Active Users</div>
            <div className="stat-value">{totalActive.toLocaleString()}</div>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon churned">
            <FiUserX size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Churned Users</div>
            <div className="stat-value">{totalChurned.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="card-footer">
        Showing {period} data • Last updated just now
      </div>
    </div>
  );
}