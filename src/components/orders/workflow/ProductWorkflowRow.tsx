
import { TableCell, TableRow } from "@/components/ui/table";
import { DepartmentType, OrderProduct } from "@/lib/firebase/types";
import { formatStatus, getStatusField } from "./WorkflowUtils";
import ProductStatusIndicator from "./ProductStatusIndicator";
import ProductStatusSelector from "./ProductStatusSelector";
import ProductionStages from "./ProductionStages";

interface ProductWorkflowRowProps {
  product: OrderProduct;
  orderId: string;
  department: DepartmentType;
  userRole: string;
  index: number;
  statusOptions: { value: string; label: string }[];
}

const ProductWorkflowRow = ({
  product,
  orderId,
  department,
  userRole,
  index,
  statusOptions
}: ProductWorkflowRowProps) => {
  const statusField = getStatusField(department);

  return (
    <TableRow className={index % 2 === 0 ? "bg-card" : "bg-muted/30"}>
      <TableCell className="font-medium text-foreground">{product.name}</TableCell>
      <TableCell className="text-foreground">{product.quantity}</TableCell>
      <TableCell className="flex items-center space-x-2">
        <span className="text-foreground font-medium">{formatStatus(product[statusField])}</span>
        <ProductStatusIndicator status={product[statusField]} />
      </TableCell>
      
      {department === "production" && userRole === "production" && (
        <TableCell>
          <ProductionStages product={product} orderId={orderId} />
        </TableCell>
      )}
      
      <TableCell>
        <ProductStatusSelector 
          product={product} 
          orderId={orderId} 
          department={department}
          statusOptions={statusOptions}
          statusField={statusField}
        />
      </TableCell>
    </TableRow>
  );
};

export default ProductWorkflowRow;
