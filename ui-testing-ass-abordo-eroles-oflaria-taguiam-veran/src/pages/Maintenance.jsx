import { useState, useEffect } from "react";
import maintenanceApi from "../api/maintenanceApi";
import assetApi from "../api/assetApi";
import Modal from "../components/Modal";

/**
 * Maintenance & Repairs Management Page
 * Handles sending hardware to repair, resolving logs, and keeping track of costs.
 */
function Maintenance() {
  const [logs, setLogs] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  // Form State for creating a repair log
  const [createFormData, setCreateFormData] = useState({
    assetId: "",
    issue: "",
    cost: "",
    remarks: ""
  });

  // Form State for resolving a repair log
  const [resolveFormData, setResolveFormData] = useState({
    status: "COMPLETED",
    remarks: "",
    cost: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [logsData, assetsData] = await Promise.all([
        maintenanceApi.getAll(),
        assetApi.getAll()
      ]);
      setLogs(logsData || []);
      setAssets(assetsData || []);
    } catch (err) {
      console.error("Failed to load maintenance data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Only AVAILABLE assets can be sent to repair
  const availableAssets = assets.filter(a => a.status === "AVAILABLE");

  const handleOpenCreateModal = () => {
    setCreateFormData({
      assetId: "",
      issue: "",
      cost: "",
      remarks: ""
    });
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!createFormData.assetId || !createFormData.issue) {
      alert("Paki-fill up lahat ng required fields (Asset at Sira).");
      return;
    }
    try {
      await maintenanceApi.create({
        assetId: parseInt(createFormData.assetId),
        issue: createFormData.issue,
        cost: createFormData.cost ? parseFloat(createFormData.cost) : null,
        remarks: createFormData.remarks
      });
      setIsCreateModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "An error occurred while saving the repair log.");
    }
  };

  const handleOpenResolveModal = (log) => {
    setSelectedLog(log);
    setResolveFormData({
      status: "COMPLETED",
      remarks: "",
      cost: log.cost || ""
    });
    setIsResolveModalOpen(true);
  };

  const handleResolveSubmit = async (e) => {
    e.preventDefault();
    if (!resolveFormData.remarks || !resolveFormData.cost) {
      alert("Paki-lagay ang Actual Cost at Final Remarks.");
      return;
    }
    try {
      await maintenanceApi.resolve(
        selectedLog.id,
        resolveFormData.status,
        resolveFormData.remarks,
        parseFloat(resolveFormData.cost)
      );
      setIsResolveModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "An error occurred while resolving repair.");
    }
  };

  return (
    <div className="maintenance-page">
      <header className="page-header">
        <h1 className="page-title">Maintenance & Repairs</h1>
        <p className="page-subtitle">Track hardware repairs and analyze servicing records</p>
      </header>

      <div className="toolbar">
        <div className="search-box" style={{ opacity: 0.4, pointerEvents: 'none' }}>
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Search repair logs..." disabled />
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreateModal}>
          <span>🔧</span> Send Device to Repair
        </button>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Start Date</th>
                <th>Asset Details</th>
                <th>Reported Issue</th>
                <th>Resolution Date</th>
                <th>Cost</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="loading">Fetching repair logs...</td></tr>
              ) : logs.length > 0 ? (
                logs.map(log => (
                  <tr key={log.id}>
                    <td>
                      <div style={{ fontWeight: '500' }}>{log.startDate || 'N/A'}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Log ID: #{log.id}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: '600' }}>{log.asset?.name || 'Unknown'}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>S/N: {log.asset?.serialNumber || 'N/A'}</div>
                    </td>
                    <td>{log.issue}</td>
                    <td>{log.endDate || '—'}</td>
                    <td>{log.cost ? `₱${log.cost.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '—'}</td>
                    <td>
                      <span className={`badge ${log.status === 'PENDING' ? 'badge-repair' : log.status === 'COMPLETED' ? 'badge-available' : 'badge-retired'}`}>
                        {log.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        {log.status === "PENDING" ? (
                          <button className="btn btn-success btn-sm" onClick={() => handleOpenResolveModal(log)}>✔️ Resolve</button>
                        ) : (
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>
                            Resolved ({log.remarks || 'No remarks'})
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="empty-state">
                    <div className="empty-icon">🔧</div>
                    <p>No repair logs recorded in the system.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE REPAIR LOG MODAL */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Send Device to Repair"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsCreateModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleCreateSubmit}>Submit Repair Log</button>
          </>
        }
      >
        <form className="maintenance-form" onSubmit={handleCreateSubmit}>
          <div className="form-group">
            <label className="form-label">Select Sira/Broken Asset</label>
            <select
              className="form-control"
              required
              value={createFormData.assetId}
              onChange={(e) => setCreateFormData({ ...createFormData, assetId: e.target.value })}
            >
              <option value="">-- Select Available Asset --</option>
              {availableAssets.map(asset => (
                <option key={asset.id} value={asset.id}>
                  {asset.name} ({asset.brand} - {asset.model}) [S/N: {asset.serialNumber}]
                </option>
              ))}
            </select>
            {availableAssets.length === 0 && (
              <span style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '4px', display: 'block' }}>
                Note: No assets currently available to put into repair.
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Issue Details / Problema</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Anong problema o anong sira ng asset na ito?"
              required
              value={createFormData.issue}
              onChange={(e) => setCreateFormData({ ...createFormData, issue: e.target.value })}
            />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Est. Cost (Optional)</label>
              <input
                type="number"
                className="form-control"
                placeholder="0.00"
                value={createFormData.cost}
                onChange={(e) => setCreateFormData({ ...createFormData, cost: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Initial Remarks</label>
              <input
                type="text"
                className="form-control"
                placeholder="E.g. Sent to Dell center"
                value={createFormData.remarks}
                onChange={(e) => setCreateFormData({ ...createFormData, remarks: e.target.value })}
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* RESOLVE REPAIR LOG MODAL */}
      <Modal
        isOpen={isResolveModalOpen}
        onClose={() => setIsResolveModalOpen(false)}
        title="Resolve Pending Repair Log"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsResolveModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleResolveSubmit}>Resolve Repair</button>
          </>
        }
      >
        <form className="resolve-form" onSubmit={handleResolveSubmit}>
          {selectedLog && (
            <div style={{ marginBottom: '20px', padding: '16px', background: 'var(--bg-dark)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontWeight: '600' }}>{selectedLog.asset?.name}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>S/N: {selectedLog.asset?.serialNumber}</div>
              <div style={{ fontSize: '14px', marginTop: '8px', color: 'var(--warning)' }}>Sira: {selectedLog.issue}</div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Resolution Result</label>
            <select
              className="form-control"
              value={resolveFormData.status}
              onChange={(e) => setResolveFormData({ ...resolveFormData, status: e.target.value })}
            >
              <option value="COMPLETED">COMPLETED (Repaired & Restored to AVAILABLE)</option>
              <option value="IRREPARABLE">IRREPARABLE (Cannot be fixed & marked as DISPOSED)</option>
            </select>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Actual Cost (₱)</label>
              <input
                type="number"
                className="form-control"
                placeholder="0.00"
                required
                value={resolveFormData.cost}
                onChange={(e) => setResolveFormData({ ...resolveFormData, cost: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Final Service Remarks</label>
              <input
                type="text"
                className="form-control"
                placeholder="What was done/repaired..."
                required
                value={resolveFormData.remarks}
                onChange={(e) => setResolveFormData({ ...resolveFormData, remarks: e.target.value })}
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Maintenance;
