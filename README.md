# 🍕 Zomato Food Reels — Short-Video Food Discovery Platform

[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express.js-green?logo=nodedotjs)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20%2B%20Mongoose-brightgreen?logo=mongodb)](https://www.mongodb.com/)
[![CDN](https://img.shields.io/badge/Storage-ImageKit%20CDN-orange)](https://imagekit.io/)

A full-stack, production-grade short-video food discovery and restaurant partner platform built with **React (Vite)**, **Express.js**, **MongoDB**, **Mongoose**, **ImageKit CDN**, and **Tailwind-inspired Vanilla CSS**.

Users can browse a TikTok/Instagram Reels style food feed, like dishes, post reviews, bookmark reels, search dishes, and order via an interactive cart drawer. Restaurant partners can register, upload short food video reels to cloud storage, track performance metrics, and manage their uploaded dishes.

---

## 🌟 Key Features

### 🎥 For Customers / Foodies:
- **Vertical Reel Player**: Auto-playing HTML5 short-video reels feed with smooth scroll snap.
- **Interactive Controls**: Tap to play/pause, volume mute/unmute toggle, like counter with heart animation.
- **Cart & Quick Checkout Drawer**: Slide-over Zomato Cart with quantity adjustment (+ / -), item subtotal, delivery fees, taxes, and one-click order placement.
- **Reel Comments & Reviews**: Slide-up bottom drawer to view customer reviews and submit new comments.
- **Live Search & Category Filtering**: Filter food reels in real-time by category (*Burgers, Pizza, Biryani, Chinese, Desserts*) or dish/restaurant search term.
- **Bookmarks & Saved Reels**: Bookmark favorite food reels and access them in the *Saved* tab.
- **Restaurant Partner Public Profile**: Click any partner avatar to view their dedicated public profile page (`/partner/:id`) featuring their verified badge, total reels, likes, and food gallery.

### 🏬 For Restaurant Partners:
- **Partner Dashboard**: View analytics including Total Reels Published, Total Customer Likes Received, and Account Status.
- **Cloud Reel Upload Modal**: Upload short food video reels to ImageKit CDN with dish title, price, category, and description inputs.
- **Reel Management**: Delete published food reels directly from the dashboard.

---

## 🛠️ Technology Stack

| Layer | Technology Used |
| :--- | :--- |
| **Frontend** | React 19 (Vite), React Router v7, Lucide Icons, Axios |
| **Styling** | Modern CSS (Dark Theme, Glassmorphism, CSS Variables, Responsive) |
| **Backend** | Node.js, Express.js (v5), Cookie-Parser, CORS, Multer |
| **Database** | MongoDB, Mongoose ODM |
| **Cloud Storage** | ImageKit CDN (Node SDK) + Resilient Base64 Fallback |
| **Auth & Security** | JWT (JSON Web Tokens), HTTP-Only Cookies, Bcrypt.js Password Hashing |

---

## 📁 Repository Architecture

```
ZOMATO PROJECT/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Auth & Food CRUD controllers
│   │   ├── db/               # MongoDB Mongoose connection
│   │   ├── middleware/       # JWT Auth Guards (User & Food Partner)
│   │   ├── models/           # User, FoodPartner & Food schemas
│   │   ├── routes/           # Express Auth & Food API routes
│   │   ├── services/         # ImageKit storage service
│   │   └── app.js            # Express server configuration & CORS
│   ├── server.js             # Server entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/       # ReelCard, Navbar, AuthModal, UploadModal, CartDrawer, CommentsDrawer
│   │   ├── context/          # AuthContext & CartContext
│   │   ├── pages/            # FeedPage, PartnerDashboardPage, PartnerProfilePage
│   │   ├── services/         # Axios API client
│   │   ├── App.jsx           # Client Router & layout
│   │   └── index.css         # Modern Dark/Glassmorphism design system
│   ├── index.html
│   └── package.json
└── README.md
```

---

## 🚀 Quick Start & Installation Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (running locally or MongoDB Atlas URI)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/zomato-food-reels.git
cd "ZOMATO PROJECT"
```

### 2. Configure Backend Environment
Navigate to `backend/` and create a `.env` file:
```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/food-view
JWT_SECRET=your_jwt_secret_key_here
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_endpoint
```

### 3. Install & Start Backend Server
```bash
cd backend
npm install
npm run dev
```
*Backend server will start running on `http://localhost:4000`*

### 4. Install & Start Frontend Client
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
*Frontend client will start running on `http://localhost:5174` (or `http://localhost:5173`)*

---

## 📡 API Reference Documentation

### Authentication Routes (`/api/auth`)
- `POST /api/auth/user/register` — Register a customer account
- `POST /api/auth/user/login` — Login as customer
- `GET /api/auth/user/me` — Fetch active customer profile
- `POST /api/auth/food-partner/register` — Register a restaurant partner account
- `POST /api/auth/food-partner/login` — Login as restaurant partner
- `GET /api/auth/food-partner/me` — Fetch active restaurant partner profile

### Food Reels Routes (`/api/food`)
- `GET /api/food` — Get all published food reels feed (Public)
- `POST /api/food` — Upload a new food reel video (Partner Auth)
- `GET /api/food/partner` — Get food reels owned by logged-in partner (Partner Auth)
- `DELETE /api/food/:id` — Delete a published food reel (Partner Auth)
- `POST /api/food/:id/like` — Toggle like on a food reel (User Auth)
- `POST /api/food/:id/save` — Toggle bookmark/save on a food reel (User Auth)
- `POST /api/food/:id/comment` — Post a review/comment on a food reel (User Auth)
- `GET /api/food/partner-profile/:partnerId` — Fetch public profile and reels for a restaurant partner

---

## 🛡️ Git & Security Verification

Before pushing to GitHub, verify that sensitive API keys are not committed:
- `.env` files are ignored via `.gitignore`
- `node_modules` folders are ignored via `.gitignore`
- Build outputs (`dist/`) are ignored via `.gitignore`

To push to GitHub:
```bash
git add .
git commit -m "feat: complete Zomato Food Reels application with full stack features"
git branch -M main
git remote add origin https://github.com/your-username/zomato-food-reels.git
git push -u origin main
```

---

## 📜 License
This project is open-source and available under the [ISC License](LICENSE).
