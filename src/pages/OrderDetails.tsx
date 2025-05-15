
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  ArrowLeft, 
  Edit, 
  Download, 
  Printer, 
  Phone, 
  MapPin, 
  Clock, 
  AlertCircle,
  Loader2
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { getOrderById, updateOrderStatus, db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { format } from "date-fns";

// Order status mapping for badge colors
const getStatusBadge = (status: string) => {
  if (status.includes("Design")) return "bg-blue-500";
  if (status.includes("Prepress")) return "bg-purple-500";
  if (status.includes("Production")) return "bg-amber-500";
  if (status === "ReadyToDispatch") return "bg-green-500";
  if (status === "Completed") return "bg-gray-500";
  return "bg-gray-500";
};

// Format status text
const formatStatus = (status: string) => {
  return status
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .trim();
};

const OrderDetails = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    // Set up real-time listener for the order
    const orderRef = doc(db, "orders", orderId);
    const unsubscribe = onSnapshot(
      orderRef, 
      (doc) => {
        if (doc.exists()) {
          const orderData = { id: doc.id, ...doc.data() };
          
          // Format dates
          if (orderData.createdAt) {
            orderData.createdDate = format(
              orderData.createdAt.toDate(), 
              "yyyy-MM-dd"
            );
          }
          
          if (orderData.deliveryDate) {
            if (typeof orderData.deliveryDate.toDate === 'function') {
              orderData.formattedDeliveryDate = format(
                orderData.deliveryDate.toDate(),
                "yyyy-MM-dd"
              );
            }
          }

          // Format timeline dates
          if (orderData.timeline) {
            orderData.timeline = orderData.timeline.map((item: any) => ({
              ...item,
              formattedDate: format(item.date.toDate(), "yyyy-MM-dd"),
            }));
          }
          
          setOrder(orderData);
        } else {
          setOrder(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error getting order:", error);
        toast({
          title: "Error",
          description: "Failed to load order details. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [orderId, toast]);

  const handleEdit = () => {
    navigate(`/orders/edit/${orderId}`);
  };

  const handleDownloadInvoice = () => {
    // In a real application, this would generate a PDF invoice
    toast({
      title: "Invoice Downloaded",
      description: "The invoice has been downloaded successfully.",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!orderId || !order) return;
    
    setUpdating(true);
    try {
      await updateOrderStatus(orderId, newStatus, `Status updated to ${formatStatus(newStatus)}`);
      toast({
        title: "Status Updated",
        description: `Order status updated to ${formatStatus(newStatus)}`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/orders')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Loading...</h1>
        </div>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/orders')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Order Not Found</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center p-4">
              <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold">Order Not Found</h2>
              <p className="text-muted-foreground mt-2 mb-4">
                The order you're looking for doesn't exist or you don't have permission to view it.
              </p>
              <Button onClick={() => navigate('/orders')}>
                View All Orders
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in print:m-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/orders')}
            className="mr-4 print:hidden"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Order #{order.orderNumber}</h1>
            <p className="text-muted-foreground">{order.clientName}</p>
          </div>
        </div>
        
        <div className="flex gap-2 print:hidden">
          <Button variant="outline" size={isMobile ? "sm" : "default"} onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Edit</span>
          </Button>
          <Button variant="outline" size={isMobile ? "sm" : "default"} onClick={handleDownloadInvoice}>
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Invoice</span>
          </Button>
          <Button variant="outline" size={isMobile ? "sm" : "default"} onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Print</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>
              Created on {order.createdDate}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                <Badge className={`mt-1 ${getStatusBadge(order.status)}`}>
                  {formatStatus(order.status)}
                </Badge>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Amount</h3>
                <p className="text-lg font-semibold mt-1">
                  ₹{typeof order.orderAmount === 'number' 
                      ? order.orderAmount.toLocaleString('en-IN')
                      : order.orderAmount}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Client</h3>
                <p className="mt-1">{order.clientName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">GST Number</h3>
                <p className="mt-1">{order.gstNumber || "Not provided"}</p>
              </div>
            </div>

            <Separator className="my-6" />
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Products</h3>
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.products && order.products.map((product: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="text-right">{product.quantity || 1}</TableCell>
                        <TableCell className="text-right">
                          {product.price 
                            ? `₹${product.price}`
                            : "Included in total"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            
            {!updating ? (
              <div className="mt-6 flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleUpdateStatus("Design_InProgress")}
                  className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                >
                  Design In Progress
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleUpdateStatus("Prepress_InProgress")}
                  className="bg-purple-50 text-purple-700 hover:bg-purple-100"
                >
                  Prepress
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleUpdateStatus("Production_Printing")}
                  className="bg-amber-50 text-amber-700 hover:bg-amber-100"
                >
                  Production
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleUpdateStatus("ReadyToDispatch")}
                  className="bg-green-50 text-green-700 hover:bg-green-100"
                >
                  Ready to Dispatch
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleUpdateStatus("Completed")}
                  className="bg-gray-50 text-gray-700 hover:bg-gray-100"
                >
                  Completed
                </Button>
              </div>
            ) : (
              <div className="mt-6 flex justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delivery Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center text-muted-foreground">
                <Clock className="h-4 w-4 mr-2" />
                <span className="text-sm">Expected Delivery</span>
              </div>
              <p className="font-medium mt-1">
                {order.formattedDeliveryDate || "Not specified"}
              </p>
            </div>
            
            <div>
              <div className="flex items-center text-muted-foreground">
                <Phone className="h-4 w-4 mr-2" />
                <span className="text-sm">Contact</span>
              </div>
              <p className="font-medium mt-1">{order.contactNumber}</p>
            </div>
            
            <div>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2" />
                <span className="text-sm">Address</span>
              </div>
              <p className="font-medium mt-1">{order.deliveryAddress}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Timeline</CardTitle>
          <CardDescription>Track the progress of your order</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative pl-6 border-l border-border">
            {order.timeline && order.timeline.length > 0 ? (
              order.timeline.map((event: any, index: number) => (
                <div 
                  key={index} 
                  className={`relative mb-6 ${index === order.timeline.length - 1 ? "" : ""}`}
                >
                  <div className="absolute -left-[25px] h-4 w-4 rounded-full bg-primary"></div>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div>
                      <h4 className="text-base font-medium">{formatStatus(event.status)}</h4>
                      <p className="text-sm text-muted-foreground">{event.note}</p>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1 md:mt-0">
                      {event.formattedDate}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No timeline events recorded yet.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {order.remarks && (
        <Card>
          <CardHeader>
            <CardTitle>Additional Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{order.remarks}</p>
          </CardContent>
        </Card>
      )}

      <div className="print:hidden">
        <Button 
          variant="outline" 
          onClick={() => navigate('/orders')}
          className="mr-2"
        >
          Back to Orders
        </Button>
        <Button onClick={handleEdit}>
          Edit Order
        </Button>
      </div>
    </div>
  );
};

export default OrderDetails;
