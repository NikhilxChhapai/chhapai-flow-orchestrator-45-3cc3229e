
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { OrderProduct, DepartmentType } from "@/lib/firebase/types";
import { updateProductStatus } from "@/lib/mockData";

interface ProductStatusSelectorProps {
  product: OrderProduct;
  orderId: string;
  department: DepartmentType;
  statusOptions: { value: string; label: string }[];
  statusField: "designStatus" | "prepressStatus" | "productionStatus";
}

const ProductStatusSelector = ({
  product,
  orderId,
  department,
  statusOptions,
  statusField,
}: ProductStatusSelectorProps) => {
  const { toast } = useToast();
  const [updating, setUpdating] = useState(false);

  // Handle status change for a product
  const handleStatusChange = async (productId: string | undefined, newStatus: string) => {
    if (!productId || !orderId) return;
    
    setUpdating(true);
    
    try {
      await updateProductStatus(orderId, productId, statusField, newStatus);
      
      toast({
        title: "Status Updated",
        description: `Product status has been updated to ${newStatus}.`
      });
    } catch (error) {
      console.error("Error updating product status:", error);
      toast({
        title: "Error",
        description: "Failed to update product status.",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  if (statusOptions.length === 0) {
    return <span className="text-sm text-muted-foreground">No actions available</span>;
  }

  return (
    <Select
      value={product[statusField] || ""}
      onValueChange={(value) => handleStatusChange(product.id, value)}
      disabled={updating}
    >
      <SelectTrigger className="w-[180px] bg-white">
        <SelectValue placeholder="Update status" />
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map(option => (
          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ProductStatusSelector;
