
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Pencil, ArrowLeft, Loader2, CheckCircle, AlertCircle, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import OrderHeader from "@/components/orders/OrderHeader";
import OrderProducts from "@/components/orders/OrderProducts";
import OrderProductsWorkflow from "@/components/orders/OrderProductsWorkflow";
import OrderTimeline from "@/components/orders/OrderTimeline";
import OrderSummary from "@/components/orders/OrderSummary";
import OrderDelivery from "@/components/orders/OrderDelivery";
import OrderPayment from "@/components/orders/OrderPayment";
import OrderNotes from "@/components/orders/OrderNotes";

import { getOrderWithRealTimeUpdates, updateOrderStatus, assignOrderToDepartment, updatePaymentStatus, updateOrder } from "@/lib/mockData";
import { Order, OrderStatus, DepartmentType, PaymentStatus, TimelineEvent } from "@/lib/firebase/types";
import { useAuth } from "@/contexts/AuthContext";
import { canUserUpdateOrderStatus, getNextStatuses, canUserAccessOrder } from "@/utils/workflowUtils";

const OrderDetails = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser } = useAuth();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [departmentDialogOpen, setDepartmentDialogOpen] = useState(false);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentType | "">("");
  const [note, setNote] = useState("");

  useEffect(() => {
    let unsubscribe: () => void;

    if (orderId) {
      unsubscribe = getOrderWithRealTimeUpdates(orderId, (orderData) => {
        if (orderData) {
          // Format dates for display
          if (orderData.timeline) {
            const formattedTimeline = orderData.timeline.map(event => ({
              ...event,
              formattedDate: new Date(event.date.seconds * 1000).toLocaleString(),
              note: event.note || "" // Ensure note is always defined
            }));
            orderData.timeline = formattedTimeline;
          }
          
          setOrder(orderData);
        } else {
          toast({
            title: "Order Not Found",
            description: "The requested order could not be found.",
            variant: "destructive",
          });
        }
        setLoading(false);
      });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [orderId, toast]);

  // Function to format order status for display
  const formatStatus = (status: string): string => {
    return status
      .replace(/_/g, " ")
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Function to get badge color based on status
  const getStatusBadge = (status: string): string => {
    if (status.startsWith("Order_")) return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    if (status.startsWith("Design_")) return "bg-indigo-100 text-indigo-800 hover:bg-indigo-200";
    if (status.startsWith("Prepress_")) return "bg-purple-100 text-purple-800 hover:bg-purple-200";
    if (status.startsWith("Production_")) return "bg-amber-100 text-amber-800 hover:bg-amber-200";
    if (status === "ReadyToDispatch") return "bg-green-100 text-green-800 hover:bg-green-200";
    if (status === "Completed") return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  };

  // Handle status update
  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    if (!order || !orderId) return;
    
    setUpdatingStatus(true);
    try {
      await updateOrderStatus(orderId, newStatus, `Status updated to ${formatStatus(newStatus)}`);
      
      toast({
        title: "Status Updated",
        description: `Order status has been updated to ${formatStatus(newStatus)}.`
      });
      
      // Auto-assign department based on status if enabled
      let department: DepartmentType | undefined;
      if (newStatus.startsWith("Design_")) {
        department = "design";
      } else if (newStatus.startsWith("Prepress_")) {
        department = "prepress";
      } else if (newStatus.startsWith("Production_")) {
        department = "production";
      } else if (newStatus === "ReadyToDispatch" || newStatus === "Completed") {
        department = "sales";
      }
      
      if (department && department !== order.assignedDept) {
        await assignOrderToDepartment(orderId, department, newStatus);
        toast({
          title: "Department Updated",
          description: `Order has been assigned to ${department} department.`
        });
      }
      
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update order status.",
        variant: "destructive"
      });
    } finally {
      setUpdatingStatus(false);
    }
  };
  
  // Handle department assignment
  const handleAssignDepartment = async () => {
    if (!order || !orderId || !selectedDepartment) return;
    
    setUpdatingStatus(true);
    try {
      // Determine appropriate status based on department
      let newStatus: OrderStatus = order.status;
      
      if (selectedDepartment === "design") {
        newStatus = "Design_InProgress";
      } else if (selectedDepartment === "prepress") {
        newStatus = "Prepress_InProgress";
      } else if (selectedDepartment === "production") {
        newStatus = "Production_Printing";
      }
      
      await assignOrderToDepartment(orderId, selectedDepartment, newStatus);
      
      // Add note if provided
      if (note) {
        await updateOrder(orderId, {
          remarks: order.remarks ? `${order.remarks}\n\n${note}` : note
        });
      }
      
      toast({
        title: "Department Assigned",
        description: `Order has been assigned to ${selectedDepartment} department.`
      });
      
      // Reset form
      setSelectedDepartment("");
      setNote("");
      setDepartmentDialogOpen(false);
      
    } catch (error) {
      console.error("Error assigning department:", error);
      toast({
        title: "Error",
        description: "Failed to assign order to department.",
        variant: "destructive"
      });
    } finally {
      setUpdatingStatus(false);
    }
  };
  
  // Handle payment status update
  const handlePaymentStatusUpdate = async (status: PaymentStatus) => {
    if (!order || !orderId) return;
    
    setUpdatingStatus(true);
    try {
      await updatePaymentStatus(orderId, status, `Payment status updated to ${status}`);
      
      toast({
        title: "Payment Status Updated",
        description: `Payment status has been updated to ${status}.`
      });
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast({
        title: "Error",
        description: "Failed to update payment status.",
        variant: "destructive"
      });
    } finally {
      setUpdatingStatus(false);
    }
  };
  
  // Check if user can access this order
  const userCanAccessOrder = (): boolean => {
    if (!currentUser || !order) return false;
    return canUserAccessOrder({
      id: currentUser.uid,
      email: currentUser.email || "",
      name: currentUser.displayName || "",
      role: currentUser.role,
      department: currentUser.role || "sales",
      createdAt: new Date()
    }, order);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-muted-foreground">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h2 className="mt-4 text-2xl font-bold">Order Not Found</h2>
        <p className="mt-2 text-muted-foreground">The requested order could not be found.</p>
        <Button asChild className="mt-6">
          <Link to="/orders"><ArrowLeft className="mr-2 h-4 w-4" />Back to Orders</Link>
        </Button>
      </div>
    );
  }
  
  if (!userCanAccessOrder()) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <ShieldAlert className="h-12 w-12 text-destructive" />
        <h2 className="mt-4 text-2xl font-bold">Access Restricted</h2>
        <p className="mt-2 text-muted-foreground">You don't have permission to view this order.</p>
        <Button asChild className="mt-6">
          <Link to="/orders"><ArrowLeft className="mr-2 h-4 w-4" />Back to Orders</Link>
        </Button>
      </div>
    );
  }

  // Format timeline events to ensure they have the required properties
  const timelineEvents: TimelineEvent[] = order.timeline?.map(event => ({
    status: event.status,
    date: event.date,
    note: event.note || "",
    formattedDate: event.formattedDate || new Date(event.date.seconds * 1000).toLocaleString()
  })) || [];

  // Can user update order based on role
  const canUpdateOrder = currentUser ? canUserUpdateOrderStatus({
    id: currentUser.uid,
    email: currentUser.email || "",
    name: currentUser.displayName || "",
    role: currentUser.role,
    department: currentUser.role || "sales",
    createdAt: new Date()
  }, order) : false;

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link to="/orders">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Link>
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold flex flex-col sm:flex-row sm:items-center gap-2">
            <span>Order #{order.orderNumber}</span>
            <Badge className={`${getStatusBadge(order.status)} ml-0 sm:ml-3`}>
              {formatStatus(order.status)}
            </Badge>
          </h1>
          <p className="text-muted-foreground">
            Created on {new Date(order.createdAt.seconds * 1000).toLocaleString()}
          </p>
        </div>
        
        {canUpdateOrder && (
          <div className="flex flex-wrap gap-2">
            <Dialog open={departmentDialogOpen} onOpenChange={setDepartmentDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  Assign Department
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Assign to Department</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Select Department</Label>
                    <Select 
                      value={selectedDepartment} 
                      onValueChange={(value: string) => setSelectedDepartment(value as DepartmentType)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="prepress">Prepress</SelectItem>
                        <SelectItem value="production">Production</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Note (Optional)</Label>
                    <Textarea 
                      placeholder="Add a note about this assignment" 
                      value={note} 
                      onChange={(e) => setNote(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDepartmentDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAssignDepartment} disabled={!selectedDepartment || updatingStatus}>
                    {updatingStatus ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                    Assign
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Button variant="outline" asChild>
              <Link to={`/orders/edit/${orderId}`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Order
              </Link>
            </Button>
          </div>
        )}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full overflow-auto">
          <TabsTrigger value="details">Order Details</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          {/* Order Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <OrderHeader 
                  clientName={order.clientName}
                  orderNumber={order.orderNumber}
                  orderId={order.id}
                  gstNumber={order.gstNumber}
                  contactNumber={order.contactNumber}
                />
                
                <OrderDelivery 
                  deliveryDate={order.deliveryDate ? new Date(order.deliveryDate.seconds * 1000).toLocaleDateString() : "Not specified"} 
                  deliveryAddress={order.deliveryAddress}
                  contactNumber={order.contactNumber}
                />
                
                <OrderNotes remarks={order.remarks} />
              </div>
              
              <div className="space-y-6">
                <OrderSummary 
                  orderAmount={order.orderAmount}
                  status={order.status}
                  clientName={order.clientName}
                  gstNumber={order.gstNumber}
                  createdDate={new Date(order.createdAt.seconds * 1000).toLocaleDateString()}
                  onStatusUpdate={handleStatusUpdate}
                  updating={updatingStatus}
                  formatStatus={formatStatus}
                  getStatusBadge={getStatusBadge}
                />
                
                <OrderPayment 
                  paymentStatus={order.paymentStatus}
                  orderId={order.id}
                  orderAmount={order.orderAmount}
                  onUpdatePaymentStatus={handlePaymentStatusUpdate}
                  canUpdatePayment={canUserUpdateOrderStatus({
                    id: currentUser?.uid || '',
                    email: currentUser?.email || '',
                    name: currentUser?.displayName || '',
                    role: currentUser?.role || 'sales',
                    department: currentUser?.role || 'sales',
                    createdAt: new Date()
                  }, order)}
                  updating={updatingStatus}
                />
              </div>
            </div>
          </TabsContent>
          
          {/* Products Tab */}
          <TabsContent value="products">
            <div className="bg-white rounded-md shadow p-6">
              <OrderProducts products={order.products} />
            </div>
          </TabsContent>
          
          {/* Workflow Tab */}
          <TabsContent value="workflow">
            <div className="bg-white rounded-md shadow p-6">
              <OrderProductsWorkflow 
                products={order.products} 
                orderId={order.id} 
                department={order.assignedDept}
                status={order.status}
              />
            </div>
          </TabsContent>
          
          {/* Timeline Tab */}
          <TabsContent value="timeline">
            <OrderTimeline 
              timeline={timelineEvents}
              formatStatus={formatStatus} 
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default OrderDetails;
