import { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Basic Login Page for IT-ASSET-MS
 * Fulfills the requirements for automated UI testing
 */
function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple mock authentication
    if (username === "admin" && password === "password123") {
      localStorage.setItem("isLoggedIn", "true");
      onLogin(); // Update parent state
      navigate("/");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="login-container" style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "var(--bg-main, #f8f9fa)"
    }}>
      <form onSubmit={handleLogin} style={{
        padding: "40px",
        borderRadius: "12px",
        backgroundColor: "#fff",
        boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "400px"
      }}>
        <h2 style={{ marginBottom: "24px", textAlign: "center" }}>Login to IT Asset MS</h2>
        
        {error && (
          <div data-test="error" style={{
            color: "#d32f2f",
            backgroundColor: "#ffebee",
            padding: "10px",
            borderRadius: "4px",
            marginBottom: "16px",
            fontSize: "14px"
          }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Username</label>
          <input
            type="text"
            data-test="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ddd",
              outline: "none"
            }}
            placeholder="Enter username"
            required
          />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Password</label>
          <input
            type="password"
            data-test="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ddd",
              outline: "none"
            }}
            placeholder="Enter password"
            required
          />
        </div>

        <button
          type="submit"
          data-test="login-button"
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#1a73e8",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
