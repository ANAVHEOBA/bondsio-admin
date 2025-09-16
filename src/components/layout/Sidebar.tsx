// src/components/layout/Sidebar.tsx
import './Sidebar.css';
import { Link, useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const navigate = useNavigate();

  // Add toggle functionality
  const toggleSidebar = () => {
    const current = document.body.getAttribute('data-sidebar-open');
    document.body.setAttribute('data-sidebar-open', current === 'true' ? 'false' : 'true');
  };

  // Add logout functionality
  const handleLogout = () => {
    // Remove the admin token from localStorage
    localStorage.removeItem('admin_token');
    
    // Redirect to login page
    navigate('/', { replace: true });
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src="/Logo.png" alt="Bondsio Admin Logo" className="sidebar-logo-img" />
        {/* Add toggle button */}
        <button onClick={toggleSidebar} style={{
          background: 'transparent',
          border: '1px solid white',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '5px',
          marginTop: '10px',
          cursor: 'pointer'
        }}>
          Toggle Sidebar
        </button>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/dashboard" className="sidebar-link">
              📊 Dashboard
            </Link>
          </li>
          <li>
            <Link to="/users" className="sidebar-link">
              👥 Users
            </Link>
          </li>
          <li>
            <Link to="/communities" className="sidebar-link">
              🌐 Communities
            </Link>
          </li>
          <li>
            <Link to="/content" className="sidebar-link">
              📝 Content
            </Link>
          </li>
          <li>
            <Link to="/analytics" className="sidebar-link">
              📈 Analytics
            </Link>
          </li>
          <li>
            <Link to="/settings" className="sidebar-link">
              ⚙️ Settings
            </Link>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </aside>
  );
}