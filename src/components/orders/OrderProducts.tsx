
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

interface Product {
  name: string;
  quantity?: number;
  price?: number | string;
}

interface OrderProductsProps {
  products: Product[];
}

const OrderProducts = ({ products }: OrderProductsProps) => {
  return (
    <div>
      <h3 className="text-sm font-medium text-muted-foreground mb-2">Products</h3>
      <div className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products && products.map((product: Product, index: number) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="text-right">{product.quantity || 1}</TableCell>
                <TableCell className="text-right">
                  {product.price 
                    ? `₹${product.price}`
                    : "Included in total"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OrderProducts;
