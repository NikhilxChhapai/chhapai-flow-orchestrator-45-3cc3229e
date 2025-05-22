
import { Link } from "react-router-dom";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Eye, MoreHorizontal, Plus } from "lucide-react";
import { Timestamp } from "firebase/firestore";
import { cn } from "@/lib/utils";

interface Order {
  id: string;
  orderNumber: string;
  clientName: string;
  createdAt: Timestamp;
  status: string;
  orderAmount: number;
  products: any[];
}

interface OrdersMobileViewProps {
  orders: Order[];
  formatDate: (timestamp: Timestamp) => string;
  formatCurrency: (amount: number) => string;
  getStatusClass: (status: string) => string;
  formatStatus: (status: string) => string;
  onDeleteOrder: (id: string) => void;
}

const OrdersMobileView = ({
  orders,
  formatDate,
  formatCurrency,
  getStatusClass,
  formatStatus,
  onDeleteOrder
}: OrdersMobileViewProps) => {
  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center text-center p-6">
          <p className="text-lg font-medium">No orders yet</p>
          <p className="text-muted-foreground mt-1">
            Create your first order to get started
          </p>
          <Link to="/orders/create">
            <Button className="mt-4">
              <Plus size={16} className="mr-2" />
              Create Order
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="grid gap-4">
      {orders.map((order) => (
        <Card key={order.id} className="overflow-hidden">
          <CardHeader className="pb-2 bg-card">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <CardTitle className="text-base">{order.orderNumber}</CardTitle>
                  <Badge className={cn(getStatusClass(order.status), "text-xs")}>
                    {formatStatus(order.status)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{order.clientName}</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {formatDate(order.createdAt)}
              </span>
            </div>
          </CardHeader>
          <CardContent className="pb-3 pt-3">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-1">
                <div className="text-sm text-muted-foreground">Items:</div>
                <div className="text-sm">{order.products?.length || 0}</div>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <div className="text-sm text-muted-foreground">Total:</div>
                <div className="text-sm font-medium">{formatCurrency(order.orderAmount)}</div>
              </div>
              <div className="pt-3 flex justify-between items-center gap-2">
                <Link to={`/order/${order.id}`} className="flex-1">
                  <Button size="sm" className="w-full flex items-center justify-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>View Details</span>
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem 
                      onClick={() => window.location.href = `/orders/edit/${order.id}`}
                    >
                      Edit Order
                    </DropdownMenuItem>
                    <DropdownMenuItem>Send Invoice</DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-600"
                      onClick={() => onDeleteOrder(order.id)}
                    >
                      Delete Order
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OrdersMobileView;
