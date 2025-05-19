
import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Product {
  name: string;
  quantity?: number;
  price?: number | string;
  description?: string;
  designStatus?: string;
  prepressStatus?: string;
  productionStatus?: string;
}

interface OrderProductsProps {
  products: Product[];
}

const OrderProducts = ({ products }: OrderProductsProps) => {
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({});
  
  const toggleItem = (index: number) => {
    setOpenItems(prev => ({ ...prev, [index]: !prev[index] }));
  };

  // Format the status text
  const formatStatus = (status?: string) => {
    if (!status) return "Not Started";
    return status
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .trim();
  };

  // Get status badge color
  const getStatusColor = (status?: string) => {
    if (!status) return "bg-gray-100 text-gray-800";
    if (status.includes("approved") || status === "complete") return "bg-green-100 text-green-800";
    if (status.includes("pending")) return "bg-yellow-100 text-yellow-800";
    if (status.includes("revision")) return "bg-red-100 text-red-800";
    if (status.includes("progress")) return "bg-blue-100 text-blue-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-4">Products</h3>
      <div className="overflow-auto border rounded-md shadow-sm">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="font-semibold text-foreground">Product</TableHead>
              <TableHead className="text-right font-semibold text-foreground">Quantity</TableHead>
              <TableHead className="text-right font-semibold text-foreground">Price</TableHead>
              <TableHead className="text-right font-semibold text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products && products.map((product: Product, index: number) => (
              <React.Fragment key={index}>
                <TableRow className={index % 2 === 0 ? "bg-white" : "bg-muted/10"}>
                  <TableCell className="font-medium text-foreground">{product.name}</TableCell>
                  <TableCell className="text-right text-foreground">{product.quantity || 1}</TableCell>
                  <TableCell className="text-right text-foreground">
                    {product.price 
                      ? `₹${product.price}`
                      : "Included in total"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => toggleItem(index)}
                      className="hover:bg-muted"
                    >
                      {openItems[index] ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                      <span className="ml-1">{openItems[index] ? "Hide" : "Details"}</span>
                    </Button>
                  </TableCell>
                </TableRow>
                {openItems[index] && (
                  <TableRow>
                    <TableCell colSpan={4} className="p-0">
                      <div className="p-4 bg-muted/20 border-t border-b">
                        {product.description && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium mb-1">Description</h4>
                            <p className="text-sm text-muted-foreground">{product.description}</p>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h4 className="text-xs font-medium text-muted-foreground">Design Status</h4>
                            <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(product.designStatus)}`}>
                              {formatStatus(product.designStatus)}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-xs font-medium text-muted-foreground">Prepress Status</h4>
                            <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(product.prepressStatus)}`}>
                              {formatStatus(product.prepressStatus)}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-xs font-medium text-muted-foreground">Production Status</h4>
                            <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(product.productionStatus)}`}>
                              {formatStatus(product.productionStatus)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OrderProducts;
