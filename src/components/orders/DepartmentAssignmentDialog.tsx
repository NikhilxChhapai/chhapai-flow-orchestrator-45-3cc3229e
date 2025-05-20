
import { useState } from "react";
import { Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { assignOrderToDepartment, updateOrder } from "@/lib/mockData";
import { DepartmentType, OrderStatus } from "@/lib/firebase/types";

interface DepartmentAssignmentDialogProps {
  orderId: string;
  currentDepartment: DepartmentType;
  remarks?: string;
  onSuccess?: () => void;
}

const DepartmentAssignmentDialog = ({ orderId, currentDepartment, remarks, onSuccess }: DepartmentAssignmentDialogProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentType | "">("");
  const [note, setNote] = useState("");

  const handleAssignDepartment = async () => {
    if (!orderId || !selectedDepartment) return;
    
    setUpdating(true);
    try {
      // Determine appropriate status based on department
      let newStatus: OrderStatus = "Order_Placed";
      
      if (selectedDepartment === "design") {
        newStatus = "Design_InProgress";
      } else if (selectedDepartment === "prepress") {
        newStatus = "Prepress_InProgress";
      } else if (selectedDepartment === "production") {
        newStatus = "Production_Printing";
      }
      
      await assignOrderToDepartment(orderId, selectedDepartment, newStatus);
      
      // Add note if provided
      if (note) {
        await updateOrder(orderId, {
          remarks: remarks ? `${remarks}\n\n${note}` : note
        });
      }
      
      toast({
        title: "Department Assigned",
        description: `Order has been assigned to ${selectedDepartment} department.`
      });
      
      // Reset form
      setSelectedDepartment("");
      setNote("");
      setOpen(false);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error assigning department:", error);
      toast({
        title: "Error",
        description: "Failed to assign order to department.",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          Assign Department
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign to Department</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Select Department</Label>
            <Select 
              value={selectedDepartment} 
              onValueChange={(value: string) => setSelectedDepartment(value as DepartmentType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="prepress">Prepress</SelectItem>
                <SelectItem value="production">Production</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Note (Optional)</Label>
            <Textarea 
              placeholder="Add a note about this assignment" 
              value={note} 
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAssignDepartment} disabled={!selectedDepartment || updating}>
            {updating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
            Assign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DepartmentAssignmentDialog;
