
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold mt-4">Page Not Found</h2>
        <p className="text-muted-foreground mt-2">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button 
          className="mt-6" 
          onClick={() => navigate("/dashboard")}
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
