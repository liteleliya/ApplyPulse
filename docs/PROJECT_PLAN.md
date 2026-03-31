# ApplyPulse - Career CRM & Placement Tracker
## Project Plan

### Problem Statement
Build a professional Career CRM and Placement Tracker that automates job application tracking, manages multiple resume versions, and provides analytics on the recruitment funnel. The application needs to support drag-and-drop Kanban boards, Gmail integration for auto-population, and resume mapping.

### Approach
1. **Documentation Phase**: Generate PRD and Database Schema ERD
2. **Project Initialization**: Set up Next.js with TypeScript, Tailwind CSS, and Shadcn/UI
3. **Database Design**: Create Supabase schema with migrations
4. **Core Features Implementation**: Build Kanban board, resume management, and intelligence layer

### Technical Architecture
- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, Shadcn/UI
- **Backend**: Supabase (PostgreSQL + Auth)
- **State Management**: TanStack Query (React Query)
- **Drag & Drop**: @hello-pangea/dnd or dnd-kit
- **Validation**: Zod schemas

### Database Schema Overview
- `profiles`: User settings and preferences
- `applications`: Job applications with Kanban status
- `resumes`: PDF storage links and metadata
- `interviews`: Interview schedules linked to applications
- `resume_application_mapping`: Many-to-many relationship

### Implementation Todos
These will be tracked in the SQL database.

### Notes
- Use App Router for better performance and SSR
- Implement real-time updates using Supabase subscriptions
- Design mobile-first responsive UI
- Follow atomic design principles for components
- Implement proper TypeScript types for type safety
