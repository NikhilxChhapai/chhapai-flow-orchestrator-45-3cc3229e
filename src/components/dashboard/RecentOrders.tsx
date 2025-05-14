
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

// Mock data for the table
const mockOrders = [
  {
    id: "ORD-2023-001",
    client: "ABC Enterprises",
    amount: "₹12,500",
    status: "Design_InProgress",
    date: "2023-05-14",
  },
  {
    id: "ORD-2023-002",
    client: "XYZ Corp",
    amount: "₹8,750",
    status: "Prepress_Approved",
    date: "2023-05-13",
  },
  {
    id: "ORD-2023-003",
    client: "123 Industries",
    amount: "₹15,200",
    status: "Production_Printing",
    date: "2023-05-12",
  },
  {
    id: "ORD-2023-004",
    client: "Global Tech",
    amount: "₹5,800",
    status: "ReadyToDispatch",
    date: "2023-05-11",
  },
  {
    id: "ORD-2023-005",
    client: "Local Business",
    amount: "₹3,200",
    status: "Design_AwaitingApproval",
    date: "2023-05-10",
  },
];

// Function to determine badge color based on status
const getStatusBadge = (status: string) => {
  if (status.includes("Design")) return "bg-blue-500";
  if (status.includes("Prepress")) return "bg-purple-500";
  if (status.includes("Production")) return "bg-amber-500";
  if (status === "ReadyToDispatch") return "bg-green-500";
  if (status === "Completed") return "bg-gray-500";
  return "bg-gray-500";
};

// Function to convert status to a more readable format
const formatStatus = (status: string) => {
  return status
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .trim();
};

const RecentOrders = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Client</TableHead>
                {!isMobile && <TableHead>Amount</TableHead>}
                <TableHead>Status</TableHead>
                {!isMobile && <TableHead>Date</TableHead>}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium whitespace-nowrap">{order.id}</TableCell>
                  <TableCell className="max-w-[180px] truncate">{order.client}</TableCell>
                  {!isMobile && <TableCell>{order.amount}</TableCell>}
                  <TableCell>
                    <Badge className={getStatusBadge(order.status)}>
                      {isMobile ? formatStatus(order.status).split(' ')[0] : formatStatus(order.status)}
                    </Badge>
                  </TableCell>
                  {!isMobile && <TableCell>{order.date}</TableCell>}
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate(`/order/${order.id}`)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 flex justify-end">
          <Button 
            variant="outline" 
            onClick={() => navigate('/orders')}
          >
            View All Orders
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentOrders;
