
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface OrderNotesFormProps {
  remarks: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const OrderNotesForm = ({ remarks, onChange }: OrderNotesFormProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="remarks">Remarks</Label>
      <Textarea
        id="remarks"
        name="remarks"
        value={remarks}
        onChange={onChange}
        placeholder="Any additional information or instructions"
      />
    </div>
  );
};

export default OrderNotesForm;
