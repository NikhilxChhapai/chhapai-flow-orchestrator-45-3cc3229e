
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OrderProduct, DepartmentType, OrderStatus } from "@/lib/firebase/types";
import { useAuth } from "@/contexts/AuthContext";
import { 
  getStatusOptions, 
  getRelevantProducts, 
  canEditWorkflow 
} from "./workflow/WorkflowUtils";
import ProductWorkflowRow from "./workflow/ProductWorkflowRow";

interface OrderProductsWorkflowProps {
  products: OrderProduct[];
  orderId: string;
  department: DepartmentType;
  status?: OrderStatus;
  userRole: string;
  assignedBy?: string;
}

const OrderProductsWorkflow = ({ 
  products, 
  orderId, 
  department, 
  status,
  userRole,
  assignedBy
}: OrderProductsWorkflowProps) => {
  // Get status options based on department and user role
  const statusOptions = getStatusOptions(department, userRole);
  
  // Filter products based on department workflow and user role
  const relevantProducts = getRelevantProducts(products, department, userRole);

  // If no department or not relevant to current user, show message
  if (!department || (!canEditWorkflow(userRole, department) && userRole !== 'admin')) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">You don't have permission to update this workflow.</p>
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
      <h3 className="text-lg font-semibold text-foreground">
        {department.charAt(0).toUpperCase() + department.slice(1)} Department Workflow
      </h3>
      
      <div className="border rounded-md shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-semibold text-foreground">Product</TableHead>
              <TableHead className="font-semibold text-foreground">Quantity</TableHead>
              <TableHead className="font-semibold text-foreground">Status</TableHead>
              {department === "production" && userRole === "production" && (
                <TableHead className="font-semibold text-foreground">Production Stages</TableHead>
              )}
              <TableHead className="font-semibold text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {relevantProducts.map((product, index) => (
              <ProductWorkflowRow
                key={product.id}
                product={product}
                orderId={orderId}
                department={department}
                userRole={userRole}
                index={index}
                statusOptions={statusOptions}
                assignedBy={assignedBy}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OrderProductsWorkflow;
