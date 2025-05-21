
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderProducts from "./OrderProducts";
import OrderProductsWorkflow from "./OrderProductsWorkflow";
import OrderTimeline from "./OrderTimeline";
import { Order, TimelineEvent, DepartmentType } from "@/lib/firebase/types";
import OrderDelivery from "./OrderDelivery";
import OrderNotes from "./OrderNotes";
import OrderSummary from "./OrderSummary";
import OrderPayment from "./OrderPayment";
import OrderHeader from "./OrderHeader";
import { canUserUpdateOrderStatus } from "@/utils/workflowUtils";

interface OrderDetailTabsProps {
  order: Order;
  userRole: string;
  timelineEvents: TimelineEvent[];
  onStatusUpdate: (status: any) => Promise<void>;
  onUpdatePaymentStatus: (status: any) => Promise<void>;
  updatingStatus: boolean;
  formatStatus: (status: string) => string;
  getStatusBadge: (status: string) => string;
}

const OrderDetailTabs = ({ 
  order, 
  userRole, 
  timelineEvents,
  onStatusUpdate,
  onUpdatePaymentStatus,
  updatingStatus,
  formatStatus,
  getStatusBadge
}: OrderDetailTabsProps) => {
  const [activeTab, setActiveTab] = useState("details");
  
  // Function to determine which tabs should be visible based on user role
  const getVisibleTabs = () => {
    if (userRole === 'admin' || userRole === 'sales') {
      return ["details", "products", "workflow", "timeline"];
    } else if (userRole === 'design' || userRole === 'prepress' || userRole === 'production') {
      return ["products", "workflow", "timeline"];
    }
    return ["details", "products"];
  };

  const visibleTabs = getVisibleTabs();

  // Set initial active tab based on user role if not already set
  useEffect(() => {
    if (visibleTabs.length > 0 && !visibleTabs.includes(activeTab)) {
      setActiveTab(visibleTabs[0]);
    }
  }, [visibleTabs, activeTab]);

  // Check if user can view financial details
  const canViewFinancialDetails = userRole === 'admin' || userRole === 'sales';

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="w-full mb-6 tabs-list">
        {visibleTabs.includes("details") && (
          <TabsTrigger value="details" className="flex-1 py-3 tab-trigger">Order Details</TabsTrigger>
        )}
        {visibleTabs.includes("products") && (
          <TabsTrigger value="products" className="flex-1 py-3 tab-trigger">Products</TabsTrigger>
        )}
        {visibleTabs.includes("workflow") && (
          <TabsTrigger value="workflow" className="flex-1 py-3 tab-trigger">Workflow</TabsTrigger>
        )}
        {visibleTabs.includes("timeline") && (
          <TabsTrigger value="timeline" className="flex-1 py-3 tab-trigger">Timeline</TabsTrigger>
        )}
      </TabsList>
      
      <div className="mt-6">
        {/* Order Details Tab */}
        <TabsContent value="details" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <OrderHeader 
                clientName={order.clientName}
                orderNumber={order.orderNumber}
                orderId={order.id}
                gstNumber={canViewFinancialDetails ? order.gstNumber : undefined}
                contactNumber={order.contactNumber}
              />
              
              <OrderDelivery 
                deliveryDate={order.deliveryDate ? new Date(order.deliveryDate.seconds * 1000).toLocaleDateString() : "Not specified"} 
                deliveryAddress={order.deliveryAddress}
                contactNumber={order.contactNumber}
              />
              
              <OrderNotes remarks={order.remarks} />
            </div>
            
            <div className="space-y-6">
              <OrderSummary 
                orderAmount={canViewFinancialDetails ? order.orderAmount : undefined}
                status={order.status}
                clientName={order.clientName}
                gstNumber={canViewFinancialDetails ? order.gstNumber : undefined}
                createdDate={new Date(order.createdAt.seconds * 1000).toLocaleDateString()}
                onStatusUpdate={onStatusUpdate}
                updating={updatingStatus}
                formatStatus={formatStatus}
                getStatusBadge={getStatusBadge}
                departmentType={order.assignedDept}
              />
              
              {canViewFinancialDetails && (
                <OrderPayment 
                  paymentStatus={order.paymentStatus}
                  orderId={order.id}
                  orderAmount={order.orderAmount}
                  onUpdatePaymentStatus={onUpdatePaymentStatus}
                  canUpdatePayment={true}
                  updating={updatingStatus}
                />
              )}
            </div>
          </div>
        </TabsContent>
        
        {/* Products Tab */}
        <TabsContent value="products">
          <div className="bg-white rounded-md shadow-sm border p-6">
            <OrderProducts 
              products={order.products} 
              showPricing={canViewFinancialDetails} 
            />
          </div>
        </TabsContent>
        
        {/* Workflow Tab */}
        <TabsContent value="workflow">
          <div className="bg-white rounded-md shadow-sm border p-6">
            <OrderProductsWorkflow 
              products={order.products} 
              orderId={order.id} 
              department={order.assignedDept}
              status={order.status}
              userRole={userRole}
              assignedBy={order.assignedByName || order.createdByName}
            />
          </div>
        </TabsContent>
        
        {/* Timeline Tab */}
        <TabsContent value="timeline">
          <OrderTimeline 
            timeline={timelineEvents}
            formatStatus={formatStatus} 
          />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default OrderDetailTabs;
