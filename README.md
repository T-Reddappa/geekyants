# Resource Management System (RMS)

A full-stack resource management system with Manager and Engineer roles.

## Project Structure

```
root/
  backend/    # Node.js, Express,TypeScript, MongoDB
  frontend/   # React, TypeScript, Vite, ShadCN UI
```

---

## Prerequisites

- Node.js (v16+ recommended)
- npm (v8+ recommended)
- MongoDB (local or cloud)

---

## Backend Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```
2. **Configure environment:**
   - Copy `.env.example` to `.env` and set your MongoDB URI and any secrets.
3. **Seed the database (optional):**
   ```bash
   npm run seed
   ```
4. **Start the backend server:**
   ```bash
   npm run dev
   ```
   The backend will run on [http://localhost:5000](http://localhost:5000) by default.

---

## Frontend Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```
2. **Start the frontend dev server:**
   ```bash
   npm run dev
   ```
   The frontend will run on [http://localhost:5173](http://localhost:5173) by default.

---

## Usage

- Visit the frontend URL in your browser.
- Login as a Manager or Engineer (see seed data or registration flow).
- Managers can create projects, assign engineers, and view analytics.
- Engineers can view and edit their profile and see their assignments.

---

## Customization

- Update backend `.env` for database and JWT settings.
- Adjust frontend API URLs in `frontend/src/lib/api.ts` if needed.

---

## Scripts

- **Backend:**
  - `npm run dev` — Start backend in development mode
  - `npm run seed` — Seed the database with sample data
- **Frontend:**
  - `npm run dev` — Start frontend in development mode

---

### 👤 Demo User Credentials

| Role     | Email               | Password    |
| -------- | ------------------- | ----------- |
| Engineer | alice@example.com   | password123 |
| Engineer | raj@example.com     | password123 |
| Engineer | sarah@example.com   | password123 |
| Engineer | dev@example.com     | password123 |
| Manager  | manager@example.com | admin123    |

## License

MIT
