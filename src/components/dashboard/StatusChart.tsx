
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useEffect, useState } from "react";
import { getOrdersWithRealTimeUpdates } from "@/lib/firebase";
import { Order } from "@/lib/firebase/types";
import { Loader2 } from "lucide-react";

const StatusChart = () => {
  const [loading, setLoading] = useState(true);
  const [statusData, setStatusData] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = getOrdersWithRealTimeUpdates((orders) => {
      const statusCounts: Record<string, number> = {};
      
      // Group orders by status
      orders.forEach((order: Order) => {
        const statusGroup = order.status.split('_')[0]; // Group by first part of status
        statusCounts[statusGroup] = (statusCounts[statusGroup] || 0) + 1;
      });
      
      // Map to chart data format
      const chartData = [
        { name: "Design", value: statusCounts["Design"] || 0, color: "#3b82f6" },  // Blue
        { name: "Prepress", value: statusCounts["Prepress"] || 0, color: "#8b5cf6" }, // Purple
        { name: "Production", value: statusCounts["Production"] || 0, color: "#f59e0b" }, // Amber
        { name: "Ready to Dispatch", value: statusCounts["ReadyToDispatch"] || 0, color: "#10b981" }, // Green
        { name: "Order", value: statusCounts["Order"] || 0, color: "#64748b" }, // Slate
        { name: "Completed", value: statusCounts["Completed"] || 0, color: "#6b7280" }, // Gray
      ].filter(item => item.value > 0);  // Only show statuses with orders
      
      setStatusData(chartData);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Orders by Status</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Orders by Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--background)', color: 'var(--foreground)', borderColor: 'var(--border)' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No order data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusChart;
