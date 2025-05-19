
import { motion } from "framer-motion";
import OrderForm from "@/components/orders/OrderForm";
import { FileText, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CreateOrder = () => {
  const navigate = useNavigate();
  
  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header with back button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => navigate('/orders')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight flex items-center">
              <FileText className="mr-2 h-6 w-6 text-primary" />
              Create New Order
            </h1>
          </div>
          <p className="text-muted-foreground ml-10">
            Fill out the form below to create a new print order.
          </p>
        </div>
      </div>
      
      {/* Form with animation */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <OrderForm />
      </motion.div>
    </motion.div>
  );
};

export default CreateOrder;
