
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Phone } from "lucide-react";
import { OrderDeliveryProps } from "@/lib/firebase/types";

const OrderDelivery = ({ deliveryDate, deliveryAddress, contactNumber }: OrderDeliveryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Delivery Information</CardTitle>
        <CardDescription>Address and scheduled delivery date</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start space-x-3">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium">Delivery Date</p>
            <p className="text-muted-foreground">{deliveryDate}</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium">Delivery Address</p>
            <p className="text-muted-foreground whitespace-pre-line">{deliveryAddress}</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <Phone className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium">Contact Number</p>
            <p className="text-muted-foreground">{contactNumber}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderDelivery;
