
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card";

interface TimelineEvent {
  status: string;
  formattedDate: string;
  note: string;
}

interface OrderTimelineProps {
  timeline: TimelineEvent[];
  formatStatus: (status: string) => string;
}

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
            timeline.map((event: TimelineEvent, index: number) => (
              <div 
                key={index} 
                className={`relative mb-6 ${index === timeline.length - 1 ? "" : ""}`}
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
  );
};

export default OrderTimeline;
