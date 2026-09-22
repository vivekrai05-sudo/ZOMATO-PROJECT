import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { X, ShoppingBag, Plus, Minus, Trash2, CheckCircle2 } from "lucide-react";

const CartDrawer = ({ isOpen, onClose }) => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    itemsSubtotal,
    deliveryFee,
    taxes,
    grandTotal,
  } = useCart();

  const [orderPlaced, setOrderPlaced] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = () => {
    setOrderPlaced(true);
    setTimeout(() => {
      clearCart();
      setOrderPlaced(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ justifyContent: "flex-end", padding: 0 }}>
      <div
        className="glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "420px",
          height: "100vh",
          borderRadius: "0",
          background: "var(--bg-card)",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          animation: "slideInRight 0.3s ease-out",
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--border-glass)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <ShoppingBag size={22} style={{ color: "var(--primary)" }} />
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", fontWeight: 800 }}>
              Your Zomato Cart ({totalItems})
            </h2>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
            <X size={22} />
          </button>
        </div>

        {/* Order Success Toast overlay */}
        {orderPlaced ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px 20px",
              textAlign: "center",
            }}
          >
            <CheckCircle2 size={64} style={{ color: "var(--accent-green)", marginBottom: "16px" }} />
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", fontWeight: 800, marginBottom: "8px" }}>
              Order Placed Successfully! 🎉
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.92rem" }}>
              Your food is being freshly prepared by the restaurant partner!
            </p>
          </div>
        ) : (
          <>
            {/* Cart Items List */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div
                    key={item._id}
                    style={{
                      display: "flex",
                      gap: "14px",
                      marginBottom: "16px",
                      padding: "14px",
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid var(--border-glass)",
                      borderRadius: "var(--radius-md)",
                    }}
                  >
                    {/* Item Thumbnail */}
                    <div style={{ width: "64px", height: "64px", borderRadius: "var(--radius-sm)", overflow: "hidden", background: "#000", flexShrink: 0 }}>
                      <video src={item.video} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>

                    {/* Item info */}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "4px" }}>{item.name}</div>
                      <div style={{ color: "var(--accent-gold)", fontWeight: 700, fontSize: "0.88rem", marginBottom: "8px" }}>
                        ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                      </div>

                      {/* Quantity Controls */}
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.08)", borderRadius: "var(--radius-sm)" }}>
                          <button
                            onClick={() => updateQuantity(item._id, -1)}
                            style={{ padding: "4px 8px", background: "none", border: "none", color: "#fff", cursor: "pointer" }}
                          >
                            <Minus size={14} />
                          </button>
                          <span style={{ fontSize: "0.85rem", fontWeight: 700, padding: "0 8px" }}>{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item._id, 1)}
                            style={{ padding: "4px 8px", background: "none", border: "none", color: "#fff", cursor: "pointer" }}
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item._id)}
                          style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", padding: "4px" }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
                  <ShoppingBag size={48} style={{ margin: "0 auto 12px auto", opacity: 0.4 }} />
                  <p style={{ fontWeight: 700, fontSize: "1.1rem" }}>Your cart is empty</p>
                  <p style={{ fontSize: "0.85rem" }}>Click "Order Now" on any food reel to add items!</p>
                </div>
              )}
            </div>

            {/* Price Summary & Checkout Footer */}
            {cartItems.length > 0 && (
              <div
                style={{
                  padding: "20px",
                  borderTop: "1px solid var(--border-glass)",
                  background: "rgba(10, 13, 17, 0.95)",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.88rem", color: "var(--text-muted)", marginBottom: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Item Subtotal</span>
                    <span>₹{itemsSubtotal}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Delivery Fee</span>
                    <span>₹{deliveryFee}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Taxes & Charges</span>
                    <span>₹{taxes}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.1rem", fontWeight: 800, color: "#fff", paddingTop: "8px", borderTop: "1px dashed var(--border-glass)" }}>
                    <span>Grand Total</span>
                    <span style={{ color: "var(--accent-gold)" }}>₹{grandTotal}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="btn btn-primary"
                  style={{ width: "100%", padding: "14px", fontWeight: 800, fontSize: "1rem" }}
                >
                  Place Order • ₹{grandTotal} 🚀
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
