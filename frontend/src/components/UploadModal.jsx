import React, { useState } from "react";
import API from "../services/api";
import { X, UploadCloud, Film, Tag, DollarSign, FileText } from "lucide-react";

const UploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Burgers");
  const [videoFile, setVideoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("video/")) {
        setError("Please select a valid video file (MP4, MOV, WebM).");
        return;
      }
      setVideoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile) {
      setError("Please attach a food reel video file.");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("name", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("video", videoFile);

    try {
      const res = await API.post("/food", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (onUploadSuccess) onUploadSuccess(res.data.food);
      onClose();
      // Reset form
      setTitle("");
      setDescription("");
      setPrice("");
      setVideoFile(null);
      setPreviewUrl(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload food reel. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: "540px" }} onClick={(e) => e.stopPropagation()}>
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

        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.4rem", fontWeight: 700, marginBottom: "6px" }}>
          Upload New Food Reel 🎥
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: "18px" }}>
          Showcase your delicious dish to thousands of food lovers.
        </p>

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
          {/* File Picker / Preview Box */}
          <div className="form-group">
            <label className="form-label">Video Reel File</label>
            <div
              style={{
                border: "2px dashed var(--border-glass)",
                borderRadius: "var(--radius-md)",
                padding: previewUrl ? "10px" : "24px",
                textAlign: "center",
                background: "rgba(255, 255, 255, 0.02)",
                cursor: "pointer",
                position: "relative",
              }}
            >
              {previewUrl ? (
                <div style={{ position: "relative", borderRadius: "var(--radius-sm)", overflow: "hidden", maxHeight: "140px" }}>
                  <video src={previewUrl} controls style={{ width: "100%", maxHeight: "140px", objectFit: "cover" }} />
                  <button
                    type="button"
                    onClick={() => {
                      setVideoFile(null);
                      setPreviewUrl(null);
                    }}
                    style={{
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                      background: "rgba(0,0,0,0.7)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "50%",
                      padding: "4px",
                      cursor: "pointer",
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                  <UploadCloud size={32} style={{ color: "var(--primary)" }} />
                  <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Click to select food video</span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>MP4, MOV, WebM</span>
                  <input type="file" accept="video/*" onChange={handleFileChange} style={{ display: "none" }} />
                </label>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Dish Name / Title</label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                required
                placeholder="e.g. Sizzling Triple Cheese Burger"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-input"
                style={{ paddingLeft: "40px" }}
              />
              <Film size={18} style={{ position: "absolute", left: "14px", top: "12px", color: "var(--text-muted)" }} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div className="form-group">
              <label className="form-label">Price (₹)</label>
              <div style={{ position: "relative" }}>
                <input
                  type="number"
                  required
                  placeholder="299"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: "40px" }}
                />
                <DollarSign size={18} style={{ position: "absolute", left: "14px", top: "12px", color: "var(--text-muted)" }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <div style={{ position: "relative" }}>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: "40px", backgroundColor: "#141820" }}
                >
                  <option value="Burgers">Burgers</option>
                  <option value="Pizza">Pizza</option>
                  <option value="Biryani">Biryani</option>
                  <option value="Desserts">Desserts</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Beverages">Beverages</option>
                </select>
                <Tag size={18} style={{ position: "absolute", left: "14px", top: "12px", color: "var(--text-muted)" }} />
              </div>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: "12px" }}>
            <label className="form-label">Short Description</label>
            <div style={{ position: "relative" }}>
              <textarea
                placeholder="Describe key ingredients, taste, and special offer..."
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-input"
                style={{ paddingLeft: "40px", resize: "none" }}
              />
              <FileText size={18} style={{ position: "absolute", left: "14px", top: "12px", color: "var(--text-muted)" }} />
            </div>
          </div>

          <div style={{ position: "sticky", bottom: "-28px", background: "var(--bg-card)", paddingTop: "10px", paddingBottom: "10px", borderTop: "1px solid var(--border-glass)", marginTop: "14px" }}>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: "100%", padding: "12px" }}
            >
              {loading ? "Uploading to Cloud..." : "Publish Food Reel 🚀"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
