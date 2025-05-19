
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User, Users, Briefcase, Layers, PaintRoller } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await login(email, password);
      toast({
        title: "Login successful",
        description: "Welcome to Chhapai Workflow Manager",
      });
      navigate("/dashboard");
    } catch (error: any) {
      console.error(error);
      setError(error.message || "Invalid email or password");
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle quick login with demo accounts
  const handleQuickLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("password");
    
    // Auto submit the form after a short delay to show the filled credentials
    setIsLoading(true);
    try {
      await login(demoEmail, "password");
      toast({
        title: "Login successful",
        description: "Welcome to Chhapai Workflow Manager",
      });
      navigate("/dashboard");
    } catch (error: any) {
      console.error(error);
      setError(error.message || "Invalid email or password");
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Demo account data with emails and icons
  const demoAccounts = [
    { role: "Admin", email: "admin@chhapai.com", icon: <User className="h-4 w-4" /> },
    { role: "Sales", email: "sales@chhapai.com", icon: <Briefcase className="h-4 w-4" /> },
    { role: "Design", email: "design@chhapai.com", icon: <PaintRoller className="h-4 w-4" /> },
    { role: "Prepress", email: "prepress@chhapai.com", icon: <Layers className="h-4 w-4" /> },
    { role: "Production", email: "production@chhapai.com", icon: <Users className="h-4 w-4" /> }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-4 animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Chhapai</h1>
          <p className="text-muted-foreground">Workflow Manager</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
                  Email
                </label>
                <Input
                  id="email"
                  placeholder="mail@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
                  Password
                </label>
                <Input
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        {/* Quick Login Section */}
        <div className="mt-6">
          <h3 className="text-center text-sm font-medium mb-3 text-muted-foreground">Quick Login for Demo</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {demoAccounts.map((account) => (
              <Button 
                key={account.email}
                variant="outline"
                size="sm"
                className="hover:bg-primary hover:text-primary-foreground transition-all"
                onClick={() => handleQuickLogin(account.email)}
                disabled={isLoading}
              >
                {account.icon}
                <span className="ml-2">{account.role}</span>
              </Button>
            ))}
          </div>
        </div>
        
        <div className="mt-4 text-center text-xs text-muted-foreground">
          <p>All demo accounts use password: "password"</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
