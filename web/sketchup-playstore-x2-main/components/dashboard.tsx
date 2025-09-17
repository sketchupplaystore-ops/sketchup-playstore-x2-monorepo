"use client"

import { useState } from "react"
import { SettingsPanel } from "./settings-panel"
import { AdminPage } from "./admin-page"
import { DesignerPage } from "./designer-page"
import { ClientPage } from "./client-page"
import { LoginPage } from "./login-page"
import { LandingPage } from "./landing-page"
import { SketchUpPlaystore } from "./sketchup-playstore"
import { ModelsPage } from "./models-page"
import { FreeDownloadsPage } from "./free-downloads-page"
import { PublicModelsLibrary } from "./public-models-library"

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
    budget: 15,
    createdBy: "Admin",
    createdAt: "2024-01-10",
    thumbnail: "/3d-garden-model.jpg",
    earnings: { archicad: 2.5, sketchup: 10, rendering: 2.5 },
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
    budget: 15,
    createdBy: "Admin",
    createdAt: "2024-01-05",
    thumbnail: "/landscape-render.jpg",
    earnings: { archicad: 2.5, sketchup: 10, rendering: 2.5 },
  },
  {
    id: 3,
    title: "789 Maple Ave, Pasadena, CA",
    address: "789 Maple Ave, Pasadena, CA",
    client: "Smith Family",
    status: "Final Rendering",
    dueDate: "2024-01-25",
    assignee: "Mike Johnson",
    progress: 85,
    currentPhase: "Final Rendering",
    files: [
      { name: "concept-video.mp4", type: "video", size: "45.2 MB" },
      { name: "sketchup-model.skp", type: "file", size: "8.7 MB" },
      { name: "material-specs.pdf", type: "pdf", size: "2.1 MB" },
    ],
    budget: 15,
    createdBy: "Admin",
    createdAt: "2023-12-20",
    thumbnail: "/3d-animation-preview.jpg",
    earnings: { archicad: 2.5, sketchup: 10, rendering: 2.5 },
  },
]

export function Dashboard() {
  const [currentPage, setCurrentPage] = useState("landing")
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleLogin = (role: "admin" | "designer" | "client", userData: any) => {
    setCurrentUser({ ...userData, role })
    setIsAuthenticated(true)
    setCurrentPage("dashboard")
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setIsAuthenticated(false)
    setCurrentPage("dashboard")
  }

  const handleNavigate = (page: string) => {
    setCurrentPage(page)
  }

  const handleRoleSwitch = (role: "admin" | "designer" | "client") => {
    setCurrentUser({ ...currentUser, role })
    setCurrentPage("dashboard")
  }

  const handleGetStarted = (role: "admin" | "designer" | "client" | "models" | "free-downloads" | "public-models") => {
    if (role === "models") {
      setCurrentPage("models")
      return
    }
    if (role === "free-downloads") {
      setCurrentPage("free-downloads")
      return
    }
    if (role === "public-models") {
      setCurrentPage("public-models")
      return
    }
    setCurrentUser({ role })
    setIsAuthenticated(true)
    setCurrentPage("dashboard")
  }

  if (currentPage === "landing") {
    return <LandingPage onGetStarted={handleGetStarted} />
  }

  if (currentPage === "public-models") {
    return <PublicModelsLibrary currentUser={currentUser} onNavigateHome={() => setCurrentPage("landing")} />
  }

  if (!isAuthenticated && currentPage !== "models" && currentPage !== "free-downloads" && currentPage !== "playstore") {
    return <LoginPage onLogin={handleLogin} />
  }

  if (currentPage === "settings") {
    return <SettingsPanel onBack={() => setCurrentPage("dashboard")} />
  }

  if (currentPage === "playstore") {
    return <SketchUpPlaystore />
  }

  if (currentPage === "models") {
    return <ModelsPage onNavigate={handleNavigate} />
  }

  if (currentPage === "free-downloads") {
    return <FreeDownloadsPage onNavigate={handleNavigate} />
  }

  if (currentUser?.role === "admin") {
    return <AdminPage onNavigate={handleNavigate} onRoleSwitch={handleRoleSwitch} onLogout={handleLogout} />
  }

  if (currentUser?.role === "designer") {
    return <DesignerPage onNavigate={handleNavigate} onRoleSwitch={handleRoleSwitch} onLogout={handleLogout} />
  }

  if (currentUser?.role === "client") {
    return <ClientPage onNavigate={handleNavigate} onRoleSwitch={handleRoleSwitch} onLogout={handleLogout} />
  }

  return null
}
