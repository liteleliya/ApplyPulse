# Product Requirements Document (PRD)
## ApplyPulse - Career CRM & Placement Tracker

**Version:** 1.0  
**Last Updated:** March 2026  
**Product Owner:** Senior Full-Stack Engineering Team

---

## 1. Executive Summary

### 1.1 Product Vision
ApplyPulse is a professional Career CRM and Placement Tracker designed to empower students and job seekers with intelligent automation, comprehensive tracking, and data-driven insights throughout their job search journey.

### 1.2 Problem Statement
Job seekers face several challenges:
- Manual tracking of applications across multiple platforms
- Loss of important emails and application deadlines
- Difficulty managing multiple resume versions
- Lack of visibility into their recruitment funnel
- No centralized system to track interview schedules and preparation

### 1.3 Success Metrics
- Time saved: 70% reduction in manual data entry
- Application tracking accuracy: 95%+
- User engagement: Daily active usage during job search period
- Email parsing accuracy: 90%+ for common job portals

---

## 2. User Personas

### Primary Persona: College Student - "Sarah"
- **Age:** 21-23
- **Context:** Final year student actively applying for internships/placements
- **Goals:** Track 50+ applications, prepare for interviews, optimize resume strategy
- **Pain Points:** Overwhelmed by emails, forgets follow-ups, uses spreadsheets

### Secondary Persona: Career Switcher - "Alex"
- **Age:** 25-30
- **Context:** Professional seeking new opportunities
- **Goals:** Organize job search, maintain confidentiality, analyze success patterns
- **Pain Points:** Limited time, needs privacy, wants data-driven insights

---

## 3. Core Features & Requirements

### 3.1 User Authentication & Profile Management

#### Requirements
- **AUTH-001:** User registration with email verification
- **AUTH-002:** Secure login using Supabase Auth (Email/Password, OAuth)
- **AUTH-003:** Password reset functionality
- **AUTH-004:** Profile customization (name, target roles, preferences)
- **AUTH-005:** Account settings (email notifications, theme preferences)

#### User Stories
```
As a new user,
I want to create an account with my email,
So that I can securely store my job application data.
```

### 3.2 Application Management

#### Requirements
- **APP-001:** Create application entries with mandatory fields:
  - Company name
  - Role/Position title
  - Application status (Kanban stage)
  - Date applied
- **APP-002:** Optional fields:
  - Job URL
  - Referral name and contact
  - Salary range
  - Location (remote/hybrid/onsite)
  - Notes and tags
- **APP-003:** Edit/Delete applications
- **APP-004:** Bulk actions (archive, delete)
- **APP-005:** Search and filter by company, role, status, date

#### User Stories
```
As a job seeker,
I want to add a new application with all relevant details,
So that I can track its progress through the hiring process.
```

### 3.3 Kanban Board (Primary Interface)

#### Requirements
- **KAN-001:** Visual board with customizable stages:
  - Default stages: "Wishlist", "Applied", "Online Assessment", "Interview", "Offer", "Rejected", "Accepted"
- **KAN-002:** Drag-and-drop functionality using @hello-pangea/dnd or dnd-kit
- **KAN-003:** Card view showing:
  - Company logo (optional)
  - Company name
  - Role title
  - Days in current stage
  - Tags/labels
- **KAN-004:** Click to expand card for details
- **KAN-005:** Stage customization (add/remove/rename stages)
- **KAN-006:** Automatic timestamp tracking on stage changes
- **KAN-007:** Responsive design (mobile: list view, desktop: full board)

#### User Stories
```
As a job seeker,
I want to drag an application from "Applied" to "Interview" stage,
So that I can visually track my recruitment funnel.
```

### 3.4 Resume Management

#### Requirements
- **RES-001:** Upload multiple resume versions (PDF only)
- **RES-002:** Store resumes in Supabase Storage
- **RES-003:** Each resume has:
  - Title/name (e.g., "Software Engineer - Tech", "Data Analyst")
  - Upload date
  - File size
  - Version notes
- **RES-004:** Download/preview resume
- **RES-005:** Delete resume (with confirmation)
- **RES-006:** Tag/map resumes to specific applications
- **RES-007:** View which resume was used for which applications

#### User Stories
```
As a job seeker with tailored resumes,
I want to upload multiple versions and map them to applications,
So that I can track which resume variant performs best.
```

### 3.5 Interview Tracking

#### Requirements
- **INT-001:** Link interviews to specific applications
- **INT-002:** Multiple interview rounds per application
- **INT-003:** Interview fields:
  - Date and time
  - Interview type (phone, video, onsite, take-home)
  - Interviewer name(s)
  - Preparation notes
  - Post-interview notes
  - Result/outcome
- **INT-004:** Calendar integration (iCal export)
- **INT-005:** Upcoming interview reminders
- **INT-006:** Interview preparation checklist

#### User Stories
```
As a job seeker,
I want to schedule an interview linked to my Google application,
So that I can prepare and track the outcome.
```

