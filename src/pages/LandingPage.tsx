import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-primary/30 text-white p-8">
      <header className="text-center mb-12 animate-fadeIn">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
          Welcome to Cross-Skill Collective
        </h1>
        <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto">
          Unlock your potential by sharing skills and learning from your colleagues.
          An internal marketplace for peer-to-peer knowledge exchange.
        </p>
      </header>

      <main className="animate-slideUp">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-2xl max-w-md text-center">
          <h2 className="text-2xl font-semibold mb-6 text-slate-100">Get Started</h2>
          <div className="space-y-4">
            <Button asChild size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg group">
              <Link to="/login">
                Login to Your Account
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full text-lg group border-slate-400 hover:bg-slate-700 hover:text-white">
              <Link to="/register">
                Create New Account
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <footer className="mt-16 text-center text-slate-400 text-sm animate-fadeInUp">
        <p>&copy; {new Date().getFullYear()} Cross-Skill Collective. Empowering internal growth.</p>
      </footer>

      {/* Basic CSS for animations (can be moved to index.css or a dedicated animation file) */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 1s ease-out; }
        .animate-slideUp { animation: slideUp 0.8s ease-out 0.3s backwards; }
        .animate-fadeInUp { animation: fadeInUp 0.7s ease-out 0.6s backwards; }
      `}</style>
    </div>
  );
}