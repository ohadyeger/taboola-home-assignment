# Full-Stack Boilerplate: React + Spring Boot + ClickHouse

This repository contains a minimal full-stack setup suitable for a home assignment. It includes:

- React (Vite) frontend
- Spring Boot backend (Java 17)
- ClickHouse database
- Docker Compose to run everything locally with one command

## Prerequisites

- Docker and Docker Compose
- (Optional) Java 17 and Node.js 18+ if you want to run parts outside Docker

## Quick Start (Docker)

1. Clone the repo
2. From the project root, run:

```bash
docker compose up --build
```

Services will start:
- ClickHouse: `http://localhost:8123`
- Backend (Spring Boot): `http://localhost:8080`
- Frontend (React served by Nginx): `http://localhost:3000`

Visit the frontend at `http://localhost:3000`. It provides ad metrics analytics with authentication and aggregation features.

## Project Structure

```
backend/       # Spring Boot app
frontend/      # React + Vite app
db/init.sql    # ClickHouse schema + seed data
docker-compose.yml
```

## Backend

- Build: `mvn -f backend/pom.xml -DskipTests package`
- Run locally:

```bash
export DB_URL=jdbc:clickhouse://localhost:8123/appdb
export DB_USERNAME=default
export DB_PASSWORD=
export SERVER_PORT=8080
export CORS_ORIGIN=http://localhost:5173
mvn -f backend/pom.xml spring-boot:run
```

API:
- `GET /api/ads/my` → returns ad metrics for authenticated user
- `POST /api/aggregate` → returns aggregated ad metrics data
- `POST /auth/login` → user authentication
- `POST /auth/register` → user registration

## Frontend

- Dev: from `frontend/`:

```bash
npm install
VITE_API_URL=http://localhost:8080 npm run dev
```

Open `http://localhost:5173`.

## Environment Variables

- Backend:
  - `DB_URL` (default in compose: `jdbc:clickhouse://clickhouse:8123/appdb`)
  - `DB_USERNAME` (default: `default`)
  - `DB_PASSWORD` (default: empty)
  - `SERVER_PORT` (default: `8080`)
  - `CORS_ORIGIN` (default: `http://localhost:3000`)
- Frontend:
  - `VITE_API_URL` (default in compose: `http://localhost:8080`)

## Testing Users

The application includes mock data for testing pagination and authentication. The following users are automatically created:

### Admin User
- **Email**: `admin@example.com`
- **Password**: `admin123`
- **Access**: Full access to all metrics (admin privileges)

### Test Users
- **Email**: `user1@example.com` | **Password**: `password123`
- **Email**: `user2@example.com` | **Password**: `password123`
- **Email**: `user3@example.com` | **Password**: `password123`
- **Email**: `user4@example.com` | **Password**: `password123`
- **Email**: `user5@example.com` | **Password**: `password123`
- **Email**: `user6@example.com` | **Password**: `password123`
- **Email**: `user7@example.com` | **Password**: `password123`
- **Email**: `user8@example.com` | **Password**: `password123`
- **Email**: `user9@example.com` | **Password**: `password123`
- **Email**: `user10@example.com` | **Password**: `password123`

**Note**: All test users have the same password (`password123`) for convenience during testing.

## Mock Data

The application includes comprehensive mock data for testing:
- **150+ AdMetrics records** across various campaigns, countries, platforms, and browsers
- **Multiple user accounts** for testing different user scenarios

## Notes

- ClickHouse is initialized from `db/init.sql` with ad metrics tables and seed data.
- CORS is enabled for local development; configure via `CORS_ORIGIN`.
- Mock data is automatically loaded from CSV files via the Java StartupSeeder.

## Common Commands

```bash
# Rebuild everything
docker compose build --no-cache

# Stop and remove containers
docker compose down -v
```


