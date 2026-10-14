# 🌿 ClothSwap (SwapWear) — Sustainable Clothing Exchange & Barter Marketplace

A complete, production-ready full-stack web application promoting circular fashion and zero textile waste. Users list pre-loved clothing they no longer wear, browse items listed by others, evaluate fair trade valuations via an automated rule-based swap calculator, and exchange clothes through a 1:1 barter system with private negotiation chat and dual-party confirmation—without mandatory monetary transactions.

---

## 🌟 Key Features

### 1. Authentication & Role-Based Authorization
- **JWT & bcrypt.js**: Secure token-based session management and salted password hashing.
- **Roles**: Standard `User` and privileged `Admin`.
- **Pre-populated Demo Logins**: One-click logins for easy testing and evaluation.

### 2. Clothing Listings & Inventory Management
- **Detailed Attributes**: Title, Category, Brand, Size, Gender, Color, Condition, Description, Original Price, Estimated Swap Value, Location (City & State), and Photos.
- **Image Uploads**: Multer local disk storage for development + Cloudinary-ready configuration for production.
- **Statuses**: `Available`, `Swap Pending`, `Swapped`, `Unavailable`.
- **Ownership Guards**: Users can only edit or delete their own listings. Prevented from editing/deleting items involved in finalized or confirmed swaps.

### 3. Browse, Search & Location Proximity Matching
- **Multi-Field Search**: Title, Brand, Category, Description.
- **Rich Filters**: Category, Size, Target Gender, Item Condition, Value Range.
- **Proximity "Near Me" Matching**: Filters items located in the logged-in user's city/state with a prominent `"Nearby Swap"` badge.
- **Sorting**: Newest, Oldest, Lowest Swap Value, Highest Swap Value.

### 4. Rule-Based Swap Value Calculator
- Automatic fair valuation based on retail price, condition, and brand tiers:
  - **Like New**: ~85% retention
  - **Excellent**: ~72% retention
  - **Good**: ~55% retention
  - **Fair**: ~35% retention
- Transparent side-by-side comparison UI showing item values, difference, and the note: *"Swap values are estimates and are intended only to help users compare items."*

### 5. Complete Swap Workflow (End-to-End)
1. **Proposal**: User selects an available item from their own wardrobe to offer for the target item.
2. **Business Validation**: Cannot swap own items, offered item must belong to user, duplicate active requests prevented.
3. **Acceptance / Rejection**: Recipient can accept or reject.
4. **Negotiation Chat**: Swap-specific private messaging powered by REST and real-time Socket.IO.
5. **Dual Confirmation**: Both parties propose and confirm exchange method (`Local Exchange` or `Courier/Shipping`). Status moves to `Confirmed` and items are locked.
6. **Completion**: Either or both mark completed upon physical hand-off. Status becomes `Completed` and both clothing items are moved to `Swapped`.
7. **History**: Full archive categorized into Active, Completed, and Cancelled/Rejected.

### 6. Safety, Saved Items & Reporting
- **Saved Items**: Bookmark favorite items with instant heart toggle.
- **Reporting System**: Report inappropriate listings or members for *Fake listing*, *Inappropriate content*, *Wrong information*, *Damaged item*, *Spam*, or *Other*.

### 7. Administrative Console
- **Analytics Dashboard**: Total users, active listings, completed swaps, conversion rate, category distribution, and recent swaps.
- **User Moderation**: Search users, toggle activate/disable status, delete accounts.
- **Listing Control**: Search, inspect, take down or mark unavailable.
- **Swap Monitoring**: Live audit of all platform transactions.
- **Report Management**: Review safety reports, change resolution status, leave audit notes, and directly take down violating items or ban accounts.

---

## 🛠 Technology Stack

- **Frontend**:
  - React 18 & Vite
  - React Router v6
  - Tailwind CSS & PostCSS
  - Axios (with JWT bearer interceptor)
  - Lucide React Icons
  - Socket.IO Client
- **Backend**:
  - Node.js & Express.js
  - MongoDB & Mongoose ODM
  - JSON Web Tokens (JWT) & bcryptjs
  - Multer (Local & Cloud file upload handler)
  - Socket.IO (Real-time negotiation chat)
  - CORS, Dotenv

