
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
import { Clock, Phone, MapPin } from "lucide-react";

interface OrderDeliveryProps {
  deliveryDate: string;
  contactNumber: string;
  deliveryAddress: string;
}

const OrderDelivery = ({ 
  deliveryDate, 
  contactNumber, 
  deliveryAddress 
}: OrderDeliveryProps) => {
  return (
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
            {deliveryDate || "Not specified"}
          </p>
        </div>
        
        <div>
          <div className="flex items-center text-muted-foreground">
            <Phone className="h-4 w-4 mr-2" />
            <span className="text-sm">Contact</span>
          </div>
          <p className="font-medium mt-1">{contactNumber}</p>
        </div>
        
        <div>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="text-sm">Address</span>
          </div>
          <p className="font-medium mt-1">{deliveryAddress}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderDelivery;
