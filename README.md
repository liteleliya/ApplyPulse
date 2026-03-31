# ApplyPulse

A modern job application tracker built for students and job seekers. Track applications, manage resumes, schedule interviews, and visualize your job search progress.

## Features

- **Kanban Board** — Drag-and-drop interface to track application stages
- **Application Management** — Track companies, roles, referrals, and notes
- **Resume Versions** — Upload and map different resumes to applications
- **Interview Scheduling** — Keep track of upcoming interviews with notes
- **Analytics Dashboard** — Visualize your recruitment funnel
- **AI-Powered Insights** — Smart suggestions powered by multiple AI providers

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **UI**: Shadcn/UI, Radix UI
- **Backend**: Supabase (PostgreSQL + Auth)
- **State**: TanStack Query, React Hook Form, Zod
- **AI**: OpenAI, Anthropic, Google Gemini, Groq

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Add your Supabase credentials to .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## License

MIT
