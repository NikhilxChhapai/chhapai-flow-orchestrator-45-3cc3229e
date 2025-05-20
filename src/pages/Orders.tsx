
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { getOrdersWithRealTimeUpdates } from "@/lib/firebase"; 
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

// Import our new components
import OrdersHeader from "@/components/orders/OrdersHeader";
import OrdersFilter from "@/components/orders/OrdersFilter";
import OrdersTable from "@/components/orders/OrdersTable";
import OrdersMobileView from "@/components/orders/OrdersMobileView";
import OrdersPagination from "@/components/orders/OrdersPagination";
import DeleteOrderDialog from "@/components/orders/DeleteOrderDialog";
import { Order } from "@/lib/firebase/types";

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null);
  const [deleteOrderNumber, setDeleteOrderNumber] = useState<string>('');
  const { toast } = useToast();
  
  useEffect(() => {
    // Use Firebase data service
    const unsubscribe = getOrdersWithRealTimeUpdates((fetchedOrders) => {
      let filteredOrders = fetchedOrders;
      
      // Apply status filter if needed
      if (filterStatus) {
        filteredOrders = fetchedOrders.filter(order => order.status === filterStatus);
      }
      
      setOrders(filteredOrders);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [filterStatus]);
  
  // Filter orders based on search term
  const filteredOrders = orders.filter(order => 
    order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.deliveryAddress?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    return timestamp.toDate ? 
      format(timestamp.toDate(), "MMM d, yyyy") :
      format(new Date(timestamp.seconds * 1000), "MMM d, yyyy");
  };
  
  const formatCurrency = (amount: number) => {
    if (typeof amount !== 'number') return "₹0.00";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount);
  };
  
  const getStatusClass = (status: string) => {
    if (status.includes("Design")) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    if (status.includes("Prepress")) return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    if (status.includes("Production")) return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
    if (status === "ReadyToDispatch") return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    if (status === "Completed") return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  };
  
  const formatStatus = (status: string) => {
    return status
      .replace(/_/g, " ")
      .replace(/([A-Z])/g, " $1")
      .trim();
  };
  
  const handleDeleteOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      setDeleteOrderId(orderId);
      setDeleteOrderNumber(order.orderNumber);
    }
  };
  
  const closeDeleteDialog = () => {
    setDeleteOrderId(null);
    setDeleteOrderNumber('');
  };
  
  const exportOrders = () => {
    toast({
      title: "Export Started",
      description: "Your orders data is being prepared for download.",
    });
  };

  // Pagination 
  const ordersPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ordersPerPage));
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Get current orders for pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <OrdersHeader onExport={exportOrders} />
      
      <OrdersFilter 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Orders Table (desktop) */}
          <Card className="hidden md:block">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <OrdersTable
                    orders={currentOrders}
                    formatDate={formatDate}
                    formatCurrency={formatCurrency}
                    getStatusClass={getStatusClass}
                    formatStatus={formatStatus}
                    onDeleteOrder={handleDeleteOrder}
                  />
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Orders Cards (mobile) */}
          <div className="md:hidden">
            <OrdersMobileView
              orders={currentOrders}
              formatDate={formatDate}
              formatCurrency={formatCurrency}
              getStatusClass={getStatusClass}
              formatStatus={formatStatus}
              onDeleteOrder={handleDeleteOrder}
            />
          </div>
        </>
      )}
      
      {filteredOrders.length > 0 && (
        <OrdersPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
      
      {deleteOrderId && (
        <DeleteOrderDialog
          isOpen={!!deleteOrderId}
          onClose={closeDeleteDialog}
          orderId={deleteOrderId}
          orderNumber={deleteOrderNumber}
        />
      )}
    </div>
  );
};

export default Orders;
