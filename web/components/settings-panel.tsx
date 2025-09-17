"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  DollarSign,
  Shield,
  Bell,
  Settings,
  Globe,
  Save,
  Plus,
  Trash2,
  Edit,
  Eye,
  Palette,
} from "lucide-react"

interface SettingsPanelProps {
  onBack: () => void
}

const userRoles = [
  {
    id: 1,
    name: "Owner/Admin",
    description: "Full access to all features and settings",
    permissions: ["All permissions", "User management", "Billing", "Settings"],
    color: "bg-slate-100 text-slate-700 border-slate-200",
    users: 1,
  },
  {
    id: 2,
    name: "Manager",
    description: "Manage projects and team members",
    permissions: ["Project management", "Team oversight", "File access", "Reports"],
    color: "bg-gray-100 text-gray-700 border-gray-200",
    users: 2,
  },
  {
    id: 3,
    name: "Designer",
    description: "Work on assigned projects and upload files",
    permissions: ["Project access", "File upload", "Comments", "Time tracking"],
    color: "bg-blue-50 text-blue-700 border-blue-200",
    users: 8,
  },
  {
    id: 4,
    name: "Client",
    description: "View project progress and provide feedback",
    permissions: ["Project viewing", "Comments", "File download", "Progress tracking"],
    color: "bg-green-50 text-green-700 border-green-200",
    users: 15,
  },
]

