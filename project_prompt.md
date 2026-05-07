# Prompt to Recreate: EduConnect — Centralized Student Data Management System

> **Copy-paste this entire prompt into an AI coding assistant to recreate this project from scratch.**

---

## Project Overview

Build a **full-stack MERN application** called **"EduConnect"** — a Centralized Student Data Management and Government-University Interaction Platform for Indian universities. The system enables the government (admin) to oversee student data across all universities, universities to manage their own students, and students to view their own profiles.

### Key Features
- **Role-Based Access Control**: 3 roles — `admin` (government), `university`, `student`
- **JWT Authentication**: Register, login, token-based auth with `Bearer` tokens stored in `localStorage`
- **CRUD Operations**: Full create/read/update/delete for Students and Universities
- **CSV Bulk Upload**: Universities can upload students via CSV files (using `multer` + `csv-parser`)
- **Analytics Dashboard**: Aggregated data using MongoDB aggregation pipeline — overview stats, course distribution, university comparison, skills distribution, performance trends (marks buckets)
- **Announcements System**: Admin broadcasts messages to universities (targeted or broadcast)
- **Data Visualization**: Charts using `Chart.js` via `react-chartjs-2` (Bar, Pie, Doughnut, Line charts)
- **Premium Dark Theme UI**: Glassmorphism, gradient accents, smooth animations, Inter font
- **Responsive Design**: Sidebar collapses on mobile, tables scroll horizontally
- **Seed Script**: Populates database with 8 universities, 120 students, demo users, and sample announcements

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React (JSX, not TSX) via Vite |
| **Styling** | Vanilla CSS with CSS custom properties (design system) |
| **Charts** | Chart.js + react-chartjs-2 |
| **Routing** | react-router-dom v7 |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB with Mongoose ODM |
| **Auth** | JWT (jsonwebtoken) + bcryptjs |
| **File Upload** | Multer (CSV upload) + csv-parser |
| **Validation** | express-validator |
| **Dev Tools** | nodemon, Vite dev server |

---

## Complete File Structure

```
project/
├── .gitignore                    # node_modules/, .env, dist/, uploads/
├── backend/
│   ├── .env                      # PORT, MONGODB_URI, JWT_SECRET, JWT_EXPIRE
│   ├── package.json
│   ├── server.js                 # Express entry point
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── models/
│   │   ├── User.js               # name, email, password(hashed), role(enum), universityId
│   │   ├── Student.js            # name, email, course, marks, skills[], universityId, userId, isPlaced, placementCompany, virtual:grade
│   │   ├── University.js         # name, location, userId, virtual:studentCount
│   │   └── Announcement.js       # title, message, createdBy, priority(enum), targetUniversities[]
│   ├── middleware/
│   │   ├── auth.js               # protect (JWT verify) + authorize (role check)
│   │   └── errorHandler.js       # CastError, duplicate key, validation, JWT errors
│   ├── controllers/
│   │   ├── authController.js     # register, login, getMe
│   │   ├── studentController.js  # getStudents, getStudent, createStudent, updateStudent, deleteStudent, bulkUpload
│   │   ├── universityController.js # CRUD + checks student count before delete
│   │   ├── analyticsController.js  # getOverview, getCourseDistribution, getUniversityComparison, getSkillsDistribution, getPerformanceTrends
│   │   └── announcementController.js # getAnnouncements, createAnnouncement, deleteAnnouncement
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── studentRoutes.js      # includes multer config for CSV
│   │   ├── universityRoutes.js
│   │   ├── analyticsRoutes.js
│   │   └── announcementRoutes.js
│   ├── utils/
│   │   └── seedData.js           # Populates DB with demo data
│   └── uploads/                  # Temp CSV storage (auto-created)
├── frontend/
│   ├── .env.production           # VITE_API_URL for production deploy
│   ├── .gitignore
│   ├── index.html                # Vite entry, meta tags for SEO
│   ├── package.json
│   ├── tsconfig.json             # Vite default TS config (project uses JSX)
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   └── src/
│       ├── main.jsx              # React entry — StrictMode + BrowserRouter + App
│       ├── App.jsx               # All routes with ProtectedRoute wrappers
│       ├── index.css             # 1249-line premium dark theme design system
│       ├── context/
│       │   └── AuthContext.jsx   # AuthProvider with login/register/logout/fetchUser
│       ├── hooks/
│       │   └── useApi.js         # Custom hook: get/post/put/del with JWT + FormData support
│       ├── components/
│       │   ├── Layout/
│       │   │   ├── DashboardLayout.jsx  # Sidebar + Navbar + Outlet
│       │   │   ├── Navbar.jsx           # Brand logo, user avatar+initials, logout
│       │   │   └── Sidebar.jsx          # Role-based NavLink menu with sections
│       │   ├── Charts/
│       │   │   ├── BarChart.jsx         # Chart.js Bar wrapper
│       │   │   ├── DoughnutChart.jsx    # Chart.js Doughnut with centerText
│       │   │   ├── LineChart.jsx        # Chart.js Line with area fill
│       │   │   └── PieChart.jsx         # Chart.js Pie wrapper
│       │   └── common/
│       │       ├── DataTable.jsx        # Sortable, searchable, paginated table
│       │       ├── LoadingSpinner.jsx   # CSS spinner with optional text
│       │       ├── Modal.jsx           # Overlay modal with header/body/footer
│       │       ├── ProtectedRoute.jsx  # Auth guard + role check + redirect
│       │       └── StatCard.jsx        # Animated stat card with icon + color
│       └── pages/
│           ├── Login.jsx               # Login form + demo quick-login buttons
│           ├── Register.jsx            # Register form with role selector
│           ├── admin/
│           │   ├── AdminDashboard.jsx  # Stats grid + 4 charts + recent announcements
│           │   ├── Analytics.jsx       # 5 stat cards + 6 charts + course table with progress bars
│           │   ├── Announcements.jsx   # List + create modal (priority, multi-select targets)
│           │   ├── ManageStudents.jsx  # DataTable + filter by university + add/edit/delete modal
│           │   └── ManageUniversities.jsx # DataTable + add/edit/delete modal
│           ├── university/
│           │   ├── UniversityDashboard.jsx # Stats + charts + announcements from admin
│           │   ├── ManageStudents.jsx      # DataTable + add/edit/delete + CSV bulk upload modal
│           │   └── StudentList.jsx         # Read-only filterable student list
│           └── student/
│               └── StudentDashboard.jsx    # Profile card with banner + skills + performance bar
```

