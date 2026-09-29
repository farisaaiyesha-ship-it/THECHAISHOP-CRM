# THECHAISHOP&CO CRM

A complete starter CRM application for THECHAISHOP&CO.

## Features
- Login authentication (demo account)
- Dashboard with CRM statistics
- Customer management: create, edit, delete, search
- Lead management with status tracking
- Order management
- Task/follow-up management
- Responsive modern UI
- REST API using Express
- Persistent JSON data store (easy to replace with PostgreSQL later)

## Demo login
Email: admin@thechaishop.co
Password: admin123

## Requirements
- Node.js 18+
- npm 9+

## Run backend
```bash
cd backend
npm install
npm run dev
```

API runs at http://localhost:5000

## Run frontend
Open another terminal:
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at http://localhost:5173

## Production build
```bash
cd frontend
npm run build
```

The frontend is configured to use `VITE_API_URL` if supplied; otherwise it uses http://localhost:5000/api.

## Project structure
- frontend: React + Vite
- backend: Node.js + Express
- backend/data/db.json: local persistent data
