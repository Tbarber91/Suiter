# SUITER — AI Business Operating System & Marketplace
## Production Readiness, Multi-Platform Deployment & Architecture Specification

---

### 1. Executive Summary & Architecture Overview
**SUITER** is a high-performance commercial marketplace, fleet rewards, instant booking, and advertising management operating system.

- **Frontend & Build Engine:** Next.js (App Router) + React 19 + Tailwind CSS + Base UI primitives.
- **Persistence & Realtime Storage:** Google Cloud Firestore (`ai-studio-6af02fc1-cf84-449c-9a75-286145932ae3`) + Firebase Authentication with email/password and federated Google sign-in.
- **Messaging Subsystem:** End-to-end synchronized in-app messaging engine with unread pulses, active/archived conversation states, and listing-context linkage.
- **Search & Discovery Engine:** Multi-attribute filtering (keyword, radius, location, price, rating, category) with real-time sorting by relevance, date, and price.

---

### 2. Multi-Platform Support (iOS, Android, Windows & Own Server)

#### A. Web & Dedicated Self-Hosted Server Deployment
```bash
# Production Build & Launch
npm run build
npm run start
```
- Listens on `0.0.0.0:3000` with containerized reverse proxy (Nginx, Traefik, or Caddy) handling TLS termination and HSTS security headers.
- Health endpoint ready at `/` with static page pre-rendering.

#### B. Progressive Web Application (iOS & Android Installation)
- Manifest configured for standalone fullscreen execution on iOS Mobile Safari and Android Chrome.
- Responsive breakpoints tailored for mobile viewport bounds (iPhone dynamic island safe areas, iPad split view, high-DPI desktop displays).

#### C. Native Wrapper Options (Capacitor / Electron)
- **iOS & Android:** Ready for `@capacitor/core` and `@capacitor/cli` wrapping with zero DOM alterations.
- **Windows Desktop:** Compatible with Tauri or Electron for packaged `.msi` / `.exe` releases.

---

### 3. Core Feature Verifications

1. **User Authentication & Profile System:**
   - **Sign Up / Login / Password Reset:** Native dialog with instant role presets (Trade Specialist, LMVD Certified Auto Dealer, Retail Merchant, Professional Services) and Firebase `sendPasswordResetEmail`.
   - **Profile Customization:** Username, avatar upload with auto-fallback, professional bio, direct contact phone, operational location, trade skills, and service offerings.

2. **Secure In-App Messaging System:**
   - Real-time updates via Firestore snapshot listeners.
   - Distinct **Active** and **Archived** conversation views with instant toggling.
   - Direct connection from marketplace cards ("Message Seller") with prefilled item titles.

3. **Advanced Marketplace Search & Filtering:**
   - Text search across title, description, category, business name, address, and phone number.
   - Price range filters (preset brackets + min/max numeric constraints).
   - Geographic filter presets for Adelaide CBD, North Adelaide, Norwood & Burnside, Unley, and Glenelg.
   - Proximity radius filter (5 km to 50 km).
   - Multi-mode sorting: Relevance, Price (Ascending/Descending), Date Posted, and Star Rating.
