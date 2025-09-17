"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  Search,
  User,
  Calendar,
  FileText,
  Home,
  Clock,
  CheckCircle,
  Eye,
  MessageSquare,
  Download,
  AlertCircle,
  UserPlus,
  X,
  Phone,
  FolderDown,
  CreditCard,
  DollarSign,
  Users,
  Zap,
  Layers,
} from "lucide-react"
import { DarkModeToggle } from "@/components/dark-mode-toggle"

const mockClientProjects = [
  {
    id: 1,
    title: "123 Oak Street, Beverly Hills, CA",
    status: "In Progress",
    dueDate: "2024-02-15",
    progress: 65,
    currentPhase: "3D Design",
    urgent: false,
    files: [
      { name: "site-photos.jpg", type: "image", size: "2.4 MB", phase: "Initial", url: "/site-analysis-document.jpg" },
      { name: "requirements.pdf", type: "pdf", size: "1.1 MB", phase: "Initial", url: "/document-materials.jpg" },
      { name: "3d-model-v1.skp", type: "sketchup", size: "8.2 MB", phase: "3D", url: "/3d-garden-model.jpg" },
    ],
    clientPricing: {
      type3D: { selected: true, price: 150 },
      type2D: { selected: false, price: 35 },
    },
    totalPrice: 150,
    startDate: "2024-01-10",
    previews: [
      { url: "/landscape-render.jpg", type: "render", phase: "3D Design" },
      { url: "/3d-garden-model.jpg", type: "model", phase: "3D Design" },
    ],
    updates: [
      {
        date: "2024-01-15",
        phase: "Site Analysis",
        note: "Site analysis completed, initial measurements done",
        status: "Complete",
      },
      {
        date: "2024-01-22",
        phase: "3D Design",
        note: "3D modeling in progress, first draft ready for review",
        status: "In Progress",
      },
    ],
    clientName: "Johnson Family",
  },
  {
    id: 2,
    title: "789 Maple Ave, Pasadena, CA",
    status: "Under Review",
    dueDate: "2024-01-25",
    progress: 100,
    currentPhase: "Final Review",
    urgent: true,
    files: [
      { name: "final-render.jpg", type: "image", size: "12.1 MB", phase: "Final", url: "/landscape-render.jpg" },
      { name: "walkthrough.mp4", type: "video", size: "45.2 MB", phase: "Final", url: "/3d-animation-preview.jpg" },
    ],
    clientPricing: {
      type3D: { selected: true, price: 150 },
      type2D: { selected: true, price: 35 },
    },
    totalPrice: 185,
    startDate: "2023-12-01",
    previews: [
      { url: "/landscape-render.jpg", type: "render", phase: "Final Rendering" },
      { url: "/site-analysis-document.jpg", type: "plan", phase: "2D Plans" },
    ],
    updates: [
      {
        date: "2024-01-20",
        phase: "Final Review",
        note: "All deliverables completed, awaiting client approval",
        status: "Under Review",
      },
    ],
    clientName: "Johnson Family",
  },
  {
    id: 3,
    title: "456 Pine Street, Santa Monica, CA",
    status: "In Progress",
    dueDate: "2024-03-01",
    progress: 30,
    currentPhase: "Site Analysis",
    urgent: false,
    files: [{ name: "site-survey.pdf", type: "pdf", size: "3.2 MB", phase: "Initial", url: "/document-materials.jpg" }],
    clientPricing: {
      type3D: { selected: true, price: 150 },
      type2D: { selected: false, price: 35 },
    },
    totalPrice: 150,
    startDate: "2024-02-01",
    previews: [{ url: "/site-analysis-document.jpg", type: "plan", phase: "Site Analysis" }],
    updates: [
      {
        date: "2024-02-05",
        phase: "Site Analysis",
        note: "Initial site survey completed, soil analysis in progress",
        status: "In Progress",
      },
    ],
    clientName: "Johnson Family",
  },
  {
    id: 4,
    title: "321 Elm Drive, Beverly Hills, CA",
    status: "Completed",
    dueDate: "2024-01-15",
    progress: 100,
    currentPhase: "Delivered",
    urgent: false,
    files: [
      { name: "final-package.zip", type: "archive", size: "125 MB", phase: "Final", url: "/landscape-render.jpg" },
    ],
    clientPricing: {
      type3D: { selected: true, price: 150 },
      type2D: { selected: true, price: 35 },
    },
    totalPrice: 185,
    startDate: "2023-11-15",
    previews: [
      { url: "/landscape-render.jpg", type: "render", phase: "Final Rendering" },
      { url: "/3d-garden-model.jpg", type: "model", phase: "3D Design" },
    ],
    updates: [
      {
        date: "2024-01-15",
        phase: "Final Delivery",
        note: "All project deliverables completed and delivered to client",
        status: "Completed",
      },
    ],
    clientName: "Johnson Family",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Available":
      return "bg-slate-100 text-slate-700 border-slate-200"
    case "In Progress":
      return "bg-blue-50 text-blue-700 border-blue-200"
    case "Under Review":
      return "bg-purple-50 text-purple-700 border-purple-200"
    case "Completed":
      return "bg-emerald-50 text-emerald-700 border-emerald-200"
    case "In Revision":
      return "bg-orange-50 text-orange-700 border-orange-200"
    default:
      return "bg-slate-100 text-slate-700 border-slate-200"
  }
}

