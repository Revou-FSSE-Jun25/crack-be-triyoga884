# Crack BE – Coworking Space Booking API

Backend service for a coworking space booking platform built with NestJS and Prisma.  
It provides authentication, coworking space management, bookings, payments, and statistics APIs.

---

## Tech Stack

- Node.js (TypeScript, ES modules)
- [NestJS](https://nestjs.com/)
- [Prisma](https://www.prisma.io/) + PostgreSQL
- Authentication & Authorization
  - `@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`
  - Role-based access control and custom guards
- Validation & Transformation
  - `class-validator`, `class-transformer`
- Logging
  - `nestjs-pino`, `pino-http`, `pino-pretty`, `pino-roll`
- Testing
  - Jest, Supertest, `@nestjs/testing`
- Tooling
  - ESLint, Prettier, TypeScript

---

## Project Structure

Main directories and modules:

- `src/`
  - `main.ts` – application entrypoint and bootstrap
  - `app.module.ts` – root Nest module
  - `auth/` – authentication (JWT, guards, strategies, controllers, services)
  - `user/` – user management (controllers, services, repositories, DTOs)
  - `coworking-space/` – coworking space CRUD, capacity, images, verification
  - `booking/` – booking logic, create/update DTOs, booking repository
  - `payment/` – payment entities, repository, and business logic
  - `stat/` – statistics and reporting endpoints
  - `prisma/` – Prisma module and service integration
  - `common/`
    - `decorators/` – custom decorators (dates, roles, validators)
    - `guards/` – role and authorization guards
    - `logger/` – logger module setup
    - `types/` – shared types
  - `generated/prisma/` – generated Prisma client code and models
- `prisma/`
  - `schema.prisma` – database schema definition
  - `migrations/` – incremental SQL migrations
  - `seed.ts` – database seeding script
- `package.json` – dependencies, scripts, and Jest configuration

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm (comes with Node)
- PostgreSQL database instance

### Installation

```bash
# Install dependencies
npm install
```

---

## Environment Configuration

Create a `.env` file in the project root with at least:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/database_name?schema=public"

# Server
PORT=3000

# JWT (example names – adjust to your config module)
JWT_ACCESS_TOKEN_SECRET="replace-with-strong-secret"
JWT_ACCESS_TOKEN_EXPIRES_IN="15m"
JWT_REFRESH_TOKEN_SECRET="replace-with-strong-secret"
JWT_REFRESH_TOKEN_EXPIRES_IN="7d"
```

You may have additional environment variables depending on integrations (e.g., third-party payment or storage providers). Check your configuration files and modules for the full list and make sure they are defined here.

---

## Database & Prisma

Run migrations and generate the Prisma client:

```bash
# Apply all migrations to the database
npx prisma migrate deploy

# Generate the Prisma client
npx prisma generate
```

Seed the database (if needed):

```bash
npm run seed
```

This runs:

```bash
ts-node prisma/seed.ts
```

Make sure your `DATABASE_URL` is set before running migrations or seeding.

---

## Running the Application

### Development

```bash
npm run start:dev
```

Starts the NestJS server in watch mode (auto-reload on file changes).

### Regular Run

```bash
npm run start
```

Runs the app in normal (non-watch) mode.

### Production

```bash
# Build TypeScript to JavaScript
npm run build

# Run built app
npm run start:prod
```

---

## Available NPM Scripts

From `package.json`:

- `start` – start the NestJS app
- `start:dev` – start in watch mode
- `start:debug` – start with debug and watch
- `start:prod` – run compiled app from `dist/main`
- `build` – compile TypeScript using Nest CLI
- `format` – format code with Prettier
- `lint` – run ESLint with auto-fix
- `test` – run unit tests
- `test:watch` – run tests in watch mode
- `test:cov` – run tests with coverage
- `test:debug` – run tests with Node inspector
- `test:e2e` – run end-to-end tests
- `seed` – run Prisma seed script

---

## Testing

Run the full unit test suite:

```bash
npm test
```

Other test commands:

```bash
# Watch mode
npm run test:watch

# Coverage report
npm run test:cov

# Debug tests
npm run test:debug

# End-to-end tests
npm run test:e2e
```

Jest is configured in `package.json` under the `jest` field to look for `*.spec.ts` files inside `src/`.

---

## Core Modules Overview

- **Auth Module (`src/auth/`)**
  - Handles user login/registration and JWT-based authentication.
  - Uses custom JWT strategy and guards for protected routes.
  - Integrates with roles decorators and guards for authorization.

- **User Module (`src/user/`)**
  - Manages user entities and profiles.
  - Exposes CRUD and profile-related endpoints via controller.
  - Uses a repository layer for database access through Prisma.

- **Coworking Space Module (`src/coworking-space/`)**
  - CRUD operations for coworking spaces (name, address, capacity, images).
  - Handles ownership, is_active, and is_verified flags.
  - Uses custom DTOs for create/update operations.

- **Booking Module (`src/booking/`)**
  - Booking creation and management (start/end date, blocked times).
  - Uses date decorators and validators from `src/common/decorators`.
  - Integrates with CoworkingSpace and User models in Prisma.

- **Payment Module (`src/payment/`)**
  - Manages payment records associated with bookings.
  - Uses Prisma models and repository for persistence.
  - Recent migrations indicate evolving payment model (status, transaction references, etc.).

- **Stat Module (`src/stat/`)**
  - Exposes statistics endpoints (e.g., bookings, revenue, occupancy).
  - Relies on data aggregated via Prisma queries.

- **Prisma Module (`src/prisma/`)**
  - Wraps Prisma client in a NestJS provider.
  - Centralizes database access patterns across modules.

- **Common Module (`src/common/`)**
  - Reusable decorators, guards, logger, and shared types.
  - Provides cross-cutting concerns like logging and authorization checks.

---

## Logging

Logging is built using `nestjs-pino` and related packages:

- Structured JSON logs in production.
- Human-readable logs in development using `pino-pretty`.
- Log rotation via `pino-roll` when configured.

Check `src/common/logger/logger.module.ts` for exact configuration and to adjust log levels or destinations.

---

## Code Quality

- Linting: `npm run lint`
- Formatting: `npm run format`

The project uses:

- ESLint (`eslint`, `@eslint/js`, `typescript-eslint`)
- Prettier (`prettier`, `eslint-config-prettier`, `eslint-plugin-prettier`)

Configure rules and formatting preferences in the respective config files.

---

## Live Demo

Check out the live demo of the application:

- **URL**: [https://workbase.up.railway.app](https://workbase.up.railway.app)
