# Smart Leads Dashboard

A production-ready CRM-style **Smart Leads Dashboard** built with the MERN stack and TypeScript. Features JWT authentication, role-based access control (RBAC), real-time filtering, pagination, and CSV export — all wrapped in a beautiful, responsive UI with dark mode support.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, TypeScript (strict), TailwindCSS |
| **State** | TanStack Query v5, React Context |
| **Forms** | React Hook Form + Zod |
| **HTTP** | Axios with interceptors |
| **Backend** | Node.js, Express.js, TypeScript (strict) |
| **Database** | MongoDB + Mongoose |
| **Auth** | JWT (jsonwebtoken) + bcryptjs |
| **Validation** | express-validator |
| **DevOps** | Docker + Docker Compose |

---

## Features

- [x] JWT-based authentication (register, login, session restore)
- [x] Role-based access control (Admin vs Sales)
- [x] Full Lead CRUD (Create, Read, Update, Delete)
- [x] Paginated lead list with server-side pagination
- [x] Multi-filter: status, source, free-text search (debounced), sort order
- [x] All filters work simultaneously and combined
- [x] Status badges with color coding (New, Contacted, Qualified, Lost)
- [x] Lead detail modal with formatted fields
- [x] Create/Edit lead modal with Zod validation
- [x] Delete confirmation modal (admin only)
- [x] CSV export with active filters applied (admin only)
- [x] Skeleton loading states for table rows
- [x] Empty state component for zero-result views
- [x] Dark mode toggle with localStorage persistence
- [x] System dark mode preference detection on first load
- [x] Responsive design (mobile sidebar, scrollable table)
- [x] Toast notifications for all user actions
- [x] Standardized API response format
- [x] Centralized error handling middleware
- [x] Docker + Docker Compose setup

---

## Prerequisites

- **Node.js** v18+
- **npm** v9+
- **MongoDB** v6+ (local) OR **Docker** (recommended)

---

## Local Setup (Without Docker)

### 1. Clone & navigate

```bash
git clone <your-repo-url>
cd smart-leads-dashboard
```

### 2. Backend setup

```bash
cd backend
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env — set MONGODB_URI, JWT_SECRET, etc.

# Start development server (hot-reload)
npm run dev
```

Backend runs on: `http://localhost:5000`

### 3. Frontend setup

```bash
cd frontend
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env — set VITE_API_URL=http://localhost:5000/api

# Start Vite dev server
npm run dev
```

Frontend runs on: `http://localhost:5173`

### 4. Build for production

```bash
# Backend
cd backend && npm run build && npm start

# Frontend
cd frontend && npm run build
# Serve the dist/ folder with any static server
```

---

## Docker Setup

```bash
# From the project root
cp backend/.env.example backend/.env
# Edit backend/.env with your settings

# Build and start all services (MongoDB + Backend + Frontend)
docker-compose up --build

# Run in background
docker-compose up -d --build

# Stop all services
docker-compose down

# Stop and remove volumes (clears MongoDB data)
docker-compose down -v
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost |
| Backend API | http://localhost:5000/api |
| MongoDB | mongodb+srv://<user-name>:<password>@cluster0.khtq1ye.mongodb.net/smart-leads |

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment (`development`/`production`) | `development` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://<user-name>:<password>@<your-cluster>.mongodb.net/<your-db>` |
| `JWT_SECRET` | Secret key for JWT signing — **use a long random string in prod** | — |
| `JWT_EXPIRES_IN` | Token expiry duration | `7d` |
| `FRONTEND_URL` | CORS allowed origin | `http://localhost:5173` |

### Frontend (`frontend/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

---

## API Documentation

### Base URL
`http://localhost:5000/api`

### Response Format

All endpoints return a consistent JSON structure:

```json
// Success
{ "success": true, "message": "...", "data": { ... } }

// Error
{ "success": false, "message": "...", "errors": [...] }
```

---

### Auth Endpoints

#### `POST /auth/register`
Register a new user account.

