<div align="center">
  <img src="https://img.shields.io/badge/NeoPay_App-Mobile_Wallet-blue?style=for-the-badge&logo=appveyor" alt="NeoPay App Logo">
  <h1>📱 NeoPay App</h1>
  <p><strong>Next-Generation Digital Wallet & Mobile Payment Solution</strong></p>

  [![React Native](https://img.shields.io/badge/React_Native-0.81.5-61dafb.svg?style=flat-square&logo=react)](https://reactnative.dev/)
  [![Expo](https://img.shields.io/badge/Expo-54.x-black.svg?style=flat-square&logo=expo)](https://expo.dev/)
  [![Node.js](https://img.shields.io/badge/Node.js-24.x-green.svg?style=flat-square&logo=node.js)](https://nodejs.org/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-blue.svg?style=flat-square&logo=postgresql)](https://neon.tech/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

  <p>
    <a href="#-overview">Overview</a> •
    <a href="#-key-features">Key Features</a> •
    <a href="#-technology-stack">Tech Stack</a> •
    <a href="#-system-architecture">Architecture</a> •
    <a href="#-getting-started">Setup</a> •
    <a href="#-api-reference">API</a>
  </p>
</div>

---

## 📖 Overview

**NeoPay App** is a cutting-edge fintech mobile wallet application designed to offer a completely frictionless financial experience. Built from the ground up utilizing the power of **React Native (Expo)** on the frontend and a scalable **Node.js/Express** backend, NeoPay serves as a comprehensive hub for all your digital banking needs.

With a strong emphasis on security, speed, and user experience, the application seamlessly handles digital card management, money transfers, bill payments, and transaction tracking. Enhanced with **native biometric authentication** (Fingerprint & Face ID) and a beautifully crafted UI that intelligently adapts to your device's theme settings, NeoPay delivers an enterprise-level banking experience right to your fingertips.

---

## ✨ Key Features

- **🔐 Uncompromised Security & Authentication**
  - **Native Biometric Login:** Support for Fingerprint and Face ID via `expo-local-authentication`.
  - **Encrypted Storage:** Utilizing `expo-secure-store` for hardware-level encryption of JWTs and biometric tokens.
  - **Robust Backend Verification:** Powered by `bcryptjs` (12 rounds) and robust Zod validation.

- **💳 Advanced Card & Wallet Management**
  - Visualize and manage multiple digital Visa and Mastercard cards.
  - Interactive UI for locking/unlocking cards instantly for fraud prevention.
  - Track card-specific balances and aggregate total wealth.

- **💸 Comprehensive Financial Operations**
  - **Instant Transfers:** Send money directly to contacts with personalized, optional notes.
  - **Seamless Top-ups:** Add funds via bank transfer, debit card, or external digital wallets.
  - **Utility Bill Payments:** Integrated payment gateway for electricity, gas, water, internet, and mobile recharges.

- **📊 Intelligent Analytics & Notifications**
  - **Transaction History:** Deep dive into spending habits with categorized breakdowns (Shopping, Food, Transport, etc.).
  - **Real-time Notifications:** In-app toast notifications for incoming transfers and vital alerts.

- **🎨 Premium UI/UX**
  - Fluid, hardware-accelerated animations using **React Native Reanimated**.
  - Dynamic **Dark / Light Theme** that automatically aligns with device preferences, along with a manual override.
  - Multi-currency display capabilities.

---

## 🛠 Technology Stack

### Mobile Frontend (React Native & Expo)
| Technology | Purpose |
|---|---|
| **React Native (0.81.5)** | Core cross-platform mobile framework. |
| **Expo (~54.0)** | Streamlined development, native module bridging, and build platform. |
| **Expo Router (~6.0)** | Next-gen, file-based routing and navigation. |
| **TypeScript (~5.9)** | Ensuring robust, type-safe codebases. |
| **TanStack React Query** | Optimized server data fetching, caching, and state synchronization. |
| **React Native Reanimated** | Silky smooth, 60fps native animations. |

### Backend API Server
| Technology | Purpose |
|---|---|
| **Node.js (v24) & Express.js** | High-performance, asynchronous RESTful API runtime. |
| **Drizzle ORM** | Type-safe, blazing-fast SQL database querying. |
| **PostgreSQL (Neon)** | Cloud-native, scalable relational database. |
| **Zod** | Schema declaration and rigorous API input validation. |
| **JWT & bcryptjs** | Industry-standard stateless authentication and cryptographic hashing. |
| **Pino** | Ultra-fast, structured backend logging. |

### Infrastructure & Deployment
- **Database Hosting:** [Neon](https://neon.tech/) (Serverless Postgres)
- **Backend Deployment:** [Railway](https://railway.app/)
- **Mobile Builds & OTA:** Expo Application Services (EAS)

---

## 🏗 System Architecture & Project Structure

The project leverages a robust monorepo-style structure utilizing `pnpm` workspaces to cleanly separate the frontend, backend, and shared libraries.

```text
NeoPay App/
├── artifacts/
│   ├── api-server/          ← Backend Service (Node.js + Express)
│   │   ├── src/routes/      ← Modular API endpoint handlers (Auth, Cards, Transactions)
│   │   ├── src/app.ts       ← Express app configuration
│   │   └── lib-db/schema/   ← Drizzle ORM Database Schema Definitions
│   │
│   └── mobile/              ← Mobile Frontend (React Native + Expo)
│       ├── app/             ← Expo Router file-based screens (Tabs, Modals, Auth)
│       ├── components/      ← Reusable, styled UI components
│       ├── contexts/        ← Global State Management (Auth, Wallet, Theme)
│       └── lib/             ← Typed API clients and utilities
│
├── lib/                     ← Shared Packages (Types, DB Configurations, API Zod Schemas)
└── scripts/                 ← Build utilities and database synchronization scripts
```

---

## 🗄️ Database Schema Architecture

The relational architecture is optimized for financial tracking and user security.

- **Users Table:** Manages core identities, encrypted passwords, and biometric enrollment flags along with secure, 40-byte hex biometric tokens.
- **Cards Table:** Links directly to users. Tracks card types, masked numbers, dynamic UI gradient colors, balances, and security lock states.
- **Transactions Table:** A robust ledger tracking amounts (positive for income/top-up, negative for expenses), categorization metadata, recipient details, and timestamping.

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ required, v24 recommended)
- [pnpm](https://pnpm.io/) package manager (`npm install -g pnpm`)
- [Expo Go](https://expo.dev/go) installed on your physical mobile device, or a configured Android/iOS emulator.

### 1. Clone & Install
```bash
git clone https://github.com/Ahmadyousaf57/NeoPay-App.git
cd "NeoPay App"

# Install all workspace dependencies
pnpm install
```

### 2. Environment Configuration
Ensure your root `.env` file is properly configured. A template looks like:

```env
PORT=3000
SESSION_SECRET=your_super_secure_session_secret
DATABASE_URL=postgresql://your_neon_db_connection_string
EXPO_PUBLIC_API_URL=http://your_local_ip_address:3000
```
> **Note for Physical Devices:** If testing on a physical phone, `EXPO_PUBLIC_API_URL` **must** be set to your computer's local network IP address (e.g., `192.168.x.x`), not `localhost`.

### 3. Spin Up the Backend Server
```bash
cd artifacts/api-server
pnpm run dev
```
*The API server will boot up and listen on `http://localhost:3000`.*

### 4. Launch the Mobile Application
Open a new terminal window:
```bash
cd artifacts/mobile
npm run dev
```
From the Expo CLI, press:
- `a` to open in an **Android Emulator**
- `i` to open in an **iOS Simulator**
- Or **Scan the QR Code** using the Expo Go app on your physical device.

---

## 🔌 API Reference

### Core Endpoints
- **Authentication:**
  - `POST /api/auth/signup` - Register a new user
  - `POST /api/auth/login` - Standard email/password login
  - `POST /api/auth/biometric-enroll` & `biometric-login` - Hardware authentication flows
- **Financial Data:**
  - `GET /api/cards` - Retrieve all registered digital cards
  - `GET /api/transactions` - Fetch transaction ledger (supports pagination and date filtering)
  - `POST /api/transactions/transfer` - Initiate a secure P2P transfer
  - `POST /api/transactions/bill` - Process a utility payment

*(All data endpoints are protected via Bearer JWT authorization.)*

---

## 🔐 Deep Dive: Biometric Authentication Flow

NeoPay employs a multi-tiered security model for seamless yet secure logins:
1. **Enrollment:** After a successful password login, the user activates biometrics. The server generates a unique **40-byte hex token** saved both in the Postgres database and the device's hardware-encrypted `SecureStore`.
2. **Execution:** On subsequent app launches, the native OS prompts for Fingerprint/Face ID.
3. **Verification:** Upon successful biometric scan, the app retrieves the hex token and securely exchanges it with the backend for a fresh JWT session token.

---

## 🏗️ Production Builds

Ready to deploy? NeoPay utilizes Expo Application Services (EAS) for seamless cloud builds.

```bash
cd artifacts/mobile

# Build Android APK/AAB
npx eas build --platform android

# Build iOS IPA
npx eas build --platform ios

# Over-The-Air (OTA) Updates (Push fixes instantly without app store review)
npx eas update --branch production --message "Hotfix: Improved transaction rendering"
```

---

## 👤 Author & License

This project was developed by **Ahmad Yousaf** as an advanced Mobile Application Development academic project. It showcases enterprise-level patterns in React Native, backend API design, and secure financial data handling.

<div align="center">
  <br>
  <i>Empowering seamless transactions with NeoPay.</i>
</div>
