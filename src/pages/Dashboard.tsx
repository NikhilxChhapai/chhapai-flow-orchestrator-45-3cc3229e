
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getOrdersWithRealTimeUpdates, getApprovalsPendingByUser } from "@/lib/mockData";
import { DepartmentType } from "@/lib/firebase/types";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

// Import components
import WelcomeMessage from "@/components/dashboard/WelcomeMessage";
import SalesSummary from "@/components/dashboard/SalesSummary";
import OrderOverview from "@/components/dashboard/OrderOverview";
import RecentOrders from "@/components/dashboard/RecentOrders";
import DepartmentDashboard from "@/components/dashboard/DepartmentDashboard";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const { currentUser } = useAuth();
  
  // Get user role and department
  const userRole = currentUser?.role || 'sales';
  const userDepartment = currentUser?.department || 'sales';
  const userName = currentUser?.displayName || '';
  
  // Determine if user can see financial details
  const canViewFinancialDetails = userRole === 'admin' || userRole === 'sales';
  
  // Fetch orders
  useEffect(() => {
    const unsubscribe = getOrdersWithRealTimeUpdates((fetchedOrders) => {
      setOrders(fetchedOrders);
      setLoading(false);
    });
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);
  
  // Fetch pending approvals
  useEffect(() => {
    if (currentUser?.uid) {
      const fetchPendingApprovals = async () => {
        try {
          const approvals = await getApprovalsPendingByUser(currentUser.uid);
          setPendingApprovals(approvals);
        } catch (error) {
          console.error("Error fetching pending approvals:", error);
        }
      };
      
      fetchPendingApprovals();
    }
  }, [currentUser]);
  
  // If loading, show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[500px]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // For design/prepress/production users, show department-specific dashboard
  if (userRole === 'design' || userRole === 'prepress' || userRole === 'production') {
    return (
      <DepartmentDashboard 
        userRole={userRole} 
        department={userRole as DepartmentType} 
        userName={userName}
      />
    );
  }
  
  // For admin/sales users, show the standard dashboard
  return (
    <div className="space-y-6">
      <WelcomeMessage userName={currentUser?.displayName || ''} role={userRole} />
      
      {/* Sales summary for admin/sales only */}
      {canViewFinancialDetails && (
        <div className="grid gap-6 md:grid-cols-3">
          <SalesSummary orders={orders} />
        </div>
      )}
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          {pendingApprovals.length > 0 && (
            <TabsTrigger value="approvals" className="relative">
              Approvals
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                {pendingApprovals.length}
              </span>
            </TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <OrderOverview orders={orders} showAmount={canViewFinancialDetails} />
          <Card>
            <CardContent className="p-6">
              <RecentOrders orders={orders} limit={5} showAmount={canViewFinancialDetails} />
              
              <div className="mt-4 text-center">
                <Link
                  to="/orders"
                  className="text-sm text-primary hover:underline"
                >
                  View all orders →
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders">
          <Card>
            <CardContent className="p-6">
              <RecentOrders orders={orders} limit={10} showAmount={canViewFinancialDetails} />
              
              <div className="mt-4 text-center">
                <Link
                  to="/orders"
                  className="text-sm text-primary hover:underline"
                >
                  View all orders →
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {pendingApprovals.length > 0 && (
          <TabsContent value="approvals">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Pending Approvals</h3>
                <div className="space-y-4">
                  {pendingApprovals.map((approval: any) => (
                    <div key={approval.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{approval.productName}</h4>
                          <p className="text-sm text-muted-foreground">
                            Order #{approval.orderNumber} • Requested by {approval.requestedBy?.userName || "Unknown"}
                          </p>
                          <p className="text-sm text-amber-600 mt-1">
                            {approval.department.charAt(0).toUpperCase() + approval.department.slice(1)} approval pending
                          </p>
                          {approval.description && (
                            <p className="text-sm mt-2 italic">"{approval.description}"</p>
                          )}
                        </div>
                        <Link
                          to={`/orders/${approval.orderId}`}
                          className="text-primary hover:underline text-sm"
                        >
                          Review →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 text-center">
                  <Link
                    to="/approvals"
                    className="text-sm text-primary hover:underline"
                  >
                    View all approvals →
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Dashboard;
