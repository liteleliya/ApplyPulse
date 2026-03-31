# ApplyPulse 🚀

**Career CRM & Placement Tracker for Students**

A professional web application that automates job application tracking, manages multiple resume versions, and provides data-driven insights into your recruitment funnel.

![ApplyPulse Banner](https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green?style=for-the-badge&logo=supabase)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Database Setup](#database-setup)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Documentation](#documentation)

---

## ✨ Features

### Core Features
- **📊 Kanban Board**: Drag-and-drop interface to visualize your application pipeline
- **📝 Application Management**: Track companies, roles, status, referrals, and notes
- **📄 Resume Mapping**: Upload multiple resume versions and map them to specific applications
- **📅 Interview Tracking**: Schedule interviews with preparation and post-interview notes
- **📈 Analytics Dashboard**: Visualize your recruitment funnel with conversion metrics
- **🤖 Intelligence Layer**: Mock Gmail API integration for auto-populating applications (demo)

### Technical Highlights
- **🔐 Secure Authentication**: Powered by Supabase Auth
- **🎨 Modern UI**: Built with Shadcn/UI and Tailwind CSS
- **⚡ Real-time Updates**: Supabase subscriptions for live data
- **📱 Responsive Design**: Mobile-first approach
- **🔍 Type Safety**: Full TypeScript coverage with Zod validation

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn/UI](https://ui.shadcn.com/)
- **Drag & Drop**: [@hello-pangea/dnd](https://github.com/hello-pangea/dnd)

### Backend & Database
- **Backend**: [Supabase](https://supabase.com/) (PostgreSQL + Auth)
- **ORM**: Supabase Client (@supabase/supabase-js)

### State Management & Data Fetching
- **Data Fetching**: [TanStack Query (React Query)](https://tanstack.com/query)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/)
- **Validation**: [Zod](https://zod.dev/)

### Additional Libraries
- **Date Utilities**: [date-fns](https://date-fns.org/)
- **Charts**: [Recharts](https://recharts.org/)

---

## 📁 Project Structure

```
applypulse/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
│
├── components/                   # React components
│   ├── ui/                       # Shadcn UI components
│   ├── kanban/                   # Kanban board components
│   ├── resume/                   # Resume management components
│   ├── analytics/                # Analytics dashboard components
│   ├── layout/                   # Layout components (header, nav)
│   └── providers.tsx             # React Query provider
│
├── hooks/                        # Custom React hooks
│   └── (useApplications, useResumes, etc.)
│
├── lib/                          # Utility libraries
│   ├── supabase/                 # Supabase client configuration
│   │   ├── client.ts             # Browser client
│   │   └── server.ts             # Server client
│   ├── utils/                    # Helper functions
│   └── validations/              # Zod schemas
│       ├── application.ts
│       ├── resume.ts
│       └── interview.ts
│
├── types/                        # TypeScript type definitions
│   ├── database.types.ts         # Supabase generated types
│   └── index.ts                  # Exported types
│
├── public/                       # Static assets
│
├── .env.local.example            # Environment variables template
├── components.json               # Shadcn UI configuration
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── next.config.ts                # Next.js configuration
└── package.json                  # Dependencies
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ and npm
- **Supabase Account** (free tier available)

### Installation

1. **Clone and navigate to the project**
   ```bash
   cd applypulse
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up the database** (see [Database Setup](#database-setup))

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🗄️ Database Setup

### Option 1: Using Supabase Dashboard

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Create a new project (or use existing)
3. Navigate to **SQL Editor**
4. Open the migration file at `/.copilot/session-state/*/files/DATABASE_SCHEMA.md`
5. Copy the SQL migration code
6. Paste and run in SQL Editor

### Option 2: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Create a new migration file
supabase migration new init_schema

# Paste the SQL from DATABASE_SCHEMA.md into the migration file
# Then apply migrations
supabase db push
```

### Database Tables Created
- ✅ `profiles` - User profiles and settings
- ✅ `applications` - Job application tracking
- ✅ `resumes` - Resume version management
- ✅ `interviews` - Interview schedules
- ✅ `resume_application_mapping` - Resume-to-application links

### Row Level Security (RLS)
All tables have RLS enabled. Users can only access their own data.

---

## 🔑 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional (for future Gmail API integration)
# GOOGLE_CLIENT_ID=
# GOOGLE_CLIENT_SECRET=
```

**Getting Supabase Credentials:**
1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to **Settings** → **API**
4. Copy **Project URL** and **anon public** key

---

## 💻 Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type checking
npx tsc --noEmit
```

### Adding Shadcn Components

```bash
# Example: Add a new component
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
```

### Code Style
- **TypeScript strict mode** enabled
- **ESLint** configured
- **Prettier** (optional - add if needed)

---

## 📚 Documentation

Additional documentation is available in the session files:

- **PRD (Product Requirements Document)**: `/.copilot/session-state/*/files/PRD.md`
- **Database Schema & ERD**: `/.copilot/session-state/*/files/DATABASE_SCHEMA.md`
- **Project Plan**: `/.copilot/session-state/*/plan.md`

---

## 🎯 Next Steps

### Immediate Tasks
1. ✅ Project initialized with Next.js, TypeScript, Tailwind
2. ✅ Shadcn/UI configured
3. ✅ Folder structure created
4. ✅ TypeScript types and validation schemas set up
5. ⬜ **TODO**: Set up Supabase database (run migration SQL)
6. ⬜ **TODO**: Implement authentication pages (sign up, login)
7. ⬜ **TODO**: Build Kanban board component
8. ⬜ **TODO**: Create application management UI
9. ⬜ **TODO**: Implement resume upload and mapping
10. ⬜ **TODO**: Build analytics dashboard

### Feature Roadmap
- **Phase 1 (MVP)**: Core features (Kanban, applications, resumes, mock email parser)
- **Phase 2**: Real Gmail API integration, browser extension
- **Phase 3**: Team collaboration, mobile app

---

## 🤝 Contributing

This is a portfolio/learning project. Contributions and suggestions are welcome!

---

## 📄 License

MIT License - feel free to use this project for learning or personal use.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend platform
- [Shadcn/UI](https://ui.shadcn.com/) - UI components
- [TanStack Query](https://tanstack.com/query) - Data fetching

---

**Built with ❤️ for students navigating their career journey**