---

## Backend Details

### Environment Variables (`.env`)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/studentdb
JWT_SECRET=studentmgmt_super_secret_key_2024
JWT_EXPIRE=30d
```

### Backend Dependencies
```json
{
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "csv-parser": "^3.0.0",
    "dotenv": "^16.4.5",
    "express": "^4.21.0",
    "express-validator": "^7.2.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.7.0",
    "multer": "^1.4.5-lts.1"
  },
  "devDependencies": { "nodemon": "^3.1.7" }
}
```

Scripts: `start` → `node server.js`, `dev` → `nodemon server.js`, `seed` → `node utils/seedData.js`

### Server Setup (`server.js`)
- Load dotenv, connect MongoDB
- Auto-create `uploads/` directory
- CORS with `CORS_ORIGIN` env var support (default `*`)
- Mount 5 route groups: `/api/auth`, `/api/students`, `/api/universities`, `/api/analytics`, `/api/announcements`
- Health check at `GET /api/health`
- Centralized error handler middleware last

### Models

**User**: `name`, `email` (unique, lowercase), `password` (hashed via bcrypt pre-save hook, `select: false`), `role` (enum: admin/university/student, default: student), `universityId` (ref University). Method: `matchPassword()`

**Student**: `name`, `email` (unique), `course`, `marks` (0-100), `skills` (String array), `universityId` (ref University, required), `userId` (ref User), `isPlaced` (boolean), `placementCompany`. Virtual `grade`: A+ (≥90), A (≥80), B+ (≥70), B (≥60), C (≥50), D (≥40), F (<40)

**University**: `name` (unique), `location`, `userId` (ref User). Virtual `studentCount` (count of students with matching universityId)

**Announcement**: `title`, `message`, `createdBy` (ref User), `priority` (enum: low/medium/high, default: medium), `targetUniversities` (array of University refs, empty = broadcast)

### Middleware

**auth.js**: `protect` — extracts Bearer token, verifies JWT, attaches `req.user`. `authorize(...roles)` — checks `req.user.role` against allowed roles.

**errorHandler.js**: Handles CastError (404), duplicate key 11000 (400), ValidationError (400), JsonWebTokenError (401), TokenExpiredError (401), default 500.

### Controllers

**authController**: `register` (create user + generate JWT), `login` (validate credentials + generate JWT), `getMe` (return current user with populated universityId)

**studentController**: `getStudents` — role-scoped queries (university sees own, student sees self), supports `universityId`, `course`, `search`, `page`, `limit` query params. `getStudent` with ownership check. `createStudent` (auto-assigns universityId for university role). `updateStudent`/`deleteStudent` with ownership check. `bulkUpload` — parses CSV via csv-parser, maps columns, creates students one-by-one collecting errors, cleans up file.

**universityController**: Full CRUD. `deleteUniversity` checks for existing students before allowing delete.

**analyticsController**: 5 endpoints using MongoDB aggregation:
- `getOverview`: total students/universities/users, avg marks, placement count/rate
- `getCourseDistribution`: group by course, count + avg marks (scoped for university role)
- `getUniversityComparison`: group by university with lookup, project placement rate
- `getSkillsDistribution`: unwind skills array, group + count, top 15
- `getPerformanceTrends`: bucket marks into ranges (0-19, 20-39, 40-59, 60-79, 80-99, 100)

**announcementController**: `getAnnouncements` (university sees broadcast + targeted), `createAnnouncement`, `deleteAnnouncement`

### Routes & Authorization

| Route | Auth | Roles |
|---|---|---|
| POST /api/auth/register | Public | — |
| POST /api/auth/login | Public | — |
| GET /api/auth/me | protect | any |
| GET /api/students | protect | any (scoped) |
| POST /api/students | protect | admin, university |
| POST /api/students/bulk-upload | protect + multer | admin, university |
| PUT/DELETE /api/students/:id | protect | admin, university |
| GET /api/universities | protect | any |
| POST/PUT/DELETE /api/universities | protect | admin |
| GET /api/analytics/* | protect | admin, university |
| GET /api/analytics/university-comparison | protect | admin only |
| GET/POST /api/announcements | protect | any (read), admin (create) |
| DELETE /api/announcements/:id | protect | admin |

### Seed Data (`utils/seedData.js`)
Creates: 8 Indian universities (IIT Delhi, IIT Bombay, Delhi University, JNU, Mumbai Uni, Anna Uni, BHU, IISc), 1 admin user (`admin@gov.in`/`admin123`), 4 university users, 120 students (8 with login accounts), 3 sample announcements. 10 courses, 10 skill sets, 13 placement companies (with nulls for unplaced).

---

## Frontend Details

### Frontend Dependencies
```json
{
  "dependencies": {
    "chart.js": "^4.5.1",
    "react-chartjs-2": "^5.3.1",
    "react-router-dom": "^7.14.1"
  },
  "devDependencies": {
    "typescript": "~6.0.2",
    "vite": "^8.0.4"
  }
}
```

### API Configuration
All API calls use: `const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'`

