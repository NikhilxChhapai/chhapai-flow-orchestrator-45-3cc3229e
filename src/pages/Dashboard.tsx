
import { useAuth } from "@/contexts/AuthContext";
import StatCard from "@/components/dashboard/StatCard";
import RecentOrders from "@/components/dashboard/RecentOrders";
import StatusChart from "@/components/dashboard/StatusChart";
import RevenueChart from "@/components/dashboard/RevenueChart";
import { Package, CheckCircle, Clock, CircleDollarSign } from "lucide-react";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const role = currentUser?.role || "sales";

  // We'll show different stats based on user role
  const isAdminOrSales = role === "admin" || role === "sales";

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {currentUser?.displayName || "User"}!</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Orders"
          value={isAdminOrSales ? "60" : "12"}
          icon={<Package className="h-4 w-4" />}
          description={isAdminOrSales ? "Across all departments" : "Assigned to you"}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="In Progress"
          value={isAdminOrSales ? "24" : "5"}
          icon={<Clock className="h-4 w-4" />}
          description="Currently being processed"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Completed"
          value={isAdminOrSales ? "32" : "7"}
          icon={<CheckCircle className="h-4 w-4" />}
          description="Successfully delivered"
          trend={{ value: 18, isPositive: true }}
        />
        {isAdminOrSales && (
          <StatCard
            title="Total Revenue"
            value="₹9,45,000"
            icon={<CircleDollarSign className="h-4 w-4" />}
            description="This month"
            trend={{ value: 5, isPositive: true }}
          />
        )}
      </div>

      {isAdminOrSales && (
        <div className="grid gap-4 md:grid-cols-2">
          <StatusChart />
          <RevenueChart />
        </div>
      )}

      <RecentOrders />
    </div>
  );
};

export default Dashboard;
