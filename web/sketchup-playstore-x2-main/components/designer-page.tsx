"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  LayoutDashboard,
  Search,
  User,
  FileText,
  Briefcase,
  Calendar,
  TrendingUp,
  Bell,
  Upload,
  Eye,
  Download,
  X,
  CheckCircle,
  Clock,
  AlertTriangle,
  UserPlus,
  AlertCircle,
  DollarSign,
  Star,
  Award,
  Home,
} from "lucide-react"

import { DarkModeToggle } from "@/components/dark-mode-toggle"

const mockProjects = [
  {
    id: 1,
    title: "Modern Garden Design",
    address: "123 Oak Street, Beverly Hills, CA",
    client: "Johnson Family",
    status: "Available",
    urgent: false,
    dueDate: "2024-02-15",
    assignee: null,
    progress: 0,
    currentPhase: "Archicad",
    milestoneFiles: {
      archicad: { file: null, uploaded: false, status: "pending" },
      sketchup: { file: null, uploaded: false, status: "pending" },
      rendering: { file: null, uploaded: false, status: "pending" },
    },
    budget: 15,
    earnings: { archicad: 2, sketchup: 8, rendering: 5 },
  },
  {
    id: 2,
    title: "Corporate Plaza Landscaping",
    address: "456 Business Blvd, Downtown LA",
    client: "TechCorp Inc",
    status: "Under Review",
    urgent: false,
    dueDate: "2024-02-28",
    assignee: "Sarah Wilson",
    progress: 35,
    currentPhase: "SketchUp",
    milestoneFiles: {
      archicad: {
        file: { name: "corporate-plaza.pln", size: "8.2 MB", preview: "/archicad-file-icon.jpg" },
        uploaded: true,
        status: "completed",
      },
      sketchup: {
        file: { name: "corporate-plaza.skp", size: "12.4 MB", preview: "/sketchup-3d-model-preview.jpg" },
        uploaded: true,
        status: "under_review",
      },
      rendering: { file: null, uploaded: false, status: "pending" },
    },
    budget: 15,
    earnings: { archicad: 2, sketchup: 8, rendering: 5 },
  },
  {
    id: 3,
    title: "Residential Backyard Oasis",
    address: "789 Maple Ave, Pasadena, CA",
    client: "Smith Family",
    status: "In Revision",
    urgent: true,
    dueDate: "2024-01-25",
    assignee: "Sarah Wilson",
    progress: 85,
    currentPhase: "Final Rendering",
    milestoneFiles: {
      archicad: {
        file: { name: "backyard-oasis.pln", size: "6.1 MB", preview: "/archicad-file-icon.jpg" },
        uploaded: true,
        status: "completed",
      },
      sketchup: {
        file: { name: "backyard-oasis.skp", size: "12.4 MB", preview: "/sketchup-3d-model-preview.jpg" },
        uploaded: true,
        status: "completed",
      },
      rendering: {
        file: { name: "backyard-render-v2.jpg", size: "4.2 MB", preview: "/landscape-render.jpg" },
        uploaded: true,
        status: "revision_requested",
        version: 2,
      },
    },
    budget: 15,
    earnings: { archicad: 2, sketchup: 8, rendering: 5 },
  },
]

const recentActivity = [
  {
    id: 1,
    type: "milestone_completed",
    title: "SketchUp design for Modern Backyard Landscape has been delivered",
    time: "5 minutes ago",
    status: "Complete",
    action: "Review",
    icon: CheckCircle,
  },
  {
    id: 2,
    type: "approaching_deadline",
    title: "Lumion rendering for Commercial Plaza due in 2 days",
    time: "1 hour ago",
    status: "Urgent",
    action: "View Project",
    icon: Clock,
  },
  {
    id: 3,
    type: "new_assignment",
    title: "Sarah Chen assigned to Residential Garden project",
    time: "3 hours ago",
    status: "New",
    action: "View Details",
    icon: UserPlus,
  },
  {
    id: 4,
    type: "revision_requested",
    title: "Client requested changes to Modern Windows Backyard design",
    time: "1 day ago",
    status: "Action Required",
    action: "View Revision",
    icon: AlertTriangle,
  },
]

const currentUser = {
  name: "James (Admin)",
  id: 1,
}

