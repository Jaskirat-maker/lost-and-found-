# College Lost & Found (Production-Ready)

Full-stack Lost & Found web application for a college.

- **Frontend**: React + Tailwind CSS + React Router + Axios + Context API + Framer Motion
- **Backend**: Spring Boot (Java 17) + Spring Security (JWT) + Spring Data JPA + Java Mail
- **Database**: PostgreSQL

## Features

- **Students**
  - Register using college email domain
  - Login (JWT)
  - Report **Lost** and **Found** items (with optional image upload + preview)
  - Track status: PENDING → APPROVED / REJECTED → MATCHED
- **Admin (Registrar)**
  - View all reports
  - Approve / reject (optional reason)
  - Match LOST ↔ FOUND items
  - Email notifications on approval + match (email sending is optional; safely no-ops if SMTP not configured)

## Repo structure

- `backend/` Spring Boot API
- `frontend/` React SPA
- `docker-compose.yml` local Postgres + backend

## Quick start (local dev)

### 1) Start Postgres + backend (Docker)

From repo root:

```bash
docker compose up --build
```

Backend runs at `http://localhost:8080`.

### 2) Start frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

## Backend configuration (env vars)

See `backend/.env.example` for all variables (DB, JWT, CORS, admin seeding, uploads, SMTP).

## Frontend configuration (env vars)

See `frontend/.env.example`.

- `VITE_API_BASE_URL`: backend base URL (default `http://localhost:8080`)

## Key API routes

- **Auth**
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/auth/me`
- **Items**
  - `POST /api/items` (auth)
  - `GET /api/items/me` (auth)
  - `GET /api/items/public?type=LOST|FOUND` (public, approved only)
- **Uploads**
  - `POST /api/files/upload` (auth, multipart)
  - `GET /uploads/**` (public)
- **Admin**
  - `GET /api/admin/items?status=&type=`
  - `PUT /api/admin/items/{id}/approve`
  - `PUT /api/admin/items/{id}/reject`
  - `POST /api/admin/match`
  - `POST /api/admin/email`

## Deployment notes

- **Frontend (Vercel)**: run `npm run build` in `frontend/` (SPA rewrite in `frontend/vercel.json`).
- **Backend (Railway/Render)**:
  - Deploy `backend/` with `Dockerfile` or as a Java service.
  - Set env vars from `backend/.env.example`.
  - Point `CORS_ALLOWED_ORIGINS` to your frontend domain(s).

### Deploy backend on Render (recommended)

This repo includes a Render Blueprint at `render.yaml`.

1. In Render: **New +** → **Blueprint**
2. Select this GitHub repo
3. Render will create:
   - a **PostgreSQL** database (`lostfound-db`)
   - a **Web Service** (`lostfound-backend`) using `backend/Dockerfile`
4. After deploy, update:
   - **`CORS_ALLOWED_ORIGINS`** to your Vercel domain (example: `https://your-frontend.vercel.app`)
   - Optionally set **`ADMIN_EMAIL`**, **`ADMIN_PASSWORD`**, **`ADMIN_NAME`** to seed an admin

Notes:
- Render’s database connection string is `postgres://...`; the backend automatically converts it to a JDBC URL at startup.
- For persistent image uploads on Render, attach a disk and point `UPLOAD_DIR` to that mount path.