### 3.6 Intelligence Layer - Email Parser (Mock/MVP)

#### Requirements
- **INT-001:** Mock Gmail API integration for MVP
- **INT-002:** Parse common email patterns:
  - Subject: "Application Received", "Thank you for applying"
  - Sender: jobs@company.com, noreply@workday.com
  - Body: Extract company name, role, application ID
- **INT-003:** Auto-create application entries from parsed emails
- **INT-004:** User review/approval before auto-adding (optional)
- **INT-005:** Support for major ATS platforms:
  - Workday
  - Greenhouse
  - Lever
  - BambooHR
- **INT-006:** Manual trigger to scan inbox
- **INT-007:** Display parsing confidence score

#### User Stories
```
As a job seeker who applies via multiple portals,
I want the system to automatically detect confirmation emails,
So that I don't have to manually enter every application.
```

#### Implementation Notes (Mock)
```typescript
// Mock parser interface
interface EmailParseResult {
  company: string;
  role: string;
  appliedDate: Date;
  jobUrl?: string;
  confidence: number; // 0-1
  rawEmailId: string;
}

// Mock data for demo
const mockEmails = [
  { subject: "Application Received - Software Engineer", from: "jobs@google.com" },
  { subject: "Thank you for applying to Data Analyst", from: "recruiting@meta.com" }
];
```

### 3.7 Analytics Dashboard

#### Requirements
- **ANA-001:** Key metrics display:
  - Total applications
  - Applications by status
  - Response rate (applied vs interview)
  - Offer rate
  - Average time in each stage
- **ANA-002:** Visual charts:
  - Funnel visualization
  - Applications timeline (line/bar chart)
  - Success rate by resume type
- **ANA-003:** Date range filtering
- **ANA-004:** Export data as CSV

#### User Stories
```
As a job seeker,
I want to see my application funnel conversion rate,
So that I can understand and improve my job search strategy.
```

---

## 4. Database Schema

### 4.1 Tables Overview

#### profiles
```sql
- id (uuid, PK, references auth.users)
- full_name (text)
- email (text, unique)
- target_roles (text[])
- preferred_locations (text[])
- settings (jsonb)
- created_at (timestamp)
- updated_at (timestamp)
```

#### applications
```sql
- id (uuid, PK)
- user_id (uuid, FK -> profiles.id)
- company_name (text, required)
- role_title (text, required)
- status (enum: wishlist, applied, assessment, interview, offer, rejected, accepted)
- job_url (text)
- referral_name (text)
- referral_contact (text)
- salary_range (text)
- location (text)
- work_type (enum: remote, hybrid, onsite)
- notes (text)
- tags (text[])
- applied_date (date)
- status_updated_at (timestamp)
- created_at (timestamp)
- updated_at (timestamp)
```

#### resumes
```sql
- id (uuid, PK)
- user_id (uuid, FK -> profiles.id)
- title (text, required)
- file_url (text, required) // Supabase Storage URL
- file_name (text)
- file_size (int) // bytes
- version_notes (text)
- created_at (timestamp)
- updated_at (timestamp)
```

#### interviews
```sql
- id (uuid, PK)
- application_id (uuid, FK -> applications.id)
- interview_date (timestamp, required)
- interview_type (enum: phone, video, onsite, take_home)
- round_number (int)
- interviewer_names (text[])
- preparation_notes (text)
- post_interview_notes (text)
- result (enum: pending, passed, failed, no_show)
- created_at (timestamp)
- updated_at (timestamp)
```

#### resume_application_mapping
```sql
- id (uuid, PK)
- resume_id (uuid, FK -> resumes.id)
- application_id (uuid, FK -> applications.id)
- created_at (timestamp)
```

---

## 5. Technical Specifications

### 5.1 Tech Stack
- **Frontend Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 3.4+
- **UI Components:** Shadcn/UI
- **State Management:** TanStack Query (React Query v5)
- **Form Handling:** React Hook Form
- **Validation:** Zod
- **Database & Auth:** Supabase
- **Drag & Drop:** @hello-pangea/dnd or dnd-kit
- **Charts:** Recharts or Chart.js
- **Date Handling:** date-fns

### 5.2 Folder Structure
```
/app                    # Next.js App Router
  /auth
  /dashboard
  /applications
  /resumes
  /analytics
  /api
/components
  /ui                   # Shadcn components
  /kanban
  /resume
  /analytics
/hooks                  # Custom React hooks
/lib
  /supabase            # Supabase client
  /utils               # Helper functions
  /validations         # Zod schemas
/types                 # TypeScript types
/public
```

### 5.3 Key Libraries
```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "typescript": "^5.4.0",
    "@supabase/supabase-js": "^2.43.0",
    "@tanstack/react-query": "^5.32.0",
    "@hello-pangea/dnd": "^16.6.0",
    "zod": "^3.23.0",
    "react-hook-form": "^7.51.0",
    "@hookform/resolvers": "^3.3.0",
    "tailwindcss": "^3.4.0",
    "date-fns": "^3.6.0",
    "recharts": "^2.12.0"
  }
}
```

