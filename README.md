<div align="center">

# ⚡ LearnFlow LMS

### Premium Learning Paths & Structured Curriculums

A modern, full-stack Learning Management System (LMS) designed to deliver premium video courses with strict progress boundaries, robust state management, and an awe-inspiring glassmorphism aesthetic.

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_App-00e676?style=for-the-badge)](https://learning-management-system-nine-puce.vercel.app/)
[![API Status](https://img.shields.io/badge/API-Render_Deployed-blueviolet?style=for-the-badge)](https://learning-management-system-smqr.onrender.com)
[![Database](https://img.shields.io/badge/DB-Aiven_MySQL-00a2e8?style=for-the-badge)](https://aiven.io)

</div>

---

## 🔗 Quick Links

| Resource | URL |
|----------|-----|
| **Frontend Live App** | [https://learning-management-system-nine-puce.vercel.app/](https://learning-management-system-nine-puce.vercel.app/) |
| **Backend API (Health Check)** | [https://learning-management-system-smqr.onrender.com/api/health](https://learning-management-system-smqr.onrender.com/api/health) |

---

## 📖 About The Project

LearnFlow is an end-to-end proprietary course platform designed for sequential learning. It enforces strict "Watch-to-Unlock" mechanisms ensuring students master the foundational concepts before proceeding to advanced material. Features an ultra-premium, dark-themed, glassmorphic UI built natively on Next.js 14.

---

## ✨ Core Logic & Features

- **Strict Progressive Unlocking** — The logic layer mathematically enforces sequential video progression. Users cannot skip directly to Video 4 without successfully completing and registering progress on Video 3.
- **Optimistic State Updates & Debouncing** — Video progression and playback positions rely on granular frontend state-tracking (via Zustand) coupled with debounced background syncs via a unified `apiClient` to reduce server load.
- **Premium Glassmorphism Design System** — A dark-mode first, Tailwind-powered aesthetic relying on radial glowing orbs, frosted glass navbars (`backdrop-blur-xl`), noise textures, and dynamic gradient layouts.
- **JWT-based Stateful Authentication** — Secure multi-layered session validation leveraging both HttpOnly refresh cookies and short-lived access tokens natively intercepted and refreshed by the custom API client.

---

## 🛠️ Full Technical Stack

| Layer | Technology | Architecture Notes |
|-------|------------|--------------------|
| **Frontend Framework** | **Next.js 14** (App Router) | Utilizing both Client (`'use client'`) and Server contexts, built for optimized React rendering. |
| **Styling** | **Tailwind CSS v4** | Pure utility-first styling utilizing complex custom gradients, blurs, and pseudo-elements. |
| **State Management** | **Zustand** | Handling multi-store synchronization (`authStore`, `sidebarStore`) separated logically by domain. |
| **Backend Server** | **Express.js (Node)** | Strictly typed using standard Object-Oriented MVC Controller-Service abstractions. |
| **Database ORM** | **Knex.js Query Builder** | Managing schema generation and complex SQL joins natively in TypeScript. |
| **Relational Database** | **MySQL (Aiven)** | Cloud-hosted relational persistence mapping nested domains (Subjects -> Sections -> Videos). |
| **Infrastructure** | **Render (BE) / Vercel (FE)** | Automated CI/CD pipelines scaling via Web Concurrency configurations. |

---

## 🏗️ Domain Logic & Architecture Map

### Backend Database Architecture
The backend uses a strictly normalized, 4-tier relational schema:
1.  **Users Table:** Handles credentials (bcrypt) and demographics.
2.  **Subjects Table:** The core "Course" container.
3.  **Sections Table:** A grouping abstraction mapping to a Subject.
4.  **Videos Table:** The distinct lesson payloads bounded strictly by a logical `order_index`.

**Progression Logic (`UserProgress` Table):** 
Whenever a user watches a video, the frontend sends periodic updates of their temporal position. If `is_completed: true` is intercepted, the `subject.service.ts` logic evaluates the entire `order_index` sequence to unlock the mathematically next sequential row.

### Next.js Frontend Flow
1. **Unauthenticated:** Redirected natively by the `AuthGuard` layout component.
2. **Dashboard (`/profile`):** Calculates global percentage completion using backend aggregation queries and renders a dynamic loading bar.
3. **Subject View (`/subjects/[id]`):** Enrolls the user aggressively but halts progression to only the specifically unlocked videos.
4. **Video Player (`/video/[id]`):** Embeds `react-youtube`, aggressively hijacking `onStateChange` and `onReady` events to govern client-side position sync.

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js v20+
- A running MySQL Database (Local or Cloud)

### 1. Database Setup (.env configuration)

In the `backend/` directory, create a `.env` file:
```env
PORT=5000
NODE_ENV=development

# MySQL DB
DB_HOST=your_mysql_host
DB_PORT=3306
DB_NAME=lms_db
DB_USER=root
DB_PASSWORD=your_password
DB_SSL=true

# Security
JWT_ACCESS_SECRET=super_secret_access_key
JWT_REFRESH_SECRET=super_secret_refresh_key
CORS_ORIGIN=http://localhost:3000
```

### 2. Running The Backend
```bash
cd backend
npm install
npm run migrate    # Build necessary schema tables
npm run seed       # Insert demo curriculum structure
npm run dev        # Run nodemon dev server on :5000
```

### 3. Running The Frontend
In the `frontend/` directory, create a `.env.local` file:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```
Then start the Vite/Next server:
```bash
cd frontend
npm install
npm run dev
```

---

## 📦 Production Deployment Strategies

**Backend Deployments (Render / Railway):**
- Override `CORS_ORIGIN` to match your frontend's final Vercel string (excluding trailing slashes).
- Ensure `NODE_ENV=production` is set so secure, SameSite=none cookies are deployed smoothly across domains.
- Start Command: `npm install && npm run build` and `npm run start`.

**Frontend Deployments (Vercel):**
- Vercel automatically absorbs Next.js App Router static deployments.
- Build Environment Variables demand `NEXT_PUBLIC_API_BASE_URL` statically pointed to the backend service. It must be present *before* compilation.
