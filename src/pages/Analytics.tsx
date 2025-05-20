
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent 
} from "@/components/ui/chart";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { getOrdersWithRealTimeUpdates } from "@/lib/firebase";
import { Order } from "@/lib/firebase/types";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const Analytics = () => {
  const [date, setDate] = useState({
    from: new Date(new Date().setMonth(new Date().getMonth() - 6)),
    to: new Date(),
  });
  const [activeTab, setActiveTab] = useState("revenue");
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const unsubscribe = getOrdersWithRealTimeUpdates((fetchedOrders) => {
      setOrders(fetchedOrders);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  // Calculate revenue data by month
  const calculateRevenueData = () => {
    const months: { [key: string]: number } = {};
    const filteredOrders = orders.filter(order => {
      if (!order.createdAt || !date.from || !date.to) return false;
      const orderDate = order.createdAt.toDate ? order.createdAt.toDate() : new Date(order.createdAt.seconds * 1000);
      return orderDate >= date.from && orderDate <= date.to;
    });
    
    filteredOrders.forEach(order => {
      const orderDate = order.createdAt.toDate ? order.createdAt.toDate() : new Date(order.createdAt.seconds * 1000);
      const monthYear = format(orderDate, 'MMM yyyy');
      months[monthYear] = (months[monthYear] || 0) + order.orderAmount;
    });
    
    return Object.keys(months).map(month => ({
      month,
      revenue: months[month]
    }));
  };

  // Calculate orders count by month
  const calculateOrdersData = () => {
    const months: { [key: string]: number } = {};
    const filteredOrders = orders.filter(order => {
      if (!order.createdAt || !date.from || !date.to) return false;
      const orderDate = order.createdAt.toDate ? order.createdAt.toDate() : new Date(order.createdAt.seconds * 1000);
      return orderDate >= date.from && orderDate <= date.to;
    });
    
    filteredOrders.forEach(order => {
      const orderDate = order.createdAt.toDate ? order.createdAt.toDate() : new Date(order.createdAt.seconds * 1000);
      const monthYear = format(orderDate, 'MMM yyyy');
      months[monthYear] = (months[monthYear] || 0) + 1;
    });
    
    return Object.keys(months).map(month => ({
      month,
      value: months[month]
    }));
  };

  // Calculate category distribution
  const calculateCategoryData = () => {
    const categories: { [key: string]: number } = {};
    
    orders.forEach(order => {
      order.products.forEach(product => {
        const category = product.name.split(' ')[0]; // Using the first word as category for demo
        categories[category] = (categories[category] || 0) + 1;
      });
    });
    
    return Object.keys(categories).map(name => ({
      name,
      value: categories[name]
    }));
  };

  const revenueData = calculateRevenueData();
  const ordersData = calculateOrdersData();
  const categoryData = calculateCategoryData();

  const formatCurrency = (value: number) => `₹${(value / 1000).toFixed(0)}k`;
  
  if (loading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center h-96">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">Analytics</h1>
        <DatePickerWithRange 
          date={date} 
          setDate={setDate}
          className="w-full sm:w-auto"
        />
      </div>

      <Tabs defaultValue="revenue" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full sm:w-auto grid-cols-3">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Revenue Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={revenueData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis 
                      dataKey="month"
                      tick={{ fill: 'var(--foreground)' }}
                    />
                    <YAxis 
                      tickFormatter={formatCurrency}
                      tick={{ fill: 'var(--foreground)' }}
                    />
                    <Tooltip 
                      formatter={(value) => [`₹${value}`, "Revenue"]}
                      contentStyle={{ 
                        backgroundColor: 'var(--background)',
                        borderColor: 'var(--border)',
                        color: 'var(--foreground)'
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="revenue" 
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]} 
                      name="Revenue"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Month-over-Month Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={revenueData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis 
                        dataKey="month"
                        tick={{ fill: 'var(--foreground)' }}
                      />
                      <YAxis 
                        tickFormatter={formatCurrency}
                        tick={{ fill: 'var(--foreground)' }}
                      />
                      <Tooltip 
                        formatter={(value) => [`₹${value}`, "Revenue"]}
                        contentStyle={{ 
                          backgroundColor: 'var(--background)',
                          borderColor: 'var(--border)',
                          color: 'var(--foreground)'
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="hsl(var(--primary))"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Order Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={ordersData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis 
                      dataKey="month"
                      tick={{ fill: 'var(--foreground)' }}
                    />
                    <YAxis 
                      tick={{ fill: 'var(--foreground)' }}
                    />
                    <Tooltip 
                      formatter={(value) => [value, "Orders"]}
                      contentStyle={{ 
                        backgroundColor: 'var(--background)',
                        borderColor: 'var(--border)',
                        color: 'var(--foreground)'
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="value"
                      name="Orders"
                      stroke="hsl(var(--primary))"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Order Distribution by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={140}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
