import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';
import { Link } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LandingPage from './pages/LandingPage';
import NotFound from '@/pages/NotFound'; // Adjusted import
import ProfilePage from './pages/ProfilePage';
import SkillMarketplacePage from './pages/SkillMarketplacePage';
import { Button } from './components/ui/button';
import { Toaster } from "@/components/ui/toaster";

// Dashboard Page (ensure it's defined or imported correctly)
const DashboardPage = () => (
  <div className="p-4">
    <header className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="space-x-2">
        <Button asChild variant="outline">
          <Link to="/profile">My Profile</Link>
        </Button>
        <Button asChild>
          <Link to="/skills">Skill Marketplace</Link>
        </Button>
        <Button onClick={async () => { await supabase.auth.signOut(); }}>Logout</Button>
      </div>
    </header>
    <p className="text-lg">Welcome to your Cross-Skill Collective dashboard!</p>
    <div className="mt-6 p-6 bg-card border rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-3">Quick Actions</h2>
        <p className="text-muted-foreground">Explore available skills or manage your profile.</p>
    </div>
  </div>
);

// This component will wrap routes and manage auth state
const AuthSensitiveRoutesManager = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial session state
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setLoading(false);
    });

    // Listen for changes in auth state
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      // If this is the initial check and getSession hasn't finished,
      // this ensures loading is set to false once auth state is known.
      if (loading && _event === 'INITIAL_SESSION') {
         setLoading(false);
      } else if (!loading && _event !== 'INITIAL_SESSION') {
        // For subsequent changes, loading state is likely already false
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []); // Run once on mount to set up session listener

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900">
        <p className="text-lg text-slate-700 dark:text-slate-300">Loading Application...</p>
        {/* Consider adding a visual spinner here */}
      </div>
    );
  }

  return (
    <Routes>
      {/* Root path: LandingPage if no session, else redirect to Dashboard */}
      <Route
        path="/"
        element={!session ? <LandingPage /> : <Navigate to="/dashboard" replace />}
      />

      {/* Login and Register: Only accessible if no session, else redirect to Dashboard */}
      <Route
        path="/login"
        element={!session ? <LoginPage /> : <Navigate to="/dashboard" replace />}
      />
      <Route
        path="/register"
        element={!session ? <RegisterPage /> : <Navigate to="/dashboard" replace />}
      />

      {/* Protected Routes Wrapper */}
      <Route element={<ProtectedRouteOutlet session={session} />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/skills" element={<SkillMarketplacePage />} />
        {/* Add other protected routes here */}
      </Route>

      {/* Fallback for any unmatched routes */}
      <Route path="*" element={<NotFound />} /> {/* Adjusted component name */}
    </Routes>
  );
};

// Wrapper for protected routes that uses Outlet
const ProtectedRouteOutlet = ({ session }: { session: Session | null }) => {
  // If there's no session, redirect to login page.
  // `replace` avoids adding the login route to history when redirecting.
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  // If session exists, render the child routes.
  return <Outlet />;
};

function App() {
  return (
    <Router>
      <AuthSensitiveRoutesManager />
      <Toaster />
    </Router>
  );
}

export default App;