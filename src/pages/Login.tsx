
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";

// Real users data for quick login
const realUsers = [
  { name: "Rajesh Ji", email: "hi@chhapai.in", icon: "👑", role: "Admin" },
  { name: "Nikhil", email: "chd@chhapai.in", icon: "👨‍💼", role: "Sales" },
  { name: "Vanika", email: "vanika@chhapai.in", icon: "👩‍💼", role: "Sales" },
  { name: "Harish", email: "saleschd@chhapai.in", icon: "👨‍💻", role: "Sales" },
  { name: "Rohini", email: "rohini@chhapai.in", icon: "👩‍💻", role: "Sales" },
  { name: "Hritik", email: "smo@chhapai.in", icon: "👨‍🎨", role: "Design" },
  { name: "Yashpal Ji", email: "orders@chhapai.in", icon: "🖨️", role: "Prepress" },
  { name: "Sanjay", email: "sanjay@chhapai.in", icon: "🏭", role: "Production" }
];

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

  // Handle quick login with real accounts
  const handleQuickLogin = async (userEmail: string) => {
    setEmail(userEmail);
    
    // Find the correct password for this user
    const userPassword = getUserPassword(userEmail);
    setPassword(userPassword);
    
    // Auto submit the form
    setIsLoading(true);
    try {
      await login(userEmail, userPassword);
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
  
  // Helper function to get the correct password for each user
  const getUserPassword = (email: string): string => {
    switch(email) {
      case "hi@chhapai.in": return "Admin@123";
      case "chd@chhapai.in": return "Nikhil@123";
      case "vanika@chhapai.in": return "vanika@123";
      case "saleschd@chhapai.in": return "harish@123";
      case "rohini@chhapai.in": return "rohini@123";
      case "smo@chhapai.in": return "Hritik@123";
      case "orders@chhapai.in": return "Yashpal@123";
      case "sanjay@chhapai.in": return "sanjay@123";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background">
      <motion.div 
        className="w-full max-w-md p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="text-center mb-8"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <img 
            src="/logo-full.png" 
            alt="Chhapai" 
            className="h-16 mx-auto mb-2"
          />
          <p className="text-muted-foreground">Workflow Manager</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-primary/20">
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
                    className="focus:border-primary focus-ring"
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
                    className="focus:border-primary focus-ring"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-primary hover:bg-primary/90 focus-ring" type="submit" disabled={isLoading}>
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
        </motion.div>
        
        {/* Quick Login Section */}
        <motion.div 
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h3 className="text-center text-sm font-medium mb-3 text-muted-foreground">Quick Login</h3>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {realUsers.map((user, index) => (
              <motion.div
                key={user.email}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
              >
                <Button 
                  variant="outline"
                  className="bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 border border-primary/20 text-foreground hover:shadow-md transition-all w-full focus-ring flex flex-col py-3 h-auto"
                  onClick={() => handleQuickLogin(user.email)}
                  disabled={isLoading}
                >
                  <span className="text-xl mb-1">{user.icon}</span>
                  <span className="text-sm font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground mt-1">{user.role}</span>
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
