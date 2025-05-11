import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-slate-50 dark:bg-slate-900">
      <AlertTriangle className="w-16 h-16 text-amber-500 mb-8" />
      <h1 className="text-5xl md:text-6xl font-bold text-slate-800 dark:text-slate-100 mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-slate-700 dark:text-slate-300 mb-6">Page Not Found</h2>
      <p className="text-slate-600 dark:text-slate-400 mb-10 max-w-md mx-auto">
        Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or maybe you just mistyped the URL.
      </p>
      <Button asChild size="lg">
        <Link to="/">Go Back to Homepage</Link>
      </Button>
    </div>
  );
}

export default NotFound;