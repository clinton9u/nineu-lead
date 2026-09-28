# NineU Lead

NineU Lead is a SaaS-style lead-to-customer automation platform for modern businesses. This repo contains a working MVP for a business website chat flow and an internal business dashboard. The demo business is Luma Aesthetics, but the architecture is designed to support many industries.

## Features

- Customer-facing chat workflow for lead capture
- Lead qualification: HOT, WARM, COLD
- Recommended next action generation
- Persistent storage with PostgreSQL
- Business dashboard with lead metrics and status updates
- Booked/paid conversion flow
- Revenue tracking based on business payments

## Tech stack

- Backend: Node.js + Express
- Database: PostgreSQL
- ORM: Prisma
- Frontend: React + Vite

## Directory structure

```bash
backend/
frontend/
README.md
.gitignore
```

## Local setup

1. Install PostgreSQL and create a database called `nineu_lead`
2. Copy `backend/.env.example` to `backend/.env`
3. Update your PostgreSQL connection string
4. In `backend`, run:
   ```bash
   npm install
   npx prisma migrate dev --name init
   npm run seed
   npm run dev
   ```
5. In `frontend`, run:
   ```bash
   npm install
   npm run dev
   ```
6. Open `http://localhost:5173`

## Demo workflow

1. Open the Luma Aesthetics website section
2. Start the chat flow
3. Capture name, service, and preferred date
4. Submit the lead
5. Review the business dashboard
6. Mark the lead booked and then paid
7. Confirm conversion status and revenue update

## Notes

- Customer payments belong to the business, not NineU Lead
- This MVP keeps the architecture industry-agnostic and is intentionally focused on a working end-to-end lead workflow
