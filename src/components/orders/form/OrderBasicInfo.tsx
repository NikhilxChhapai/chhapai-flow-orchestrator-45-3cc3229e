
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface OrderBasicInfoProps {
  orderNumber: string;
  clientName: string;
  orderAmount: string | number;
  gstNumber: string;
  isEditing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const OrderBasicInfo = ({
  orderNumber,
  clientName,
  orderAmount,
  gstNumber,
  isEditing,
  onChange,
}: OrderBasicInfoProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="orderNumber">Order Number</Label>
        <Input
          id="orderNumber"
          name="orderNumber"
          value={orderNumber}
          onChange={onChange}
          placeholder="e.g., ORD-2023-001"
          required
          readOnly={isEditing}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="clientName">Client Name</Label>
        <Input
          id="clientName"
          name="clientName"
          value={clientName}
          onChange={onChange}
          placeholder="e.g., ABC Enterprises"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="orderAmount">Order Amount (₹)</Label>
        <Input
          id="orderAmount"
          name="orderAmount"
          value={orderAmount}
          onChange={onChange}
          placeholder="e.g., 10000"
          type="number"
          min="0"
          step="0.01"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="gstNumber">GST Number (Optional)</Label>
        <Input
          id="gstNumber"
          name="gstNumber"
          value={gstNumber}
          onChange={onChange}
          placeholder="e.g., 22AAAAA0000A1Z5"
        />
      </div>
    </div>
  );
};

export default OrderBasicInfo;
