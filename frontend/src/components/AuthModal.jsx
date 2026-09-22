import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { X, Lock, Mail, User, Store } from "lucide-react";

const AuthModal = ({ isOpen, onClose }) => {
  const { loginUser, registerUser, loginFoodPartner, registerFoodPartner } = useAuth();

  const [role, setRole] = useState("user"); // "user" | "foodpartner"
  const [isLogin, setIsLogin] = useState(true); // true = login, false = register

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (role === "user") {
        if (isLogin) {
          await loginUser(email, password);
        } else {
          await registerUser(fullName, email, password);
        }
      } else {
        if (isLogin) {
          await loginFoodPartner(email, password);
        } else {
          await registerFoodPartner(fullName, email, password);
        }
      }
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Authentication failed. Please check your credentials or backend server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "none",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
          }}
        >
          <X size={22} />
        </button>

        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", fontWeight: 700, marginBottom: "8px" }}>
          {isLogin ? "Welcome Back!" : "Create an Account"}
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "20px" }}>
          Explore delicious food reels & connect with top food partners.
        </p>

        {/* Role Switcher Tabs */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
            background: "rgba(255, 255, 255, 0.05)",
            padding: "4px",
            borderRadius: "var(--radius-md)",
            marginBottom: "20px",
          }}
        >
          <button
            type="button"
            onClick={() => {
              setRole("user");
              setError("");
            }}
            style={{
              padding: "8px 12px",
              borderRadius: "var(--radius-sm)",
              border: "none",
              background: role === "user" ? "var(--primary)" : "transparent",
              color: role === "user" ? "#fff" : "var(--text-muted)",
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            <User size={16} />
            Customer
          </button>
          <button
            type="button"
            onClick={() => {
              setRole("foodpartner");
              setError("");
            }}
            style={{
              padding: "8px 12px",
              borderRadius: "var(--radius-sm)",
              border: "none",
              background: role === "foodpartner" ? "var(--accent-gold)" : "transparent",
              color: role === "foodpartner" ? "#000" : "var(--text-muted)",
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            <Store size={16} />
            Restaurant Partner
          </button>
        </div>

        {error && (
          <div
            style={{
              padding: "10px 14px",
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              borderRadius: "var(--radius-md)",
              color: "#f87171",
              fontSize: "0.85rem",
              marginBottom: "16px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Full Name / Restaurant Name</label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  required
                  placeholder={role === "user" ? "John Doe" : "Tasty Bites Bistro"}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: "40px" }}
                />
                <User
                  size={18}
                  style={{ position: "absolute", left: "14px", top: "12px", color: "var(--text-muted)" }}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: "relative" }}>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{ paddingLeft: "40px" }}
              />
              <Mail
                size={18}
                style={{ position: "absolute", left: "14px", top: "12px", color: "var(--text-muted)" }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: "relative" }}>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: "40px" }}
              />
              <Lock
                size={18}
                style={{ position: "absolute", left: "14px", top: "12px", color: "var(--text-muted)" }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "10px", padding: "12px" }}
          >
            {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div style={{ marginTop: "20px", textAlign: "center", fontSize: "0.88rem", color: "var(--text-muted)" }}>
          {isLogin ? "Don't have an account?" : "Already registered?"}{" "}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            style={{
              background: "none",
              border: "none",
              color: "var(--primary)",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
