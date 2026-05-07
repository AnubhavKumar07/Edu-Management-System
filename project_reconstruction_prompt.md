# Prompt to Recreate the EduConnect Project

> Copy everything below this line and paste it as a prompt to recreate the project.

---

## Project Overview

Build a full-stack **MERN** (MongoDB, Express.js, React, Node.js) web application called **"EduConnect"** — a **Centralized Student Data Management and Government-University Interaction Platform** for Indian universities. The system enables government administrators to monitor student data across all universities, university administrators to manage their own students, and students to view their academic profiles.

### Core Concept
- **Role-based access control** with 3 roles: `admin` (government), `university`, `student`
- **JWT authentication** (Bearer token in Authorization header)
- **Dark-themed premium UI** with glassmorphism, gradients, and micro-animations
- **Data visualization** using Chart.js (Pie, Bar, Line, Doughnut charts)
- **CRUD operations** for Students, Universities, and Announcements
- **CSV bulk upload** for student data
- **MongoDB aggregation pipelines** for analytics

---

## Technology Stack

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (`jsonwebtoken`) + bcrypt password hashing (`bcryptjs`)
- **File Upload**: `multer` for CSV file uploads
- **CSV Parsing**: `csv-parser`
- **Validation**: `express-validator`
- **Environment**: `dotenv`
- **CORS**: `cors` package
- **Dev**: `nodemon`

### Frontend
- **Framework**: React 18+ (JSX, not TypeScript for components) with Vite as build tool
- **Routing**: `react-router-dom` v7
- **Charts**: `chart.js` + `react-chartjs-2`
- **Styling**: Vanilla CSS with CSS custom properties (dark theme design system)
- **Font**: Google Fonts — Inter (300-800 weights)
- **State Management**: React Context API (AuthContext)

---

## Directory Structure

```
project/
├── .gitignore
├── backend/
│   ├── .env
│   ├── package.json
│   ├── server.js
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── analyticsController.js
│   │   ├── announcementController.js
│   │   ├── authController.js
│   │   ├── studentController.js
│   │   └── universityController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── Announcement.js
│   │   ├── Student.js
│   │   ├── University.js
│   │   └── User.js
│   ├── routes/
│   │   ├── analyticsRoutes.js
│   │   ├── announcementRoutes.js
│   │   ├── authRoutes.js
│   │   ├── studentRoutes.js
│   │   └── universityRoutes.js
│   ├── uploads/            (created at runtime)
│   └── utils/
│       └── seedData.js
├── frontend/
│   ├── .env.production
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── public/
│   │   └── favicon.svg
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css           (1249 lines — full design system)
│       ├── components/
│       │   ├── Charts/
│       │   │   ├── BarChart.jsx
│       │   │   ├── DoughnutChart.jsx
│       │   │   ├── LineChart.jsx
│       │   │   └── PieChart.jsx
│       │   ├── Layout/
│       │   │   ├── DashboardLayout.jsx
│       │   │   ├── Navbar.jsx
│       │   │   └── Sidebar.jsx
│       │   └── common/
│       │       ├── DataTable.jsx
│       │       ├── LoadingSpinner.jsx
│       │       ├── Modal.jsx
│       │       ├── ProtectedRoute.jsx
│       │       └── StatCard.jsx
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── hooks/
│       │   └── useApi.js
│       └── pages/
│           ├── Login.jsx
│           ├── Register.jsx
│           ├── admin/
│           │   ├── AdminDashboard.jsx
│           │   ├── Analytics.jsx
│           │   ├── Announcements.jsx
│           │   ├── ManageStudents.jsx
│           │   └── ManageUniversities.jsx
│           ├── student/
│           │   └── StudentDashboard.jsx
│           └── university/
│               ├── ManageStudents.jsx
│               ├── StudentList.jsx
│               └── UniversityDashboard.jsx
```

---

## Backend Specification

