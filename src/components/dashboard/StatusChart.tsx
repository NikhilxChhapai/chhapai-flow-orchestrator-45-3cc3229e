
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

// Mock data for the chart
const mockData = [
  { name: "Design", value: 12, color: "#3b82f6" },  // Blue
  { name: "Prepress", value: 8, color: "#8b5cf6" }, // Purple
  { name: "Production", value: 15, color: "#f59e0b" }, // Amber
  { name: "Ready to Dispatch", value: 5, color: "#10b981" }, // Green
  { name: "Completed", value: 20, color: "#6b7280" }, // Gray
];

const StatusChart = () => {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Orders by Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={mockData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {mockData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusChart;
