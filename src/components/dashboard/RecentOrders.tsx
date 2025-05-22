
import React from 'react';
import { Link } from 'react-router-dom';
import { Order } from '@/lib/firebase/types';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface RecentOrdersProps {
  orders: Order[];
  limit: number;
  showAmount: boolean;
}

const RecentOrders: React.FC<RecentOrdersProps> = ({ orders, limit, showAmount }) => {
  // Sort orders by creation date (newest first)
  const sortedOrders = [...orders].sort((a, b) => {
    // Handle both Firebase Timestamp and MockTimestamp objects
    const aTime = a.createdAt.toDate ? a.createdAt.toDate().getTime() : 
                 (a.createdAt.getSeconds ? a.createdAt.getSeconds() * 1000 : new Date(a.createdAt).getTime());
    const bTime = b.createdAt.toDate ? b.createdAt.toDate().getTime() : 
                 (b.createdAt.getSeconds ? b.createdAt.getSeconds() * 1000 : new Date(b.createdAt).getTime());
    return bTime - aTime;
  }).slice(0, limit);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get status color based on order status
  const getStatusColor = (status: string) => {
    if (status.startsWith('Order_')) return 'bg-amber-100 text-amber-800';
    if (status.includes('Design_')) return 'bg-blue-100 text-blue-800';
    if (status.includes('Prepress_')) return 'bg-indigo-100 text-indigo-800';
    if (status.includes('Production_')) return 'bg-purple-100 text-purple-800';
    if (status === 'Completed') return 'bg-green-100 text-green-800';
    if (status === 'Cancelled') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  // Helper function to safely get date from timestamp
  const getDateFromTimestamp = (timestamp: any) => {
    if (!timestamp) return new Date();
    if (typeof timestamp.toDate === 'function') return timestamp.toDate();
    if (timestamp.getSeconds) return new Date(timestamp.getSeconds() * 1000);
    return new Date(timestamp);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
      {sortedOrders.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          No orders found
        </div>
      ) : (
        <div className="space-y-4">
          {sortedOrders.map((order) => (
            <div key={order.id} className="border rounded-md p-4">
              <div className="flex justify-between items-start">
                <div>
                  <Link
                    to={`/orders/${order.id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    Order #{order.orderNumber}
                  </Link>
                  <div className="text-sm text-muted-foreground mt-1">
                    {order.clientName} • {formatDistanceToNow(getDateFromTimestamp(order.createdAt), { addSuffix: true })}
                  </div>
                  <div className="mt-2 flex gap-2">
                    <Badge variant="outline" className={getStatusColor(order.status)}>
                      {order.status.replace(/_/g, ' ')}
                    </Badge>
                    {showAmount && (
                      <Badge variant="outline" className={
                        order.paymentStatus === 'paid' 
                          ? 'bg-green-100 text-green-800'
                          : (order.paymentStatus === 'partial' 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-red-100 text-red-800')
                      }>
                        {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                      </Badge>
                    )}
                  </div>
                </div>
                {showAmount && (
                  <div className="text-right">
                    <div className="font-semibold">
                      {formatCurrency(order.orderAmount)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentOrders;
