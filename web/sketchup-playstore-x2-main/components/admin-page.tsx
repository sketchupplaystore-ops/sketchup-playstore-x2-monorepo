"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  LayoutDashboard,
  Plus,
  Calendar,
  Eye,
  Search,
  User,
  FileText,
  UserCheck,
  Upload,
  X,
  Building2,
  MessageSquare,
  Clock,
  AlertTriangle,
  CheckCircle,
  Users,
  Bell,
  TrendingUp,
  Download,
  Home,
} from "lucide-react"
import { DarkModeToggle } from "@/components/dark-mode-toggle"

const mockProjects = [
  {
    id: 1,
    title: "123 Oak Street, Beverly Hills, CA",
    address: "123 Oak Street, Beverly Hills, CA",
    client: "Johnson Family",
    status: "Available",
    dueDate: "2024-02-15",
    assignee: null,
    progress: 0,
    currentPhase: "Archicad",
    files: [
      { name: "site-photos.jpg", type: "image", size: "2.4 MB" },
      { name: "requirements.pdf", type: "pdf", size: "1.1 MB" },
    ],
    budget: 15000,
    earnings: { archicad: 2.5, sketchup: 10, rendering: 2.5 },
    createdBy: "Admin",
    createdAt: "2024-01-10",
    thumbnail: "/3d-garden-model.jpg",
  },
  {
    id: 2,
    title: "456 Business Blvd, Downtown LA",
    address: "456 Business Blvd, Downtown LA",
    client: "TechCorp Inc",
    status: "In Progress",
    dueDate: "2024-02-28",
    assignee: "Sarah Wilson",
    progress: 35,
    currentPhase: "SketchUp",
    files: [
      { name: "site-survey.pdf", type: "pdf", size: "3.2 MB" },
      { name: "initial-concepts.jpg", type: "image", size: "4.1 MB" },
      { name: "archicad-model.dwg", type: "file", size: "12.5 MB" },
    ],
    budget: 45000,
    earnings: { archicad: 2.5, sketchup: 10, rendering: 2.5 },
    createdBy: "Admin",
    createdAt: "2024-01-05",
    thumbnail: "/landscape-render.jpg",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Available":
      return "bg-blue-50 text-blue-700 border-blue-200"
    case "In Progress":
      return "bg-orange-50 text-orange-700 border-orange-200"
    case "Final Rendering":
      return "bg-purple-50 text-purple-700 border-purple-200"
    case "Completed":
      return "bg-emerald-50 text-emerald-700 border-emerald-200"
    default:
      return "bg-slate-50 text-slate-700 border-slate-200"
  }
}

interface AdminPageProps {
  onNavigate: (page: string) => void
  onRoleSwitch: (role: "admin" | "designer" | "client") => void
  onLogout?: () => void
}

