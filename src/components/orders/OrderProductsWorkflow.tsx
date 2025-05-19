
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  updateProductDesignStatus, 
  updateProductPrepressStatus,
  updateProductionStatus,
  OrderStatus, 
  DesignStatus, 
  PrepressStatus,
  ProductionStatus,
} from "@/lib/firebase";
import { 
  Pen, 
  File, 
  Truck, 
  Send, 
  RefreshCw, 
  CheckCircle2, 
  X,
  Loader2
} from "lucide-react";

interface Product {
  id?: string;
  name: string;
  quantity?: number;
  price?: number;
  description?: string;
  designStatus?: string;
  prepressStatus?: string;
  productionStatus?: string;
  productionStages?: {
    printing?: boolean;
    cutting?: boolean;
    foiling?: boolean;
    [key: string]: boolean | undefined;
  };
}

interface OrderProductsWorkflowProps {
  orderId: string;
  products: Product[];
  department: "design" | "prepress" | "production" | "sales" | "admin";
  onRefresh?: () => void;
}

const OrderProductsWorkflow = ({ 
  orderId, 
  products, 
  department, 
  onRefresh 
}: OrderProductsWorkflowProps) => {
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedProductIndex, setSelectedProductIndex] = useState<number>(-1);
  const [activeTab, setActiveTab] = useState("design");
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [approvalStatus, setApprovalStatus] = useState<"approved" | "rejected">("approved");
  
  // Design-specific state
  const [designStatus, setDesignStatus] = useState<DesignStatus>("pending");
  
  // Prepress-specific state
  const [prepressStatus, setPrepressStatus] = useState<PrepressStatus>("pending");
  
  // Production-specific state
  const [productionStatus, setProductionStatus] = useState<ProductionStatus>("inProcess");
  const [productionStages, setProductionStages] = useState({
    printing: false,
    cutting: false,
    foiling: false,
    packaging: false,
  });
  
  const handleSelectProduct = (product: Product, index: number) => {
    setSelectedProduct(product);
    setSelectedProductIndex(index);
    
    // Set initial values based on product status
    if (product.designStatus) {
      setDesignStatus(product.designStatus as DesignStatus);
    }
    
    if (product.prepressStatus) {
      setPrepressStatus(product.prepressStatus as PrepressStatus);
    }
    
    if (product.productionStatus) {
      setProductionStatus(product.productionStatus as ProductionStatus);
    }
    
    if (product.productionStages) {
      setProductionStages({
        ...productionStages,
        ...product.productionStages
      });
    }
  };
  
  const handleUpdateDesignStatus = async () => {
    if (!selectedProduct || selectedProductIndex === -1) return;
    
    setLoading(true);
    try {
      await updateProductDesignStatus(
        orderId,
        selectedProductIndex,
        designStatus,
        `Design status updated to ${designStatus} for product: ${selectedProduct.name}`
      );
      
      toast({
        title: "Status Updated",
        description: `Design status for ${selectedProduct.name} has been updated.`,
      });
      
      if (onRefresh) onRefresh();
      setSelectedProduct(null);
      setSelectedProductIndex(-1);
    } catch (error) {
      console.error("Error updating design status:", error);
      toast({
        title: "Error",
        description: "Failed to update design status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdatePrepressStatus = async () => {
    if (!selectedProduct || selectedProductIndex === -1) return;
    
    setLoading(true);
    try {
      await updateProductPrepressStatus(
        orderId,
        selectedProductIndex,
        prepressStatus,
        `Prepress status updated to ${prepressStatus} for product: ${selectedProduct.name}`
      );
      
      toast({
        title: "Status Updated",
        description: `Prepress status for ${selectedProduct.name} has been updated.`,
      });
      
      if (onRefresh) onRefresh();
      setSelectedProduct(null);
      setSelectedProductIndex(-1);
    } catch (error) {
      console.error("Error updating prepress status:", error);
      toast({
        title: "Error",
        description: "Failed to update prepress status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateProductionStage = async (stage: string, completed: boolean) => {
    if (!selectedProduct || selectedProductIndex === -1) return;
    
    setLoading(true);
    try {
      await updateProductionStatus(
        orderId,
        selectedProductIndex,
        productionStatus,
        stage,
        `Production stage "${stage}" ${completed ? "completed" : "marked incomplete"} for product: ${selectedProduct.name}`
      );
      
      toast({
        title: "Production Updated",
        description: `${stage} stage for ${selectedProduct.name} has been updated.`,
      });
      
      setProductionStages({
        ...productionStages,
        [stage]: completed
      });
      
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error updating production stage:", error);
      toast({
        title: "Error",
        description: "Failed to update production stage. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateProductionStatus = async () => {
    if (!selectedProduct || selectedProductIndex === -1) return;
    
    setLoading(true);
    try {
      await updateProductionStatus(
        orderId,
        selectedProductIndex,
        productionStatus,
        undefined,
        `Production status updated to ${productionStatus} for product: ${selectedProduct.name}`
      );
      
      toast({
        title: "Status Updated",
        description: `Production status for ${selectedProduct.name} has been updated.`,
      });
      
      if (onRefresh) onRefresh();
      setSelectedProduct(null);
      setSelectedProductIndex(-1);
    } catch (error) {
      console.error("Error updating production status:", error);
      toast({
        title: "Error",
        description: "Failed to update production status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleOpenApprovalDialog = () => {
    setDialogOpen(true);
  };
  
  const handleSubmitApproval = async () => {
    if (!selectedProduct || selectedProductIndex === -1) return;
    
    setLoading(true);
    try {
      if (department === "design" || department === "admin" || department === "sales") {
        const status = approvalStatus === "approved" ? "approved" : "needsRevision";
        await updateProductDesignStatus(
          orderId,
          selectedProductIndex,
          status as DesignStatus,
          `Design ${approvalStatus}: ${feedback}`
        );
      }
      
      if (department === "prepress" || department === "admin" || department === "sales") {
        const status = approvalStatus === "approved" ? "approved" : "needsRevision";
        await updateProductPrepressStatus(
          orderId,
          selectedProductIndex,
          status as PrepressStatus,
          `Prepress ${approvalStatus}: ${feedback}`
        );
      }
      
      toast({
        title: approvalStatus === "approved" ? "Approved" : "Rejected",
        description: `${selectedProduct.name} has been ${approvalStatus}.`,
      });
      
      if (onRefresh) onRefresh();
      setSelectedProduct(null);
      setSelectedProductIndex(-1);
      setFeedback("");
      setDialogOpen(false);
    } catch (error) {
      console.error("Error updating approval status:", error);
      toast({
        title: "Error",
        description: "Failed to update approval status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Format status text
  const formatStatus = (status?: string) => {
    if (!status) return "Not Started";
    return status
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .trim();
  };

  // Get status badge color
  const getStatusColor = (status?: string) => {
    if (!status) return "bg-gray-100 text-gray-700";
    if (status.includes("approved") || status === "complete") return "bg-green-100 text-green-700";
    if (status.includes("pending")) return "bg-yellow-100 text-yellow-700";
    if (status.includes("revision")) return "bg-red-100 text-red-700";
    if (status.includes("progress")) return "bg-blue-100 text-blue-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Workflow</CardTitle>
        <CardDescription>
          Update status and track product workflow
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border rounded-md p-4">
            <h3 className="font-medium mb-2">Select Product</h3>
            <div className="space-y-2">
              {products.map((product, index) => (
                <div 
                  key={index}
                  onClick={() => handleSelectProduct(product, index)}
                  className={`p-3 border rounded-md cursor-pointer transition-colors ${
                    selectedProductIndex === index 
                      ? "border-primary bg-primary/10" 
                      : "hover:bg-accent"
                  }`}
                >
                  <div className="flex justify-between">
                    <span className="font-medium">{product.name}</span>
                    <span>{product.quantity || 1} units</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <div>
                      <span className="text-xs text-muted-foreground">Design</span>
                      <div className={`text-xs px-1.5 py-0.5 rounded-full mt-1 inline-block ${getStatusColor(product.designStatus)}`}>
                        {formatStatus(product.designStatus)}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-xs text-muted-foreground">Prepress</span>
                      <div className={`text-xs px-1.5 py-0.5 rounded-full mt-1 inline-block ${getStatusColor(product.prepressStatus)}`}>
                        {formatStatus(product.prepressStatus)}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-xs text-muted-foreground">Production</span>
                      <div className={`text-xs px-1.5 py-0.5 rounded-full mt-1 inline-block ${getStatusColor(product.productionStatus)}`}>
                        {formatStatus(product.productionStatus)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            {selectedProduct ? (
              <div>
                <h3 className="font-medium mb-4">{selectedProduct.name} - Update Status</h3>
                
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-3">
                    <TabsTrigger value="design" disabled={!(department === "design" || department === "admin" || department === "sales")}>
                      <Pen className="h-4 w-4 mr-2" />
                      Design
                    </TabsTrigger>
                    <TabsTrigger value="prepress" disabled={!(department === "prepress" || department === "admin" || department === "sales")}>
                      <File className="h-4 w-4 mr-2" />
                      Prepress
                    </TabsTrigger>
                    <TabsTrigger value="production" disabled={!(department === "production" || department === "admin" || department === "sales")}>
                      <Truck className="h-4 w-4 mr-2" />
                      Production
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="design">
                    {(department === "design") && (
                      <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="designStatus">Status</Label>
                          <Select 
                            defaultValue={designStatus} 
                            onValueChange={(value) => setDesignStatus(value as DesignStatus)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="inProgress">In Progress</SelectItem>
                              <SelectItem value="pendingApproval">Request Approval</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex justify-end">
                          <Button onClick={handleUpdateDesignStatus} disabled={loading}>
                            {loading ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Updating...
                              </>
                            ) : (
                              <>
                                <Send className="h-4 w-4 mr-2" />
                                Update Status
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {(department === "admin" || department === "sales") && (
                      <div className="space-y-4 mt-4">
                        <div>
                          <Label>Current Status</Label>
                          <div className={`text-sm px-2 py-1 mt-1 rounded inline-block ${getStatusColor(selectedProduct.designStatus)}`}>
                            {formatStatus(selectedProduct.designStatus)}
                          </div>
                        </div>
                        
                        {selectedProduct.designStatus === "pendingApproval" && (
                          <div className="flex justify-end">
                            <Button onClick={handleOpenApprovalDialog}>
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Review Design
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="prepress">
                    {(department === "prepress") && (
                      <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="prepressStatus">Status</Label>
                          <Select 
                            defaultValue={prepressStatus} 
                            onValueChange={(value) => setPrepressStatus(value as PrepressStatus)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="inProgress">In Progress</SelectItem>
                              <SelectItem value="pendingApproval">Request Approval</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex justify-end">
                          <Button onClick={handleUpdatePrepressStatus} disabled={loading}>
                            {loading ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Updating...
                              </>
                            ) : (
                              <>
                                <Send className="h-4 w-4 mr-2" />
                                Update Status
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {(department === "admin" || department === "sales") && (
                      <div className="space-y-4 mt-4">
                        <div>
                          <Label>Current Status</Label>
                          <div className={`text-sm px-2 py-1 mt-1 rounded inline-block ${getStatusColor(selectedProduct.prepressStatus)}`}>
                            {formatStatus(selectedProduct.prepressStatus)}
                          </div>
                        </div>
                        
                        {selectedProduct.prepressStatus === "pendingApproval" && (
                          <div className="flex justify-end">
                            <Button onClick={handleOpenApprovalDialog}>
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Review Prepress
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="production">
                    {(department === "production") && (
                      <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="productionStatus">Status</Label>
                          <Select 
                            defaultValue={productionStatus} 
                            onValueChange={(value) => setProductionStatus(value as ProductionStatus)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="inProcess">In Process</SelectItem>
                              <SelectItem value="readyToDispatch">Ready To Dispatch</SelectItem>
                              <SelectItem value="complete">Complete</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2 mt-4">
                          <Label>Production Stages</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center space-x-2">
                              <input 
                                id="printing"
                                type="checkbox" 
                                className="h-4 w-4 rounded"
                                checked={productionStages.printing}
                                onChange={(e) => handleUpdateProductionStage('printing', e.target.checked)}
                              />
                              <label htmlFor="printing">Printing</label>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <input 
                                id="cutting"
                                type="checkbox" 
                                className="h-4 w-4 rounded"
                                checked={productionStages.cutting}
                                onChange={(e) => handleUpdateProductionStage('cutting', e.target.checked)}
                              />
                              <label htmlFor="cutting">Cutting</label>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <input 
                                id="foiling"
                                type="checkbox" 
                                className="h-4 w-4 rounded"
                                checked={productionStages.foiling}
                                onChange={(e) => handleUpdateProductionStage('foiling', e.target.checked)}
                              />
                              <label htmlFor="foiling">Foiling</label>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <input 
                                id="packaging"
                                type="checkbox" 
                                className="h-4 w-4 rounded"
                                checked={productionStages.packaging}
                                onChange={(e) => handleUpdateProductionStage('packaging', e.target.checked)}
                              />
                              <label htmlFor="packaging">Packaging</label>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <Button onClick={handleUpdateProductionStatus} disabled={loading}>
                            {loading ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Updating...
                              </>
                            ) : (
                              <>
                                <Send className="h-4 w-4 mr-2" />
                                Update Status
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {(department === "admin" || department === "sales") && (
                      <div className="space-y-4 mt-4">
                        <div>
                          <Label>Current Status</Label>
                          <div className={`text-sm px-2 py-1 mt-1 rounded inline-block ${getStatusColor(selectedProduct.productionStatus)}`}>
                            {formatStatus(selectedProduct.productionStatus)}
                          </div>
                        </div>
                        
                        <div className="mt-2">
                          <Label className="mb-2 block">Production Progress</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {selectedProduct.productionStages && Object.entries(selectedProduct.productionStages).map(([stage, completed]) => (
                              <div key={stage} className="flex items-center space-x-2">
                                <div className={`w-4 h-4 rounded-full ${completed ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                                <span className="capitalize">{stage}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center h-full">
                <RefreshCw className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No Product Selected</h3>
                <p className="text-muted-foreground mt-2">
                  Select a product from the list to update its status
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Approval Dialog */}
        <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Review {activeTab === "design" ? "Design" : activeTab === "prepress" ? "Prepress" : "Product"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                Provide feedback and approve or request revisions for {selectedProduct?.name}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="approvalStatus">Decision</Label>
                <Select 
                  defaultValue="approved" 
                  onValueChange={(value) => setApprovalStatus(value as "approved" | "rejected")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Decision" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approved">Approve</SelectItem>
                    <SelectItem value="rejected">Request Revisions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="feedback">Feedback</Label>
                <Textarea 
                  id="feedback" 
                  placeholder="Provide feedback..." 
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
            
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSubmitApproval} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    {approvalStatus === "approved" ? (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Approve
                      </>
                    ) : (
                      <>
                        <X className="mr-2 h-4 w-4" />
                        Request Revisions
                      </>
                    )}
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default OrderProductsWorkflow;
