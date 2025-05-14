
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
import { ArrowLeft, Edit, Download, Printer, Phone, MapPin, Clock } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    // Simulate API call to fetch order details
    const fetchOrder = async () => {
      setLoading(true);
      try {
        // In a real app, you would fetch from your API
        // For now, we'll use mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockOrder = {
          id: orderId,
          client: "ABC Enterprises",
          clientGst: "22AAAAA0000A1Z5",
          amount: "₹12,500",
          status: "Production_Printing",
          createdDate: "2023-05-14",
          deliveryDate: "2023-05-20",
          contactNumber: "+91 9876543210",
          deliveryAddress: "123 Business Park, Sector 5, Mumbai, Maharashtra 400001",
          remarks: "Need special packaging for shipping overseas. Handle with care.",
          products: [
            { id: 1, name: "Business Cards", quantity: 1000, price: "₹3,500" },
            { id: 2, name: "Brochures (Tri-fold)", quantity: 500, price: "₹9,000" }
          ],
          timeline: [
            { date: "2023-05-14", status: "Order_Received", note: "Order received and confirmed" },
            { date: "2023-05-15", status: "Design_InProgress", note: "Design work started" },
            { date: "2023-05-16", status: "Design_AwaitingApproval", note: "Design sent to client for review" },
            { date: "2023-05-17", status: "Design_Approved", note: "Design approved by client" },
            { date: "2023-05-18", status: "Prepress_Approved", note: "Prepress work completed" },
            { date: "2023-05-19", status: "Production_Printing", note: "Currently in printing phase" },
          ]
        };
        
        setOrder(mockOrder);
      } catch (error) {
        console.error("Error fetching order:", error);
        toast({
          title: "Error",
          description: "Failed to load order details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, toast]);

  const handleEdit = () => {
    navigate(`/orders/edit/${orderId}`);
  };

  const handleDownloadInvoice = () => {
    toast({
      title: "Invoice Downloaded",
      description: "The invoice has been downloaded successfully.",
    });
  };

  const handlePrint = () => {
    window.print();
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
        <div className="grid gap-4">
          <Card className="animate-pulse">
            <CardHeader className="h-24 bg-muted/50"></CardHeader>
            <CardContent className="h-48 bg-muted/30"></CardContent>
          </Card>
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
            <p>The order you're looking for doesn't exist or you don't have permission to view it.</p>
            <Button onClick={() => navigate('/orders')} className="mt-4">
              View All Orders
            </Button>
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
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Order #{order.id}</h1>
            <p className="text-muted-foreground">{order.client}</p>
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
                <p className="text-lg font-semibold mt-1">{order.amount}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Client</h3>
                <p className="mt-1">{order.client}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">GST Number</h3>
                <p className="mt-1">{order.clientGst || "Not provided"}</p>
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
                    {order.products.map((product: any) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="text-right">{product.quantity}</TableCell>
                        <TableCell className="text-right">{product.price}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
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
              <p className="font-medium mt-1">{order.deliveryDate}</p>
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
            {order.timeline.map((event: any, index: number) => (
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
                  <span className="text-xs text-muted-foreground mt-1 md:mt-0">{event.date}</span>
                </div>
              </div>
            ))}
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
