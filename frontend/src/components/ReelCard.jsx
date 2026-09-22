import React, { useRef, useState, useEffect } from "react";
import { Heart, Volume2, VolumeX, Play, Pause, ShoppingBag, Store, Share2, MessageSquare, Bookmark } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import CommentsDrawer from "./CommentsDrawer";

const ReelCard = ({ food, onOpenAuth }) => {
  const { currentUser } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [likesCount, setLikesCount] = useState(food.likesCount || 0);
  const [isLiked, setIsLiked] = useState(
    currentUser && food.likes ? food.likes.includes(currentUser._id) : false
  );
  const [isSaved, setIsSaved] = useState(
    currentUser && food.saves ? food.saves.includes(currentUser._id) : false
  );
  const [comments, setComments] = useState(food.comments || []);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [orderToast, setOrderToast] = useState(false);

  useEffect(() => {
    const options = { threshold: 0.65 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          videoRef.current?.play().catch(() => {});
          setIsPlaying(true);
        } else {
          videoRef.current?.pause();
          setIsPlaying(false);
        }
      });
    }, options);

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) observer.unobserve(videoRef.current);
    };
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!currentUser) {
      if (onOpenAuth) onOpenAuth();
      return;
    }

    try {
      const res = await API.post(`/food/${food._id}/like`);
      setLikesCount(res.data.likesCount);
      setIsLiked(res.data.isLiked);
    } catch {
      // Ignore like error
    }
  };

  const handleSave = async (e) => {
    e.stopPropagation();
    if (!currentUser) {
      if (onOpenAuth) onOpenAuth();
      return;
    }

    try {
      const res = await API.post(`/food/${food._id}/save`);
      setIsSaved(res.data.isSaved);
    } catch {
      // Ignore save error
    }
  };

  const handleOrder = (e) => {
    e.stopPropagation();
    addToCart(food);
    setOrderToast(true);
    setTimeout(() => setOrderToast(false), 2500);
  };

  return (
    <>
      <div className="reel-card" onClick={togglePlay}>
        {/* Video Element */}
        <video
          ref={videoRef}
          src={food.video}
          loop
          muted={isMuted}
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            cursor: "pointer",
          }}
        />

        {/* Play/Pause Overlay Indicator */}
        {!isPlaying && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0, 0, 0, 0.35)",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(8px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
              }}
            >
              <Play size={32} style={{ marginLeft: "4px" }} />
            </div>
          </div>
        )}

        {/* Top Bar Overlay */}
        <div
          style={{
            position: "absolute",
            top: "16px",
            left: "16px",
            right: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 10,
          }}
        >
          <div
            style={{
              padding: "4px 12px",
              background: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(10px)",
              borderRadius: "var(--radius-full)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              fontSize: "0.78rem",
              fontWeight: 700,
              color: "var(--accent-gold)",
            }}
          >
            {food.category || "Featured Food"}
          </div>

          <button
            onClick={toggleMute}
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>

        {/* Floating Right Action Column */}
        <div className="action-column">
          {/* Like Button */}
          <div style={{ textAlign: "center" }}>
            <button
              onClick={handleLike}
              className={`action-btn ${isLiked ? "liked" : ""}`}
            >
              <Heart size={22} fill={isLiked ? "var(--primary)" : "none"} />
            </button>
            <div className="action-count">{likesCount}</div>
          </div>

          {/* Comment Button */}
          <div style={{ textAlign: "center" }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsCommentsOpen(true);
              }}
              className="action-btn"
            >
              <MessageSquare size={20} />
            </button>
            <div className="action-count">{comments.length}</div>
          </div>

          {/* Bookmark/Save Button */}
          <div style={{ textAlign: "center" }}>
            <button
              onClick={handleSave}
              className={`action-btn ${isSaved ? "liked" : ""}`}
            >
              <Bookmark size={20} fill={isSaved ? "var(--accent-gold)" : "none"} style={{ color: isSaved ? "var(--accent-gold)" : "#fff" }} />
            </button>
            <div className="action-count">{isSaved ? "Saved" : "Save"}</div>
          </div>

          {/* Share Button */}
          <div style={{ textAlign: "center" }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard?.writeText?.(window.location.href);
              }}
              className="action-btn"
            >
              <Share2 size={20} />
            </button>
            <div className="action-count">Share</div>
          </div>
        </div>

        {/* Bottom Info Overlay */}
        <div className="video-overlay">
          <div /> {/* Spacer */}

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", paddingRight: "60px" }}>
            {/* Partner Info Link */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                if (food.foodPartner?._id) {
                  navigate(`/partner/${food.foodPartner._id}`);
                }
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                width: "fit-content",
              }}
            >
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  background: "var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                }}
              >
                <Store size={16} />
              </div>
              <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "#fff", textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}>
                {food.foodPartner?.fullName || "Food Partner"}
              </span>
            </div>

            {/* Title & Price */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <h3
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.25rem",
                  fontWeight: 800,
                  color: "#fff",
                  textShadow: "0 2px 6px rgba(0,0,0,0.9)",
                }}
              >
                {food.name}
              </h3>
              <span
                style={{
                  padding: "2px 10px",
                  background: "var(--accent-gold)",
                  color: "#000",
                  fontWeight: 800,
                  fontSize: "0.9rem",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                ₹{food.price}
              </span>
            </div>

            {/* Description */}
            {food.description && (
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "rgba(255, 255, 255, 0.85)",
                  lineHeight: "1.3",
                  maxHeight: "3.6em",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {food.description}
              </p>
            )}

            {/* Order CTA Button */}
            <button
              onClick={handleOrder}
              className="btn btn-primary"
              style={{
                marginTop: "6px",
                padding: "10px 18px",
                fontSize: "0.92rem",
                fontWeight: 700,
                width: "100%",
              }}
            >
              <ShoppingBag size={18} />
              <span>Add to Cart • ₹{food.price}</span>
            </button>
          </div>
        </div>

        {/* Order Toast Notification */}
        {orderToast && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "rgba(34, 197, 94, 0.95)",
              color: "#fff",
              padding: "12px 24px",
              borderRadius: "var(--radius-md)",
              fontWeight: 700,
              fontSize: "0.95rem",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              zIndex: 100,
              textAlign: "center",
            }}
          >
            ✅ Added to Zomato Cart!
          </div>
        )}
      </div>

      {/* Comments Drawer Modal */}
      <CommentsDrawer
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        food={food}
        onOpenAuth={onOpenAuth}
        onCommentAdded={(updatedComments) => setComments(updatedComments)}
      />
    </>
  );
};

export default ReelCard;