---

## 📁 Project Structure

```
├── backend/
│   ├── config/
│   │   └── db.js                 # Mongoose connection
│   ├── controllers/
│   │   ├── adminController.js    # Platform analytics & moderation
│   │   ├── authController.js     # Register, Login, Me
│   │   ├── clothingController.js # Clothing CRUD, search & filters
│   │   ├── messageController.js  # Chat messaging
│   │   ├── reportController.js   # Safety reports
│   │   ├── savedController.js    # Wishlist / favorites
│   │   ├── swapController.js     # Barter lifecycle & dual confirmation
│   │   └── userController.js     # Profiles & dashboard stats
│   ├── middleware/
│   │   ├── auth.js               # JWT verification & role authorization
│   │   ├── errorHandler.js       # Centralized error responses
│   │   └── upload.js             # Multer image upload configuration
│   ├── models/
│   │   ├── Clothing.js
│   │   ├── Message.js
│   │   ├── Report.js
│   │   ├── SavedItem.js
│   │   ├── SwapRequest.js
│   │   └── User.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── clothingRoutes.js
│   │   ├── messageRoutes.js
│   │   ├── reportRoutes.js
│   │   ├── savedRoutes.js
│   │   ├── swapRoutes.js
│   │   └── userRoutes.js
│   ├── seed/
│   │   ├── seedData.js           # 13 users, 25 realistic clothes, swaps
│   │   └── seed.js               # Database seeding executable
│   ├── utils/
│   │   └── swapCalculator.js     # Rule-based valuation logic
│   ├── uploads/                  # Uploaded clothing images
│   ├── .env.example
│   ├── package.json
│   └── server.js                 # Express & Socket.IO server
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/             # ProtectedRoute & AdminRoute
│   │   │   ├── clothing/         # ClothingCard, SearchBar, FilterPanel, SwapValueCompare
│   │   │   ├── common/           # Navbar, Footer, Modal, StatusBadge, LoadingSpinner, EmptyState
│   │   │   └── swaps/            # SwapCard, SwapRequestModal
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # Global session state
│   │   │   └── SocketContext.jsx # Real-time chat connection
│   │   ├── pages/
│   │   │   ├── admin/            # Dashboard, Users, Listings, Swaps, Reports
│   │   │   ├── AddClothingPage.jsx
│   │   │   ├── BrowsePage.jsx
│   │   │   ├── ClothingDetailPage.jsx
│   │   │   ├── EditClothingPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── MyListingsPage.jsx
│   │   │   ├── NotFoundPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── SavedItemsPage.jsx
│   │   │   ├── SwapDetailPage.jsx
│   │   │   ├── SwapHistoryPage.jsx
│   │   │   ├── SwapRequestsPage.jsx
│   │   │   └── UserDashboardPage.jsx
│   │   ├── services/             # Axios API service clients
│   │   ├── utils/                # Client-side calculator & formatters
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── package.json                  # Root orchestration scripts
└── README.md
```

---

## 🚀 Step-by-Step Installation & Running Guide

### Step 1: Clone or Navigate to Project
```bash
cd "c:\Users\Admin\Downloads\CLOTHING EXCHANGE & SWAP MARKETPLACE"
```

### Step 2: Install Dependencies
Run the installation for root, backend, and frontend:
```bash
# Option A: One-line install via root package.json
npm run install:all

# Option B: Manual install
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### Step 3: Configure Environment Variables

**Backend (`backend/.env`)**:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/clothing_swap_db
JWT_SECRET=swapwear_secret_key_development_2026_dev_secure
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
```
*(If using MongoDB Atlas in cloud, paste your connection string into `MONGO_URI`)*.

