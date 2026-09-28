# NineU Lead - Lead-to-Customer Automation Platform

A comprehensive lead management and automation platform for businesses to capture, qualify, and convert customer leads.

## Architecture Overview

**NineU Lead** is built as a multi-tenant SaaS platform with a clean separation of concerns:

- **Backend**: Node.js/Express with PostgreSQL database
- **Frontend**: React with TypeScript for the business dashboard
- **Lead Capture**: Embedded chat widget for customer conversations
- **API**: RESTful API for all business logic

## Key Features (MVP)

1. **Customer Conversation Flow**
   - Chat interface on business website
   - Collects customer name, service interest, and timeline
   - Stores lead data persistently

2. **Lead Management**
   - Automatic qualification (HOT/WARM/COLD)
   - Recommended next actions
   - Business dashboard with lead overview

3. **Lead Dashboard**
   - View all leads with detailed information
   - Update lead status (Booked/Paid)
   - Key metrics (total, hot, booked, converted leads, revenue)

## Project Structure

```
nineu-lead/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── config/         # Database & environment config
│   │   ├── models/         # Database models (Sequelize ORM)
│   │   ├── routes/         # API endpoints
│   │   ├── controllers/    # Business logic
│   │   ├── middleware/     # Authentication, validation
│   │   └── utils/          # Helpers
│   ├── migrations/         # Database migrations
│   └── package.json
├── frontend/               # React dashboard
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API client
│   │   └── App.tsx
│   └── package.json
├── widget/                 # Embedded chat widget
│   ├── src/
│   │   ├── components/     # Chat UI
│   │   └── index.tsx
│   └── package.json
└── docs/                   # Setup and testing documentation
```

## Getting Started

See `docs/setup.md` for installation and local development instructions.

## Testing the Workflow

See `docs/testing.md` for complete customer-to-business workflow testing guide.

## Design Philosophy

- **Industry Agnostic**: Core architecture supports any service-based business
- **Luma Aesthetics First**: Medical spa serves as the initial test business
- **Tenant-Ready**: Multi-tenant from the start (easily extensible)
- **Data Ownership**: Business owns customer data and payments
- **Focus on MVP**: Lean feature set focused on the core lead workflow
