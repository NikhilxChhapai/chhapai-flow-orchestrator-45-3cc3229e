
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";

interface Product {
  name: string;
  quantity?: number;
  price?: number;
  description?: string;
}

interface OrderProductsFormProps {
  products: Product[];
  onProductChange: (index: number, field: string, value: string | number) => void;
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
        <div key={index} className="p-4 border rounded-md bg-background">
          <div className="flex justify-between items-start mb-2">
            <Label className="font-medium">Product {index + 1}</Label>
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
          
          <div className="space-y-3">
            <div>
              <Label htmlFor={`product-name-${index}`}>Name</Label>
              <Input
                id={`product-name-${index}`}
                placeholder="Product name"
                value={product.name}
                onChange={(e) => onProductChange(index, "name", e.target.value)}
                className="mt-1"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor={`product-quantity-${index}`}>Quantity</Label>
                <Input
                  id={`product-quantity-${index}`}
                  type="number"
                  placeholder="Quantity"
                  min="1"
                  value={product.quantity || ''}
                  onChange={(e) => onProductChange(index, "quantity", parseInt(e.target.value) || 1)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor={`product-price-${index}`}>Price (₹)</Label>
                <Input
                  id={`product-price-${index}`}
                  type="number"
                  placeholder="Price"
                  min="0"
                  step="0.01"
                  value={product.price || ''}
                  onChange={(e) => onProductChange(index, "price", parseFloat(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor={`product-description-${index}`}>Description</Label>
              <Textarea
                id={`product-description-${index}`}
                placeholder="Product description"
                value={product.description || ''}
                onChange={(e) => onProductChange(index, "description", e.target.value)}
                className="mt-1"
                rows={2}
              />
            </div>
          </div>
        </div>
      ))}
      
      <Button
        type="button"
        variant="outline"
        onClick={onAddProduct}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" /> Add Product
      </Button>
    </div>
  );
};

export default OrderProductsForm;
