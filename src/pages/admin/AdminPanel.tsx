
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Settings2, 
  ShieldAlert, 
  LayoutDashboard, 
  Workflow, 
  Database,
  Switch,
  Save
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Switch as SwitchComponent } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

// Mock data for demonstration
const userPermissions = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "admin", department: "Admin" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "sales", department: "Sales" },
  { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "design", department: "Design" },
  { id: 4, name: "Sarah Williams", email: "sarah@example.com", role: "prepress", department: "Prepress" },
  { id: 5, name: "David Brown", email: "david@example.com", role: "production", department: "Production" },
];

// Dashboard components settings
const componentSettings = [
  { id: "recent_orders", name: "Recent Orders", enabled: true, section: "dashboard" },
  { id: "revenue_chart", name: "Revenue Chart", enabled: true, section: "dashboard" },
  { id: "status_chart", name: "Status Chart", enabled: true, section: "dashboard" },
  { id: "stats_cards", name: "Statistics Cards", enabled: true, section: "dashboard" },
  { id: "admin_quick_actions", name: "Admin Quick Actions", enabled: true, section: "dashboard" },
  { id: "order_history", name: "Order History", enabled: true, section: "orders" },
  { id: "order_filters", name: "Order Filters", enabled: true, section: "orders" },
  { id: "bulk_actions", name: "Bulk Order Actions", enabled: true, section: "admin" },
];

// Workflow settings
const workflowSettings = [
  { id: "design_approval_required", name: "Design Approval Required", enabled: true },
  { id: "prepress_approval_required", name: "Prepress Approval Required", enabled: true },
  { id: "payment_before_dispatch", name: "Payment Required Before Dispatch", enabled: true },
  { id: "auto_department_assignment", name: "Auto Department Assignment", enabled: false },
  { id: "allow_production_split", name: "Allow Production Splitting", enabled: true },
  { id: "notify_department_on_assignment", name: "Notify Department on Assignment", enabled: true },
];

const AdminPanel = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("users");
  const [compSettings, setCompSettings] = useState(componentSettings);
  const [workflowSets, setWorkflowSets] = useState(workflowSettings);
  
  // Update component settings
  const handleComponentToggle = (id: string) => {
    setCompSettings(prev => prev.map(item => 
      item.id === id ? { ...item, enabled: !item.enabled } : item
    ));
  };
  
  // Update workflow settings
  const handleWorkflowToggle = (id: string) => {
    setWorkflowSets(prev => prev.map(item => 
      item.id === id ? { ...item, enabled: !item.enabled } : item
    ));
  };
  
  // Save settings
  const saveSettings = (type: string) => {
    // In a real app, this would save to Firebase
    toast({
      title: "Settings Saved",
      description: `${type} settings have been updated successfully.`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
        <p className="text-muted-foreground">
          Advanced system settings and user management
        </p>
      </div>

      <Tabs defaultValue="users" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="users">
            <Users className="mr-2 h-4 w-4" />
            <span>User Permissions</span>
          </TabsTrigger>
          <TabsTrigger value="dashboard">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard Components</span>
          </TabsTrigger>
          <TabsTrigger value="workflow">
            <Workflow className="mr-2 h-4 w-4" />
            <span>Workflow Settings</span>
          </TabsTrigger>
          <TabsTrigger value="system">
            <Settings2 className="mr-2 h-4 w-4" />
            <span>System Settings</span>
          </TabsTrigger>
        </TabsList>
        
        {/* User Permissions Tab */}
        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShieldAlert className="mr-2 h-5 w-5" />
                User Permissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userPermissions.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.department}</TableCell>
                        <TableCell>
                          <span className="capitalize">{user.role}</span>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Edit</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 flex justify-end">
                <Button onClick={() => saveSettings("User permission")}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Dashboard Components Tab */}
        <TabsContent value="dashboard" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LayoutDashboard className="mr-2 h-5 w-5" />
                Dashboard Components
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Dashboard Components</h3>
                  <div className="grid gap-4">
                    {compSettings
                      .filter(item => item.section === "dashboard")
                      .map((component) => (
                        <div key={component.id} className="flex items-center justify-between">
                          <Label htmlFor={component.id}>{component.name}</Label>
                          <SwitchComponent 
                            id={component.id}
                            checked={component.enabled}
                            onCheckedChange={() => handleComponentToggle(component.id)}
                          />
                        </div>
                      ))
                    }
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Orders Page Components</h3>
                  <div className="grid gap-4">
                    {compSettings
                      .filter(item => item.section === "orders")
                      .map((component) => (
                        <div key={component.id} className="flex items-center justify-between">
                          <Label htmlFor={component.id}>{component.name}</Label>
                          <SwitchComponent 
                            id={component.id}
                            checked={component.enabled}
                            onCheckedChange={() => handleComponentToggle(component.id)}
                          />
                        </div>
                      ))
                    }
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Admin Components</h3>
                  <div className="grid gap-4">
                    {compSettings
                      .filter(item => item.section === "admin")
                      .map((component) => (
                        <div key={component.id} className="flex items-center justify-between">
                          <Label htmlFor={component.id}>{component.name}</Label>
                          <SwitchComponent 
                            id={component.id}
                            checked={component.enabled}
                            onCheckedChange={() => handleComponentToggle(component.id)}
                          />
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button onClick={() => saveSettings("Component")}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Workflow Settings Tab */}
        <TabsContent value="workflow" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Workflow className="mr-2 h-5 w-5" />
                Order Workflow Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {workflowSets.map((setting) => (
                  <div key={setting.id} className="flex items-center justify-between">
                    <div>
                      <Label htmlFor={setting.id} className="text-base">{setting.name}</Label>
                      <p className="text-sm text-muted-foreground">
                        {setting.id === "design_approval_required" && "Design files must be approved by admin/sales before moving to prepress"}
                        {setting.id === "prepress_approval_required" && "Prepress work must be approved before moving to production"}
                        {setting.id === "payment_before_dispatch" && "Orders cannot be dispatched until payment is marked as completed"}
                        {setting.id === "auto_department_assignment" && "Automatically assign orders to next department when status updates"}
                        {setting.id === "allow_production_split" && "Allow production to handle different products separately"}
                        {setting.id === "notify_department_on_assignment" && "Send notifications when orders are assigned to departments"}
                      </p>
                    </div>
                    <SwitchComponent 
                      id={setting.id}
                      checked={setting.enabled}
                      onCheckedChange={() => handleWorkflowToggle(setting.id)}
                    />
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button onClick={() => saveSettings("Workflow")}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* System Settings Tab */}
        <TabsContent value="system" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2 h-5 w-5" />
                System Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div>
                  <Label htmlFor="company_name">Company Name</Label>
                  <Input id="company_name" defaultValue="PrintFlow" className="mt-1" />
                </div>
                
                <div>
                  <Label htmlFor="company_address">Company Address</Label>
                  <Input id="company_address" defaultValue="123 Print Street, Design City" className="mt-1" />
                </div>
                
                <div>
                  <Label htmlFor="gst_number">GST Number</Label>
                  <Input id="gst_number" defaultValue="22AAAAA0000A1Z5" className="mt-1" />
                </div>
                
                <div>
                  <Label htmlFor="payment_terms">Default Payment Terms</Label>
                  <Input id="payment_terms" defaultValue="50% advance, 50% before dispatch" className="mt-1" />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="enable_dark_mode">Enable Dark Mode by Default</Label>
                  <SwitchComponent id="enable_dark_mode" />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="enable_notifications">Enable Email Notifications</Label>
                  <SwitchComponent id="enable_notifications" defaultChecked />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button onClick={() => saveSettings("System")}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
