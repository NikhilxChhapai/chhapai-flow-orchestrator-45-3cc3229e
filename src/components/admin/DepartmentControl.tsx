
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, setDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { Loader2, Edit, Trash, Plus } from "lucide-react";

// Sample departments data - in real app, this would come from Firestore
const INITIAL_DEPARTMENTS = [
  { id: "design", name: "Design", enabled: true, role: "designer", userCount: 5 },
  { id: "prepress", name: "Prepress", enabled: true, role: "prepress", userCount: 3 },
  { id: "production", name: "Production", enabled: true, role: "production", userCount: 8 },
  { id: "dispatch", name: "Dispatch", enabled: true, role: "dispatch", userCount: 4 },
  { id: "sales", name: "Sales", enabled: true, role: "sales", userCount: 6 },
];

const DepartmentControl = () => {
  const { toast } = useToast();
  const [departments, setDepartments] = useState(INITIAL_DEPARTMENTS);
  const [loading, setLoading] = useState(false);
  const [newDepartment, setNewDepartment] = useState({ name: "", role: "" });
  const [editingDepartment, setEditingDepartment] = useState<any>(null);
  
  // In a real app, you would load departments from Firestore
  // useEffect(() => {
  //   const fetchDepartments = async () => {
  //     setLoading(true);
  //     try {
  //       const depsRef = collection(db, "departments");
  //       const snapshot = await getDocs(depsRef);
  //       const depsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  //       setDepartments(depsData);
  //     } catch (error) {
  //       console.error("Error fetching departments:", error);
  //       toast({
  //         title: "Error",
  //         description: "Failed to load departments",
  //         variant: "destructive",
  //       });
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   
  //   fetchDepartments();
  // }, [toast]);
  
  const handleToggleDepartment = (id: string, enabled: boolean) => {
    setDepartments(departments.map(dept => 
      dept.id === id ? { ...dept, enabled } : dept
    ));
    
    // In a real app, update in Firestore
    toast({
      title: `Department ${enabled ? "Enabled" : "Disabled"}`,
      description: `Department has been ${enabled ? "enabled" : "disabled"} successfully`,
    });
  };
  
  const handleAddDepartment = () => {
    if (!newDepartment.name || !newDepartment.role) {
      toast({
        title: "Validation Error",
        description: "Department name and role are required",
        variant: "destructive",
      });
      return;
    }
    
    const id = newDepartment.name.toLowerCase().replace(/\s+/g, '-');
    
    setDepartments([
      ...departments,
      {
        id,
        name: newDepartment.name,
        role: newDepartment.role,
        enabled: true,
        userCount: 0
      }
    ]);
    
    setNewDepartment({ name: "", role: "" });
    
    // In a real app, add to Firestore
    toast({
      title: "Department Added",
      description: `${newDepartment.name} department has been added successfully`,
    });
  };
  
  const handleUpdateDepartment = () => {
    if (!editingDepartment || !editingDepartment.name || !editingDepartment.role) {
      return;
    }
    
    setDepartments(departments.map(dept => 
      dept.id === editingDepartment.id ? { ...editingDepartment } : dept
    ));
    
    setEditingDepartment(null);
    
    // In a real app, update in Firestore
    toast({
      title: "Department Updated",
      description: `Department has been updated successfully`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Department Management</CardTitle>
              <CardDescription>Enable/disable departments and control access</CardDescription>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-1">
                  <Plus className="h-4 w-4" />
                  <span>Add Department</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Department</DialogTitle>
                  <DialogDescription>
                    Create a new department for your organization
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="dept-name">Department Name</Label>
                    <Input 
                      id="dept-name" 
                      value={newDepartment.name}
                      onChange={(e) => setNewDepartment({...newDepartment, name: e.target.value})}
                      placeholder="e.g. Accounting"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dept-role">Role Identifier</Label>
                    <Input 
                      id="dept-role" 
                      value={newDepartment.role}
                      onChange={(e) => setNewDepartment({...newDepartment, role: e.target.value})}
                      placeholder="e.g. accounting"
                    />
                    <p className="text-xs text-muted-foreground">
                      This will be used for permission control
                    </p>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button onClick={handleAddDepartment}>Add Department</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments.map((dept) => (
                    <TableRow key={dept.id}>
                      <TableCell className="font-medium">{dept.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch 
                            checked={dept.enabled}
                            onCheckedChange={(checked) => handleToggleDepartment(dept.id, checked)}
                          />
                          <span className={dept.enabled ? "text-green-500" : "text-muted-foreground"}>
                            {dept.enabled ? "Enabled" : "Disabled"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{dept.role}</TableCell>
                      <TableCell>{dept.userCount}</TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setEditingDepartment(dept)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Department</DialogTitle>
                              <DialogDescription>
                                Update department details
                              </DialogDescription>
                            </DialogHeader>
                            
                            {editingDepartment && (
                              <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-dept-name">Department Name</Label>
                                  <Input 
                                    id="edit-dept-name" 
                                    value={editingDepartment.name}
                                    onChange={(e) => setEditingDepartment({...editingDepartment, name: e.target.value})}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-dept-role">Role Identifier</Label>
                                  <Input 
                                    id="edit-dept-role" 
                                    value={editingDepartment.role}
                                    onChange={(e) => setEditingDepartment({...editingDepartment, role: e.target.value})}
                                  />
                                </div>
                              </div>
                            )}
                            
                            <DialogFooter>
                              <Button onClick={handleUpdateDepartment}>Update Department</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        
                        <Button variant="ghost" size="icon">
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DepartmentControl;
