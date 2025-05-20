
import React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface OrderDeliveryFormProps {
  contactNumber: string;
  deliveryAddress: string;
  deliveryDate: Date | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDateChange: (date: Date | undefined) => void;
}

const OrderDeliveryForm = ({
  contactNumber,
  deliveryAddress,
  deliveryDate,
  onChange,
  onDateChange,
}: OrderDeliveryFormProps) => {
  // Get today's date at the start of the day
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="contactNumber">Contact Number</Label>
        <Input
          id="contactNumber"
          name="contactNumber"
          type="tel"
          placeholder="Enter contact number"
          value={contactNumber}
          onChange={onChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="deliveryDate">Expected Delivery Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="deliveryDate"
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !deliveryDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {deliveryDate ? format(deliveryDate, "PPP") : <span>Select date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={deliveryDate}
              onSelect={onDateChange}
              disabled={(date) => date < today}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="deliveryAddress">Delivery Address</Label>
        <Input
          id="deliveryAddress"
          name="deliveryAddress"
          placeholder="Enter delivery address"
          value={deliveryAddress}
          onChange={onChange}
          required
        />
      </div>
    </div>
  );
};

export default OrderDeliveryForm;
