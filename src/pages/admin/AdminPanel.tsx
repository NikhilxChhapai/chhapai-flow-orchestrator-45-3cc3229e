
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  Save,
  Edit,
  Building2,
  Plus,
  Trash,
  CheckCircle
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
import DepartmentControl from "@/components/admin/DepartmentControl";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DepartmentType } from "@/lib/firebase/types";

// Enhanced mock data for demonstration
const userPermissions = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "admin", department: "Admin", permissions: ["create_orders", "edit_orders", "view_all_orders", "approve_designs"] },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "sales", department: "Sales", permissions: ["create_orders", "edit_orders", "view_department_orders", "approve_designs"] },
  { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "design", department: "Design", permissions: ["view_department_orders", "update_design_status"] },
  { id: 4, name: "Sarah Williams", email: "sarah@example.com", role: "prepress", department: "Prepress", permissions: ["view_department_orders", "update_prepress_status"] },
  { id: 5, name: "David Brown", email: "david@example.com", role: "production", department: "Production", permissions: ["view_department_orders", "update_production_status"] },
];

// Dashboard components settings with department assignment
const componentSettings = [
  { id: "recent_orders", name: "Recent Orders", enabled: true, section: "dashboard", departments: ["admin", "sales"] },
  { id: "revenue_chart", name: "Revenue Chart", enabled: true, section: "dashboard", departments: ["admin", "sales"] },
  { id: "status_chart", name: "Status Chart", enabled: true, section: "dashboard", departments: ["admin", "sales", "design", "prepress", "production"] },
  { id: "stats_cards", name: "Statistics Cards", enabled: true, section: "dashboard", departments: ["admin", "sales", "design", "prepress", "production"] },
  { id: "admin_quick_actions", name: "Admin Quick Actions", enabled: true, section: "dashboard", departments: ["admin"] },
  { id: "design_queue", name: "Design Queue", enabled: true, section: "dashboard", departments: ["design", "admin"] },
  { id: "prepress_queue", name: "Prepress Queue", enabled: true, section: "dashboard", departments: ["prepress", "admin"] },
  { id: "production_queue", name: "Production Queue", enabled: true, section: "dashboard", departments: ["production", "admin"] },
  { id: "order_history", name: "Order History", enabled: true, section: "orders", departments: ["admin", "sales"] },
  { id: "order_filters", name: "Order Filters", enabled: true, section: "orders", departments: ["admin", "sales", "design", "prepress", "production"] },
  { id: "bulk_actions", name: "Bulk Order Actions", enabled: true, section: "admin", departments: ["admin"] },
];

