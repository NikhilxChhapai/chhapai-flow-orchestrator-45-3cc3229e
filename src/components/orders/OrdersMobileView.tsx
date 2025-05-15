
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
        <Card key={order.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                <p className="text-sm text-muted-foreground">{order.clientName}</p>
              </div>
              <Badge className={getStatusClass(order.status)}>
                {formatStatus(order.status)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-1">
                <div className="text-sm text-muted-foreground">Date:</div>
                <div className="text-sm">{formatDate(order.createdAt)}</div>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <div className="text-sm text-muted-foreground">Items:</div>
                <div className="text-sm">{order.products?.length || 0}</div>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <div className="text-sm text-muted-foreground">Total:</div>
                <div className="text-sm font-medium">{formatCurrency(order.orderAmount)}</div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <Link to={`/order/${order.id}`}>
                  <Button size="sm" className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>View</span>
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      onClick={() => window.open(`/orders/edit/${order.id}`, '_blank')}
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
