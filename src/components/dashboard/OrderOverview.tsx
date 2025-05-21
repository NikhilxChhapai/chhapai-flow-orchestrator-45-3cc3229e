
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Order } from "@/lib/firebase/types";

interface OrderOverviewProps {
  orders: Order[];
  showAmount: boolean;
}

const OrderOverview: React.FC<OrderOverviewProps> = ({ orders, showAmount }) => {
  // Count orders by status
  const pendingOrders = orders.filter(order => 
    order.status.startsWith('Order_') || 
    order.status.includes('InProgress') || 
    order.status.includes('PendingApproval')
  ).length;
  
  const inProcessOrders = orders.filter(order => 
    order.status.includes('Production_') ||
    order.status === 'ReadyToDispatch'
  ).length;
  
  const completedOrders = orders.filter(order => 
    order.status === 'Completed' || 
    order.status === 'Dispatched'
  ).length;
  
  // Format numbers as currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Total orders
  const totalOrders = orders.length;
  
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
            <path d="M12 8v4l3 3"></path>
            <circle cx="12" cy="12" r="10"></circle>
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingOrders}</div>
          <p className="text-xs text-muted-foreground">
            {((pendingOrders / totalOrders) * 100).toFixed(0)}% of total orders
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">In Process</CardTitle>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inProcessOrders}</div>
          <p className="text-xs text-muted-foreground">
            {((inProcessOrders / totalOrders) * 100).toFixed(0)}% of total orders
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed</CardTitle>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
            <path d="M20 6L9 17l-5-5"></path>
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedOrders}</div>
          <p className="text-xs text-muted-foreground">
            {((completedOrders / totalOrders) * 100).toFixed(0)}% of total orders
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderOverview;
