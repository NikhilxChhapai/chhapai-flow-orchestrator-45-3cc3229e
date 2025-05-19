
import { useAuth } from "@/contexts/AuthContext";
import StatCard from "@/components/dashboard/StatCard";
import RecentOrders from "@/components/dashboard/RecentOrders";
import StatusChart from "@/components/dashboard/StatusChart";
import RevenueChart from "@/components/dashboard/RevenueChart";
import { Package, CheckCircle, Clock, CircleDollarSign, Users, PaintRoller, Layers, Briefcase } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const role = currentUser?.role || "sales";
  const department = currentUser?.department || "Sales";
  const isMobile = useIsMobile();
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  // We'll show different stats based on user role
  const isAdminOrSales = role === "admin" || role === "sales";

  // Get the department icon
  const getDepartmentIcon = () => {
    switch (role) {
      case "admin": return <Users className="h-6 w-6 text-primary" />;
      case "sales": return <Briefcase className="h-6 w-6 text-primary" />;
      case "design": return <PaintRoller className="h-6 w-6 text-primary" />;
      case "prepress": return <Layers className="h-6 w-6 text-primary" />;
      case "production": return <Package className="h-6 w-6 text-primary" />;
      default: return <Users className="h-6 w-6 text-primary" />;
    }
  };

  // Department-specific stat values
  const getDepartmentStats = () => {
    switch (role) {
      case "admin":
        return {
          total: 60,
          inProgress: 24,
          completed: 32,
          revenue: "₹9,45,000"
        };
      case "sales":
        return {
          total: 45,
          inProgress: 18,
          completed: 25,
          revenue: "₹8,25,000"
        };
      case "design":
        return {
          total: 38,
          inProgress: 15,
          completed: 22
        };
      case "prepress":
        return {
          total: 32,
          inProgress: 14,
          completed: 18
        };
      case "production":
        return {
          total: 28,
          inProgress: 12,
          completed: 16
        };
      default:
        return {
          total: 30,
          inProgress: 12,
          completed: 18,
          revenue: "₹5,50,000"
        };
    }
  };

  const stats = getDepartmentStats();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome header with department badge */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{greeting},</h1>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">
              {currentUser?.displayName || "User"}!
            </h1>
          </div>
          <div className="flex items-center gap-2 mt-2">
            {getDepartmentIcon()}
            <Badge variant="outline" className="text-sm font-medium">
              {department}
            </Badge>
          </div>
        </div>
        
        {/* Department-specific action button */}
        {role === "admin" && (
          <Card className="w-full md:w-auto mt-4 md:mt-0">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">Admin Controls</p>
                <p className="text-sm text-muted-foreground">Manage your workflow</p>
              </div>
              <Badge className="ml-2 bg-primary hover:bg-primary/90">
                <a href="/admin/panel">Open Panel</a>
              </Badge>
            </CardContent>
          </Card>
        )}
        
        {role === "sales" && (
          <Card className="w-full md:w-auto mt-4 md:mt-0">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">Sales Dashboard</p>
                <p className="text-sm text-muted-foreground">Track your orders</p>
              </div>
              <Badge className="ml-2 bg-primary hover:bg-primary/90">
                <a href="/orders/create">New Order</a>
              </Badge>
            </CardContent>
          </Card>
        )}
        
        {role !== "admin" && role !== "sales" && (
          <Card className="w-full md:w-auto mt-4 md:mt-0">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{department} Dashboard</p>
                <p className="text-sm text-muted-foreground">View your tasks</p>
              </div>
              <Badge className="ml-2 bg-primary hover:bg-primary/90">
                <a href="/tasks">My Tasks</a>
              </Badge>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Department-specific alert */}
      <Alert className="bg-card border-primary/20">
        <AlertTitle className="flex items-center text-primary">
          {getDepartmentIcon()}
          <span className="ml-2">{department} Department Overview</span>
        </AlertTitle>
        <AlertDescription>
          {role === "admin" && "View and manage all departments and operations across the print workflow."}
          {role === "sales" && "Track your client orders and manage customer relationships."}
          {role === "design" && "Monitor design tasks and approve client artwork."}
          {role === "prepress" && "Track file preparations and plate-making tasks."}
          {role === "production" && "Manage print production and finishing operations."}
        </AlertDescription>
      </Alert>

      {/* Stat cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Orders"
          value={stats.total.toString()}
          icon={<Package className="h-4 w-4" />}
          description={isAdminOrSales ? "Across all departments" : "Assigned to you"}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress.toString()}
          icon={<Clock className="h-4 w-4" />}
          description="Currently being processed"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Completed"
          value={stats.completed.toString()}
          icon={<CheckCircle className="h-4 w-4" />}
          description="Successfully delivered"
          trend={{ value: 18, isPositive: true }}
        />
        {isAdminOrSales && (
          <StatCard
            title="Total Revenue"
            value={stats.revenue || "₹0"}
            icon={<CircleDollarSign className="h-4 w-4" />}
            description="This month"
            trend={{ value: 5, isPositive: true }}
          />
        )}
      </div>

      {/* Department-specific metrics */}
      {role === "design" && (
        <Card>
          <CardHeader>
            <CardTitle>Design Metrics</CardTitle>
            <CardDescription>
              Current design workload and performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Artwork Approval Rate
                </p>
                <p className="text-2xl font-bold">86%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  +4% from last month
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Average Design Time
                </p>
                <p className="text-2xl font-bold">2.3 days</p>
                <p className="text-xs text-muted-foreground mt-1">
                  -0.5 days from last month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {role === "prepress" && (
        <Card>
          <CardHeader>
            <CardTitle>Prepress Metrics</CardTitle>
            <CardDescription>
              Current prepress workload and performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  File Processing Rate
                </p>
                <p className="text-2xl font-bold">92%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  +2% from last month
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Average Prepress Time
                </p>
                <p className="text-2xl font-bold">1.8 days</p>
                <p className="text-xs text-muted-foreground mt-1">
                  -0.3 days from last month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {role === "production" && (
        <Card>
          <CardHeader>
            <CardTitle>Production Metrics</CardTitle>
            <CardDescription>
              Current production workload and performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Machine Utilization
                </p>
                <p className="text-2xl font-bold">78%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  +5% from last month
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Delivery On-Time Rate
                </p>
                <p className="text-2xl font-bold">94%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  +2% from last month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts for admin/sales */}
      {isAdminOrSales && (
        <div className="grid gap-4 md:grid-cols-2">
          <StatusChart />
          <RevenueChart />
        </div>
      )}

      {/* Recent orders - shown to all roles but filtered for non-admin/sales */}
      <RecentOrders />
    </div>
  );
};

export default Dashboard;
