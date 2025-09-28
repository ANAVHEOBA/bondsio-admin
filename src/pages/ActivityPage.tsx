import AdminLayout from '../layouts/AdminLayout';
import ActivityList from '../components/activity/ActivityList';
import TrendingActivityList from '../components/activity/TrendingActivityList';
import { useEffect, useRef } from 'react';
import './ActivityPage.css';

export default function ActivityPage() {
  const trendingRef = useRef<HTMLDivElement>(null);

  // 👇 Infinite scroll logic: load more trending activities when scrolled near bottom
  useEffect(() => {
    const handleScroll = () => {
      if (!trendingRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const nearBottom = scrollHeight - scrollTop - clientHeight < 500; // 500px before bottom

      if (nearBottom) {
        // You could trigger a “load more” state here
        // For now, we assume TrendingActivityList already paginates on its own
        // If you want to dynamically load more, we’ll add that next.
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AdminLayout>
      <div className="activity-page">
        <h1>Admin Activities</h1>

        {/* Main Activity List */}
        <div className="activity-section">
          <ActivityList />
        </div>

        {/* Divider */}
        <div className="divider">
          <hr />
          <span>Trending Activities</span>
          <hr />
        </div>

        {/* Trending Activity List */}
        <div className="trending-section" ref={trendingRef}>
          <TrendingActivityList />
        </div>
      </div>
    </AdminLayout>
  );
}