// Available permissions list
const availablePermissions = [
  { id: "create_orders", name: "Create Orders", description: "Can create new orders" },
  { id: "edit_orders", name: "Edit Orders", description: "Can edit existing orders" },
  { id: "view_all_orders", name: "View All Orders", description: "Can view all orders across departments" },
  { id: "view_department_orders", name: "View Department Orders", description: "Can view orders assigned to their department" },
  { id: "approve_designs", name: "Approve Designs", description: "Can approve design work" },
  { id: "approve_prepress", name: "Approve Prepress", description: "Can approve prepress work" },
  { id: "mark_completed", name: "Mark Orders Completed", description: "Can mark orders as completed" },
  { id: "update_design_status", name: "Update Design Status", description: "Can update design status" },
  { id: "update_prepress_status", name: "Update Prepress Status", description: "Can update prepress status" },
  { id: "update_production_status", name: "Update Production Status", description: "Can update production status" },
  { id: "assign_departments", name: "Assign Departments", description: "Can assign orders to departments" }
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
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);
  const [newUserDialogOpen, setNewUserDialogOpen] = useState(false);
  const [users, setUsers] = useState(userPermissions);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
    permissions: [] as string[]
  });
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
    permissions: [] as string[]
  });
  
  // Update component settings
  const handleComponentToggle = (id: string) => {
    setCompSettings(prev => prev.map(item => 
      item.id === id ? { ...item, enabled: !item.enabled } : item
    ));
  };
  
  // Update department visibility for component
  const handleDepartmentToggle = (componentId: string, department: string) => {
    setCompSettings(prev => prev.map(item => {
      if (item.id === componentId) {
        const departments = [...(item.departments || [])];
        if (departments.includes(department)) {
          return { 
            ...item, 
            departments: departments.filter(d => d !== department) 
          };
        } else {
          return { 
            ...item, 
            departments: [...departments, department] 
          };
        }
      }
      return item;
    }));
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

  // Toggle permission for a user
  const togglePermission = (permission: string) => {
    if (!userForm.permissions) {
      setUserForm({ ...userForm, permissions: [permission] });
      return;
    }
    
    if (userForm.permissions.includes(permission)) {
      setUserForm({
        ...userForm,
        permissions: userForm.permissions.filter(p => p !== permission)
      });
    } else {
      setUserForm({
        ...userForm,
        permissions: [...userForm.permissions, permission]
      });
    }
  };
  
  // Toggle permission for new user
  const toggleNewUserPermission = (permission: string) => {
    if (newUser.permissions.includes(permission)) {
      setNewUser({
        ...newUser,
        permissions: newUser.permissions.filter(p => p !== permission)
      });
    } else {
      setNewUser({
        ...newUser,
        permissions: [...newUser.permissions, permission]
      });
    }
  };

  // Handle edit user
  const handleEditUser = (user: any) => {
    setCurrentUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      permissions: user.permissions || []
    });
    setEditUserDialogOpen(true);
  };

  // Update user
  const saveUserChanges = () => {
    setUsers(users.map(u => 
      u.id === currentUser.id 
        ? { 
            ...u, 
            name: userForm.name,
            email: userForm.email,
            role: userForm.role as string,
            department: userForm.department,
            permissions: userForm.permissions 
          } 
        : u
    ));
    
    toast({
      title: "User Updated",
      description: `User ${userForm.name} has been updated successfully.`,
    });
    setEditUserDialogOpen(false);
  };
  
  // Add new user
  const handleAddUser = () => {
    // Basic validation
    if (!newUser.name || !newUser.email || !newUser.role || !newUser.department) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }
    
    const newId = users.length + 1;
    
    setUsers([
      ...users,
      {
        id: newId,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department,
        permissions: newUser.permissions
      }
    ]);
    
    toast({
      title: "User Added",
      description: `User ${newUser.name} has been added successfully.`,
    });
    
    // Reset form
    setNewUser({
      name: "",
      email: "",
      role: "",
      department: "",
      permissions: []
    });
    
    setNewUserDialogOpen(false);
  };
  
  // Delete user
  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter(user => user.id !== userId));
    
    toast({
      title: "User Deleted",
      description: "User has been deleted successfully.",
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
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="users">
            <Users className="mr-2 h-4 w-4" />
            <span>User Permissions</span>
          </TabsTrigger>
          <TabsTrigger value="departments">
            <Building2 className="mr-2 h-4 w-4" />
            <span>Departments</span>
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
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <ShieldAlert className="mr-2 h-5 w-5" />
                  User Permissions
                </div>
                <Button onClick={() => setNewUserDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </CardTitle>
              <CardDescription>
                Manage user accounts and their permissions across the system
              </CardDescription>
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
                      <TableHead>Permissions</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.department}</TableCell>
                        <TableCell>
                          <span className="capitalize">{user.role}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {user.permissions && user.permissions.length > 0 ? (
                              user.permissions.slice(0, 2).map(perm => (
                                <Badge key={perm} variant="outline" className="text-xs">
                                  {perm.replace('_', ' ')}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-muted-foreground text-xs">No permissions</span>
                            )}
                            {user.permissions && user.permissions.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{user.permissions.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-500 hover:bg-red-50"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Departments Tab */}
        <TabsContent value="departments" className="mt-6">
          <DepartmentControl />
        </TabsContent>
        
        {/* Dashboard Components Tab */}
        <TabsContent value="dashboard" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LayoutDashboard className="mr-2 h-5 w-5" />
                Dashboard Components by Department
              </CardTitle>
              <CardDescription>
                Configure which components appear on the dashboard for each department
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Component</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Admin</TableHead>
                        <TableHead>Sales</TableHead>
                        <TableHead>Design</TableHead>
                        <TableHead>Prepress</TableHead>
                        <TableHead>Production</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {compSettings
                        .filter(item => item.section === "dashboard")
                        .map((component) => (
                          <TableRow key={component.id}>
                            <TableCell className="font-medium">{component.name}</TableCell>
                            <TableCell>
                              <SwitchComponent 
                                id={`${component.id}-enabled`}
                                checked={component.enabled}
                                onCheckedChange={() => handleComponentToggle(component.id)}
                              />
                            </TableCell>
                            <TableCell>
                              <SwitchComponent 
                                id={`${component.id}-admin`}
                                checked={component.departments?.includes("admin") || false}
                                onCheckedChange={() => handleDepartmentToggle(component.id, "admin")}
                              />
                            </TableCell>
                            <TableCell>
                              <SwitchComponent 
                                id={`${component.id}-sales`}
                                checked={component.departments?.includes("sales") || false}
                                onCheckedChange={() => handleDepartmentToggle(component.id, "sales")}
                              />
                            </TableCell>
                            <TableCell>
                              <SwitchComponent 
                                id={`${component.id}-design`}
                                checked={component.departments?.includes("design") || false}
                                onCheckedChange={() => handleDepartmentToggle(component.id, "design")}
                              />
                            </TableCell>
                            <TableCell>
                              <SwitchComponent 
                                id={`${component.id}-prepress`}
                                checked={component.departments?.includes("prepress") || false}
                                onCheckedChange={() => handleDepartmentToggle(component.id, "prepress")}
                              />
                            </TableCell>
                            <TableCell>
                              <SwitchComponent 
                                id={`${component.id}-production`}
                                checked={component.departments?.includes("production") || false}
                                onCheckedChange={() => handleDepartmentToggle(component.id, "production")}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
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

      {/* Edit User Dialog */}
      <Dialog open={editUserDialogOpen} onOpenChange={setEditUserDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit User Permissions</DialogTitle>
            <DialogDescription>
              Update user roles, department assignments and permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  value={userForm.name} 
                  onChange={(e) => setUserForm({...userForm, name: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  value={userForm.email} 
                  onChange={(e) => setUserForm({...userForm, email: e.target.value})} 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select 
                  value={userForm.role} 
                  onValueChange={(value) => setUserForm({...userForm, role: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="prepress">Prepress</SelectItem>
                    <SelectItem value="production">Production</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select 
                  value={userForm.department} 
                  onValueChange={(value) => setUserForm({...userForm, department: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Prepress">Prepress</SelectItem>
                    <SelectItem value="Production">Production</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label className="text-base">Permissions</Label>
              <p className="text-sm text-muted-foreground">Select which actions this user can perform</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {availablePermissions.map(permission => (
                  <div key={permission.id} className="flex items-center space-x-2">
                    <SwitchComponent 
                      id={`perm-${permission.id}`} 
                      checked={userForm.permissions?.includes(permission.id)}
                      onCheckedChange={() => togglePermission(permission.id)}
                    />
                    <div>
                      <Label htmlFor={`perm-${permission.id}`} className="text-sm font-medium">
                        {permission.name}
                      </Label>
                      <p className="text-xs text-muted-foreground">{permission.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUserDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveUserChanges}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add New User Dialog */}
      <Dialog open={newUserDialogOpen} onOpenChange={setNewUserDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account and set their permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-name">Name</Label>
                <Input 
                  id="new-name" 
                  value={newUser.name} 
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-email">Email</Label>
                <Input 
                  id="new-email" 
                  value={newUser.email} 
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})} 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-role">Role</Label>
                <Select 
                  value={newUser.role} 
                  onValueChange={(value) => setNewUser({...newUser, role: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="prepress">Prepress</SelectItem>
                    <SelectItem value="production">Production</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-department">Department</Label>
                <Select 
                  value={newUser.department} 
                  onValueChange={(value) => setNewUser({...newUser, department: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Prepress">Prepress</SelectItem>
                    <SelectItem value="Production">Production</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label className="text-base">Permissions</Label>
              <p className="text-sm text-muted-foreground">Select which actions this user can perform</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {availablePermissions.map(permission => (
                  <div key={permission.id} className="flex items-center space-x-2">
                    <SwitchComponent 
                      id={`new-perm-${permission.id}`} 
                      checked={newUser.permissions?.includes(permission.id)}
                      onCheckedChange={() => toggleNewUserPermission(permission.id)}
                    />
                    <div>
                      <Label htmlFor={`new-perm-${permission.id}`} className="text-sm font-medium">
                        {permission.name}
                      </Label>
                      <p className="text-xs text-muted-foreground">{permission.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewUserDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddUser}>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPanel;