export function SettingsPanel({ onBack }: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState("pricing")
  const [archicadPrice, setArchicadPrice] = useState("2")
  const [sketchupPrice, setSketchupPrice] = useState("8")
  const [lumionPrice, setLumionPrice] = useState("5")
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    projectUpdates: true,
    teamActivity: true,
    billing: true,
  })

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack} className="gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <div className="h-6 w-px bg-gray-200" />
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-gray-600" />
              <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-gray-600 border-gray-200 hover:bg-gray-50 bg-transparent"
            >
              <Eye className="h-4 w-4" />
              Preview Changes
            </Button>
            <Button size="sm" className="gap-2 bg-slate-900 hover:bg-slate-800 text-white">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </header>

      <main className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6 bg-gray-100">
            <TabsTrigger value="pricing" className="data-[state=active]:bg-white data-[state=active]:text-gray-900">
              Pricing
            </TabsTrigger>
            <TabsTrigger value="roles" className="data-[state=active]:bg-white data-[state=active]:text-gray-900">
              Team Roles
            </TabsTrigger>
            <TabsTrigger value="permissions" className="data-[state=active]:bg-white data-[state=active]:text-gray-900">
              Permissions
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-white data-[state=active]:text-gray-900"
            >
              Notifications
            </TabsTrigger>
            <TabsTrigger value="general" className="data-[state=active]:bg-white data-[state=active]:text-gray-900">
              General
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pricing" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                    <DollarSign className="h-5 w-5 text-gray-600" />
                    Milestone Pricing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="archicad-price" className="text-gray-700">
                        Archicad Phase
                      </Label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">$</span>
                        <Input
                          id="archicad-price"
                          type="number"
                          step="0.1"
                          value={archicadPrice}
                          onChange={(e) => setArchicadPrice(e.target.value)}
                          className="flex-1 border-gray-200"
                        />
                        <span className="text-sm text-gray-500">per project</span>
                      </div>
                      <p className="text-xs text-gray-500">Initial architectural design and site planning</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sketchup-price" className="text-gray-700">
                        SketchUp Phase
                      </Label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">$</span>
                        <Input
                          id="sketchup-price"
                          type="number"
                          step="0.1"
                          value={sketchupPrice}
                          onChange={(e) => setSketchupPrice(e.target.value)}
                          className="flex-1 border-gray-200"
                        />
                        <span className="text-sm text-gray-500">per project</span>
                      </div>
                      <p className="text-xs text-gray-500">3D modeling and visualization</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lumion-price" className="text-gray-700">
                        Lumion Phase
                      </Label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">$</span>
                        <Input
                          id="lumion-price"
                          type="number"
                          step="0.1"
                          value={lumionPrice}
                          onChange={(e) => setLumionPrice(e.target.value)}
                          className="flex-1 border-gray-200"
                        />
                        <span className="text-sm text-gray-500">per project</span>
                      </div>
                      <p className="text-xs text-gray-500">Final rendering and animation</p>
                    </div>
                  </div>

                  <Separator className="bg-gray-200" />

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Additional Settings</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-gray-700">Auto-calculate project totals</Label>
                          <p className="text-xs text-gray-500">Automatically sum milestone prices for project total</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-gray-700">Allow custom pricing per project</Label>
                          <p className="text-xs text-gray-500">Enable project-specific price overrides</p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Pricing Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <h4 className="font-medium mb-3 text-gray-900">Sample Project Breakdown</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                            <span className="text-sm text-gray-700">Archicad Phase</span>
                          </div>
                          <span className="font-medium text-gray-900">${archicadPrice}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                            <span className="text-sm text-gray-700">SketchUp Phase</span>
                          </div>
                          <span className="font-medium text-gray-900">${sketchupPrice}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-purple-500" />
                            <span className="text-sm text-gray-700">Lumion Phase</span>
                          </div>
                          <span className="font-medium text-gray-900">${lumionPrice}</span>
                        </div>
                        <Separator className="bg-gray-200" />
                        <div className="flex items-center justify-between font-semibold text-gray-900">
                          <span>Total Project Value</span>
                          <span>
                            $
                            {(
                              Number.parseFloat(archicadPrice) +
                              Number.parseFloat(sketchupPrice) +
                              Number.parseFloat(lumionPrice)
                            ).toFixed(0)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h5 className="font-medium mb-2 text-gray-900">Impact Analysis</h5>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>
                          • Monthly revenue estimate: $
                          {(
                            (Number.parseFloat(archicadPrice) +
                              Number.parseFloat(sketchupPrice) +
                              Number.parseFloat(lumionPrice)) *
                            12
                          ).toFixed(0)}
                        </p>
                        <p>• Average project completion time: 2-3 weeks</p>
                        <p>
                          • Designer earnings per project: $
                          {(
                            (Number.parseFloat(archicadPrice) +
                              Number.parseFloat(sketchupPrice) +
                              Number.parseFloat(lumionPrice)) *
                            0.7
                          ).toFixed(0)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="roles" className="mt-0">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Team Roles</h2>
                  <p className="text-gray-500">Manage user roles and their default permissions</p>
                </div>
                <Button className="gap-2 text-gray-600 hover:text-gray-900">
                  <Plus className="h-4 w-4" />
                  Create Custom Role
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userRoles.map((role) => (
                  <Card key={role.id} className="border-gray-200 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{role.name}</h3>
                            <Badge className={role.color}>{role.users} users</Badge>
                          </div>
                          <p className="text-sm text-gray-500">{role.description}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                            <Edit className="h-4 w-4" />
                          </Button>
                          {role.id > 2 && (
                            <Button variant="ghost" size="sm" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-gray-900">Default Permissions</h4>
                        <div className="space-y-2">
                          {role.permissions.map((permission, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                              <span className="text-gray-500">{permission}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="permissions" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                    <Shield className="h-5 w-5 text-gray-600" />
                    Permission Matrix
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {[
                      { feature: "Project Management", admin: true, manager: true, designer: false, client: false },
                      { feature: "File Upload", admin: true, manager: true, designer: true, client: false },
                      { feature: "File Download", admin: true, manager: true, designer: true, client: true },
                      { feature: "Team Management", admin: true, manager: false, designer: false, client: false },
                      { feature: "Billing Access", admin: true, manager: false, designer: false, client: false },
                      { feature: "Settings", admin: true, manager: false, designer: false, client: false },
                      { feature: "Comments", admin: true, manager: true, designer: true, client: true },
                      { feature: "Progress Tracking", admin: true, manager: true, designer: true, client: true },
                    ].map((permission, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-5 gap-4 items-center py-2 border-b border-gray-200 last:border-0"
                      >
                        <span className="text-sm font-medium text-gray-900">{permission.feature}</span>
                        <div className="flex justify-center">
                          <Switch checked={permission.admin} disabled />
                        </div>
                        <div className="flex justify-center">
                          <Switch checked={permission.manager} />
                        </div>
                        <div className="flex justify-center">
                          <Switch checked={permission.designer} />
                        </div>
                        <div className="flex justify-center">
                          <Switch checked={permission.client} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Security Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-gray-700">Require two-factor authentication</Label>
                        <p className="text-xs text-gray-500">Enforce 2FA for all team members</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-gray-700">Session timeout</Label>
                        <p className="text-xs text-gray-500">Auto-logout after inactivity</p>
                      </div>
                      <Select defaultValue="24h">
                        <SelectTrigger className="w-32 text-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1h">1 hour</SelectItem>
                          <SelectItem value="8h">8 hours</SelectItem>
                          <SelectItem value="24h">24 hours</SelectItem>
                          <SelectItem value="never">Never</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-gray-700">IP restrictions</Label>
                        <p className="text-xs text-gray-500">Limit access to specific IP addresses</p>
                      </div>
                      <Switch />
                    </div>
                  </div>

                  <Separator className="bg-gray-200" />

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">File Access Controls</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-gray-700">Watermark downloads</Label>
                          <p className="text-xs text-gray-500">Add watermarks to client downloads</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-gray-700">Download tracking</Label>
                          <p className="text-xs text-gray-500">Log all file download activities</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                    <Bell className="h-5 w-5 text-gray-600" />
                    Notification Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Delivery Methods</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-gray-700">Email notifications</Label>
                          <p className="text-xs text-gray-500">Send notifications via email</p>
                        </div>
                        <Switch
                          checked={notifications.email}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-gray-700">Push notifications</Label>
                          <p className="text-xs text-gray-500">Browser and mobile push notifications</p>
                        </div>
                        <Switch
                          checked={notifications.push}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-gray-200" />

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Notification Types</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-gray-700">Project updates</Label>
                          <p className="text-xs text-gray-500">Status changes, milestones, deadlines</p>
                        </div>
                        <Switch
                          checked={notifications.projectUpdates}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, projectUpdates: checked })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-gray-700">Team activity</Label>
                          <p className="text-xs text-gray-500">File uploads, comments, assignments</p>
                        </div>
                        <Switch
                          checked={notifications.teamActivity}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, teamActivity: checked })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-gray-700">Billing notifications</Label>
                          <p className="text-xs text-gray-500">Payment confirmations, invoices</p>
                        </div>
                        <Switch
                          checked={notifications.billing}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, billing: checked })}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Email Templates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      { name: "Project Assignment", description: "When a project is assigned to a team member" },
                      { name: "Milestone Completion", description: "When a project milestone is completed" },
                      { name: "Client Feedback", description: "When a client provides feedback or comments" },
                      { name: "File Upload", description: "When new files are uploaded to a project" },
                      { name: "Payment Confirmation", description: "When a payment is processed" },
                    ].map((template, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{template.name}</p>
                          <p className="text-xs text-gray-500">{template.description}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 text-gray-600 hover:text-gray-900 bg-transparent"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="general" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                    <Globe className="h-5 w-5 text-gray-600" />
                    Company Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name" className="text-gray-700">
                      Company Name
                    </Label>
                    <Input id="company-name" defaultValue="SketchUp Playstore" className="border-gray-200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-email" className="text-gray-700">
                      Contact Email
                    </Label>
                    <Input
                      id="company-email"
                      type="email"
                      defaultValue="contact@sketchup-playstore.com"
                      className="border-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-phone" className="text-gray-700">
                      Phone Number
                    </Label>
                    <Input id="company-phone" defaultValue="+1 (555) 123-4567" className="border-gray-200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-address" className="text-gray-700">
                      Address
                    </Label>
                    <Textarea
                      id="company-address"
                      defaultValue="123 Design Street, Creative City, CC 12345"
                      className="border-gray-200"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                    <Palette className="h-5 w-5 text-gray-600" />
                    System Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-gray-700">Default Currency</Label>
                      <Select defaultValue="usd">
                        <SelectTrigger className="text-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="usd">USD ($)</SelectItem>
                          <SelectItem value="eur">EUR (€)</SelectItem>
                          <SelectItem value="gbp">GBP (£)</SelectItem>
                          <SelectItem value="cad">CAD (C$)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700">Time Zone</Label>
                      <Select defaultValue="est">
                        <SelectTrigger className="text-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="est">Eastern Time (EST)</SelectItem>
                          <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                          <SelectItem value="cst">Central Time (CST)</SelectItem>
                          <SelectItem value="utc">UTC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700">Date Format</Label>
                      <Select defaultValue="mdy">
                        <SelectTrigger className="text-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                          <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                          <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator className="bg-gray-200" />

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">File Storage</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-gray-700">Auto-backup files</Label>
                          <p className="text-xs text-gray-500">Automatically backup files to cloud storage</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-700">Maximum file size</Label>
                        <Select defaultValue="100mb">
                          <SelectTrigger className="text-gray-600">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="50mb">50 MB</SelectItem>
                            <SelectItem value="100mb">100 MB</SelectItem>
                            <SelectItem value="500mb">500 MB</SelectItem>
                            <SelectItem value="1gb">1 GB</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
