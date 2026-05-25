import { useState, useEffect } from "react";
import userApi from "../api/userApi";
import Modal from "../components/Modal";

/**
 * Employees Management Page
 */
function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    department: "",
    position: "",
    contactNumber: "",
    role: "EMPLOYEE"
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userApi.getAll();
      setUsers(data || []);
    } catch (err) {
      console.error("Failed to load employees:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({ ...user });
    } else {
      setEditingUser(null);
      setFormData({
        fullName: "",
        email: "",
        department: "",
        position: "",
        contactNumber: "",
        role: "EMPLOYEE"
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await userApi.update(editingUser.id, formData);
      } else {
        await userApi.create(formData);
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Error saving employee record.");
    }
  };

  const filteredUsers = users.filter(u => {
    const s = search.toLowerCase();
    return (
      (u.fullName?.toLowerCase() || "").includes(s) ||
      (u.email?.toLowerCase() || "").includes(s) ||
      (u.department?.toLowerCase() || "").includes(s)
    );
  });

  return (
    <div className="users-page">
      <header className="page-header">
        <h1 className="page-title">Employee Directory</h1>
        <p className="page-subtitle">Manage staff members and roles</p>
      </header>

      <div className="toolbar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Search employees..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <span>➕</span> Register Employee
        </button>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Full Name</th>
                {/* CENTER ALIGNED DEPARTMENT */}
                <th>Department</th>
                <th>Position</th>
                <th>Email Address</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="loading">Fetching records...</td></tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div style={{ fontWeight: '600' }}>{user.fullName}</div>
                      <div style={{ fontSize: '11px' }} className={`badge badge-${user.role?.toLowerCase()}`}>
                        {user.role}
                      </div>
                    </td>
                    {/* DISPLAY CENTERED DEPARTMENT */}
                    <td>{user.department || "—"}</td>
                    <td>{user.position || "—"}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`badge ${user.active ? 'badge-available' : 'badge-retired'}`}>
                        {user.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn btn-secondary btn-sm" onClick={() => handleOpenModal(user)}>✏️ Edit</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="empty-state">
                    <div className="empty-icon">👥</div>
                    <p>No employees found.</p>
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
        title={editingUser ? "Edit Employee Information" : "Register New Employee"}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              {editingUser ? "Update Profile" : "Register"}
            </button>
          </>
        }
      >
        <form className="user-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input 
              className="form-control"
              required
              value={formData.fullName || ""}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email"
              className="form-control"
              required
              value={formData.email || ""}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Department</label>
              <input 
                className="form-control"
                required
                value={formData.department || ""}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Position</label>
              <input 
                className="form-control"
                value={formData.position || ""}
                onChange={(e) => setFormData({...formData, position: e.target.value})}
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Users;
