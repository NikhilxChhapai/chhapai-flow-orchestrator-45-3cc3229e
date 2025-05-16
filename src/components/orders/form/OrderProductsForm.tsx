
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash, Plus } from "lucide-react";

interface Product {
  name: string;
  quantity?: number;
  price?: number;
}

interface OrderProductsFormProps {
  products: Product[];
  onProductChange: (index: number, value: string) => void;
  onAddProduct: () => void;
  onRemoveProduct: (index: number) => void;
}

const OrderProductsForm = ({
  products,
  onProductChange,
  onAddProduct,
  onRemoveProduct,
}: OrderProductsFormProps) => {
  return (
    <div className="space-y-4">
      {products.map((product, index) => (
        <div key={index} className="flex items-center space-x-2">
          <div className="flex-1">
            <Input
              placeholder={`Product ${index + 1} name`}
              value={product.name}
              onChange={(e) => onProductChange(index, e.target.value)}
              required
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onRemoveProduct(index)}
            disabled={products.length <= 1}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onAddProduct}
        className="mt-2"
      >
        <Plus className="h-4 w-4 mr-2" /> Add Product
      </Button>
    </div>
  );
};

export default OrderProductsForm;
