
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DepartmentType, Order, OrderProduct } from "@/lib/firebase/types";
import { getOrdersByDepartment } from "@/lib/mockData";
import { Link } from "react-router-dom";
import { format } from "date-fns";

interface DepartmentDashboardProps {
  userRole: string;
  department: DepartmentType;
  userName: string;
}

const DepartmentDashboard = ({ userRole, department, userName }: DepartmentDashboardProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("assigned");
  
  useEffect(() => {
    const loadOrders = () => {
      setLoading(true);
      
      const unsubscribe = getOrdersByDepartment(department, (fetchedOrders) => {
        setOrders(fetchedOrders);
        setLoading(false);
      });
      
      return unsubscribe;
    };
    
    const unsubscribe = loadOrders();
    
    return () => {
      unsubscribe();
    };
  }, [department]);

  // Filter orders for different tabs
  const pendingOrders = orders.filter(order => {
    // Design department: orders that need design work
    if (department === "design") {
      return order.products.some(p => p.designStatus === "pending" || p.designStatus === "inProgress" || p.designStatus === "needsRevision");
    }
    // Prepress department: orders that need prepress work
    if (department === "prepress") {
      return order.products.some(p => p.prepressStatus === "pending" || p.prepressStatus === "inProgress" || p.prepressStatus === "needsRevision");
    }
    // Production department: orders that need production work
    if (department === "production") {
      return order.products.some(p => p.productionStatus === "pending" || p.productionStatus === "inProcess");
    }
    return false;
  });
  
  const pendingApprovalOrders = orders.filter(order => {
    // Products that were sent for approval
    return order.products.some(product => {
      if (department === "design") {
        return product.designStatus === "pendingApproval";
      }
      if (department === "prepress") {
        return product.prepressStatus === "pendingApproval";
      }
      if (department === "production") {
        return product.productionStatus === "readyToDispatch";
      }
      return false;
    });
  });
  
  const completedOrders = orders.filter(order => {
    // Orders where all products have been completed by this department
    if (department === "design") {
      return order.products.every(p => p.designStatus === "approved");
    }
    if (department === "prepress") {
      return order.products.every(p => p.prepressStatus === "approved");
    }
    if (department === "production") {
      return order.products.every(p => p.productionStatus === "complete");
    }
    return false;
  });

  // Format date helper function
  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000);
    return format(date, "MMM d, yyyy");
  };
  
  // Get status badge color
  const getStatusBadge = (status: string | undefined) => {
    if (!status) return "bg-gray-100 text-gray-800";
    
    if (status === "pending") return "bg-yellow-100 text-yellow-800";
    if (status === "inProgress" || status === "inProcess") return "bg-blue-100 text-blue-800";
    if (status === "pendingApproval") return "bg-amber-100 text-amber-800";
    if (status === "needsRevision") return "bg-red-100 text-red-800";
    if (status === "approved" || status === "complete") return "bg-green-100 text-green-800";
    if (status === "readyToDispatch") return "bg-indigo-100 text-indigo-800";
    
    return "bg-gray-100 text-gray-800";
  };

  // Get product status based on department
  const getProductStatus = (product: OrderProduct) => {
    if (department === "design") return product.designStatus;
    if (department === "prepress") return product.prepressStatus;
    if (department === "production") return product.productionStatus;
    return "";
  };

  // Format status label
  const formatStatus = (status: string | undefined) => {
    if (!status) return "Not Set";
    
    return status
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">
          {department.charAt(0).toUpperCase() + department.slice(1)} Department Dashboard
        </h2>
        <p className="text-muted-foreground">
          Welcome {userName}, manage your {department} tasks and assignments below.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Pending Tasks</CardTitle>
            <CardDescription>Orders waiting for your action</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingOrders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Pending Approvals</CardTitle>
            <CardDescription>Orders waiting for approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingApprovalOrders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Completed</CardTitle>
            <CardDescription>Successfully completed orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completedOrders.length}</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="assigned">Assigned Orders</TabsTrigger>
          <TabsTrigger value="pending-approval">Pending Approval</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="assigned">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Orders</CardTitle>
              <CardDescription>Orders assigned to your department that need action</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center p-4">Loading...</div>
              ) : pendingOrders.length > 0 ? (
                <div className="space-y-4">
                  {pendingOrders.map((order) => (
                    <div key={order.id} className="border rounded-md p-4 space-y-3 group hover:bg-muted/50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <h3 className="font-semibold text-foreground">Order #{order.orderNumber}</h3>
                            <Badge 
                              className={`ml-2 ${order.status.startsWith(department.charAt(0).toUpperCase() + department.slice(1)) ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}
                            >
                              {formatStatus(order.status)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {order.clientName} • Created on {formatDate(order.createdAt)}
                          </p>
                          {order.assignedByName && (
                            <p className="text-sm text-muted-foreground">
                              Assigned by: {order.assignedByName}
                            </p>
                          )}
                        </div>
                        <Button asChild size="sm" variant="outline">
                          <Link to={`/orders/${order.id}`}>View Order</Link>
                        </Button>
                      </div>
                      
                      <div className="mt-3 space-y-1">
                        <h4 className="font-medium text-sm">Products:</h4>
                        <div className="space-y-2">
                          {order.products.map((product) => (
                            <div key={product.id} className="text-sm flex items-center gap-2">
                              <span className="grow">{product.name} (× {product.quantity})</span>
                              <Badge className={getStatusBadge(getProductStatus(product))}>
                                {formatStatus(getProductStatus(product))}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No orders assigned to your department.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pending-approval">
          <Card>
            <CardHeader>
              <CardTitle>Pending Approval</CardTitle>
              <CardDescription>Orders waiting for client/manager approval</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center p-4">Loading...</div>
              ) : pendingApprovalOrders.length > 0 ? (
                <div className="space-y-4">
                  {pendingApprovalOrders.map((order) => (
                    <div key={order.id} className="border rounded-md p-4 space-y-3 group hover:bg-muted/50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <h3 className="font-semibold text-foreground">Order #{order.orderNumber}</h3>
                            <Badge className="ml-2 bg-amber-100 text-amber-800">
                              Pending Approval
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {order.clientName} • Sent for approval on {formatDate(order.updatedAt || order.createdAt)}
                          </p>
                          {order.assignedByName && (
                            <p className="text-sm text-muted-foreground">
                              Approval waiting from: {order.assignedByName || order.createdByName}
                            </p>
                          )}
                        </div>
                        <Button asChild size="sm" variant="outline">
                          <Link to={`/orders/${order.id}`}>View Order</Link>
                        </Button>
                      </div>
                      
                      <div className="mt-3 space-y-1">
                        <h4 className="font-medium text-sm">Products:</h4>
                        <div className="space-y-2">
                          {order.products.map((product) => {
                            const status = getProductStatus(product);
                            return status === "pendingApproval" ? (
                              <div key={product.id} className="text-sm flex items-center gap-2">
                                <span className="grow">{product.name} (× {product.quantity})</span>
                                <Badge className={getStatusBadge(status)}>
                                  {formatStatus(status)}
                                </Badge>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No orders are currently pending approval.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed Orders</CardTitle>
              <CardDescription>Orders completed by your department</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center p-4">Loading...</div>
              ) : completedOrders.length > 0 ? (
                <div className="space-y-4">
                  {completedOrders.map((order) => (
                    <div key={order.id} className="border rounded-md p-4 space-y-3 group hover:bg-muted/50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <h3 className="font-semibold text-foreground">Order #{order.orderNumber}</h3>
                            <Badge className="ml-2 bg-green-100 text-green-800">
                              Completed
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {order.clientName} • Completed on {formatDate(order.updatedAt || order.createdAt)}
                          </p>
                        </div>
                        <Button asChild size="sm" variant="outline">
                          <Link to={`/orders/${order.id}`}>View Order</Link>
                        </Button>
                      </div>
                      
                      <div className="mt-3 space-y-1">
                        <h4 className="font-medium text-sm">Products:</h4>
                        <div className="space-y-2">
                          {order.products.map((product) => (
                            <div key={product.id} className="text-sm flex items-center gap-2">
                              <span className="grow">{product.name} (× {product.quantity})</span>
                              <Badge className={getStatusBadge(getProductStatus(product))}>
                                {formatStatus(getProductStatus(product))}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No completed orders found.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DepartmentDashboard;