### Environment Variables (`.env`)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/studentdb
JWT_SECRET=studentmgmt_super_secret_key_2024
JWT_EXPIRE=30d
```

### Backend `package.json`
```json
{
  "name": "student-management-backend",
  "version": "1.0.0",
  "description": "Centralized Student Data Management API",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed": "node utils/seedData.js"
  },
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
  "devDependencies": {
    "nodemon": "^3.1.7"
  }
}
```

### Server Entry Point (`server.js`)
- Load dotenv, connect MongoDB
- Create `uploads/` directory if missing
- CORS with `process.env.CORS_ORIGIN || '*'` and `credentials: true`
- Parse JSON and URL-encoded bodies
- Mount routes:
  - `/api/auth` → authRoutes
  - `/api/students` → studentRoutes
  - `/api/universities` → universityRoutes
  - `/api/analytics` → analyticsRoutes
  - `/api/announcements` → announcementRoutes
- Health check at `GET /api/health`
- Error handler middleware (must be after routes)
- Listen on `PORT` (default 5000)

### Database Config (`config/db.js`)
- Connect to `process.env.MONGODB_URI` using `mongoose.connect()`
- Log success/failure, `process.exit(1)` on failure

### Data Models

#### User Model (`models/User.js`)
```
Fields:
  - name: String, required, trim, maxlength 50
  - email: String, required, unique, lowercase, regex validated
  - password: String, required, minlength 6, select: false
  - role: String, enum ['admin', 'university', 'student'], default 'student'
  - universityId: ObjectId ref 'University', default null
  - timestamps: true

Pre-save hook: Hash password with bcrypt (salt 10) if modified
Method: matchPassword(enteredPassword) — bcrypt.compare
```

#### Student Model (`models/Student.js`)
```
Fields:
  - name: String, required, trim, maxlength 100
  - email: String, required, unique, lowercase, regex validated
  - course: String, required, trim
  - marks: Number, required, min 0, max 100
  - skills: [String], default []
  - universityId: ObjectId ref 'University', required
  - userId: ObjectId ref 'User', default null
  - isPlaced: Boolean, default false
  - placementCompany: String, default null
  - timestamps: true, toJSON/toObject: { virtuals: true }

Virtual 'grade': A+ (90+), A (80+), B+ (70+), B (60+), C (50+), D (40+), F (below 40)
```

#### University Model (`models/University.js`)
```
Fields:
  - name: String, required, unique, trim, maxlength 200
  - location: String, required, trim
  - userId: ObjectId ref 'User', default null
  - timestamps: true, toJSON/toObject: { virtuals: true }

Virtual 'studentCount': ref 'Student', localField '_id', foreignField 'universityId', count: true
```

#### Announcement Model (`models/Announcement.js`)
```
Fields:
  - title: String, required, trim, maxlength 200
  - message: String, required, maxlength 2000
  - createdBy: ObjectId ref 'User', required
  - priority: String, enum ['low', 'medium', 'high'], default 'medium'
  - targetUniversities: [ObjectId ref 'University'] — empty = broadcast to all
  - timestamps: true
