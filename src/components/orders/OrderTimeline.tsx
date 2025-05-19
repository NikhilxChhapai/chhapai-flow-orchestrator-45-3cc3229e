
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card";
import { 
  Package, 
  Pen, 
  File, 
  Truck, 
  DollarSign, 
  Check,
  LucideIcon
} from "lucide-react";

interface TimelineEvent {
  status: string;
  formattedDate: string;
  note: string;
}

interface OrderTimelineProps {
  timeline: TimelineEvent[];
  formatStatus: (status: string) => string;
}

// Function to determine which icon to use based on the status
const getStatusIcon = (status: string): LucideIcon => {
  if (status.startsWith("Order_")) return Package;
  if (status.startsWith("Design_")) return Pen;
  if (status.startsWith("Prepress_")) return File;
  if (status.startsWith("Production_")) return Truck;
  if (status.startsWith("Payment_")) return DollarSign;
  if (status === "ReadyToDispatch") return Truck;
  if (status === "Completed") return Check;
  return Package; // Default
};

const OrderTimeline = ({ timeline, formatStatus }: OrderTimelineProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Timeline</CardTitle>
        <CardDescription>Track the progress of your order</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative pl-6 border-l border-border">
          {timeline && timeline.length > 0 ? (
            timeline.map((event: TimelineEvent, index: number) => {
              const Icon = getStatusIcon(event.status);
              
              return (
                <div 
                  key={index} 
                  className={`relative mb-6 ${index === timeline.length - 1 ? "" : ""}`}
                >
                  <div className="absolute -left-[25px] h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
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
              );
            })
          ) : (
            <p className="text-muted-foreground">No timeline events recorded yet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderTimeline;
