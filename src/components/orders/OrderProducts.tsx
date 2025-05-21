
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OrderProduct } from "@/lib/firebase/types";

interface OrderProductsProps {
  products: OrderProduct[];
  showPricing?: boolean;
}

const OrderProducts = ({ products, showPricing = true }: OrderProductsProps) => {
  // Format currency helper
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount);
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Order Products</h3>
      
      <div className="border rounded-md shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-1/2 font-semibold">Product</TableHead>
              <TableHead className="font-semibold">Quantity</TableHead>
              {showPricing && (
                <>
                  <TableHead className="font-semibold">Unit Price</TableHead>
                  <TableHead className="font-semibold">Total</TableHead>
                </>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length > 0 ? (
              products.map((product, index) => (
                <TableRow key={product.id || index} className={index % 2 === 0 ? "bg-card" : "bg-muted/30"}>
                  <TableCell className="font-medium text-foreground">{product.name}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  {showPricing && (
                    <>
                      <TableCell>{formatCurrency(product.price / product.quantity)}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(product.price)}</TableCell>
                    </>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={showPricing ? 4 : 2} className="text-center py-4 text-muted-foreground">
                  No products added to this order yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OrderProducts;