```

### Middleware

#### Auth Middleware (`middleware/auth.js`)
- `protect`: Extract Bearer token from Authorization header → `jwt.verify` → attach `req.user` from DB
- `authorize(...roles)`: Check `req.user.role` is in allowed roles, return 403 if not

#### Error Handler (`middleware/errorHandler.js`)
Centralized error handler catching:
- Mongoose CastError → 404
- Mongoose duplicate key (code 11000) → 400
- Mongoose ValidationError → 400 (join all messages)
- JsonWebTokenError → 401
- TokenExpiredError → 401
- Default → 500

### Controllers

#### Auth Controller (`controllers/authController.js`)
- `generateToken(id)`: `jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRE })`
- `register`: POST — check existing email, create user, return token + user data (201)
- `login`: POST — find user with `select('+password')`, compare password, return token + user data
- `getMe`: GET — find by `req.user.id`, populate `universityId`

#### Student Controller (`controllers/studentController.js`)
- `getStudents`: GET — role-scoped query (university sees own, student sees self), supports `universityId`, `course`, `search` (name regex) query params, pagination (page, limit default 25), populate universityId, sort by createdAt desc
- `getStudent`: GET /:id — populate university, check university authorization
- `createStudent`: POST — auto-assign universityId for university role users
- `updateStudent`: PUT /:id — check authorization for university role
- `deleteStudent`: DELETE /:id — check authorization for university role
- `bulkUpload`: POST /bulk-upload — parse CSV file via `csv-parser`, map columns (name/Name, email/Email, etc.), insert one-by-one collecting errors, delete uploaded file, return counts

#### University Controller (`controllers/universityController.js`)
- `getUniversities`: GET — search by name/location (regex), populate `studentCount` virtual, sort by name
- `getUniversity`: GET /:id — populate studentCount
- `createUniversity`: POST — admin only
- `updateUniversity`: PUT /:id — admin only
- `deleteUniversity`: DELETE /:id — admin only, check for students first (cannot delete if has students)

#### Analytics Controller (`controllers/analyticsController.js`)
- `getOverview`: GET /overview — totalStudents, totalUniversities, totalUsers, avgMarks (aggregate $avg), placedCount, placementRate
- `getCourseDistribution`: GET /course-distribution — aggregate $group by course with count and avgMarks, supports universityId filter and university-role scoping
- `getUniversityComparison`: GET /university-comparison — aggregate with $group, $lookup universities, $project with placementRate calculation
- `getSkillsDistribution`: GET /skills — $unwind skills, $group, $sort by count desc, $limit 15
- `getPerformanceTrends`: GET /performance-trends — $bucket with boundaries [0,20,40,60,80,100,101], map to labels ['0-19','20-39','40-59','60-79','80-99','100']

#### Announcement Controller (`controllers/announcementController.js`)
- `getAnnouncements`: GET — university users see broadcasts ($size: 0) + targeted; populate createdBy (name) and targetUniversities (name); sort createdAt desc
- `createAnnouncement`: POST — set createdBy from req.user, admin only
- `deleteAnnouncement`: DELETE /:id — admin only

### Routes

#### Auth Routes: `/api/auth`
- POST `/register` → register
- POST `/login` → login
- GET `/me` → protect, getMe

#### Student Routes: `/api/students`
- All require `protect`
- GET `/` → getStudents (any authenticated)
- POST `/` → authorize('admin','university'), createStudent
- POST `/bulk-upload` → authorize('admin','university'), multer upload.single('file'), bulkUpload
- GET `/:id` → getStudent
- PUT `/:id` → authorize('admin','university'), updateStudent
- DELETE `/:id` → authorize('admin','university'), deleteStudent

Multer config: diskStorage to `uploads/` dir, filename with timestamp, fileFilter for CSV only

#### University Routes: `/api/universities`
- All require `protect`
- GET `/` → getUniversities
- POST `/` → authorize('admin'), createUniversity
- GET `/:id` → getUniversity
- PUT `/:id` → authorize('admin'), updateUniversity
- DELETE `/:id` → authorize('admin'), deleteUniversity

#### Analytics Routes: `/api/analytics`
- All require `protect`
- GET `/overview` → authorize('admin','university'), getOverview
- GET `/course-distribution` → authorize('admin','university'), getCourseDistribution
- GET `/university-comparison` → authorize('admin'), getUniversityComparison
- GET `/skills` → authorize('admin','university'), getSkillsDistribution
- GET `/performance-trends` → authorize('admin','university'), getPerformanceTrends

#### Announcement Routes: `/api/announcements`
- All require `protect`
- GET `/` → getAnnouncements
- POST `/` → authorize('admin'), createAnnouncement
- DELETE `/:id` → authorize('admin'), deleteAnnouncement

### Seed Data (`utils/seedData.js`)
A script that:
1. Connects to MongoDB
2. Clears all collections (Users, Universities, Students, Announcements)
3. Creates 8 Indian universities (IIT Delhi, IIT Bombay, Delhi University, JNU, University of Mumbai, Anna University, BHU, IISc Bangalore)
4. Creates 1 admin user: `admin@gov.in` / `admin123`
5. Creates 4 university users (for first 4 universities), password: `university123`
6. Creates 120 students with randomized data:
   - 10 courses: Computer Science, Electrical Engineering, Mechanical Engineering, Civil Engineering, Data Science, AI, Business Administration, Physics, Mathematics, Chemistry
   - 10 skill sets (e.g., [JavaScript, React, Node.js, MongoDB], [Python, ML, TensorFlow, Data Analysis], etc.)
   - Companies for placement: Google, Microsoft, Amazon, Infosys, TCS, Wipro, Flipkart, Paytm, Razorpay, Zomato (some null = not placed)
   - First 8 students get login accounts: `student1@student.edu` / `student123`
   - Indian names with first/last name arrays
   - Marks: random 40-100
7. Creates 3 sample announcements (2 broadcast, 1 targeted)
8. Prints login credentials summary

---

## Frontend Specification

### Frontend `package.json`
```json
{
  "name": "frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "typescript": "~6.0.2",
    "vite": "^8.0.4"
  },
  "dependencies": {
    "chart.js": "^4.5.1",
    "react-chartjs-2": "^5.3.1",
    "react-router-dom": "^7.14.1"
  }
}
```

### `index.html`
- Title: "EduConnect — Student Data Management"
- Meta description: "EduConnect — Centralized Student Data Management and Government-University Interaction Platform"
- Entry: `/src/main.jsx`

### Entry Point (`main.jsx`)
- StrictMode → BrowserRouter → App
- Import `./index.css`

### App.jsx — Routing Structure
- Wrapped in `<AuthProvider>`
- Public routes: `/login` → Login, `/register` → Register
- Root `/` → RoleRedirect (redirects based on user.role to respective dashboard)
- Admin routes (protected, role: admin): `/admin/dashboard`, `/admin/universities`, `/admin/students`, `/admin/analytics`, `/admin/announcements`
- University routes (protected, role: university): `/university/dashboard`, `/university/students`, `/university/student-list`
- Student routes (protected, role: student): `/student/dashboard`
- Catch-all `*` → Navigate to `/`
- All dashboard routes wrapped in `<DashboardLayout>` using `<Outlet>`

### Auth Context (`context/AuthContext.jsx`)
- API_URL from `import.meta.env.VITE_API_URL || 'http://localhost:5000/api'`
- State: `user`, `token` (from localStorage), `loading`
- On mount: if token exists, fetch user via `GET /auth/me`
- `login(email, password)`: POST `/auth/login`, store token in localStorage
- `register(userData)`: POST `/auth/register`, store token
- `logout()`: clear user, token, localStorage
- Exports: `user, token, loading, login, register, logout, isAuthenticated`

### Custom Hook — `useApi.js`
- Gets `token` and `logout` from AuthContext
- `request(endpoint, options)`: fetch with auth header, handle 401 (auto logout), throw on !success
- Convenience methods: `get(endpoint)`, `post(endpoint, body)`, `put(endpoint, body)`, `del(endpoint)`
- FormData support: removes Content-Type header for file uploads
- Returns `{ get, post, put, del, loading, error, setError }`

### Reusable Components

#### ProtectedRoute
- Props: `children, allowedRoles`
- If loading → LoadingSpinner
- If not authenticated → Navigate to /login
- If role not in allowedRoles → Navigate to user's own dashboard

#### DashboardLayout
- State: `sidebarOpen` toggle
- Renders: Navbar (with toggle callback) + Sidebar (with isOpen) + `<main>` with `<Outlet/>`

#### Navbar
- Brand: 🎓 EduConnect
- User section: avatar (initials), name, role, power icon (logout on click)
- Sidebar toggle button (hidden by default, for mobile)

#### Sidebar
- Role-based menu items:
  - **Admin**: Dashboard (📊), Analytics (📈), Universities (🏫), All Students (🎓), Announcements (📢)
  - **University**: Dashboard (📊), Manage Students (🎓), Student List (📋)
  - **Student**: My Profile (👤)
- Uses NavLink with active class styling
- Sections grouped with titles: "Overview", "Management", "Communication"

#### StatCard
- Props: `icon, value, label, color (purple|blue|amber|green|red), trend`
- Animated card with colored top border, icon container, large value, label
- Optional trend indicator (↑/↓ with percentage)

#### DataTable
- Props: `columns, data, searchable, searchPlaceholder, title, actions, pageSize (default 10)`
- Client-side search across all columns
- Click-to-sort on column headers (asc/desc toggle)
- Pagination with "← Prev / Next →" buttons
- Column config: `{ key, label, sortable, render(value, row) }`

#### Modal
- Props: `isOpen, onClose, title, children, footer`
- Overlay with backdrop blur, click-outside-to-close
- Animated slide-up entrance
- Header with title + close button (✕), body, optional footer

#### LoadingSpinner
- Props: `size ('default'|'sm'), text (default 'Loading...')`
- Spinning circle with text below

#### Chart Components (BarChart, LineChart, PieChart, DoughnutChart)
All wrap `react-chartjs-2` with dark theme styling:
- Dark tooltips (`rgba(15, 15, 26, 0.9)`)
- Grid lines: `rgba(255,255,255,0.05)`
- Tick colors: `#64748b`
- Legend colors: `#94a3b8`
- Font: Inter
- Consistent color palette: indigo, emerald, amber, red, sky, violet, pink, cyan
- DoughnutChart supports `centerText: { value, label }` overlay
- BarChart: `borderRadius: 6, borderSkipped: false`
- LineChart: `tension: 0.4, fill: true, pointRadius: 4`

