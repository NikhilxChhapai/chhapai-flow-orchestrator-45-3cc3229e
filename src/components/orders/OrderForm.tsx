
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createOrder, updateOrder } from "@/lib/firebase";

// Import our refactored components
import OrderBasicInfo from "./form/OrderBasicInfo";
import OrderProductsForm from "./form/OrderProductsForm";
import OrderDeliveryForm from "./form/OrderDeliveryForm";
import OrderNotesForm from "./form/OrderNotesForm";
import OrderFormActions from "./form/OrderFormActions";

interface OrderFormProps {
  isEditing?: boolean;
  initialData?: any;
  orderId?: string;
}

const OrderForm = ({ isEditing = false, initialData = {}, orderId = "" }: OrderFormProps) => {
  const [formData, setFormData] = useState({
    orderNumber: initialData.orderNumber || `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    clientName: initialData.clientName || "",
    orderAmount: initialData.orderAmount || "",
    gstNumber: initialData.gstNumber || "",
    contactNumber: initialData.contactNumber || "",
    deliveryDate: initialData.deliveryDate 
      ? new Date(initialData.deliveryDate.toDate?.() || initialData.deliveryDate) 
      : undefined,
    deliveryAddress: initialData.deliveryAddress || "",
    remarks: initialData.remarks || "",
    products: initialData.products || [{ name: "" }],
    status: initialData.status || "Order_Received"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser } = useAuth();

  useEffect(() => {
    // If editing and we have initialData, update the form
    if (isEditing && initialData && Object.keys(initialData).length > 0) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        deliveryDate: initialData.deliveryDate 
          ? new Date(initialData.deliveryDate.toDate?.() || initialData.deliveryDate) 
          : undefined,
        // Ensure products is properly formatted
        products: initialData.products || [{ name: "" }],
      }));
    }
  }, [isEditing, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Updated to handle all product fields
  const handleProductChange = (index: number, field: string, value: string | number) => {
    const updatedProducts = [...formData.products];
    updatedProducts[index] = { ...updatedProducts[index], [field]: value };
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

  const handleDateChange = (date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, deliveryDate: date }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Make sure we have required fields
      if (!formData.clientName || !formData.orderAmount || !formData.contactNumber || !formData.deliveryAddress) {
        throw new Error("Please fill in all required fields.");
      }
      
      // Add user information to the order
      const orderData = {
        ...formData,
        createdBy: currentUser?.uid,
        createdByName: currentUser?.displayName || currentUser?.email,
        updatedBy: currentUser?.uid,
        orderAmount: parseFloat(formData.orderAmount.toString()),
      };
      
      let result;
      if (isEditing && orderId) {
        // Update existing order
        result = await updateOrder(orderId, orderData);
        toast({
          title: "Order Updated",
          description: `Order ${formData.orderNumber} has been updated successfully.`,
        });
      } else {
        // Create new order
        result = await createOrder(orderData);
        toast({
          title: "Order Created",
          description: `Order ${formData.orderNumber} has been created successfully.`,
        });
      }
      
      navigate("/orders");
    } catch (error: any) {
      console.error("Error saving order:", error);
      toast({
        title: "Error",
        description: error.message || `Failed to ${isEditing ? "update" : "create"} order. Please try again.`,
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
        <CardContent>
          <OrderBasicInfo
            orderNumber={formData.orderNumber}
            clientName={formData.clientName}
            orderAmount={formData.orderAmount}
            gstNumber={formData.gstNumber}
            isEditing={isEditing}
            onChange={handleChange}
          />
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>
            Add products to this order.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OrderProductsForm
            products={formData.products}
            onProductChange={handleProductChange}
            onAddProduct={addProduct}
            onRemoveProduct={removeProduct}
          />
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Delivery Information</CardTitle>
          <CardDescription>
            Specify when and where the order should be delivered.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OrderDeliveryForm
            contactNumber={formData.contactNumber}
            deliveryDate={formData.deliveryDate}
            deliveryAddress={formData.deliveryAddress}
            onChange={handleChange}
            onDateChange={handleDateChange}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderNotesForm
            remarks={formData.remarks}
            onChange={handleChange}
          />
        </CardContent>
        <CardFooter>
          <OrderFormActions
            isSubmitting={isSubmitting}
            isEditing={isEditing}
            onCancel={() => navigate("/orders")}
          />
        </CardFooter>
      </Card>
    </form>
  );
};

export default OrderForm;
