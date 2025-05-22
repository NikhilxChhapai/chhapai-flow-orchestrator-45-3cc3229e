
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
  UserCheck,
  AlertTriangle,
  Clock,
  LucideIcon,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface TimelineEvent {
  status: string;
  formattedDate: string;
  note: string;
  assignedBy?: string;
  requestedBy?: string;
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
  if (status.includes("PendingApproval")) return AlertTriangle;
  if (status.includes("Approved")) return UserCheck;
  if (status === "ReadyToDispatch") return Truck;
  if (status === "Completed")) return Check;
  if (status === "Cancelled")) return X;
  return Clock; // Default
};

// Function to determine background color based on status
const getStatusColor = (status: string): string => {
  if (status.startsWith("Design_")) return "bg-blue-50 dark:bg-blue-900/30";
  if (status.startsWith("Prepress_")) return "bg-purple-50 dark:bg-purple-900/30";
  if (status.startsWith("Production_")) return "bg-amber-50 dark:bg-amber-900/30";
  if (status.startsWith("Order_")) return "bg-gray-50 dark:bg-gray-800/30";
  if (status.startsWith("Payment_")) return "bg-green-50 dark:bg-green-900/30";
  if (status === "ReadyToDispatch") return "bg-cyan-50 dark:bg-cyan-900/30";
  if (status === "Completed") return "bg-green-50 dark:bg-green-900/30";
  if (status === "Cancelled") return "bg-red-50 dark:bg-red-900/30";
  return "bg-gray-50 dark:bg-gray-800/30";
};

// Function to determine icon color and border color based on status
const getIconColors = (status: string): { icon: string, border: string } => {
  if (status.startsWith("Design_")) return { 
    icon: "text-blue-600 dark:text-blue-400", 
    border: "border-blue-200 dark:border-blue-700" 
  };
  if (status.startsWith("Prepress_")) return { 
    icon: "text-purple-600 dark:text-purple-400", 
    border: "border-purple-200 dark:border-purple-700" 
  };
  if (status.startsWith("Production_")) return { 
    icon: "text-amber-600 dark:text-amber-400", 
    border: "border-amber-200 dark:border-amber-700" 
  };
  if (status.startsWith("Payment_")) return { 
    icon: "text-green-600 dark:text-green-400", 
    border: "border-green-200 dark:border-green-700" 
  };
  if (status === "ReadyToDispatch") return { 
    icon: "text-cyan-600 dark:text-cyan-400", 
    border: "border-cyan-200 dark:border-cyan-700" 
  };
  if (status === "Completed") return { 
    icon: "text-green-600 dark:text-green-400", 
    border: "border-green-200 dark:border-green-700" 
  };
  if (status === "Cancelled") return { 
    icon: "text-red-600 dark:text-red-400", 
    border: "border-red-200 dark:border-red-700" 
  };
  return { 
    icon: "text-gray-600 dark:text-gray-400", 
    border: "border-gray-200 dark:border-gray-700" 
  };
};

const OrderTimeline = ({ timeline, formatStatus }: OrderTimelineProps) => {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  
  const toggleItem = (index: number) => {
    setExpandedItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  };

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle>Order Timeline</CardTitle>
        <CardDescription>Track the progress of your order</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative pl-10 border-l border-border space-y-6">
          {timeline && timeline.length > 0 ? (
            timeline.map((event: TimelineEvent, index: number) => {
              const Icon = getStatusIcon(event.status);
              const colors = getIconColors(event.status);
              const isExpanded = expandedItems.includes(index);
              
              return (
                <div 
                  key={index} 
                  className={cn(
                    "relative p-4 rounded-lg transition-all duration-200",
                    getStatusColor(event.status)
                  )}
                >
                  <div className={cn(
                    "absolute -left-[20px] top-4 h-10 w-10 rounded-full flex items-center justify-center",
                    "border-2", colors.border, "bg-background"
                  )}>
                    <Icon className={cn("h-5 w-5", colors.icon)} />
                  </div>
                  
                  <div className="flex flex-col space-y-2 ml-2">
                    <button 
                      onClick={() => toggleItem(index)}
                      className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-2 text-left w-full"
                    >
                      <h4 className="text-base font-medium text-foreground">{formatStatus(event.status)}</h4>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {event.formattedDate}
                      </span>
                    </button>
                    
                    {(isExpanded || index === 0) && (
                      <div className="text-sm text-muted-foreground break-words animate-fade-in">
                        <p className="mb-2">{event.note}</p>
                        
                        {event.requestedBy && (
                          <span className="block mt-1 font-medium text-xs">Requested by: {event.requestedBy}</span>
                        )}
                        {event.assignedBy && (
                          <span className="block mt-1 font-medium text-xs">Assigned by: {event.assignedBy}</span>
                        )}
                      </div>
                    )}
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
