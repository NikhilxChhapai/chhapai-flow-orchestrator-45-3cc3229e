
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import { getOrdersWithRealTimeUpdates } from "@/lib/firebase";
import { Order } from "@/lib/firebase/types";
import { format, subMonths } from "date-fns";
import { Loader2 } from "lucide-react";

const RevenueChart = () => {
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = getOrdersWithRealTimeUpdates((orders) => {
      // Get last 6 months for the chart
      const today = new Date();
      const monthsData: Record<string, number> = {};
      
      // Initialize last 6 months with zero values
      for (let i = 5; i >= 0; i--) {
        const monthDate = subMonths(today, i);
        const monthKey = format(monthDate, "MMM");
        monthsData[monthKey] = 0;
      }
      
      // Sum order amounts by month
      orders.forEach((order: Order) => {
        if (!order.createdAt) return;
        
        const orderDate = order.createdAt.toDate ? 
          order.createdAt.toDate() : 
          new Date(order.createdAt.seconds * 1000);
          
        // Only consider orders from last 6 months
        const sixMonthsAgo = subMonths(today, 6);
        if (orderDate >= sixMonthsAgo) {
          const monthKey = format(orderDate, "MMM");
          monthsData[monthKey] = (monthsData[monthKey] || 0) + order.orderAmount;
        }
      });
      
      // Convert to array for chart
      const chartData = Object.keys(monthsData).map(month => ({
        name: month,
        revenue: monthsData[month]
      }));
      
      setRevenueData(chartData);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const formatCurrency = (value: number) => `₹${(value / 1000).toFixed(0)}k`;

  if (loading) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Monthly Revenue</CardTitle>
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
        <CardTitle>Monthly Revenue</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          {revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={revenueData}
                margin={{
                  top: 5,
                  right: 10,
                  left: 10,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={formatCurrency} />
                <Tooltip formatter={(value) => [`₹${value}`, "Revenue"]} />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No revenue data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
