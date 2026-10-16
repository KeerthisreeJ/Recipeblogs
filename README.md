# 🍓 Kittyeats — Full-Stack Recipe Sharing & Food Blogging Platform

> **Aesthetic:** Clean Instagram meets modern high-end food blog  
> **Color Palette:** Pure White (`#FFFFFF`) + Deep Red (`#8B0000`) + Soft Blush Pink (`#FFF0F2`) + Warm Beige (`#FAF7F2`)  
> **Typography:** Elegant Editorial Serif (*Playfair Display*) for titles + Modern Sans-Serif (*Plus Jakarta Sans*) for body  

---

## ✨ Features

- **Instagram-Inspired Masonry Grid**: Soft rounded cards, subtle drop shadows, smooth hover zooms, floating category pills, and cooking time badges.
- **Full-Width Editorial Recipe Detail Pages**:
  - Hero photography banner
  - Interactive **Ingredients Checklist** allowing home cooks to check off items as they prep
  - Step-by-step numbered cooking instructions with generous editorial spacing
  - Author bio showcase card with link to profile
  - Real-time like counter with heart pop animation
  - One-click bookmarking / saving
  - Share link button (copies direct link to clipboard)
- **User Authentication**:
  - JWT-based authentication (Register, Login, Me)
  - Password hashing with `bcryptjs`
  - Quick-fill demo account button on the login screen for instant testing
- **Full Recipe Management (CRUD)**:
  - Create new recipes with rich metadata (title, story, ingredients, instructions, cooking time, servings, category)
  - Dual image support: direct URL input with live preview OR file upload via Multer (with Cloudinary & local disk storage fallback)
  - Edit and delete own recipes with confirmation modals
- **Live Search & Category Filtering**:
  - Search by recipe title, description, or ingredients
  - Instant category pills (*All, Breakfast, Pasta, Dessert, Dinner, Baking, Salad, Drinks*)
  - Server-side pagination with clean page controls
- **Chef Profiles**:
  - Author public profile page with stats (Recipes created, Total likes received, Saved recipes)
  - Tabbed switching between "My Recipes" and "Saved Bookmarks"
  - In-place profile editor (Display name, bio, avatar)
- **Extra Polish**:
  - Custom Toast notification stack with deep red & blush styling
  - Shimmer loading skeletons for cards and detail views
  - Empty states with custom illustrations and actions
  - Fully responsive (mobile-first navigation with clean sliding drawer)

---

## 🛠️ Tech Stack

### Frontend
- **React 19** + **Vite**
- **Tailwind CSS** (configured with Kittyeats custom brand colors & shadows)
- **React Router DOM v7** (Nested routes & protected routes)
- **Lucide React** (modern iconography)
- **Axios** (interceptors for JWT authentication)
- **Context API** (`AuthContext`, `ToastContext`)

### Backend
- **Node.js** & **Express**
- **MongoDB** & **Mongoose** (validation, indexes, population)
- **JWT (JSON Web Tokens)** & **Bcrypt.js**
- **Multer** (handles image uploads with memory buffer)
- **Cloudinary** (optional cloud storage with automatic local disk storage fallback in `/uploads`)

---

## 📁 Project Structure

