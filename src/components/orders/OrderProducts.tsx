
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

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
  const { currentUser } = useAuth();
  const userRole = currentUser?.role || 'sales';
  
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

  // Get status badge color with improved contrast
  const getStatusColor = (status?: string) => {
    if (!status) return "bg-gray-200 text-gray-800";
    if (status.includes("approved") || status === "complete") return "bg-green-200 text-green-800";
    if (status.includes("pending")) return "bg-yellow-200 text-yellow-800";
    if (status.includes("revision")) return "bg-red-200 text-red-800";
    if (status.includes("progress")) return "bg-blue-200 text-blue-800";
    return "bg-gray-200 text-gray-800";
  };

  // Filter products based on department role
  const getVisibleProducts = () => {
    // Admin and sales can see all products
    if (userRole === 'admin' || userRole === 'sales') {
      return products;
    }
    
    // Department-specific filtering
    return products.filter(product => {
      if (userRole === 'design' && (!product.designStatus || product.designStatus !== 'approved')) {
        return true;
      }
      if (userRole === 'prepress' && product.designStatus === 'approved' && 
          (!product.prepressStatus || product.prepressStatus !== 'approved')) {
        return true;
      }
      if (userRole === 'production' && product.prepressStatus === 'approved') {
        return true;
      }
      return false;
    });
  };

  const visibleProducts = getVisibleProducts();

  // Show department-specific fields
  const shouldShowPrice = userRole === 'admin' || userRole === 'sales';

  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-4">Products</h3>
      {visibleProducts.length === 0 ? (
        <div className="p-6 text-center border rounded-md bg-muted/10">
          <p className="text-muted-foreground">No products assigned to your department.</p>
        </div>
      ) : (
        <div className="overflow-auto border rounded-md shadow-sm">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="font-semibold text-foreground">Product</TableHead>
                <TableHead className="text-right font-semibold text-foreground">Quantity</TableHead>
                {shouldShowPrice && (
                  <TableHead className="text-right font-semibold text-foreground">Price</TableHead>
                )}
                <TableHead className="text-right font-semibold text-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleProducts && visibleProducts.map((product: Product, index: number) => (
                <React.Fragment key={index}>
                  <TableRow className={index % 2 === 0 ? "bg-white" : "bg-muted/10"}>
                    <TableCell className="font-medium text-foreground">{product.name}</TableCell>
                    <TableCell className="text-right text-foreground">{product.quantity || 1}</TableCell>
                    {shouldShowPrice && (
                      <TableCell className="text-right text-foreground">
                        {product.price 
                          ? `₹${product.price}`
                          : "Included in total"}
                      </TableCell>
                    )}
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
                      <TableCell colSpan={shouldShowPrice ? 4 : 3} className="p-0">
                        <div className="p-4 bg-muted/30 border-t border-b">
                          {product.description && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium mb-1">Description</h4>
                              <p className="text-sm text-muted-foreground">{product.description}</p>
                            </div>
                          )}
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <h4 className="text-xs font-medium mb-1">Design Status</h4>
                              <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.designStatus)}`}>
                                {formatStatus(product.designStatus)}
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="text-xs font-medium mb-1">Prepress Status</h4>
                              <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.prepressStatus)}`}>
                                {formatStatus(product.prepressStatus)}
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="text-xs font-medium mb-1">Production Status</h4>
                              <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.productionStatus)}`}>
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
      )}
    </div>
  );
};

export default OrderProducts;
