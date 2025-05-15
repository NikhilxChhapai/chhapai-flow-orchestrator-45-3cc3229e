
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus, Download } from "lucide-react";

interface OrdersHeaderProps {
  onExport: () => void;
}

const OrdersHeader = ({ onExport }: OrdersHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">
          View and manage all customer orders.
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <Link to="/orders/create">
          <Button className="flex items-center gap-1">
            <Plus size={16} />
            <span>New Order</span>
          </Button>
        </Link>
        <Button variant="outline" className="flex items-center gap-1" onClick={onExport}>
          <Download size={16} />
          <span>Export</span>
        </Button>
      </div>
    </div>
  );
};

export default OrdersHeader;