### AuthContext
- Stores `user`, `token`, `loading` in state
- On mount: if token in localStorage, fetch `/api/auth/me` to validate
- `login(email, password)` → POST `/api/auth/login`, store token
- `register(userData)` → POST `/api/auth/register`, store token
- `logout()` → clear state + localStorage
- Exposes: `user, token, loading, login, register, logout, isAuthenticated`

### useApi Hook
- Wraps `fetch` with JWT Authorization header
- Auto-removes `Content-Type` for FormData (file uploads)
- On 401 → calls `logout()` automatically
- Returns: `{ get, post, put, del, loading, error, setError }`

### Routing (App.jsx)
- `/login`, `/register` — public
- `/` — redirects based on role
- `/admin/*` — ProtectedRoute(admin) → DashboardLayout → admin pages
- `/university/*` — ProtectedRoute(university) → DashboardLayout → university pages
- `/student/*` — ProtectedRoute(student) → DashboardLayout → student dashboard
- `*` — catch-all redirect to `/`

### Layout Components
- **DashboardLayout**: flex container with Navbar (fixed top) + Sidebar (fixed left 260px) + main content area
- **Navbar**: brand logo (🎓 EduConnect), user avatar with initials, name, role badge, click-to-logout
- **Sidebar**: role-based menu sections with NavLink (active state highlighting), emoji icons

### Reusable Components
- **DataTable**: client-side sort by any column, search across all columns, pagination (configurable page size), custom column renderers, empty state
- **Modal**: overlay with blur backdrop, slide-up animation, header/body/footer sections
- **StatCard**: colored top border gradient, icon in colored container, large value, label, optional trend indicator
- **LoadingSpinner**: CSS border animation spinner with optional text
- **ProtectedRoute**: checks auth + role, redirects to role-appropriate dashboard or login
- **Charts** (Bar, Doughnut, Line, Pie): dark-themed wrappers with Inter font, dark tooltips, subtle grid lines, custom color palettes

### Pages

**Login**: Glassmorphic card with animated background glows, email/password form, demo quick-login buttons (Admin/University/Student), link to register

