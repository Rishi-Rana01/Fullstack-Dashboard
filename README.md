# Smart Leads Dashboard

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-61dafb?style=flat-square)](https://mern.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React 18](https://img.shields.io/badge/React-18+-blue?style=flat-square&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7+-green?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ed?style=flat-square&logo=docker)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

A **production-ready CRM dashboard** built with the **MERN stack** (MongoDB, Express, React, Node.js) and **TypeScript**. Features JWT authentication, role-based access control (RBAC), real-time filtering, pagination, CSV export, and comprehensive lead management.

🌐 **[Frontend Demo](https://fullstack-dashboard-six.vercel.app/)** | 🔗 **[Backend API](https://smart-leads-backend-qzbo.onrender.com/health)** | 📂 **[GitHub](https://github.com/Rishi-Rana01/Fullstack-Dashboard)** | 👤 **[Profile](https://github.com/Rishi-Rana01)**

---

## ✨ Key Features

- ✅ **JWT Authentication** - Secure login with token-based sessions
- ✅ **Role-Based Access Control** - Admin vs Sales permissions
- ✅ **Full Lead CRUD** - Create, Read, Update, Delete operations
- ✅ **Advanced Filtering** - Multi-filter support (status, source, search, sort)
- ✅ **Pagination** - Server-side pagination with customizable limits
- ✅ **CSV Export** - Download filtered leads (admin only)
- ✅ **Real-Time UI** - Instant updates with React Query
- ✅ **Dark Mode** - Theme toggle with persistence
- ✅ **Responsive Design** - Mobile, tablet, desktop optimized
- ✅ **Toast Notifications** - User feedback for actions
- ✅ **Docker Support** - Containerized deployment
- ✅ **TypeScript** - Full type safety

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 18** | UI library |
| **Vite** | Build tool |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Styling |
| **React Query** | State management |
| **Zod** | Validation |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js** | Runtime |
| **Express.js** | Framework |
| **MongoDB** | Database |
| **JWT** | Authentication |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18+
- **npm** v9+
- **MongoDB** v6+

### Local Development

#### 1. Clone Repository

```bash
git clone https://github.com/Rishi-Rana01/Fullstack-Dashboard.git
cd Fullstack-Dashboard
```

#### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/smart-leads
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:5173
```

Start:
```bash
npm run dev
```

Backend: **http://localhost:5000**

#### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
```

Edit `.env.local`:
```env
VITE_API_URL=http://localhost:5000/api
```

Start:
```bash
npm run dev
```

Frontend: **http://localhost:5173**

---

## 🐳 Docker Setup

```bash
docker-compose up --build
```

---

## 👥 User Roles & Permissions

| Action | Admin | Sales |
|--------|-------|-------|
| Create leads | ✅ | ✅ |
| View all leads | ✅ | ✅ |
| Update any lead | ✅ | ❌ |
| Update own leads | ✅ | ✅ |
| Delete leads | ✅ | ❌ |
| Export CSV | ✅ | ❌ |

---

## 🔌 API Endpoints

### Base URLs
- **Local**: `http://localhost:5000/api`
- **Production**: `https://smart-leads-backend-qzbo.onrender.com/api`

### Auth

#### POST `/auth/register`
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"pass123","role":"sales"}'
```

#### POST `/auth/login`
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -d '{"email":"john@example.com","password":"pass123"}'
```

### Leads

#### GET `/leads` (with filters)
```bash
curl "http://localhost:5000/api/leads?status=New&page=1&limit=10" \
  -H "Authorization: Bearer JWT_TOKEN"
```

**Query Params:** status, source, search, sort, page, limit

#### POST `/leads`
```bash
curl -X POST http://localhost:5000/api/leads \
  -H "Authorization: Bearer JWT_TOKEN" \
  -d '{"name":"Jane","email":"jane@example.com","status":"New"}'
```

#### PUT `/leads/:id`
```bash
curl -X PUT http://localhost:5000/api/leads/:id \
  -H "Authorization: Bearer JWT_TOKEN" \
  -d '{"status":"Contacted"}'
```

#### DELETE `/leads/:id` (admin)
```bash
curl -X DELETE http://localhost:5000/api/leads/:id \
  -H "Authorization: Bearer ADMIN_JWT"
```

---

## 🚀 Deployment

### Backend (Render)
1. Push to GitHub
2. Connect to Render
3. Set env variables
4. Deploy

### Frontend (Vercel)
1. Import frontend folder
2. Set `VITE_API_URL`
3. Deploy

---

## 📂 Project Structure

```
smart-leads-dashboard/
├── backend/src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── index.ts
└── frontend/src/
    ├── api/
    ├── components/
    ├── context/
    ├── pages/
    └── utils/
```

---

## 🤝 Contributing

1. Fork the repo
2. Create feature branch: `git checkout -b feature/amazing`
3. Commit: `git commit -m 'Add feature'`
4. Push: `git push origin feature/amazing`
5. Open PR

---

## 📝 License

MIT License

---

## 🔗 Connect & Support

- **GitHub Profile**: [@Rishi-Rana01](https://github.com/Rishi-Rana01)
- **Report Issues**: [GitHub Issues](https://github.com/Rishi-Rana01/Fullstack-Dashboard/issues)
- **Email**: rishirana.dev@gmail.com

---

**Made with ❤️ by [Rishi Rana](https://github.com/Rishi-Rana01)**