```
mini-proj/
├── package.json               # Root scripts for concurrently running backend and frontend
├── .env.example               # Root environment variables guide
├── README.md                  # Complete documentation
│
├── backend/
│   ├── config/
│   │   └── db.js              # Mongoose database connection
│   ├── controllers/
│   │   ├── authController.js   # Register, Login, Me
│   │   ├── recipeController.js # CRUD, Like, Save, Search, Pagination
│   │   └── userController.js   # Profiles & bio updates
│   ├── middleware/
│   │   ├── auth.js            # JWT protection & optional auth middleware
│   │   └── upload.js          # Multer + Cloudinary + Local disk fallback
│   ├── models/
│   │   ├── User.js            # User schema with bcrypt password hashing
│   │   └── Recipe.js          # Recipe schema with text search indexes
│   ├── routes/
│   │   ├── authRoutes.js      # /api/auth
│   │   ├── recipeRoutes.js    # /api/recipes
│   │   └── userRoutes.js      # /api/users
│   ├── seed/
│   │   └── seedData.js        # Realistic seed data with high-res food photography
│   ├── uploads/               # Local static uploads directory
│   ├── .env                   # Backend environment configuration
│   ├── .env.example
│   ├── package.json
│   └── server.js              # Express entry point
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── EmptyState.jsx       # Elegant empty state with call-to-action
    │   │   ├── Footer.jsx           # Editorial journal footer
    │   │   ├── Navbar.jsx           # Sticky glassmorphic navbar with search & avatar dropdown
    │   │   ├── ProtectedRoute.jsx   # Route guard for authenticated actions
    │   │   ├── RecipeCard.jsx       # Instagram-style card with likes, saves & hover zoom
    │   │   ├── SkeletonCard.jsx     # Pulse shimmer card loader
    │   │   └── SkeletonDetail.jsx   # Pulse shimmer blog page loader
    │   ├── context/
    │   │   ├── AuthContext.jsx      # Authentication & session provider
    │   │   └── ToastContext.jsx     # Notification stack provider
    │   ├── pages/
    │   │   ├── CreateEditRecipe.jsx # Dynamic recipe creator & editor
    │   │   ├── Home.jsx             # Hero banner, category pills & paginated grid
    │   │   ├── Login.jsx            # Centered minimalist login with demo filler
    │   │   ├── Profile.jsx          # Chef profile with tabs (Authored & Saved)
    │   │   ├── RecipeDetail.jsx     # Full-width food blog article experience
    │   │   └── Register.jsx         # User registration with custom bio & avatar
    │   ├── services/
    │   │   └── api.js               # Axios instance with auth interceptor
    │   ├── App.jsx                  # Main router setup
    │   ├── index.css                # Tailwind styling, Google fonts & scrollbars
    │   └── main.jsx                 # React root render
    ├── index.html                   # HTML template with Google Fonts
    ├── tailwind.config.js           # Deep red & blush color palette
    ├── vite.config.js               # Vite config with API proxy
    └── package.json
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** running locally on port 27017 or a MongoDB Atlas connection string

### 2. Environment Setup
Check `backend/.env` (pre-created with local defaults):
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/kittyeats
JWT_SECRET=kittyeats_secret_key_8b0000_delicious_recipes_2026
JWT_EXPIRES_IN=30d

# Cloudinary (Optional: leave empty to use local backend/uploads fallback)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### 3. Seed Sample Content
Populate Kittyeats with realistic, mouthwatering editorial recipes and sample authors:
```bash
npm run seed
```
*(or `cd backend && node seed/seedData.js`)*

### 4. Run the Servers

#### Terminal 1 — Backend:
```bash
npm run dev:backend
# Server runs on http://localhost:5000
```

#### Terminal 2 — Frontend:
```bash
npm run dev:frontend
# Client runs on http://localhost:5173
```

Visit **http://localhost:5173** in your browser!

---

## 👤 Demo Accounts (Ready to Test)

| Name | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Camille Laurent** | `camille@kittyeats.com` | `password123` | Pastry Chef & Food Stylist |
| **Mateo Rossi** | `mateo@kittyeats.com` | `password123` | Artisanal Pasta Chef |
| **Sienna Miller** | `sienna@kittyeats.com` | `password123` | Holistic Nutritionist |

*(You can also click the **"Quick Fill"** button directly on the `/login` page to auto-fill Camille's credentials with 1 click!)*

---

## 📡 API Endpoints Reference

### Authentication
- `POST /api/auth/register` — Register a new account
- `POST /api/auth/login` — Sign in and receive JWT token
- `GET  /api/auth/me` — Fetch currently authenticated user session

### Recipes
- `GET    /api/recipes?search=&category=&page=&limit=` — Get paginated recipes
- `GET    /api/recipes/:id` — Get single recipe with full details
- `POST   /api/recipes` — Create a new recipe (multipart/form-data or JSON)
- `PUT    /api/recipes/:id` — Update existing recipe (Author only)
- `DELETE /api/recipes/:id` — Delete recipe (Author only)
- `POST   /api/recipes/:id/like` — Toggle Like/Unlike
- `POST   /api/recipes/:id/save` — Toggle Save/Bookmark
- `GET    /api/recipes/user/saved` — Get recipes saved by the authenticated user
- `GET    /api/recipes/author/:authorId` — Get all recipes created by an author

### Users & Profiles
- `GET /api/users/:id` — Get public chef profile with stats and authored recipes
- `PUT /api/users/profile` — Update current user's name, bio, and avatar

---

## 🎨 Design System Guide

| Token | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Deep Red (Primary)** | `#8B0000` (`brand-800`) | Main brand accent, CTA buttons, active state |
| **Crimson Red** | `#9B1B1B` (`brand-700`) | Highlights, bold accents |
| **Pure White** | `#FFFFFF` | Card backgrounds, hero containers |
| **Soft Blush Pink** | `#FFF0F2` (`blush-50`) | Badges, icon containers, subtle highlights |
| **Warm Beige** | `#FAF7F2` | Body background, soft editorial warmth |
| **Heading Font** | *Playfair Display* | Editorial serif headlines |
| **Body Font** | *Plus Jakarta Sans* | Clean modern sans-serif typography |
