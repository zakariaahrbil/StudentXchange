# StudentXchange

A full-stack app for students to exchange skills and earn credits.

## Stack
- Frontend: Next.js
- Backend: Spring Boot
- Database: PostgreSQL
- Auth: JWT

## Project structure
- `frontend/` — web application
- `backend/` — API server

## Run the frontend
```bash
cd frontend
pnpm install
pnpm dev
```

Open: http://localhost:3000

## Run the backend
```bash
cd backend
./mvnw spring-boot:run
```

## Environment notes
- Make sure PostgreSQL is running
- Configure database settings in `backend/src/main/resources/application.properties`

## Basic usage
- Sign up or log in from the frontend
- Use the app to create a profile and exchange skills
