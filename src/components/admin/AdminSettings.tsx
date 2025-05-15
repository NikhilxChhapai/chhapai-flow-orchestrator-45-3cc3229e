
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    statusChangeNotifications: true,
    automaticBackups: true,
    darkModeDefault: false,
    maintenanceMode: false,
    companyName: "PrintFlow Ltd",
    supportEmail: "support@printflow.com",
    orderPrefix: "ORD",
    defaultCurrency: "INR",
    dateFormat: "yyyy-MM-dd",
  });
  
  const [isSaving, setIsSaving] = useState(false);
  
  const handleToggleSetting = (setting: keyof typeof settings, value: boolean) => {
    setSettings({
      ...settings,
      [setting]: value,
    });
  };
  
  const handleInputChange = (setting: keyof typeof settings, value: string) => {
    setSettings({
      ...settings,
      [setting]: value,
    });
  };
  
  const handleSaveSettings = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Settings Saved",
        description: "Your system settings have been updated.",
      });
    }, 1000);
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure basic system settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input 
                    id="company-name"
                    value={settings.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support-email">Support Email</Label>
                  <Input 
                    id="support-email"
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => handleInputChange('supportEmail', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order-prefix">Order Number Prefix</Label>
                  <Input 
                    id="order-prefix"
                    value={settings.orderPrefix}
                    onChange={(e) => handleInputChange('orderPrefix', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Default Currency</Label>
                  <Input 
                    id="currency"
                    value={settings.defaultCurrency}
                    onChange={(e) => handleInputChange('defaultCurrency', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date-format">Date Format</Label>
                  <Input 
                    id="date-format"
                    value={settings.dateFormat}
                    onChange={(e) => handleInputChange('dateFormat', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2 pt-4">
                <Switch 
                  id="dark-mode"
                  checked={settings.darkModeDefault}
                  onCheckedChange={(checked) => handleToggleSetting('darkModeDefault', checked)}
                />
                <Label htmlFor="dark-mode">Use dark mode by default</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure system notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="email-notifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleToggleSetting('emailNotifications', checked)}
                />
                <Label htmlFor="email-notifications">Send email notifications</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="status-notifications"
                  checked={settings.statusChangeNotifications}
                  onCheckedChange={(checked) => handleToggleSetting('statusChangeNotifications', checked)}
                />
                <Label htmlFor="status-notifications">Notify on order status changes</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure system security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="auto-backups"
                  checked={settings.automaticBackups}
                  onCheckedChange={(checked) => handleToggleSetting('automaticBackups', checked)}
                />
                <Label htmlFor="auto-backups">Enable automatic data backups</Label>
              </div>
              
              <div className="space-y-2 pt-4">
                <Label htmlFor="password-policy">Password Policy</Label>
                <select 
                  id="password-policy"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="standard">Standard (8+ chars)</option>
                  <option value="strong">Strong (12+ chars, special)</option>
                  <option value="very-strong">Very Strong (14+ chars, special, numbers)</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="advanced" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>
                System maintenance and advanced options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="maintenance-mode"
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => handleToggleSetting('maintenanceMode', checked)}
                />
                <div>
                  <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    When enabled, only administrators can access the system
                  </p>
                </div>
              </div>
              
              <div className="pt-4 space-y-3">
                <Button variant="outline">Clear Cache</Button>
                <Button variant="outline">Run Database Optimization</Button>
                <Button variant="outline">Export System Logs</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;
