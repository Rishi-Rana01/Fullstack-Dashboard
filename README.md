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
| **Database** | MongoDB Atlas + Mongoose |
| **Auth** | JWT (jsonwebtoken) + bcryptjs |
| **Validation** | express-validator |
| **DevOps** | Docker + Docker Compose, Render (Backend), Vercel (Frontend) |

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
git clone https://github.com/Rishi-Rana01/Fullstack-Dashboard.git
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

---

## Deployment (Production)

The application is deployed using modern cloud platforms:

- **Frontend**: [Vercel](https://fullstack-dashboard-six.vercel.app/)
- **Backend API**: [Render](https://smart-leads-backend-qzbo.onrender.com/health)
- **Database**: MongoDB Atlas

### Deploying the Backend (Render)
The backend is configured to deploy automatically to Render using the `render.yaml` configuration.
1. Connect your GitHub repository to Render.
2. The `render.yaml` handles the Node environment, build command (`npm ci --include=dev && npm run build`), and start command.
3. Ensure you set the `MONGODB_URI`, `JWT_SECRET`, and `FRONTEND_URL` environment variables in the Render dashboard.

### Deploying the Frontend (Vercel)
1. Import the `frontend/` directory into a new Vercel project.
2. The framework will be auto-detected as Vite.
3. Set the `VITE_API_URL` environment variable to your backend URL (e.g., `https://smart-leads-backend-qzbo.onrender.com/api`). Note: Make sure it ends in `/api`.

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
| `FRONTEND_URL` | CORS allowed origin (No trailing slashes) | `http://localhost:5173` |

### Frontend (`frontend/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

---

## API Documentation

### Base URL
`https://smart-leads-backend-qzbo.onrender.com/api` (Production)
`http://localhost:5000/api` (Local)

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

## Error Handling

The API uses a centralized error handling middleware (`src/middleware/error.middleware.ts`) to catch and format errors consistently.

### Common Error Responses

**400 Bad Request (Validation Error):**
```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    { "field": "email", "message": "Please enter a valid email address" }
  ]
}
```

**401 Unauthorized (Invalid/Expired Token):**
```json
{
  "success": false,
  "message": "Session expired. Please log in again."
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Lead not found."
}
```

**409 Conflict (Duplicate Key):**
```json
{
  "success": false,
  "message": "A record with that email already exists."
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "An unexpected internal server error occurred."
}
```

---

## AI-Assisted Troubleshooting

During the deployment to Render, a persistent `ERR_INVALID_CHAR` issue occurred due to an invalid character in the CORS `Access-Control-Allow-Origin` header.

**The Problem:**
The backend was crashing with `TypeError [ERR_INVALID_CHAR]: Invalid character in header content ["Access-Control-Allow-Origin"]` when making requests from the frontend.

**The Debugging Process (with AI Assistance):**
1. **Identified the cause:** AI correctly identified that a trailing slash (`/`) or invisible whitespace/newline characters in the `FRONTEND_URL` environment variable were violating HTTP header specifications.
2. **First Attempt:** Added `.replace(/\/+$/, '')` to strip trailing slashes, but the error persisted because the environment variable contained an invisible newline character (`\n`) from a copy-paste error in the Render dashboard.
3. **The Fix:** AI instructed to add `.trim()` alongside `.replace()` and added diagnostic logging using `JSON.stringify(FRONTEND_URL)` to reveal hidden characters in the Render logs.
   ```typescript
   const FRONTEND_URL = (process.env.FRONTEND_URL ?? 'http://localhost:5173').trim().replace(/\/+$/, '');
   ```
4. **Resolution:** The backend was successfully able to parse the origin, allowing cross-origin requests from the Vercel frontend and resolving the issue completely.

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

## License

MIT
