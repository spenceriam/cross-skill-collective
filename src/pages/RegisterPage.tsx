import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast'; // Import useToast

const departments = ["Technology", "Business", "Communication", "Analytics", "Design", "Marketing", "Management", "HR", "Finance", "Operations"];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { toast } = useToast(); // Initialize useToast
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('');
  // const [error, setError] = useState<string | null>(null); // We'll use toasts instead
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // setError(null);

    if (!department) {
      // setError("Please select a department.");
      toast({
        variant: "destructive",
        title: "Registration Error",
        description: "Please select a department.",
      });
      setLoading(false);
      return;
    }
    if (password.length < 6) {
        toast({
            variant: "destructive",
            title: "Registration Error",
            description: "Password must be at least 6 characters long.",
        });
        setLoading(false);
        return;
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            auth_id: authData.user.id,
            email: authData.user.email!,
            full_name: fullName,
            department: department,
          });
        if (insertError) {
            console.error("Error creating user profile:", insertError);
            // Attempt to clean up the auth user if profile creation fails
            // This is an advanced step and might require an admin client or specific function
            // For now, we'll notify the user of the partial failure.
            toast({
                variant: "destructive",
                title: "Registration Partially Failed",
                description: `Your account was created, but we couldn't set up your profile: ${insertError.message}. Please contact support.`,
            });
            // It might be better to guide the user to login and try completing profile setup later
            // or have an admin fix it. For MVP, this alert is a start.
            navigate('/login'); // Navigate to login even if profile creation fails
            return; // Exit to prevent further processing
        }
        toast({
          title: "Registration Successful!",
          description: "Please check your email to confirm your account.",
        });
        navigate('/login');
      } else {
        throw new Error("Registration completed but no user data returned. Please try again.");
      }

    } catch (error: any) {
      console.error("Registration error:", error);
      // setError(error.message);
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">Create an Account</CardTitle>
          <CardDescription>
            Join the Cross-Skill Collective and start sharing knowledge!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" type="text" placeholder="e.g., Jane Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Min. 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select onValueChange={setDepartment} value={department}>
                <SelectTrigger id="department">
                  <SelectValue placeholder="Select your department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* {error && <p className="text-sm text-red-600">{error}</p>} Removed direct error display */}
            <Button type="submit" className="w-full text-lg py-3" disabled={loading}>
              {loading ? 'Registering...' : 'Create Account'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-3 pt-6">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{' '}
            <Button variant="link" onClick={() => navigate('/login')} className="p-0 h-auto font-semibold">
              Login here
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}