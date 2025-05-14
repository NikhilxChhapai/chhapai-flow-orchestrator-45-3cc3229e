
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Trash, Plus } from "lucide-react";

interface OrderFormProps {
  isEditing?: boolean;
  initialData?: any;
}

const OrderForm = ({ isEditing = false, initialData = {} }: OrderFormProps) => {
  const [formData, setFormData] = useState({
    orderNumber: initialData.orderNumber || "",
    clientName: initialData.clientName || "",
    orderAmount: initialData.orderAmount || "",
    gstNumber: initialData.gstNumber || "",
    contactNumber: initialData.contactNumber || "",
    deliveryDate: initialData.deliveryDate 
      ? new Date(initialData.deliveryDate) 
      : undefined,
    deliveryAddress: initialData.deliveryAddress || "",
    remarks: initialData.remarks || "",
    products: initialData.products || [{ name: "" }],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductChange = (index: number, value: string) => {
    const updatedProducts = [...formData.products];
    updatedProducts[index] = { ...updatedProducts[index], name: value };
    setFormData((prev) => ({ ...prev, products: updatedProducts }));
  };

  const addProduct = () => {
    setFormData((prev) => ({
      ...prev,
      products: [...prev.products, { name: "" }],
    }));
  };

  const removeProduct = (index: number) => {
    if (formData.products.length <= 1) return;
    const updatedProducts = [...formData.products];
    updatedProducts.splice(index, 1);
    setFormData((prev) => ({ ...prev, products: updatedProducts }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Here you would integrate with Firebase to save the order
      console.log("Submitting order:", formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: isEditing ? "Order Updated" : "Order Created",
        description: `Order ${formData.orderNumber} has been ${isEditing ? "updated" : "created"} successfully.`,
      });
      
      navigate("/orders");
    } catch (error) {
      console.error("Error saving order:", error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} order. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Order Information</CardTitle>
          <CardDescription>
            Enter the basic details about this order.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="orderNumber">Order Number</Label>
              <Input
                id="orderNumber"
                name="orderNumber"
                value={formData.orderNumber}
                onChange={handleChange}
                placeholder="e.g., ORD-2023-001"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                placeholder="e.g., ABC Enterprises"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="orderAmount">Order Amount (₹)</Label>
              <Input
                id="orderAmount"
                name="orderAmount"
                value={formData.orderAmount}
                onChange={handleChange}
                placeholder="e.g., 10000"
                type="number"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gstNumber">GST Number (Optional)</Label>
              <Input
                id="gstNumber"
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleChange}
                placeholder="e.g., 22AAAAA0000A1Z5"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>
            Add products to this order.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.products.map((product, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="flex-1">
                <Input
                  placeholder={`Product ${index + 1} name`}
                  value={product.name}
                  onChange={(e) => handleProductChange(index, e.target.value)}
                  required
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeProduct(index)}
                disabled={formData.products.length <= 1}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addProduct}
            className="mt-2"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Product
          </Button>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Delivery Information</CardTitle>
          <CardDescription>
            Specify when and where the order should be delivered.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="e.g., +91 9876543210"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Expected Delivery Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.deliveryDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.deliveryDate ? (
                      format(formData.deliveryDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.deliveryDate}
                    onSelect={(date) =>
                      setFormData((prev) => ({ ...prev, deliveryDate: date }))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="deliveryAddress">Delivery Address</Label>
            <Textarea
              id="deliveryAddress"
              name="deliveryAddress"
              value={formData.deliveryAddress}
              onChange={handleChange}
              placeholder="Enter delivery address"
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              placeholder="Any additional information or instructions"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/orders")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? isEditing
                ? "Updating..."
                : "Creating..."
              : isEditing
              ? "Update Order"
              : "Create Order"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default OrderForm;