### Pages

#### Login Page
- Centered auth card with gradient background + animated glowing orbs
- Logo (🎓), "Welcome Back", "Sign in to EduConnect"
- Email/password form with validation
- **Quick Demo Login** buttons: Admin, University, Student (auto-fill credentials)
- Link to Register page
- On success: redirect to role-based dashboard

#### Register Page
- Same auth styling
- Fields: Full Name, Email, Role (select: Student/University/Admin), Password, Confirm Password
- Client-side validation: passwords match, min 6 chars
- Link to Login page

#### Admin Dashboard
- Page title: "Government Dashboard" with subtitle
- Stats grid (4 cards): Total Students, Universities, Average Marks, Placement Rate
- Charts grid row 1: Course Distribution (PieChart) + University Comparison (BarChart - avg marks)
- Charts grid row 2: Performance Distribution (BarChart - colored buckets) + Placement by University (DoughnutChart with centerText)
- Recent Announcements section (last 3)

#### Admin Analytics
- Full analytics page with 5 stat cards (including Registered Users)
- Course-wise Distribution (PieChart) + Top Skills (BarChart, green)
- University — Average Marks (BarChart) + University — Placement Rate (BarChart)
- Full-width Marks Distribution (LineChart with area fill)
- Course-wise Average Marks table with progress bar indicators (colored by performance level)

