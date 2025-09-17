"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Users,
  DollarSign,
  Calendar,
  Search,
  Plus,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  Star,
} from "lucide-react"

interface TeamViewProps {
  onBack: () => void
}

const teamMembers = [
  {
    id: 1,
    name: "Sarah Wilson",
    role: "Senior Designer",
    email: "sarah.wilson@company.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    avatar: "/placeholder.svg",
    status: "active",
    joinDate: "2023-01-15",
    projectsCompleted: 24,
    currentProjects: 3,
    totalEarnings: 12450,
    monthlyEarnings: 2850,
    rating: 4.9,
    specialties: ["SketchUp", "Lumion", "Landscape Design"],
    recentProjects: [
      { name: "Residential Garden Design", status: "In Progress", earnings: 850 },
      { name: "Corporate Landscape", status: "Completed", earnings: 1200 },
    ],
  },
  {
    id: 2,
    name: "Mike Johnson",
    role: "3D Visualization Specialist",
    email: "mike.johnson@company.com",
    phone: "+1 (555) 234-5678",
    location: "Los Angeles, CA",
    avatar: "/placeholder.svg",
    status: "active",
    joinDate: "2023-03-20",
    projectsCompleted: 18,
    currentProjects: 2,
    totalEarnings: 9800,
    monthlyEarnings: 2200,
    rating: 4.8,
    specialties: ["Lumion", "3D Rendering", "Animation"],
    recentProjects: [
      { name: "Hotel Courtyard", status: "In Review", earnings: 650 },
      { name: "Shopping Mall Plaza", status: "Delivered", earnings: 950 },
    ],
  },
  {
    id: 3,
    name: "Emma Davis",
    role: "Architectural Designer",
    email: "emma.davis@company.com",
    phone: "+1 (555) 345-6789",
    location: "Chicago, IL",
    avatar: "/placeholder.svg",
    status: "active",
    joinDate: "2022-11-10",
    projectsCompleted: 31,
    currentProjects: 4,
    totalEarnings: 15600,
    monthlyEarnings: 3100,
    rating: 4.9,
    specialties: ["Archicad", "Site Planning", "Urban Design"],
    recentProjects: [
      { name: "Park Renovation", status: "New", earnings: 0 },
      { name: "City Plaza Design", status: "In Progress", earnings: 750 },
    ],
  },
  {
    id: 4,
    name: "Alex Chen",
    role: "Junior Designer",
    email: "alex.chen@company.com",
    phone: "+1 (555) 456-7890",
    location: "Seattle, WA",
    avatar: "/placeholder.svg",
    status: "active",
    joinDate: "2023-08-05",
    projectsCompleted: 12,
    currentProjects: 2,
    totalEarnings: 5400,
    monthlyEarnings: 1350,
    rating: 4.6,
    specialties: ["SketchUp", "CAD", "Technical Drawing"],
    recentProjects: [
      { name: "Residential Backyard", status: "In Revision", earnings: 400 },
      { name: "Office Courtyard", status: "Completed", earnings: 600 },
    ],
  },
  {
    id: 5,
    name: "Lisa Brown",
    role: "Project Manager",
    email: "lisa.brown@company.com",
    phone: "+1 (555) 567-8901",
    location: "Austin, TX",
    avatar: "/placeholder.svg",
    status: "active",
    joinDate: "2022-06-01",
    projectsCompleted: 45,
    currentProjects: 6,
    totalEarnings: 22800,
    monthlyEarnings: 4200,
    rating: 4.9,
    specialties: ["Project Management", "Client Relations", "Quality Control"],
    recentProjects: [{ name: "Multiple Projects", status: "Managing", earnings: 1800 }],
  },
]

const earningsData = [
  { month: "Jan", total: 15400, archicad: 3850, sketchup: 9800, lumion: 1750 },
  { month: "Feb", total: 18200, archicad: 4550, sketchup: 11200, lumion: 2450 },
  { month: "Mar", total: 16800, archicad: 4200, sketchup: 10080, lumion: 2520 },
  { month: "Apr", total: 19600, archicad: 4900, sketchup: 11760, lumion: 2940 },
  { month: "May", total: 21300, archicad: 5325, sketchup: 12780, lumion: 3195 },
  { month: "Jun", total: 23100, archicad: 5775, sketchup: 13860, lumion: 3465 },
]

