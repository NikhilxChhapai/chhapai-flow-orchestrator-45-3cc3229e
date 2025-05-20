
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { OrderProduct } from "@/lib/firebase/types";

interface ProductionStagesProps {
  product: OrderProduct;
  orderId: string;
}

const ProductionStages = ({ product, orderId }: ProductionStagesProps) => {
  const { toast } = useToast();
  const [updating, setUpdating] = useState(false);

  // Handle production stage toggle
  const handleStageToggle = async (productId: string | undefined, stage: string, checked: boolean) => {
    if (!productId || !orderId) return;
    
    setUpdating(true);
    
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
      setUpdating(false);
    }
  };

  if (!product.productionStages) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-2">
      {product.productionStages && Object.entries(product.productionStages).map(([stage, completed]) => (
        <div key={stage} className="flex items-center space-x-2">
          <Checkbox 
            id={`${product.id}-${stage}`} 
            checked={completed} 
            onCheckedChange={(checked) => 
              handleStageToggle(product.id, stage, checked === true)
            }
            disabled={updating}
            className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
          />
          <label 
            htmlFor={`${product.id}-${stage}`}
            className="text-sm capitalize cursor-pointer text-foreground"
          >
            {stage}
          </label>
        </div>
      ))}
    </div>
  );
};

export default ProductionStages;
