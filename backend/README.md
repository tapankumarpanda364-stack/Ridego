# RideGo — Backend

Node.js/Express REST API for RideGo, backed by SQL Server, secured with JWT.

## Stack

- Express 4
- SQL Server via `mssql` (connection pool in `config/db.js`)
- `bcryptjs` for password hashing, `jsonwebtoken` for auth
- `helmet` + `cors` + `morgan` for baseline hardening/logging

## Setup

```bash
npm install
cp .env.example .env        # fill in your SQL Server credentials + JWT_SECRET
# Run sql/schema.sql against your database to create tables
npm run dev                 # nodemon, or `npm start` for plain node
```

Health check: `GET /api/health` → `{ status: "ok" }`.

## Authentication

- **Passwords** are hashed with bcrypt (10 salt rounds) — plaintext is never stored.
- **Login/registration** return `{ token, user }`. The token is a signed JWT
  (`utils/jwt.js`) carrying `{ id, role }`, expiring per `JWT_EXPIRES_IN`.
- **Every protected route** requires `Authorization: Bearer <token>`.
  `middleware/authMiddleware.js` verifies the signature, then re-checks the
  user against the database on each request (so a suspended/deleted account
  is rejected immediately, not just at token expiry).
- **Role enforcement** is a separate concern (`middleware/roleMiddleware.js`,
  `authorize(...roles)`), composed after `protect` on any route that should
  be restricted — e.g. `router.get("/", protect, authorize("admin"), ...)`.
  This keeps "are you logged in" and "are you allowed to do this" as
  independent, testable layers instead of one tangled check.
- Drivers self-register with `role: "driver"` but only admins can flip a
  vehicle to `verified`, and only verified, online drivers are matched to
  ride requests (`services/driverService.js`).

## Folder structure

Matches the brief, with one addition (`routes/adminRoutes.js`) to expose the
admin console's aggregate list endpoints without duplicating logic already
owned by each resource's own controller:

```
config/db.js            SQL Server connection pool
controllers/             authController, userController, driverController,
                          vehicleController, rideController, paymentController,
                          ratingController
routes/                   one router per controller, plus adminRoutes.js
middleware/               authMiddleware (JWT), roleMiddleware (RBAC),
                          errorMiddleware (404 + centralized error JSON)
services/                 fareService (pricing/surge), driverService (matching)
utils/jwt.js              sign/verify helpers
sql/schema.sql            SQL Server DDL for all tables
server.js                 app wiring + startup
```

## API surface

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/api/auth/register` | — | rider or driver signup |
| POST | `/api/auth/login` | — | returns `{ token, user }` |
| GET | `/api/auth/me` | any | current session's user |
| PATCH | `/api/users/profile` | any | update name/phone |
| POST | `/api/rides/estimate` | rider | fare for all vehicle types |
| POST | `/api/rides` | rider | books a ride, matches nearest driver |
| GET | `/api/rides/:id` | owner/driver/admin | ride detail |
| GET | `/api/rides/history` | rider | past rides |
| PATCH | `/api/rides/:id/cancel` | rider | cancel a live request |
| PATCH | `/api/driver/status` | driver | go online/offline |
| GET | `/api/driver/requests` | driver | rides awaiting this driver's accept |
| PATCH | `/api/driver/rides/:id/accept` | driver | |
| PATCH | `/api/driver/rides/:id/complete` | driver | also records a payment row |
| GET | `/api/driver/earnings?range=` | driver | today / week / month |
| POST | `/api/vehicles` | driver | register a vehicle (unverified) |
| PATCH | `/api/vehicles/:id/verify` | admin | |
| POST | `/api/ratings` | rider | rate a completed ride, rolls into driver avg |
| GET/PATCH | `/api/payments/:rideId` | any | view/update payment method |
| GET | `/api/admin/users` \| `/drivers` \| `/vehicles` \| `/rides` | admin | |

This lines up with the frontend's `src/services/api.js` — its
`VITE_API_BASE_URL` should point at `http://localhost:5000/api`.

## Notes on the mock parts

`services/fareService.js`'s `estimateRoute()` derives a deterministic
distance/duration from the pickup+drop strings so the booking flow works
without a maps API key. Swap it for a real Directions API call (Google/Mapbox)
— keep the same `{ distanceKm, durationMin }` return shape and nothing else
needs to change.
