import React, { useState, useEffect } from "react";
import API from "../services/api";
import ReelCard from "../components/ReelCard";
import { useAuth } from "../context/AuthContext";
import { Utensils, Sparkles, Bookmark } from "lucide-react";

// Fallback high-quality food reels if database is empty initially
const SAMPLE_REELS = [
  {
    _id: "sample-1",
    name: "Cheesy Overloaded Smash Burger",
    video: "https://assets.mixkit.co/videos/preview/mixkit-chef-preparing-a-hamburger-41485-large.mp4",
    description: "Double smashed Angus beef patty melted with double cheddar cheese, caramelized onions & secret house sauce.",
    price: 349,
    category: "Burgers",
    likesCount: 1420,
    foodPartner: { fullName: "The Gourmet Burger Co.", email: "burger@partner.com" },
  },
  {
    _id: "sample-2",
    name: "Woodfired Neapolitan Pepperoni Pizza",
    video: "https://assets.mixkit.co/videos/preview/mixkit-putting-a-pizza-in-a-wood-oven-41484-large.mp4",
    description: "Authentic sourdough crust, San Marzano tomato sauce, fresh mozzarella & crisp artisan pepperoni.",
    price: 499,
    category: "Pizza",
    likesCount: 2850,
    foodPartner: { fullName: "Bella Italia Pizzeria", email: "pizza@partner.com" },
  },
  {
    _id: "sample-3",
    name: "Hyderabadi Dum Chicken Biryani",
    video: "https://assets.mixkit.co/videos/preview/mixkit-cooking-food-in-a-wok-41489-large.mp4",
    description: "Fragrant basmati rice slow-cooked dum style with tender marinated chicken & secret aromatic spices.",
    price: 399,
    category: "Biryani",
    likesCount: 3910,
    foodPartner: { fullName: "Royal Nawabi Kitchen", email: "biryani@partner.com" },
  },
];

const categories = ["All", "Burgers", "Pizza", "Biryani", "Chinese", "Desserts", "Saved"];

const FeedPage = ({ onOpenAuth, searchQuery }) => {
  const { currentUser } = useAuth();
  const [foods, setFoods] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const fetchFoods = async () => {
    setLoading(true);
    try {
      const res = await API.get("/food");
      if (res.data?.foods && res.data.foods.length > 0) {
        setFoods(res.data.foods);
      } else {
        setFoods(SAMPLE_REELS);
      }
    } catch {
      setFoods(SAMPLE_REELS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const filteredFoods = foods.filter((item) => {
    // Category check
    let categoryMatches = true;
    if (selectedCategory === "Saved") {
      categoryMatches = currentUser && item.saves ? item.saves.includes(currentUser._id) : false;
    } else if (selectedCategory !== "All") {
      categoryMatches = item.category?.toLowerCase() === selectedCategory.toLowerCase();
    }

    // Search query check
    let searchMatches = true;
    if (searchQuery && searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      searchMatches =
        item.name?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q) ||
        item.foodPartner?.fullName?.toLowerCase().includes(q);
    }

    return categoryMatches && searchMatches;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Category Chips Bar */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          maxWidth: "100%",
          padding: "12px 20px",
          scrollbarWidth: "none",
          zIndex: 20,
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: "6px 16px",
              borderRadius: "var(--radius-full)",
              border: selectedCategory === cat ? "1px solid var(--primary)" : "1px solid var(--border-glass)",
              background: selectedCategory === cat ? "var(--primary)" : "rgba(20, 24, 32, 0.7)",
              color: "#fff",
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.2s ease",
            }}
          >
            {cat === "All" && <Sparkles size={14} style={{ display: "inline", marginRight: "4px" }} />}
            {cat === "Saved" && <Bookmark size={14} style={{ display: "inline", marginRight: "4px" }} />}
            {cat}
          </button>
        ))}
      </div>

      {/* Reels Scroll Container */}
      <div className="reels-container">
        {loading ? (
          <div style={{ padding: "60px 0", color: "var(--text-muted)", fontSize: "1rem" }}>
            Loading delicious food reels...
          </div>
        ) : filteredFoods.length > 0 ? (
          filteredFoods.map((food) => (
            <ReelCard key={food._id} food={food} onOpenAuth={onOpenAuth} />
          ))
        ) : (
          <div style={{ padding: "60px 20px", textAlign: "center", color: "var(--text-muted)" }}>
            <Utensils size={48} style={{ margin: "0 auto 12px auto", opacity: 0.5 }} />
            <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>No food reels found.</p>
            <p style={{ fontSize: "0.88rem" }}>
              {selectedCategory === "Saved"
                ? "You haven't saved any food reels yet. Click the save icon on any reel!"
                : "Try searching for something else or upload a new reel!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedPage;
