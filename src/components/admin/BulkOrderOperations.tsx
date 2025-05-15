
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Trash, AlertCircle, Archive } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, where, deleteDoc, getDocs, writeBatch, doc, updateDoc } from "firebase/firestore";

const BulkOrderOperations = () => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [deleteCompletedOnly, setDeleteCompletedOnly] = useState(true);
  
  const handleBulkUpdateStatus = async () => {
    if (!selectedStatus) {
      toast({
        title: "Error",
        description: "Please select a status to update to.",
        variant: "destructive",
      });
      return;
    }
    
    setIsUpdating(true);
    
    try {
      const batch = writeBatch(db);
      const ordersRef = collection(db, "orders");
      const snapshot = await getDocs(ordersRef);
      
      snapshot.forEach((doc) => {
        batch.update(doc.ref, { 
          status: selectedStatus,
          updatedAt: new Date()
        });
      });
      
      await batch.commit();
      
      toast({
        title: "Status Updated",
        description: `Successfully updated all orders to ${selectedStatus.replace(/_/g, " ")}`,
      });
    } catch (error) {
      console.error("Error updating orders:", error);
      toast({
        title: "Error",
        description: "Failed to update order statuses. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleDeleteAllOrders = async () => {
    setIsDeleting(true);
    
    try {
      const ordersRef = collection(db, "orders");
      // Fix: Using a separate variable for the query
      let ordersQuery;
      
      if (deleteCompletedOnly) {
        ordersQuery = query(ordersRef, where("status", "==", "Completed"));
      } else {
        ordersQuery = ordersRef;
      }
      
      const snapshot = await getDocs(ordersQuery);
      
      if (snapshot.empty) {
        toast({
          title: "No Orders Found",
          description: deleteCompletedOnly ? 
            "No completed orders found to delete." : 
            "No orders found to delete.",
          variant: "default",
        });
        setIsDeleting(false);
        return;
      }
      
      const batch = writeBatch(db);
      snapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      
      toast({
        title: "Orders Deleted",
        description: `Successfully deleted ${snapshot.size} orders.`,
      });
    } catch (error) {
      console.error("Error deleting orders:", error);
      toast({
        title: "Error",
        description: "Failed to delete orders. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bulk Status Update</CardTitle>
          <CardDescription>
            Change the status of all orders at once
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Target Status</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Order_Received">Order Received</SelectItem>
                    <SelectItem value="Design_InProgress">Design In Progress</SelectItem>
                    <SelectItem value="Prepress_InProgress">Prepress In Progress</SelectItem>
                    <SelectItem value="Production_Printing">Production Printing</SelectItem>
                    <SelectItem value="ReadyToDispatch">Ready To Dispatch</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleBulkUpdateStatus}
            disabled={isUpdating || !selectedStatus}
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              'Update All Orders'
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card className="border-red-200">
        <CardHeader>
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <CardTitle>Danger Zone</CardTitle>
          </div>
          <CardDescription>
            These actions cannot be undone. Please be certain.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="delete-completed-only" 
                checked={deleteCompletedOnly} 
                onCheckedChange={(checked) => {
                  if (typeof checked === 'boolean') {
                    setDeleteCompletedOnly(checked);
                  }
                }} 
              />
              <label 
                htmlFor="delete-completed-only" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Delete only completed orders
              </label>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="flex items-center gap-2">
                <Trash className="h-4 w-4" />
                Delete All Orders
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  {deleteCompletedOnly ? (
                    "This action cannot be undone. This will permanently delete all completed orders from the database."
                  ) : (
                    "This action cannot be undone. This will permanently delete ALL orders from the database."
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-500 hover:bg-red-600"
                  onClick={handleDeleteAllOrders}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Yes, Delete All'
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="ml-2 flex items-center gap-2">
                <Archive className="h-4 w-4" />
                Archive All
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Archive all orders?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will mark all orders as archived but will not delete them from the database.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>
                  Yes, Archive All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BulkOrderOperations;
