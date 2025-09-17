// src/components/analytics/DemographyStatsCard.tsx

import { useEffect, useState } from 'react';
import { getUserDemographyStats } from '../../api/analytics/api';
import './DemographyStatsCard.css';
import { FiMapPin, FiUser, FiCalendar } from 'react-icons/fi';

interface DemographyStatsCardProps {
  token: string;
}

interface ProcessedDemographicData {
  age: Array<{ bucket: string; count: number; percentage: number }>;
  gender: Array<{ gender: string; count: number; percentage: number }>;
  countries: Array<{ country: string; count: number; percentage: number }>;
  totalUsers: number;
}

export default function DemographyStatsCard({ token }: DemographyStatsCardProps) {
  const [demographics, setDemographics] = useState<ProcessedDemographicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDemographics = async () => {
      try {
        const response = await getUserDemographyStats(token);
        const data = response.data;

        // Calculate total users from age data (most reliable)
        const totalUsers = data.age.reduce((sum, item) => sum + parseInt(item.count), 0);

        // Process age data
        const ageData = data.age.map(item => ({
          bucket: item.bucket,
          count: parseInt(item.count),
          percentage: totalUsers > 0 ? Math.round((parseInt(item.count) / totalUsers) * 100) : 0
        }));

        // Process gender data
        const genderData = data.gender.map(item => ({
          gender: item.gender,
          count: parseInt(item.count),
          percentage: totalUsers > 0 ? Math.round((parseInt(item.count) / totalUsers) * 100) : 0
        }));

        // Process country data (filter out null countries)
        const countryData = data.countries
          .filter(item => item.country)
          .map(item => ({
            country: item.country || 'Unknown',
            count: parseInt(item.count),
            percentage: totalUsers > 0 ? Math.round((parseInt(item.count) / totalUsers) * 100) : 0
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5); // Top 5 countries

        setDemographics({
          age: ageData,
          gender: genderData,
          countries: countryData,
          totalUsers
        });
      } catch (err) {
        setError('Failed to load demography stats');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDemographics();
  }, [token]);

  if (loading) {
    return (
      <div className="demography-stats-card skeleton">
        <div className="card-header">
          <div className="icon-placeholder"></div>
          <div className="title-placeholder"></div>
        </div>
        <div className="demographics-sections">
          {[1, 2, 3].map(section => (
            <div key={section} className="demographic-section">
              <div className="section-header-placeholder"></div>
              <div className="items-placeholder">
                {[1, 2, 3].map(item => (
                  <div key={item} className="item-placeholder">
                    <div className="label-placeholder"></div>
                    <div className="bar-placeholder"></div>
                    <div className="count-placeholder"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="demography-stats-card error">
        <div className="error-content">
          <FiUser size={24} />
          <h3>User Demographics</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!demographics) return null;

  return (
    <div className="demography-stats-card">
      <div className="card-header">
        <FiUser size={20} />
        <h3>User Demographics</h3>
        <span className="total-users-badge">{demographics.totalUsers} users</span>
      </div>

      <div className="demographics-sections">
        {/* Age Section */}
        <div className="demographic-section">
          <div className="section-header">
            <FiCalendar size={16} />
            <h4>Age Distribution</h4>
          </div>
          <div className="demographic-items">
            {demographics.age.map((item, index) => (
              <div key={index} className="demographic-item">
                <div className="item-label">{item.bucket}</div>
                <div className="item-bar-container">
                  <div 
                    className="item-bar" 
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <div className="item-count">
                  <span className="count">{item.count}</span>
                  <span className="percentage">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gender Section */}
        <div className="demographic-section">
          <div className="section-header">
            <FiUser size={16} />
            <h4>Gender Distribution</h4>
          </div>
          <div className="demographic-items">
            {demographics.gender.map((item, index) => (
              <div key={index} className="demographic-item">
                <div className="item-label">
                  {item.gender === 'unknown' ? 'Not Specified' : item.gender}
                </div>
                <div className="item-bar-container">
                  <div 
                    className="item-bar" 
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <div className="item-count">
                  <span className="count">{item.count}</span>
                  <span className="percentage">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Countries Section */}
        <div className="demographic-section">
          <div className="section-header">
            <FiMapPin size={16} />
            <h4>Top Countries</h4>
          </div>
          <div className="demographic-items">
            {demographics.countries.map((item, index) => (
              <div key={index} className="demographic-item">
                <div className="item-label">{item.country}</div>
                <div className="item-bar-container">
                  <div 
                    className="item-bar" 
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <div className="item-count">
                  <span className="count">{item.count}</span>
                  <span className="percentage">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card-footer">
        Based on user profile information
      </div>
    </div>
  );
}