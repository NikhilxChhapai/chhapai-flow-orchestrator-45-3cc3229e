
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Order } from "@/lib/firebase/types";

interface SalesSummaryProps {
  orders: Order[];
}

const SalesSummary: React.FC<SalesSummaryProps> = ({ orders }) => {
  // Calculate total sales
  const totalSales = orders.reduce((sum, order) => sum + order.orderAmount, 0);
  
  // Calculate pending payments
  const pendingPayments = orders
    .filter(order => order.paymentStatus === 'unpaid' || order.paymentStatus === 'partial')
    .reduce((sum, order) => sum + order.orderAmount, 0);
  
  // Calculate paid orders
  const paidOrders = orders
    .filter(order => order.paymentStatus === 'paid')
    .reduce((sum, order) => sum + order.orderAmount, 0);
  
  // Format numbers as currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalSales)}</div>
          <p className="text-xs text-muted-foreground">
            For all time
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Paid Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(paidOrders)}</div>
          <p className="text-xs text-muted-foreground">
            {orders.filter(order => order.paymentStatus === 'paid').length} orders
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(pendingPayments)}</div>
          <p className="text-xs text-muted-foreground">
            {orders.filter(order => order.paymentStatus === 'unpaid' || order.paymentStatus === 'partial').length} orders
          </p>
        </CardContent>
      </Card>
    </>
  );
};

export default SalesSummary;
