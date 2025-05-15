
import { Button } from "@/components/ui/button";

interface OrdersPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const OrdersPagination = ({ currentPage = 1, totalPages = 1, onPageChange }: OrdersPaginationProps) => {
  if (totalPages <= 1) return null;
  
  return (
    <div className="flex items-center justify-center pt-4">
      <Button 
        variant="outline" 
        size="sm" 
        className="mx-1" 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        Previous
      </Button>
      
      {[...Array(totalPages)].map((_, i) => (
        <Button 
          key={i}
          variant={currentPage === i + 1 ? "default" : "outline"} 
          size="sm" 
          className="mx-1"
          onClick={() => onPageChange(i + 1)}
        >
          {i + 1}
        </Button>
      ))}
      
      <Button 
        variant="outline" 
        size="sm" 
        className="mx-1"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        Next
      </Button>
    </div>
  );
};

export default OrdersPagination;
