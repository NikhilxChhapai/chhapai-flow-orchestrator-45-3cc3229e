
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Download, Printer } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";

interface OrderHeaderProps {
  orderNumber: string;
  clientName: string;
  orderId: string;
  onEdit: () => void;
  onPrint: () => void;
}

const OrderHeader = ({ orderNumber, clientName, orderId, onEdit, onPrint }: OrderHeaderProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const handleDownloadInvoice = () => {
    // In a real application, this would generate a PDF invoice
    toast({
      title: "Invoice Downloaded",
      description: "The invoice has been downloaded successfully.",
    });
  };

  return (
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
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Order #{orderNumber}</h1>
          <p className="text-muted-foreground">{clientName}</p>
        </div>
      </div>
      
      <div className="flex gap-2 print:hidden">
        <Button variant="outline" size={isMobile ? "sm" : "default"} onClick={onEdit}>
          <Edit className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Edit</span>
        </Button>
        <Button variant="outline" size={isMobile ? "sm" : "default"} onClick={handleDownloadInvoice}>
          <Download className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Invoice</span>
        </Button>
        <Button variant="outline" size={isMobile ? "sm" : "default"} onClick={onPrint}>
          <Printer className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Print</span>
        </Button>
      </div>
    </div>
  );
};

export default OrderHeader;
