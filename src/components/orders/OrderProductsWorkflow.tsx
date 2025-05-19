
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { OrderProduct, DepartmentType, OrderStatus } from "@/lib/firebase/types";
import { updateProductStatus } from "@/lib/mockData";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

interface OrderProductsWorkflowProps {
  products: OrderProduct[];
  orderId: string;
  department: DepartmentType;
  status?: OrderStatus;
}

const OrderProductsWorkflow = ({ products, orderId, department, status }: OrderProductsWorkflowProps) => {
  const { toast } = useToast();
  const [updating, setUpdating] = useState<Record<string, boolean>>({});
  
  // Define appropriate status options based on department
  const getStatusOptions = (department: DepartmentType) => {
    switch (department) {
      case "design":
        return [
          { value: "pending", label: "Pending" },
          { value: "pendingApproval", label: "Send for Approval" },
          { value: "approved", label: "Approved" },
          { value: "needsRevision", label: "Needs Revision" }
        ];
      case "prepress":
        return [
          { value: "pending", label: "Pending" },
          { value: "pendingApproval", label: "Send for Approval" },
          { value: "approved", label: "Approved" },
          { value: "needsRevision", label: "Needs Revision" }
        ];
      case "production":
        return [
          { value: "inProcess", label: "In Process" },
          { value: "readyToDispatch", label: "Ready to Dispatch" },
          { value: "complete", label: "Complete" }
        ];
      default:
        return [];
    }
  };
  
  // Get status field name based on department
  const getStatusField = (department: DepartmentType): "designStatus" | "prepressStatus" | "productionStatus" => {
    switch (department) {
      case "design":
        return "designStatus";
      case "prepress":
        return "prepressStatus";
      case "production":
        return "productionStatus";
      default:
        return "designStatus"; // Default fallback
    }
  };
  
  // Handle status change for a product
  const handleStatusChange = async (productId: string | undefined, newStatus: string) => {
    if (!productId || !orderId) return;
    
    setUpdating({ ...updating, [productId]: true });
    
    try {
      const statusField = getStatusField(department);
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
      setUpdating({ ...updating, [productId]: false });
    }
  };
  
  // Handle production stage toggle
  const handleStageToggle = async (productId: string | undefined, stage: string, checked: boolean) => {
    if (!productId || !orderId) return;
    
    setUpdating({ ...updating, [productId]: true });
    
    try {
      // In a real app, this would update the product stages
      console.log(`Toggling stage ${stage} to ${checked} for product ${productId}`);
      
      toast({
        title: "Stage Updated",
        description: `${stage} stage has been ${checked ? "completed" : "unmarked"}.`
      });
    } catch (error) {
      console.error("Error updating product stage:", error);
      toast({
        title: "Error",
        description: "Failed to update production stage.",
        variant: "destructive"
      });
    } finally {
      setUpdating({ ...updating, [productId]: false });
    }
  };
  
  // Format status display
  const formatStatus = (status: string | undefined): string => {
    if (!status) return "Not Set";
    
    return status
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, str => str.toUpperCase());
  };
  
  // Get status indicator
  const getStatusIndicator = (status: string | undefined) => {
    if (!status) return null;
    
    switch (status) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "needsRevision":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "pendingApproval":
        return <Loader2 className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };
  
  // Filter products based on department workflow
  const relevantProducts = products.filter(product => {
    // For sales, show all products
    if (department === "sales") return true;
    
    // For design, only show products that haven't been approved yet
    if (department === "design") {
      return product.designStatus !== "approved";
    }
    
    // For prepress, only show products with approved designs but not approved prepress
    if (department === "prepress") {
      return product.designStatus === "approved" && product.prepressStatus !== "approved";
    }
    
    // For production, only show products with approved prepress
    if (department === "production") {
      return product.prepressStatus === "approved";
    }
    
    return true;
  });

  // If no department, show message
  if (!department) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">This order has not been assigned to a department yet.</p>
      </div>
    );
  }
  
  // If no products, show message
  if (products.length === 0 || relevantProducts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No products to display for this workflow.</p>
      </div>
    );
  }

  // Render workflow based on department
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">
        {department.charAt(0).toUpperCase() + department.slice(1)} Department Workflow
      </h3>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Status</TableHead>
            {department === "production" && (
              <TableHead>Production Stages</TableHead>
            )}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {relevantProducts.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{product.quantity}</TableCell>
              <TableCell className="flex items-center space-x-2">
                <span>{formatStatus(product[getStatusField(department)])}</span>
                {getStatusIndicator(product[getStatusField(department)])}
              </TableCell>
              
              {department === "production" && (
                <TableCell>
                  <div className="flex flex-col space-y-2">
                    {product.productionStages && Object.entries(product.productionStages).map(([stage, completed]) => (
                      <div key={stage} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`${product.id}-${stage}`} 
                          checked={completed} 
                          onCheckedChange={(checked) => 
                            handleStageToggle(product.id, stage, checked === true)
                          }
                          disabled={updating[product.id || ""]}
                        />
                        <label 
                          htmlFor={`${product.id}-${stage}`}
                          className="text-sm capitalize cursor-pointer"
                        >
                          {stage}
                        </label>
                      </div>
                    ))}
                  </div>
                </TableCell>
              )}
              
              <TableCell>
                <Select
                  value={product[getStatusField(department)] || ""}
                  onValueChange={(value) => handleStatusChange(product.id, value)}
                  disabled={updating[product.id || ""]}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Update status" />
                  </SelectTrigger>
                  <SelectContent>
                    {getStatusOptions(department).map(option => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrderProductsWorkflow;
