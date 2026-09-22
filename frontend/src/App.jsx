import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import AuthModal from "./components/AuthModal";
import UploadModal from "./components/UploadModal";
import CartDrawer from "./components/CartDrawer";
import FeedPage from "./pages/FeedPage";
import PartnerDashboardPage from "./pages/PartnerDashboardPage";
import PartnerProfilePage from "./pages/PartnerProfilePage";

function AppContent() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshFeed, setRefreshFeed] = useState(0);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-dark)" }}>
      <Navbar
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <FeedPage
                key={refreshFeed}
                onOpenAuth={() => setIsAuthOpen(true)}
                searchQuery={searchQuery}
              />
            }
          />
          <Route
            path="/partner/dashboard"
            element={
              <PartnerDashboardPage
                onOpenUpload={() => setIsUploadOpen(true)}
              />
            }
          />
          <Route path="/partner/:partnerId" element={<PartnerProfilePage />} />
        </Routes>
      </main>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={() => setRefreshFeed((prev) => prev + 1)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppContent />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
