
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Calendar, 
  ChevronDown, 
  Download, 
  Eye, 
  Filter, 
  MoreHorizontal, 
  Plus, 
  Search, 
  Loader2
} from "lucide-react";
import { format } from "date-fns";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, Timestamp, where, deleteDoc, doc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

type Order = {
  id: string;
  orderNumber: string;
  clientName: string;
  createdAt: Timestamp;
  status: string;
  orderAmount: number;
  products: any[];
  deliveryAddress: string;
};

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    let ordersQuery;
    
    if (filterStatus) {
      ordersQuery = query(
        collection(db, "orders"),
        where("status", "==", filterStatus),
        orderBy("createdAt", "desc")
      );
    } else {
      ordersQuery = query(
        collection(db, "orders"),
        orderBy("createdAt", "desc")
      );
    }
    
    const unsubscribe = onSnapshot(
      ordersQuery,
      (snapshot) => {
        const ordersData = snapshot.docs.map(doc => {
          const data = doc.data() as Omit<Order, 'id'>;
          return { id: doc.id, ...data };
        });
        setOrders(ordersData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching orders:", error);
        toast({
          title: "Error",
          description: "Failed to fetch orders. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
      }
    );
    
    return () => unsubscribe();
  }, [filterStatus, toast]);
  
  // Filter orders based on search term
  const filteredOrders = orders.filter(order => 
    order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.deliveryAddress?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp || !timestamp.toDate) return "N/A";
    return format(timestamp.toDate(), "MMM d, yyyy");
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
  
  const handleDeleteOrder = async (orderId: string) => {
    if (window.confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
      try {
        await deleteDoc(doc(db, "orders", orderId));
        toast({
          title: "Order Deleted",
          description: "The order has been successfully deleted.",
        });
      } catch (error) {
        console.error("Error deleting order:", error);
        toast({
          title: "Error",
          description: "Failed to delete the order. Please try again.",
          variant: "destructive",
        });
      }
    }
  };
  
  const exportOrders = () => {
    // In a real app, this would generate a CSV or Excel file
    toast({
      title: "Export Started",
      description: "Your orders data is being prepared for download.",
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">
            View and manage all customer orders.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Link to="/orders/create">
            <Button className="flex items-center gap-1">
              <Plus size={16} />
              <span>New Order</span>
            </Button>
          </Link>
          <Button variant="outline" className="flex items-center gap-1" onClick={exportOrders}>
            <Download size={16} />
            <span>Export</span>
          </Button>
        </div>
      </div>
      
      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search orders by ID, customer or address..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilterStatus(null)}>
                All Orders
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("Order_Received")}>
                Order Received
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("Design_InProgress")}>
                Design In Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("Prepress_InProgress")}>
                Prepress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("Production_Printing")}>
                Production
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("ReadyToDispatch")}>
                Ready to Dispatch
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("Completed")}>
                Completed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Date Range</span>
          </Button>
        </div>
      </div>
      
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
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
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
                                  onClick={() => handleDeleteOrder(order.id)}
                                >
                                  Delete Order
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        {searchTerm || filterStatus ? (
                          <>
                            <p className="text-lg font-medium">No matching orders found</p>
                            <p className="text-muted-foreground">
                              Try adjusting your search or filter criteria
                            </p>
                          </>
                        ) : (
                          <>
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
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Orders Cards (mobile) */}
          <div className="grid gap-4 md:hidden">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
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
                              onClick={() => handleDeleteOrder(order.id)}
                            >
                              Delete Order
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center text-center p-6">
                  {searchTerm || filterStatus ? (
                    <>
                      <p className="text-lg font-medium">No matching orders found</p>
                      <p className="text-muted-foreground mt-1">
                        Try adjusting your search or filter criteria
                      </p>
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}
      
      {/* Pagination placeholder */}
      {filteredOrders.length > 0 && (
        <div className="flex items-center justify-center pt-4">
          <Button variant="outline" size="sm" className="mx-1" disabled>Previous</Button>
          <Button variant="default" size="sm" className="mx-1">1</Button>
          <Button variant="outline" size="sm" className="mx-1" disabled>Next</Button>
        </div>
      )}
    </div>
  );
};

export default Orders;