interface ClientPageProps {
  onNavigate: (page: string) => void
  onRoleSwitch: (role: "admin" | "designer" | "client") => void
  onLogout?: () => void
}

export function ClientPage({ onNavigate, onRoleSwitch, onLogout }: ClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProject, setSelectedProject] = useState<number | null>(null)
  const [message, setMessage] = useState("")
  const [adminReply, setAdminReply] = useState("")
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteMethod, setInviteMethod] = useState<"email" | "whatsapp">("email")
  const [selectedProjectForMessage, setSelectedProjectForMessage] = useState<number | null>(null)
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false)
  const [showWhatsAppIntegration, setShowWhatsAppIntegration] = useState(false)
  const [showPayPalModal, setShowPayPalModal] = useState(false)
  const [monthlyInvoiceAmount, setMonthlyInvoiceAmount] = useState(185)
  const [isTyping, setIsTyping] = useState(false)
  const [unreadCount, setUnreadCount] = useState(3)
  const [showAddProjectModal, setShowAddProjectModal] = useState(false)
  const [newProject, setNewProject] = useState({
    title: "",
    location: "",
    type: "",
    timeline: "",
    description: "",
    contactPreference: "email" as "email" | "whatsapp" | "both",
    urgency: "normal" as "normal" | "urgent",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    // New checkbox fields
    frontyard: false,
    backyard: false,
    needs3D: false,
    needs2D: false,
    needsHOA: false,
    needsPermit: false,
  })

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "client",
      senderName: "John Smith",
      text: "Hi @admin, I have some questions about the design progress for #123-oak-street.",
      time: "10:30 AM",
      isAdmin: false,
      mentions: ["admin"],
      projectRef: 1,
      projectTitle: "123 Oak Street, Beverly Hills, CA",
      status: "read",
      whatsappSync: true,
    },
    {
      id: 2,
      sender: "admin",
      senderName: "Sarah (Admin)",
      text: "Hello @john! I'd be happy to help. The 3D rendering is 65% complete and should be ready by tomorrow.",
      time: "10:35 AM",
      isAdmin: true,
      mentions: ["john"],
      projectRef: 1,
      projectTitle: "123 Oak Street, Beverly Hills, CA",
      status: "read",
      whatsappSync: true,
    },
    {
      id: 3,
      sender: "designer",
      senderName: "Mike (Designer)",
      text: "I've uploaded the latest 3D model for #123-oak-street. Please review the plant selections in the front yard area.",
      time: "11:15 AM",
      isAdmin: false,
      mentions: [],
      projectRef: 1,
      projectTitle: "123 Oak Street, Beverly Hills, CA",
      status: "unread",
      whatsappSync: false,
      attachments: [{ type: "sketchup", name: "front-yard-v2.skp", size: "12.4 MB" }],
    },
    {
      id: 4,
      sender: "admin",
      senderName: "Sarah (Admin)",
      text: "Great work @mike! @john, please check the new model and let us know your thoughts.",
      time: "11:20 AM",
      isAdmin: true,
      mentions: ["mike", "john"],
      projectRef: 1,
      projectTitle: "123 Oak Street, Beverly Hills, CA",
      status: "unread",
      whatsappSync: true,
    },
  ])

  const [filteredProjects, setFilteredProjects] = useState(mockClientProjects)
  const [newMessage, setNewMessage] = useState("")
  const [selectedMessageProject, setSelectedMessageProject] = useState<number | null>(null)
  const [projects, setProjects] = useState(mockClientProjects)
  const [searchTerm, setSearchTerm] = useState("")

  const markMessageAsRead = (messageId: number) => {
    setMessages((prevMessages) =>
      prevMessages.map((message) => (message.id === messageId ? { ...message, read: true } : message)),
    )
    setUnreadCount((prevCount) => (prevCount > 0 ? prevCount - 1 : prevCount))
  }

  const filteredProjectsList = mockClientProjects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedMessageProject) {
      const mentions = newMessage.match(/@(\w+)/g)?.map((m) => m.substring(1)) || []
      const projectRefs = newMessage.match(/#[\w-]+/g)

      const newMessageObj = {
        id: messages.length + 1,
        sender: "client",
        senderName: "John Smith",
        text: newMessage,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isAdmin: false,
        mentions,
        projectRef: selectedMessageProject,
        projectTitle: projects.find((p) => p.id === selectedMessageProject)?.title,
        status: "sent",
        whatsappSync: showWhatsAppIntegration,
        attachments: [],
      }
      setMessages([...messages, newMessageObj])
      setNewMessage("")
      setSelectedMessageProject(null)

      if (showWhatsAppIntegration) {
        handleWhatsAppSync(newMessageObj)
      }
    }
  }

  const handleWhatsAppSync = (message: any) => {
    const phoneNumber = "+1234567890" // Admin's WhatsApp number
    const projectContext = message.projectTitle ? `[${message.projectTitle}] ` : ""
    const whatsappMessage = `${projectContext}${message.text}`
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`

    // In real implementation, this would use WhatsApp Business API
    console.log("Syncing to WhatsApp:", whatsappMessage)
  }

  const handleWhatsAppInvite = () => {
    const inviteMessage =
      "You've been invited to collaborate on a landscape design project! Join our project dashboard: https://app.sketchupplaystore.com/invite/abc123"
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(inviteMessage)}`
    window.open(whatsappUrl, "_blank")
  }

  const handleJoinWhatsAppGroup = () => {
    // In real implementation, this would be a dynamic group link
    const groupLink = "https://chat.whatsapp.com/invite/landscape-project-123"
    window.open(groupLink, "_blank")
  }

  const handleAdminReply = () => {
    if (adminReply.trim()) {
      const mentions = adminReply.match(/@(\w+)/g)?.map((m) => m.substring(1)) || []

      const newMessage = {
        id: messages.length + 1,
        sender: "admin",
        text: adminReply,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isAdmin: true,
        mentions,
        projectRef: selectedProjectForMessage,
        attachments: [],
      }
      setMessages([...messages, newMessage])
      setAdminReply("")
      setSelectedProjectForMessage(null)
    }
  }

  const handleFileAttachment = (type: "image" | "pdf" | "link") => {
    // Simulate file attachment
    console.log(`Attaching ${type} file`)
    setShowAttachmentMenu(false)
  }

  const handleProjectReference = (projectId: number) => {
    setSelectedProject(projectId)
    // Scroll to project
    const projectElement = document.getElementById(`project-${projectId}`)
    if (projectElement) {
      projectElement.scrollIntoView({ behavior: "smooth" })
    }
    // Open project chats and files
    setSelectedProjectForMessage(projectId)
  }

  const handleDownloadFile = (file: any) => {
    // Simulate file download
    const link = document.createElement("a")
    link.href = file.url || "/placeholder.svg"
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDownloadAllFiles = (projectFiles: any[]) => {
    // Simulate zip download
    console.log("Downloading all files as zip:", projectFiles)
    // In real implementation, this would create a zip file
  }

  const handleWhatsAppIntegration = () => {
    const phoneNumber = "+1234567890" // Admin's WhatsApp number
    const projectTitle = filteredProjectsList[0]?.title || "Project"
    const whatsappMessage = `Hi! I have a question about my landscape design project: ${projectTitle}`
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`
    window.open(whatsappUrl, "_blank")
  }

  const handleRemoveClient = (clientName: string) => {
    console.log(`Removing client: ${clientName}`)
  }

  const handleInviteClient = () => {
    console.log(`Inviting client via ${inviteMethod}: ${inviteEmail}`)
  }

  const handlePayPalPayment = () => {
    // Simulate PayPal payment
    console.log(`Processing PayPal payment of $${monthlyInvoiceAmount}`)
    // In real implementation, this would integrate with PayPal API
    setShowPayPalModal(false)
  }

  const handleSendInvoice = () => {
    // Simulate sending PayPal invoice
    console.log(`Sending PayPal invoice for $${monthlyInvoiceAmount} to client`)
    // In real implementation, this would send invoice via PayPal
  }

  const handleDownloadAllModels = () => {
    // Get all 3D model files from all projects
    const allModels = filteredProjectsList.flatMap((project) =>
      project.files.filter(
        (file) =>
          file.type === "sketchup" || file.name.includes("3d") || file.name.includes("model") || file.phase === "3D",
      ),
    )

    console.log("Downloading all 3D models:", allModels)
    // In real implementation, this would create a zip file with all 3D models

    // Simulate downloading each model
    allModels.forEach((model) => {
      const link = document.createElement("a")
      link.href = model.url || "/placeholder.svg"
      link.download = model.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })
  }

  const renderMessageText = (text: string, mentions: string[] = [], projectRef: number | null = null) => {
    let formattedText = text

    // Highlight mentions
    mentions.forEach((mention) => {
      formattedText = formattedText.replace(
        new RegExp(`@${mention}`, "g"),
        `<span class="bg-blue-100 text-blue-800 px-1 rounded text-xs font-medium cursor-pointer">@${mention}</span>`,
      )
    })

    if (projectRef) {
      const project = mockClientProjects.find((p) => p.id === projectRef)
      if (project) {
        const projectHash = `#${project.title
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "-")
          .substring(0, 20)}`
        formattedText = formattedText.replace(
          new RegExp(projectHash, "g"),
          `<span class="bg-green-100 text-green-800 px-1 rounded text-xs font-medium cursor-pointer hover:bg-green-200" onclick="handleProjectReference(${projectRef})">${projectHash}</span>`,
        )
      }
    }

    return <span dangerouslySetInnerHTML={{ __html: formattedText }} />
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
          variant="outline"
          className="text-slate-600 hover:bg-white hover:text-slate-800 rounded-xl px-3 h-8 text-xs transition-all duration-200 bg-white/80 backdrop-blur-sm border-slate-200 hover:shadow-sm"
          onClick={() => onRoleSwitch("designer")}
        >
          Designer
        </Button>
        <Button
          size="sm"
          variant="default"
          className="bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl px-4 h-8 shadow-lg hover:shadow-xl transition-all duration-200"
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

      <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Layers className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-slate-900">Client Dashboard</h1>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                >
                  <Home className="h-4 w-4 mr-1" />
                  Home
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                >
                  <Layers className="h-4 w-4 mr-1" />
                  My Projects
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/90 backdrop-blur-sm"
                />
              </div>

              <DarkModeToggle />

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-emerald-600" />
                </div>
                <span className="text-sm font-medium text-slate-700">Johnson Family</span>
              </div>

              <div className="flex gap-1">
                <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-700">
                  Admin
                </Button>
                <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-700">
                  Designer
                </Button>
                <Button variant="ghost" size="sm" className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100">
                  Client
                </Button>
                <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-700">
                  Logout
                </Button>
              </div>
            </div>
          </nav>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        <main className="flex-1 p-6">
          <div className="space-y-4">
            <div className="grid gap-4">
              {filteredProjectsList.map((project, index) => (
                <Card
                  key={project.id}
                  id={`project-${project.id}`}
                  className="border-white/50 bg-white/70 backdrop-blur-sm shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                            {project.title}
                          </h3>
                          {project.urgent && (
                            <Badge className="bg-gradient-to-r from-red-50 to-red-100 text-red-700 border-red-200/60 flex-shrink-0 animate-pulse shadow-sm">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Urgent
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-4 mb-3">
                          <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                          <div className="flex items-center gap-4 text-sm text-slate-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Due: {new Date(project.dueDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadAllFiles(project.files)}
                          className="border-white/60 hover:border-emerald-300 hover:bg-emerald-50 bg-white/90 backdrop-blur-sm h-9 px-4 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          <FolderDown className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedProject(selectedProject === project.id ? null : project.id)}
                          className="border-white/60 hover:border-emerald-300 hover:bg-emerald-50 bg-white/90 backdrop-blur-sm h-9 w-9 p-0 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {project.previews && project.previews.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-slate-700 mb-3">Project Previews</h4>
                        <div className="grid grid-cols-4 gap-3">
                          {project.previews.map((preview, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={preview.url || "/placeholder.svg"}
                                alt={`Preview ${index + 1}`}
                                className="w-full aspect-[4/3] object-cover rounded-lg border border-white/60 hover:border-emerald-300 transition-all cursor-pointer hover:shadow-lg shadow-sm"
                                onClick={() =>
                                  handleDownloadFile({ name: `preview-${index + 1}.jpg`, url: preview.url })
                                }
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent group-hover:from-black/40 transition-all rounded-lg flex items-center justify-center">
                                <Download className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                              </div>
                              <div className="absolute bottom-2 left-2 right-2">
                                <div className="bg-white/95 backdrop-blur-sm rounded px-2 py-1 text-xs font-medium text-slate-700 truncate opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                                  {preview.phase}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-slate-700">Project Progress</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-emerald-700">{project.progress}%</span>
                          <span className="text-xs text-slate-500">• {project.currentPhase}</span>
                        </div>
                      </div>
                      <Progress value={project.progress} className="h-3 bg-slate-100/80" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          <span className="font-medium">{project.files.length}</span>
                          <span>files available</span>
                        </div>
                      </div>
                      <div className="text-xs text-slate-500">
                        Started {new Date(project.startDate).toLocaleDateString()}
                      </div>
                    </div>

                    {selectedProject === project.id && (
                      <div className="mt-4 pt-4 border-t border-white/60 animate-slide-down">
                        <h4 className="font-medium mb-3 text-slate-900">Recent Updates</h4>
                        <div className="space-y-3">
                          {project.updates.map((update, index) => (
                            <div
                              key={index}
                              className={`flex ${update.status === "Complete" ? "justify-start" : "justify-end"}`}
                            >
                              <div
                                className={`max-w-[80%] p-3 rounded-xl transition-all duration-200 ${
                                  update.status === "Complete"
                                    ? "bg-white/90 border border-white/60 text-slate-900 backdrop-blur-sm shadow-sm"
                                    : "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-500/25"
                                }`}
                              >
                                <div className="text-sm">{update.note}</div>
                                <div className="text-xs opacity-75 mt-1">
                                  {new Date(update.date).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>

        <aside className="w-80 border-l border-white/20 bg-white/70 backdrop-blur-xl p-6">
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

              <div className="flex gap-2 mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowWhatsAppIntegration(!showWhatsAppIntegration)}
                  className={`gap-2 bg-white/50 backdrop-blur-sm border-slate-200 hover:bg-white hover:shadow-sm transition-all duration-200 rounded-xl ${
                    showWhatsAppIntegration ? "bg-green-50 border-green-300 text-green-700" : ""
                  }`}
                >
                  <Phone className="h-4 w-4" />
                  WhatsApp
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowInviteModal(true)}
                  className="gap-2 bg-white/50 backdrop-blur-sm border-slate-200 hover:bg-white hover:shadow-sm transition-all duration-200 rounded-xl"
                >
                  <UserPlus className="h-4 w-4" />
                  Invite
                </Button>
              </div>

              {showWhatsAppIntegration && (
                <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-green-100/50 border border-green-200 rounded-xl animate-slide-down backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">WhatsApp Integration</span>
                    <Badge className="bg-green-100 text-green-700 text-xs rounded-full px-2 py-1">Active</Badge>
                  </div>
                  <p className="text-sm text-green-700 mb-3">Messages will sync with your WhatsApp group</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleJoinWhatsAppGroup}
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 h-8 flex-1 text-xs shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl"
                    >
                      <Users className="h-3 w-3 mr-1" />
                      Join Group
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleWhatsAppSync}
                      className="border-green-200 hover:border-green-300 h-8 flex-1 text-xs bg-white/80 backdrop-blur-sm rounded-xl transition-all duration-200"
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      Sync Now
                    </Button>
                  </div>
                </div>
              )}

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
                  <option value="">Select project to message...</option>
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

          <Card className="border-white/60 bg-white/90 backdrop-blur-md shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shadow-sm">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">Admin Quick Reply</span>
                </div>
                <Badge variant="outline" className="h-6 border-emerald-200 text-emerald-700 bg-emerald-50">
                  2 new
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-slate-50/80 to-white/80 rounded-md backdrop-blur-sm shadow-sm">
                  <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">Milestone Completed</p>
                    <p className="text-sm text-slate-600">Design phase delivered</p>
                    <p className="text-sm text-slate-500">5 min ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-slate-50/80 to-white/80 rounded-md backdrop-blur-sm shadow-sm">
                  <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">Review Required</p>
                    <p className="text-sm text-slate-600">Final rendering needs approval</p>
                    <p className="text-sm text-slate-500">1 hour ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/60 bg-gradient-to-br from-slate-50/90 to-white/90 backdrop-blur-md shadow-lg">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 text-slate-900">Project Overview</h3>
              <div className="space-y-2">
                <div className="mb-4 p-3 bg-gradient-to-r from-blue-50/90 to-blue-100/80 border border-blue-200/60 rounded-lg backdrop-blur-sm shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-800">Monthly Invoice</span>
                  </div>
                  <p className="text-sm text-blue-700 mb-3">Invoice amount: ${monthlyInvoiceAmount}</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => setShowPayPalModal(true)}
                      className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 h-8 flex-1 shadow-sm"
                    >
                      <DollarSign className="h-4 w-4 mr-1" />
                      Pay ${monthlyInvoiceAmount}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSendInvoice}
                      className="border-emerald-200 hover:border-emerald-300 h-8 flex-1 bg-white/90 backdrop-blur-sm"
                    >
                      Request Invoice
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/90 rounded-md border border-white/60 backdrop-blur-sm shadow-sm">
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Total Projects</p>
                    <p className="text-lg font-semibold text-slate-900">{filteredProjectsList.length}</p>
                  </div>
                  <Home className="h-4 w-4 text-slate-400" />
                </div>
                <div className="flex items-center justify-between p-3 bg-white/90 rounded-md border border-white/60 backdrop-blur-sm shadow-sm">
                  <div>
                    <p className="text-sm text-slate-500 font-medium">In Progress</p>
                    <p className="text-lg font-semibold text-slate-900">
                      {filteredProjectsList.filter((p) => p.status === "In Progress").length}
                    </p>
                  </div>
                  <Clock className="h-4 w-4 text-slate-400" />
                </div>
                <div className="flex items-center justify-between p-3 bg-white/90 rounded-md border border-white/60 backdrop-blur-sm shadow-sm">
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Total Earnings</p>
                    <p className="text-lg font-semibold text-emerald-700">
                      ${filteredProjectsList.reduce((sum, p) => sum + p.totalPrice, 0)}
                    </p>
                  </div>
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      {showAddProjectModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">New Project</h2>
                  <p className="text-slate-600 mt-1">Submit project details for admin review</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddProjectModal(false)}
                  className="rounded-full h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Project Address *</label>
                    <Input
                      value={newProject.title}
                      onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                      placeholder="123 Oak Street, Beverly Hills, CA"
                      className="border-slate-200 focus:border-emerald-400 focus:ring-emerald-400/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Due Date</label>
                    <Input
                      type="date"
                      value={newProject.timeline}
                      onChange={(e) => setNewProject({ ...newProject, timeline: e.target.value })}
                      className="border-slate-200 focus:border-emerald-400 focus:ring-emerald-400/20"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">Project Area *</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={newProject.frontyard}
                          onChange={(e) => setNewProject({ ...newProject, frontyard: e.target.checked })}
                          className="rounded border-slate-200 focus:border-emerald-400"
                        />
                        <span className="text-sm font-medium text-slate-700">Frontyard</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={newProject.backyard}
                          onChange={(e) => setNewProject({ ...newProject, backyard: e.target.checked })}
                          className="rounded border-slate-200 focus:border-emerald-400"
                        />
                        <span className="text-sm font-medium text-slate-700">Backyard</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">Services Needed</label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={newProject.needs3D}
                          onChange={(e) => {
                            const checked = e.target.checked
                            setNewProject({
                              ...newProject,
                              needs3D: checked,
                              // Auto-select 2D when 3D is selected
                              needs2D: checked ? true : newProject.needs2D,
                            })
                          }}
                          className="rounded border-slate-200 focus:border-emerald-400"
                        />
                        <span className="text-sm font-medium text-slate-700">3D Design</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={newProject.needs2D}
                          onChange={(e) => setNewProject({ ...newProject, needs2D: e.target.checked })}
                          className="rounded border-slate-200 focus:border-emerald-400"
                        />
                        <span className="text-sm font-medium text-slate-700">2D Plans</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={newProject.needsHOA}
                          onChange={(e) => setNewProject({ ...newProject, needsHOA: e.target.checked })}
                          className="rounded border-slate-200 focus:border-emerald-400"
                        />
                        <span className="text-sm font-medium text-slate-700">HOA Approval</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={newProject.needsPermit}
                          onChange={(e) => setNewProject({ ...newProject, needsPermit: e.target.checked })}
                          className="rounded border-slate-200 focus:border-emerald-400"
                        />
                        <span className="text-sm font-medium text-slate-700">Building Permit</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