const designerUsers = [
  { name: "James (Admin)", id: 1, role: "admin" },
  { name: "Sharon", id: 2, role: "designer" },
  { name: "Dennis", id: 3, role: "designer" },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Available":
      return "bg-blue-50 text-blue-700 border-blue-200"
    case "In Progress":
      return "bg-amber-50 text-amber-700 border-amber-200"
    case "Under Review":
      return "bg-purple-50 text-purple-700 border-purple-200"
    case "In Revision":
      return "bg-orange-50 text-orange-700 border-orange-200"
    case "Completed":
      return "bg-emerald-50 text-emerald-700 border-emerald-200"
    default:
      return "bg-slate-50 text-slate-700 border-slate-200"
  }
}

const getActivityStatusColor = (status: string) => {
  switch (status) {
    case "Complete":
      return "bg-emerald-50 text-emerald-700 border-emerald-200"
    case "Urgent":
      return "bg-orange-50 text-orange-700 border-orange-200"
    case "New":
      return "bg-blue-50 text-blue-700 border-blue-200"
    case "Action Required":
      return "bg-red-50 text-red-700 border-red-200"
    default:
      return "bg-slate-50 text-slate-700 border-slate-200"
  }
}

const projectMessages = {
  1: [
    {
      id: 1,
      sender: "Johnson Family",
      role: "client",
      message:
        "Hi Sharon! We're excited about the modern garden design. Could you please focus on drought-resistant plants?",
      timestamp: "2 hours ago",
      projectId: 1,
      whatsappNumber: "+1234567890",
    },
    {
      id: 2,
      sender: "James",
      role: "admin",
      message:
        "Sharon, please coordinate with the client on plant selection. Budget is approved for premium materials.",
      timestamp: "1 hour ago",
      projectId: 1,
    },
  ],
  2: [
    {
      id: 3,
      sender: "Smith Residence",
      role: "client",
      message: "Dennis, we love the initial sketches! Can we add a water feature to the design?",
      timestamp: "3 hours ago",
      projectId: 2,
      whatsappNumber: "+1987654321",
    },
  ],
}

interface DesignerPageProps {
  onNavigate: (page: string) => void
  onRoleSwitch: (role: "admin" | "designer" | "client") => void
  onLogout?: () => void
}

