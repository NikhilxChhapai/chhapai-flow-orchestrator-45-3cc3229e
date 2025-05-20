
import { Link } from "react-router-dom";
import { ShieldAlert, AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Order } from "@/lib/firebase/types";
import { canUserAccessOrder } from "@/utils/workflowUtils";

interface OrderAccessControlProps {
  loading: boolean;
  order: Order | null;
  currentUser: {
    uid: string;
    email: string | null;
    displayName: string | null;
    role: string;
    department?: string;
  } | null;
  children: React.ReactNode;
}

const OrderAccessControl = ({ loading, order, currentUser, children }: OrderAccessControlProps) => {
  // Check if user can access this order
  const userCanAccessOrder = (): boolean => {
    if (!currentUser || !order) return false;
    
    return canUserAccessOrder({
      id: currentUser.uid,
      email: currentUser.email || "",
      name: currentUser.displayName || "",
      role: currentUser.role as any,
      department: currentUser.department as any || currentUser.role as any,
      createdAt: new Date()
    }, order);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-muted-foreground">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h2 className="mt-4 text-2xl font-bold">Order Not Found</h2>
        <p className="mt-2 text-muted-foreground">The requested order could not be found.</p>
        <Button asChild className="mt-6">
          <Link to="/orders"><ArrowLeft className="mr-2 h-4 w-4" />Back to Orders</Link>
        </Button>
      </div>
    );
  }
  
  if (!userCanAccessOrder()) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <ShieldAlert className="h-12 w-12 text-destructive" />
        <h2 className="mt-4 text-2xl font-bold">Access Restricted</h2>
        <p className="mt-2 text-muted-foreground">You don't have permission to view this order.</p>
        <Button asChild className="mt-6">
          <Link to="/orders"><ArrowLeft className="mr-2 h-4 w-4" />Back to Orders</Link>
        </Button>
      </div>
    );
  }

  return <>{children}</>;
};

export default OrderAccessControl;
