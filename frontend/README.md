# RideGo — Frontend

Ola/Uber-style ride booking platform. React + Vite frontend, built to talk to
an Express.js REST API secured with JWT.

## Stack

- React 18 + Vite
- Tailwind CSS (custom design tokens) + Bootstrap (base resets/utilities)
- React Router v6
- Axios (with JWT interceptor and 401 auto-logout)
- Context API for auth + active-ride state

## Getting started

```bash
npm install
cp .env.example .env   # point VITE_API_BASE_URL at your Express API
npm run dev
```

## Folder structure

```
src/
├── components/   Shared UI: Navbar, Footer, RideCard, DriverCard, Map,
│                 LocationInput, FareCard, Loader
├── pages/        Rider-facing routes: Home, Login, Register, BookRide,
│                 RideDetails, RideHistory, Profile
├── driver/       Driver-facing routes: Dashboard, RideRequests, ActiveRide,
│                 Earnings
├── admin/        Admin console: Dashboard, Users, Drivers, Vehicles, Rides
├── services/     api.js — axios instance + endpoint wrappers
├── context/      AuthContext, RideContext
├── App.jsx       Routes + role-based ProtectedRoute
└── main.jsx      Entry point
```

## Backend contract

The frontend expects these endpoints from the Express API (adjust `services/api.js`
if your routes differ):

- `POST /auth/login`, `POST /auth/register`, `GET /auth/me`
- `POST /rides/estimate`, `POST /rides`, `GET /rides/:id`, `GET /rides/history`, `PATCH /rides/:id/cancel`
- `GET /driver/requests`, `PATCH /driver/rides/:id/accept`, `PATCH /driver/rides/:id/complete`, `GET /driver/earnings`
- `GET /admin/users`, `GET /admin/drivers`, `GET /admin/vehicles`, `GET /admin/rides`

Every response that includes a JWT should return it as `{ token, user }` so
`AuthContext` can store it and attach it to subsequent requests.

## Design notes

Palette: paper `#F6F4EF`, ink `#16211B`, marigold `#FFB100` (accent, evokes the
auto-rickshaw/road-marking vernacular), route `#0F6E5D` (trust/"go" signal),
alert `#C1443B`. Headings in Space Grotesk, body in Inter. The dashed "lane"
divider under the navbar and footer nods to road lane markings, echoed in the
Map placeholder component — swap that SVG for Mapbox/Google Maps/Leaflet once
API keys are wired up on the backend.

The `Map` component is a stylized placeholder (no external map SDK is wired
in yet) so the app runs with zero API keys out of the box.
