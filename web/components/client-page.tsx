"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { useMilestoneFiles, formatFileSize } from "@/lib/hooks"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api, type Project, type Message, type CreateMessageInput, type Milestone } from "@/lib/api"
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

// Define extended project type with UI-specific fields
type UIProject = {
  id: number;
  title: string;
  status: string;
  dueDate: string;
  progress: number;
  currentPhase: string;
  urgent: boolean;
  files: UIFile[];
  milestones?: Milestone[];
  clientPricing: {
    type3D: { selected: boolean; price: number };
    type2D: { selected: boolean; price: number };
  };
  totalPrice: number;
  startDate: string;
  previews: UIPreview[];
  updates: UIUpdate[];
  clientName: string;
};

type UIFile = {
  name: string;
  type: string;
  size: string;
  phase?: string;
  url: string;
};

type UIPreview = {
  url: string;
  type: string;
  phase: string;
};

type UIUpdate = {
  date: string;
  phase: string;
  note: string;
  status: string;
};

// Function to calculate progress based on completed milestones
const calculateProgress = (milestones: Milestone[] = []) => {
  if (!milestones || milestones.length === 0) return 0;
  const completedCount = milestones.filter(m => m.completed).length;
  return Math.round((completedCount / milestones.length) * 100);
};

// Function to determine current phase based on milestones
const determineCurrentPhase = (milestones: any[] = []) => {
  if (!milestones || milestones.length === 0) return "Planning";
  
  // Find the first non-completed milestone
  const inProgressMilestone = milestones.find(m => !m.completed);
  if (inProgressMilestone) return inProgressMilestone.name;
  
  // If all completed, return the last milestone name
  return milestones[milestones.length - 1].name;
};

// Map API projects to UI projects
const mapApiToUiProject = (project: Project): UIProject => {
  // Calculate progress based on milestones
  const progress = project.progress || calculateProgress(project.milestones);
  
  // Determine current phase
  const currentPhase = determineCurrentPhase(project.milestones);
  
  // Map files to previews based on type
  const previews = (project.files || []).map(file => {
    // Determine preview type based on file type
    let previewType = "plan";
    if (file.type.includes("image") || file.name.includes(".jpg") || file.name.includes(".png")) {
      previewType = "render";
    } else if (file.type.includes("sketchup") || file.name.includes(".skp")) {
      previewType = "model";
    }
    
    return {
      url: file.url,
      type: previewType,
      phase: file.phase || currentPhase
    };
  });
  
  // Create updates based on milestones
  const updates = (project.milestones || []).map(milestone => ({
    date: new Date().toISOString().split('T')[0], // Use current date as fallback
    phase: milestone.name,
    note: `${milestone.name} ${milestone.completed ? 'completed' : 'in progress'}`,
    status: milestone.completed ? 'Complete' : 'In Progress'
  }));
  
  return {
    id: project.id,
    title: project.title,
    status: project.status || "In Progress",
    dueDate: project.due_date || new Date().toISOString().split('T')[0],
    progress,
    currentPhase,
    urgent: false, // Default value
    files: (project.files || []).map(file => ({
      name: file.name,
      type: file.type,
      size: file.size,
      phase: file.phase || currentPhase,
      url: file.url
    })),
    milestones: project.milestones,
    clientPricing: {
      type3D: { selected: true, price: 150 },
      type2D: { selected: false, price: 35 }
    },
    totalPrice: project.budget || 150,
    startDate: new Date().toISOString().split('T')[0], // Default to current date
    previews: previews.length > 0 ? previews : [
      { url: "/landscape-render.jpg", type: "render", phase: currentPhase }
    ],
    updates: updates.length > 0 ? updates : [
      {
        date: new Date().toISOString().split('T')[0],
        phase: currentPhase,
        note: `Project ${currentPhase} in progress`,
        status: "In Progress"
      }
    ],
    clientName: project.client_name || "Johnson Family"
  };
};

// Component to display project files
interface ProjectFilesProps {
  projectId: number;
  milestoneId?: number | string;
}

// Component to display preview images
interface PreviewImagesSectionProps {
  projectId: number;
  milestoneId?: number | string;
}

function ProjectFiles({ projectId, milestoneId }: ProjectFilesProps) {
  const { data: files = [], isLoading, isError } = useMilestoneFiles(milestoneId);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-600 mr-2"></div>
        <span className="text-sm text-emerald-600">Loading files...</span>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-red-600">Failed to load files</p>
      </div>
    );
  }
  
  if (files.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-slate-500">No files available yet</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      {files.map(file => (
        <div key={file.id} className="flex items-center gap-2 p-2 bg-white/80 rounded-lg border border-slate-200 hover:shadow-sm transition-all duration-200">
          <FileText className="h-4 w-4 text-slate-600" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">{file.name}</p>
            <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.open(file.url, "_blank")}
            className="h-7 w-7 p-0 rounded-lg"
          >
            <Download className="h-3 w-3" />
          </Button>
        </div>
      ))}
    </div>
  );
}

