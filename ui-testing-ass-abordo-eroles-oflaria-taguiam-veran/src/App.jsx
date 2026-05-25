import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar    from "./components/Sidebar";
import Dashboard  from "./pages/Dashboard";
import Assets     from "./pages/Assets";
import Users      from "./pages/Users";
import Assignments from "./pages/Assignments";
import Maintenance from "./pages/Maintenance";
import Login       from "./pages/Login";

/**
 * Main Application Component
 * Handles routing and global layout
 */
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  return (
    <BrowserRouter>
      <div className="app-layout">
        
        {isLoggedIn && <Sidebar onLogout={handleLogout} />}

        <main className="main-content">
          <Routes>
            <Route path="/login"       element={isLoggedIn ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />} />
            <Route path="/"            element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" replace />}   />
            <Route path="/assets"      element={isLoggedIn ? <Assets /> : <Navigate to="/login" replace />}      />
            <Route path="/users"       element={isLoggedIn ? <Users /> : <Navigate to="/login" replace />}       />
            <Route path="/assignments" element={isLoggedIn ? <Assignments /> : <Navigate to="/login" replace />} />
            <Route path="/maintenance" element={isLoggedIn ? <Maintenance /> : <Navigate to="/login" replace />} />

            {/* 404 - Page Not Found Handler */}
            <Route path="*" element={
              <div style={{ textAlign: "center", padding: "80px", color: "var(--text-muted)" }}>
                <div style={{ fontSize: "64px" }}>🔍</div>
                <h2 style={{ marginTop: "16px" }}>Page Not Found</h2>
                <p>The page you are looking for does not exist.</p>
              </div>
            } />
          </Routes>
        </main>

      </div>
    </BrowserRouter>
  );
}

export default App;
