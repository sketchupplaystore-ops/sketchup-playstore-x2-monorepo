"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Clock,
  Eye,
  CheckCircle,
  MessageSquare,
  FileText,
  Download,
  Upload,
  User,
  Building,
  Target,
  Activity,
  Edit,
} from "lucide-react"

interface Project {
  id: number
  title: string
  client: string
  status: string
  dueDate: string
  assignee: string
  progress: number
  totalValue: number
  currentPhase: string
  avatar: string
}

interface ProjectDetailProps {
  project: Project
  onBack: () => void
}

const milestones = [
  {
    phase: "Archicad",
    price: 2.5,
    status: "completed",
    description: "Initial architectural design and site planning",
    deliverables: ["Site analysis", "Conceptual design", "2D floor plans"],
  },
  {
    phase: "SketchUp",
    price: 10,
    status: "in-progress",
    description: "3D modeling and visualization",
    deliverables: ["3D model", "Material application", "Basic lighting"],
  },
  {
    phase: "Lumion",
    price: 2.5,
    status: "pending",
    description: "Final rendering and animation",
    deliverables: ["High-quality renders", "Walkthrough animation", "Final presentation"],
  },
]

const revisionHistory = [
  {
    id: 1,
    version: "v2.1",
    date: "2024-01-12",
    author: "Sarah Wilson",
    changes: "Updated material textures and lighting in SketchUp model",
    type: "revision",
  },
  {
    id: 2,
    version: "v2.0",
    date: "2024-01-10",
    author: "John Smith",
    changes: "Client requested changes to plant selection and pathway design",
    type: "client-feedback",
  },
  {
    id: 3,
    version: "v1.5",
    date: "2024-01-08",
    author: "Sarah Wilson",
    changes: "Completed initial SketchUp 3D modeling phase",
    type: "milestone",
  },
]

