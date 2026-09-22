import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";
import { Store, Heart, Film, ArrowLeft, CheckCircle2 } from "lucide-react";

const PartnerProfilePage = () => {
  const { partnerId } = useParams();
  const [partnerData, setPartnerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/food/partner-profile/${partnerId}`);
        setPartnerData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load partner profile.");
      } finally {
        setLoading(false);
      }
    };

    if (partnerId) fetchProfile();
  }, [partnerId]);

  if (loading) {
    return <div style={{ textAlign: "center", padding: "80px", color: "var(--text-muted)" }}>Loading partner profile...</div>;
  }

  if (error || !partnerData) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "12px" }}>Food Partner Not Found</h2>
        <Link to="/" className="btn btn-primary">Back to Reels Feed</Link>
      </div>
    );
  }

  const { partner, foods, totalLikes, totalReels } = partnerData;

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "30px 20px" }}>
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
        Back to Food Reels
      </Link>

      {/* Partner Banner Header */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(226, 55, 68, 0.15) 0%, rgba(20, 24, 32, 0.85) 100%)",
          border: "1px solid var(--border-glass)",
          borderRadius: "var(--radius-lg)",
          padding: "32px",
          marginBottom: "30px",
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "var(--primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: "2rem",
            fontWeight: 800,
            boxShadow: "var(--shadow-glow)",
          }}
        >
          <Store size={40} />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.8rem", fontWeight: 800 }}>
              {partner.fullName}
            </h1>
            <CheckCircle2 size={20} style={{ color: "var(--accent-gold)" }} title="Verified Partner" />
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "12px" }}>
            Official Zomato Food Partner • {partner.email}
          </p>

          <div style={{ display: "flex", gap: "24px", fontSize: "0.9rem" }}>
            <div>
              <span style={{ fontWeight: 800, color: "#fff", fontSize: "1.1rem", marginRight: "6px" }}>{totalReels}</span>
              <span style={{ color: "var(--text-muted)" }}>Reels Published</span>
            </div>
            <div>
              <span style={{ fontWeight: 800, color: "var(--primary)", fontSize: "1.1rem", marginRight: "6px" }}>{totalLikes}</span>
              <span style={{ color: "var(--text-muted)" }}>Likes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reels Gallery Grid */}
      <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.3rem", fontWeight: 700, marginBottom: "18px" }}>
        Food Video Reels ({foods.length})
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" }}>
        {foods.map((food) => (
          <div
            key={food._id}
            className="glass-panel"
            style={{ borderRadius: "var(--radius-md)", overflow: "hidden", display: "flex", flexDirection: "column" }}
          >
            <div style={{ height: "300px", background: "#000", position: "relative" }}>
              <video src={food.video} controls playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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
            <div style={{ padding: "14px" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "4px" }}>{food.name}</h3>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "10px" }}>{food.description}</p>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--primary)", fontWeight: 700, fontSize: "0.85rem" }}>
                <Heart size={14} fill="var(--primary)" />
                <span>{food.likesCount || 0} Likes</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartnerProfilePage;
