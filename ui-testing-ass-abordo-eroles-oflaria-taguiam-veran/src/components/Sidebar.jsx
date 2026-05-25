import { NavLink } from "react-router-dom";

/**
 * Sidebar Component
 * Provides main navigation for the system
 */
function Sidebar({ onLogout }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h2>IT ASSET MS</h2>
        <p>Asset Management System</p>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">General</div>
        <NavLink to="/" className="nav-link">
          <span className="nav-icon">📊</span>
          <span>Dashboard</span>
        </NavLink>

        <div className="sidebar-section-label">Inventory</div>
        <NavLink to="/assets" className="nav-link">
          <span className="nav-icon">💻</span>
          <span>Asset List</span>
        </NavLink>

        <div className="sidebar-section-label">Resources</div>
        <NavLink to="/users" className="nav-link">
          <span className="nav-icon">👥</span>
          <span>Employees</span>
        </NavLink>

        <div className="sidebar-section-label">Operations</div>
        <NavLink to="/assignments" className="nav-link">
          <span className="nav-icon">📝</span>
          <span>Assignments</span>
        </NavLink>
        <NavLink to="/maintenance" className="nav-link">
          <span className="nav-icon">🔧</span>
          <span>Maintenance</span>
        </NavLink>

        <div className="sidebar-section-label">Account</div>
        <button 
          data-test="logout-button"
          className="nav-link" 
          onClick={() => {
            localStorage.removeItem("isLoggedIn");
            onLogout(); // Update parent state
          }}
          style={{
            background: "none",
            border: "none",
            width: "100%",
            textAlign: "left",
            cursor: "pointer",
            padding: "12px 16px",
            color: "var(--text-main)",
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}
        >
          <span className="nav-icon">🚪</span>
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;
