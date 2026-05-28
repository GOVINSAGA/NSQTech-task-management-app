# NSQTech Portal — Role-Based Access Management System

A full-stack SPA built with **Angular 17+** (standalone components) and **Node.js/Express** with **MongoDB**, demonstrating enterprise-grade authentication, role-based access control, and async API processing.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Angular 17+ (Standalone Components, Signals, Lazy Loading) |
| **Backend** | Node.js, Express.js, TypeScript |
| **Database** | MongoDB 7 (Mongoose ODM) |
| **Auth** | JWT (jsonwebtoken) + bcrypt |
| **Deployment** | Docker + Docker Compose + Nginx |

## Features

### Authentication & Authorization
- JWT-based login with bcrypt password hashing
- Role-based access: **Admin** and **General User**
- Route guards (auth + admin) protecting frontend routes
- HTTP interceptor auto-attaching Bearer tokens
- `APP_INITIALIZER` restoring sessions on app reload

### Dashboard (Logged-In Page)
- User profile card with role badge and metadata
- Records data table with role-filtered results
  - General users see `general`-access records only
  - Admins see all records
- **Async Processing Showcase**: Configurable API delay (0s–5s) with:
  - Skeleton loaders during loading
  - Real-time elapsed timer
  - Progress bar animation

### Admin Panel (Admin Only)
- User management table with CRUD operations
- Inline role toggle (Admin ↔ General)
- Account activation/deactivation
- User deletion with confirmation modal
- Add new user form

### Design
- **Midnight teal glassmorphic** UI with lavender + icy mint accents
- Plus Jakarta Sans + Fira Code typography
- Animated aurora background
- Micro-animations and hover effects
- Fully responsive (mobile-first)

---

## Quick Start

### Docker (Recommended)

```bash
docker-compose up --build
```

Open **http://localhost:4200** in your browser.

### Local Development

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

> Requires MongoDB running locally on port 27017

---

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@nsqtech.com | Admin@123 |
| **General User** | user@nsqtech.com | User@123 |

---

## API Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|:----:|:----:|-------------|
| POST | `/api/auth/login` | ❌ | — | Authenticate user |
| POST | `/api/auth/register` | ❌ | — | Register new user |
| GET | `/api/users/me` | ✅ | Any | Current user profile |
| GET | `/api/users` | ✅ | Admin | List all users |
| PUT | `/api/users/:id` | ✅ | Admin | Update user |
| DELETE | `/api/users/:id` | ✅ | Admin | Delete user |
| GET | `/api/records?delay=N` | ✅ | Any | Fetch records (with optional delay in ms) |
| GET | `/api/health` | ❌ | — | Health check |

---

## Project Structure

```
NSQTech-assesment/
├── backend/
│   ├── src/
│   │   ├── config/          # DB connection, environment config
│   │   ├── middleware/      # JWT auth, role guard, delay simulator
│   │   ├── models/          # Mongoose schemas (User, Record)
│   │   ├── routes/          # REST API routes
│   │   ├── services/        # Business logic layer
│   │   ├── seed/            # Database seeder
│   │   └── server.ts        # Express entry point
│   └── Dockerfile
├── frontend/
│   ├── src/app/
│   │   ├── core/            # Services, interceptors, guards, models
│   │   ├── features/        # Login, Dashboard, Admin (lazy-loaded)
│   │   ├── shared/          # Navbar, Toast (reusable components)
│   │   ├── app.config.ts    # APP_INITIALIZER, HttpClient, Router
│   │   └── app.routes.ts    # Lazy-loaded routes with guards
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml
└── README.md
```

## Angular Features Demonstrated

- **Standalone Components** (no NgModules)
- **Lazy Loading** via `loadComponent` in routes
- **Functional Route Guards** (`canActivate`)
- **HTTP Interceptors** (functional `HttpInterceptorFn`)
- **Angular Signals** for reactive state management
- **APP_INITIALIZER** for session restoration on bootstrap
- **Reactive Forms** with validation
- **RxJS Operators** (`tap`, `catchError`, `switchMap`, `finalize`)
- **Environment-based configuration**
