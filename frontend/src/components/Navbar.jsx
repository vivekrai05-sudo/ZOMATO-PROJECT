import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Utensils, PlusCircle, LayoutDashboard, LogOut, User, Video, Search, ShoppingBag } from "lucide-react";

const Navbar = ({ onOpenAuth, onOpenUpload, onOpenCart, searchQuery, setSearchQuery }) => {
  const { currentUser, logout } = useAuth();
  const { totalItems } = useCart();

  return (
    <header className="navbar">
      {/* Left: Brand Logo */}
      <Link to="/" className="brand-logo">
        <div style={{ width: "38px", height: "38px", borderRadius: "12px", background: "linear-gradient(135deg, #e23744, #ff5252)", display: "flex", alignItems: "center", justifyCenter: "center", color: "#fff", boxShadow: "0 4px 12px rgba(226,55,68,0.4)" }}>
          <Utensils size={20} style={{ margin: "auto" }} />
        </div>
        <span>Food<span style={{ color: "var(--primary)" }}>Reels</span></span>
        <span className="brand-badge">ZOMATO</span>
      </Link>

      {/* Middle: Live Search Bar */}
      <div style={{ flex: 1, maxWidth: "340px", margin: "0 20px", position: "relative" }}>
        <input
          type="text"
          placeholder="Search dishes or restaurants..."
          value={searchQuery || ""}
          onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
          className="form-input"
          style={{ padding: "8px 16px 8px 38px", fontSize: "0.88rem", borderRadius: "var(--radius-full)" }}
        />
        <Search size={16} style={{ position: "absolute", left: "14px", top: "10px", color: "var(--text-muted)" }} />
      </div>

      {/* Right: Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Link to="/" className="btn btn-secondary" style={{ padding: "8px 14px" }}>
          <Video size={18} />
          <span>Feed</span>
        </Link>

        {/* Cart Drawer Trigger Button */}
        <button
          onClick={onOpenCart}
          className="btn btn-secondary"
          style={{ padding: "8px 14px", position: "relative" }}
        >
          <ShoppingBag size={18} style={{ color: "var(--accent-gold)" }} />
          <span>Cart</span>
          {totalItems > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-4px",
                right: "-4px",
                background: "var(--primary)",
                color: "#fff",
                borderRadius: "50%",
                fontSize: "0.72rem",
                fontWeight: 800,
                width: "20px",
                height: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {totalItems}
            </span>
          )}
        </button>

        {currentUser?.role === "foodpartner" && (
          <>
            <button onClick={onOpenUpload} className="btn btn-primary" style={{ padding: "8px 16px" }}>
              <PlusCircle size={18} />
              <span>Add Reel</span>
            </button>

            <Link to="/partner/dashboard" className="btn btn-secondary" style={{ padding: "8px 14px" }}>
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </Link>
          </>
        )}

        {currentUser ? (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 14px",
                background: "rgba(255, 255, 255, 0.06)",
                borderRadius: "var(--radius-full)",
                border: "1px solid var(--border-glass)",
                fontSize: "0.85rem",
                fontWeight: 600,
              }}
            >
              <User size={16} style={{ color: "var(--primary)" }} />
              <span>{currentUser.fullName}</span>
              <span
                style={{
                  fontSize: "0.7rem",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  background: currentUser.role === "foodpartner" ? "rgba(255, 180, 0, 0.2)" : "rgba(226, 55, 68, 0.2)",
                  color: currentUser.role === "foodpartner" ? "var(--accent-gold)" : "var(--primary)",
                  fontWeight: 700,
                }}
              >
                {currentUser.role === "foodpartner" ? "PARTNER" : "USER"}
              </span>
            </div>

            <button
              onClick={logout}
              className="btn btn-secondary"
              title="Logout"
              style={{ padding: "8px 12px", color: "#f87171" }}
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <button onClick={onOpenAuth} className="btn btn-primary">
            <User size={18} />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
