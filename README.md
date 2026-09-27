# RideGo

Ola/Uber-style ride booking platform — final-year B.Tech project.

```
RideGo/
├── frontend/   React + Vite (Tailwind, Bootstrap, React Router, Axios)
└── backend/    Node.js + Express REST API (SQL Server, JWT auth)
```

## Quick start

**Backend** (`/backend`):
```bash
cd backend
npm install
cp .env.example .env        # fill in SQL Server credentials + JWT_SECRET
# run sql/schema.sql against your database first
npm run dev                 # http://localhost:5000
```

**Frontend** (`/frontend`):
```bash
cd frontend
npm install
cp .env.example .env        # VITE_API_BASE_URL=http://localhost:5000/api
npm run dev                 # http://localhost:5173
```

Each folder has its own README with full details — endpoint list and auth
design in `backend/README.md`, folder structure and design tokens in
`frontend/README.md`. The two are already wired to match: the frontend's
`services/api.js` calls exactly the routes the backend exposes.
