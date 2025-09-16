// src/layouts/AdminLayout.tsx
import { useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import './AdminLayout.css';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  // Apply sidebar state to body for CSS access
  useEffect(() => {
    document.body.setAttribute('data-sidebar-open', 'true');
    
    // Cleanup on unmount
    return () => {
      document.body.removeAttribute('data-sidebar-open');
    };
  }, []);

  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}