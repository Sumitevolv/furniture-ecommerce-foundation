# Fauteuil & Co. — Furniture E-Commerce Platform

A production-ready foundation for a full-stack furniture e-commerce
application: Next.js/TypeScript storefront, ASP.NET Core Web API backend,
PostgreSQL, JWT auth, Razorpay payments, Cloudinary/S3 storage, OpenAI-powered
design assistant, and SignalR real-time architecture.

```
furniture-ecommerce/
├── frontend/   Next.js 16 + TypeScript + Tailwind CSS + Framer Motion
└── backend/    ASP.NET Core 8 Web API + EF Core + PostgreSQL
```

## Quick start

### 1. Backend

```bash
cd backend
cp .env.example .env               # fill in real values (see below)
dotnet restore
dotnet tool install --global dotnet-ef
dotnet ef migrations add InitialCreate --output-dir Migrations
dotnet ef database update
dotnet run
```

The API listens on `http://localhost:5000` by default, with Swagger UI at
`/swagger` in Development. `GET /api/health` is a good smoke test.

> **Note:** this environment could not reach `api.nuget.org` to run
> `dotnet restore`/`dotnet build`, so the backend has been reviewed for
> compile-correctness by hand but not machine-verified. Run the commands
> above in an environment with NuGet access to confirm a clean build before
> deploying.

### 2. Frontend

```bash
cd frontend
cp .env.example .env.local         # NEXT_PUBLIC_API_BASE_URL etc.
npm install
npm run dev
```

The app runs on `http://localhost:3000`. Verified in this environment:
`npm run build`, `npx tsc --noEmit`, and `npx eslint . --max-warnings=0` all
pass cleanly.

## What's implemented in this foundation

- **Design system**: warm ivory/cream/sand/walnut/charcoal/black palette
  with a muted bronze accent, serif headings + sans body text, explicit
  breakpoints from 360px to 1920px+.
- **18 reusable UI primitives** (Button, Input, Select, Modal, Drawer, Card,
  Badge, Tabs, Dropdown, Toast, Skeleton, Tooltip, Dialog, Carousel,
  Pagination, Breadcrumb, Rating, PriceDisplay) plus layout, product, cart,
  auth, admin, and AI feature components.
- **Backend architecture**: layered Controllers → Services → Repositories →
  EF Core, with DTOs, FluentValidation, JWT auth (access + rotating refresh
  tokens), a global exception-handling middleware, and Configuration classes
  for every external integration — no secrets hardcoded anywhere.
- **Integrations** wired end-to-end at the architecture level: Razorpay
  (order creation + signature verification), Cloudinary/S3 (swappable
  storage provider), OpenAI (server-side only — the frontend never sees the
  API key), and SignalR (a notification hub ready for order-status and
  stock-alert events).
- **Cross-cutting concerns**: global error boundary, 404 page, loading
  skeletons, toast system, SEO metadata builder, accessibility basics (skip
  link, focus rings, aria labels).

## What's intentionally left for the next phase

- Real product images/catalog data (the homepage uses clearly-isolated
  placeholder data in `frontend/lib/placeholder-data.ts`)
- Full admin CRUD screens (the admin sidebar/layout scaffold is in place)
- Email delivery for password reset
- The initial EF Core migration (generate it per the instructions above)
- CI/CD, Dockerfiles, and deployment configuration

## Environment variables

Both `frontend/.env.example` and `backend/.env.example` document every
required variable. No database credentials, JWT secrets, Razorpay keys, AI
API keys, or storage credentials are hardcoded anywhere in the codebase —
they're all read from configuration/environment at runtime.