**Register**: Same styling, adds name, role selector (student/university/admin), password confirmation

**Admin Dashboard**: 4 stat cards (students, universities, avg marks, placement rate) + 4 charts (course pie, university bar, performance bar with color-coded ranges, placement doughnut with center text) + recent announcements

**Analytics (Admin)**: 5 stat cards + 6 charts (course pie, skills bar, university avg marks bar, placement rate bar, performance line chart spanning full width) + course-wise table with inline progress bars

**Manage Universities (Admin)**: DataTable with name, location, student count badge, date added, edit/delete actions + create/edit modal

**Manage Students (Admin)**: DataTable with filter-by-university dropdown, name, email, course, marks+grade badge, university, placement status badge, edit/delete actions + create/edit modal with all fields

**Announcements (Admin)**: List of announcement cards with priority color-coded left border (red=high, amber=medium, green=low), priority/broadcast badges, delete button + create modal with title, message textarea, priority select, multi-select university targets

**University Dashboard**: 4 stat cards (computed from own students) + 4 charts + placement doughnut + announcements from admin

**University Manage Students**: Same as admin but scoped to own university + CSV bulk upload modal

**University Student List**: Read-only DataTable with course filter dropdown, skill tags display

**Student Dashboard**: Profile card with gradient banner, avatar with initials, info grid (course, university, location, marks, grade with color, placement status) + skills tag display + performance progress bar with gradient

---

## CSS Design System (1249 lines)

### Theme
- **Font**: Inter (Google Fonts), weights 300-800
- **Background**: Dark gradient `#0f0f1a → #1a1a2e → #16213e`
- **Cards**: `rgba(26, 26, 46, 0.8)` with `backdrop-filter: blur(20px)`, subtle borders `rgba(255,255,255,0.08)`
- **Primary palette**: Indigo `#6366f1` (50-900 scale)
- **Accent**: Emerald `#10b981`
- **Warning**: Amber `#f59e0b`, Danger: Red `#ef4444`, Info: Sky `#0ea5e9`

### Design Tokens
- 5 gradient presets (primary, accent, danger, warm, info)
- 5 shadow levels (sm → xl + glow variants)
- 5 border radius tokens (6px → 9999px)
- 8 spacing tokens (4px → 64px)
- 3 transition speeds (150ms/250ms/350ms)
- Sidebar: 260px width, Navbar: 64px height

### Key CSS Classes
- `.glass-card` — blur + border + hover shadow
- `.btn` variants: `.btn-primary` (gradient+glow), `.btn-accent`, `.btn-danger`, `.btn-ghost` (glass), sizes: `.btn-sm`, `.btn-lg`, `.btn-icon`
- `.form-input/.form-select/.form-textarea` — dark inputs with focus ring
- `.badge` variants: primary/accent/warning/danger/info
- `.stat-card` with color variants (purple/green/amber/red/blue) — colored top border + icon container
- `.data-table-container` — full table system with header, search, sortable columns, pagination
- `.modal-overlay/.modal-content` — blur backdrop + slide-up animation
- `.auth-page` — centered card with animated radial gradient background blobs
- `.profile-card` — banner + avatar overlay + info grid
- `.announcement-card` — priority-colored left border
- `.sidebar` + `.sidebar-link.active` — indigo highlight
- `.navbar` — frosted glass with blur
- Custom scrollbar styling
- Animations: `fadeIn`, `slideUp`, `spin`, `pulse-glow`
- Responsive breakpoints: 1024px (charts stack), 768px (sidebar hides, mobile layout)
- Utility classes: flex, gap, text-center, margins

---

## How to Run

```bash
# 1. Backend
cd backend
npm install
# Make sure MongoDB is running locally
npm run seed    # Populate demo data
npm run dev     # Starts on http://localhost:5000

# 2. Frontend
cd frontend
npm install
npm run dev     # Starts on http://localhost:5173
```

### Demo Credentials (after seeding)
| Role | Email | Password |
|---|---|---|
| Admin | admin@gov.in | admin123 |
| University | indianinst@university.edu | university123 |
| Student | student1@student.edu | student123 |

---

## Deployment Configuration

- **Frontend**: Vite build → deploy to Vercel. Set `VITE_API_URL` env var to backend URL.
- **Backend**: Deploy to Render. Set env vars: `MONGODB_URI` (MongoDB Atlas), `JWT_SECRET`, `JWT_EXPIRE`, `CORS_ORIGIN` (frontend URL), `PORT`.
- **Database**: MongoDB Atlas (cloud).