export function AdminPage({ onNavigate, onRoleSwitch, onLogout }: AdminPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showNewProjectForm, setShowNewProjectForm] = useState(false)
  const [projects, setProjects] = useState(mockProjects)
  const [isCreatingProject, setIsCreatingProject] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [newProject, setNewProject] = useState({
    title: "",
    address: "",
    client: "",
    dueDate: "",
    budget: "",
    urgent: false,
  })
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "client",
      text: "Hi admin, when will my project be ready?",
      time: "10:30 AM",
      projectId: 1,
      read: false,
    },
    {
      id: 2,
      sender: "designer",
      text: "Need clarification on the 3D model requirements",
      time: "11:15 AM",
      projectId: 2,
      read: false,
    },
  ])
  const [newMessage, setNewMessage] = useState("")
  const [selectedMessageProject, setSelectedMessageProject] = useState<number | null>(null)

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.address.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const handleCreateProject = async () => {
    if (!newProject.address || !newProject.client || !newProject.dueDate || !newProject.budget) {
      alert("Please fill in all required fields")
      return
    }

    setIsCreatingProject(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const projectData = {
      id: projects.length + 1,
      title: newProject.address,
      address: newProject.address,
      client: newProject.client,
      status: "Available" as const,
      dueDate: newProject.dueDate,
      assignee: null,
      progress: 0,
      currentPhase: "Archicad" as const,
      files: uploadedFiles.map((file) => ({
        name: file.name,
        type: file.type.includes("image") ? "image" : file.type.includes("pdf") ? "pdf" : "file",
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      })),
      budget: Number.parseInt(newProject.budget),
      earnings: { archicad: 2.5, sketchup: 10, rendering: 2.5 },
      createdBy: "Admin",
      createdAt: new Date().toISOString().split("T")[0],
      thumbnail: "/3d-garden-model.jpg",
    }

    setProjects([projectData, ...projects])
    setIsCreatingProject(false)
    setShowNewProjectForm(false)
    setShowSuccessMessage(true)
    setNewProject({ title: "", address: "", client: "", dueDate: "", budget: "", urgent: false })
    setUploadedFiles([])

    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccessMessage(false), 3000)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const validFiles = files.filter((file) => file.size <= 10 * 1024 * 1024 * 1024) // 10GB limit
    setUploadedFiles([...uploadedFiles, ...validFiles])
  }

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedMessageProject) return

    const message = {
      id: messages.length + 1,
      sender: "admin",
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      projectId: selectedMessageProject,
      read: true,
    }

    setMessages([...messages, message])
    setNewMessage("")
    setSelectedMessageProject(null)
  }

  const markMessageAsRead = (messageId: number) => {
    setMessages(messages.map((msg) => (msg.id === messageId ? { ...msg, read: true } : msg)))
  }

  const unreadCount = messages.filter((msg) => !msg.read).length

  const handleCompleteProject = (projectId: number) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) => {
        if (project.id === projectId) {
          const completedProject = {
            ...project,
            status: "Completed" as const,
            progress: 100,
            completedAt: new Date().toISOString(),
          }

          // Add to SketchUp Playstore What's New section
          const playstoreModel = {
            id: `project-${projectId}`,
            name: `${project.client} - ${project.title}`,
            description: `Complete landscape design project transformation`,
            category: "What's New",
            thumbnail: project.thumbnail || "/placeholder.svg",
            downloadUrl: `/models/project-${projectId}.skp`,
            fileSize: "15.2 MB",
            downloads: 0,
            rating: 5.0,
            uploadDate: new Date().toISOString().split("T")[0],
            isFree: false,
            tokenCost: 10,
            tags: ["complete", "project", "transformation", project.client.toLowerCase().replace(" ", "-")],
            author: project.assignee || "James Wilson",
          }

          // Store in localStorage for SketchUp Playstore to access
          const existingModels = JSON.parse(localStorage.getItem("completedProjects") || "[]")
          localStorage.setItem("completedProjects", JSON.stringify([playstoreModel, ...existingModels]))

          return completedProject
        }
        return project
      }),
    )

    // Show success message
    setShowSuccessMessage(true)
    setTimeout(() => setShowSuccessMessage(false), 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50">
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 animate-slide-down">
          <div className="bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Project created successfully!</span>
          </div>
        </div>
      )}

      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <Button
          size="sm"
          variant="default"
          className="bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl px-4 h-8 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Admin
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="text-slate-600 hover:bg-white hover:text-slate-800 rounded-xl px-3 h-8 text-xs transition-all duration-200 bg-white/80 backdrop-blur-sm border-slate-200 hover:shadow-sm"
          onClick={() => onRoleSwitch("designer")}
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
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">Admin Dashboard</h1>
                <p className="text-sm text-slate-500">Project Management & Oversight</p>
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

              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0 rounded-xl bg-white/50 backdrop-blur-sm border-slate-200 hover:bg-white hover:shadow-sm transition-all duration-200"
                >
                  <Bell className="h-4 w-4 text-slate-600" />
                </Button>
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 h-5 w-5 bg-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-medium">{unreadCount}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-700">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shadow-sm">
                  <User className="h-4 w-4 text-slate-600" />
                </div>
                <span className="font-medium">James</span>
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
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {showNewProjectForm && (
          <Card className="border-white/50 mb-6 bg-white/70 backdrop-blur-sm shadow-lg animate-slide-up hover-lift rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 p-4 border-b border-white/20">
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Plus className="h-5 w-5 text-emerald-600" />
                Post New Project
              </CardTitle>
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Project Address</label>
                  <Input
                    value={newProject.address}
                    onChange={(e) => setNewProject({ ...newProject, address: e.target.value, title: e.target.value })}
                    placeholder="123 Oak Street, Beverly Hills, CA"
                    className="h-10 rounded-xl border-slate-200 bg-white/80 backdrop-blur-sm focus:border-emerald-400 focus:ring-emerald-400/20 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Client Name</label>
                  <Input
                    value={newProject.client}
                    onChange={(e) => setNewProject({ ...newProject, client: e.target.value })}
                    placeholder="Johnson Family"
                    className="h-10 rounded-xl border-slate-200 bg-white/80 backdrop-blur-sm focus:border-emerald-400 focus:ring-emerald-400/20 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Due Date</label>
                  <Input
                    type="date"
                    value={newProject.dueDate}
                    onChange={(e) => setNewProject({ ...newProject, dueDate: e.target.value })}
                    className="h-10 rounded-xl border-slate-200 bg-white/80 backdrop-blur-sm focus:border-emerald-400 focus:ring-emerald-400/20 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Budget ($)</label>
                  <Input
                    type="number"
                    value={newProject.budget}
                    onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                    placeholder="15000"
                    className="h-10 rounded-xl border-slate-200 bg-white/80 backdrop-blur-sm focus:border-emerald-400 focus:ring-emerald-400/20 transition-all duration-200"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 h-10">
                    <input
                      type="checkbox"
                      checked={newProject.urgent}
                      onChange={(e) => setNewProject({ ...newProject, urgent: e.target.checked })}
                      className="rounded border-slate-200 focus:border-emerald-400 transition-all duration-200"
                    />
                    <span className="text-sm font-medium text-slate-700">Mark as Urgent</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Upload Files (JPG, PDF, Videos - up to 10GB each)
                </label>
                <div>
                  <input
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.pdf,.mp4,.mov,.avi"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-slate-300 transition-colors bg-white/50 backdrop-blur-sm"
                  >
                    <div className="text-center">
                      <Upload className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                      <p className="text-sm font-medium text-slate-800">Drag & drop files or click to upload</p>
                      <p className="text-xs text-slate-500 mt-1">JPG, PDF, MP4 up to 10GB each</p>
                    </div>
                  </label>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-white/80 rounded-lg border border-slate-200 backdrop-blur-sm"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-slate-600" />
                          <div>
                            <span className="text-sm font-medium text-slate-800">{file.name}</span>
                            <p className="text-xs text-slate-500">({(file.size / 1024 / 1024).toFixed(1)} MB)</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="h-6 w-6 p-0 hover:bg-red-50 hover:text-red-600 rounded transition-all duration-200"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleCreateProject}
                  disabled={isCreatingProject}
                  className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 h-10 px-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-200 hover-lift"
                >
                  {isCreatingProject ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    "Post Project"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowNewProjectForm(false)}
                  disabled={isCreatingProject}
                  className="h-10 px-6 rounded-xl border-slate-200 hover:bg-white/80 backdrop-blur-sm transition-all duration-200"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-6">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">All Projects</h2>
                <p className="text-slate-600">Manage and oversee landscape design projects</p>
              </div>
              <Button
                onClick={() => setShowNewProjectForm(true)}
                className="gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 h-10 px-4 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-200 hover-lift animate-scale-in"
              >
                <Plus className="h-4 w-4" />
                Post Project
              </Button>
            </div>

            <div className="space-y-4">
              {filteredProjects.map((project, index) => (
                <Card
                  key={project.id}
                  className="border-white/50 hover:border-emerald-200 transition-all duration-300 rounded-xl overflow-hidden bg-white/80 backdrop-blur-sm hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <img
                        src={project.thumbnail || "/placeholder.svg"}
                        alt={project.title}
                        className="w-16 h-16 rounded-lg object-cover bg-muted"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-card-foreground truncate">{project.title}</h3>
                          <Badge
                            className={getStatusColor(project.status) + " px-2 py-1 rounded-md text-xs font-medium"}
                          >
                            {project.status}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-6 text-xs text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {project.client}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(project.dueDate).toLocaleDateString()}
                          </span>
                          {project.assignee && (
                            <span className="flex items-center gap-1">
                              <UserCheck className="h-3 w-3" />
                              {project.assignee}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-xs">
                          <span className="font-medium text-card-foreground">Phase: {project.currentPhase}</span>
                          <div className="flex-1 max-w-32">
                            <Progress value={project.progress} className="h-2" />
                          </div>
                          <span className="text-muted-foreground">{project.progress}%</span>
                          <span className="font-medium text-card-foreground">Budget: $15k</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 rounded-lg border-slate-200 bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Eye className="h-3 w-3" />
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 rounded-lg border-slate-200 bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <MessageSquare className="h-3 w-3" />
                          Messages
                        </Button>
                        {project.status !== "Completed" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCompleteProject(project.id)}
                            className="gap-1 rounded-lg border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 hover:text-emerald-800 transition-colors"
                          >
                            <CheckCircle className="h-3 w-3" />
                            Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <aside className="w-80 border-l border-white/20 bg-white/70 backdrop-blur-xl p-6">
            <div className="sticky top-20 space-y-6">
              <Card className="border-white/50 bg-white/80 backdrop-blur-sm shadow-lg animate-slide-up">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-emerald-600" />
                      <h3 className="font-semibold text-slate-800">Messages</h3>
                    </div>
                    {unreadCount > 0 && (
                      <Badge
                        variant="outline"
                        className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs rounded-full px-2 py-1"
                      >
                        {unreadCount} new
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                    {messages.slice(-4).map((message) => (
                      <div
                        key={message.id}
                        className={`p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-muted/50 ${
                          !message.read ? "bg-primary/5 border-l-2 border-primary" : "bg-muted/30"
                        }`}
                        onClick={() => markMessageAsRead(message.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-card-foreground capitalize">{message.sender}</p>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{message.text}</p>
                          </div>
                          <span className="text-xs text-muted-foreground">{message.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <select
                      value={selectedMessageProject || ""}
                      onChange={(e) => setSelectedMessageProject(Number(e.target.value))}
                      className="w-full p-2 text-sm border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm focus:border-emerald-400 focus:ring-emerald-400/20 transition-all duration-200"
                    >
                      <option value="">Select project to reply...</option>
                      {projects.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.title}
                        </option>
                      ))}
                    </select>

                    <div className="flex gap-2">
                      <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        className="flex-1 text-sm bg-white/80 backdrop-blur-sm rounded-lg border border-slate-200 focus:border-emerald-400 focus:ring-emerald-400/20 transition-all duration-200"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || !selectedMessageProject}
                        size="sm"
                        className="px-3 transition-all duration-200 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg shadow-lg hover:shadow-xl"
                      >
                        Send
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className="border-white/50 bg-white/80 backdrop-blur-sm shadow-lg animate-slide-up"
                style={{ animationDelay: "100ms" }}
              >
                <CardContent className="p-4">
                  <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                    Quick Stats
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Total Projects</span>
                      <span className="font-medium text-card-foreground">{projects.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Available Jobs</span>
                      <span className="font-medium text-card-foreground">
                        {projects.filter((p) => p.status === "Available").length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Active Workers</span>
                      <span className="font-medium text-card-foreground">3</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">This Month Revenue</span>
                      <span className="font-medium text-card-foreground">$45k</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className="border-white/50 bg-white/80 backdrop-blur-sm shadow-lg animate-slide-up"
                style={{ animationDelay: "200ms" }}
              >
                <CardContent className="p-4">
                  <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <Bell className="h-4 w-4 text-emerald-600" />
                    Recent Activity
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-card-foreground">Project Completed</p>
                        <p className="text-xs text-muted-foreground mb-1">Modern Backyard Landscape delivered</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">5 minutes ago</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                          >
                            Review
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                        <Clock className="h-4 w-4 text-orange-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-card-foreground">Approaching Deadline</p>
                        <p className="text-xs text-muted-foreground mb-1">Commercial Plaza due in 2 days</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">1 hour ago</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                          >
                            View Project
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-card-foreground">New Assignment</p>
                        <p className="text-xs text-muted-foreground mb-1">Sarah Chen assigned to Residential Garden</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">3 hours ago</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-card-foreground">Revision Requested</p>
                        <p className="text-xs text-muted-foreground mb-1">
                          Client requested changes to Modern Windows design
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">1 day ago</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                          >
                            View Revision
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