#### Admin Manage Students
- DataTable with all students across universities
- University filter dropdown
- Columns: Name, Email, Course, Marks (with grade badge), University, Placed (with company or Yes/No), Actions (edit/delete)
- Create/Edit modal with form: Name, Email, Course, Marks, Skills (comma-separated), University (select), Placed checkbox, Placement Company (conditional)

#### Admin Manage Universities
- DataTable: University Name, Location, Students (badge count), Added date, Actions (edit/delete)
- Create/Edit modal: University Name, Location
- Delete protection: cannot delete if university has students

#### Admin Announcements
- List of announcement cards with priority-colored left border (high=red, medium=amber, low=green)
- Each card shows: title, priority badge, author, target info (Broadcast/N targets), date, delete button
- Targeted university names shown as badges
- Create modal: Title, Message (textarea), Priority (select), Target Universities (multi-select, empty=broadcast)

#### University Dashboard
- Page title: "University Dashboard"
- Stats grid: Total Students, Average Marks, Students Placed, Placement Rate
- Charts: Course Distribution (Pie) + Performance Distribution (Bar)
- Top Skills (Bar, green) + Placement Status (Doughnut with centerText)
- Latest Announcements from Government (last 3)

#### University Manage Students
- DataTable with own students
- Add Student + Bulk Upload (CSV) buttons
- Columns: Name, Email, Course, Marks (grade), Skills (tags, max 3 shown), Placed, Actions
- Create/Edit modal (same as admin but without university select — auto-assigned)
- CSV Upload modal: file input (.csv), upload button, status messages (success/failed/error)
- CSV columns: name, email, course, marks, skills, isPlaced, placementCompany

#### University Student List
- Read-only searchable/filterable list
- Course filter dropdown (dynamically populated from data)
- Columns: Name (bold), Email, Course (badge), Marks/100 (grade badge), Skills (tags, max 2), Status (Placed with company or "Seeking")
- Shows count: "Showing X of Y students"

