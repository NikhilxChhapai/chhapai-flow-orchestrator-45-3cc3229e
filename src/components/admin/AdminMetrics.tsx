
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const dummyData = [
  { department: "Design", activeOrders: 12, completedOrders: 45 },
  { department: "Prepress", activeOrders: 8, completedOrders: 32 },
  { department: "Production", activeOrders: 15, completedOrders: 28 },
  { department: "Dispatch", activeOrders: 5, completedOrders: 20 },
];

const AdminMetrics = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Department Performance</CardTitle>
          <CardDescription>Order processing metrics by department</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dummyData}
                margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="activeOrders" name="Active Orders" fill="#8884d8" />
                <Bar dataKey="completedOrders" name="Completed Orders" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>Current system health and metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Database Status</span>
              <span className="text-green-500 font-medium">Active</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Storage Usage</span>
              <span className="text-amber-500 font-medium">68%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>API Health</span>
              <span className="text-green-500 font-medium">100%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Last System Backup</span>
              <span className="text-muted-foreground">2 days ago</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Activity</CardTitle>
          <CardDescription>Recent user activity metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Active Users Today</span>
              <span className="font-medium">24</span>
            </div>
            <div className="flex justify-between items-center">
              <span>New Orders (48h)</span>
              <span className="font-medium">37</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Support Tickets</span>
              <span className="font-medium">6</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Login Attempts</span>
              <span className="font-medium">152</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMetrics;