**Frontend (`frontend/.env`)**:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### Step 4: Seed Realistic Database Records
Ensure MongoDB is running locally (`mongod`) or your Atlas URI is reachable, then run:
```bash
cd backend
npm run seed
```
This populates:
- **1 Administrator**: `admin@swapwear.com` (Pass: `Admin@123`)
- **12 Realistic Indian Swapper Profiles** across Mumbai, Pune, Nagpur, Bengaluru, Delhi, Hyderabad, Nashik.
- **25+ Curated Indian & International Fashion Listings** (Levi's, Zara, H&M, Nike, FabIndia, Biba, Manyavar, Roadster, etc.).
- Active, Negotiating, Confirmed, and Completed Swaps with chat logs and sample safety reports.

### Step 5: Start the Backend Server
```bash
cd backend
npm run dev
# or npm start
```
*Backend runs at: `http://localhost:5000`*

### Step 6: Start the Frontend Application
In a separate terminal:
```bash
cd frontend
npm run dev
```
*Frontend runs at: `http://localhost:5173`*

---

## 🔑 Pre-Configured Test Credentials

| Role | Name | Email | Password | Location |
| :--- | :--- | :--- | :--- | :--- |
| **Administrator** | SwapWear Admin | `admin@swapwear.com` | `Admin@123` | Mumbai |
| **Member 1** | Aarav Sharma | `aarav.sharma@example.com` | `User@123` | Mumbai |
| **Member 2** | Priya Patel | `priya.patel@example.com` | `User@123` | Pune |
| **Member 3** | Rohan Mehta | `rohan.mehta@example.com` | `User@123` | Nagpur |
| **Member 4** | Tanvi Deshmukh | `tanvi.deshmukh@example.com` | `User@123` | Nagpur |
| **Member 5** | Ananya Iyer | `ananya.iyer@example.com` | `User@123` | Bengaluru |
| **Member 6** | Vikram Singh | `vikram.singh@example.com` | `User@123` | Delhi |

*(Quick one-click login buttons are also embedded directly on the Login page for instant access!)*

---

## 🔄 Complete User Journey (Verification Walkthrough)

1. **Register or Login**: Log in as `Aarav Sharma` (`aarav.sharma@example.com`).
2. **List Clothes**: Click **"List Your Clothes"**, fill in details, upload an image, and see the automated rule-based value estimation.
3. **Browse & Filter**: Visit **"Browse Clothes"**, search "Levi's" or "Jacket", filter by category or condition, or toggle **"Near Me"** to view local Mumbai items.
4. **Inspect & Offer**: Open an item owned by `Rohan Mehta`, click **"Request Swap"**, select one of your listed items from the dropdown, review the value difference and comparison disclaimer, and confirm.
5. **Negotiate**: Switch account to `rohan.mehta@example.com` (or open private window), accept the request, and exchange live messages in the private chat.
6. **Confirm Swap**: Select exchange method (`Local Exchange`), and have both users click **"Confirm Agreement"**. The status moves to `Confirmed` and items are locked.
7. **Complete & Archive**: Mark as completed once exchanged. Both items move to `Swapped` status and the transaction is permanently recorded in **"My Swap History"**.
8. **Admin Audit**: Log in as `admin@swapwear.com` to review metrics, monitor active swaps, review user safety reports, and manage platform listings.

---

## 🌐 Production Deployment Guide

### Frontend (Vercel)
1. Push repository to GitHub.
2. Link the repository on [Vercel](https://vercel.com).
3. Set the Root Directory to `frontend`.
4. Add Environment Variable:
   - `VITE_API_URL=https://your-backend-url.onrender.com/api`
   - `VITE_SOCKET_URL=https://your-backend-url.onrender.com`
5. Click **Deploy**.

### Backend (Render)
1. On [Render](https://render.com), create a new **Web Service** pointing to your repository.
2. Set Root Directory to `backend`.
3. Build Command: `npm install`
4. Start Command: `node server.js`
5. Add Environment Variables:
   - `PORT=5000`
   - `NODE_ENV=production`
   - `MONGO_URI=your_mongodb_atlas_connection_string`
   - `JWT_SECRET=your_production_secret_key`
   - `CLIENT_URL=https://your-frontend-domain.vercel.app`

---

## 📜 License
MIT License. Built for the sustainable fashion movement to extend clothing lifespans and reduce global textile waste.
