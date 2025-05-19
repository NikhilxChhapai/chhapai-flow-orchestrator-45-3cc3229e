
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { DepartmentType } from "@/lib/firebase/types";
import { Building2, Save, Plus, Trash, Check, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type Department = {
  id: string;
  name: string;
  active: boolean;
  components: string[];
};

const initialDepartments: Department[] = [
  { id: "sales", name: "Sales", active: true, components: ["dashboard", "orders", "clients", "invoices", "payments"] },
  { id: "design", name: "Design", active: true, components: ["dashboard", "orders", "design-requests", "design-library"] },
  { id: "prepress", name: "Prepress", active: true, components: ["dashboard", "orders", "files", "preflight"] },
  { id: "production", name: "Production", active: true, components: ["dashboard", "orders", "schedule", "machine-maintenance"] },
  { id: "admin", name: "Admin", active: true, components: ["dashboard", "orders", "settings", "users", "departments"] }
];

const allComponents = [
  { id: "dashboard", name: "Dashboard", description: "Main dashboard view" },
  { id: "orders", name: "Orders", description: "Order management" },
  { id: "clients", name: "Clients", description: "Client management" },
  { id: "invoices", name: "Invoices", description: "Invoice management" },
  { id: "payments", name: "Payments", description: "Payment tracking" },
  { id: "design-requests", name: "Design Requests", description: "Incoming design requests" },
  { id: "design-library", name: "Design Library", description: "Design assets library" },
  { id: "files", name: "Files", description: "File management" },
  { id: "preflight", name: "Preflight", description: "Preflight checks" },
  { id: "schedule", name: "Schedule", description: "Production schedule" },
  { id: "machine-maintenance", name: "Machine Maintenance", description: "Equipment maintenance" },
  { id: "settings", name: "Settings", description: "System settings" },
  { id: "users", name: "Users", description: "User management" },
  { id: "departments", name: "Departments", description: "Department management" },
  { id: "financial", name: "Financial", description: "Financial reports and information" },
  { id: "analytics", name: "Analytics", description: "System analytics" }
];

const DepartmentControl = () => {
  const { toast } = useToast();
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [newDept, setNewDept] = useState({ name: "", id: "" });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDept, setEditDept] = useState<Department | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleToggleActive = (deptId: string) => {
    setDepartments(
      departments.map(dept => 
        dept.id === deptId ? { ...dept, active: !dept.active } : dept
      )
    );
  };

  const handleToggleComponent = (deptId: string, componentId: string) => {
    setDepartments(
      departments.map(dept => {
        if (dept.id === deptId) {
          const components = [...dept.components];
          if (components.includes(componentId)) {
            return { ...dept, components: components.filter(id => id !== componentId) };
          } else {
            return { ...dept, components: [...components, componentId] };
          }
        }
        return dept;
      })
    );
  };

  const handleSaveDepartments = () => {
    // In a real app, this would save to the database
    toast({
      title: "Departments Saved",
      description: "Department settings have been updated successfully.",
    });
  };

  const handleAddDepartment = () => {
    if (!newDept.name || !newDept.id) {
      toast({
        title: "Validation Error",
        description: "Department name and ID are required.",
        variant: "destructive"
      });
      return;
    }

    // Check for duplicate ID
    if (departments.some(dept => dept.id === newDept.id)) {
      toast({
        title: "Validation Error",
        description: "Department ID already exists.",
        variant: "destructive"
      });
      return;
    }

    // Add new department
    setDepartments([
      ...departments, 
      { 
        id: newDept.id, 
        name: newDept.name, 
        active: true, 
        components: ["dashboard", "orders"]
      }
    ]);

    // Reset form and close dialog
    setNewDept({ name: "", id: "" });
    setDialogOpen(false);

    toast({
      title: "Department Added",
      description: `New department "${newDept.name}" has been added.`
    });
  };

  const handleDeleteDepartment = (deptId: string) => {
    // Prevent deleting built-in departments
    if (["sales", "design", "prepress", "production", "admin"].includes(deptId)) {
      toast({
        title: "Cannot Delete",
        description: "Built-in departments cannot be deleted.",
        variant: "destructive"
      });
      return;
    }

    setDepartments(departments.filter(dept => dept.id !== deptId));
    
    toast({
      title: "Department Deleted",
      description: "Department has been removed successfully."
    });
  };

  const handleEditDepartment = (dept: Department) => {
    setEditDept(dept);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editDept) return;
    
    setDepartments(
      departments.map(dept => 
        dept.id === editDept.id ? editDept : dept
      )
    );

    setEditDialogOpen(false);
    setEditDept(null);

    toast({
      title: "Department Updated",
      description: "Department has been updated successfully."
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="flex items-center">
              <Building2 className="mr-2 h-5 w-5" />
              Department Management
            </CardTitle>
            <CardDescription>
              Configure departments and their component access
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Department
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Department</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="dept-name">Department Name</Label>
                    <Input 
                      id="dept-name" 
                      value={newDept.name}
                      onChange={(e) => setNewDept({...newDept, name: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="dept-id">Department ID</Label>
                    <Input 
                      id="dept-id" 
                      value={newDept.id}
                      onChange={(e) => setNewDept({...newDept, id: e.target.value})}
                      placeholder="e.g. accounts, logistics"
                    />
                    <p className="text-xs text-muted-foreground">
                      Use lowercase letters, no spaces or special characters
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddDepartment}>Add Department</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Button variant="outline" onClick={handleSaveDepartments}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[200px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map((dept) => (
                <TableRow key={dept.id}>
                  <TableCell className="font-medium">{dept.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={dept.active} 
                        onCheckedChange={() => handleToggleActive(dept.id)} 
                      />
                      <span>{dept.active ? "Active" : "Inactive"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditDepartment(dept)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={`${["sales", "design", "prepress", "production", "admin"].includes(dept.id) ? "text-gray-400" : "text-red-500 hover:bg-red-50"}`}
                        onClick={() => handleDeleteDepartment(dept.id)}
                        disabled={["sales", "design", "prepress", "production", "admin"].includes(dept.id)}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Department Component Access</CardTitle>
          <CardDescription>
            Configure which components each department can access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Component</TableHead>
                  {departments.filter(d => d.active).map((dept) => (
                    <TableHead key={dept.id}>{dept.name}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {allComponents.map((component) => (
                  <TableRow key={component.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{component.name}</div>
                        <div className="text-sm text-muted-foreground">{component.description}</div>
                      </div>
                    </TableCell>
                    {departments.filter(d => d.active).map((dept) => (
                      <TableCell key={`${dept.id}-${component.id}`}>
                        <Switch 
                          checked={dept.components.includes(component.id)}
                          onCheckedChange={() => handleToggleComponent(dept.id, component.id)}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleSaveDepartments}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </CardFooter>
      </Card>

      {/* Edit Department Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
          </DialogHeader>
          {editDept && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="edit-dept-name">Department Name</Label>
                <Input 
                  id="edit-dept-name" 
                  value={editDept.name}
                  onChange={(e) => setEditDept({...editDept, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="edit-dept-id">Department ID</Label>
                <Input 
                  id="edit-dept-id" 
                  value={editDept.id}
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  Department ID cannot be changed
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>
              <Check className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DepartmentControl;
