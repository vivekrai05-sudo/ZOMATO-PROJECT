import React, { useState, useEffect } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Film, Heart, PlusCircle, Trash2, Store, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const PartnerDashboardPage = ({ onOpenUpload }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [partnerFoods, setPartnerFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPartnerFoods = async () => {
    setLoading(true);
    try {
      const res = await API.get("/food/partner");
      setPartnerFoods(res.data.foods || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!currentUser || currentUser.role !== "foodpartner") {
      navigate("/");
      return;
    }
    fetchPartnerFoods();
  }, [currentUser]);

  const handleDelete = async (foodId) => {
    if (!window.confirm("Are you sure you want to delete this food reel?")) return;

    try {
      await API.delete(`/food/${foodId}`);
      setPartnerFoods((prev) => prev.filter((item) => item._id !== foodId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete food item.");
    }
  };

  const totalLikes = partnerFoods.reduce((acc, curr) => acc + (curr.likesCount || 0), 0);

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "30px 20px" }}>
      {/* Back to Feed Link */}
      <Link
        to="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          color: "var(--text-muted)",
          textDecoration: "none",
          fontWeight: 600,
          marginBottom: "20px",
          fontSize: "0.9rem",
        }}
      >
        <ArrowLeft size={16} />
        Back to Food Reels Feed
      </Link>

      {/* Header Banner */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "linear-gradient(135deg, rgba(226, 55, 68, 0.15) 0%, rgba(20, 24, 32, 0.8) 100%)",
          border: "1px solid var(--border-glass)",
          borderRadius: "var(--radius-lg)",
          padding: "28px",
          marginBottom: "30px",
          backdropFilter: "blur(12px)",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <Store size={26} style={{ color: "var(--accent-gold)" }} />
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.8rem", fontWeight: 800 }}>
              {currentUser?.fullName}
            </h1>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.92rem" }}>
            Manage your published food video reels & monitor customer engagement.
          </p>
        </div>

        <button onClick={onOpenUpload} className="btn btn-primary" style={{ padding: "12px 20px" }}>
          <PlusCircle size={20} />
          <span>Upload New Reel</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "36px" }}>
        <div className="glass-panel" style={{ padding: "20px", borderRadius: "var(--radius-md)" }}>
          <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: 600, marginBottom: "8px" }}>
            Total Food Reels
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, fontFamily: "var(--font-heading)" }}>
            {partnerFoods.length}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "20px", borderRadius: "var(--radius-md)" }}>
          <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: 600, marginBottom: "8px" }}>
            Total Likes Received
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, fontFamily: "var(--font-heading)", color: "var(--primary)" }}>
            {totalLikes}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "20px", borderRadius: "var(--radius-md)" }}>
          <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: 600, marginBottom: "8px" }}>
            Account Status
          </div>
          <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--accent-green)", display: "flex", alignItems: "center", gap: "6px", marginTop: "6px" }}>
            ● Active Partner
          </div>
        </div>
      </div>

      {/* Food Reels List */}
      <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.4rem", fontWeight: 700, marginBottom: "16px" }}>
        Your Uploaded Food Reels ({partnerFoods.length})
      </h2>

      {loading ? (
        <div style={{ padding: "40px 0", color: "var(--text-muted)" }}>Loading your food reels...</div>
      ) : partnerFoods.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
          {partnerFoods.map((food) => (
            <div
              key={food._id}
              className="glass-panel"
              style={{
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Video Thumbnail */}
              <div style={{ height: "260px", background: "#000", position: "relative" }}>
                <video
                  src={food.video}
                  muted
                  playsInline
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <span
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    padding: "4px 10px",
                    background: "var(--accent-gold)",
                    color: "#000",
                    fontWeight: 800,
                    fontSize: "0.85rem",
                    borderRadius: "var(--radius-sm)",
                  }}
                >
                  ₹{food.price}
                </span>
              </div>

              {/* Card Details */}
              <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "6px" }}>{food.name}</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "12px" }}>
                    {food.description || "No description provided."}
                  </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "12px", borderTop: "1px solid var(--border-glass)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--primary)", fontWeight: 700, fontSize: "0.9rem" }}>
                    <Heart size={16} fill="var(--primary)" />
                    <span>{food.likesCount || 0} Likes</span>
                  </div>

                  <button
                    onClick={() => handleDelete(food._id)}
                    className="btn btn-secondary"
                    style={{ padding: "6px 12px", color: "#f87171" }}
                    title="Delete Reel"
                  >
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="glass-panel"
          style={{
            padding: "50px 20px",
            textAlign: "center",
            borderRadius: "var(--radius-lg)",
            color: "var(--text-muted)",
          }}
        >
          <Film size={48} style={{ margin: "0 auto 12px auto", opacity: 0.4 }} />
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "4px" }}>
            No Reels Published Yet
          </h3>
          <p style={{ fontSize: "0.88rem", marginBottom: "16px" }}>
            Upload short video reels of your delicious dishes to attract customers!
          </p>
          <button onClick={onOpenUpload} className="btn btn-primary">
            <PlusCircle size={18} />
            <span>Upload First Reel</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default PartnerDashboardPage;
