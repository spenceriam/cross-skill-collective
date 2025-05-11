# Cross-Skill Collective: MVP Requirements Document

## 1. Product Overview

**Product Name:** Cross-Skill Collective (MVP)  
**Description:** An internal marketplace platform that facilitates employee skill exchange through peer-to-peer training sessions.  
**Target Users:** Mid-sized companies with diverse skill sets across departments.

## 2. MVP Technology Stack

- **Frontend:** React 18 with Vite
- **CSS Framework:** Tailwind CSS (minimal customization)
- **Backend/Database:** Supabase (Auth, Database, minimal Storage)
- **Deployment:** Simple hosting solution (Netlify/Vercel)

## 3. MVP Core Features

### 3.1 Authentication & Profiles
- Basic email/password authentication
- Simple user profiles with:
  - Name and department
  - Brief bio
  - Skill inventory (limited to predefined categories)

### 3.2 Skill Marketplace (Simplified)
- List of skills users can teach (searchable)
- Basic filtering by department and skill category
- Simple form to request learning from a specific teacher
- No advanced matching algorithms in MVP

### 3.3 Exchange Management
- Basic scheduling functionality (date, time, duration)
- Session status tracking (pending, confirmed, completed)
- Manual notification system (no calendar integration)
- Simple approval process

### 3.4 Basic Analytics
- Total exchanges completed
- Most popular skills requested
- Most active teachers/learners
- No complex reporting or visualization

## 4. MVP Database Schema (Supabase)

```sql
-- Simplified schema for MVP

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID REFERENCES auth.users NOT NULL,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  department TEXT NOT NULL,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills table (pre-populated with common categories)
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User skills (skills users can teach)
CREATE TABLE user_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users NOT NULL,
  skill_id UUID REFERENCES skills NOT NULL,
  proficiency_level INTEGER NOT NULL, -- 1-5 scale
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, skill_id)
);

-- Learning sessions
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  skill_id UUID REFERENCES skills NOT NULL,
  teacher_id UUID REFERENCES users NOT NULL,
  learner_id UUID REFERENCES users NOT NULL,
  status TEXT NOT NULL, -- 'pending', 'confirmed', 'completed', 'cancelled'
  scheduled_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 5. UI/UX Requirements (MVP)

### 5.1 Design Approach
- Clean, minimalist interface using standard Tailwind components
- Fully responsive design for both desktop and mobile devices
- Mobile-friendly UI patterns (bottom navigation, touch targets, etc.)
- Adaptive layouts that optimize the experience for each device type
- Limited to essential screens only

### 5.2 Key MVP Screens

1. **Login/Registration**
   - Basic form with email/password
   - Department selection (from predefined list)

2. **Dashboard**
   - Overview of pending/upcoming sessions
   - Quick links to main features

3. **Profile Management**
   - Basic profile information
   - Add/remove teachable skills

4. **Skill Directory**
   - Searchable list of available skills and teachers
   - Simple filters

5. **Session Requests**
   - Basic form to request a session
   - View status of sent/received requests

6. **Session Management**
   - Confirm/decline incoming requests
   - Mark sessions as completed
   - Simple notes field for session outcomes

7. **Basic Stats**
   - Simple counts and lists (no complex visualizations)

## 6. MVP Features Not Included

The following features from the full PRD are explicitly excluded from the MVP:

- Time banking/credit system
- Calendar integrations
- Complex approval workflows
- Advanced analytics and reporting
- Department balancing features
- Rating and feedback system
- SSO integration
- Complex role-based permissions
- Advanced skill matching algorithms

## 7. Implementation Phases

**Total MVP Development: 4 Phases**

- **Phase 1: Setup & Authentication**
  - Project initialization with React + Vite
  - Tailwind configuration
  - Supabase setup and schema creation
  - Authentication implementation

- **Phase 2: Core Functionality**
  - User profiles
  - Skill management
  - Basic directory and search

- **Phase 3: Session Management**
  - Session request flow
  - Session status management
  - Notifications (email only)

- **Phase 4: Polish & Deploy**
  - Basic analytics implementation
  - UI refinement
  - Mobile responsiveness testing and optimization
  - Cross-browser compatibility testing
  - Deployment

## 8. Success Criteria for MVP

- **Functional:** All core features working without major bugs
- **Adoption:** At least 30% of target users register within first month
- **Activity:** Minimum of 10 completed skill exchanges in first month
- **Feedback:** Positive user feedback on core functionality to guide future development

## 9. Technical Implementation Notes

### Simplified Component Structure

```
/src
  /components
    /auth          // Login/registration
    /profile       // Profile management
    /skills        // Skill directory and management
    /sessions      // Session request and tracking
    /dashboard     // Main dashboard view
  /services        // Supabase interaction
  /utils           // Helper functions
  App.jsx
  main.jsx
```

### Basic Supabase Integration

```jsx
// Example of simplified Supabase client setup
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Example: Fetch available teachers for a skill
export const fetchTeachersForSkill = async (skillId) => {
  const { data, error } = await supabase
    .from('user_skills')
    .select(`
      proficiency_level,
      users (
        id,
        full_name,
        department
      )
    `)
    .eq('skill_id', skillId);
    
  if (error) throw error;
  return data;
};
```

## 10. Post-MVP Priorities

After successful MVP deployment and initial user feedback, these features should be prioritized for the next development phase:

1. Feedback and rating system for completed sessions
2. Time tracking and simple credit system
3. Basic calendar integration
4. Enhanced search and filtering options
5. Simple analytics dashboard with visualizations

This MVP provides the essential foundation to validate the concept while keeping development scope manageable.
