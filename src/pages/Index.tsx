// This page is no longer the primary entry point.
// Routing in App.tsx directs users to LandingPage or Dashboard.
// Keeping this file minimal.

export default function IndexPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-semibold text-slate-700 dark:text-slate-300">
        Cross-Skill Collective
      </h1>
      <p className="text-slate-500 dark:text-slate-400">Loading content...</p>
    </div>
  );
}