const getRoleColor = (role: string) => {
  switch (role.toLowerCase()) {
    case "senior designer":
      return "bg-purple-100 text-purple-800 border-purple-200"
    case "3d visualization specialist":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "architectural designer":
      return "bg-green-100 text-green-800 border-green-200"
    case "junior designer":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "project manager":
      return "bg-orange-100 text-orange-800 border-orange-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export function TeamView({ onBack }: TeamViewProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")

  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = selectedRole === "all" || member.role.toLowerCase().includes(selectedRole.toLowerCase())
    return matchesSearch && matchesRole
  })

  const totalEarnings = teamMembers.reduce((sum, member) => sum + member.totalEarnings, 0)
  const monthlyEarnings = teamMembers.reduce((sum, member) => sum + member.monthlyEarnings, 0)
  const activeProjects = teamMembers.reduce((sum, member) => sum + member.currentProjects, 0)
  const completedProjects = teamMembers.reduce((sum, member) => sum + member.projectsCompleted, 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <div className="h-6 w-px bg-border" />
            <h1 className="text-xl font-semibold text-balance">Team & Earnings</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Mail className="h-4 w-4" />
              Invite Member
            </Button>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Team Member
            </Button>
          </div>
        </div>
      </header>

      <main className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview">Team Overview</TabsTrigger>
            <TabsTrigger value="members">Team Members</TabsTrigger>
            <TabsTrigger value="earnings">Earnings Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="border-border/50 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Team Members</p>
                      <p className="text-2xl font-bold">{teamMembers.length}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                      <p className="text-2xl font-bold">{activeProjects}</p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Monthly Earnings</p>
                      <p className="text-2xl font-bold">${monthlyEarnings.toLocaleString()}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Completed Projects</p>
                      <p className="text-2xl font-bold">{completedProjects}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Performers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-balance">Top Performers This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {teamMembers
                      .sort((a, b) => b.monthlyEarnings - a.monthlyEarnings)
                      .slice(0, 5)
                      .map((member, index) => (
                        <div key={member.id} className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                            {index + 1}
                          </div>
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={member.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-balance truncate">{member.name}</p>
                            <p className="text-sm text-muted-foreground">{member.role}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">${member.monthlyEarnings.toLocaleString()}</p>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500 fill-current" />
                              <span className="text-xs text-muted-foreground">{member.rating}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-balance">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        action: "Project Completed",
                        member: "Sarah Wilson",
                        project: "Residential Garden Design",
                        time: "2 hours ago",
                        earnings: 850,
                      },
                      {
                        action: "File Uploaded",
                        member: "Mike Johnson",
                        project: "Corporate Landscape",
                        time: "4 hours ago",
                        earnings: 0,
                      },
                      {
                        action: "Milestone Reached",
                        member: "Emma Davis",
                        project: "Park Renovation",
                        time: "6 hours ago",
                        earnings: 625,
                      },
                      {
                        action: "Project Started",
                        member: "Alex Chen",
                        project: "Hotel Courtyard",
                        time: "1 day ago",
                        earnings: 0,
                      },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm">
                            <span className="font-medium">{activity.member}</span> {activity.action.toLowerCase()}
                          </p>
                          <p className="text-sm text-muted-foreground">{activity.project}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">{activity.time}</span>
                            {activity.earnings > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                +${activity.earnings}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="members" className="mt-0">
            {/* Search and Filters */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search team members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="senior">Senior Designer</SelectItem>
                  <SelectItem value="specialist">3D Visualization Specialist</SelectItem>
                  <SelectItem value="architectural">Architectural Designer</SelectItem>
                  <SelectItem value="junior">Junior Designer</SelectItem>
                  <SelectItem value="manager">Project Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Team Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map((member) => (
                <Card key={member.id} className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-balance truncate">{member.name}</h3>
                        <Badge className={getRoleColor(member.role)} size="sm">
                          {member.role}
                        </Badge>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-sm text-muted-foreground">{member.rating}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{member.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{member.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Joined {new Date(member.joinDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
                      <div>
                        <p className="text-xs text-muted-foreground">Projects</p>
                        <p className="font-semibold">{member.projectsCompleted} completed</p>
                        <p className="text-xs text-muted-foreground">{member.currentProjects} active</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Earnings</p>
                        <p className="font-semibold">${member.monthlyEarnings.toLocaleString()}/mo</p>
                        <p className="text-xs text-muted-foreground">${member.totalEarnings.toLocaleString()} total</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-xs text-muted-foreground mb-2">Specialties</p>
                      <div className="flex flex-wrap gap-1">
                        {member.specialties.map((specialty, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="earnings" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Earnings Summary */}
              <Card className="border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-balance">Earnings Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Earnings</span>
                      <span className="font-semibold">${totalEarnings.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">This Month</span>
                      <span className="font-semibold text-green-600">${monthlyEarnings.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Average per Project</span>
                      <span className="font-semibold">${Math.round(totalEarnings / completedProjects)}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <h4 className="font-medium mb-3 text-balance">Earnings by Phase</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500" />
                          <span className="text-sm">Archicad</span>
                        </div>
                        <span className="text-sm font-medium">$2.5 per project</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-500" />
                          <span className="text-sm">SketchUp</span>
                        </div>
                        <span className="text-sm font-medium">$10 per project</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-purple-500" />
                          <span className="text-sm">Lumion</span>
                        </div>
                        <span className="text-sm font-medium">$2.5 per project</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Trends */}
              <Card className="lg:col-span-2 border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-balance">Monthly Earnings Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {earningsData.map((month) => (
                      <div key={month.month} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{month.month} 2024</span>
                          <span className="font-semibold">${month.total.toLocaleString()}</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                              <div className="flex h-full">
                                <div
                                  className="bg-blue-500"
                                  style={{ width: `${(month.archicad / month.total) * 100}%` }}
                                />
                                <div
                                  className="bg-green-500"
                                  style={{ width: `${(month.sketchup / month.total) * 100}%` }}
                                />
                                <div
                                  className="bg-purple-500"
                                  style={{ width: `${(month.lumion / month.total) * 100}%` }}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Archicad: ${month.archicad.toLocaleString()}</span>
                            <span>SketchUp: ${month.sketchup.toLocaleString()}</span>
                            <span>Lumion: ${month.lumion.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
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
