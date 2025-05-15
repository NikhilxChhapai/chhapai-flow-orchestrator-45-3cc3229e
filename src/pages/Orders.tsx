
import React, { useState } from 'react';
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
  SlidersHorizontal 
} from "lucide-react";

interface Order {
  id: string;
  customerName: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: number;
  address: string;
}

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  
  // Sample orders data
  const orderData: Order[] = [
    {
      id: "ORD-2023-5501",
      customerName: "Alex Johnson",
      date: "2025-05-10",
      status: "delivered",
      total: 1250.99,
      items: 3,
      address: "123 Main St, New York, NY"
    },
    {
      id: "ORD-2023-5502",
      customerName: "Sarah Williams",
      date: "2025-05-12",
      status: "processing",
      total: 450.50,
      items: 2,
      address: "456 Oak Ave, Los Angeles, CA"
    },
    {
      id: "ORD-2023-5503",
      customerName: "Michael Brown",
      date: "2025-05-13",
      status: "pending",
      total: 899.95,
      items: 4,
      address: "789 Pine St, Chicago, IL"
    },
    {
      id: "ORD-2023-5504",
      customerName: "Emily Davis",
      date: "2025-05-15",
      status: "shipped",
      total: 375.25,
      items: 1,
      address: "101 Cedar Rd, Boston, MA"
    },
    {
      id: "ORD-2023-5505",
      customerName: "Robert Wilson",
      date: "2025-05-08",
      status: "cancelled",
      total: 1100.00,
      items: 5,
      address: "202 Elm St, Dallas, TX"
    },
    {
      id: "ORD-2023-5506",
      customerName: "Jennifer Martinez",
      date: "2025-05-14",
      status: "processing",
      total: 780.45,
      items: 3,
      address: "303 Birch Ln, Denver, CO"
    },
    {
      id: "ORD-2023-5507",
      customerName: "David Anderson",
      date: "2025-05-11",
      status: "delivered",
      total: 2200.75,
      items: 7,
      address: "404 Spruce Dr, Seattle, WA"
    },
    {
      id: "ORD-2023-5508",
      customerName: "Lisa Taylor",
      date: "2025-05-09",
      status: "shipped",
      total: 495.65,
      items: 2,
      address: "505 Maple Ct, Miami, FL"
    }
  ];
  
  // Filter and search orders
  const filteredOrders = orderData
    .filter(order => !filterStatus || order.status === filterStatus)
    .filter(order => 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    processing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    shipped: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    delivered: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
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
          <Button variant="outline" className="flex items-center gap-1">
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
              <DropdownMenuItem onClick={() => setFilterStatus("pending")}>
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("processing")}>
                Processing
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("shipped")}>
                Shipped
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("delivered")}>
                Delivered
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("cancelled")}>
                Cancelled
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Date Range</span>
          </Button>
        </div>
      </div>
      
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
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{formatDate(order.date)}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[order.status]}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell>{formatCurrency(order.total)}</TableCell>
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
                          <DropdownMenuItem>Edit Order</DropdownMenuItem>
                          <DropdownMenuItem>Send Invoice</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            Cancel Order
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Orders Cards (mobile) */}
      <div className="grid gap-4 md:hidden">
        {filteredOrders.map((order) => (
          <Card key={order.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{order.id}</CardTitle>
                  <p className="text-sm text-muted-foreground">{order.customerName}</p>
                </div>
                <Badge className={statusColors[order.status]}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-1">
                  <div className="text-sm text-muted-foreground">Date:</div>
                  <div className="text-sm">{formatDate(order.date)}</div>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <div className="text-sm text-muted-foreground">Items:</div>
                  <div className="text-sm">{order.items}</div>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <div className="text-sm text-muted-foreground">Total:</div>
                  <div className="text-sm font-medium">{formatCurrency(order.total)}</div>
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
                      <DropdownMenuItem>Edit Order</DropdownMenuItem>
                      <DropdownMenuItem>Send Invoice</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        Cancel Order
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Pagination placeholder */}
      <div className="flex items-center justify-center pt-4">
        <Button variant="outline" size="sm" className="mx-1">Previous</Button>
        <Button variant="outline" size="sm" className="mx-1">1</Button>
        <Button variant="default" size="sm" className="mx-1">2</Button>
        <Button variant="outline" size="sm" className="mx-1">3</Button>
        <Button variant="outline" size="sm" className="mx-1">Next</Button>
      </div>
    </div>
  );
};

export default Orders;
