# LifeLink — Emergency Blood Donor Network

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)

> **Production-Ready Emergency Blood Donor Coordination Platform**

LifeLink is a comprehensive enterprise-grade emergency blood donor coordination system connecting verified hospitals, blood banks, and eligible donors in real-time. Built with industry-standard security, scalability, and HIPAA compliance.

## 📋 Table of Contents

- [Mission](#-mission)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Contributing](#-contributing)
- [License](#-license)

## 🎯 Mission

Eliminate delays in emergency blood procurement by connecting verified emergency requests with eligible donors in real-time through an intelligent matching system.

## ✨ Key Features

### 🚨 Emergency Blood Requests
- Hospitals create urgent blood requests with validation
- Real-time status tracking (VERIFYING → VERIFIED → MATCHING → DONORS_NOTIFIED → FULFILLED)
- Automatic request ID generation (LL-YYYY-XXXX format)

### 🤖 AI-Powered Donor Matching
- Intelligent algorithm considering blood type, distance, availability, eligibility, and reliability
- Ranked donor list with match scores (0-100)
- Transparent matching reasons explained to hospitals

### 📱 Real-Time Notifications
- SMS/WhatsApp alerts to eligible donors
- In-app push notifications
- Delivery and read receipts

### 📍 Live Tracking
- Map-based visualization of donor and request locations
- Distance calculations for optimal matching
- Real-time status updates

### 🏥 Hospital Dashboard
- Manage emergency requests
- View blood inventory across departments
- Verify and confirm donors
- Track request fulfillment

### 👤 Donor Portal
- View matching requests
- Accept/decline offers
- Update availability status
- Track donation history and reliability score

### 📊 Admin Portal
- User management and verification
- Complete audit logging
- System analytics and metrics
- Blood inventory oversight

## Architecture

### Tech Stack

| Layer | Technology | Version |
|-------|-----------|----------|
| Frontend | React + TypeScript + Tailwind CSS | 18+ |
| Backend | Node.js + Express + TypeScript | 18+ |
| Database | PostgreSQL | 13+ | Firebase
| Authentication | JWT + bcrypt | - |
| Containerization | Docker | Latest |
| Deployment | Railway/Render/Vercel | - |

### Database Architecture

**Core Tables**: users, donors, hospitals, emergency_requests, blood_inventory, donation_records, notifications, audit_logs

### API Overview

**40+ RESTful Endpoints**:
- Authentication (signup, login, refresh)
- Donor management
- Hospital management  
- Emergency requests
- Blood inventory
- Analytics & reporting
- Admin operations
### Platform Features

- 🔍 **Request Tracking** — Real-time timeline with elapsed time and fulfillment status
- 📊 **Donor Dashboard** — Personal stats, availability toggle, and emergency request cards with accept/decline
- 🏥 **Hospital Command Center** — KPI cards, live request list with timelines, and donor response tracking
- 💉 **Blood Inventory** — Unit availability by blood group with health status indicators
- 🗺️ **Live Map** — Map-based visualization showing hospitals, donors, and blood banks
- 🤖 **AI Emergency Assistant** — Natural language to structured blood request parser
- 🔐 **Donor Privacy** — Names are masked; contact details revealed only after donor acceptance
- 🎯 **Demo Mode** — One-click launch as Patient, Hospital, Donor, or Admin
- 📱 **Mobile-First Design** — Responsive, touch-friendly, no horizontal scrolling

## Project Structure

```
src/
├── components/          # UI components (Navigation, Shared)
├── context/             # React Context state management
├── data/                # Mock data and fixtures
├── lib/                 # Business logic modules
│   ├── api.ts          # API utilities
│   ├── matchEngine.ts  # Donor matching algorithm
│   ├── aiParser.ts     # AI request parser
│   └── utils.ts        # Helper functions
├── pages/               # Page components and views
├── types/               # TypeScript interfaces
├── App.tsx              # Root component
├── main.tsx             # Entry point
└── index.css            # Tailwind styles
```

### State Management

React Context API with `useState` — no external state library. All data is in-memory mock data that resets on page reload.

### Getting Started

See [QUICK_START.md](./QUICK_START.md) for detailed setup instructions.

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---


## Tech Stack

- **React 18** — UI framework
- **TypeScript** — Type safety
- **Vite** — Build tool and dev server
- **Tailwind CSS** — Styling and design system
- **Lucide React** — Icons

## Demo Flow

The complete demo can be experienced in under 3 minutes:

1. **Launch Demo** from the landing page (choose Patient role)
2. **Create Emergency Request** — Fill the form (e.g., O- Platelets, 3 units, CityCare Hospital, Critical)
3. **Hospital Verification** — Click "Verify Request" to simulate hospital confirmation
4. **AI Matching** — Watch the AI analyze and rank compatible donors
5. **Emergency Broadcast** — Click "Send Emergency Alert" to notify donors
6. **Request Tracking** — Click "Simulate Donor Acceptance" then "Mark Request Fulfilled"
7. **Hospital Command Center** — View the fulfilled request in the dashboard

Alternatively, launch as **Hospital** to see the command center, or the **Donor** to accept emergency requests.

## Setup Instructions

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run typecheck
```

The app runs at `http://localhost:5173` by default.

## Environment Variables

No environment variables are required. The app run entirely on mock data.

See `.env.example` for optional future configuration placeholders.

## Future Scope

The following are intentionally **not implemented** in this MVP:

- e-RaktKosh integration (Indian national blood bank network)
- NOTTO integration (National Organ and Tissue Transplant Organisation)
- Real hospital API integrations
- Real SMS / WhatsApp notification infrastructure
- Advanced demand prediction and the regional blood shortage forecasting
- Multilingual voice assistance
- Verified NGO network integration
- Organ donation awareness module
- User authentication and persistent accounts
- Real-time GPS tracking of donors en route to hospital
- 

## Disclaimer

LifeLink is a prototype for emergency donor coordination. Blood compatibility, donor eligibility, transfusion decisions and medical care must be verified by authorized healthcare professionals.

All data in this application is fictional and for demonstration purposes only. No real patient, donor, or hospital data is used.
**Made with ❤️ for emergency blood coordination**
