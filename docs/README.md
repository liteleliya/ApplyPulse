# 📚 ApplyPulse Documentation

This folder contains all the project documentation and planning materials.

## 📄 Documentation Files

### 1. **PRD.md** (14KB)
**Product Requirements Document**
- Complete feature specifications
- User personas and user stories
- Technical specifications
- UI/UX requirements
- Testing strategy
- Success metrics

👉 **Start here** to understand what we're building and why.

---

### 2. **DATABASE_SCHEMA.md** (18KB)
**Database Schema & ERD**
- Mermaid ERD diagram code
- Complete SQL migration script (ready to run in Supabase)
- 5 database tables with relationships
- Row Level Security (RLS) policies
- Database triggers and functions
- Helper views for analytics

👉 **Use this** when setting up your Supabase database.

**Quick Start:**
```sql
-- Copy the SQL migration from this file
-- Run it in your Supabase SQL Editor
-- Creates all tables, RLS policies, and helper functions
```

---

### 3. **SETUP_SUMMARY.md** (11KB)
**Project Setup Summary & Roadmap**
- What's been completed
- Project structure overview
- Development roadmap (7-week plan)
- Useful commands reference
- Security checklist
- Quick reference guide

👉 **Use this** as your development guide and reference.

---

### 4. **PROJECT_PLAN.md** (1.6KB)
**High-Level Project Plan**
- Problem statement
- Technical approach
- Implementation todos
- Architecture notes

---

## 🚀 Quick Navigation

### Setting Up the Project
1. Read **SETUP_SUMMARY.md** first
2. Set up Supabase using **DATABASE_SCHEMA.md**
3. Reference **PRD.md** when building features

### During Development
- Refer to **PRD.md** for feature specifications
- Check **SETUP_SUMMARY.md** for the development roadmap
- Use **DATABASE_SCHEMA.md** to understand data relationships

---

## 📊 Database Tables Overview

| Table | Purpose |
|-------|---------|
| `profiles` | User settings and preferences |
| `applications` | Job application tracking (main entity) |
| `resumes` | Multiple resume versions with file storage |
| `interviews` | Interview schedules linked to applications |
| `resume_application_mapping` | Many-to-many resume ↔ application relationship |

---

## 🎯 Development Phases

1. **Phase 1**: Authentication (Week 1)
2. **Phase 2**: Kanban Board (Week 2)
3. **Phase 3**: Application Management (Week 3)
4. **Phase 4**: Resume Management (Week 4)
5. **Phase 5**: Interview Tracking (Week 5)
6. **Phase 6**: Analytics Dashboard (Week 6)
7. **Phase 7**: Intelligence Layer (Week 7)

See **SETUP_SUMMARY.md** for detailed task breakdowns.

---

## 🔗 Useful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Shadcn/UI Components](https://ui.shadcn.com)
- [TanStack Query](https://tanstack.com/query)
- [Zod Validation](https://zod.dev)

---

**Happy Building! 🚀**