### 5.4 Performance Requirements
- **Initial Load:** < 2 seconds
- **Kanban Drag Operation:** < 100ms response
- **Email Parsing (Mock):** < 1 second per email
- **Search/Filter:** < 500ms

### 5.5 Security Requirements
- **SEC-001:** Row Level Security (RLS) enabled on all tables
- **SEC-002:** Users can only access their own data
- **SEC-003:** Secure file uploads (size limits, type validation)
- **SEC-004:** Input sanitization on all user inputs
- **SEC-005:** HTTPS-only in production

---

## 6. User Flows

### 6.1 New User Onboarding
1. User lands on marketing page
2. Click "Get Started" → Sign up page
3. Enter email, password → Email verification
4. Complete profile (name, target roles)
5. Optional: Upload first resume
6. Redirect to empty Kanban board with tutorial overlay

### 6.2 Adding Application Manually
1. Click "Add Application" button
2. Fill form (company, role, status, optional fields)
3. Optionally map to resume
4. Submit → Application appears in selected Kanban stage

### 6.3 Auto-Import from Email
1. Navigate to "Intelligence" page
2. Click "Scan Inbox" (mock trigger)
3. System shows parsed emails with preview
4. User reviews and confirms/edits each entry
5. Bulk import confirmed applications

### 6.4 Moving Application Through Stages
1. View Kanban board
2. Drag application card to new stage
3. System auto-saves with timestamp
4. Optional: Add notes about stage change

### 6.5 Scheduling Interview
1. Click application card
2. Navigate to "Interviews" tab
3. Click "Add Interview"
4. Fill details (date, type, interviewer)
5. Add preparation notes
6. Save → Calendar reminder created

---

## 7. UI/UX Requirements

### 7.1 Design Principles
- **Minimalist:** Clean, distraction-free interface
- **Mobile-First:** Fully responsive on all devices
- **Accessible:** WCAG 2.1 AA compliance
- **Fast:** Optimistic UI updates, loading skeletons

### 7.2 Color Scheme
- Primary: Blue (#3B82F6) - Professional, trustworthy
- Success: Green (#10B981) - Offers, positive actions
- Warning: Yellow (#F59E0B) - Pending items
- Danger: Red (#EF4444) - Rejections, destructive actions
- Neutral: Gray scale for text and backgrounds

### 7.3 Key Screens
1. **Dashboard/Kanban Board** (Primary)
2. **Application Details** (Modal/Sidebar)
3. **Resume Manager**
4. **Analytics Dashboard**
5. **Intelligence/Email Parser**
6. **Profile Settings**

---

## 8. Future Enhancements (Post-MVP)

### Phase 2
- Real Gmail API integration
- Browser extension for one-click application capture
- Interview preparation AI (mock questions)
- Networking/contact management
- Job board aggregation

### Phase 3
- Team collaboration (career services)
- Application templates
- Cover letter management
- Offer comparison tool
- Mobile app (React Native)

---

## 9. Testing Requirements

### 9.1 Unit Tests
- Utility functions (date formatting, parsers)
- Validation schemas (Zod)
- React hooks

### 9.2 Integration Tests
- Supabase queries
- Form submissions
- File uploads

### 9.3 E2E Tests
- Critical user flows (Playwright/Cypress)
- Kanban drag-and-drop
- Authentication flow

---

## 10. Deployment & DevOps

### 10.1 Environment Setup
- **Development:** Local with Supabase CLI
- **Staging:** Vercel Preview
- **Production:** Vercel with Supabase Cloud

### 10.2 CI/CD Pipeline
- GitHub Actions for automated testing
- Automatic deployment on merge to main
- Database migrations via Supabase CLI

---

## 11. Success Criteria

### MVP Launch Criteria
- ✅ User can sign up and create profile
- ✅ User can add/edit/delete applications
- ✅ Kanban board with drag-and-drop works smoothly
- ✅ User can upload and map resumes
- ✅ Basic analytics dashboard functional
- ✅ Mock email parser demonstrates concept
- ✅ Mobile responsive on iPhone/Android
- ✅ All data secured with RLS

### Post-Launch (30 days)
- 100+ active users
- < 5% bug report rate
- > 80% feature adoption (Kanban usage)
- Positive user feedback (NPS > 40)

---

## 12. Appendix

### 12.1 Glossary
- **ATS:** Applicant Tracking System
- **RLS:** Row Level Security
- **Kanban:** Visual workflow management method
- **CRM:** Customer Relationship Management

### 12.2 References
- Next.js App Router: https://nextjs.org/docs
- Supabase Documentation: https://supabase.com/docs
- Shadcn/UI: https://ui.shadcn.com

---

**Document Status:** ✅ Approved for Development  
**Next Steps:** Generate Database ERD → Initialize Next.js Project
