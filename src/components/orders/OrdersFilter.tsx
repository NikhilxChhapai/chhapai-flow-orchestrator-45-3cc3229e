
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Search, Filter, ChevronDown, Calendar } from "lucide-react";

interface OrdersFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterStatus: string | null;
  setFilterStatus: (status: string | null) => void;
}

const OrdersFilter = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus
}: OrdersFilterProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search orders by ID, customer or address..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setFilterStatus(null)}>
              All Orders
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus("Order_Received")}>
              Order Received
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus("Design_InProgress")}>
              Design In Progress
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus("Prepress_InProgress")}>
              Prepress
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus("Production_Printing")}>
              Production
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus("ReadyToDispatch")}>
              Ready to Dispatch
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus("Completed")}>
              Completed
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>Date Range</span>
        </Button>
      </div>
    </div>
  );
};

export default OrdersFilter;
