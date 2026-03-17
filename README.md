# Info Systems Building Management

A high-fidelity building management system designed for tenants and administrative managers. This platform streamlines interaction between building residents and management through features like maintenance reporting, suggestion voting, and announcement distribution.

---

## 🚀 Tech Stack

- **Frontend:** Angular 21 (with Tailwind CSS, RxJS, Leaflet)
- **Backend:** Node.js (Express)
- **Database & Auth:** Supabase (PostgreSQL)
- **Monorepo Manager:** pnpm Workspaces
- **Deployment:** Docker / Railway

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (LTS Recommended)
2. **pnpm** (`npm install -g pnpm`)
3. **Docker & Docker Compose** (Required for containerized setup)
4. **Supabase CLI** (Required for database type generation)

---

## 📂 Project Structure

```text
├── apps
│   ├── backend-node        # Express server
│   └── frontend-angular    # Angular web application
├── packages
│   ├── domain              # Shared Entities, DTOs, and Interfaces
│   ├── supabase            # Shared Supabase clients
│   └── types               # Generated Database Types
└── supabase                # Local Supabase configurations & migrations
```

---

## ⚙️ Environment Configuration

Ensure you have a `.env` file in the root directory. You can use the following template (rely on your specific Supabase credentials):

```ini
PORT=3000
BACKEND_URL=http://localhost:3000
SUPABASE_URL=YOUR_SUPABASE_URL
SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

---

## 💻 Local Development

1. **Install Dependencies:**
   ```bash
   pnpm install
   ```

2. **Generate Database Types:**
   If you have a local Supabase instance running (or point to a remote URL in `package.json`):
   ```bash
   pnpm run types:generate
   ```

3. **Start the Development Servers:**
   - **Backend:** `pnpm run dev:backend` (Runs on port 3000 by default)
   - **Frontend:** `pnpm run dev:frontend` (Runs on port 4200 by default)

---

## 🐳 Docker Setup

To run the entire stack (Frontend + Backend) in containers:

1. **Build and Run:**
   ```bash
   docker-compose up --build
   ```

- **Frontend:** Accessible at [http://localhost:4200](http://localhost:4200)
- **Backend:** Accessible at [http://localhost:3000](http://localhost:3000)

---

## 📋 Features

- **Resident Verification:** Manager approval queue for new tenants.
- **Announcement Center:** Create building-wide events and informational alerts.
- **Suggestion System:** Tenants can submit ideas and vote on their community's progress.
- **Malfunction Management:** Report issues with photos and track repairs in real-time.
- **Building QR:** Generate secure registration gateways for residents.
- **Expense Tracking:** Manage rent and utility payments for residents.
- **Analytics:** Real-time metrics on building occupancy and maintenance efficiency.
