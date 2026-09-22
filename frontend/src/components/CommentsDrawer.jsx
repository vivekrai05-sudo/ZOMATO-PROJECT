import React, { useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { X, MessageSquare, Send, User } from "lucide-react";

const CommentsDrawer = ({ isOpen, onClose, food, onOpenAuth, onCommentAdded }) => {
  const { currentUser } = useAuth();
  const [comments, setComments] = useState(food?.comments || []);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen || !food) return null;

  const handleSendComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!currentUser) {
      if (onOpenAuth) onOpenAuth();
      return;
    }

    setLoading(true);
    try {
      const res = await API.post(`/food/${food._id}/comment`, { text: newComment });
      setComments(res.data.comments || []);
      setNewComment("");
      if (onCommentAdded) onCommentAdded(res.data.comments);
    } catch {
      // Ignore comment error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ alignItems: "flex-end", padding: 0 }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "480px",
          height: "75vh",
          maxHeight: "75vh",
          borderRadius: "var(--radius-lg) var(--radius-lg) 0 0",
          display: "flex",
          flexDirection: "column",
          padding: 0,
        }}
      >
        {/* Comments Header */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--border-glass)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <MessageSquare size={20} style={{ color: "var(--primary)" }} />
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 700 }}>
              Food Reviews & Comments ({comments.length})
            </h3>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
            <X size={20} />
          </button>
        </div>

        {/* Comments List */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: "14px" }}>
          {comments.length > 0 ? (
            comments.map((c, i) => (
              <div key={c._id || i} style={{ display: "flex", gap: "10px" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "rgba(226, 55, 68, 0.2)",
                    color: "var(--primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    flexShrink: 0,
                  }}
                >
                  <User size={16} />
                </div>
                <div style={{ flex: 1, background: "rgba(255, 255, 255, 0.03)", padding: "10px 14px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-glass)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ fontWeight: 700, fontSize: "0.85rem" }}>{c.userName || "Foodie"}</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.9)", lineHeight: "1.4" }}>{c.text}</p>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)" }}>
              <MessageSquare size={36} style={{ margin: "0 auto 8px auto", opacity: 0.4 }} />
              <p style={{ fontSize: "0.9rem" }}>No reviews yet. Be the first to comment on this dish!</p>
            </div>
          )}
        </div>

        {/* Add Comment Input */}
        <form
          onSubmit={handleSendComment}
          style={{
            padding: "12px 16px",
            borderTop: "1px solid var(--border-glass)",
            display: "flex",
            gap: "10px",
            background: "var(--bg-card)",
          }}
        >
          <input
            type="text"
            placeholder={currentUser ? "Add a review or comment..." : "Login to write a comment"}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="form-input"
            style={{ flex: 1, padding: "10px 14px", fontSize: "0.88rem" }}
          />
          <button
            type="submit"
            disabled={loading || !newComment.trim()}
            className="btn btn-primary"
            style={{ padding: "10px 16px" }}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommentsDrawer;
