
import OrderForm from "@/components/orders/OrderForm";

const CreateOrder = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Order</h1>
        <p className="text-muted-foreground">
          Fill out the form below to create a new order.
        </p>
      </div>
      
      <OrderForm />
    </div>
  );
};

export default CreateOrder;