**Auth required:** No

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@company.com",
  "password": "secret123",
  "role": "sales"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Account created successfully.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": { "_id": "...", "name": "Jane Doe", "email": "jane@company.com", "role": "sales" }
  }
}
```

---

#### `POST /auth/login`
Authenticate and receive a JWT.

**Auth required:** No

**Request Body:**
```json
{ "email": "jane@company.com", "password": "secret123" }
```

**Response (200):** Same structure as register.

---

#### `GET /auth/me`
Get the current authenticated user's profile.

**Auth required:** Bearer token

**Response (200):**
```json
{ "success": true, "data": { "_id": "...", "name": "Jane Doe", "role": "sales" } }
```

---

### Lead Endpoints

All lead endpoints require a valid JWT in the `Authorization: Bearer <token>` header.

#### `GET /leads`
Get paginated leads with optional filters.

**Auth required:** Yes (any role)

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `status` | `New\|Contacted\|Qualified\|Lost` | Filter by status |
| `source` | `Website\|Instagram\|Referral` | Filter by source |
| `search` | `string` | Search in name and email |
| `sort` | `latest\|oldest` | Sort by creation date |
| `page` | `number` | Page number (default: 1) |
| `limit` | `number` | Results per page (default: 10, max: 50) |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "leads": [...],
    "pagination": {
      "total": 45, "page": 2, "limit": 10,
      "totalPages": 5, "hasNextPage": true, "hasPrevPage": true
    }
  }
}
```

---

#### `POST /leads`
Create a new lead.

**Auth required:** Yes (any role)

**Request Body:**
```json
{ "name": "John Smith", "email": "john@example.com", "status": "New", "source": "Website" }
```

**Response (201):** Created lead object.

---

#### `GET /leads/:id`
Get a single lead by ID.

**Auth required:** Yes (any role)

---

#### `PUT /leads/:id`
Update a lead (partial update supported).

**Auth required:** Yes (admin: any lead; sales: own leads only)

---

#### `DELETE /leads/:id`
Delete a lead.

**Auth required:** Yes (**admin only**)

---

#### `GET /leads/export/csv`
Export leads matching current filters as a CSV file download.

**Auth required:** Yes (**admin only**)

**Query Parameters:** Same as `GET /leads` (excluding `page` and `limit`)

**Response:** CSV file download (`text/csv`)

---

## Folder Structure

```
smart-leads-dashboard/
├── backend/src/
│   ├── config/db.ts              # MongoDB connection
│   ├── controllers/              # Auth + Lead business logic
│   ├── middleware/               # JWT auth, RBAC, error handler
│   ├── models/                   # Mongoose User + Lead models
│   ├── routes/                   # Express route definitions
│   ├── types/                    # TypeScript interfaces
│   ├── utils/                    # JWT, CSV, API response helpers
│   ├── validators/               # express-validator chains
│   └── index.ts                  # Express app entry
└── frontend/src/
    ├── api/                      # Axios instance + API functions
    ├── components/ui/            # Reusable UI components
    ├── components/leads/         # Lead-specific components
    ├── components/layout/        # Navbar, Sidebar, ProtectedRoute
    ├── context/AuthContext.tsx   # Auth state management
    ├── hooks/                    # Custom React hooks
    ├── pages/                    # Login, Register, Dashboard
    ├── types/                    # TypeScript interfaces
    └── utils/csvDownload.ts      # CSV download helper
```

---

## RBAC Permissions

| Action | Admin | Sales |
|--------|-------|-------|
| Create leads | ✅ | ✅ |
| View all leads | ✅ | ✅ |
| Update any lead | ✅ | ❌ |
| Update own leads | ✅ | ✅ |
| Delete leads | ✅ | ❌ |
| Export CSV | ✅ | ❌ |

---

## Screenshots

> _Screenshots coming soon. Run the app locally and register an admin account to explore all features._

---

## Deployment

> Add your deployment link here after deploying to a cloud provider.

### Recommended Platforms
- **Backend + MongoDB**: Railway, Render, or AWS ECS
- **Frontend**: Vercel, Netlify, or CloudFront + S3
- **All-in-one**: Docker Compose on any VPS (DigitalOcean, Hetzner, etc.)

---

## Git Commit History 

```
feat: add JWT authentication with bcrypt password hashing
feat: implement lead CRUD with pagination and filtering
feat: add debounced search and multi-filter support
feat: implement RBAC for admin and sales roles
feat: add CSV export functionality
feat: configure Docker and docker-compose
fix: handle expired JWT token redirect
refactor: extract lead filters into custom hook
style: improve responsive layout for mobile
```

---

## License

MIT
