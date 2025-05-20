
import { CheckCircle, Loader2, XCircle } from "lucide-react";

interface ProductStatusIndicatorProps {
  status: string | undefined;
}

const ProductStatusIndicator = ({ status }: ProductStatusIndicatorProps) => {
  // Get status indicator
  if (!status) return null;
  
  switch (status) {
    case "approved":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "needsRevision":
      return <XCircle className="h-5 w-5 text-red-500" />;
    case "pendingApproval":
      return <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />;
    case "inProgress":
      return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
    case "complete":
    case "readyToDispatch":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    default:
      return null;
  }
};

export default ProductStatusIndicator;
