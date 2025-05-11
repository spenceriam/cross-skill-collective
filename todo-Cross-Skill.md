# Cross-Skill Collective: Development Todo List

This todo list is structured for AI-assisted development of the Cross-Skill Collective MVP, broken down into logical phases and specific tasks.

## Phase 1: Project Setup & Authentication

### Project Initialization & Setup
- [x] Create new React + Vite project
- [x] Install and configure Tailwind CSS
- [x] Set up basic folder structure (src, components, pages, lib, etc.)
- [x] Install React Router (`react-router-dom`)
- [x] Install Supabase client (`@supabase/supabase-js`)
- [x] Install Tanstack Query (`@tanstack/react-query`)
- [x] Configure `.env` with Supabase credentials (placeholders initially)
- [x] Initialize Supabase client (`frontend/src/lib/supabase.ts`)
- [x] Create `changelog.md`
- [x] Create `prd-mvp-cross-skill.md` (assuming this was provided or created)
- [x] Create this `todo-Cross-Skill.md`
- [ ] Implement initial user experience:
  - [x] Create `LandingPage.tsx` as the initial view for unauthenticated users.
  - [x] Update `App.tsx` routing:
    - Unauthenticated users at `/` see `LandingPage.tsx`.
    - Authenticated users at `/` are redirected to `/dashboard`.
  - [x] Login/Register pages are accessible from `LandingPage.tsx`.

### Supabase Schema & Data
- [x] Implement database schema from PRD-MVP:
  - [x] Create `users` table (with RLS)
  - [x_] Create `auth.users` reference in `users` table and ensure `auth_id` is unique.
  - [x] Create `skills` table (with RLS)
  - [x] Create `user_skills` table (with RLS)
  - [x] Create `sessions` table (with RLS)
  - [x] Add function and trigger for `sessions.updated_at`
- [x] Populate `skills` table with initial skill categories.

### Authentication
- [x] Implement basic email/password authentication:
  - [x] Create Login page/component
  - [x] Create Registration page/component (including department selection)
  - [x] Handle user session (login, logout)
  - [x] Protect routes based on authentication status
  - [x] Create new user entry in `public.users` table upon successful Supabase Auth registration.
- [x] Style authentication forms using ShadCN components and Tailwind CSS.
- [x] Implement robust error handling using toasts for authentication.
- [x] Enhance UI/UX of authentication pages.

## Phase 2: Core Functionality

### User Profiles
- [x] Create Profile Management page (`/profile`):
  - [x] Fetch and display basic profile information (name, department, bio, email).
  - [x] Allow users to edit their profile information (name, department, bio).
  - [x] Use Tanstack Query for data fetching and mutations.
- [x] Implement Skill Inventory for profiles:
  - [x] Fetch and display user's teachable skills with proficiency.
  - [x] Allow users to add skills they can teach (from `skills` table) with proficiency level.
  - [x] Allow users to remove skills from their profile.
  - [x] Use Tanstack Query for skill data management.
- [x] Style Profile page using ShadCN and Tailwind.

### Skill Marketplace
- [ ] Create Skill Directory page (`/skills`):
  - [x] List all skills users can teach (from `user_skills` joined with `users` and `skills`).
    - [x] Created `skillService.ts` to fetch teachable skills.
    - [x] Created `SkillCard.tsx` to display individual skills.
    - [x] Created `SkillList.tsx` to display a grid of skill cards.
  - [x] Implement basic search functionality for skills (by skill name).
  - [x] Implement basic filtering (by skill category, teacher's department).
    - [x] Created `SkillFilter.tsx` component.
    - [x] Added functions to `skillService.ts` to fetch distinct categories and departments.
  - [x] Created `SkillMarketplacePage.tsx` to integrate filters and list.
  - [x] Added placeholder for "Request Learning" button on `SkillCard.tsx`.
- [ ] Style Skill Directory using ShadCN components and Tailwind CSS.

## Phase 3: Session Management

### Session Requests & Management
- [ ] Implement "Request Learning" functionality:
  - [ ] Simple form to request learning from a specific teacher for a specific skill.
- [ ] Create Session Requests page:
  - [ ] Display sessions initiated by the user (learner).
  - [ ] Display sessions where the user is the teacher.
  - [ ] Show status of sent/received requests (`pending`, `confirmed`, `completed`, `cancelled`).
- [ ] Implement Session Management actions:
  - [ ] Allow teachers to confirm/decline incoming session requests.
  - [ ] Allow involved users (teacher or learner) to mark sessions as `completed` or `cancelled`.
  - [ ] Simple notes field for session outcomes (viewable/editable by involved users).
- [ ] Basic manual notification system (e.g., display alerts in UI for new requests or status changes - no email integration for MVP).

## Phase 4: Polish & Deploy

### Basic Analytics
- [ ] Create Basic Stats page:
  - [ ] Display total exchanges completed.
  - [ ] Display most popular skills requested (simple count).
  - [ ] Display most active teachers/learners (simple count).
- [ ] No complex reporting or visualization for MVP.

### UI/UX Refinement
- [x] Review and refine UI for all key screens.
- [x] Ensure clean, minimalist interface using standard Tailwind/ShadCN components.
- [x] Ensure responsive design for desktop and mobile.
  - [ ] Test on various screen sizes.
  - [ ] Implement mobile-friendly patterns (e.g., bottom navigation if suitable, touch targets).
- [ ] Cross-browser compatibility testing (Chrome, Firefox, Safari).
- [x] Implement a dedicated Landing Page for unauthenticated users.

### Deployment
- [ ] Prepare for deployment (build commands, environment variables).
- [ ] Deploy to a simple hosting solution (e.g., Netlify/Vercel).

## Post-MVP Considerations (Not for MVP)
- Time banking/credit system
- Calendar integrations
- Complex approval workflows
- Advanced analytics and reporting
- Department balancing features
- Rating and feedback system
- SSO integration
- Complex role-based permissions
- Advanced skill matching algorithms