export { DesignerPage }
export default function DesignerPage({ onNavigate, onRoleSwitch, onLogout }: DesignerPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [dragOver, setDragOver] = useState<string | null>(null)
  const [showMilestoneModal, setShowMilestoneModal] = useState<number | null>(null)
  const [selectedMilestones, setSelectedMilestones] = useState<{
    archicad: boolean
    sketchup: boolean
    lumion: boolean
  }>({
    archicad: false,
    sketchup: false,
    lumion: false,
  })
  const [showEarningsModal, setShowEarningsModal] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New project available: Modern Garden Design", type: "info", time: "2 min ago" },
    { id: 2, message: "Payment received: $8 for SketchUp milestone", type: "success", time: "1 hour ago" },
  ])

  const [selectedProjectForMessages, setSelectedProjectForMessages] = useState<number | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [showWhatsAppOptions, setShowWhatsAppOptions] = useState(false)

  const availableJobs = mockProjects.filter((p) => p.status === "Available")
  const myProjects = mockProjects.filter((p) => p.assignee === currentUser.name)
  const allRelevantProjects = [...availableJobs, ...myProjects]

  const filteredProjects = allRelevantProjects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.address.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const handlePickJob = (projectId: number) => {
    setShowMilestoneModal(projectId)
    setSelectedMilestones({ archicad: false, sketchup: false, lumion: false })
  }

  const confirmJobSelection = () => {
    const selectedCount = Object.values(selectedMilestones).filter(Boolean).length
    if (selectedCount === 0) {
      alert("Please select at least one milestone to work on.")
      return
    }

    console.log("[v0] Designer picking job:", showMilestoneModal, "with milestones:", selectedMilestones)
    setShowMilestoneModal(null)

    setNotifications((prev) => [
      {
        id: Date.now(),
        message: `Successfully picked project with ${selectedCount} milestone${selectedCount > 1 ? "s" : ""}`,
        type: "success",
        time: "Just now",
      },
      ...prev.slice(0, 4),
    ])
  }

  const handleFileDownload = (projectId: number, milestone: string, fileName: string) => {
    console.log(`[v0] Downloading ${fileName} from project ${projectId}, milestone ${milestone}`)
    // In real app, this would trigger file download from Wasabi
    const link = document.createElement("a")
    link.href = `/api/download/${projectId}/${milestone}/${fileName}`
    link.download = fileName
    link.click()
  }

  const handleMarkComplete = (projectId: number, milestone: string) => {
    console.log(`[v0] Marking ${milestone} as complete for project ${projectId}`)
    // In real app, this would update the project status to "Under Review"
  }

  const handleMilestoneFileUpload = (projectId: number, milestone: string, files: FileList) => {
    const maxSize = 10 * 1024 * 1024 * 1024 // 10GB in bytes
    const file = files[0]

    if (!file) return

    if (file.size > maxSize) {
      alert(`File ${file.name} exceeds 10GB limit`)
      return
    }

    // Validate file types based on milestone
    const validExtensions = {
      archicad: [".pln"],
      sketchup: [".skp"],
      rendering: [".jpg", ".jpeg", ".png", ".pdf"],
    }

    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase()
    const allowedExtensions = validExtensions[milestone as keyof typeof validExtensions]

    if (!allowedExtensions.includes(fileExtension)) {
      alert(`Invalid file type for ${milestone}. Expected: ${allowedExtensions.join(", ")}`)
      return
    }

    console.log(`[v0] Uploading ${milestone} file for project ${projectId}:`, file.name, file.size)
    // In real app, this would upload to Wasabi
  }

  const handleDragOver = (e: React.DragEvent, identifier: string) => {
    e.preventDefault()
    setDragOver(identifier)
  }

  const handleDragLeave = () => {
    setDragOver(null)
  }

  const handleDrop = (e: React.DragEvent, projectId: number, milestone: string) => {
    e.preventDefault()
    setDragOver(null)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleMilestoneFileUpload(projectId, milestone, files)
    }
  }

  const monthlyEarnings = myProjects.reduce((total, project) => {
    if (project.progress >= 25) total += project.earnings.archicad
    if (project.progress >= 60) total += project.earnings.sketchup
    if (project.progress >= 90) total += project.earnings.rendering
    return total
  }, 0)

  const handleMilestoneClick = (milestone: "archicad" | "sketchup" | "lumion") => {
    setSelectedMilestones((prev) => ({
      ...prev,
      [milestone]: !prev[milestone],
    }))
  }

  const handleSendMessage = (projectId: number) => {
    if (!newMessage.trim()) return

    console.log("[v0] Sending message:", newMessage, "to project:", projectId)
    setNewMessage("")

    setNotifications((prev) => [
      {
        id: Date.now(),
        message: "Message sent successfully",
        type: "success",
        time: "Just now",
      },
      ...prev.slice(0, 4),
    ])
  }

  const handleWhatsAppMessage = (phoneNumber: string, message: string) => {
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const handleWhatsAppGroupInvite = (projectId: number) => {
    const groupInviteUrl = `https://chat.whatsapp.com/invite/project-${projectId}-landscape-design`
    navigator.clipboard.writeText(groupInviteUrl)

    setNotifications((prev) => [
      {
        id: Date.now(),
        message: "WhatsApp group invite link copied to clipboard",
        type: "success",
        time: "Just now",
      },
      ...prev.slice(0, 4),
    ])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50">
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="text-slate-600 hover:bg-white hover:text-slate-800 rounded-xl px-3 h-8 text-xs transition-all duration-200 bg-white/80 backdrop-blur-sm border-slate-200 hover:shadow-sm"
          onClick={() => onRoleSwitch("admin")}
        >
          Admin
        </Button>
        <Button
          size="sm"
          variant="default"
          className="bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl px-4 h-8 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Designer
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="text-slate-600 hover:bg-white hover:text-slate-800 rounded-xl px-3 h-8 text-xs transition-all duration-200 bg-white/80 backdrop-blur-sm border-slate-200 hover:shadow-sm"
          onClick={() => onRoleSwitch("client")}
        >
          Client
        </Button>
        {onLogout && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="text-xs text-slate-500 hover:text-slate-700 px-2 h-6 rounded-lg transition-colors"
          >
            Logout
          </Button>
        )}
      </div>

      <header className="sticky top-0 z-40 border-b border-white/20 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-4 animate-slide-up">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 shadow-lg">
                <LayoutDashboard className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">Designer Dashboard</h1>
                <p className="text-sm text-slate-500">Available Jobs & My Projects</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-9 border-slate-200 focus:border-emerald-400 focus:ring-emerald-400/20 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-200"
                />
              </div>

              <DarkModeToggle />

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowEarningsModal(true)}
                className="gap-2 bg-white/50 backdrop-blur-sm border-slate-200 hover:bg-white hover:shadow-sm transition-all duration-200 rounded-xl"
              >
                <DollarSign className="h-4 w-4 text-emerald-600" />
                <span className="font-semibold text-emerald-700">${monthlyEarnings}</span>
              </Button>

              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0 rounded-xl bg-white/50 backdrop-blur-sm border-slate-200 hover:bg-white hover:shadow-sm transition-all duration-200"
                >
                  <Bell className="h-4 w-4 text-slate-600" />
                </Button>
                {notifications.length > 0 && (
                  <div className="absolute -top-1 -right-1 h-5 w-5 bg-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-medium">{notifications.length}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-700">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shadow-sm">
                  <User className="h-4 w-4 text-slate-600" />
                </div>
                <span className="font-medium">{currentUser.name}</span>
              </div>
            </div>
          </div>

          <nav className="flex items-center gap-1 px-6 pb-3">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 hover:bg-white/50 hover:text-slate-800 rounded-xl px-4 h-8 transition-all duration-200"
              onClick={() => onNavigate("landing")}
            >
              <Home className="h-4 w-4" />
              Home
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl px-4 h-8 shadow-lg transition-all duration-200"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white rounded-xl px-4 h-8 shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={() => onNavigate("free-downloads")}
            >
              <Download className="h-4 w-4" />
              Download Models
            </Button>
          </nav>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        <main className="flex-1 p-6">
          {/* Enhanced available projects section with better visibility and real data */}
          {availableJobs.length > 0 && (
            <Card className="border-white/50 bg-white/70 backdrop-blur-sm shadow-lg mb-6 animate-slide-up">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 mb-1">Available Projects</h2>
                    <p className="text-sm text-slate-600">Select projects to work on and earn milestone payments</p>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1 rounded-full">
                    {availableJobs.length} Available
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableJobs.map((project, index) => (
                    <Card
                      key={project.id}
                      className="border-white/50 bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-slide-up cursor-pointer"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-slate-800 text-sm mb-1 line-clamp-2">
                                {project.title}
                              </h3>
                              <p className="text-xs text-slate-600 mb-2">{project.client}</p>
                              <div className="flex items-center gap-2 text-xs text-slate-500">
                                <Calendar className="h-3 w-3" />
                                Due: {new Date(project.dueDate).toLocaleDateString()}
                              </div>
                            </div>
                            {project.urgent && (
                              <Badge className="bg-red-50 text-red-700 border-red-200 text-xs px-2 py-1 rounded-full">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Urgent
                              </Badge>
                            )}
                          </div>

                          <div className="bg-slate-50 rounded-lg p-3">
                            <div className="text-xs text-slate-600 mb-2">Milestone Earnings:</div>
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div className="text-center">
                                <div className="font-semibold text-emerald-700">${project.earnings.archicad}</div>
                                <div className="text-slate-500">Archicad</div>
                              </div>
                              <div className="text-center">
                                <div className="font-semibold text-emerald-700">${project.earnings.sketchup}</div>
                                <div className="text-slate-500">SketchUp</div>
                              </div>
                              <div className="text-center">
                                <div className="font-semibold text-emerald-700">${project.earnings.rendering}</div>
                                <div className="text-slate-500">Rendering</div>
                              </div>
                            </div>
                          </div>

                          <Button
                            onClick={() => handlePickJob(project.id)}
                            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl"
                            size="sm"
                          >
                            <Star className="h-4 w-4 mr-2" />
                            Select Project
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="animate-slide-up" style={{ animationDelay: "200ms" }}>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">My Active Projects</h2>
              <p className="text-slate-600">Track progress and upload deliverables for your assigned projects</p>
            </div>

            {myProjects.length === 0 ? (
              <Card className="border-white/50 bg-white/70 backdrop-blur-sm shadow-lg">
                <CardContent className="text-center py-12">
                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 mx-auto mb-4">
                    <Briefcase className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">No Active Projects</h3>
                  <p className="text-slate-500">Select a project from available projects above to get started!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {myProjects.map((project, index) => (
                  <Card
                    key={project.id}
                    className="border-white/50 bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-slide-up"
                    style={{ animationDelay: `${(index + 1) * 150}ms` }}
                  >
                    <CardContent className="p-6">
                      <div className="space-y-5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge
                              className={`${getStatusColor(project.status)} rounded-full px-3 py-1`}
                              variant="outline"
                            >
                              {project.status}
                            </Badge>
                            {project.urgent && (
                              <Badge
                                className="bg-red-50 text-red-700 border-red-200 rounded-full px-2 py-1"
                                variant="outline"
                              >
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Urgent
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-5 w-5 text-emerald-600" />
                            <span className="text-xl font-bold text-emerald-700">{project.budget}</span>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-bold text-lg text-slate-900 mb-1">{project.address}</h3>
                          <p className="text-sm text-slate-600 mb-1">Client: {project.client}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Due: {new Date(project.dueDate).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Award className="h-5 w-5 text-emerald-600" />
                            <h4 className="text-base font-semibold text-slate-700">Project Milestones</h4>
                          </div>

                          {/* Archicad Phase */}
                          <div className="border border-slate-200 rounded-xl p-4 bg-gradient-to-r from-slate-50 to-white hover:shadow-md transition-all duration-200">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-semibold text-slate-700">Archicad (.pln)</span>
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4 text-emerald-600" />
                                <span className="text-sm font-bold text-emerald-700">2</span>
                              </div>
                            </div>
                            {project.milestoneFiles.archicad.uploaded ? (
                              <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 hover:shadow-sm transition-all duration-200">
                                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                                    <FileText className="h-6 w-6 text-blue-600" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm font-semibold text-slate-900">
                                      {project.milestoneFiles.archicad.file?.name}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                      {project.milestoneFiles.archicad.file?.size}
                                    </p>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      handleFileDownload(
                                        project.id,
                                        "archicad",
                                        project.milestoneFiles.archicad.file?.name || "",
                                      )
                                    }
                                    className="rounded-lg hover:bg-slate-50 transition-colors"
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </div>
                                {project.milestoneFiles.archicad.status === "pending" && (
                                  <Button
                                    size="sm"
                                    className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                                    onClick={() => handleMarkComplete(project.id, "archicad")}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Mark as Complete
                                  </Button>
                                )}
                              </div>
                            ) : (
                              <div
                                className={`border-2 border-dashed rounded-xl p-4 text-center transition-all duration-200 cursor-pointer ${
                                  dragOver === `${project.id}-archicad`
                                    ? "border-emerald-400 bg-emerald-50"
                                    : "border-slate-300 hover:border-emerald-400 hover:bg-emerald-50/50"
                                }`}
                                onDragOver={(e) => handleDragOver(e, `${project.id}-archicad`)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, project.id, "archicad")}
                                onClick={() => document.getElementById(`archicad-${project.id}`)?.click()}
                              >
                                <Upload className="h-6 w-6 mx-auto mb-2 text-slate-400" />
                                <p className="text-sm font-medium text-slate-600 mb-1">Upload .pln file</p>
                                <p className="text-xs text-slate-500">Drag & drop or click to browse</p>
                                <input
                                  type="file"
                                  accept=".pln"
                                  className="hidden"
                                  id={`archicad-${project.id}`}
                                  onChange={(e) =>
                                    e.target.files && handleMilestoneFileUpload(project.id, "archicad", e.target.files)
                                  }
                                />
                              </div>
                            )}
                          </div>

                          {/* SketchUp Phase - Similar enhancements */}
                          <div className="border border-slate-200 rounded-xl p-4 bg-gradient-to-r from-slate-50 to-white hover:shadow-md transition-all duration-200">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-semibold text-slate-700">SketchUp (.skp)</span>
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4 text-emerald-600" />
                                <span className="text-sm font-bold text-emerald-700">8</span>
                              </div>
                            </div>
                            {project.milestoneFiles.sketchup.uploaded ? (
                              <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 hover:shadow-sm transition-all duration-200">
                                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                                    <FileText className="h-6 w-6 text-blue-600" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm font-semibold text-slate-900">
                                      {project.milestoneFiles.sketchup.file?.name}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                      {project.milestoneFiles.sketchup.file?.size}
                                    </p>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      handleFileDownload(
                                        project.id,
                                        "sketchup",
                                        project.milestoneFiles.sketchup.file?.name || "",
                                      )
                                    }
                                    className="rounded-lg hover:bg-slate-50 transition-colors"
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </div>
                                {project.milestoneFiles.sketchup.status === "pending" && (
                                  <Button
                                    size="sm"
                                    className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                                    onClick={() => handleMarkComplete(project.id, "sketchup")}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Mark as Complete
                                  </Button>
                                )}
                                {project.milestoneFiles.sketchup.status === "under_review" && (
                                  <div className="flex items-center gap-2 p-2 bg-purple-50 rounded text-purple-700 text-sm">
                                    <Clock className="h-4 w-4" />
                                    Under Review
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div
                                className={`border-2 border-dashed rounded-xl p-4 text-center transition-all duration-200 cursor-pointer ${
                                  dragOver === `${project.id}-sketchup`
                                    ? "border-emerald-400 bg-emerald-50"
                                    : "border-slate-300 hover:border-emerald-400 hover:bg-emerald-50/50"
                                }`}
                                onDragOver={(e) => handleDragOver(e, `${project.id}-sketchup`)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, project.id, "sketchup")}
                                onClick={() => document.getElementById(`sketchup-${project.id}`)?.click()}
                              >
                                <Upload className="h-6 w-6 mx-auto mb-2 text-slate-400" />
                                <p className="text-sm font-medium text-slate-600 mb-1">Upload .skp file</p>
                                <p className="text-xs text-slate-500">Drag & drop or click to browse</p>
                                <input
                                  type="file"
                                  accept=".skp"
                                  className="hidden"
                                  id={`sketchup-${project.id}`}
                                  onChange={(e) =>
                                    e.target.files && handleMilestoneFileUpload(project.id, "sketchup", e.target.files)
                                  }
                                />
                              </div>
                            )}
                          </div>

                          {/* Final Rendering Phase - Similar enhancements */}
                          <div className="border border-slate-200 rounded-xl p-4 bg-gradient-to-r from-slate-50 to-white hover:shadow-md transition-all duration-200">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-semibold text-slate-700">
                                Final Render (.jpg/.png/.pdf)
                              </span>
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4 text-emerald-600" />
                                <span className="text-sm font-bold text-emerald-700">5</span>
                              </div>
                            </div>
                            {project.milestoneFiles.rendering.uploaded ? (
                              <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 hover:shadow-sm transition-all duration-200">
                                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                                    <FileText className="h-6 w-6 text-blue-600" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm font-semibold text-slate-900">
                                      {project.milestoneFiles.rendering.file?.name}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                      {project.milestoneFiles.rendering.file?.size}
                                    </p>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      handleFileDownload(
                                        project.id,
                                        "rendering",
                                        project.milestoneFiles.rendering.file?.name || "",
                                      )
                                    }
                                    className="rounded-lg hover:bg-slate-50 transition-colors"
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </div>
                                {project.milestoneFiles.rendering.status === "revision_requested" && (
                                  <div className="flex items-center gap-2 p-2 bg-orange-50 rounded text-orange-700 text-sm">
                                    <AlertTriangle className="h-4 w-4" />
                                    Revision Requested - Upload new version
                                  </div>
                                )}
                                {project.milestoneFiles.rendering.status === "pending" && (
                                  <Button
                                    size="sm"
                                    className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                                    onClick={() => handleMarkComplete(project.id, "rendering")}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Mark as Complete
                                  </Button>
                                )}
                              </div>
                            ) : (
                              <div
                                className={`border-2 border-dashed rounded-xl p-4 text-center transition-all duration-200 cursor-pointer ${
                                  dragOver === `${project.id}-rendering`
                                    ? "border-emerald-400 bg-emerald-50"
                                    : "border-slate-300 hover:border-emerald-400 hover:bg-emerald-50/50"
                                }`}
                                onDragOver={(e) => handleDragOver(e, `${project.id}-rendering`)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, project.id, "rendering")}
                                onClick={() => document.getElementById(`rendering-${project.id}`)?.click()}
                              >
                                <Upload className="h-6 w-6 mx-auto mb-2 text-slate-400" />
                                <p className="text-sm font-medium text-slate-600 mb-1">Upload image or PDF</p>
                                <p className="text-xs text-slate-500">Drag & drop or click to browse</p>
                                <input
                                  type="file"
                                  accept=".jpg,.jpeg,.png,.pdf"
                                  className="hidden"
                                  id={`rendering-${project.id}`}
                                  onChange={(e) =>
                                    e.target.files && handleMilestoneFileUpload(project.id, "rendering", e.target.files)
                                  }
                                />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-3 pt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-800 hover:border-slate-300 bg-white/50 backdrop-blur-sm transition-all duration-200 rounded-xl"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onNavigate("free-downloads")}
                            className="flex-1 text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 bg-white/50 backdrop-blur-sm transition-all duration-200 rounded-xl"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download Models
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>

        <aside className="w-80 border-l border-white/20 bg-white/70 backdrop-blur-xl p-6">
          {/* Enhanced Recent Activity */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-slate-600" />
                <h3 className="font-semibold text-slate-800">Recent Activity</h3>
              </div>
              <Badge
                variant="outline"
                className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs rounded-full px-2 py-1"
              >
                {recentActivity.length} new
              </Badge>
            </div>

            <div className="space-y-3">
              {recentActivity.map((activity, index) => {
                const IconComponent = activity.icon
                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 bg-white/80 backdrop-blur-sm rounded-xl hover:bg-white hover:shadow-md transition-all duration-200 animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-white shadow-sm flex-shrink-0">
                      <IconComponent className="h-4 w-4 text-slate-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          className={`${getActivityStatusColor(activity.status)} rounded-full px-2 py-0.5`}
                          variant="outline"
                        >
                          {activity.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-900 mb-1 font-medium">{activity.title}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-slate-500">{activity.time}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-6 px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                          {activity.action}
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Enhanced Quick Stats */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-slate-600" />
                <h3 className="font-semibold text-slate-800">Quick Stats</h3>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Card className="border-white/50 bg-white/80 backdrop-blur-sm hover:shadow-md transition-all duration-200">
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-xs text-slate-600 mb-1">Available</p>
                    <p className="text-2xl font-bold text-emerald-600">{availableJobs.length}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-white/50 bg-white/80 backdrop-blur-sm hover:shadow-md transition-all duration-200">
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-xs text-slate-600 mb-1">My Projects</p>
                    <p className="text-2xl font-bold text-slate-700">{myProjects.length}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card className="border-white/50 bg-gradient-to-br from-emerald-50 to-emerald-100/50 backdrop-blur-sm mt-3 hover:shadow-md transition-all duration-200">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-xs text-emerald-700 mb-1 font-medium">This Month</p>
                  <div className="flex items-center justify-center gap-1">
                    <DollarSign className="h-5 w-5 text-emerald-600" />
                    <p className="text-2xl font-bold text-emerald-700">{monthlyEarnings.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Earnings Breakdown */}
          <h3 className="font-semibold mb-4 text-slate-800 flex items-center gap-2">
            <Award className="h-4 w-4" />
            Earnings Breakdown
          </h3>
          <div className="space-y-3">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-700">Archicad Phase</span>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-bold text-emerald-700">2</span>
                </div>
              </div>
              <div className="text-xs text-slate-500">Site analysis & measurements</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-700">SketchUp Phase</span>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-bold text-emerald-700">8</span>
                </div>
              </div>
              <div className="text-xs text-slate-500">3D modeling & design</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-700">Final Rendering</span>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-bold text-emerald-700">5</span>
                </div>
              </div>
              <div className="text-xs text-slate-500">Lumion visualization</div>
            </div>
          </div>

          {/* Enhanced Quick Actions */}
          <h3 className="font-semibold mb-3 mt-6 text-sm text-slate-800">Quick Actions</h3>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start bg-white/50 backdrop-blur-sm text-sm h-9 rounded-xl border-white/50 hover:bg-white hover:shadow-md transition-all duration-200"
              size="sm"
              onClick={() => onNavigate("free-downloads")}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Free Models
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start bg-white/50 backdrop-blur-sm text-sm h-9 rounded-xl border-white/50 hover:bg-white hover:shadow-md transition-all duration-200"
              size="sm"
              onClick={() => setShowEarningsModal(true)}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              View Earnings Report
            </Button>
          </div>
        </aside>
      </div>

      {showMilestoneModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md border-white/50 bg-white/95 backdrop-blur-xl shadow-2xl animate-scale-in">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-slate-800">Select Milestones</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMilestoneModal(null)}
                  className="h-8 w-8 p-0 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-slate-600">
                Choose which phases you'd like to work on by clicking the blocks:
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div
                  className={`flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    selectedMilestones.archicad
                      ? "border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/20"
                      : "border-slate-200 hover:border-emerald-300 hover:bg-slate-50"
                  }`}
                  onClick={() => handleMilestoneClick("archicad")}
                >
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                      selectedMilestones.archicad ? "border-emerald-500 bg-emerald-500" : "border-slate-300"
                    }`}
                  >
                    {selectedMilestones.archicad && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-slate-700">Archicad Phase</div>
                    <p className="text-xs text-slate-500">Site analysis & measurements</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-bold text-emerald-700">2</span>
                  </div>
                </div>

                <div
                  className={`flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    selectedMilestones.sketchup
                      ? "border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/20"
                      : "border-slate-200 hover:border-emerald-300 hover:bg-slate-50"
                  }`}
                  onClick={() => handleMilestoneClick("sketchup")}
                >
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                      selectedMilestones.sketchup ? "border-emerald-500 bg-emerald-500" : "border-slate-300"
                    }`}
                  >
                    {selectedMilestones.sketchup && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-slate-700">SketchUp Phase</div>
                    <p className="text-xs text-slate-500">3D modeling & design</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-bold text-emerald-700">8</span>
                  </div>
                </div>

                <div
                  className={`flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    selectedMilestones.lumion
                      ? "border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/20"
                      : "border-slate-200 hover:border-emerald-300 hover:bg-slate-50"
                  }`}
                  onClick={() => handleMilestoneClick("lumion")}
                >
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                      selectedMilestones.lumion ? "border-emerald-500 bg-emerald-500" : "border-slate-300"
                    }`}
                  >
                    {selectedMilestones.lumion && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-slate-700">Lumion Rendering</div>
                    <p className="text-xs text-slate-500">Final visualization</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-bold text-emerald-700">5</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-slate-700">Total Earnings:</span>
                  <span className="text-lg font-bold text-emerald-700">
                    $
                    {Object.entries(selectedMilestones).reduce((total, [key, selected]) => {
                      if (!selected) return total
                      const earnings = { archicad: 2, sketchup: 8, lumion: 5 }
                      return total + earnings[key as keyof typeof earnings]
                    }, 0)}
                  </span>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={confirmJobSelection}
                    disabled={Object.values(selectedMilestones).every((v) => !v)}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirm Selection
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowMilestoneModal(null)}
                    className="px-6 rounded-xl border-slate-200 hover:bg-slate-50 transition-all duration-200"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showEarningsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <Card className="w-96 max-w-[90vw] bg-white/95 backdrop-blur-xl shadow-2xl animate-slide-up">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Award className="h-5 w-5 text-emerald-600" />
                  Earnings Report
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEarningsModal(false)}
                  className="h-8 w-8 p-0 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl">
                <p className="text-sm text-emerald-700 mb-1">Total This Month</p>
                <div className="flex items-center justify-center gap-1">
                  <DollarSign className="h-6 w-6 text-emerald-600" />
                  <span className="text-3xl font-bold text-emerald-700">{monthlyEarnings.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-slate-700">Project Breakdown</h4>
                {myProjects.map((project) => (
                  <div key={project.id} className="p-3 bg-slate-50 rounded-lg">
                    <p className="font-medium text-sm text-slate-800 mb-1">{project.title}</p>
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>Progress: {project.progress}%</span>
                      <span>
                        Earned: $
                        {(project.progress >= 25 ? project.earnings.archicad : 0) +
                          (project.progress >= 60 ? project.earnings.sketchup : 0) +
                          (project.progress >= 90 ? project.earnings.rendering : 0)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
