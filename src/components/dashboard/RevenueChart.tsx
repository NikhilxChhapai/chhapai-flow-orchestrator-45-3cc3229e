
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Mock data for the chart
const mockData = [
  { name: "Jan", revenue: 40000 },
  { name: "Feb", revenue: 30000 },
  { name: "Mar", revenue: 45000 },
  { name: "Apr", revenue: 52000 },
  { name: "May", revenue: 48000 },
  { name: "Jun", revenue: 62000 },
];

const RevenueChart = () => {
  const formatCurrency = (value: number) => `₹${(value / 1000).toFixed(0)}k`;

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Monthly Revenue</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={mockData}
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
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