#### Student Dashboard
- Page title: "My Profile"
- If no student record: empty state with message to contact university
- Profile card with:
  - Gradient banner with avatar (initials)
  - Name, email
  - Info grid: Course, University, Location, Marks, Grade (colored), Placement Status
- Skills section with tags
- Performance visual: progress bar (gradient colored by score level) with marks percentage

---

## CSS Design System (index.css — 1249 lines)

### Key Design Tokens
- **Colors**: Indigo primary (#6366f1), Emerald accent (#10b981), Amber warning (#f59e0b), Red danger (#ef4444), Sky info (#0ea5e9)
- **Background**: `#0f0f1a` (primary), `#1a1a2e` (secondary), `#16213e` (tertiary)
- **Glass effects**: `rgba(255,255,255,0.05)` backgrounds with `backdrop-filter: blur(20px)`
- **Borders**: `rgba(255,255,255,0.08)` default, `rgba(255,255,255,0.15)` hover
- **Text**: `#f1f5f9` (primary), `#94a3b8` (secondary), `#64748b` (tertiary)
- **Gradients**: Primary (indigo→violet→purple), Accent (emerald), Warm (amber), Danger (red), Info (sky)
- **Shadows**: sm/md/lg/xl + glow effects for primary and accent
- **Border radius**: 6px (sm) → 9999px (full)
- **Spacing scale**: 4/8/16/24/32/48/64px
- **Transitions**: 150ms (fast) / 250ms (normal) / 350ms (slow) with cubic-bezier

### Layout Variables
- Sidebar width: 260px
- Navbar height: 64px

### CSS Includes
- Reset & base styles
- Custom scrollbar styling
- Typography (Inter font)
- Glass card component
- Button variants (primary/accent/danger/ghost + sm/lg/icon sizes)
- Form elements (input/select/textarea with focus ring)
- Badge variants (primary/accent/warning/danger/info)
- Stat cards (with colored top borders and icon backgrounds)
- Stats/Charts grids (auto-fit responsive)
- Chart cards
- Data table (header, search, sortable columns, pagination)
- Modal (overlay blur, slide-up animation)
- Page layout (header with gradient title)
- Dashboard layout (sidebar + main)
- Fixed sidebar with sections
- Fixed navbar with blur backdrop
- Announcement cards with priority borders
- Auth pages (centered card, animated glowing orbs)
- Loading spinner (rotate animation)
- Empty states
- Profile card (banner, avatar, info grid)
- Skills tags
- Filters bar
- Animations: fadeIn, slideUp, spin, pulse-glow
- Responsive breakpoints: 1024px (charts stack), 768px (sidebar hides, mobile layout)
- Utility classes: flex, items-center, justify-between, gap-sm/md/lg, text-center, w-full, mt/mb-md/lg

---

## How to Run

### Backend
```bash
cd backend
npm install
# Start MongoDB locally
npm run seed     # Populate demo data
npm run dev      # Start with nodemon on port 5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev      # Vite dev server (usually port 5173)
```

### Demo Login Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin (Government) | admin@gov.in | admin123 |
| University | indianinst@university.edu | university123 |
| Student | student1@student.edu | student123 |

---

## Important Implementation Notes

1. **API URL**: Frontend uses `import.meta.env.VITE_API_URL || 'http://localhost:5000/api'` — configurable via `.env` or `.env.production`
2. **Token storage**: JWT stored in `localStorage` under key `'token'`
3. **Password hashing**: bcrypt with 10 salt rounds, password field has `select: false` on User model
4. **Virtual fields**: Student has `grade` virtual, University has `studentCount` virtual — enabled via `toJSON: { virtuals: true }`
5. **Error handling**: All controllers use `try/catch` with `next(error)` pattern flowing to centralized errorHandler
6. **Pagination**: Student list uses server-side pagination (page/limit query params) but frontend fetches with `limit=500` for client-side table handling
7. **Authorization scoping**: University users automatically see only their own students (filtered by `universityId` in controllers)
8. **CSV upload**: Uses multer diskStorage, files saved to `uploads/` dir, deleted after processing
9. **Charts**: All use dark theme config — background `rgba(15,15,26,0.9)` tooltips, Inter font, consistent color palette
10. **Responsive**: Sidebar slides out on mobile (<768px), charts stack on tablet (<1024px)
