import { useState, useEffect } from "react";
import assetApi from "../api/assetApi";
import Modal from "../components/Modal";

/**
 * Assets Management Page
 * Handles inventory CRUD operations
 */
function Assets() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    type: "LAPTOP",
    serialNumber: "",
    brand: "",
    model: "",
    purchaseDate: "",
    purchasePrice: "",
    remarks: "",
    status: "AVAILABLE"
  });

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const data = await assetApi.getAll();
      setAssets(data || []);
    } catch (err) {
      console.error("Failed to load assets:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (asset = null) => {
    if (asset) {
      setEditingAsset(asset);
      setFormData({ ...asset });
    } else {
      setEditingAsset(null);
      setFormData({
        name: "",
        type: "LAPTOP",
        serialNumber: "",
        brand: "",
        model: "",
        purchaseDate: "",
        purchasePrice: "",
        remarks: "",
        status: "AVAILABLE"
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAsset) {
        await assetApi.update(editingAsset.id, formData);
      } else {
        await assetApi.create(formData);
      }
      setIsModalOpen(false);
      fetchAssets();
    } catch (err) {
      alert(err.response?.data?.message || "An error occurred while saving the asset.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this asset?")) {
      try {
        await assetApi.delete(id);
        fetchAssets();
      } catch (err) {
        alert("Cannot delete asset. It might be currently assigned.");
      }
    }
  };

  const filteredAssets = assets.filter(a => {
    const s = search.toLowerCase();
    return (
      (a.name?.toLowerCase() || "").includes(s) ||
      (a.serialNumber?.toLowerCase() || "").includes(s) ||
      (a.brand?.toLowerCase() || "").includes(s)
    );
  });

  return (
    <div className="assets-page">
      <header className="page-header">
        <h1 className="page-title">Asset Inventory</h1>
        <p className="page-subtitle">Manage company hardware and peripherals</p>
      </header>

      <div className="toolbar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Search assets..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <span>➕</span> Add New Asset
        </button>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Asset Name</th>
                <th>Type</th>
                <th>Serial Number</th>
                {/* SPLIT BRAND AND MODEL COLUMNS */}
                <th>Brand</th>
                <th>Model</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="loading">Fetching data...</td></tr>
              ) : filteredAssets.length > 0 ? (
                filteredAssets.map(asset => (
                  <tr key={asset.id}>
                    <td>
                      <div style={{ fontWeight: '600' }}>{asset.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ID: #{asset.id}</div>
                    </td>
                    <td>{asset.type}</td>
                    <td><code>{asset.serialNumber}</code></td>
                    {/* DISPLAY BRAND AND MODEL SEPARATELY */}
                    <td>{asset.brand || "—"}</td>
                    <td>{asset.model || "—"}</td>
                    <td>
                      <span className={`badge badge-${asset.status?.toLowerCase().replace('_', '-')}`}>
                        {asset.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn btn-secondary btn-sm" onClick={() => handleOpenModal(asset)}>✏️ Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(asset.id)}>🗑️ Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="empty-state">
                    <div className="empty-icon">📭</div>
                    <p>No assets found.</p>
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
        title={editingAsset ? "Edit Asset Details" : "Register New Asset"}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              {editingAsset ? "Save Changes" : "Create Asset"}
            </button>
          </>
        }
      >
        <form className="asset-form">
          <div className="form-group">
            <label className="form-label">Asset Display Name</label>
            <input 
              className="form-control"
              value={formData.name || ""}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select 
                className="form-control"
                value={formData.type || "LAPTOP"}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option value="LAPTOP">Laptop</option>
                <option value="MONITOR">Monitor</option>
                <option value="MOUSE">Mouse</option>
                <option value="KEYBOARD">Keyboard</option>
                <option value="PRINTER">Printer</option>
                <option value="OTHERS">Others</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Serial Number</label>
              <input 
                className="form-control"
                value={formData.serialNumber || ""}
                onChange={(e) => setFormData({...formData, serialNumber: e.target.value})}
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Brand</label>
              <input 
                className="form-control"
                placeholder="e.g. Apple, Dell"
                value={formData.brand || ""}
                onChange={(e) => setFormData({...formData, brand: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Model</label>
              <input 
                className="form-control"
                placeholder="e.g. MacBook Pro M2"
                value={formData.model || ""}
                onChange={(e) => setFormData({...formData, model: e.target.value})}
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Purchase Price</label>
              <input 
                type="number"
                className="form-control"
                placeholder="0.00"
                value={formData.purchasePrice || ""}
                onChange={(e) => setFormData({...formData, purchasePrice: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Current Status</label>
              <select 
                className="form-control"
                value={formData.status || "AVAILABLE"}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="AVAILABLE">Available</option>
                <option value="IN_USE">In Use</option>
                <option value="UNDER_REPAIR">Under Repair</option>
                <option value="LOST">Lost</option>
                <option value="DISPOSED">Disposed</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Assets;
