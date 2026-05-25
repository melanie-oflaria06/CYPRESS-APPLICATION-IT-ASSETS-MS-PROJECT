import { useState, useEffect } from "react";
import assignmentApi from "../api/assignmentApi";
import assetApi from "../api/assetApi";
import userApi from "../api/userApi";
import Modal from "../components/Modal";

/**
 * Assignments Page
 * Handles assigning assets to employees and tracking returns/losses
 */
function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [assets, setAssets] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    assetId: "",
    userId: "",
    assignedBy: "",
    notes: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [assignData, assetData, userData] = await Promise.all([
        assignmentApi.getAll(),
        assetApi.getAvailable(), 
        userApi.getActive()
      ]);
      setAssignments(assignData || []);
      setAssets(assetData || []);
      setUsers(userData || []);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.assetId || !formData.userId) {
      alert("Please select both an asset and an employee.");
      return;
    }

    try {
      await assignmentApi.assign({
        ...formData,
        assetId: parseInt(formData.assetId),
        userId: parseInt(formData.userId)
      });
      
      setIsModalOpen(false);
      setFormData({ assetId: "", userId: "", assignedBy: "", notes: "" });
      fetchData(); 
    } catch (err) {
      alert(err.response?.data?.message || "Failed to process assignment.");
    }
  };

  const handleReturn = async (id) => {
    if (window.confirm("Confirm return of this asset? It will be marked as AVAILABLE again.")) {
      try {
        await assignmentApi.returnAsset(id);
        fetchData();
      } catch (err) {
        alert("Error processing return.");
      }
    }
  };

  const handleLost = async (id) => {
    if (window.confirm("Are you sure you want to mark this asset as LOST? This is a permanent status change.")) {
      try {
        await assignmentApi.markAsLost(id);
        fetchData();
      } catch (err) {
        alert("Error updating status to LOST.");
      }
    }
  };

  return (
    <div className="assignments-page">
      <header className="page-header">
        <h1 className="page-title">Operations & Assignments</h1>
        <p className="page-subtitle">Track hardware usage, returns, and losses</p>
      </header>

      <div className="toolbar">
        <h2 className="modal-title" style={{ color: 'var(--text-secondary)' }}>All Assignments</h2>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <span>📋</span> Create New Assignment
        </button>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Asset Details</th>
                {/* SEPARATED EMPLOYEE AND DEPARTMENT */}
                <th>Employee</th>
                <th>Department</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="loading">Processing records...</td></tr>
              ) : assignments.length > 0 ? (
                assignments.map(item => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: '500' }}>{item.assignedDate || 'N/A'}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: #{item.id}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: '600' }}>{item.asset?.name || 'Unknown'}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>S/N: {item.asset?.serialNumber || 'N/A'}</div>
                    </td>
                    <td>{item.user?.fullName || 'Unknown User'}</td>
                    {/* CENTER ALIGNED DEPARTMENT */}
                    <td>{item.user?.department || "—"}</td>
                    <td>
                      <span className={`badge badge-${item.status?.toLowerCase() || 'unknown'}`}>
                        {item.status || 'UNKNOWN'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        {item.status === 'ACTIVE' && (
                          <>
                            <button className="btn btn-success btn-sm" onClick={() => handleReturn(item.id)}>↩️ Return</button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleLost(item.id)}>❌ Lost</button>
                          </>
                        )}
                        {item.status !== 'ACTIVE' && (
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>
                            {item.status === 'RETURNED' ? `Returned on ${item.returnedDate}` : 'Reported Lost'}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="empty-state">
                    <div className="empty-icon">📝</div>
                    <p>No assignment records found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Assignment"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit}>Assign Asset</button>
          </>
        }
      >
        <form className="assignment-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Available Asset</label>
            <select 
              className="form-control"
              required
              value={formData.assetId || ""}
              onChange={(e) => setFormData({...formData, assetId: e.target.value})}
            >
              <option value="">-- Select Hardware --</option>
              {assets.map(asset => (
                <option key={asset.id} value={asset.id}>
                  {asset.name} ({asset.brand}) - {asset.serialNumber}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Assign To</label>
            <select 
              className="form-control"
              required
              value={formData.userId || ""}
              onChange={(e) => setFormData({...formData, userId: e.target.value})}
            >
              <option value="">-- Select Employee --</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.fullName} ({user.department})
                </option>
              ))}
            </select>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Authorized By</label>
              <input 
                className="form-control"
                placeholder="Admin Name"
                required
                value={formData.assignedBy || ""}
                onChange={(e) => setFormData({...formData, assignedBy: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Date (Auto-filled if empty)</label>
              <input 
                type="date"
                className="form-control"
                disabled
                placeholder="Today"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notes / Remarks</label>
            <textarea 
              className="form-control"
              rows="3"
              placeholder="Hardware condition, etc."
              value={formData.notes || ""}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Assignments;
