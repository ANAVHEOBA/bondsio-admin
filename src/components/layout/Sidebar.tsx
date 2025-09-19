import './Sidebar.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  /* ---------- sidebar collapse ---------- */
  const toggleSidebar = () => {
    const cur = document.body.getAttribute('data-sidebar-open');
    document.body.setAttribute('data-sidebar-open', cur === 'true' ? 'false' : 'true');
  };

  /* ---------- logout ---------- */
  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/', { replace: true });
  };

  /* ---------- reports sub-nav ---------- */
  const [reportsOpen, setReportsOpen] = useState(
    ['/reports/bonds', '/reports/activities', '/reports/users', '/reports/stories']
      .some(p => pathname.startsWith(p))
  );

  return (
    <aside className="sidebar">
      {/* ------- logo ------- */}
      <div className="sidebar-logo">
        <img src="/Logo.png" alt="Bondsio Admin Logo" className="sidebar-logo-img" />
        <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
          Toggle Sidebar
        </button>
      </div>

      {/* ------- nav ------- */}
      <nav className="sidebar-nav">
        <ul>
          <li><NavLink to="/dashboard" ico="📊">Dashboard</NavLink></li>
          <li><NavLink to="/users" ico="👥">Users</NavLink></li>
          <li><NavLink to="/communities" ico="🌐">Communities</NavLink></li>
          <li><NavLink to="/content" ico="📝">Content</NavLink></li>
          <li><NavLink to="/analytics" ico="📈">Analytics</NavLink></li>

          {/* ----- Reports (collapsible) ----- */}
          <li>
            <button
              className={`sidebar-link reports-trigger ${reportsOpen ? 'open' : ''}`}
              onClick={() => setReportsOpen(v => !v)}
            >
              <span>🚩</span>
              <span>Reports</span>
              <span className="chevron">›</span>
            </button>

            {reportsOpen && (
              <ul className="sidebar-sub">
                <li><NavLink to="/reports/bonds">Reported Bonds</NavLink></li>
                <li><NavLink to="/reports/activities">Reported Activities</NavLink></li>
                <li><NavLink to="/reports/users">Reported Users</NavLink></li>
                <li><NavLink to="/reports/stories">Reported Stories</NavLink></li>
              </ul>
            )}
          </li>

          <li><NavLink to="/settings" ico="⚙️">Settings</NavLink></li>
        </ul>
      </nav>

      {/* ------- footer ------- */}
      <div className="sidebar-footer">
        <button className="sidebar-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </aside>
  );
}

/* small helper to avoid repetition */
function NavLink({ to, ico, children }: { to: string; ico?: string; children: string }) {
  const { pathname } = useLocation();
  const active = pathname === to || pathname.startsWith(to + '/');
  return (
    <Link to={to} className={`sidebar-link ${active ? 'active' : ''}`}>
      {ico && <span>{ico}</span>}
      <span>{children}</span>
    </Link>
  );
}