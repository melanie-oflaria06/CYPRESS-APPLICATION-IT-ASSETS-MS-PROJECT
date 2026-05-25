import { useState, useEffect } from "react";
import assetApi from "../api/assetApi";
import assignmentApi from "../api/assignmentApi";

/**
 * Dashboard Page
 * Displays summary statistics and recent activities
 */
function Dashboard() {
  const [stats, setStats] = useState({
    totalAssets: 0,
    available: 0,
    inUse: 0,
    lost: 0,
    underRepair: 0
  });
  const [recentAssignments, setRecentAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [assetsResponse, assignmentsResponse] = await Promise.all([
        assetApi.getAll(),
        assignmentApi.getAll()
      ]);

      const assets = assetsResponse || [];
      const assignments = assignmentsResponse || [];

      // Calculate statistics
      const counts = {
        totalAssets: assets.length,
        available: assets.filter(a => a?.status === 'AVAILABLE').length,
        inUse: assets.filter(a => a?.status === 'IN_USE').length,
        lost: assets.filter(a => a?.status === 'LOST').length,
        underRepair: assets.filter(a => a?.status === 'UNDER_REPAIR').length
      };

      setStats(counts);
      setRecentAssignments(assignments.slice(-5).reverse());
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard data...</div>;

  return (
    <div className="dashboard-page">
      <header className="page-header">
        <h1 className="page-title">Dashboard Overview</h1>
        <p className="page-subtitle">Real-time status of your IT inventory</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-number">{stats.totalAssets}</div>
          <div className="stat-label">Total Assets</div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon">✅</div>
          <div className="stat-number">{stats.available}</div>
          <div className="stat-label">Available</div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon">💻</div>
          <div className="stat-number">{stats.inUse}</div>
          <div className="stat-label">In Use</div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '20px' }}>Recent Activity</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Asset</th>
                <th>Employee</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentAssignments.length > 0 ? (
                recentAssignments.map(item => (
                  <tr key={item.id}>
                    <td>{item.assignedDate || 'N/A'}</td>
                    <td>{item.asset?.name || 'Unknown'}</td>
                    <td>{item.user?.fullName || 'Unknown'}</td>
                    <td>
                      <span className={`badge badge-${item.status?.toLowerCase() || 'unknown'}`}>
                        {item.status || 'UNKNOWN'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ padding: '40px' }}>
                    No recent activity.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
