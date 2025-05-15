
import { Link } from "react-router-dom";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
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
  deliveryAddress: string;
}

interface OrdersTableProps {
  orders: Order[];
  formatDate: (timestamp: Timestamp) => string;
  formatCurrency: (amount: number) => string;
  getStatusClass: (status: string) => string;
  formatStatus: (status: string) => string;
  onDeleteOrder: (id: string) => void;
}

const OrdersTable = ({
  orders,
  formatDate,
  formatCurrency,
  getStatusClass,
  formatStatus,
  onDeleteOrder
}: OrdersTableProps) => {
  if (orders.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={7} className="text-center py-8">
          <p className="text-lg font-medium">No orders yet</p>
          <p className="text-muted-foreground">
            Create your first order to get started
          </p>
          <Link to="/orders/create">
            <Button className="mt-4">
              <Plus size={16} className="mr-2" />
              Create Order
            </Button>
          </Link>
        </TableCell>
      </TableRow>
    );
  }
  
  return (
    <>
      {orders.map((order) => (
        <TableRow key={order.id}>
          <TableCell className="font-medium">{order.orderNumber}</TableCell>
          <TableCell>{order.clientName}</TableCell>
          <TableCell>{formatDate(order.createdAt)}</TableCell>
          <TableCell>
            <Badge className={getStatusClass(order.status)}>
              {formatStatus(order.status)}
            </Badge>
          </TableCell>
          <TableCell>{order.products?.length || 0}</TableCell>
          <TableCell>{formatCurrency(order.orderAmount)}</TableCell>
          <TableCell className="text-right">
            <div className="flex justify-end">
              <Link to={`/order/${order.id}`}>
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
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
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default OrdersTable;
