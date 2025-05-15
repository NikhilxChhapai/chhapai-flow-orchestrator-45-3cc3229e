
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import BulkOrderOperations from "@/components/admin/BulkOrderOperations";
import DepartmentControl from "@/components/admin/DepartmentControl";
import AdminSettings from "@/components/admin/AdminSettings";
import AdminMetrics from "@/components/admin/AdminMetrics";

const AdminDashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Control Panel</h1>
        <p className="text-muted-foreground">
          Manage your organization, departments, and system settings
        </p>
      </div>

      <Tabs defaultValue="overview" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="orders">Order Management</TabsTrigger>
          <TabsTrigger value="settings">System Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <AdminMetrics />
        </TabsContent>
        
        <TabsContent value="departments" className="mt-6">
          <DepartmentControl />
        </TabsContent>
        
        <TabsContent value="orders" className="mt-6">
          <BulkOrderOperations />
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6">
          <AdminSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