const activityLog = [
  {
    id: 1,
    action: "File uploaded",
    description: "SketchUp_Garden_v2.1.skp",
    user: "Sarah Wilson",
    timestamp: "2024-01-12 14:30",
    type: "file",
  },
  {
    id: 2,
    action: "Comment added",
    description: "Please review the updated plant placement",
    user: "Sarah Wilson",
    timestamp: "2024-01-12 14:25",
    type: "comment",
  },
  {
    id: 3,
    action: "Status changed",
    description: "From 'In Review' to 'In Progress'",
    user: "Mike Johnson",
    timestamp: "2024-01-12 09:15",
    type: "status",
  },
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case "in-progress":
      return <Clock className="h-4 w-4 text-yellow-600" />
    case "pending":
      return <Eye className="h-4 w-4 text-gray-400" />
    default:
      return <Clock className="h-4 w-4" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 border-green-200"
    case "in-progress":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "pending":
      return "bg-gray-100 text-gray-600 border-gray-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export function ProjectDetail({ project, onBack }: ProjectDetailProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [newComment, setNewComment] = useState("")

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
            <Separator orientation="vertical" className="h-6" />
            <h1 className="text-xl font-semibold text-balance">{project.title}</h1>
            <Badge className={`gap-1 ${getStatusColor(project.status.toLowerCase().replace(" ", "-"))}`}>
              {project.status}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Edit className="h-4 w-4" />
              Edit Project
            </Button>
            <Button size="sm" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Add Comment
            </Button>
          </div>
        </div>
      </header>

      <main className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="milestones">Milestones</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-0">
                <Card className="border-border/50 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-balance">Project Brief</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="prose prose-sm max-w-none">
                      <p className="text-muted-foreground leading-relaxed">
                        Design a comprehensive landscape solution for a residential garden space. The project involves
                        creating a modern, sustainable outdoor environment that incorporates native plants, water
                        features, and functional outdoor living areas. The design should complement the existing
                        architecture while providing year-round visual interest and low maintenance requirements.
                      </p>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <h4 className="font-medium text-balance">Project Requirements</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-center gap-2">
                            <Target className="h-3 w-3" />
                            Native plant integration
                          </li>
                          <li className="flex items-center gap-2">
                            <Target className="h-3 w-3" />
                            Water feature design
                          </li>
                          <li className="flex items-center gap-2">
                            <Target className="h-3 w-3" />
                            Outdoor seating areas
                          </li>
                          <li className="flex items-center gap-2">
                            <Target className="h-3 w-3" />
                            Sustainable materials
                          </li>
                        </ul>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium text-balance">Deliverables</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-center gap-2">
                            <FileText className="h-3 w-3" />
                            Architectural drawings
                          </li>
                          <li className="flex items-center gap-2">
                            <FileText className="h-3 w-3" />
                            3D visualizations
                          </li>
                          <li className="flex items-center gap-2">
                            <FileText className="h-3 w-3" />
                            Material specifications
                          </li>
                          <li className="flex items-center gap-2">
                            <FileText className="h-3 w-3" />
                            Final renderings
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="milestones" className="mt-0">
                <div className="space-y-4">
                  {milestones.map((milestone, index) => (
                    <Card key={milestone.phase} className="border-border/50 shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(milestone.status)}
                            <div>
                              <h3 className="font-semibold text-balance">{milestone.phase}</h3>
                              <p className="text-sm text-muted-foreground">{milestone.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">${milestone.price}</p>
                            <Badge className={getStatusColor(milestone.status)} size="sm">
                              {milestone.status.replace("-", " ")}
                            </Badge>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Deliverables:</h4>
                          <ul className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            {milestone.deliverables.map((deliverable, idx) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-600" />
                                {deliverable}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="files" className="mt-0">
                <Card className="border-border/50 shadow-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-balance">Project Files</CardTitle>
                      <Button size="sm" className="gap-2">
                        <Upload className="h-4 w-4" />
                        Upload File
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { name: "SketchUp_Garden_v2.1.skp", size: "15.2 MB", type: "SketchUp", date: "Jan 12, 2024" },
                        { name: "Site_Analysis.pdf", size: "3.4 MB", type: "PDF", date: "Jan 10, 2024" },
                        { name: "Plant_Schedule.xlsx", size: "1.2 MB", type: "Excel", date: "Jan 8, 2024" },
                        { name: "Concept_Sketches.jpg", size: "2.8 MB", type: "Image", date: "Jan 5, 2024" },
                      ].map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="h-8 w-8 text-muted-foreground" />
                            <div>
                              <p className="font-medium text-balance">{file.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {file.size} • {file.type} • {file.date}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="gap-2">
                            <Download className="h-4 w-4" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="mt-0">
                <Card className="border-border/50 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-balance">Activity Log</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activityLog.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-start gap-3 pb-4 border-b border-border last:border-0"
                        >
                          <Activity className="h-4 w-4 text-muted-foreground mt-1" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm">
                              <span className="font-medium">{activity.user}</span> {activity.action.toLowerCase()}
                            </p>
                            <p className="text-sm text-muted-foreground">{activity.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Info */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-balance">Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Client</p>
                    <p className="text-sm text-muted-foreground">{project.client}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Due Date</p>
                    <p className="text-sm text-muted-foreground">{new Date(project.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Assignee</p>
                    <p className="text-sm text-muted-foreground">{project.assignee}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Total Value</p>
                    <p className="text-sm text-muted-foreground">${project.totalValue}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium mb-2">Progress</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>{project.currentPhase}</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Revision History */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-balance">Recent Revisions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {revisionHistory.slice(0, 3).map((revision) => (
                    <div key={revision.id} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{revision.version}</p>
                        <p className="text-xs text-muted-foreground">{revision.date}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{revision.changes}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-balance">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full gap-2 bg-transparent">
                  <MessageSquare className="h-4 w-4" />
                  Add Comment
                </Button>
                <Button variant="outline" size="sm" className="w-full gap-2 bg-transparent">
                  <Upload className="h-4 w-4" />
                  Upload File
                </Button>
                <Button variant="outline" size="sm" className="w-full gap-2 bg-transparent">
                  <Edit className="h-4 w-4" />
                  Update Status
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
