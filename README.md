# OnlyStartups Procurement Mechanism - Frontend

This repository contains the frontend monorepo for the **Startup Friendly Public Procurement Mechanism**, a solution designed to enable government departments to identify, pilot, procure, and scale innovative solutions from eligible startups.

## 📝 Problem Statement

**Organization:** Government Of Maharashtra  
**Department:** Maharashtra State Innovation Society, Department of Skills, Employment, Entrepreneurship and Innovation  
**Problem Statement ID:** 26136

**Description:**
Government departments often face operational problems that could benefit from innovative startup solutions, but conventional procurement processes are generally designed for standardized goods and established vendors. Departments may find it difficult to formulate outcome-based problem statements, discover suitable startups, evaluate novel technologies, structure controlled pilots, manage intellectual property, and measure pilot results. Startups may struggle with prior-turnover requirements, long sales cycles, and unclear payment milestones.

**Expected Solution / Outcome:**
A structured end-to-end mechanism for challenge identification, startup discovery, eligibility screening, expert evaluation, pilot design, milestone-based contracting, and scale-up decisions. The system provides standard templates, evaluation criteria, and procurement pathways to ensure faster discovery, reduced departmental risk, and evidence-based procurement decisions.

## 🏗️ Architecture & Tech Stack

This frontend is structured as a **Turborepo** containing multiple Next.js applications:
- **`apps/web`**: Public-facing platform for startups and general exploration.
- **`apps/admin`**: Administrative dashboard for government officials and platform moderators.
- **`apps/startuphub`**: Dedicated portal for startup hubs and incubators to manage and track programs.

**Tech Stack:**
- Framework: [Next.js](https://nextjs.org/) (React)
- Styling: [Tailwind CSS](https://tailwindcss.com/)
- Monorepo Management: [Turborepo](https://turbo.build/)
- Authentication: Custom NextAuth / JWT implementation

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- npm

### 2. Installation
Navigate to the root of the frontend directory and install dependencies:
```bash
npm install
```

### 3. Environment Variables
Copy the `.env.sample` into each app directory (`apps/web/.env`, `apps/admin/.env`, `apps/startuphub/.env`) and update the values with your actual API URLs and Supabase keys.

### 4. Running Locally
To start the development server for all apps simultaneously:
```bash
npm run dev
```
By default, the apps will run on:
- Web: `http://localhost:3000`
- Admin: `http://localhost:3002`
- Startup Hub: `http://localhost:3003`

### 5. Build and Lint
To check for code formatting and build the production bundle:
```bash
npm run lint
npm run build
```