
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

interface OrderDeliveryFormProps {
  contactNumber: string;
  deliveryDate: Date | undefined;
  deliveryAddress: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onDateChange: (date: Date | undefined) => void;
}

const OrderDeliveryForm = ({
  contactNumber,
  deliveryDate,
  deliveryAddress,
  onChange,
  onDateChange,
}: OrderDeliveryFormProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contactNumber">Contact Number</Label>
          <Input
            id="contactNumber"
            name="contactNumber"
            value={contactNumber}
            onChange={onChange}
            placeholder="e.g., +91 9876543210"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Expected Delivery Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !deliveryDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {deliveryDate ? (
                  format(deliveryDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={deliveryDate}
                onSelect={onDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="deliveryAddress">Delivery Address</Label>
        <Textarea
          id="deliveryAddress"
          name="deliveryAddress"
          value={deliveryAddress}
          onChange={onChange}
          placeholder="Enter delivery address"
          required
        />
      </div>
    </div>
  );
};

export default OrderDeliveryForm;
