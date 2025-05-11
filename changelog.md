# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.5.0] - 2025-05-11

### Added
- **Landing Page Implementation:**
  - Created `LandingPage.tsx` to serve as the initial entry point for unauthenticated users.
    - Includes a welcome message and clear calls to action (Login/Register buttons).
    - Styled with Tailwind CSS for a modern look, including a gradient background and subtle animations.
  - Updated routing logic in `App.tsx`:
    - Unauthenticated users visiting the root path (`/`) are now shown the `LandingPage`.
    - Authenticated users visiting the root path (`/`) are redirected to `/dashboard`.
    - Login and Register pages remain accessible but are now primarily linked from the `LandingPage`.
  - Simplified `Index.tsx` as it's no longer the primary entry point.

### Changed
- Modified `App.tsx` to integrate the new landing page flow and adjusted `AuthProvider` and `ProtectedRoute` logic.
- Updated `todo-Cross-Skill.md` to reflect the new landing page implementation and UI/UX refinement tasks.

### Fixed
- Corrected routing logic in `App.tsx` to reliably display the `LandingPage` for unauthenticated users at the root path and redirect authenticated users to the Dashboard, resolving an issue where a blank page was shown. Ensured proper handling of session loading state.

## [0.4.0] - 2025-05-11

### Added
- **Skill Marketplace Feature (Phase 2):**
  - Created `skillService.ts` with functions to:
    - Fetch all teachable skills (joining `user_skills`, `skills`, and `users` tables).
    - Fetch distinct skill categories for filtering.
    - Fetch distinct teacher departments for filtering.
  - Developed UI components for the marketplace:
    - `SkillCard.tsx`: Displays individual skill details including skill name, category, teacher info, proficiency, and a "Request Session" button.
    - `SkillList.tsx`: Renders a responsive grid of `SkillCard` components with loading skeletons.
    - `SkillFilter.tsx`: Provides inputs for searching by skill name and dropdowns for filtering by skill category and teacher's department. Includes a "Clear Filters" button.
  - Implemented `SkillMarketplacePage.tsx` (`/skills`):
    - Integrates `SkillFilter` and `SkillList`.
    - Uses Tanstack Query (`useQuery`) to fetch teachable skills, categories, and departments.
    - Implements client-side filtering based on search term, category, and department.
    - Includes a placeholder function for handling "Request Session" clicks (logs to console and shows a toast).
  - Added a "Skill Marketplace" link to the `DashboardPage`.
  - Added a new route `/skills` in `App.tsx` for the marketplace.
  - Styled marketplace components using ShadCN UI and Tailwind CSS, ensuring responsiveness.

### Changed
- Updated `App.tsx` to include the new `/skills` route and dashboard link.
- Updated `todo-Cross-Skill.md` to reflect progress on the Skill Marketplace.

### Fixed
- N/A

## [0.3.0] - 2025-05-11

### Added
- **Robust Error Handling:**
  - Integrated `useToast` (ShadCN) for user-friendly error messages in Login and Registration pages.
  - Added `Toaster` component to `App.tsx` for global toast notifications.
  - Improved console logging for errors during authentication.
- **Authentication UI Enhancements:**
  - Refined styling of Login and Registration pages using Tailwind CSS and ShadCN components.
  - Updated `index.css` with a basic theme (custom primary color, dark mode support).
  - Improved layout, typography, and visual appeal of authentication forms.
- **User Profile Feature (Phase 2 - Initial Implementation):**
  - Created `profileService.ts` with functions for fetching/updating user profiles and managing user skills via Supabase.
  - Created `ProfilePage.tsx` to display and edit user profile information (full name, department, bio) and manage teachable skills.
    - Integrated Tanstack Query (`useQuery`, `useMutation`) for asynchronous data operations.
    - Implemented form for editing profile details.
    - Implemented functionality to add/remove teachable skills with proficiency levels.
    - Added loading states (skeletons) and error handling for profile data.
  - Added a route for `/profile` in `App.tsx`.
  - Added a "My Profile" link to the placeholder `DashboardPage`.

### Changed
- Updated `LoginPage.tsx` and `RegisterPage.tsx` for enhanced error handling and UI.
- Updated `App.tsx` to include `Toaster`, profile route, and dashboard link.
- Updated `todo-Cross-Skill.md` to reflect progress on authentication and user profiles.

### Fixed
- Ensured password length check (min 6 characters) on registration page.
- Handled potential failure during user profile creation in `public.users` after successful Supabase Auth sign-up.

## [0.2.0] - 2025-05-11

### Added
- Basic email/password authentication flow:
  - Created `LoginPage.tsx` with form and Supabase login logic.
  - Created `RegisterPage.tsx` with form, department selection, and Supabase registration logic (including creating a corresponding entry in `public.users`).
  - Implemented `AuthProvider` to manage session state globally.
  - Implemented `ProtectedRoute` component to guard routes based on authentication status.
- Updated `App.tsx` with routes for login, registration, and a placeholder dashboard.
- Styled authentication forms using ShadCN UI components (`Card`, `Input`, `Button`, `Label`, `Select`) and Tailwind CSS.
- Added basic error handling and loading states for authentication forms.
- Navigation between login, registration, and dashboard pages.
- Logout functionality on the placeholder dashboard.

### Changed
- Updated `todo-Cross-Skill.md` to reflect completed setup tasks and current progress on authentication.
- Modified `Index.tsx` to be a minimal placeholder, as routing now directs users based on auth state.

### Fixed
- N/A

## [0.1.0] - 2025-05-11

### Added
- Initial database schema implementation for Cross-Skill Collective MVP.
  - Created `users` table with RLS policies for user profiles and authentication linkage.
  - Created `skills` table with RLS policies and populated with initial common skill categories.
  - Created `user_skills` table for associating users with skills they can teach, including proficiency levels and RLS policies.
  - Created `sessions` table to manage learning exchange sessions, including status, scheduling, and RLS policies.
- Implemented a PostgreSQL function and trigger (`update_session_updated_at`) to automatically update the `updated_at` timestamp on the `sessions` table.
- This `changelog.md` file to track project changes, starting at version 0.1.0.

### Changed
- N/A

### Fixed
- N/A