function PreviewImagesSection({ projectId, milestoneId }: PreviewImagesSectionProps) {
  const { data: files = [], isLoading, isError } = useMilestoneFiles(milestoneId);
  
  // Filter for image files only
  const imageFiles = files.filter(file => 
    file.content_type.includes('image') || 
    file.name.toLowerCase().includes('.jpg') || 
    file.name.toLowerCase().includes('.png') || 
    file.name.toLowerCase().includes('.jpeg')
  );
  
  if (isLoading) {
    return (
      <div className="mb-4">
        <h4 className="text-sm font-medium text-slate-700 mb-3">Project Previews</h4>
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-600 mr-2"></div>
          <span className="text-sm text-emerald-600">Loading previews...</span>
        </div>
      </div>
    );
  }
  
  if (isError) {
    return null;
  }
  
  if (imageFiles.length === 0) {
    return null;
  }
  
  return (
    <div className="mb-4">
      <h4 className="text-sm font-medium text-slate-700 mb-3">Project Previews</h4>
      <div className="grid grid-cols-4 gap-3">
        {imageFiles.map((file, index) => (
          <div key={file.id} className="relative group">
            <img
              src={file.url || "/placeholder.svg"}
              alt={file.name}
              className="w-full aspect-[4/3] object-cover rounded-lg border border-white/60 hover:border-emerald-300 transition-all cursor-pointer hover:shadow-lg shadow-sm"
              onClick={() => window.open(file.url, "_blank")}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent group-hover:from-black/40 transition-all rounded-lg flex items-center justify-center">
              <Download className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
            </div>
            <div className="absolute bottom-2 left-2 right-2">
              <div className="bg-white/95 backdrop-blur-sm rounded px-2 py-1 text-xs font-medium text-slate-700 truncate opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                {file.name}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

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
  const queryClient = useQueryClient();
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
  
  // Fetch client projects from API
  const { data: apiProjects = [], isLoading: isLoadingProjects } = useQuery({
    queryKey: ["clientProjects"],
    queryFn: api.listByClient,
  })
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
  
  // Map API projects to UI projects
  const projects: UIProject[] = apiProjects.map(mapApiToUiProject);
  
  // Set up messages query for selected project
  const { data: apiMessages = [], isLoading: isLoadingMessages } = useQuery({
    queryKey: ["projectMessages", selectedProject],
    queryFn: () => selectedProject ? api.listMessages(selectedProject) : Promise.resolve([]),
    enabled: !!selectedProject,
  })
  
  // Create message mutation
  const createMessageMutation = useMutation({
    mutationFn: (input: CreateMessageInput) => api.createMessage(input),
    onSuccess: () => {
      // Invalidate messages query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["projectMessages", selectedProject] })
    },
  })
  
  // Format API messages to UI format
  const messages = apiMessages.map(msg => ({
    id: msg.id,
    sender: msg.sender_type,
    senderName: msg.sender_name,
    text: msg.text,
    time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isAdmin: msg.sender_type === 'admin',
    mentions: msg.mentions || [],
    projectRef: msg.project_id,
    projectTitle: projects.find(p => p.id === msg.project_id)?.title || '',
    status: msg.status || 'read',
    whatsappSync: true,
  }));

  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  
  // Initialize filtered projects
  const filteredProjectsList = projects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const markMessageAsRead = (messageId: number) => {
    // In a real implementation, this would call an API to mark the message as read
    setUnreadCount((prevCount) => (prevCount > 0 ? prevCount - 1 : prevCount))
  }

  // We don't need this anymore since we have the filtered list defined above

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedProject) {
      // Create message input for API
      const messageInput: CreateMessageInput = {
        project_id: selectedProject,
        text: newMessage,
      };
      
      // Send message using API
      createMessageMutation.mutate(messageInput);
      
      // Clear input and reset selection
      setNewMessage("");
      
      // Optionally sync with WhatsApp
      if (showWhatsAppIntegration) {
        handleWhatsAppSync({
          text: newMessage,
          projectTitle: projects.find((p) => p.id === selectedProject)?.title
        });
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
      setMessage("")  // Clear the message input after sending
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
      // TODO: Replace with actual projects data source - using apiProjects for now
      const project = apiProjects.find((p: any) => p.id === projectRef)
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
            {isLoadingProjects ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mr-3"></div>
                <span className="text-slate-600">Loading your projects...</span>
              </div>
            ) : filteredProjectsList.length === 0 ? (
              <div className="text-center py-12">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 mx-auto mb-4">
                  <FileText className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">No Projects Found</h3>
                <p className="text-slate-500">We couldn&apos;t find any projects matching your search.</p>
              </div>
            ) : (
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

                    {/* Preview Images Section */}
                    <PreviewImagesSection projectId={project.id} milestoneId={project.milestones?.[0]?.id} />

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

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          <span>Project Files</span>
                        </div>
                      </div>
                      <div className="text-xs text-slate-500">
                        Started {new Date(project.startDate).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <ProjectFiles 
                      projectId={project.id}
                      milestoneId={project.milestones?.[0]?.id}
                    />

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
            )}
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
                {isLoadingMessages ? (
                  <div className="flex items-center justify-center p-4">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-600 mr-2"></div>
                    <span className="text-sm text-slate-600">Loading messages...</span>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center p-4">
                    <p className="text-sm text-slate-500">No messages yet</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-muted/50 ${
                        message.status === "unread" ? "bg-primary/5 border-l-2 border-primary" : "bg-muted/30"
                      }`}
                      onClick={() => markMessageAsRead(message.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-card-foreground capitalize">{message.senderName}</p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{message.text}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{message.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="space-y-2">
                <select
                  value={selectedProject || ""}
                  onChange={(e) => setSelectedProject(Number(e.target.value))}
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
                    disabled={!newMessage.trim() || !selectedProject}
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
